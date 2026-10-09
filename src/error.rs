use std::fmt;

/// A bundling failure, with enough context to point at the file involved.
#[derive(Debug)]
pub struct BundleError {
    message: String,
}

impl BundleError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl fmt::Display for BundleError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for BundleError {}

pub type BundleResult<T> = Result<T, BundleError>;
