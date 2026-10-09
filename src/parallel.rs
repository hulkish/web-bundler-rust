//! Fixed-size worker pools for independent bundler jobs.
//!
//! Results come back in input order. A panic in one job becomes an error for
//! that job so the caller can still prefer an earlier failure.

use std::collections::VecDeque;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Condvar, Mutex};
use std::thread;

use crate::error::{BundleError, BundleResult};

/// Run `work` on up to `threads` workers. Output index `i` is `work` of input `i`.
pub fn try_map<T, R, F>(threads: usize, items: Vec<T>, work: F) -> BundleResult<Vec<R>>
where
    T: Send,
    R: Send,
    F: Fn(T) -> BundleResult<R> + Sync,
{
    if items.is_empty() {
        return Ok(Vec::new());
    }
    if threads <= 1 || items.len() == 1 {
        return items.into_iter().map(work).collect();
    }

    let length = items.len();
    let workers = threads.min(length);
    let pending = Mutex::new(items.into_iter().map(Some).collect::<Vec<_>>());
    let results = Mutex::new((0..length).map(|_| None).collect::<Vec<_>>());
    let next = AtomicUsize::new(0);

    thread::scope(|scope| {
        for _ in 0..workers {
            scope.spawn(|| loop {
                let index = next.fetch_add(1, Ordering::Relaxed);
                if index >= length {
                    break;
                }
                let item = {
                    let mut pending = pending.lock().unwrap();
                    pending.get_mut(index).and_then(Option::take)
                };
                let value = match item {
                    Some(item) => {
                        let value = catch_unwind(AssertUnwindSafe(|| work(item)));
                        match value {
                            Ok(value) => value,
                            Err(_) => Err(BundleError::new("a worker thread panicked")),
                        }
                    }
                    None => Err(BundleError::new("a worker thread stopped")),
                };
                results.lock().unwrap()[index] = Some(value);
            });
        }
    });

    let results = results.into_inner().unwrap();
    let mut ordered = Vec::with_capacity(results.len());
    for result in results {
        ordered.push(result.ok_or_else(|| BundleError::new("a worker thread stopped"))?);
    }
    ordered.into_iter().collect()
}

/// Paths waiting to be compiled. Workers block in [`JobQueue::pop`] until a path
/// arrives or [`JobQueue::close`] runs.
pub struct JobQueue {
    state: Mutex<JobState>,
    ready: Condvar,
}

struct JobState {
    jobs: VecDeque<PathBuf>,
    closed: bool,
}

impl JobQueue {
    pub fn new() -> Self {
        Self {
            state: Mutex::new(JobState {
                jobs: VecDeque::new(),
                closed: false,
            }),
            ready: Condvar::new(),
        }
    }

    pub fn push(&self, path: PathBuf) {
        let mut state = self.state.lock().unwrap();
        if state.closed {
            return;
        }
        state.jobs.push_back(path);
        self.ready.notify_one();
    }

    pub fn pop(&self) -> Option<PathBuf> {
        let mut state = self.state.lock().unwrap();
        loop {
            if let Some(path) = state.jobs.pop_front() {
                return Some(path);
            }
            if state.closed {
                return None;
            }
            state = self.ready.wait(state).unwrap();
        }
    }

    pub fn close(&self) {
        let mut state = self.state.lock().unwrap();
        state.closed = true;
        self.ready.notify_all();
    }
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use super::try_map;

    #[test]
    fn map_returns_results_in_input_order() {
        let values = try_map(4, (0..24).collect(), |item| {
            std::thread::sleep(Duration::from_millis(u64::from(24 - item)));
            Ok::<u32, crate::error::BundleError>(item)
        })
        .unwrap();
        assert_eq!(values, (0..24).collect::<Vec<_>>());
    }
}
