//! Reduce a bundled stylesheet without changing what it paints.
//!
//! The pass runs only when optimize is enabled. It follows the structural
//! rewrites of CSSO and the safe rewrites of clean-css: overridden longhands
//! and shorthands, shorter colors, numbers, times, and urls, joining rules that
//! declare the same thing, duplicate selectors, duplicate `@font-face` and
//! `@media` blocks, and `@charset` / `@import` rules the browser would ignore.
//! Comments, strings, and every declaration that still applies stay. Rewrites
//! that would move a rule across a different selector are not done.

use std::collections::{HashMap, HashSet};

const OPTIMIZE_CYCLES: usize = 32;

pub fn optimize_css(source: &str) -> String {
    let (bom, body) = match source.strip_prefix('\u{feff}') {
        Some(rest) => ("\u{feff}", rest),
        None => ("", source),
    };
    let mut current = body.to_string();
    for _ in 0..OPTIMIZE_CYCLES {
        match optimize_once(&current) {
            Some(next) if next == current => break,
            Some(next) => current = next,
            None => {
                if current == body {
                    return source.to_string();
                }
                break;
            }
        }
    }
    if bom.is_empty() {
        current
    } else {
        format!("{bom}{current}")
    }
}

fn optimize_once(source: &str) -> Option<String> {
    let items = parse_items(source, 0, source.len())?;
    let mut cuts = Vec::new();
    let mut inserts = Vec::new();
    rewrite_items(&items, source, &mut cuts, &mut inserts, true);
    if cuts.is_empty() && inserts.is_empty() {
        return Some(source.to_string());
    }
    Some(apply_edits(source, cuts, inserts))
}

enum Child {
    Decl(Decl),
    Rule(Rule),
}

struct Decl {
    span: (usize, usize),
    colon: usize,
    value_end: usize,
    name: Option<String>,
    important: bool,
}

struct Rule {
    span: (usize, usize),
    at: Option<String>,
    prelude: (usize, usize),
    body: Option<Body>,
}

struct Body {
    inner: (usize, usize),
    close: usize,
    items: Vec<Child>,
}

fn rewrite_items(
    items: &[Child],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
    root: bool,
) {
    let mut dropped = vec![false; items.len()];
    let mut latest_keyframes = HashSet::new();
    for (index, item) in items.iter().enumerate().rev() {
        let Child::Rule(rule) = item else {
            continue;
        };
        let Some(name) = keyframes_key(rule, src) else {
            continue;
        };
        if latest_keyframes.contains(&name) {
            dropped[index] = true;
            cuts.push(expand_to_line(src, rule.span.0, rule.span.1));
        } else {
            latest_keyframes.insert(name);
        }
    }

    for (index, item) in items.iter().enumerate() {
        if dropped[index] {
            continue;
        }
        let Child::Rule(rule) = item else {
            continue;
        };
        if is_empty_rule(rule, src) {
            dropped[index] = true;
            cuts.push(expand_to_line(src, rule.span.0, rule.span.1));
        }
    }

    let mut index = 0;
    while index < items.len() {
        if dropped[index] {
            index += 1;
            continue;
        }
        let Child::Rule(base) = &items[index] else {
            index += 1;
            continue;
        };
        let mut next = index + 1;
        while next < items.len() {
            if dropped[next] {
                next += 1;
                continue;
            }
            let Child::Rule(candidate) = &items[next] else {
                break;
            };
            if !same_rule(base, candidate, src) {
                break;
            }
            plan_merge(base, candidate, src, cuts, inserts);
            dropped[next] = true;
            next += 1;
        }
        index = next;
    }

    let mut decls = Vec::new();
    for (index, item) in items.iter().enumerate() {
        if dropped[index] {
            continue;
        }
        match item {
            Child::Decl(decl) => decls.push(decl),
            Child::Rule(rule) => {
                if let Some(body) = &rule.body {
                    rewrite_items(&body.items, src, cuts, inserts, false);
                }
            }
        }
    }
    if root {
        drop_misplaced_prelude(items, src, cuts, &mut dropped);
    }
    drop_duplicate_descriptors(items, src, cuts, &mut dropped);
    push_dead_decls(&decls, src, cuts);
    compact_values(&decls, src, cuts, inserts);
    merge_box_longhands(&decls, src, cuts, inserts);
    dedup_selectors(items, &dropped, src, cuts, inserts);
    merge_same_bodies(items, &mut dropped, src, cuts, inserts);
    split_shared(items, &dropped, src, cuts, inserts);
    reduce_same_selector(items, &dropped, src, cuts);
}

fn keyframes_key(rule: &Rule, src: &str) -> Option<String> {
    let at = rule.at.as_deref()?;
    if at != "keyframes" && !at.ends_with("-keyframes") {
        return None;
    }
    let name = normalize_prelude(&src[rule.prelude.0..rule.prelude.1]);
    if name.is_empty() {
        return None;
    }
    Some(format!("{at} {name}"))
}

fn is_empty_rule(rule: &Rule, src: &str) -> bool {
    let Some(body) = &rule.body else {
        return false;
    };
    body.items.is_empty() && !has_comment(&src[body.inner.0..body.inner.1])
}

fn same_rule(left: &Rule, right: &Rule, src: &str) -> bool {
    if left.at != right.at || left.body.is_none() || right.body.is_none() {
        return false;
    }
    if !mergeable(left.at.as_deref()) {
        return false;
    }
    let left_key = normalize_prelude(&src[left.prelude.0..left.prelude.1]);
    let right_key = normalize_prelude(&src[right.prelude.0..right.prelude.1]);
    if left.at.is_none() && left_key.is_empty() {
        return false;
    }
    if left.at.as_deref() == Some("layer") && left_key.is_empty() {
        return false;
    }
    left_key == right_key
}

fn mergeable(at: Option<&str>) -> bool {
    matches!(
        at,
        None | Some("media" | "supports" | "container" | "scope" | "layer")
    )
}

fn plan_merge(
    first: &Rule,
    second: &Rule,
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let Some(left) = &first.body else {
        return;
    };
    let Some(right) = &second.body else {
        return;
    };
    let left_text = &src[left.inner.0..left.inner.1];
    let mut right_text = &src[right.inner.0..right.inner.1];
    if left_text.ends_with('\n') {
        if let Some(stripped) = right_text.strip_prefix("\r\n") {
            right_text = stripped;
        } else if let Some(stripped) = right_text.strip_prefix('\n') {
            right_text = stripped;
        }
    }
    let mut text = String::new();
    if needs_semicolon(left_text) {
        text.push(';');
    }
    text.push_str(right_text);
    inserts.push((left.close, text));
    cuts.push(expand_to_line(src, second.span.0, second.span.1));
}

fn needs_semicolon(inner: &str) -> bool {
    match last_significant(inner) {
        Some(';' | '{' | '}') | None => false,
        Some(_) => true,
    }
}

fn last_significant(text: &str) -> Option<char> {
    let bytes = text.as_bytes();
    let mut index = 0;
    let mut last = None;
    while index < bytes.len() {
        if bytes[index] == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(text, index);
            continue;
        }
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }
        let ch = text[index..].chars().next()?;
        last = Some(ch);
        index += ch.len_utf8();
    }
    last
}

fn push_dead_decls(decls: &[&Decl], src: &str, cuts: &mut Vec<(usize, usize)>) {
    for index in dead_decl_indexes(decls, src) {
        let decl = decls[index];
        cuts.push(expand_to_line(src, decl.span.0, decl.span.1));
    }
}

fn dead_decl_indexes(decls: &[&Decl], src: &str) -> HashSet<usize> {
    let mut winner: HashMap<String, (usize, bool)> = HashMap::new();
    let mut all_winner: Option<(usize, bool)> = None;
    let mut ignored = HashSet::new();
    for (index, decl) in decls.iter().enumerate() {
        let Some(name) = decl.name.as_deref() else {
            continue;
        };
        if ignored_declaration(name, decl_value(src, decl)) {
            ignored.insert(index);
            continue;
        }
        if name == "all" {
            all_winner = winning(all_winner, index, decl.important);
            continue;
        }
        for part in components_of(name) {
            let previous = winner.get(part).copied();
            if let Some(next) = winning(previous, index, decl.important) {
                winner.insert(part.to_string(), next);
            }
        }
    }
    let mut dead = ignored;
    for (index, decl) in decls.iter().enumerate() {
        let Some(name) = decl.name.as_deref() else {
            continue;
        };
        if dead.contains(&index) {
            continue;
        }
        if name == "all" {
            if let Some((keep, _)) = all_winner {
                if keep != index {
                    dead.insert(index);
                }
            }
            continue;
        }
        if !name.starts_with("--") {
            if let Some((all_index, all_important)) = all_winner {
                if all_index != index && beats(all_index, all_important, index, decl.important) {
                    dead.insert(index);
                    continue;
                }
            }
        }
        let parts = components_of(name);
        let alive = parts
            .iter()
            .any(|part| winner.get(*part).is_some_and(|(keep, _)| *keep == index));
        if !alive {
            dead.insert(index);
        }
    }
    dead
}

fn winning(
    previous: Option<(usize, bool)>,
    index: usize,
    important: bool,
) -> Option<(usize, bool)> {
    match previous {
        Some((kept, true)) if !important => Some((kept, true)),
        _ => Some((index, important)),
    }
}

fn beats(winner_index: usize, winner_important: bool, index: usize, important: bool) -> bool {
    if important && !winner_important {
        return false;
    }
    if winner_important && !important {
        return true;
    }
    winner_index > index
}

fn components_of(name: &str) -> Vec<&str> {
    let parts = expands_to(name);
    if parts.is_empty() {
        vec![name]
    } else {
        parts.to_vec()
    }
}

fn expands_to(name: &str) -> &'static [&'static str] {
    match name {
        "margin" => &["margin-top", "margin-right", "margin-bottom", "margin-left"],
        "margin-block" => &["margin-block-start", "margin-block-end"],
        "margin-inline" => &["margin-inline-start", "margin-inline-end"],
        "padding" => &[
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
        ],
        "padding-block" => &["padding-block-start", "padding-block-end"],
        "padding-inline" => &["padding-inline-start", "padding-inline-end"],
        "scroll-margin" => &[
            "scroll-margin-top",
            "scroll-margin-right",
            "scroll-margin-bottom",
            "scroll-margin-left",
        ],
        "scroll-padding" => &[
            "scroll-padding-top",
            "scroll-padding-right",
            "scroll-padding-bottom",
            "scroll-padding-left",
        ],
        "inset" => &["top", "right", "bottom", "left"],
        "inset-block" => &["inset-block-start", "inset-block-end"],
        "inset-inline" => &["inset-inline-start", "inset-inline-end"],
        "border-width" => &[
            "border-top-width",
            "border-right-width",
            "border-bottom-width",
            "border-left-width",
        ],
        "border-style" => &[
            "border-top-style",
            "border-right-style",
            "border-bottom-style",
            "border-left-style",
        ],
        "border-color" => &[
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
        ],
        "border-top" => &["border-top-width", "border-top-style", "border-top-color"],
        "border-right" => &[
            "border-right-width",
            "border-right-style",
            "border-right-color",
        ],
        "border-bottom" => &[
            "border-bottom-width",
            "border-bottom-style",
            "border-bottom-color",
        ],
        "border-left" => &[
            "border-left-width",
            "border-left-style",
            "border-left-color",
        ],
        "border" => &[
            "border-top-width",
            "border-right-width",
            "border-bottom-width",
            "border-left-width",
            "border-top-style",
            "border-right-style",
            "border-bottom-style",
            "border-left-style",
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
        ],
        "border-radius" => &[
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius",
        ],
        "outline" => &["outline-width", "outline-style", "outline-color"],
        "font" => &[
            "font-style",
            "font-variant",
            "font-weight",
            "font-stretch",
            "font-size",
            "line-height",
            "font-family",
            "font-feature-settings",
            "font-kerning",
            "font-language-override",
            "font-optical-sizing",
            "font-size-adjust",
            "font-variant-alternates",
            "font-variant-caps",
            "font-variant-east-asian",
            "font-variant-ligatures",
            "font-variant-numeric",
            "font-variant-position",
            "font-variation-settings",
        ],
        "list-style" => &["list-style-type", "list-style-position", "list-style-image"],
        "background" => &[
            "background-image",
            "background-position",
            "background-size",
            "background-repeat",
            "background-origin",
            "background-clip",
            "background-attachment",
            "background-color",
            "background-position-x",
            "background-position-y",
        ],
        "overflow" => &["overflow-x", "overflow-y"],
        "gap" | "grid-gap" => &["row-gap", "column-gap"],
        "grid-row-gap" => &["row-gap"],
        "grid-column-gap" => &["column-gap"],
        "flex" => &["flex-grow", "flex-shrink", "flex-basis"],
        "flex-flow" => &["flex-direction", "flex-wrap"],
        "place-items" => &["align-items", "justify-items"],
        "place-content" => &["align-content", "justify-content"],
        "place-self" => &["align-self", "justify-self"],
        "columns" => &["column-width", "column-count"],
        "animation" => &[
            "animation-name",
            "animation-duration",
            "animation-timing-function",
            "animation-delay",
            "animation-iteration-count",
            "animation-direction",
            "animation-fill-mode",
            "animation-play-state",
            "animation-timeline",
        ],
        "transition" => &[
            "transition-property",
            "transition-duration",
            "transition-timing-function",
            "transition-delay",
            "transition-behavior",
        ],
        "mask" => &[
            "mask-image",
            "mask-position",
            "mask-size",
            "mask-repeat",
            "mask-origin",
            "mask-clip",
            "mask-composite",
            "mask-mode",
        ],
        "text-decoration" => &[
            "text-decoration-line",
            "text-decoration-style",
            "text-decoration-color",
            "text-decoration-thickness",
        ],
        _ => &[],
    }
}

fn ignored_declaration(name: &str, value: &str) -> bool {
    if name != "padding" && !name.starts_with("padding-") {
        return false;
    }
    if value.contains("var(") || value.contains("calc(") || value.contains("env(") {
        return false;
    }
    top_tokens(value).iter().any(|token| negative_length(token))
}

fn negative_length(token: &str) -> bool {
    let Some(rest) = token.strip_prefix('-') else {
        return false;
    };
    let number = rest.trim_end_matches(|ch: char| ch.is_ascii_alphabetic() || ch == '%');
    if number.is_empty() || !number.chars().all(|ch| ch.is_ascii_digit() || ch == '.') {
        return false;
    }
    number.chars().any(|ch| ch.is_ascii_digit() && ch != '0')
}

fn decl_value<'a>(src: &'a str, decl: &Decl) -> &'a str {
    src[decl.colon + 1..decl.value_end].trim()
}

fn bare_value(src: &str, decl: &Decl) -> String {
    strip_important(decl_value(src, decl))
}

fn strip_important(value: &str) -> String {
    let bytes = value.as_bytes();
    let mut index = 0;
    let mut end = value.len();
    let mut paren = 0i32;
    while index < bytes.len() {
        if bytes[index] == b'"' || bytes[index] == b'\'' {
            index = match skip_string(value, index) {
                Some(next) => next,
                None => break,
            };
            continue;
        }
        if bytes[index] == b'(' {
            paren += 1;
        } else if bytes[index] == b')' {
            paren = paren.saturating_sub(1);
        } else if paren == 0 && bytes[index] == b'!' {
            end = index;
            break;
        }
        index = bump(value, index);
    }
    value[..end].trim().to_string()
}

fn compact_values(
    decls: &[&Decl],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let dead = dead_decl_indexes(decls, src);
    for (index, decl) in decls.iter().enumerate() {
        if dead.contains(&index) {
            continue;
        }
        let Some(name) = decl.name.as_deref() else {
            continue;
        };
        let bare = bare_value(src, decl);
        let Some(next) = compact_value(name, &bare) else {
            continue;
        };
        if next == bare {
            continue;
        }
        replace_value(decl, src, &next, cuts, inserts);
    }
}

fn compact_value(name: &str, value: &str) -> Option<String> {
    if name.starts_with("--") || value.contains("/*") {
        return None;
    }
    let polished = polish_value(name, value);
    let next = specialize_value(name, &polished);
    (next != value).then_some(next)
}

fn specialize_value(name: &str, value: &str) -> String {
    if name == "font-weight" {
        return match value.trim().to_ascii_lowercase().as_str() {
            "bold" => "700".to_string(),
            "normal" => "400".to_string(),
            _ => value.to_string(),
        };
    }
    if name == "background-repeat" {
        let tokens = top_tokens(value);
        if tokens.len() == 2 && tokens[0].eq_ignore_ascii_case(&tokens[1]) {
            return tokens[0].clone();
        }
    }
    if name == "box-shadow" || name == "text-shadow" {
        if let Some(short) = shorten_shadow(value) {
            return short;
        }
    }
    if matches!(
        name,
        "margin"
            | "padding"
            | "border-width"
            | "border-style"
            | "border-color"
            | "inset"
            | "scroll-margin"
            | "scroll-padding"
            | "gap"
            | "grid-gap"
            | "overflow"
    ) {
        if let Some(short) = compact_sides(
            value,
            name == "overflow" || name == "gap" || name == "grid-gap",
        ) {
            return short;
        }
    }
    if name == "border-radius" && !value.contains('/') {
        if let Some(short) = compact_sides(value, false) {
            return short;
        }
    }
    value.to_string()
}

fn shorten_shadow(value: &str) -> Option<String> {
    let tokens = top_tokens(value);
    if tokens.len() < 3 {
        return None;
    }
    let color = tokens.last().filter(|token| !looks_numeric(token)).cloned();
    let numbers = if color.is_some() {
        &tokens[..tokens.len() - 1]
    } else {
        tokens.as_slice()
    };
    if numbers.len() < 3 || numbers.iter().any(|token| token != "0") {
        return None;
    }
    let mut short = String::from("0 0");
    if let Some(color) = color {
        short.push(' ');
        short.push_str(&color);
    }
    (short != value).then_some(short)
}

fn looks_numeric(token: &str) -> bool {
    token.starts_with(|ch: char| ch.is_ascii_digit() || ch == '.' || ch == '+' || ch == '-')
}

fn polish_value(name: &str, value: &str) -> String {
    let bytes = value.as_bytes();
    let mut out = String::new();
    let mut index = 0;
    let mut pending_space = false;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte.is_ascii_whitespace() {
            pending_space = !out.is_empty();
            index += 1;
            continue;
        }
        if byte == b'"' || byte == b'\'' {
            let end = skip_string(value, index).unwrap_or(value.len());
            let folded = fold_css_string(&value[index..end]);
            let piece = if name == "font-family" || name == "font" {
                unquote_font_name(&folded).unwrap_or(folded)
            } else {
                folded
            };
            push_piece(&mut out, &piece, &mut pending_space);
            index = end;
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(value, index);
            pending_space = !out.is_empty();
            continue;
        }
        let start = index;
        let mut paren = 0i32;
        while index < bytes.len() {
            let byte = bytes[index];
            if byte == b'"' || byte == b'\'' {
                index = skip_string(value, index).unwrap_or(value.len());
                continue;
            }
            if byte == b'(' {
                paren += 1;
            } else if byte == b')' {
                paren = paren.saturating_sub(1);
            } else if paren == 0 && byte.is_ascii_whitespace() {
                break;
            }
            index = bump(value, index);
        }
        let token = &value[start..index];
        let piece = polish_token(name, token);
        let glue = piece.starts_with(',')
            || piece.starts_with(')')
            || out.ends_with('(')
            || out.ends_with(',');
        let separated = out.ends_with(')')
            && piece.starts_with(|ch: char| {
                ch.is_ascii_digit()
                    || ch == '.'
                    || ch == '#'
                    || ch == '-'
                    || ch.is_ascii_alphabetic()
            });
        if glue && !separated {
            pending_space = false;
        }
        push_piece(&mut out, &piece, &mut pending_space);
    }
    out
}

fn push_piece(out: &mut String, piece: &str, pending_space: &mut bool) {
    if piece.is_empty() {
        return;
    }
    if *pending_space {
        out.push(' ');
    }
    *pending_space = false;
    out.push_str(piece);
}

fn polish_token(name: &str, token: &str) -> String {
    let lower = token.to_ascii_lowercase();
    if lower.starts_with("url(") {
        return unquote_url(token);
    }
    if is_frozen_function(&lower) {
        return token.to_string();
    }
    if lower.starts_with("rgb(")
        || lower.starts_with("rgba(")
        || lower.starts_with("hsl(")
        || lower.starts_with("hsla(")
    {
        if let Some(color) = shorten_color_function(token) {
            return color;
        }
    }
    if let Some(rest) = token.strip_prefix('#') {
        if rest.chars().all(|ch| ch.is_ascii_hexdigit()) {
            return shortest_hex(rest);
        }
    }
    if takes_color(name) {
        if let Some(short) = shorter_named_color(&lower) {
            if short.len() < token.len() {
                return short.to_string();
            }
        }
    }
    if (name == "font-family" || name == "font") && looks_quoted(token) {
        if let Some(bare) = unquote_font_name(token) {
            return bare;
        }
    }
    if let Some(time) = shorter_time(token) {
        return time;
    }
    if let Some(number) = shorter_number(token) {
        return number;
    }
    if token.contains('(') {
        return polish_function(name, token);
    }
    token.to_string()
}

fn is_frozen_function(lower: &str) -> bool {
    lower.starts_with("var(")
        || lower.starts_with("env(")
        || lower.starts_with("calc(")
        || lower.starts_with("min(")
        || lower.starts_with("max(")
        || lower.starts_with("clamp(")
        || lower.starts_with("color-mix(")
}

fn takes_color(name: &str) -> bool {
    matches!(
        name,
        "color"
            | "background"
            | "border"
            | "outline"
            | "box-shadow"
            | "text-shadow"
            | "text-decoration"
            | "column-rule"
            | "fill"
            | "stroke"
            | "caret-color"
            | "accent-color"
    ) || name.contains("color")
        || (name.starts_with("border-")
            && !name.contains("width")
            && !name.contains("style")
            && !name.contains("radius")
            && !name.contains("image")
            && !name.contains("spacing"))
}

fn shorter_named_color(name: &str) -> Option<&'static str> {
    Some(match name {
        "yellow" => "#ff0",
        "white" => "#fff",
        "black" => "#000",
        "fuchsia" | "magenta" => "#f0f",
        "aqua" | "cyan" => "#0ff",
        "lime" => "#0f0",
        "aliceblue" => "#f0f8ff",
        "antiquewhite" => "#faebd7",
        "aquamarine" => "#7fffd4",
        "azure" => "#f0ffff",
        "beige" => "#f5f5dc",
        "bisque" => "#ffe4c4",
        "blanchedalmond" => "#ffebcd",
        "blueviolet" => "#8a2be2",
        "burlywood" => "#deb887",
        "cadetblue" => "#5f9ea0",
        "chartreuse" => "#7fff00",
        "chocolate" => "#d2691e",
        "cornflowerblue" => "#6495ed",
        "cornsilk" => "#fff8dc",
        "darkblue" => "#00008b",
        "darkcyan" => "#008b8b",
        "darkgoldenrod" => "#b8860b",
        "darkgray" | "darkgrey" => "#a9a9a9",
        "darkgreen" => "#006400",
        "darkkhaki" => "#bdb76b",
        "darkmagenta" => "#8b008b",
        "darkolivegreen" => "#556b2f",
        "darkorange" => "#ff8c00",
        "darkorchid" => "#9932cc",
        "darksalmon" => "#e9967a",
        "darkseagreen" => "#8fbc8f",
        "darkslateblue" => "#483d8b",
        "darkslategray" | "darkslategrey" => "#2f4f4f",
        "darkturquoise" => "#00ced1",
        "darkviolet" => "#9400d3",
        "deeppink" => "#ff1493",
        "deepskyblue" => "#00bfff",
        "dimgray" | "dimgrey" => "#696969",
        "dodgerblue" => "#1e90ff",
        "firebrick" => "#b22222",
        "floralwhite" => "#fffaf0",
        "forestgreen" => "#228b22",
        "gainsboro" => "#dcdcdc",
        "ghostwhite" => "#f8f8ff",
        "greenyellow" => "#adff2f",
        "honeydew" => "#f0fff0",
        "hotpink" => "#ff69b4",
        "indianred" => "#cd5c5c",
        "lavender" => "#e6e6fa",
        "lavenderblush" => "#fff0f5",
        "lawngreen" => "#7cfc00",
        "lemonchiffon" => "#fffacd",
        "lightblue" => "#add8e6",
        "lightcoral" => "#f08080",
        "lightcyan" => "#e0ffff",
        "lightgoldenrodyellow" => "#fafad2",
        "lightgray" | "lightgrey" => "#d3d3d3",
        "lightgreen" => "#90ee90",
        "lightpink" => "#ffb6c1",
        "lightsalmon" => "#ffa07a",
        "lightseagreen" => "#20b2aa",
        "lightskyblue" => "#87cefa",
        "lightslategray" | "lightslategrey" => "#789",
        "lightsteelblue" => "#b0c4de",
        "lightyellow" => "#ffffe0",
        "limegreen" => "#32cd32",
        "linen" => "#faf0e6",
        "mediumaquamarine" => "#66cdaa",
        "mediumblue" => "#0000cd",
        "mediumorchid" => "#ba55d3",
        "mediumpurple" => "#9370db",
        "mediumseagreen" => "#3cb371",
        "mediumslateblue" => "#7b68ee",
        "mediumspringgreen" => "#00fa9a",
        "mediumturquoise" => "#48d1cc",
        "mediumvioletred" => "#c71585",
        "midnightblue" => "#191970",
        "mintcream" => "#f5fffa",
        "mistyrose" => "#ffe4e1",
        "moccasin" => "#ffe4b5",
        "navajowhite" => "#ffdead",
        "oldlace" => "#fdf5e6",
        "olivedrab" => "#6b8e23",
        "orangered" => "#ff4500",
        "palegoldenrod" => "#eee8aa",
        "palegreen" => "#98fb98",
        "paleturquoise" => "#afeeee",
        "palevioletred" => "#db7093",
        "papayawhip" => "#ffefd5",
        "peachpuff" => "#ffdab9",
        "powderblue" => "#b0e0e6",
        "rosybrown" => "#bc8f8f",
        "royalblue" => "#4169e1",
        "saddlebrown" => "#8b4513",
        "sandybrown" => "#f4a460",
        "seagreen" => "#2e8b57",
        "seashell" => "#fff5ee",
        "slateblue" => "#6a5acd",
        "slategray" | "slategrey" => "#708090",
        "springgreen" => "#00ff7f",
        "steelblue" => "#4682b4",
        "turquoise" => "#40e0d0",
        "whitesmoke" => "#f5f5f5",
        "yellowgreen" => "#9acd32",
        _ => return None,
    })
}

fn shortest_hex(body: &str) -> String {
    let body = body.to_ascii_lowercase();
    let short = if (body.len() == 6 || body.len() == 8)
        && body
            .as_bytes()
            .chunks(2)
            .all(|pair| pair.len() == 2 && pair[0] == pair[1])
    {
        body.as_bytes()
            .chunks(2)
            .map(|pair| pair[0] as char)
            .collect::<String>()
    } else {
        body
    };
    if short.len() == 6 {
        if let Some(name) = hex_name(&short) {
            if name.len() < 7 {
                return name.to_string();
            }
        }
    }
    format!("#{short}")
}

fn hex_name(hex: &str) -> Option<&'static str> {
    Some(match hex {
        "c0c0c0" => "silver",
        "808080" => "gray",
        "800000" => "maroon",
        "800080" => "purple",
        "008000" => "green",
        "808000" => "olive",
        "000080" => "navy",
        "008080" => "teal",
        "ffa500" => "orange",
        "ffc0cb" => "pink",
        "ffd700" => "gold",
        "a52a2a" => "brown",
        "d2b48c" => "tan",
        "cd853f" => "peru",
        "dda0dd" => "plum",
        "fffafa" => "snow",
        "f0ffff" => "azure",
        "f5f5dc" => "beige",
        "ffe4c4" => "bisque",
        "7fff00" => "chartreuse",
        "d2691e" => "chocolate",
        "ff7f50" => "coral",
        "6495ed" => "cornflowerblue",
        "dc143c" => "crimson",
        "00008b" => "darkblue",
        "008b8b" => "darkcyan",
        "b8860b" => "darkgoldenrod",
        "a9a9a9" => "darkgray",
        "006400" => "darkgreen",
        "bdb76b" => "darkkhaki",
        "8b008b" => "darkmagenta",
        "ff8c00" => "darkorange",
        "9932cc" => "darkorchid",
        "e9967a" => "darksalmon",
        "8fbc8f" => "darkseagreen",
        "483d8b" => "darkslateblue",
        "2f4f4f" => "darkslategray",
        "00ced1" => "darkturquoise",
        "9400d3" => "darkviolet",
        "ff1493" => "deeppink",
        "00bfff" => "deepskyblue",
        "696969" => "dimgray",
        "1e90ff" => "dodgerblue",
        "b22222" => "firebrick",
        "228b22" => "forestgreen",
        "dcdcdc" => "gainsboro",
        "adff2f" => "greenyellow",
        "ff69b4" => "hotpink",
        "cd5c5c" => "indianred",
        "4b0082" => "indigo",
        "7cfc00" => "lawngreen",
        "add8e6" => "lightblue",
        "f08080" => "lightcoral",
        "e0ffff" => "lightcyan",
        "d3d3d3" => "lightgray",
        "90ee90" => "lightgreen",
        "ffb6c1" => "lightpink",
        "ffa07a" => "lightsalmon",
        "20b2aa" => "lightseagreen",
        "87cefa" => "lightskyblue",
        "778899" => "lightslategray",
        "b0c4de" => "lightsteelblue",
        "ffffe0" => "lightyellow",
        "32cd32" => "limegreen",
        "66cdaa" => "mediumaquamarine",
        "0000cd" => "mediumblue",
        "ba55d3" => "mediumorchid",
        "9370db" => "mediumpurple",
        "3cb371" => "mediumseagreen",
        "7b68ee" => "mediumslateblue",
        "00fa9a" => "mediumspringgreen",
        "48d1cc" => "mediumturquoise",
        "c71585" => "mediumvioletred",
        "191970" => "midnightblue",
        "ffe4e1" => "mistyrose",
        "ffe4b5" => "moccasin",
        "ffdead" => "navajowhite",
        "6b8e23" => "olivedrab",
        "ff4500" => "orangered",
        "da70d6" => "orchid",
        "eee8aa" => "palegoldenrod",
        "98fb98" => "palegreen",
        "afeeee" => "paleturquoise",
        "db7093" => "palevioletred",
        "ffefd5" => "papayawhip",
        "ffdab9" => "peachpuff",
        "b0e0e6" => "powderblue",
        "bc8f8f" => "rosybrown",
        "4169e1" => "royalblue",
        "8b4513" => "saddlebrown",
        "fa8072" => "salmon",
        "f4a460" => "sandybrown",
        "2e8b57" => "seagreen",
        "a0522d" => "sienna",
        "87ceeb" => "skyblue",
        "6a5acd" => "slateblue",
        "708090" => "slategray",
        "00ff7f" => "springgreen",
        "4682b4" => "steelblue",
        "d8bfd8" => "thistle",
        "40e0d0" => "turquoise",
        "ee82ee" => "violet",
        "f5deb3" => "wheat",
        "9acd32" => "yellowgreen",
        _ => return None,
    })
}

fn shorten_color_function(token: &str) -> Option<String> {
    let open = token.find('(')?;
    let inner = token[open + 1..].strip_suffix(')')?.trim();
    if inner.contains('/') {
        return None;
    }
    let parts: Vec<&str> = inner
        .split(|ch: char| ch == ',' || ch.is_ascii_whitespace())
        .filter(|part| !part.is_empty())
        .collect();
    if parts.len() == 4 {
        let alpha = parts[3].trim();
        if alpha != "1" && alpha != "100%" {
            return None;
        }
    } else if parts.len() != 3 {
        return None;
    }
    let kind = token[..open].to_ascii_lowercase();
    let (r, g, b) = if kind.starts_with("rgb") {
        (channel(parts[0])?, channel(parts[1])?, channel(parts[2])?)
    } else {
        hsl_rgb(parts[0], parts[1], parts[2])?
    };
    Some(shortest_hex(&format!("{r:02x}{g:02x}{b:02x}")))
}

fn channel(text: &str) -> Option<u8> {
    if let Some(percent) = text.strip_suffix('%') {
        let value = percent.parse::<f64>().ok()?;
        return Some((value / 100.0 * 255.0).round().clamp(0.0, 255.0) as u8);
    }
    text.parse::<f64>()
        .ok()
        .map(|value| value.round().clamp(0.0, 255.0) as u8)
}

fn hsl_rgb(h: &str, s: &str, l: &str) -> Option<(u8, u8, u8)> {
    let hue = h.strip_suffix("deg").unwrap_or(h).parse::<f64>().ok()?;
    let sat = s.strip_suffix('%')?.parse::<f64>().ok()? / 100.0;
    let light = l.strip_suffix('%')?.parse::<f64>().ok()? / 100.0;
    let hue = hue.rem_euclid(360.0) / 360.0;
    if sat == 0.0 {
        let gray = (light * 255.0).round() as u8;
        return Some((gray, gray, gray));
    }
    let q = if light < 0.5 {
        light * (1.0 + sat)
    } else {
        light + sat - light * sat
    };
    let p = 2.0 * light - q;
    Some((
        hue_channel(p, q, hue + 1.0 / 3.0),
        hue_channel(p, q, hue),
        hue_channel(p, q, hue - 1.0 / 3.0),
    ))
}

fn hue_channel(p: f64, q: f64, mut t: f64) -> u8 {
    if t < 0.0 {
        t += 1.0;
    }
    if t > 1.0 {
        t -= 1.0;
    }
    let value = if t < 1.0 / 6.0 {
        p + (q - p) * 6.0 * t
    } else if t < 0.5 {
        q
    } else if t < 2.0 / 3.0 {
        p + (q - p) * (2.0 / 3.0 - t) * 6.0
    } else {
        p
    };
    (value * 255.0).round() as u8
}

fn unquote_url(token: &str) -> String {
    let Some(open) = token.find('(') else {
        return token.to_string();
    };
    let inner = token[open + 1..].trim();
    let Some(inner) = inner.strip_suffix(')').map(str::trim) else {
        return token.to_string();
    };
    let quote = inner.chars().next();
    let Some(body) = quote.and_then(|mark| {
        if mark == '"' || mark == '\'' {
            inner[1..].strip_suffix(mark)
        } else {
            None
        }
    }) else {
        return token.to_string();
    };
    if body.is_empty()
        || body.contains([' ', '\t', '(', ')', '\'', '"', '\\', '*'])
        || body.starts_with("data:")
    {
        return token.to_string();
    }
    format!("url({body})")
}

fn looks_quoted(token: &str) -> bool {
    (token.starts_with('"') && token.ends_with('"'))
        || (token.starts_with('\'') && token.ends_with('\''))
}

fn unquote_font_name(token: &str) -> Option<String> {
    let body = &token[1..token.len() - 1];
    let lower = body.to_ascii_lowercase();
    if matches!(
        lower.as_str(),
        "cursive"
            | "fantasy"
            | "monospace"
            | "sans-serif"
            | "serif"
            | "system-ui"
            | "ui-monospace"
            | "ui-rounded"
            | "ui-sans-serif"
            | "ui-serif"
            | "emoji"
            | "math"
            | "fangsong"
            | "inherit"
            | "initial"
            | "unset"
            | "revert"
            | "revert-layer"
    ) {
        return None;
    }
    let mut chars = body.chars();
    let first = chars.next()?;
    if !(first.is_ascii_alphabetic() || first == '_') {
        return None;
    }
    if chars.all(|ch| ch.is_ascii_alphanumeric() || ch == '-' || ch == '_') {
        Some(body.to_string())
    } else {
        None
    }
}

fn shorter_time(token: &str) -> Option<String> {
    let lower = token.to_ascii_lowercase();
    let (number, unit) = if let Some(number) = lower.strip_suffix("ms") {
        (number, "ms")
    } else {
        let number = lower.strip_suffix('s')?;
        if number.ends_with('m') {
            return None;
        }
        (number, "s")
    };
    if number.is_empty()
        || !number
            .chars()
            .all(|ch| ch.is_ascii_digit() || ch == '.' || ch == '-')
    {
        return None;
    }
    let millis = if unit == "ms" {
        number.parse::<f64>().ok()?
    } else {
        number.parse::<f64>().ok()? * 1000.0
    };
    if !millis.is_finite() {
        return None;
    }
    let as_ms = format_millis(millis);
    let as_s = format_seconds(millis);
    let best = if as_s.len() < as_ms.len() {
        as_s
    } else {
        as_ms
    };
    (best.len() < token.len()).then_some(best)
}

fn format_millis(millis: f64) -> String {
    let rounded = millis.round();
    if (millis - rounded).abs() < 0.001 {
        format!("{}ms", rounded as i64)
    } else {
        format!("{millis}ms")
    }
}

fn format_seconds(millis: f64) -> String {
    let seconds = millis / 1000.0;
    let text = trim_decimal(&format!("{seconds:.3}"));
    format!("{text}s")
}

fn shorter_number(token: &str) -> Option<String> {
    let (sign, rest) = if let Some(rest) = token.strip_prefix('+') {
        ("", rest)
    } else if let Some(rest) = token.strip_prefix('-') {
        ("-", rest)
    } else {
        ("", token)
    };
    let split = rest.find(|ch: char| !ch.is_ascii_digit() && ch != '.')?;
    if split == 0 && !rest.starts_with('.') {
        return None;
    }
    let (number, unit) = rest.split_at(split);
    if number.is_empty()
        || unit
            .chars()
            .any(|ch| !ch.is_ascii_alphabetic() && ch != '%')
    {
        return None;
    }
    let trimmed = trim_decimal(number);
    let unit = if trimmed == "0" && is_length_unit(unit) {
        ""
    } else {
        unit
    };
    let next = format!("{sign}{trimmed}{unit}");
    (next != token).then_some(next)
}

fn trim_decimal(number: &str) -> String {
    let (whole, frac) = number.split_once('.').unwrap_or((number, ""));
    let whole = whole.trim_start_matches('0');
    let frac = frac.trim_end_matches('0');
    if frac.is_empty() {
        if whole.is_empty() {
            "0".to_string()
        } else {
            whole.to_string()
        }
    } else if whole.is_empty() {
        format!(".{frac}")
    } else {
        format!("{whole}.{frac}")
    }
}

fn is_length_unit(unit: &str) -> bool {
    matches!(
        unit.to_ascii_lowercase().as_str(),
        "px" | "em"
            | "rem"
            | "ex"
            | "ch"
            | "ic"
            | "lh"
            | "rlh"
            | "vw"
            | "vh"
            | "vmin"
            | "vmax"
            | "vb"
            | "vi"
            | "svw"
            | "svh"
            | "lvw"
            | "lvh"
            | "dvw"
            | "dvh"
            | "cqw"
            | "cqh"
            | "cqi"
            | "cqb"
            | "cqmin"
            | "cqmax"
            | "cm"
            | "mm"
            | "q"
            | "in"
            | "pt"
            | "pc"
    )
}

fn polish_function(name: &str, token: &str) -> String {
    let Some(open) = token.find('(') else {
        return token.to_string();
    };
    let Some(body) = token[open + 1..].strip_suffix(')') else {
        return token.to_string();
    };
    let head = &token[..open];
    if head.eq_ignore_ascii_case("rotate") && body.trim().eq_ignore_ascii_case("0deg") {
        return format!("{head}(0)");
    }
    let inner = polish_value(name, body);
    format!("{head}({inner})")
}

fn fold_css_string(raw: &str) -> String {
    let mut out = String::new();
    let mut chars = raw.chars().peekable();
    while let Some(ch) = chars.next() {
        if ch == '\\' {
            match chars.peek() {
                Some('\n') => {
                    chars.next();
                    continue;
                }
                Some('\r') => {
                    chars.next();
                    if chars.peek() == Some(&'\n') {
                        chars.next();
                    }
                    continue;
                }
                _ => out.push('\\'),
            }
        } else {
            out.push(ch);
        }
    }
    out
}

fn compact_sides(value: &str, pair_only: bool) -> Option<String> {
    let tokens = top_tokens(value);
    if tokens.is_empty() || tokens.len() > 4 || tokens.iter().any(|token| token.contains(' ')) {
        return None;
    }
    if pair_only && tokens.len() > 2 {
        return None;
    }
    let sides = expand_sides(&tokens)?;
    let compact = shrink_sides(&sides);
    if compact.len() == tokens.len() && compact.iter().zip(&tokens).all(|(next, prev)| next == prev)
    {
        return None;
    }
    Some(compact.join(" "))
}

fn expand_sides(tokens: &[String]) -> Option<[String; 4]> {
    match tokens {
        [one] => Some([one.clone(), one.clone(), one.clone(), one.clone()]),
        [one, two] => Some([one.clone(), two.clone(), one.clone(), two.clone()]),
        [one, two, three] => Some([one.clone(), two.clone(), three.clone(), two.clone()]),
        [one, two, three, four] => Some([one.clone(), two.clone(), three.clone(), four.clone()]),
        _ => None,
    }
}

fn shrink_sides(sides: &[String; 4]) -> Vec<String> {
    if sides[0] == sides[1] && sides[1] == sides[2] && sides[2] == sides[3] {
        vec![sides[0].clone()]
    } else if sides[0] == sides[2] && sides[1] == sides[3] {
        vec![sides[0].clone(), sides[1].clone()]
    } else if sides[1] == sides[3] {
        vec![sides[0].clone(), sides[1].clone(), sides[2].clone()]
    } else {
        sides.to_vec()
    }
}

fn top_tokens(value: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let bytes = value.as_bytes();
    let mut index = 0;
    let mut paren = 0i32;
    let mut bracket = 0i32;
    let mut start = None;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            let end = match skip_string(value, index) {
                Some(next) => next,
                None => value.len(),
            };
            if start.is_none() {
                start = Some(index);
            }
            index = end;
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            if paren == 0 && bracket == 0 {
                if let Some(from) = start.take() {
                    tokens.push(value[from..index].trim().to_string());
                }
            }
            index = skip_comment(value, index);
            continue;
        }
        match byte {
            b'(' => paren += 1,
            b')' => paren = paren.saturating_sub(1),
            b'[' => bracket += 1,
            b']' => bracket = bracket.saturating_sub(1),
            _ => {}
        }
        if byte.is_ascii_whitespace() && paren == 0 && bracket == 0 {
            if let Some(from) = start.take() {
                let token = value[from..index].trim();
                if !token.is_empty() {
                    tokens.push(token.to_string());
                }
            }
            index += 1;
            continue;
        }
        if start.is_none() && !byte.is_ascii_whitespace() {
            start = Some(index);
        }
        index = bump(value, index);
    }
    if let Some(from) = start {
        let token = value[from..].trim();
        if !token.is_empty() {
            tokens.push(token.to_string());
        }
    }
    tokens
}

fn replace_value(
    decl: &Decl,
    src: &str,
    value: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let mut text = format!(" {value}");
    if decl.important {
        text.push_str(" !important");
    }
    let old = &src[decl.colon + 1..decl.value_end];
    if old.trim() == text.trim() {
        return;
    }
    cuts.push((decl.colon + 1, decl.value_end));
    inserts.push((decl.colon + 1, text));
}

fn merge_box_longhands(
    decls: &[&Decl],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let families = [
        (
            "margin",
            ["margin-top", "margin-right", "margin-bottom", "margin-left"],
        ),
        (
            "padding",
            [
                "padding-top",
                "padding-right",
                "padding-bottom",
                "padding-left",
            ],
        ),
        (
            "border-width",
            [
                "border-top-width",
                "border-right-width",
                "border-bottom-width",
                "border-left-width",
            ],
        ),
        ("inset", ["top", "right", "bottom", "left"]),
        (
            "border-radius",
            [
                "border-top-left-radius",
                "border-top-right-radius",
                "border-bottom-right-radius",
                "border-bottom-left-radius",
            ],
        ),
    ];
    let dead = dead_decl_indexes(decls, src);
    for (shorthand, sides) in families {
        let mut found: [Option<usize>; 4] = [None, None, None, None];
        for (index, decl) in decls.iter().enumerate() {
            if dead.contains(&index) {
                continue;
            }
            let Some(name) = decl.name.as_deref() else {
                continue;
            };
            if name == shorthand {
                if !dead.contains(&index) {
                    found = [None, None, None, None];
                }
                continue;
            }
            if let Some(slot) = sides.iter().position(|side| *side == name) {
                found[slot] = Some(index);
            }
        }
        let Some(indexes) = found.into_iter().collect::<Option<Vec<_>>>() else {
            continue;
        };
        if indexes.iter().any(|index| dead.contains(index)) {
            continue;
        }
        let important = decls[indexes[0]].important;
        if indexes
            .iter()
            .any(|index| decls[*index].important != important)
        {
            continue;
        }
        let mut values = Vec::new();
        let mut simple = true;
        for index in &indexes {
            let bare = bare_value(src, decls[*index]);
            if bare.is_empty() || bare.split_whitespace().count() != 1 || bare.contains("/*") {
                simple = false;
                break;
            }
            values.push(bare);
        }
        if !simple {
            continue;
        }
        let joined = values.join(" ");
        let compact = compact_sides(&joined, false).unwrap_or(joined);
        let mut text = format!("{shorthand}: {compact}");
        if important {
            text.push_str(" !important");
        }
        text.push(';');
        commit_shorthand(&indexes, decls, text, cuts, inserts);
    }
    merge_joined(
        decls,
        src,
        cuts,
        inserts,
        "overflow",
        &["overflow-x", "overflow-y"],
    );
    merge_joined(decls, src, cuts, inserts, "gap", &["row-gap", "column-gap"]);
    merge_joined(
        decls,
        src,
        cuts,
        inserts,
        "outline",
        &["outline-width", "outline-style", "outline-color"],
    );
    merge_joined(
        decls,
        src,
        cuts,
        inserts,
        "border",
        &["border-width", "border-style", "border-color"],
    );
    merge_joined(
        decls,
        src,
        cuts,
        inserts,
        "flex",
        &["flex-grow", "flex-shrink", "flex-basis"],
    );
}

fn merge_joined(
    decls: &[&Decl],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
    shorthand: &str,
    parts: &[&str],
) {
    let dead = dead_decl_indexes(decls, src);
    let mut found = vec![None; parts.len()];
    for (index, decl) in decls.iter().enumerate() {
        if dead.contains(&index) {
            continue;
        }
        let Some(name) = decl.name.as_deref() else {
            continue;
        };
        if name == shorthand && !dead.contains(&index) {
            found.fill(None);
            continue;
        }
        if let Some(slot) = parts.iter().position(|part| *part == name) {
            found[slot] = Some(index);
        }
    }
    let Some(indexes) = found.into_iter().collect::<Option<Vec<_>>>() else {
        return;
    };
    let important = decls[indexes[0]].important;
    if indexes
        .iter()
        .any(|index| decls[*index].important != important)
    {
        return;
    }
    let mut values = Vec::new();
    for index in &indexes {
        let bare = bare_value(src, decls[*index]);
        if bare.is_empty() || bare.split_whitespace().count() != 1 || bare.contains("/*") {
            return;
        }
        values.push(bare);
    }
    let joined = values.join(" ");
    let compact = if parts.len() == 2 {
        compact_sides(&joined, true).unwrap_or(joined)
    } else if shorthand == "border-radius" {
        compact_sides(&joined, false).unwrap_or(values.join(" "))
    } else {
        values.join(" ")
    };
    let mut text = format!("{shorthand}: {compact}");
    if important {
        text.push_str(" !important");
    }
    text.push(';');
    commit_shorthand(&indexes, decls, text, cuts, inserts);
}

fn commit_shorthand(
    indexes: &[usize],
    decls: &[&Decl],
    text: String,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let start = indexes
        .iter()
        .map(|index| decls[*index].span.0)
        .min()
        .unwrap();
    let end = indexes
        .iter()
        .map(|index| decls[*index].span.1)
        .max()
        .unwrap();
    let foreign = decls
        .iter()
        .enumerate()
        .any(|(index, decl)| !indexes.contains(&index) && decl.span.0 < end && decl.span.1 > start);
    if !foreign {
        cuts.push((start, end));
        inserts.push((start, text));
        return;
    }
    let last = indexes
        .iter()
        .copied()
        .max_by_key(|index| decls[*index].span.0)
        .unwrap();
    for index in indexes {
        let decl = decls[*index];
        cuts.push((decl.span.0, decl.span.1));
    }
    inserts.push((decls[last].span.0, text));
}

fn drop_misplaced_prelude(
    items: &[Child],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    dropped: &mut [bool],
) {
    let mut seen_body = false;
    let mut seen_charset = false;
    for (index, item) in items.iter().enumerate() {
        let Child::Rule(rule) = item else {
            seen_body = true;
            continue;
        };
        let Some(at) = rule.at.as_deref() else {
            seen_body = true;
            continue;
        };
        let drop = if at == "charset" {
            seen_charset || seen_body
        } else if at == "import" {
            seen_body
        } else if at == "layer" && rule.body.is_none() {
            false
        } else {
            seen_body = true;
            false
        };
        if at == "charset" && !drop {
            seen_charset = true;
        }
        if drop {
            dropped[index] = true;
            cuts.push(expand_to_line(src, rule.span.0, rule.span.1));
        }
    }
}

fn drop_duplicate_descriptors(
    items: &[Child],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    dropped: &mut [bool],
) {
    let mut fonts: HashMap<String, usize> = HashMap::new();
    let mut media: HashMap<String, usize> = HashMap::new();
    for (index, item) in items.iter().enumerate() {
        if dropped[index] {
            continue;
        }
        let Child::Rule(rule) = item else {
            continue;
        };
        let Some(at) = rule.at.as_deref() else {
            continue;
        };
        if has_comment(&src[rule.span.0..rule.span.1]) {
            continue;
        }
        if at == "font-face" {
            let Some(key) = descriptor_key(rule, src) else {
                continue;
            };
            if let std::collections::hash_map::Entry::Vacant(entry) = fonts.entry(key) {
                entry.insert(index);
            } else {
                dropped[index] = true;
                cuts.push(expand_to_line(src, rule.span.0, rule.span.1));
            }
        } else if at == "media" {
            let Some(key) = media_key(rule, src) else {
                continue;
            };
            if let Some(previous) = media.get(&key) {
                dropped[*previous] = true;
                if let Child::Rule(previous_rule) = &items[*previous] {
                    cuts.push(expand_to_line(
                        src,
                        previous_rule.span.0,
                        previous_rule.span.1,
                    ));
                }
            }
            media.insert(key, index);
        }
    }
}

fn descriptor_key(rule: &Rule, src: &str) -> Option<String> {
    let body = rule.body.as_ref()?;
    let mut parts = Vec::new();
    for item in &body.items {
        let Child::Decl(decl) = item else {
            return None;
        };
        parts.push(decl_key(decl, src)?);
    }
    parts.sort();
    Some(parts.join(";"))
}

fn media_key(rule: &Rule, src: &str) -> Option<String> {
    let body = rule.body.as_ref()?;
    if has_comment(&src[body.inner.0..body.inner.1]) {
        return None;
    }
    let prelude = normalize_prelude(&src[rule.prelude.0..rule.prelude.1]);
    Some(format!(
        "{prelude}|{}",
        normalize_prelude(&src[body.inner.0..body.inner.1])
    ))
}

fn dedup_selectors(
    items: &[Child],
    dropped: &[bool],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    for (index, item) in items.iter().enumerate() {
        if dropped[index] {
            continue;
        }
        let Child::Rule(rule) = item else {
            continue;
        };
        if rule.at.is_some() {
            continue;
        }
        let raw = &src[rule.prelude.0..rule.prelude.1];
        let Some(next) = edited_selector(raw) else {
            continue;
        };
        let end = rule.prelude.0 + raw.trim_end().len();
        cuts.push((rule.prelude.0, end));
        inserts.push((rule.prelude.0, next));
    }
}

fn edited_selector(raw: &str) -> Option<String> {
    let base = deduped_selector(raw).unwrap_or_else(|| raw.trim_end().to_string());
    let tidied = tidy_selector(&base);
    (tidied != raw.trim_end()).then_some(tidied)
}

fn tidy_selector(raw: &str) -> String {
    let chars: Vec<char> = raw.chars().collect();
    let mut out = String::new();
    let mut index = 0;
    let mut paren = 0i32;
    let mut bracket = 0i32;
    let mut func = String::new();
    let mut funcs: Vec<String> = Vec::new();
    while index < chars.len() {
        let ch = chars[index];
        if ch == '"' || ch == '\'' {
            let start = index;
            index += 1;
            while index < chars.len() && chars[index] != ch {
                if chars[index] == '\\' && index + 1 < chars.len() {
                    index += 2;
                    continue;
                }
                index += 1;
            }
            if index < chars.len() {
                index += 1;
            }
            out.extend(chars[start..index].iter());
            func.clear();
            continue;
        }
        if ch == '/' && chars.get(index + 1) == Some(&'*') {
            let start = index;
            index += 2;
            while index + 1 < chars.len() && !(chars[index] == '*' && chars[index + 1] == '/') {
                index += 1;
            }
            index = (index + 2).min(chars.len());
            out.extend(chars[start..index].iter());
            continue;
        }
        if ch.is_whitespace() {
            let prev = out.chars().next_back();
            let next = chars[index + 1..]
                .iter()
                .copied()
                .find(|item| !item.is_whitespace());
            let nth = funcs.last().is_some_and(|name| name.starts_with("nth"));
            let drop = matches!(prev, Some('(' | ','))
                || matches!(next, Some(')' | ','))
                || (paren == 0 && bracket == 0 && matches!(prev, Some('>' | '+' | '~')))
                || (paren == 0 && bracket == 0 && matches!(next, Some('>' | '+' | '~')))
                || (nth && matches!(prev, Some('+' | '-')))
                || (nth && matches!(next, Some('+' | '-')));
            if !drop && !out.is_empty() && !out.ends_with(' ') {
                out.push(' ');
            }
            index += 1;
            continue;
        }
        if ch == '(' {
            paren += 1;
            funcs.push(func.clone());
            func.clear();
        } else if ch == ')' {
            paren = paren.saturating_sub(1);
            funcs.pop();
            func.clear();
        } else if ch == '[' {
            bracket += 1;
        } else if ch == ']' {
            bracket = bracket.saturating_sub(1);
        } else if ch.is_ascii_alphabetic() {
            if !out
                .ends_with(|item: char| item.is_ascii_alphanumeric() || item == '-' || item == '_')
            {
                func.clear();
            }
            func.push(ch.to_ascii_lowercase());
        } else if ch != '-' && ch != '_' {
            func.clear();
        }
        out.push(ch);
        index += 1;
    }
    out
}

fn deduped_selector(raw: &str) -> Option<String> {
    let parts = split_selectors(raw);
    if parts.len() < 2 {
        return None;
    }
    let mut seen = HashSet::new();
    let mut kept = Vec::new();
    for part in &parts {
        let key = normalize_prelude(part);
        if key.is_empty() || !seen.insert(key) {
            continue;
        }
        kept.push(part.trim());
    }
    if kept.len() == parts.len() {
        return None;
    }
    Some(kept.join(", "))
}

fn split_selectors(raw: &str) -> Vec<&str> {
    let bytes = raw.as_bytes();
    let mut parts = Vec::new();
    let mut start = 0;
    let mut index = 0;
    let mut paren = 0i32;
    let mut bracket = 0i32;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = match skip_string(raw, index) {
                Some(next) => next,
                None => raw.len(),
            };
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(raw, index);
            continue;
        }
        match byte {
            b'(' => paren += 1,
            b')' => paren = paren.saturating_sub(1),
            b'[' => bracket += 1,
            b']' => bracket = bracket.saturating_sub(1),
            b',' if paren == 0 && bracket == 0 => {
                parts.push(&raw[start..index]);
                start = index + 1;
            }
            _ => {}
        }
        index = bump(raw, index);
    }
    parts.push(&raw[start..]);
    parts
}

fn merge_same_bodies(
    items: &[Child],
    dropped: &mut [bool],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let mut index = 0;
    while index < items.len() {
        if dropped[index] {
            index += 1;
            continue;
        }
        let Child::Rule(base) = &items[index] else {
            index += 1;
            continue;
        };
        if !simple_style(base) {
            index += 1;
            continue;
        }
        let Some(base_key) = body_key(base, src) else {
            index += 1;
            continue;
        };
        let mut next = index + 1;
        while next < items.len() {
            if dropped[next] {
                next += 1;
                continue;
            }
            let Child::Rule(candidate) = &items[next] else {
                break;
            };
            if !simple_style(candidate)
                || body_key(candidate, src).as_deref() != Some(base_key.as_str())
            {
                break;
            }
            let selector = src[candidate.prelude.0..candidate.prelude.1].trim();
            if !selector.is_empty() {
                let mut at = base.prelude.1;
                while at > base.prelude.0 && src.as_bytes()[at - 1].is_ascii_whitespace() {
                    at -= 1;
                }
                inserts.push((at, format!(", {selector}")));
            }
            dropped[next] = true;
            cuts.push(expand_to_line(src, candidate.span.0, candidate.span.1));
            next += 1;
        }
        index = next;
    }
}

fn split_shared(
    items: &[Child],
    dropped: &[bool],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
    inserts: &mut Vec<(usize, String)>,
) {
    let mut index = 0;
    while index + 1 < items.len() {
        if dropped[index] {
            index += 1;
            continue;
        }
        let mut next = index + 1;
        while next < items.len() && dropped[next] {
            next += 1;
        }
        if next >= items.len() {
            break;
        }
        let (Child::Rule(left), Child::Rule(right)) = (&items[index], &items[next]) else {
            index = next;
            continue;
        };
        if let Some(text) = shared_rewrite(left, right, src) {
            cuts.push((left.span.0, right.span.1));
            inserts.push((left.span.0, text));
            index = next + 1;
            continue;
        }
        index = next;
    }
}

fn shared_rewrite(left: &Rule, right: &Rule, src: &str) -> Option<String> {
    if !simple_style(left) || !simple_style(right) {
        return None;
    }
    if has_comment(&src[left.span.0..right.span.1]) {
        return None;
    }
    let left_decls = style_decls(left)?;
    let right_decls = style_decls(right)?;
    if left_decls.is_empty() || right_decls.is_empty() {
        return None;
    }
    let mut shared = Vec::new();
    let mut only_left = Vec::new();
    let mut used_right = HashSet::new();
    for decl in &left_decls {
        let key = decl_key(decl, src)?;
        if let Some(position) = right_decls
            .iter()
            .position(|other| decl_key(other, src).as_deref() == Some(key.as_str()))
        {
            shared.push(*decl);
            used_right.insert(position);
        } else {
            only_left.push(*decl);
        }
    }
    let only_right: Vec<&Decl> = right_decls
        .iter()
        .enumerate()
        .filter(|(position, _)| !used_right.contains(position))
        .map(|(_, decl)| *decl)
        .collect();
    if shared.is_empty() || (only_left.is_empty() && only_right.is_empty()) {
        return None;
    }
    if components_overlap(&only_left, &shared, src) || components_overlap(&only_right, &shared, src)
    {
        return None;
    }
    let left_sel = src[left.prelude.0..left.prelude.1].trim();
    let right_sel = src[right.prelude.0..right.prelude.1].trim();
    let gap = if src[left.span.0..right.span.1].contains('\n') {
        "\n"
    } else {
        ""
    };
    let mut parts = Vec::new();
    if !only_left.is_empty() {
        parts.push(render_rule(left_sel, &only_left, src));
    }
    parts.push(render_rule(
        &format!("{left_sel}, {right_sel}"),
        &shared,
        src,
    ));
    if !only_right.is_empty() {
        parts.push(render_rule(right_sel, &only_right, src));
    }
    let text = parts.join(gap);
    let old = &src[left.span.0..right.span.1];
    (text.len() < old.len()).then_some(text)
}

fn components_overlap(left: &[&Decl], right: &[&Decl], _src: &str) -> bool {
    let mut seen = HashSet::new();
    for decl in left {
        let Some(name) = decl.name.as_deref() else {
            return true;
        };
        for part in components_of(name) {
            seen.insert(part.to_string());
        }
    }
    for decl in right {
        let Some(name) = decl.name.as_deref() else {
            return true;
        };
        if components_of(name).iter().any(|part| seen.contains(*part)) {
            return true;
        }
    }
    false
}

fn render_rule(selector: &str, decls: &[&Decl], src: &str) -> String {
    let body = decls
        .iter()
        .map(|decl| {
            let name = decl.name.as_deref().unwrap_or("");
            let value = bare_value(src, decl);
            if decl.important {
                format!("{name}:{value}!important")
            } else {
                format!("{name}:{value}")
            }
        })
        .collect::<Vec<_>>()
        .join(";");
    format!("{selector}{{{body}}}")
}

fn reduce_same_selector(
    items: &[Child],
    dropped: &[bool],
    src: &str,
    cuts: &mut Vec<(usize, usize)>,
) {
    let mut rules = Vec::new();
    for (index, item) in items.iter().enumerate() {
        if dropped[index] {
            continue;
        }
        let Child::Rule(rule) = item else {
            continue;
        };
        if simple_style(rule) {
            rules.push((index, rule));
        }
    }
    for (later_pos, (_, later)) in rules.iter().enumerate() {
        for (_, earlier) in rules.iter().take(later_pos) {
            if normalize_prelude(&src[earlier.prelude.0..earlier.prelude.1])
                != normalize_prelude(&src[later.prelude.0..later.prelude.1])
            {
                continue;
            }
            let mut between = HashSet::new();
            collect_components_between(items, earlier.span.1, later.span.0, &mut between);
            let later_decls = style_decls(later).unwrap_or_default();
            let mut later_parts = HashSet::new();
            for decl in &later_decls {
                let Some(name) = decl.name.as_deref() else {
                    continue;
                };
                for part in components_of(name) {
                    later_parts.insert(part.to_string());
                }
            }
            if later_parts.iter().any(|part| between.contains(part)) {
                continue;
            }
            let earlier_decls = style_decls(earlier).unwrap_or_default();
            let mut combined = earlier_decls.clone();
            combined.extend(later_decls.iter().copied());
            let dead = dead_decl_indexes(&combined, src);
            let earlier_count = earlier_decls.len();
            if earlier_count > 0 && (0..earlier_count).all(|index| dead.contains(&index)) {
                cuts.push(expand_to_line(src, earlier.span.0, earlier.span.1));
                continue;
            }
            for index in dead {
                let decl = combined[index];
                cuts.push(expand_to_line(src, decl.span.0, decl.span.1));
            }
        }
    }
}

fn collect_components_between(
    items: &[Child],
    start: usize,
    end: usize,
    out: &mut HashSet<String>,
) {
    for item in items {
        match item {
            Child::Decl(decl) => {
                if decl.span.0 >= start && decl.span.1 <= end {
                    if let Some(name) = decl.name.as_deref() {
                        for part in components_of(name) {
                            out.insert(part.to_string());
                        }
                    }
                }
            }
            Child::Rule(rule) => {
                if rule.span.1 <= start || rule.span.0 >= end {
                    continue;
                }
                if let Some(body) = &rule.body {
                    collect_components_between(&body.items, start, end, out);
                    for item in &body.items {
                        if let Child::Decl(decl) = item {
                            if let Some(name) = decl.name.as_deref() {
                                for part in components_of(name) {
                                    out.insert(part.to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

fn simple_style(rule: &Rule) -> bool {
    rule.at.is_none()
        && rule.body.as_ref().is_some_and(|body| {
            !body.items.is_empty() && body.items.iter().all(|item| matches!(item, Child::Decl(_)))
        })
}

fn style_decls(rule: &Rule) -> Option<Vec<&Decl>> {
    let body = rule.body.as_ref()?;
    let mut decls = Vec::new();
    for item in &body.items {
        let Child::Decl(decl) = item else {
            return None;
        };
        decls.push(decl);
    }
    Some(decls)
}

fn body_key(rule: &Rule, src: &str) -> Option<String> {
    if has_comment(&src[rule.span.0..rule.span.1]) {
        return None;
    }
    let decls = style_decls(rule)?;
    let mut parts = Vec::new();
    for decl in decls {
        parts.push(decl_key(decl, src)?);
    }
    Some(parts.join(";"))
}

fn decl_key(decl: &Decl, src: &str) -> Option<String> {
    let name = decl.name.as_deref()?;
    Some(format!(
        "{name}:{}:{}",
        normalize_prelude(&bare_value(src, decl)),
        decl.important
    ))
}

fn expand_to_line(src: &str, start: usize, end: usize) -> (usize, usize) {
    let bytes = src.as_bytes();
    let mut end_at = end;
    while end_at < bytes.len() && matches!(bytes[end_at], b' ' | b'\t') {
        end_at += 1;
    }
    let line_start = src[..start].rfind('\n').map(|index| index + 1).unwrap_or(0);
    let prefix_blank = src[line_start..start]
        .bytes()
        .all(|byte| matches!(byte, b' ' | b'\t'));
    if prefix_blank && (end_at == bytes.len() || matches!(bytes[end_at], b'\n' | b'\r')) {
        if bytes.get(end_at) == Some(&b'\r') {
            end_at += 1;
        }
        if bytes.get(end_at) == Some(&b'\n') {
            end_at += 1;
        }
        return (line_start, end_at);
    }
    if end_at > end {
        return (start, end_at);
    }
    (start, end)
}

fn apply_edits(
    src: &str,
    mut cuts: Vec<(usize, usize)>,
    mut inserts: Vec<(usize, String)>,
) -> String {
    cuts.retain(|(start, end)| start < end);
    cuts.sort_by_key(|cut| cut.0);
    let mut merged: Vec<(usize, usize)> = Vec::new();
    for (start, end) in cuts {
        if let Some(last) = merged.last_mut() {
            if start <= last.1 {
                last.1 = last.1.max(end);
                continue;
            }
        }
        merged.push((start, end));
    }
    inserts.sort_by_key(|item| item.0);
    let mut out = String::with_capacity(src.len());
    let mut cursor = 0;
    let mut insert_at = 0;
    for (start, end) in &merged {
        while insert_at < inserts.len() && inserts[insert_at].0 < *start {
            let at = inserts[insert_at].0;
            if at >= cursor && at <= src.len() {
                if at > cursor {
                    out.push_str(&src[cursor..at]);
                }
                out.push_str(&inserts[insert_at].1);
                cursor = at;
            }
            insert_at += 1;
        }
        if *start > cursor {
            out.push_str(&src[cursor..*start]);
        }
        while insert_at < inserts.len() && inserts[insert_at].0 < *end {
            if inserts[insert_at].0 == *start {
                out.push_str(&inserts[insert_at].1);
            }
            insert_at += 1;
        }
        if *end > cursor {
            cursor = *end;
        }
    }
    while insert_at < inserts.len() {
        let at = inserts[insert_at].0;
        if at >= cursor && at <= src.len() {
            out.push_str(&src[cursor..at]);
            out.push_str(&inserts[insert_at].1);
            cursor = at;
        }
        insert_at += 1;
    }
    out.push_str(&src[cursor..]);
    out
}

fn parse_items(src: &str, mut index: usize, end: usize) -> Option<Vec<Child>> {
    let mut items = Vec::new();
    while index < end {
        index = skip(src, index);
        if index >= end {
            break;
        }
        if src.as_bytes()[index] == b'}' {
            return None;
        }
        if src.as_bytes()[index] == b'@' {
            let rule = parse_rule(src, index, end)?;
            if rule.span.1 <= index {
                return None;
            }
            index = rule.span.1;
            items.push(Child::Rule(rule));
            continue;
        }
        match classify(src, index, end)? {
            Some(found) => {
                let decl = parse_decl(src, index, found);
                if decl.span.1 <= index {
                    return None;
                }
                index = decl.span.1;
                items.push(Child::Decl(decl));
            }
            None => {
                let rule = parse_rule(src, index, end)?;
                if rule.span.1 <= index {
                    return None;
                }
                index = rule.span.1;
                items.push(Child::Rule(rule));
            }
        }
    }
    Some(items)
}

struct FoundDecl {
    colon: usize,
    value_end: usize,
    semi: bool,
}

/// `Some` is a declaration. `None` is a qualified or nested rule.
fn classify(src: &str, start: usize, end: usize) -> Option<Option<FoundDecl>> {
    let bytes = src.as_bytes();
    let mut index = start;
    let mut paren = 0i32;
    let mut bracket = 0i32;
    let mut colon = None;
    while index < end {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = skip_string(src, index)?;
            continue;
        }
        if byte == b'/' && index + 1 < end && bytes[index + 1] == b'*' {
            index = skip_comment(src, index);
            continue;
        }
        if byte == b'\\' {
            index = bump(src, index);
            if index < end {
                index = bump(src, index);
            }
            continue;
        }
        if paren == 0 && bracket == 0 && byte == b':' && colon.is_none() {
            colon = Some(index);
            index += 1;
            continue;
        }
        match byte {
            b'(' => paren += 1,
            b')' => {
                if paren == 0 {
                    return None;
                }
                paren -= 1;
            }
            b'[' => bracket += 1,
            b']' => {
                if bracket == 0 {
                    return None;
                }
                bracket -= 1;
            }
            b'{' if paren == 0 && bracket == 0 => return Some(None),
            b';' if paren == 0 && bracket == 0 => {
                let colon = colon?;
                return Some(Some(FoundDecl {
                    colon,
                    value_end: index,
                    semi: true,
                }));
            }
            _ => {}
        }
        index = bump(src, index);
    }
    let colon = colon?;
    if paren != 0 || bracket != 0 {
        return None;
    }
    Some(Some(FoundDecl {
        colon,
        value_end: end,
        semi: false,
    }))
}

fn parse_decl(src: &str, start: usize, found: FoundDecl) -> Decl {
    let name = property_name(&src[start..found.colon]);
    let important = is_important(&src[found.colon + 1..found.value_end]);
    let span_end = if found.semi {
        found.value_end + 1
    } else {
        found.value_end
    };
    Decl {
        span: (start, span_end),
        colon: found.colon,
        value_end: found.value_end,
        name,
        important,
    }
}

fn parse_rule(src: &str, start: usize, limit: usize) -> Option<Rule> {
    let bytes = src.as_bytes();
    if bytes[start] == b'@' {
        let (name, after) = read_ident(src, start + 1)?;
        let (token, stopped) = scan_stop(src, after, limit)?;
        let prelude = (after, token);
        return match stopped {
            Stop::Semi => Some(Rule {
                span: (start, token + 1),
                at: Some(name),
                prelude,
                body: None,
            }),
            Stop::Brace => {
                let body = parse_block(src, token, limit)?;
                Some(Rule {
                    span: (start, body.close + 1),
                    at: Some(name),
                    prelude,
                    body: Some(body),
                })
            }
        };
    }
    let (token, stopped) = scan_stop(src, start, limit)?;
    if stopped != Stop::Brace {
        return None;
    }
    let body = parse_block(src, token, limit)?;
    Some(Rule {
        span: (start, body.close + 1),
        at: None,
        prelude: (start, token),
        body: Some(body),
    })
}

fn parse_block(src: &str, open: usize, limit: usize) -> Option<Body> {
    let close = matching_brace(src, open, limit)?;
    let items = parse_items(src, open + 1, close)?;
    Some(Body {
        inner: (open + 1, close),
        close,
        items,
    })
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Stop {
    Brace,
    Semi,
}

fn scan_stop(src: &str, mut index: usize, limit: usize) -> Option<(usize, Stop)> {
    let bytes = src.as_bytes();
    let mut paren = 0i32;
    let mut bracket = 0i32;
    while index < limit {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = skip_string(src, index)?;
            continue;
        }
        if byte == b'/' && index + 1 < limit && bytes[index + 1] == b'*' {
            index = skip_comment(src, index);
            continue;
        }
        if byte == b'\\' {
            index = bump(src, index);
            if index < limit {
                index = bump(src, index);
            }
            continue;
        }
        match byte {
            b'(' => paren += 1,
            b')' => {
                if paren == 0 {
                    return None;
                }
                paren -= 1;
            }
            b'[' => bracket += 1,
            b']' => {
                if bracket == 0 {
                    return None;
                }
                bracket -= 1;
            }
            b'{' if paren == 0 && bracket == 0 => return Some((index, Stop::Brace)),
            b';' if paren == 0 && bracket == 0 => return Some((index, Stop::Semi)),
            b'}' if paren == 0 && bracket == 0 => return None,
            _ => {}
        }
        index = bump(src, index);
    }
    None
}

fn matching_brace(src: &str, open: usize, limit: usize) -> Option<usize> {
    let bytes = src.as_bytes();
    let mut index = open;
    let mut depth = 0i32;
    while index < limit {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = skip_string(src, index)?;
            continue;
        }
        if byte == b'/' && index + 1 < limit && bytes[index + 1] == b'*' {
            index = skip_comment(src, index);
            continue;
        }
        if byte == b'\\' {
            index = bump(src, index);
            if index < limit {
                index = bump(src, index);
            }
            continue;
        }
        if byte == b'{' {
            depth += 1;
        } else if byte == b'}' {
            depth -= 1;
            if depth == 0 {
                return Some(index);
            }
        }
        index = bump(src, index);
    }
    None
}

fn property_name(raw: &str) -> Option<String> {
    let mut name = String::new();
    let bytes = raw.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }
        if bytes[index] == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(raw, index);
            continue;
        }
        if bytes[index] == b'\\' {
            return None;
        }
        let ch = raw[index..].chars().next()?;
        name.push(ch);
        index += ch.len_utf8();
    }
    if name.starts_with("--") && name.len() > 2 {
        return Some(name);
    }
    let bytes = name.as_bytes();
    let mut index = 0;
    if bytes.first() == Some(&b'-') {
        index = 1;
    }
    let start = name[index..].chars().next()?;
    if !is_ident_start(start) {
        return None;
    }
    if !name[index + start.len_utf8()..].chars().all(is_name_char) {
        return None;
    }
    Some(name.to_ascii_lowercase())
}

fn is_important(value: &str) -> bool {
    let bytes = value.as_bytes();
    let mut index = 0;
    let mut paren = 0i32;
    let mut bang = None;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = match skip_string(value, index) {
                Some(next) => next,
                None => return false,
            };
            bang = None;
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(value, index);
            continue;
        }
        if byte == b'(' {
            paren += 1;
            bang = None;
            index += 1;
            continue;
        }
        if byte == b')' {
            paren -= 1;
            bang = None;
            index += 1;
            continue;
        }
        if byte.is_ascii_whitespace() {
            index += 1;
            continue;
        }
        if paren == 0 && byte == b'!' {
            bang = Some(index);
            index += 1;
            continue;
        }
        if let Some(at) = bang {
            if only_gap(&value[at + 1..index]) {
                let rest = &value[index..];
                let ident_end = rest
                    .char_indices()
                    .find(|(_, ch)| !is_name_char(*ch))
                    .map(|(offset, _)| offset)
                    .unwrap_or(rest.len());
                let ident = &rest[..ident_end];
                if ident.eq_ignore_ascii_case("important") && only_gap(&rest[ident_end..]) {
                    return true;
                }
            }
        }
        bang = None;
        index = bump(value, index);
    }
    false
}

fn read_ident(src: &str, start: usize) -> Option<(String, usize)> {
    let bytes = src.as_bytes();
    if start >= bytes.len() {
        return None;
    }
    let mut index = start;
    if bytes[index] == b'-' {
        index += 1;
        if index < bytes.len() && bytes[index] == b'-' {
            index += 1;
        }
    }
    if index >= bytes.len() {
        return None;
    }
    let ch = src[index..].chars().next()?;
    if !is_ident_start(ch) {
        return None;
    }
    index += ch.len_utf8();
    while index < bytes.len() {
        let ch = src[index..].chars().next()?;
        if ch == '\\' {
            return None;
        }
        if !is_name_char(ch) {
            break;
        }
        index += ch.len_utf8();
    }
    Some((src[start..index].to_ascii_lowercase(), index))
}

fn normalize_prelude(raw: &str) -> String {
    let mut out = String::new();
    let bytes = raw.as_bytes();
    let mut index = 0;
    let mut quote: Option<u8> = None;
    let mut pending_space = false;
    while index < bytes.len() {
        let byte = bytes[index];
        if let Some(mark) = quote {
            let ch = raw[index..].chars().next().unwrap();
            out.push(ch);
            index += ch.len_utf8();
            if byte == b'\\' && index < bytes.len() {
                let escaped = raw[index..].chars().next().unwrap();
                out.push(escaped);
                index += escaped.len_utf8();
                continue;
            }
            if byte == mark {
                quote = None;
            }
            continue;
        }
        if byte == b'"' || byte == b'\'' {
            if pending_space && !out.is_empty() {
                out.push(' ');
            }
            pending_space = false;
            quote = Some(byte);
            out.push(byte as char);
            index += 1;
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(raw, index);
            pending_space = true;
            continue;
        }
        if byte.is_ascii_whitespace() {
            pending_space = true;
            index += 1;
            continue;
        }
        if pending_space && !out.is_empty() {
            out.push(' ');
        }
        pending_space = false;
        let ch = raw[index..].chars().next().unwrap();
        out.push(ch);
        index += ch.len_utf8();
    }
    out.trim().to_string()
}

fn only_gap(text: &str) -> bool {
    let bytes = text.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }
        if bytes[index] == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(text, index);
            continue;
        }
        return false;
    }
    true
}

fn has_comment(text: &str) -> bool {
    let bytes = text.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            index = match skip_string(text, index) {
                Some(next) => next,
                None => return false,
            };
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            return true;
        }
        index = bump(text, index);
    }
    false
}

fn skip(src: &str, mut index: usize) -> usize {
    let bytes = src.as_bytes();
    while index < bytes.len() {
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }
        if bytes[index] == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(src, index);
            continue;
        }
        break;
    }
    index
}

fn skip_string(src: &str, start: usize) -> Option<usize> {
    let quote = src.as_bytes()[start];
    let mut index = start + 1;
    let bytes = src.as_bytes();
    while index < bytes.len() {
        if bytes[index] == b'\\' {
            index = bump(src, index);
            if index < bytes.len() {
                index = bump(src, index);
            }
            continue;
        }
        if bytes[index] == quote {
            return Some(index + 1);
        }
        index = bump(src, index);
    }
    None
}

fn skip_comment(src: &str, start: usize) -> usize {
    let bytes = src.as_bytes();
    let mut index = start + 2;
    while index + 1 < bytes.len() && !(bytes[index] == b'*' && bytes[index + 1] == b'/') {
        index = bump(src, index);
    }
    if index + 1 < bytes.len() {
        index + 2
    } else {
        src.len()
    }
}

fn bump(src: &str, index: usize) -> usize {
    match src[index..].chars().next() {
        Some(ch) => index + ch.len_utf8(),
        None => index,
    }
}

fn is_ident_start(ch: char) -> bool {
    ch == '_' || ch.is_ascii_alphabetic() || !ch.is_ascii()
}

fn is_name_char(ch: char) -> bool {
    is_ident_start(ch) || ch.is_ascii_digit() || ch == '-'
}

#[cfg(test)]
mod tests {
    use super::optimize_css;

    fn css(source: &str, expected: &str) {
        let out = optimize_css(source);
        assert_eq!(out, expected, "source:\n{source}");
        assert_eq!(optimize_css(&out), out);
    }

    #[test]
    fn drops_a_declaration_that_a_later_one_overrides() {
        css(".a { color: red; color: blue; }\n", ".a { color: blue; }\n");
        css(
            ".a {\n  color: red;\n  color: blue;\n}\n",
            ".a {\n  color: blue;\n}\n",
        );
        css(
            ".a { margin-top: 1px; margin: 0; }\n",
            ".a { margin: 0; }\n",
        );
        css(
            ".a { margin: 0; margin-top: 1px; }\n",
            ".a { margin: 0; margin-top: 1px; }\n",
        );
        css(
            ".a { margin-top: 1px !important; margin: 0; }\n",
            ".a { margin-top: 1px !important; margin: 0; }\n",
        );
    }

    #[test]
    fn important_beats_a_later_normal_declaration() {
        css(
            ".a { color: red !important; color: blue; }\n",
            ".a { color: red !important; }\n",
        );
        css(
            ".a { color: red; color: blue !important; }\n",
            ".a { color: blue !important; }\n",
        );
        css(
            ".a { color: red !important; color: green !important; }\n",
            ".a { color: green !important; }\n",
        );
        css(
            ".a { --Ink: 1; --ink: 2; --Ink: 3; }\n",
            ".a { --ink: 2; --Ink: 3; }\n",
        );
    }

    #[test]
    fn merges_adjacent_rules_and_then_drops_the_loser() {
        css(
            ".a { color: red; }\n.a { color: blue; }\n",
            ".a { color: blue; }\n",
        );
        css(
            ".a { color: red; }\n.b { color: green; }\n.a { margin: 0px; }\n",
            ".a { color: red; }\n.b { color: green; }\n.a { margin: 0; }\n",
        );
        css(".empty { }\n.a { color: red; }\n", ".a { color: red; }\n");
        css(
            ".a { /* note */ }\n.b { color: red; }\n",
            ".a { /* note */ }\n.b { color: red; }\n",
        );
    }

    #[test]
    fn merges_matching_media_and_drops_replaced_keyframes() {
        css(
            "@media screen {\n  .a { color: red; }\n}\n@media screen {\n  .a { color: blue; }\n}\n",
            "@media screen {\n  .a { color: blue; }\n}\n",
        );
        css(
            "@keyframes fade { from { opacity: 0; } }\n.a { color: red; }\n@keyframes fade { from { opacity: 1; } }\n",
            ".a { color: red; }\n@keyframes fade { from { opacity: 1; } }\n",
        );
        css(
            "@font-face { font-family: A; src: url(a.woff); }\n@font-face { font-family: B; src: url(b.woff); }\n",
            "@font-face { font-family: A; src: url(a.woff); }\n@font-face { font-family: B; src: url(b.woff); }\n",
        );
    }

    #[test]
    fn keeps_strings_comments_and_unparseable_input() {
        css(
            "/*! keep */\n.a { content: \"color: red;\"; color: blue; }\n",
            "/*! keep */\n.a { content: \"color: red;\"; color: blue; }\n",
        );
        css(
            ".a { content: \"/* stay */\"; color: red; color: blue; }\n",
            ".a { content: \"/* stay */\"; color: blue; }\n",
        );
        let broken = ".a { content: \"unterminated }\n.b { color: red; color: blue; }\n";
        assert_eq!(optimize_css(broken), broken);
        assert_eq!(optimize_css("{{{{"), "{{{{");
    }

    #[test]
    fn rewrites_shorthands_selectors_and_duplicate_blocks() {
        css(
            ".a { border-top-color: red; border-color: green; }\n",
            ".a { border-color: green; }\n",
        );
        css(
            ".a { border-top: 1px solid red; border-color: green; }\n",
            ".a { border-top: 1px solid red; border-color: green; }\n",
        );
        css(
            ".a { font-weight: bold; font: 16px serif; }\n",
            ".a { font: 16px serif; }\n",
        );
        css(
            ".a { color: red; }\n.b { color: red; }\n",
            ".a,.b { color: red; }\n",
        );
        css(".a, .a, .b { color: red; }\n", ".a,.b { color: red; }\n");
        css(
            ".a { margin-top: 1px; margin-right: 2px; margin-bottom: 3px; margin-left: 4px; }\n",
            ".a { margin: 1px 2px 3px 4px; }\n",
        );
        css(
            ".a { margin: 1px 2px 1px 2px; }\n",
            ".a { margin: 1px 2px; }\n",
        );
        css(".a { margin: 1px 1px 1px 1px; }\n", ".a { margin: 1px; }\n");
        css(".a { font-weight: bold; }\n", ".a { font-weight: 700; }\n");
        css(
            ".a { font-weight: normal; }\n",
            ".a { font-weight: 400; }\n",
        );
        css(
            ".a { padding-top: 1px; padding: -1px; }\n",
            ".a { padding-top: 1px; }\n",
        );
        css(
            ".a { background-repeat: no-repeat no-repeat; }\n",
            ".a { background-repeat: no-repeat; }\n",
        );
        css(
            ".a { color: red; margin: 0; }\n.b { padding: 1px; }\n.a { color: green; }\n",
            ".a { margin: 0; }\n.b { padding: 1px; }\n.a { color: green; }\n",
        );
        css(
            ".a { color: red; }\n.b { color: blue; }\n.a { color: green; }\n",
            ".a { color: red; }\n.b { color: blue; }\n.a { color: green; }\n",
        );
        css(
            ".a { color: red; }\n.b { margin: 0; }\n.a { color: red; }\n",
            ".b { margin: 0; }\n.a { color: red; }\n",
        );
        css(
            "@font-face { font-family: A; src: url(a.woff); }\n@font-face { font-family: A; src: url(a.woff); }\n",
            "@font-face { font-family: A; src: url(a.woff); }\n",
        );
        css(
            "@media screen { .a { color: red; } }\n.b { color: blue; }\n@media screen { .a { color: red; } }\n",
            ".b { color: blue; }\n@media screen { .a { color: red; } }\n",
        );
        css(
            "@charset \"utf-8\";\n@import \"a.css\";\n.a { color: red; }\n@import \"late.css\";\n@charset \"nope\";\n",
            "@charset \"utf-8\";\n@import \"a.css\";\n.a { color: red; }\n",
        );
        css(
            "@layer base;\n@import \"a.css\";\n.a { color: red; }\n",
            "@layer base;\n@import \"a.css\";\n.a { color: red; }\n",
        );
        css(
            "@layer base { .a { color: red; } }\n@import \"late.css\";\n",
            "@layer base { .a { color: red; } }\n",
        );
        css(
            ".a { color: red; margin: 0; padding: 0; }\n.b { color: blue; margin: 0; padding: 0; }\n",
            ".a{color:red}\n.a,.b{margin:0;padding:0}\n.b{color:blue}\n",
        );
        css(".a { color: #ffffff; }\n", ".a { color: #fff; }\n");
        css(".a { color: yellow; }\n", ".a { color: #ff0; }\n");
        css(".a { color: rgb(255, 0, 0); }\n", ".a { color: #f00; }\n");
        css(
            ".a { color: hsl(0, 100%, 50%); }\n",
            ".a { color: #f00; }\n",
        );
        css(".a { margin: 0px; }\n", ".a { margin: 0; }\n");
        css(".a { width: 0.50rem; }\n", ".a { width: .5rem; }\n");
        css(
            ".a { animation-duration: 100ms; }\n",
            ".a { animation-duration: .1s; }\n",
        );
        css(
            ".a { background: url(\"icon.png\"); }\n",
            ".a { background: url(icon.png); }\n",
        );
        css(
            ".a { background: url(\"a b.png\"); }\n",
            ".a { background: url(\"a b.png\"); }\n",
        );
        css(
            ".a { font-family: \"Arial\"; }\n",
            ".a { font-family: Arial; }\n",
        );
        css(
            ".a { font-family: \"sans-serif\"; }\n",
            ".a { font-family: \"sans-serif\"; }\n",
        );
        css(".a { background: none; }\n", ".a { background: none; }\n");
        css(
            ".a { box-shadow: 0px 0px 0px 0px; }\n",
            ".a { box-shadow: 0 0; }\n",
        );
        css(
            ".a { overflow-x: hidden; overflow-y: hidden; }\n",
            ".a { overflow: hidden; }\n",
        );
        css(
            ".a { row-gap: 1px; column-gap: 2px; }\n",
            ".a { gap: 1px 2px; }\n",
        );
        css(
            ".a { outline-width: 1px; outline-style: solid; outline-color: red; }\n",
            ".a { outline: 1px solid red; }\n",
        );
        css("div + span { color: red; }\n", "div+span { color: red; }\n");
        css(
            ".a:nth-child(2n + 1) { color: red; }\n",
            ".a:nth-child(2n+1) { color: red; }\n",
        );
        css(".empty {}\n@font-face {}\n", "");
        css(
            ".a { background: color-mix(in srgb, var(--accent) 14%, #fff); }\n",
            ".a { background: color-mix(in srgb, var(--accent) 14%, #fff); }\n",
        );
    }

    #[test]
    fn keeps_storybook_stylesheets_stable_and_no_larger() {
        for source in [
            include_str!("../examples/storybook/src/workshop.css"),
            include_str!("../examples/storybook/src/ui.css"),
            include_str!("../examples/foundry/src/foundry.css"),
        ] {
            let out = optimize_css(source);
            assert_eq!(
                optimize_css(&out),
                out,
                "second pass changed the stylesheet"
            );
            assert!(
                out.len() <= source.len(),
                "optimizer grew {} to {}",
                source.len(),
                out.len()
            );
            let probed = format!(".probe {{ --probe: 1; --probe: 2; }}\n{source}");
            let probed = optimize_css(&probed);
            assert!(
                !probed.contains("--probe: 1"),
                "stylesheet did not parse:\n{probed}"
            );
            assert!(probed.contains("--probe: 2"));
        }
        let ui = include_str!("../examples/storybook/src/ui.css");
        let out = optimize_css(ui);
        assert!(out.contains("var(--accent) 14%"), "{out}");
        assert!(out.contains("article::before"), "{out}");
        assert!(out.contains("content: \"\""), "{out}");
        assert!(
            out.contains("font: inherit") || out.contains("font:inherit"),
            "{out}"
        );
        assert!(out.contains("solid transparent"), "{out}");
    }
}
