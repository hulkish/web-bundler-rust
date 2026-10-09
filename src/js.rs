use oxc_span::Span;

/// Encode a string as a JavaScript string literal, including quotes.
pub fn js_string(value: &str) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "\"\"".to_string())
}

/// `file://` URL for `import.meta.url`.
pub fn file_url(path: &std::path::Path) -> String {
    let mut url = String::from("file://");
    for byte in path.to_string_lossy().bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'/' | b'-' | b'_' | b'.' | b'~' => {
                url.push(byte as char);
            }
            _ => url.push_str(&format!("%{byte:02X}")),
        }
    }
    url
}

/// `{ foo }` shorthand, where `foo` should become `{ foo: expr }`.
///
/// Array elements such as `[foo, bar]` look similar from the neighboring
/// commas, so this checks that the surrounding brackets belong to an object.
pub fn is_shorthand_property(source: &str, span: Span) -> bool {
    let start = span.start as usize;
    let end = span.end as usize;
    if end > source.len() || start > end {
        return false;
    }
    let before = source[..start].chars().rev().find(|c| !c.is_whitespace());
    let after = source[end..].chars().find(|c| !c.is_whitespace());
    if !matches!(before, Some('{') | Some(',')) || !matches!(after, Some('}') | Some(',')) {
        return false;
    }
    enclosing_is_object(&source[..start])
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Opener {
    Brace,
    Bracket,
    Paren,
    /// `${ ... }` inside a template literal. The braces are not an object.
    Interpolation,
}

enum Mode {
    Code,
    Template,
}

fn enclosing_is_object(prefix: &str) -> bool {
    let bytes = prefix.as_bytes();
    let mut index = 0;
    let mut openers = Vec::new();
    let mut mode = Mode::Code;
    while index < bytes.len() {
        match mode {
            Mode::Code => {
                match bytes[index] {
                    b'\'' | b'"' => {
                        index = skip_string(bytes, index);
                    }
                    b'`' => mode = Mode::Template,
                    b'/' if index + 1 < bytes.len() && bytes[index + 1] == b'/' => {
                        index = skip_line_comment(bytes, index);
                    }
                    b'/' if index + 1 < bytes.len() && bytes[index + 1] == b'*' => {
                        index = skip_block_comment(bytes, index);
                    }
                    b'/' if starts_regex(bytes, index) => {
                        if let Some(end) = skip_regex(bytes, index) {
                            index = end;
                        }
                    }
                    b'{' => openers.push(Opener::Brace),
                    b'[' => openers.push(Opener::Bracket),
                    b'(' => openers.push(Opener::Paren),
                    b'}' => {
                        if openers.pop() == Some(Opener::Interpolation) {
                            mode = Mode::Template;
                        }
                    }
                    b']' | b')' => {
                        openers.pop();
                    }
                    _ => {}
                }
                index += 1;
            }
            Mode::Template => {
                match bytes[index] {
                    b'\\' => {
                        index += 2;
                        continue;
                    }
                    b'`' => mode = Mode::Code,
                    b'$' if index + 1 < bytes.len() && bytes[index + 1] == b'{' => {
                        openers.push(Opener::Interpolation);
                        mode = Mode::Code;
                        index += 2;
                        continue;
                    }
                    _ => {}
                }
                index += 1;
            }
        }
    }
    openers.last().copied() == Some(Opener::Brace)
}

fn starts_regex(bytes: &[u8], index: usize) -> bool {
    let Some(prev) = previous_non_whitespace(bytes, index) else {
        return true;
    };
    let byte = bytes[prev];
    if matches!(
        byte,
        b'(' | b'='
            | b','
            | b':'
            | b'['
            | b'!'
            | b'&'
            | b'|'
            | b'?'
            | b'+'
            | b'-'
            | b'*'
            | b'%'
            | b'^'
            | b'~'
            | b'<'
            | b'>'
            | b'{'
            | b';'
    ) {
        return true;
    }
    if !byte.is_ascii_alphabetic() {
        return false;
    }
    let mut start = prev;
    while start > 0 && bytes[start - 1].is_ascii_alphabetic() {
        start -= 1;
    }
    matches!(
        &bytes[start..=prev],
        b"return"
            | b"typeof"
            | b"case"
            | b"throw"
            | b"else"
            | b"void"
            | b"delete"
            | b"in"
            | b"of"
            | b"await"
            | b"yield"
            | b"instanceof"
            | b"do"
    )
}

fn previous_non_whitespace(bytes: &[u8], index: usize) -> Option<usize> {
    let mut cursor = index;
    while cursor > 0 {
        cursor -= 1;
        if !bytes[cursor].is_ascii_whitespace() {
            return Some(cursor);
        }
    }
    None
}

fn skip_regex(bytes: &[u8], start: usize) -> Option<usize> {
    let mut index = start + 1;
    let mut class = false;
    while index < bytes.len() {
        if bytes[index] == b'\\' {
            index += 2;
            continue;
        }
        if bytes[index] == b'\n' {
            return None;
        }
        if class {
            if bytes[index] == b']' {
                class = false;
            }
            index += 1;
            continue;
        }
        if bytes[index] == b'[' {
            class = true;
            index += 1;
            continue;
        }
        if bytes[index] == b'/' {
            index += 1;
            while index < bytes.len() && bytes[index].is_ascii_alphabetic() {
                index += 1;
            }
            return Some(index.saturating_sub(1));
        }
        index += 1;
    }
    None
}

fn skip_string(bytes: &[u8], start: usize) -> usize {
    let quote = bytes[start];
    let mut index = start + 1;
    while index < bytes.len() {
        if bytes[index] == b'\\' {
            index += 2;
            continue;
        }
        if bytes[index] == quote {
            return index;
        }
        index += 1;
    }
    bytes.len().saturating_sub(1)
}

fn skip_line_comment(bytes: &[u8], start: usize) -> usize {
    bytes[start..]
        .iter()
        .position(|byte| *byte == b'\n')
        .map(|offset| start + offset)
        .unwrap_or(bytes.len().saturating_sub(1))
}

fn skip_block_comment(bytes: &[u8], start: usize) -> usize {
    let mut index = start + 2;
    while index + 1 < bytes.len() {
        if bytes[index] == b'*' && bytes[index + 1] == b'/' {
            return index + 1;
        }
        index += 1;
    }
    bytes.len().saturating_sub(1)
}

pub fn slice(source: &str, span: Span) -> &str {
    let start = (span.start as usize).min(source.len());
    let end = (span.end as usize).min(source.len());
    &source[start..end.max(start)]
}
