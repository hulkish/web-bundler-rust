/// Grow comment spans over the spaces and the line they occupied.
///
/// A comment-only line takes its indent and its line break with it. Spaces and
/// tabs beside a comment are included too. A kept comment stops the growth, and
/// its own whitespace stays put. Callers still insert [`trivia_gap`] so two
/// tokens do not merge.
pub fn expand_comment_spans(
    source: &str,
    cuts: &[(u32, u32)],
    blockers: &[(u32, u32)],
) -> Vec<(u32, u32)> {
    if cuts.is_empty() {
        return Vec::new();
    }
    let bytes = source.as_bytes();
    let widened = cuts
        .iter()
        .filter(|(start, end)| start < end)
        .map(|&(start, end)| widen_horizontal(bytes, start as usize, end as usize, blockers))
        .map(|(start, end)| (start as u32, end as u32))
        .collect::<Vec<_>>();
    let widened = merge_spans(widened);
    let absorbed = widened
        .iter()
        .copied()
        .map(|(start, end)| absorb_owned_line(bytes, start, end, &widened, blockers))
        .collect::<Vec<_>>();
    merge_spans(absorbed)
}

fn widen_horizontal(
    bytes: &[u8],
    mut start: usize,
    mut end: usize,
    blockers: &[(u32, u32)],
) -> (usize, usize) {
    let shares_line = line_contains_blocker(bytes, start, blockers);
    while start > 0 && is_hspace(bytes[start - 1]) {
        if whitespace_run_touches_blocker(bytes, start - 1, blockers)
            || (shares_line && is_indent(bytes, start))
        {
            break;
        }
        start -= 1;
    }
    while end < bytes.len() && is_hspace(bytes[end]) {
        if whitespace_run_touches_blocker(bytes, end, blockers) {
            break;
        }
        end += 1;
    }
    (start, end)
}

fn absorb_owned_line(
    bytes: &[u8],
    start: u32,
    end: u32,
    spans: &[(u32, u32)],
    blockers: &[(u32, u32)],
) -> (u32, u32) {
    let start_at = start as usize;
    let end_at = end as usize;
    let region_start = line_start(bytes, start_at);
    let break_at = line_break(bytes, end_at);
    if !region_owned(bytes, region_start, break_at, spans) {
        return (start, end);
    }
    let region_end = consume_break(bytes, break_at);
    if range_hits_blocker(region_start, region_end, blockers) {
        return (start, end);
    }
    (region_start as u32, region_end as u32)
}

fn region_owned(bytes: &[u8], start: usize, end: usize, spans: &[(u32, u32)]) -> bool {
    bytes[start..end].iter().enumerate().all(|(offset, byte)| {
        is_hspace(*byte)
            || *byte == b'\n'
            || *byte == b'\r'
            || in_span((start + offset) as u32, spans)
    })
}

fn line_contains_blocker(bytes: &[u8], index: usize, blockers: &[(u32, u32)]) -> bool {
    let start = line_start(bytes, index) as u32;
    let end = line_break(bytes, index) as u32;
    blockers
        .iter()
        .any(|&(block_start, block_end)| block_end > start && block_start < end)
}

fn is_indent(bytes: &[u8], index: usize) -> bool {
    let start = line_start(bytes, index);
    bytes[start..index].iter().copied().all(is_hspace)
}

fn whitespace_run_touches_blocker(bytes: &[u8], index: usize, blockers: &[(u32, u32)]) -> bool {
    let mut left = index;
    while left > 0 && is_hspace(bytes[left - 1]) {
        left -= 1;
    }
    let mut right = index + 1;
    while right < bytes.len() && is_hspace(bytes[right]) {
        right += 1;
    }
    (left > 0 && in_span((left - 1) as u32, blockers)) || in_span(right as u32, blockers)
}

fn in_span(pos: u32, spans: &[(u32, u32)]) -> bool {
    spans.iter().any(|&(start, end)| pos >= start && pos < end)
}

fn range_hits_blocker(start: usize, end: usize, blockers: &[(u32, u32)]) -> bool {
    let start = start as u32;
    let end = end as u32;
    blockers
        .iter()
        .any(|&(block_start, block_end)| block_end > start && block_start < end)
}

fn line_start(bytes: &[u8], index: usize) -> usize {
    bytes[..index]
        .iter()
        .rposition(|byte| *byte == b'\n' || *byte == b'\r')
        .map(|pos| pos + 1)
        .unwrap_or(0)
}

fn line_break(bytes: &[u8], index: usize) -> usize {
    bytes[index..]
        .iter()
        .position(|byte| *byte == b'\n' || *byte == b'\r')
        .map(|pos| index + pos)
        .unwrap_or(bytes.len())
}

fn consume_break(bytes: &[u8], index: usize) -> usize {
    match bytes.get(index).copied() {
        Some(b'\r') if bytes.get(index + 1).copied() == Some(b'\n') => index + 2,
        Some(b'\n' | b'\r') => index + 1,
        _ => index,
    }
}

fn is_hspace(byte: u8) -> bool {
    byte == b' ' || byte == b'\t'
}

fn merge_spans(mut spans: Vec<(u32, u32)>) -> Vec<(u32, u32)> {
    spans.sort_by_key(|span| (span.0, span.1));
    let mut merged: Vec<(u32, u32)> = Vec::with_capacity(spans.len());
    for (start, end) in spans {
        if let Some(last) = merged.last_mut() {
            if start <= last.1 {
                last.1 = last.1.max(end);
                continue;
            }
        }
        merged.push((start, end));
    }
    merged
}

/// Copy `source`, dropping `cuts` and leaving [`trivia_gap`] where tokens would meet.
pub fn splice_cuts(source: &str, cuts: &[(u32, u32)]) -> String {
    let mut out = String::with_capacity(source.len());
    let mut cursor = 0u32;
    for &(start, end) in cuts {
        if end <= cursor || start >= end {
            continue;
        }
        let copy_to = start.max(cursor);
        if copy_to > cursor {
            out.push_str(&source[cursor as usize..copy_to as usize]);
        }
        if end <= source.len() as u32 {
            out.push_str(trivia_gap(source, start, end));
        }
        cursor = end;
    }
    if (cursor as usize) < source.len() {
        out.push_str(&source[cursor as usize..]);
    }
    out
}

/// A space to leave behind when a comment is the only thing separating two tokens.
///
/// Line breaks that existed only inside the removed comment are not put back.
/// A line break outside the comment stays in the source around the cut.
pub fn trivia_gap(source: &str, start: u32, end: u32) -> &'static str {
    let bytes = source.as_bytes();
    let start = start as usize;
    let end = (end as usize).min(bytes.len());
    if start >= end || start > bytes.len() {
        return "";
    }
    let before = start
        .checked_sub(1)
        .and_then(|index| bytes.get(index).copied());
    let after = bytes.get(end).copied();
    if before.is_none_or(|byte| byte.is_ascii_whitespace())
        || after.is_none_or(|byte| byte.is_ascii_whitespace())
    {
        return "";
    }
    " "
}

/// Drop every CSS comment, including `/*! ... */`, `@license`, and `@preserve`.
/// Text inside strings is left alone.
pub fn strip_css_comments(source: &str) -> String {
    let cuts = css_comment_spans(source);
    splice_cuts(source, &expand_comment_spans(source, &cuts, &[]))
}

fn css_comment_spans(source: &str) -> Vec<(u32, u32)> {
    let bytes = source.as_bytes();
    let mut spans = Vec::new();
    let mut index = 0;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            let quote = byte;
            index += 1;
            while index < bytes.len() {
                let current = bytes[index];
                index += 1;
                if current == b'\\' && index < bytes.len() {
                    index += 1;
                    continue;
                }
                if current == quote {
                    break;
                }
            }
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            let start = index;
            index += 2;
            while index + 1 < bytes.len() && !(bytes[index] == b'*' && bytes[index + 1] == b'/') {
                index += 1;
            }
            if index + 1 < bytes.len() {
                index += 2;
            } else {
                index = bytes.len();
            }
            spans.push((start as u32, index as u32));
            continue;
        }
        index += 1;
    }
    spans
}

#[cfg(test)]
mod tests {
    use super::{expand_comment_spans, splice_cuts, strip_css_comments, trivia_gap};

    fn strip_spans(source: &str, comments: &[&str]) -> String {
        let cuts = comments
            .iter()
            .map(|comment| {
                let start = source.find(comment).expect(comment) as u32;
                (start, start + comment.len() as u32)
            })
            .collect::<Vec<_>>();
        splice_cuts(source, &expand_comment_spans(source, &cuts, &[]))
    }

    #[test]
    fn gap_keeps_tokens_apart() {
        assert_eq!(trivia_gap("a/*c*/b", 1, 6), " ");
        assert_eq!(trivia_gap("a /*c*/ b", 2, 7), "");
        assert_eq!(trivia_gap("a/*\n*/b", 1, 6), " ");
        assert_eq!(trivia_gap("return/*c*/1", 6, 11), " ");
    }

    #[test]
    fn css_drops_notes_licenses_and_keeps_strings() {
        let css = ".a { content: \"/* stay */\"; color: red; } /* drop */\n/*! keep */\n/* @license notice */\n/* @preserve banner */\n";
        let stripped = strip_css_comments(css);
        assert!(!stripped.contains("drop"), "{stripped}");
        assert!(!stripped.contains("keep"), "{stripped}");
        assert!(!stripped.contains("@license"), "{stripped}");
        assert!(!stripped.contains("@preserve"), "{stripped}");
        assert!(stripped.contains("/* stay */"), "{stripped}");
        assert!(stripped.contains("color: red"), "{stripped}");
    }

    #[test]
    fn stripping_removes_lines_and_whitespace_the_comment_occupied() {
        assert_eq!(strip_spans("a /*c*/ b", &["/*c*/"]), "a b");
        assert_eq!(strip_spans("return/*c*/1", &["/*c*/"]), "return 1");
        assert_eq!(
            strip_spans("    // drop\n    keep();\n", &["// drop"]),
            "    keep();\n"
        );
        assert_eq!(
            strip_spans("    // drop\r\n    keep();\r\n", &["// drop"]),
            "    keep();\r\n"
        );
        assert_eq!(
            strip_spans("code // tail\nnext();\n", &["// tail"]),
            "code\nnext();\n"
        );
        assert_eq!(
            strip_spans(
                "before\n    // one\n    /* two */\nafter\n",
                &["// one", "/* two */"]
            ),
            "before\nafter\n"
        );
        assert_eq!(strip_spans("a/*\n*/b", &["/*\n*/"]), "a b");
        assert_eq!(
            strip_spans("return/*\ninside\n*/1;", &["/*\ninside\n*/"]),
            "return 1;"
        );
        assert_eq!(
            strip_spans(
                "const b = 2; /* tail\nstill comment\n*/ const c = 3;\n",
                &["/* tail\nstill comment\n*/"]
            ),
            "const b = 2; const c = 3;\n"
        );
        assert_eq!(
            strip_spans(
                "const a = 1;\n/*\n * drop\n */\nconst b = 2;\n",
                &["/*\n * drop\n */"]
            ),
            "const a = 1;\nconst b = 2;\n"
        );
        assert_eq!(strip_spans("return\n// c\n1;\n", &["// c"]), "return\n1;\n");
    }

    #[test]
    fn kept_comments_hold_onto_their_whitespace() {
        let source = "    /* drop */\n    /*! keep */\n";
        let drop_at = source.find("/* drop */").unwrap() as u32;
        let keep_at = source.find("/*! keep */").unwrap() as u32;
        let cuts = [(drop_at, drop_at + "/* drop */".len() as u32)];
        let blockers = [(keep_at, keep_at + "/*! keep */".len() as u32)];
        let stripped = splice_cuts(source, &expand_comment_spans(source, &cuts, &blockers));
        assert_eq!(stripped, "    /*! keep */\n");
    }

    #[test]
    fn css_drops_the_line_a_comment_occupied() {
        let css = "body { color: red; }\n/* drop */\nh1 { color: blue; }\n";
        assert_eq!(
            strip_css_comments(css),
            "body { color: red; }\nh1 { color: blue; }\n"
        );
        let inline = ".a /* note */ { color: red; }";
        assert_eq!(strip_css_comments(inline), ".a { color: red; }");
        let kept = "body { color: red; } /* drop */\n    /*! keep */\n";
        assert_eq!(strip_css_comments(kept), "body { color: red; }\n");
    }
}
