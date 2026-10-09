//! Local images referenced from CSS.
//!
//! A relative `url(...)` that points at a PNG, SVG, or other image on disk
//! becomes an output asset. The bundled CSS points at that emitted file.
//! Remote, data, and missing urls are left as written.

use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone)]
pub struct ImageRef {
    /// Byte range of the whole `url(...)` token in the CSS source.
    pub start: u32,
    pub end: u32,
    pub path: PathBuf,
}

const IMAGE_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "avif"];

/// Image files referenced by local `url(...)` tokens in `css`.
pub fn image_refs(from: &Path, css: &str) -> Vec<ImageRef> {
    let bytes = css.as_bytes();
    let mut refs = Vec::new();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index = skip_comment(bytes, index);
            continue;
        }
        if bytes[index] == b'"' || bytes[index] == b'\'' {
            index = skip_string(bytes, index);
            continue;
        }
        if let Some(url) = read_url(bytes, index) {
            if let Some(path) = local_image(from, &url.specifier) {
                refs.push(ImageRef {
                    start: index as u32,
                    end: url.end as u32,
                    path,
                });
            }
            index = url.end;
            continue;
        }
        index += 1;
    }
    refs
}

/// Replace recorded `url(...)` tokens with the emitted asset name.
pub fn rewrite_css_images(
    css: &str,
    refs: &[ImageRef],
    mut name_of: impl FnMut(&Path) -> Option<String>,
) -> String {
    if refs.is_empty() {
        return css.to_string();
    }
    let mut order = (0..refs.len()).collect::<Vec<_>>();
    order.sort_by_key(|index| refs[*index].start);
    let mut out = String::with_capacity(css.len());
    let mut cursor = 0usize;
    for index in order {
        let reference = &refs[index];
        let start = reference.start as usize;
        let end = reference.end as usize;
        if start < cursor || end > css.len() || start > end {
            continue;
        }
        out.push_str(&css[cursor..start]);
        match name_of(&reference.path) {
            Some(name) => {
                out.push_str("url(\"./");
                out.push_str(&escape_css_string(&name));
                out.push_str("\")");
            }
            None => out.push_str(&css[start..end]),
        }
        cursor = end;
    }
    out.push_str(&css[cursor..]);
    out
}

struct UrlToken {
    end: usize,
    specifier: String,
}

fn read_url(bytes: &[u8], index: usize) -> Option<UrlToken> {
    if !is_url_ident(bytes, index) {
        return None;
    }
    let mut cursor = index + 3;
    cursor = skip_hspace(bytes, cursor);
    if cursor >= bytes.len() || bytes[cursor] != b'(' {
        return None;
    }
    cursor += 1;
    cursor = skip_hspace(bytes, cursor);
    if cursor >= bytes.len() {
        return None;
    }
    let (specifier, mut cursor) = if bytes[cursor] == b'"' || bytes[cursor] == b'\'' {
        let start = cursor + 1;
        cursor = skip_string(bytes, cursor);
        if cursor == bytes.len() {
            return None;
        }
        let raw = std::str::from_utf8(&bytes[start..cursor - 1]).ok()?;
        (raw.to_string(), cursor)
    } else {
        let start = cursor;
        while cursor < bytes.len() && !ends_unquoted_url(bytes[cursor]) {
            cursor += 1;
        }
        let raw = std::str::from_utf8(&bytes[start..cursor]).ok()?;
        (raw.to_string(), cursor)
    };
    cursor = skip_hspace(bytes, cursor);
    if cursor >= bytes.len() || bytes[cursor] != b')' {
        return None;
    }
    Some(UrlToken {
        end: cursor + 1,
        specifier,
    })
}

fn is_url_ident(bytes: &[u8], index: usize) -> bool {
    if index > 0 {
        let prev = bytes[index - 1];
        if prev.is_ascii_alphanumeric() || prev == b'_' || prev == b'-' {
            return false;
        }
    }
    index + 3 <= bytes.len() && bytes[index..index + 3].eq_ignore_ascii_case(b"url")
}

fn ends_unquoted_url(byte: u8) -> bool {
    byte.is_ascii_whitespace() || matches!(byte, b')' | b'"' | b'\'' | b'(')
}

fn skip_hspace(bytes: &[u8], mut index: usize) -> usize {
    while index < bytes.len() && matches!(bytes[index], b' ' | b'\t' | b'\n' | b'\r' | b'\x0c') {
        index += 1;
    }
    index
}

fn skip_comment(bytes: &[u8], index: usize) -> usize {
    let rest = &bytes[index + 2..];
    match rest.windows(2).position(|pair| pair == b"*/") {
        Some(found) => index + 2 + found + 2,
        None => bytes.len(),
    }
}

fn skip_string(bytes: &[u8], index: usize) -> usize {
    let quote = bytes[index];
    let mut cursor = index + 1;
    while cursor < bytes.len() {
        if bytes[cursor] == b'\\' && cursor + 1 < bytes.len() {
            cursor += 2;
            continue;
        }
        if bytes[cursor] == quote {
            return cursor + 1;
        }
        cursor += 1;
    }
    bytes.len()
}

fn local_image(from: &Path, specifier: &str) -> Option<PathBuf> {
    let specifier = specifier.trim();
    if specifier.is_empty()
        || specifier.starts_with('#')
        || specifier.starts_with("data:")
        || specifier.starts_with("//")
        || specifier.contains("://")
    {
        return None;
    }
    let path_part = specifier.split(['?', '#']).next().unwrap_or(specifier);
    let path_part = path_part.trim();
    if !is_image_path(path_part) {
        return None;
    }
    let base = from.parent().unwrap_or(Path::new("."));
    let candidate = if path_part.starts_with('/') {
        PathBuf::from(path_part)
    } else {
        base.join(path_part)
    };
    if !candidate.is_file() {
        return None;
    }
    fs::canonicalize(&candidate).ok()
}

fn is_image_path(path: &str) -> bool {
    let ext = path.rsplit('.').next().unwrap_or("");
    if ext == path {
        return false;
    }
    IMAGE_EXTENSIONS
        .iter()
        .any(|image| ext.eq_ignore_ascii_case(image))
}

fn escape_css_string(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    for ch in text.chars() {
        match ch {
            '\\' | '"' => {
                out.push('\\');
                out.push(ch);
            }
            _ => out.push(ch),
        }
    }
    out
}
