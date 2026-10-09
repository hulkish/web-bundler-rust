//! Decide which modules and exports survive into the bundle.
//!
//! Packages that set `"sideEffects": false` only keep exports something
//! actually reads. Function and class exports that nothing references are
//! dropped from every other module too.

use std::collections::{HashMap, HashSet, VecDeque};

use oxc_span::Span;

use crate::analyze::{Analysis, ImportEdge};
use crate::resolve::Resolved;

#[derive(Debug, Clone)]
enum Need {
    All,
    Names(HashSet<String>),
}

#[derive(Debug, Clone)]
pub struct ModuleKeep {
    pub included: bool,
    /// `None` keeps every export. `Some` is the set that must stay.
    pub exports: Option<HashSet<String>>,
    pub deps: HashSet<usize>,
    pub reason: String,
}

pub fn shake(modules: &[ModuleView<'_>], entries: &[usize]) -> Vec<ModuleKeep> {
    let mut need = vec![None; modules.len()];
    let mut reasons = vec![String::new(); modules.len()];
    let mut queue = VecDeque::new();
    for (index, id) in entries.iter().copied().enumerate() {
        reasons[id] = "entry".to_string();
        queue.push_back((id, Need::All, reasons[id].clone()));
        let _ = index;
    }

    while let Some((id, incoming, reason)) = queue.pop_front() {
        if !merge(&mut need[id], incoming) {
            continue;
        }
        if reasons[id].is_empty() {
            reasons[id] = reason;
        }
        let Some(current) = need[id].clone() else {
            continue;
        };
        let module = &modules[id];
        let selective =
            !module.side_effects && !entries.contains(&id) && matches!(current, Need::Names(_));
        if selective {
            let Need::Names(names) = &current else {
                continue;
            };
            enqueue_selective(module, names, &mut queue);
        } else {
            enqueue_all(module, &mut queue);
        }
    }

    modules
        .iter()
        .enumerate()
        .map(|(id, module)| {
            let included = need[id].is_some();
            let exports = match &need[id] {
                Some(Need::Names(names)) if !entries.contains(&id) => Some(names.clone()),
                _ => None,
            };
            let deps = if included {
                deps_for(module, exports.as_ref(), entries.contains(&id))
            } else {
                HashSet::new()
            };
            let reason = if included {
                reasons[id].clone()
            } else if module.side_effects {
                "omitted (not imported)".to_string()
            } else {
                "omitted (unused export, sideEffects: false)".to_string()
            };
            ModuleKeep {
                included,
                exports,
                deps,
                reason,
            }
        })
        .collect()
}

fn merge(slot: &mut Option<Need>, incoming: Need) -> bool {
    match slot {
        None => {
            *slot = Some(incoming);
            true
        }
        Some(Need::All) => false,
        Some(Need::Names(have)) => match incoming {
            Need::All => {
                *slot = Some(Need::All);
                true
            }
            Need::Names(extra) => {
                let before = have.len();
                have.extend(extra);
                have.len() != before
            }
        },
    }
}

fn enqueue_all(module: &ModuleView<'_>, queue: &mut VecDeque<(usize, Need, String)>) {
    let reason = format!("imported by {}", module.label);
    for edge in &module.analysis.edges {
        match edge {
            ImportEdge::Eval(dep) | ImportEdge::All(dep) | ImportEdge::Dynamic(dep) => {
                if let Some(id) = module.local_id(*dep) {
                    queue.push_back((id, Need::All, reason.clone()));
                }
            }
            ImportEdge::Names(dep, names) => {
                if let Some(id) = module.local_id(*dep) {
                    queue.push_back((
                        id,
                        Need::Names(names.iter().cloned().collect()),
                        reason.clone(),
                    ));
                }
            }
            ImportEdge::Reexport {
                dependency,
                imported,
                ..
            } => {
                if let Some(id) = module.local_id(*dependency) {
                    queue.push_back((
                        id,
                        Need::Names(HashSet::from([imported.clone()])),
                        format!("re-exported by {}", module.label),
                    ));
                }
            }
            ImportEdge::Star(dep)
            | ImportEdge::StarAs {
                dependency: dep, ..
            } => {
                if let Some(id) = module.local_id(*dep) {
                    queue.push_back((id, Need::All, format!("re-exported by {}", module.label)));
                }
            }
        }
    }
}

fn enqueue_selective(
    module: &ModuleView<'_>,
    names: &HashSet<String>,
    queue: &mut VecDeque<(usize, Need, String)>,
) {
    let reason = format!("imported by {}", module.label);
    for edge in &module.analysis.edges {
        match edge {
            ImportEdge::Reexport {
                dependency,
                exported,
                imported,
            } => {
                if names.contains(exported) {
                    if let Some(id) = module.local_id(*dependency) {
                        queue.push_back((
                            id,
                            Need::Names(HashSet::from([imported.clone()])),
                            format!("re-exported by {}", module.label),
                        ));
                    }
                }
            }
            ImportEdge::Star(dep) => {
                if let Some(id) = module.local_id(*dep) {
                    queue.push_back((id, Need::Names(names.clone()), reason.clone()));
                }
            }
            ImportEdge::StarAs {
                dependency,
                exported,
            } => {
                if names.contains(exported) {
                    if let Some(id) = module.local_id(*dependency) {
                        queue.push_back((id, Need::All, reason.clone()));
                    }
                }
            }
            ImportEdge::Eval(_) => {}
            ImportEdge::All(dep) | ImportEdge::Dynamic(dep) => {
                if live_dependency(module.analysis, *dep, names) {
                    if let Some(id) = module.local_id(*dep) {
                        queue.push_back((id, Need::All, reason.clone()));
                    }
                }
            }
            ImportEdge::Names(dep, imported) => {
                let mut kept = HashSet::new();
                for name in imported {
                    if live_name(module.analysis, *dep, name, names) {
                        kept.insert(name.clone());
                    }
                }
                for pure in &module.analysis.pure_exports {
                    if names.contains(&pure.name) || pure.locally_used {
                        for (dependency, imported_name) in &pure.deps {
                            if *dependency == *dep && imported_name != "*" {
                                kept.insert(imported_name.clone());
                            }
                        }
                    }
                }
                if !kept.is_empty() {
                    if let Some(id) = module.local_id(*dep) {
                        queue.push_back((id, Need::Names(kept), reason.clone()));
                    }
                }
            }
        }
    }
    for pure in &module.analysis.pure_exports {
        if !(names.contains(&pure.name) || pure.locally_used) {
            continue;
        }
        for (dependency, imported) in &pure.deps {
            if imported == "*" {
                if let Some(id) = module.local_id(*dependency) {
                    queue.push_back((id, Need::All, reason.clone()));
                }
            }
        }
    }
}

fn deps_for(
    module: &ModuleView<'_>,
    exports: Option<&HashSet<String>>,
    entry: bool,
) -> HashSet<usize> {
    if entry || exports.is_none() || module.side_effects {
        return module
            .analysis
            .dependencies
            .iter()
            .enumerate()
            .map(|(index, _)| index)
            .filter(|index| module.local_id(*index).is_some() || module.is_external(*index))
            .collect();
    }
    let names = exports.unwrap();
    let mut deps = HashSet::new();
    for edge in &module.analysis.edges {
        match edge {
            ImportEdge::Reexport {
                dependency,
                exported,
                ..
            } if names.contains(exported) => {
                deps.insert(*dependency);
            }
            ImportEdge::Star(dependency) => {
                deps.insert(*dependency);
            }
            ImportEdge::StarAs {
                dependency,
                exported,
            } if names.contains(exported) => {
                deps.insert(*dependency);
            }
            ImportEdge::All(dependency) | ImportEdge::Dynamic(dependency)
                if live_dependency(module.analysis, *dependency, names) =>
            {
                deps.insert(*dependency);
            }
            ImportEdge::Names(dependency, _)
                if module.analysis.expression_edits.iter().any(|edit| {
                    edit.dependency() == Some(*dependency)
                        && edit_is_live(module.analysis, edit.span(), names)
                }) =>
            {
                deps.insert(*dependency);
            }
            _ => {}
        }
    }
    for pure in &module.analysis.pure_exports {
        if names.contains(&pure.name) || pure.locally_used {
            for (dependency, _) in &pure.deps {
                deps.insert(*dependency);
            }
        }
    }
    deps
}

fn live_dependency(analysis: &Analysis, dependency: usize, names: &HashSet<String>) -> bool {
    analysis.expression_edits.iter().any(|edit| {
        edit.dependency() == Some(dependency) && edit_is_live(analysis, edit.span(), names)
    }) || analysis.pure_exports.iter().any(|pure| {
        (names.contains(&pure.name) || pure.locally_used)
            && pure.deps.iter().any(|(dep, _)| *dep == dependency)
    })
}

fn live_name(analysis: &Analysis, dependency: usize, name: &str, needed: &HashSet<String>) -> bool {
    analysis.expression_edits.iter().any(|edit| {
        edit.dependency() == Some(dependency)
            && edit
                .imported_name()
                .is_some_and(|imported| imported == name || imported == "*")
            && edit_is_live(analysis, edit.span(), needed)
    }) || analysis.pure_exports.iter().any(|pure| {
        (needed.contains(&pure.name) || pure.locally_used)
            && pure
                .deps
                .iter()
                .any(|(dep, imported)| *dep == dependency && (imported == name || imported == "*"))
    })
}

fn edit_is_live(analysis: &Analysis, span: Span, needed: &HashSet<String>) -> bool {
    let in_dropped_pure = analysis.pure_exports.iter().any(|pure| {
        !pure.locally_used
            && !needed.contains(&pure.name)
            && span.start >= pure.span.start
            && span.end <= pure.span.end
    });
    if in_dropped_pure {
        return false;
    }
    let in_unused_reexport = analysis.reexport_spans.iter().any(|(name, export_span)| {
        !needed.contains(name) && span.start >= export_span.start && span.end <= export_span.end
    });
    !in_unused_reexport
}

pub struct ModuleView<'a> {
    pub label: String,
    pub analysis: &'a Analysis,
    pub dependencies: &'a [Resolved],
    pub side_effects: bool,
    pub ids: &'a HashMap<std::path::PathBuf, usize>,
}

impl<'a> ModuleView<'a> {
    fn local_id(&self, dependency: usize) -> Option<usize> {
        let resolved = self.dependencies.get(dependency)?;
        let path = match resolved {
            Resolved::Local(path) | Resolved::Css(path) | Resolved::Asset(path) => path,
            Resolved::External(_) => return None,
        };
        self.ids.get(path).copied()
    }

    fn is_external(&self, dependency: usize) -> bool {
        matches!(
            self.dependencies.get(dependency),
            Some(Resolved::External(_))
        )
    }
}

pub fn propagate_async(modules: &[ModuleView<'_>], included: &[bool]) -> Vec<bool> {
    let mut async_mod = modules
        .iter()
        .map(|module| module.analysis.top_level_await)
        .collect::<Vec<_>>();
    let mut changed = true;
    while changed {
        changed = false;
        for (id, module) in modules.iter().enumerate() {
            if !included[id] || async_mod[id] {
                continue;
            }
            for edge in &module.analysis.edges {
                let dependency = match edge {
                    ImportEdge::Dynamic(_) => continue,
                    ImportEdge::Eval(dep)
                    | ImportEdge::All(dep)
                    | ImportEdge::Names(dep, _)
                    | ImportEdge::Star(dep) => *dep,
                    ImportEdge::Reexport { dependency, .. }
                    | ImportEdge::StarAs { dependency, .. } => *dependency,
                };
                if let Some(dep_id) = module.local_id(dependency) {
                    if included[dep_id] && async_mod[dep_id] {
                        async_mod[id] = true;
                        changed = true;
                    }
                }
            }
        }
    }
    async_mod
}
