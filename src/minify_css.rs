//! Minify a bundled CSS file.
//!
//! Comments are removed the way the CSS parser removes them: the comment text
//! disappears and is not replaced by a space, so `a/**/b` stays the ident `ab`.
//! Whitespace that is a real separator stays. Descendant combinators, custom
//! property values, `calc()` signs, and `and (` in a media query are preserved.

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Kind {
    Ident,
    At,
    Hash,
    String,
    Url,
    Number,
    Dimension,
    Percentage,
    Colon,
    Semi,
    Comma,
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    OpenBracket,
    CloseBracket,
    Delim,
    Ws,
    Trivia,
}

struct Tok {
    kind: Kind,
    text: String,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Space {
    Selector,
    Value,
}

pub fn minify_css(source: &str) -> String {
    let erased = erase_comments(source);
    let tokens = tokenize(&erased);
    let mut writer = Writer {
        tokens,
        index: 0,
        out: String::new(),
    };
    writer.stylesheet();
    writer.out
}

fn erase_comments(source: &str) -> String {
    let bytes = source.as_bytes();
    let mut out = String::with_capacity(source.len());
    let mut index = 0;
    if source.starts_with('\u{feff}') {
        index = '\u{feff}'.len_utf8();
    }
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'"' || byte == b'\'' {
            let quote = byte;
            let start = index;
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
            out.push_str(&source[start..index]);
            continue;
        }
        if byte == b'/' && index + 1 < bytes.len() && bytes[index + 1] == b'*' {
            index += 2;
            while index + 1 < bytes.len() && !(bytes[index] == b'*' && bytes[index + 1] == b'/') {
                index += 1;
            }
            if index + 1 < bytes.len() {
                index += 2;
            } else {
                index = bytes.len();
            }
            continue;
        }
        let ch = source[index..].chars().next().unwrap();
        out.push(ch);
        index += ch.len_utf8();
    }
    out
}

struct Scanner<'a> {
    src: &'a str,
    i: usize,
}

impl<'a> Scanner<'a> {
    fn peek(&self) -> Option<char> {
        self.src[self.i..].chars().next()
    }

    fn peek_nth(&self, n: usize) -> Option<char> {
        self.src[self.i..].chars().nth(n)
    }

    fn bump(&mut self) -> Option<char> {
        let ch = self.peek()?;
        self.i += ch.len_utf8();
        Some(ch)
    }

    fn starts_ident(&self) -> bool {
        match self.peek() {
            Some('-') => match self.peek_nth(1) {
                Some('-') => true,
                Some('\\') => self.valid_escape_at(1),
                Some(ch) => is_ident_start(ch),
                None => false,
            },
            Some('\\') => self.valid_escape_at(0),
            Some(ch) => is_ident_start(ch),
            None => false,
        }
    }

    fn valid_escape_at(&self, n: usize) -> bool {
        self.peek_nth(n) == Some('\\')
            && !matches!(self.peek_nth(n + 1), Some('\n' | '\r' | '\u{000c}'))
    }

    fn starts_number(&self) -> bool {
        match self.peek() {
            Some('+') | Some('-') => match self.peek_nth(1) {
                Some(ch) if ch.is_ascii_digit() => true,
                Some('.') => self.peek_nth(2).is_some_and(|ch| ch.is_ascii_digit()),
                _ => false,
            },
            Some('.') => self.peek_nth(1).is_some_and(|ch| ch.is_ascii_digit()),
            Some(ch) => ch.is_ascii_digit(),
            None => false,
        }
    }

    fn consume_escape(&mut self) {
        if self.peek() != Some('\\') {
            return;
        }
        self.bump();
        let Some(ch) = self.peek() else {
            return;
        };
        if ch.is_ascii_hexdigit() {
            for _ in 0..6 {
                if self.peek().is_some_and(|item| item.is_ascii_hexdigit()) {
                    self.bump();
                } else {
                    break;
                }
            }
            if self.peek().is_some_and(is_ws) {
                self.bump();
            }
            return;
        }
        if ch != '\n' && ch != '\r' && ch != '\u{000c}' {
            self.bump();
        }
    }

    fn consume_name(&mut self) {
        loop {
            match self.peek() {
                Some(ch) if is_name_char(ch) => {
                    self.bump();
                }
                Some('\\') if self.valid_escape_at(0) => self.consume_escape(),
                _ => break,
            }
        }
    }

    fn consume_number_body(&mut self) {
        if matches!(self.peek(), Some('+') | Some('-')) {
            self.bump();
        }
        while self.peek().is_some_and(|ch| ch.is_ascii_digit()) {
            self.bump();
        }
        if self.peek() == Some('.') && self.peek_nth(1).is_some_and(|ch| ch.is_ascii_digit()) {
            self.bump();
            while self.peek().is_some_and(|ch| ch.is_ascii_digit()) {
                self.bump();
            }
        }
        if self.starts_exponent() {
            self.bump();
            if matches!(self.peek(), Some('+') | Some('-')) {
                self.bump();
            }
            while self.peek().is_some_and(|ch| ch.is_ascii_digit()) {
                self.bump();
            }
        }
    }

    fn starts_exponent(&self) -> bool {
        if !matches!(self.peek(), Some('e' | 'E')) {
            return false;
        }
        match self.peek_nth(1) {
            Some('+') | Some('-') => self.peek_nth(2).is_some_and(|ch| ch.is_ascii_digit()),
            Some(ch) => ch.is_ascii_digit(),
            None => false,
        }
    }
}

fn tokenize(source: &str) -> Vec<Tok> {
    let mut scan = Scanner { src: source, i: 0 };
    let mut tokens = Vec::new();
    while scan.i < scan.src.len() {
        if let Some(tok) = next_token(&mut scan) {
            tokens.push(tok);
        }
    }
    tokens
}

fn next_token(scan: &mut Scanner<'_>) -> Option<Tok> {
    let ch = scan.peek()?;
    if is_ws(ch) {
        while scan.peek().is_some_and(is_ws) {
            scan.bump();
        }
        return Some(tok(Kind::Ws, " "));
    }
    if ch == '"' || ch == '\'' {
        return Some(consume_string(scan, ch));
    }
    if ch == '/' && scan.peek_nth(1) == Some('*') {
        return Some(consume_comment(scan));
    }
    if ch == '#' {
        if scan.peek_nth(1).is_some_and(is_name_char) || scan.valid_escape_at(1) {
            let start = scan.i;
            scan.bump();
            scan.consume_name();
            return Some(tok(Kind::Hash, &scan.src[start..scan.i]));
        }
        scan.bump();
        return Some(tok(Kind::Delim, "#"));
    }
    if ch == '@' && (scan_starts_ident_after_at(scan)) {
        let start = scan.i;
        scan.bump();
        scan.consume_name();
        return Some(tok(Kind::At, &scan.src[start..scan.i]));
    }
    if scan.starts_number() {
        return Some(consume_numeric(scan));
    }
    if ch == '<'
        && scan.peek_nth(1) == Some('!')
        && scan.peek_nth(2) == Some('-')
        && scan.peek_nth(3) == Some('-')
    {
        scan.bump();
        scan.bump();
        scan.bump();
        scan.bump();
        return Some(tok(Kind::Trivia, "<!--"));
    }
    if ch == '-' && scan.peek_nth(1) == Some('-') && scan.peek_nth(2) == Some('>') {
        scan.bump();
        scan.bump();
        scan.bump();
        return Some(tok(Kind::Trivia, "-->"));
    }
    if scan.starts_ident() {
        return Some(consume_ident_like(scan));
    }
    scan.bump();
    Some(match ch {
        ':' => tok(Kind::Colon, ":"),
        ';' => tok(Kind::Semi, ";"),
        ',' => tok(Kind::Comma, ","),
        '(' => tok(Kind::OpenParen, "("),
        ')' => tok(Kind::CloseParen, ")"),
        '{' => tok(Kind::OpenBrace, "{"),
        '}' => tok(Kind::CloseBrace, "}"),
        '[' => tok(Kind::OpenBracket, "["),
        ']' => tok(Kind::CloseBracket, "]"),
        other => tok(Kind::Delim, &other.to_string()),
    })
}

fn scan_starts_ident_after_at(scan: &Scanner<'_>) -> bool {
    let rest = &scan.src[scan.i + '@'.len_utf8()..];
    let look = Scanner { src: rest, i: 0 };
    look.starts_ident()
}

fn consume_comment(scan: &mut Scanner<'_>) -> Tok {
    let start = scan.i;
    scan.bump();
    scan.bump();
    while scan.i < scan.src.len() {
        if scan.peek() == Some('*') && scan.peek_nth(1) == Some('/') {
            scan.bump();
            scan.bump();
            break;
        }
        scan.bump();
    }
    tok(Kind::Trivia, &scan.src[start..scan.i])
}

fn consume_string(scan: &mut Scanner<'_>, quote: char) -> Tok {
    let start = scan.i;
    scan.bump();
    while let Some(ch) = scan.peek() {
        if ch == quote {
            scan.bump();
            break;
        }
        if ch == '\n' || ch == '\r' || ch == '\u{000c}' {
            break;
        }
        if ch == '\\' {
            scan.consume_escape();
            continue;
        }
        scan.bump();
    }
    tok(Kind::String, &scan.src[start..scan.i])
}

fn consume_numeric(scan: &mut Scanner<'_>) -> Tok {
    let start = scan.i;
    scan.consume_number_body();
    if scan.starts_ident() {
        scan.consume_name();
        return tok(Kind::Dimension, &scan.src[start..scan.i]);
    }
    if scan.peek() == Some('%') {
        scan.bump();
        return tok(Kind::Percentage, &scan.src[start..scan.i]);
    }
    tok(Kind::Number, &scan.src[start..scan.i])
}

fn consume_ident_like(scan: &mut Scanner<'_>) -> Tok {
    let start = scan.i;
    scan.consume_name();
    let name = &scan.src[start..scan.i];
    if scan.peek() == Some('(') && name.eq_ignore_ascii_case("url") && !url_paren_holds_string(scan)
    {
        return consume_url(scan, start);
    }
    tok(Kind::Ident, name)
}

fn url_paren_holds_string(scan: &Scanner<'_>) -> bool {
    let mut chars = scan.src[scan.i..].chars();
    if chars.next() != Some('(') {
        return false;
    }
    for ch in chars {
        if is_ws(ch) {
            continue;
        }
        return ch == '"' || ch == '\'';
    }
    false
}

fn consume_url(scan: &mut Scanner<'_>, start: usize) -> Tok {
    scan.bump();
    while scan.peek().is_some_and(is_ws) {
        scan.bump();
    }
    if scan.peek() == Some(')') {
        scan.bump();
        return tok(Kind::Url, "url()");
    }
    let content = scan.i;
    loop {
        match scan.peek() {
            None => {
                return tok(Kind::Url, &scan.src[start..scan.i]);
            }
            Some(')') => {
                let inner = scan.src[content..scan.i].trim_end_matches(is_ws);
                scan.bump();
                return tok(Kind::Url, &format!("url({inner})"));
            }
            Some(ch) if is_ws(ch) => {
                if only_ws_until_paren(scan) {
                    let inner = scan.src[content..scan.i].trim_end_matches(is_ws);
                    while scan.peek().is_some_and(|item| item != ')') {
                        scan.bump();
                    }
                    scan.bump();
                    return tok(Kind::Url, &format!("url({inner})"));
                }
                return consume_bad_url(scan, start);
            }
            Some('"' | '\'' | '(') => return consume_bad_url(scan, start),
            Some(ch) if is_non_printable(ch) => return consume_bad_url(scan, start),
            Some('\\') => scan.consume_escape(),
            Some(_) => {
                scan.bump();
            }
        }
    }
}

fn only_ws_until_paren(scan: &Scanner<'_>) -> bool {
    for ch in scan.src[scan.i..].chars() {
        if ch == ')' {
            return true;
        }
        if !is_ws(ch) {
            return false;
        }
    }
    false
}

fn consume_bad_url(scan: &mut Scanner<'_>, start: usize) -> Tok {
    while let Some(ch) = scan.peek() {
        if ch == ')' {
            scan.bump();
            break;
        }
        if ch == '\\' {
            scan.consume_escape();
            continue;
        }
        scan.bump();
    }
    tok(Kind::Url, &scan.src[start..scan.i])
}

fn tok(kind: Kind, text: &str) -> Tok {
    Tok {
        kind,
        text: text.to_string(),
    }
}

struct Writer {
    tokens: Vec<Tok>,
    index: usize,
    out: String,
}

impl Writer {
    fn stylesheet(&mut self) {
        loop {
            self.skip_ws();
            if self.eof() {
                return;
            }
            if self.kind_is(Kind::CloseBrace) || self.kind_is(Kind::Semi) {
                self.index += 1;
                continue;
            }
            if self.kind_is(Kind::At) {
                self.at_rule();
            } else {
                self.qualified_rule();
            }
        }
    }

    fn parse_block(&mut self) {
        loop {
            self.skip_ws();
            if self.eof() || self.kind_is(Kind::CloseBrace) {
                return;
            }
            if self.kind_is(Kind::Semi) {
                self.index += 1;
                continue;
            }
            if self.kind_is(Kind::At) {
                self.at_rule();
            } else if self.looks_like_declaration() {
                self.declaration();
            } else {
                self.qualified_rule();
            }
        }
    }

    fn at_rule(&mut self) {
        let before = self.index;
        let start = self.index;
        self.index += 1;
        let mut paren = 0i32;
        let mut bracket = 0i32;
        let mut stop = None;
        while self.index < self.tokens.len() {
            match self.tokens[self.index].kind {
                Kind::OpenParen => paren += 1,
                Kind::CloseParen => paren = paren.saturating_sub(1),
                Kind::OpenBracket => bracket += 1,
                Kind::CloseBracket => bracket = bracket.saturating_sub(1),
                Kind::Semi if paren == 0 && bracket == 0 => {
                    stop = Some(Kind::Semi);
                    break;
                }
                Kind::OpenBrace if paren == 0 && bracket == 0 => {
                    stop = Some(Kind::OpenBrace);
                    break;
                }
                _ => {}
            }
            self.index += 1;
        }
        self.write_tokens(start, self.index, Space::Value, false);
        match stop {
            Some(Kind::Semi) => {
                self.out.push(';');
                self.index += 1;
            }
            Some(Kind::OpenBrace) => {
                self.out.push('{');
                self.index += 1;
                self.parse_block();
                self.skip_ws();
                if self.kind_is(Kind::CloseBrace) {
                    self.index += 1;
                }
                self.out.push('}');
            }
            _ => {}
        }
        self.force_progress(before);
    }

    fn qualified_rule(&mut self) {
        let before = self.index;
        let start = self.index;
        let mut paren = 0i32;
        let mut bracket = 0i32;
        let mut stop = None;
        while self.index < self.tokens.len() {
            match self.tokens[self.index].kind {
                Kind::OpenParen => paren += 1,
                Kind::CloseParen => paren = paren.saturating_sub(1),
                Kind::OpenBracket => bracket += 1,
                Kind::CloseBracket => bracket = bracket.saturating_sub(1),
                Kind::OpenBrace if paren == 0 && bracket == 0 => {
                    stop = Some(Kind::OpenBrace);
                    break;
                }
                Kind::Semi if paren == 0 && bracket == 0 => {
                    stop = Some(Kind::Semi);
                    break;
                }
                _ => {}
            }
            self.index += 1;
        }
        self.write_tokens(start, self.index, Space::Selector, false);
        match stop {
            Some(Kind::Semi) => {
                self.out.push(';');
                self.index += 1;
            }
            Some(Kind::OpenBrace) => {
                self.out.push('{');
                self.index += 1;
                self.parse_block();
                self.skip_ws();
                if self.kind_is(Kind::CloseBrace) {
                    self.index += 1;
                }
                self.out.push('}');
            }
            _ => {}
        }
        self.force_progress(before);
    }

    fn declaration(&mut self) {
        let before = self.index;
        let start = self.index;
        let mut paren = 0i32;
        let mut bracket = 0i32;
        let mut colon_at = None;
        while self.index < self.tokens.len() {
            match self.tokens[self.index].kind {
                Kind::OpenParen => paren += 1,
                Kind::CloseParen => paren = paren.saturating_sub(1),
                Kind::OpenBracket => bracket += 1,
                Kind::CloseBracket => bracket = bracket.saturating_sub(1),
                Kind::Colon if paren == 0 && bracket == 0 => {
                    colon_at = Some(self.index);
                    break;
                }
                _ => {}
            }
            self.index += 1;
        }
        let Some(colon_at) = colon_at else {
            self.force_progress(before);
            return;
        };
        let custom = self.is_custom(start, colon_at);
        self.write_property(start, colon_at);
        self.out.push(':');
        self.index = colon_at + 1;
        let value_end = self.find_value_end();
        if custom {
            self.write_custom_value(self.index, value_end);
        } else {
            self.write_tokens(self.index, value_end, Space::Value, true);
        }
        self.index = value_end;
        self.finish_semi();
        self.force_progress(before);
    }

    fn looks_like_declaration(&self) -> bool {
        let Some(first) = self.solid_from(self.index) else {
            return false;
        };
        if self.tokens[first].kind != Kind::Ident {
            return false;
        }
        let Some(second) = self.solid_from(first + 1) else {
            return false;
        };
        if self.tokens[second].kind != Kind::Colon {
            return false;
        }
        let mut index = second + 1;
        let mut paren = 0i32;
        let mut bracket = 0i32;
        while index < self.tokens.len() {
            match self.tokens[index].kind {
                Kind::OpenParen => paren += 1,
                Kind::CloseParen => paren = paren.saturating_sub(1),
                Kind::OpenBracket => bracket += 1,
                Kind::CloseBracket => bracket = bracket.saturating_sub(1),
                Kind::OpenBrace if paren == 0 && bracket == 0 => return false,
                Kind::Semi | Kind::CloseBrace if paren == 0 && bracket == 0 => return true,
                _ => {}
            }
            index += 1;
        }
        true
    }

    fn find_value_end(&self) -> usize {
        let mut index = self.index;
        let mut paren = 0i32;
        let mut bracket = 0i32;
        while index < self.tokens.len() {
            match self.tokens[index].kind {
                Kind::OpenParen => paren += 1,
                Kind::CloseParen => paren = paren.saturating_sub(1),
                Kind::OpenBracket => bracket += 1,
                Kind::CloseBracket => bracket = bracket.saturating_sub(1),
                Kind::Semi | Kind::CloseBrace | Kind::OpenBrace if paren == 0 && bracket == 0 => {
                    return index;
                }
                _ => {}
            }
            index += 1;
        }
        index
    }

    fn finish_semi(&mut self) {
        if !self.kind_is(Kind::Semi) {
            return;
        }
        let mut index = self.index + 1;
        while index < self.tokens.len() && is_gap(&self.tokens[index]) {
            index += 1;
        }
        if index >= self.tokens.len() || self.tokens[index].kind == Kind::CloseBrace {
            self.index += 1;
            return;
        }
        self.out.push(';');
        self.index += 1;
    }

    fn write_property(&mut self, start: usize, end: usize) {
        let solid = (start..end)
            .filter(|index| !is_gap(&self.tokens[*index]))
            .collect::<Vec<_>>();
        if solid.len() == 1 {
            let tok = &self.tokens[solid[0]];
            if tok.kind == Kind::Ident {
                if tok.text.starts_with("--") {
                    self.out.push_str(&tok.text);
                } else {
                    self.out.push_str(&tok.text.to_ascii_lowercase());
                }
                return;
            }
        }
        self.write_tokens(start, end, Space::Value, false);
    }

    fn is_custom(&self, start: usize, end: usize) -> bool {
        (start..end)
            .any(|index| !is_gap(&self.tokens[index]) && self.tokens[index].text.starts_with("--"))
    }

    fn write_custom_value(&mut self, start: usize, end: usize) {
        let mut first = None;
        let mut last = None;
        for index in start..end {
            if is_gap(&self.tokens[index]) {
                continue;
            }
            if first.is_none() {
                first = Some(index);
            }
            last = Some(index);
        }
        let Some(first) = first else {
            if (start..end).any(|index| self.tokens[index].kind == Kind::Ws) {
                self.out.push(' ');
            }
            return;
        };
        let last = last.unwrap();
        let leading = (start..first).any(|index| self.tokens[index].kind == Kind::Ws);
        let trailing = (last + 1..end).any(|index| self.tokens[index].kind == Kind::Ws);
        if leading {
            self.out.push(' ');
        }
        self.write_tokens(first, last + 1, Space::Value, false);
        if trailing {
            self.out.push(' ');
        }
    }

    fn write_tokens(&mut self, start: usize, end: usize, mode: Space, value_start: bool) {
        let mut paren = 0i32;
        let mut bracket = 0i32;
        let mut color_fns: Vec<bool> = Vec::new();
        let mut prev_i: Option<usize> = None;
        let mut prev_text = String::new();
        let mut index = start;
        while index < end {
            let kind = self.tokens[index].kind;
            if is_gap(&self.tokens[index]) {
                index += 1;
                continue;
            }
            let had_ws = prev_i.is_some_and(|prev| self.has_ws(prev, index));
            let prev_tok = prev_i.map(|prev| &self.tokens[prev]);
            let in_color_fn = mode == Space::Value && color_fns.last().copied().unwrap_or(false);
            let shorten_hash = mode == Space::Value
                && color_context(prev_tok, value_start && prev_i.is_none(), in_color_fn);
            let rendered = render(&self.tokens[index], shorten_hash);
            if let Some(prev) = prev_i {
                if had_ws
                    && keep_space(
                        mode,
                        &self.tokens[prev],
                        &prev_text,
                        &self.tokens[index],
                        &rendered,
                        paren,
                        bracket,
                    )
                {
                    self.out.push(' ');
                }
            }
            if kind == Kind::OpenParen {
                let allows = mode == Space::Value
                    && prev_i.is_some_and(|prev| {
                        self.tokens[prev].kind == Kind::Ident
                            && !self.tokens[prev].text.eq_ignore_ascii_case("url")
                            && !had_ws
                    });
                color_fns.push(allows);
                paren += 1;
            } else if kind == Kind::CloseParen {
                color_fns.pop();
                paren = paren.saturating_sub(1);
            } else if kind == Kind::OpenBracket {
                bracket += 1;
            } else if kind == Kind::CloseBracket {
                bracket = bracket.saturating_sub(1);
            }
            self.out.push_str(&rendered);
            prev_text = rendered;
            prev_i = Some(index);
            index += 1;
        }
    }

    fn has_ws(&self, from: usize, to: usize) -> bool {
        self.tokens[from + 1..to]
            .iter()
            .any(|tok| tok.kind == Kind::Ws)
    }

    fn solid_from(&self, mut index: usize) -> Option<usize> {
        while index < self.tokens.len() {
            if !is_gap(&self.tokens[index]) {
                return Some(index);
            }
            index += 1;
        }
        None
    }

    fn skip_ws(&mut self) {
        while self.index < self.tokens.len() && is_gap(&self.tokens[self.index]) {
            self.index += 1;
        }
    }

    fn eof(&self) -> bool {
        self.index >= self.tokens.len()
    }

    fn kind_is(&self, kind: Kind) -> bool {
        self.tokens
            .get(self.index)
            .is_some_and(|tok| tok.kind == kind)
    }

    fn force_progress(&mut self, before: usize) {
        if self.index == before && self.index < self.tokens.len() {
            self.index += 1;
        }
    }
}

fn is_gap(tok: &Tok) -> bool {
    tok.kind == Kind::Ws || tok.kind == Kind::Trivia
}

fn keep_space(
    mode: Space,
    prev: &Tok,
    prev_text: &str,
    next: &Tok,
    next_text: &str,
    paren: i32,
    bracket: i32,
) -> bool {
    if mode == Space::Selector && paren == 0 && bracket == 0 {
        return selector_keep(prev, next);
    }
    value_keep(prev, prev_text, next, next_text)
}

fn selector_keep(prev: &Tok, next: &Tok) -> bool {
    if is_combinator(prev)
        || is_combinator(next)
        || prev.kind == Kind::Comma
        || next.kind == Kind::Comma
    {
        return false;
    }
    if prev.kind == Kind::OpenParen
        || prev.kind == Kind::OpenBracket
        || next.kind == Kind::CloseParen
        || next.kind == Kind::CloseBracket
    {
        return false;
    }
    true
}

fn is_combinator(tok: &Tok) -> bool {
    tok.kind == Kind::Delim && matches!(tok.text.as_str(), ">" | "+" | "~")
}

fn value_keep(prev: &Tok, prev_text: &str, next: &Tok, next_text: &str) -> bool {
    if would_glue(prev, prev_text, next, next_text) {
        return true;
    }
    if space_after_close(prev.kind, next.kind) {
        return true;
    }
    if next.kind == Kind::OpenParen && prev.kind == Kind::Ident {
        return true;
    }
    if prev.kind == Kind::At {
        return false;
    }
    if opens_without_space(prev) || opens_without_space(next) {
        return false;
    }
    if is_sign(prev) || is_sign(next) {
        return false;
    }
    true
}

fn opens_without_space(tok: &Tok) -> bool {
    match tok.kind {
        Kind::Colon
        | Kind::Comma
        | Kind::Semi
        | Kind::OpenBrace
        | Kind::CloseBrace
        | Kind::OpenParen
        | Kind::CloseParen
        | Kind::OpenBracket
        | Kind::CloseBracket => true,
        Kind::Delim => matches!(
            tok.text.as_str(),
            "=" | "*" | "~" | "|" | "^" | "$" | "!" | "/" | ">"
        ),
        _ => false,
    }
}

fn is_sign(tok: &Tok) -> bool {
    tok.kind == Kind::Delim && matches!(tok.text.as_str(), "+" | "-")
}

/// `var(--accent) 14%` is a color followed by its mix stop. The space is part
/// of the grammar, so a closing paren must not be glued to the next value.
fn space_after_close(prev_kind: Kind, next_kind: Kind) -> bool {
    prev_kind == Kind::CloseParen
        && matches!(
            next_kind,
            Kind::Number
                | Kind::Percentage
                | Kind::Dimension
                | Kind::Ident
                | Kind::Hash
                | Kind::Url
                | Kind::String
        )
}

fn would_glue(prev: &Tok, prev_text: &str, _next: &Tok, next_text: &str) -> bool {
    tokens_would_glue(prev.kind, prev_text, next_text)
}

fn tokens_would_glue(prev_kind: Kind, prev_text: &str, next_text: &str) -> bool {
    if prev_text.is_empty() || next_text.is_empty() {
        return false;
    }
    if prev_text.contains('\\') || next_text.contains('\\') {
        return true;
    }
    let end = last_char(prev_text);
    let start = first_char(next_text);
    // A minus sign is its own token. It does not continue the previous name,
    // and a digit after it is a signed number (`100vh -3.2rem`), not an ident.
    let name_end = prev_kind != Kind::Delim && is_name_char(end);
    if name_end && (is_name_char(start) || is_ident_start(start) || start == '-') {
        return true;
    }
    if prev_kind == Kind::Number && matches!(start, '.' | '%' | 'e' | 'E') {
        return true;
    }
    if prev_kind == Kind::Hash && (start.is_ascii_hexdigit() || is_name_char(start) || start == '-')
    {
        return true;
    }
    if end == '-' && (start == '-' || is_ident_start(start)) {
        return true;
    }
    false
}

fn color_context(prev: Option<&Tok>, at_value_start: bool, in_color_fn: bool) -> bool {
    if in_color_fn {
        return true;
    }
    match prev {
        None => at_value_start,
        Some(tok) => {
            matches!(
                tok.kind,
                Kind::Colon
                    | Kind::Comma
                    | Kind::Ident
                    | Kind::Number
                    | Kind::Dimension
                    | Kind::Percentage
                    | Kind::Hash
            ) || (tok.kind == Kind::Delim && tok.text == "/")
        }
    }
}

fn render(tok: &Tok, shorten_hash: bool) -> String {
    match tok.kind {
        Kind::Number | Kind::Dimension | Kind::Percentage => shorten_numeric(&tok.text),
        Kind::Hash if shorten_hash => shorten_hex(&tok.text),
        _ => tok.text.clone(),
    }
}

fn shorten_numeric(text: &str) -> String {
    let Some(split) = numeric_prefix_len(text) else {
        return text.to_string();
    };
    let (num, unit) = text.split_at(split);
    format!("{}{unit}", trim_number(num))
}

fn numeric_prefix_len(text: &str) -> Option<usize> {
    let bytes = text.as_bytes();
    let mut len = 0usize;
    if matches!(bytes.first(), Some(b'+' | b'-')) {
        len = 1;
    }
    if bytes.get(len) == Some(&b'.') {
        len += 1;
    }
    let mut saw_digit = false;
    while bytes.get(len).is_some_and(|byte| byte.is_ascii_digit()) {
        saw_digit = true;
        len += 1;
    }
    if !saw_digit {
        return None;
    }
    if bytes.get(len) == Some(&b'.') && bytes.get(len + 1).is_some_and(|byte| byte.is_ascii_digit())
    {
        len += 1;
        while bytes.get(len).is_some_and(|byte| byte.is_ascii_digit()) {
            len += 1;
        }
    }
    if let Some(exp) = exponent_len(&text[len..]) {
        len += exp;
    }
    Some(len)
}

fn exponent_len(text: &str) -> Option<usize> {
    let mut chars = text.chars();
    if !matches!(chars.next(), Some('e' | 'E')) {
        return None;
    }
    let mut len = 1usize;
    let mut rest = text[1..].chars();
    if matches!(rest.next(), Some('+') | Some('-')) {
        len += 1;
        rest = text[2..].chars();
    }
    let mut digits = 0usize;
    for ch in rest {
        if !ch.is_ascii_digit() {
            break;
        }
        digits += 1;
        len += 1;
    }
    (digits > 0).then_some(len)
}

fn trim_number(num: &str) -> String {
    let (sign, rest) = match num.as_bytes().first() {
        Some(b'-') => ("-", &num[1..]),
        Some(b'+') => ("+", &num[1..]),
        _ => ("", num),
    };
    let (mant, exp) = split_exponent(rest);
    format!("{sign}{}{}", trim_mantissa(mant), normalize_exp(exp))
}

fn split_exponent(rest: &str) -> (&str, &str) {
    let bytes = rest.as_bytes();
    for (index, byte) in bytes.iter().enumerate() {
        if *byte == b'e' || *byte == b'E' {
            return (&rest[..index], &rest[index..]);
        }
    }
    (rest, "")
}

fn trim_mantissa(mant: &str) -> String {
    let Some((whole, frac)) = mant.split_once('.') else {
        let trimmed = mant.trim_start_matches('0');
        return if trimmed.is_empty() {
            "0".to_string()
        } else {
            trimmed.to_string()
        };
    };
    let whole = whole.trim_start_matches('0');
    let frac = frac.trim_end_matches('0');
    if frac.is_empty() {
        return if whole.is_empty() {
            "0".to_string()
        } else {
            whole.to_string()
        };
    }
    if whole.is_empty() {
        format!(".{frac}")
    } else {
        format!("{whole}.{frac}")
    }
}

fn normalize_exp(exp: &str) -> String {
    if exp.is_empty() {
        return String::new();
    }
    let rest = exp[1..].strip_prefix('+').unwrap_or(&exp[1..]);
    format!("e{rest}")
}

fn shorten_hex(text: &str) -> String {
    let Some(body) = text.strip_prefix('#') else {
        return text.to_string();
    };
    let bytes = body.as_bytes();
    if !bytes.iter().all(|byte| byte.is_ascii_hexdigit()) {
        return text.to_string();
    }
    if (bytes.len() == 6 || bytes.len() == 8)
        && bytes
            .chunks(2)
            .all(|pair| pair[0].eq_ignore_ascii_case(&pair[1]))
    {
        let mut out = String::from("#");
        for pair in bytes.chunks(2) {
            out.push((pair[0] as char).to_ascii_lowercase());
        }
        return out;
    }
    format!("#{body}").to_ascii_lowercase()
}

fn is_ws(ch: char) -> bool {
    matches!(ch, ' ' | '\t' | '\n' | '\r' | '\u{000c}')
}

fn is_ident_start(ch: char) -> bool {
    ch == '_' || ch.is_ascii_alphabetic() || !ch.is_ascii()
}

fn is_name_char(ch: char) -> bool {
    is_ident_start(ch) || ch.is_ascii_digit() || ch == '-'
}

fn is_non_printable(ch: char) -> bool {
    matches!(ch, '\u{0000}'..='\u{0008}' | '\u{000B}' | '\u{000E}'..='\u{001F}' | '\u{007F}')
}

fn last_char(text: &str) -> char {
    text.chars().next_back().unwrap()
}

fn first_char(text: &str) -> char {
    text.chars().next().unwrap()
}

/// Reprint `source` with two-space indentation.
///
/// Spaces that keep two tokens from merging stay. A combinator, a comma, a
/// property colon, and `!important` gain a space. Comments stay. The same
/// sheet printed again does not change.
pub fn prettify_css(source: &str) -> String {
    let (bom, body) = match source.strip_prefix('\u{feff}') {
        Some(rest) => ("\u{feff}", rest),
        None => ("", source),
    };
    let mut pretty = Pretty {
        tokens: tokenize(body),
        index: 0,
        out: String::new(),
        indent: 0,
        pending_indent: false,
    };
    pretty.stylesheet();
    if pretty.out.is_empty() {
        return bom.to_string();
    }
    if !pretty.out.ends_with('\n') {
        pretty.out.push('\n');
    }
    format!("{bom}{}", pretty.out)
}

struct Depth {
    paren: i32,
    bracket: i32,
}

struct Pretty {
    tokens: Vec<Tok>,
    index: usize,
    out: String,
    indent: usize,
    pending_indent: bool,
}

impl Pretty {
    fn stylesheet(&mut self) {
        loop {
            self.take_gaps();
            if self.eof() {
                return;
            }
            if self.kind_is(Kind::CloseBrace) || self.kind_is(Kind::Semi) {
                self.index += 1;
                continue;
            }
            if self.kind_is(Kind::At) {
                self.at_rule();
            } else {
                self.qualified_rule();
            }
        }
    }

    fn parse_block(&mut self) {
        loop {
            self.take_gaps();
            if self.eof() || self.kind_is(Kind::CloseBrace) {
                return;
            }
            if self.kind_is(Kind::Semi) {
                self.index += 1;
                continue;
            }
            if self.kind_is(Kind::At) {
                self.at_rule();
            } else if self.looks_like_declaration() {
                self.declaration();
            } else {
                self.qualified_rule();
            }
        }
    }

    fn at_rule(&mut self) {
        let before = self.index;
        let start = self.index;
        self.index += 1;
        let stop = self.scan_stop();
        self.start_line();
        self.write_span(start, self.index, Space::Value);
        self.finish_stop(stop);
        self.force_progress(before);
    }

    fn qualified_rule(&mut self) {
        let before = self.index;
        let start = self.index;
        let stop = self.scan_stop();
        self.start_line();
        self.write_span(start, self.index, Space::Selector);
        self.finish_stop(stop);
        self.force_progress(before);
    }

    fn scan_stop(&mut self) -> Option<Kind> {
        let mut depth = Depth {
            paren: 0,
            bracket: 0,
        };
        let mut stop = None;
        while self.index < self.tokens.len() {
            match self.tokens[self.index].kind {
                Kind::OpenParen => depth.paren += 1,
                Kind::CloseParen => depth.paren = depth.paren.saturating_sub(1),
                Kind::OpenBracket => depth.bracket += 1,
                Kind::CloseBracket => depth.bracket = depth.bracket.saturating_sub(1),
                Kind::Semi if depth.paren == 0 && depth.bracket == 0 => {
                    stop = Some(Kind::Semi);
                    break;
                }
                Kind::OpenBrace if depth.paren == 0 && depth.bracket == 0 => {
                    stop = Some(Kind::OpenBrace);
                    break;
                }
                _ => {}
            }
            self.index += 1;
        }
        stop
    }

    fn finish_stop(&mut self, stop: Option<Kind>) {
        match stop {
            Some(Kind::Semi) => {
                self.write(";");
                self.index += 1;
            }
            Some(Kind::OpenBrace) => {
                self.write(" {");
                self.index += 1;
                self.indent += 1;
                self.parse_block();
                self.indent = self.indent.saturating_sub(1);
                self.take_gaps();
                if self.kind_is(Kind::CloseBrace) {
                    self.index += 1;
                }
                self.start_line();
                self.write("}");
            }
            _ => {}
        }
    }

    fn declaration(&mut self) {
        let before = self.index;
        let start = self.index;
        let mut depth = Depth {
            paren: 0,
            bracket: 0,
        };
        let mut colon_at = None;
        while self.index < self.tokens.len() {
            match self.tokens[self.index].kind {
                Kind::OpenParen => depth.paren += 1,
                Kind::CloseParen => depth.paren = depth.paren.saturating_sub(1),
                Kind::OpenBracket => depth.bracket += 1,
                Kind::CloseBracket => depth.bracket = depth.bracket.saturating_sub(1),
                Kind::Colon if depth.paren == 0 && depth.bracket == 0 => {
                    colon_at = Some(self.index);
                    break;
                }
                _ => {}
            }
            self.index += 1;
        }
        let Some(colon_at) = colon_at else {
            self.force_progress(before);
            return;
        };
        let custom = self.is_custom(start, colon_at);
        self.start_line();
        self.write_property(start, colon_at);
        self.index = colon_at + 1;
        let value_end = self.find_value_end();
        if custom {
            self.write_custom(self.index, value_end);
        } else if self.has_solid(self.index, value_end) {
            self.write(": ");
            self.write_span(self.index, value_end, Space::Value);
            self.write(";");
        } else {
            self.write(":;");
        }
        self.index = value_end;
        if self.kind_is(Kind::Semi) {
            self.index += 1;
        }
        self.force_progress(before);
    }

    fn looks_like_declaration(&self) -> bool {
        let Some(first) = self.solid_from(self.index) else {
            return false;
        };
        if self.tokens[first].kind != Kind::Ident {
            return false;
        }
        let Some(second) = self.solid_from(first + 1) else {
            return false;
        };
        if self.tokens[second].kind != Kind::Colon {
            return false;
        }
        let mut index = second + 1;
        let mut depth = Depth {
            paren: 0,
            bracket: 0,
        };
        while index < self.tokens.len() {
            match self.tokens[index].kind {
                Kind::OpenParen => depth.paren += 1,
                Kind::CloseParen => depth.paren = depth.paren.saturating_sub(1),
                Kind::OpenBracket => depth.bracket += 1,
                Kind::CloseBracket => depth.bracket = depth.bracket.saturating_sub(1),
                Kind::OpenBrace if depth.paren == 0 && depth.bracket == 0 => return false,
                Kind::Semi | Kind::CloseBrace if depth.paren == 0 && depth.bracket == 0 => {
                    return true;
                }
                _ => {}
            }
            index += 1;
        }
        true
    }

    fn find_value_end(&self) -> usize {
        let mut index = self.index;
        let mut depth = Depth {
            paren: 0,
            bracket: 0,
        };
        while index < self.tokens.len() {
            match self.tokens[index].kind {
                Kind::OpenParen => depth.paren += 1,
                Kind::CloseParen => depth.paren = depth.paren.saturating_sub(1),
                Kind::OpenBracket => depth.bracket += 1,
                Kind::CloseBracket => depth.bracket = depth.bracket.saturating_sub(1),
                Kind::Semi | Kind::CloseBrace | Kind::OpenBrace
                    if depth.paren == 0 && depth.bracket == 0 =>
                {
                    return index;
                }
                _ => {}
            }
            index += 1;
        }
        index
    }

    fn write_property(&mut self, start: usize, end: usize) {
        let solid = (start..end)
            .filter(|index| !is_gap(&self.tokens[*index]))
            .collect::<Vec<_>>();
        if solid.len() == 1 && self.tokens[solid[0]].kind == Kind::Ident {
            let text = self.tokens[solid[0]].text.clone();
            self.write(&text);
            return;
        }
        self.write_span(start, end, Space::Value);
    }

    fn is_custom(&self, start: usize, end: usize) -> bool {
        (start..end)
            .any(|index| !is_gap(&self.tokens[index]) && self.tokens[index].text.starts_with("--"))
    }

    fn write_custom(&mut self, start: usize, end: usize) {
        let mut first = None;
        let mut last = None;
        let mut any_ws = false;
        for index in start..end {
            if self.tokens[index].kind == Kind::Ws {
                any_ws = true;
            }
            if is_gap(&self.tokens[index]) {
                continue;
            }
            if first.is_none() {
                first = Some(index);
            }
            last = Some(index);
        }
        self.write(":");
        let Some(first) = first else {
            if any_ws {
                self.write(" ");
            }
            self.write(";");
            return;
        };
        let last = last.unwrap();
        let trailing = (last + 1..end).any(|index| self.tokens[index].kind == Kind::Ws);
        self.write(" ");
        self.write_span(first, last + 1, Space::Value);
        if trailing {
            self.write(" ");
        }
        self.write(";");
    }

    fn has_solid(&self, start: usize, end: usize) -> bool {
        (start..end).any(|index| !is_gap(&self.tokens[index]))
    }

    fn write_span(&mut self, start: usize, end: usize, mode: Space) {
        let mut depth = Depth {
            paren: 0,
            bracket: 0,
        };
        let mut prev_i: Option<usize> = None;
        let mut prev_text = String::new();
        let mut index = start;
        while index < end {
            if self.tokens[index].kind == Kind::Trivia {
                let text = self.tokens[index].text.clone();
                if prev_i.is_some_and(|prev| self.has_ws(prev, index)) {
                    self.write(" ");
                }
                self.write(&text);
                index += 1;
                continue;
            }
            if is_gap(&self.tokens[index]) {
                index += 1;
                continue;
            }
            let kind = self.tokens[index].kind;
            let rendered = self.tokens[index].text.clone();
            let had_ws = prev_i.is_some_and(|prev| self.has_ws(prev, index));
            if let Some(prev) = prev_i {
                let prev_kind = self.tokens[prev].kind;
                if pretty_space(mode, prev_kind, &prev_text, kind, &rendered, &depth, had_ws) {
                    self.write(" ");
                }
            }
            match kind {
                Kind::OpenParen => depth.paren += 1,
                Kind::CloseParen => depth.paren = depth.paren.saturating_sub(1),
                Kind::OpenBracket => depth.bracket += 1,
                Kind::CloseBracket => depth.bracket = depth.bracket.saturating_sub(1),
                _ => {}
            }
            self.write(&rendered);
            prev_text = rendered;
            prev_i = Some(index);
            index += 1;
        }
    }

    fn has_ws(&self, from: usize, to: usize) -> bool {
        self.tokens[from + 1..to]
            .iter()
            .any(|tok| tok.kind == Kind::Ws)
    }

    fn take_gaps(&mut self) {
        while self.index < self.tokens.len() && is_gap(&self.tokens[self.index]) {
            if self.tokens[self.index].kind == Kind::Trivia {
                let text = self.tokens[self.index].text.clone();
                self.start_line();
                self.write(&text);
            }
            self.index += 1;
        }
    }

    fn start_line(&mut self) {
        if !self.out.is_empty() && !self.out.ends_with('\n') {
            self.out.push('\n');
        }
        self.pending_indent = true;
    }

    fn write(&mut self, text: &str) {
        if text.is_empty() {
            return;
        }
        if self.pending_indent {
            self.out.extend(std::iter::repeat_n(' ', self.indent * 2));
            self.pending_indent = false;
        }
        self.out.push_str(text);
    }

    fn solid_from(&self, mut index: usize) -> Option<usize> {
        while index < self.tokens.len() {
            if !is_gap(&self.tokens[index]) {
                return Some(index);
            }
            index += 1;
        }
        None
    }

    fn eof(&self) -> bool {
        self.index >= self.tokens.len()
    }

    fn kind_is(&self, kind: Kind) -> bool {
        self.tokens
            .get(self.index)
            .is_some_and(|tok| tok.kind == kind)
    }

    fn force_progress(&mut self, before: usize) {
        if self.index == before && self.index < self.tokens.len() {
            self.index += 1;
        }
    }
}

fn pretty_space(
    mode: Space,
    prev_kind: Kind,
    prev_text: &str,
    next_kind: Kind,
    next_text: &str,
    depth: &Depth,
    had_ws: bool,
) -> bool {
    if tokens_would_glue(prev_kind, prev_text, next_text) {
        return true;
    }
    if prev_kind == Kind::Comma {
        return true;
    }
    if mode == Space::Selector && depth.bracket == 0 {
        if is_combinator_text(prev_kind, prev_text) || is_combinator_text(next_kind, next_text) {
            return true;
        }
        return had_ws && selector_gap(prev_kind, prev_text, next_kind, next_text);
    }
    if prev_kind == Kind::Colon || prev_kind == Kind::At {
        return true;
    }
    if next_kind == Kind::Delim && next_text == "!" {
        return true;
    }
    if is_sign_text(prev_kind, prev_text) || is_sign_text(next_kind, next_text) {
        return true;
    }
    had_ws && value_gap(prev_kind, prev_text, next_kind, next_text)
}

fn is_combinator_text(kind: Kind, text: &str) -> bool {
    kind == Kind::Delim && matches!(text, ">" | "+" | "~")
}

fn is_sign_text(kind: Kind, text: &str) -> bool {
    kind == Kind::Delim && matches!(text, "+" | "-")
}

fn selector_gap(prev_kind: Kind, prev_text: &str, next_kind: Kind, next_text: &str) -> bool {
    !is_combinator_text(prev_kind, prev_text)
        && !is_combinator_text(next_kind, next_text)
        && prev_kind != Kind::Comma
        && next_kind != Kind::Comma
        && prev_kind != Kind::OpenParen
        && prev_kind != Kind::OpenBracket
        && next_kind != Kind::CloseParen
        && next_kind != Kind::CloseBracket
}

fn value_gap(prev_kind: Kind, prev_text: &str, next_kind: Kind, next_text: &str) -> bool {
    if tokens_would_glue(prev_kind, prev_text, next_text) {
        return true;
    }
    if space_after_close(prev_kind, next_kind) {
        return true;
    }
    if next_kind == Kind::OpenParen && prev_kind == Kind::Ident {
        return true;
    }
    if prev_kind == Kind::At {
        return false;
    }
    if gap_token(prev_kind, prev_text) || gap_token(next_kind, next_text) {
        return false;
    }
    if is_sign_text(prev_kind, prev_text) || is_sign_text(next_kind, next_text) {
        return false;
    }
    true
}

fn gap_token(kind: Kind, text: &str) -> bool {
    match kind {
        Kind::Colon
        | Kind::Comma
        | Kind::Semi
        | Kind::OpenBrace
        | Kind::CloseBrace
        | Kind::OpenParen
        | Kind::CloseParen
        | Kind::OpenBracket
        | Kind::CloseBracket => true,
        Kind::Delim => matches!(text, "=" | "*" | "~" | "|" | "^" | "$" | "!" | "/" | ">"),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::{minify_css, prettify_css};

    fn css(source: &str, expected: &str) {
        let out = minify_css(source);
        assert_eq!(out, expected, "source:\n{source}");
        assert_eq!(minify_css(&out), out);
    }

    #[test]
    fn drops_whitespace_comments_and_the_last_semicolon() {
        css(
            "/* banner */\nbody {\n  color: red;\n}\n",
            "body{color:red}",
        );
        css("a{color:red;margin:0;}", "a{color:red;margin:0}");
        css("/*! license */\n.a{color:#ffffff}", ".a{color:#fff}");
    }

    #[test]
    fn keeps_descendant_combinators_and_drops_the_others() {
        css(".a .b { color: red; }", ".a .b{color:red}");
        css(".a > .b, .c + .d ~ .e { }", ".a>.b,.c+.d~.e{}");
        css("div :hover { color: red; }", "div :hover{color:red}");
        css("div:hover { color: red; }", "div:hover{color:red}");
        css("a: hover { color: red; }", "a: hover{color:red}");
        css(".a/**/.b { color: red; }", ".a.b{color:red}");
        css(".a /* x */ .b { color: red; }", ".a .b{color:red}");
    }

    #[test]
    fn keeps_spaces_that_would_merge_tokens() {
        css(
            "h1 { margin: 1px 2px; font: 1em/1.2 Arial; }",
            "h1{margin:1px 2px;font:1em/1.2 Arial}",
        );
        css(
            "p { font-family: \"Avenir Next\", sans-serif; }",
            "p{font-family:\"Avenir Next\",sans-serif}",
        );
        css(
            ".n { height: calc(100vh - 3.2rem); }",
            ".n{height:calc(100vh -3.2rem)}",
        );
        css(
            ".n { width: calc(1px - -1px); }",
            ".n{width:calc(1px - -1px)}",
        );
        css("li:nth-child(2n + 1) { }", "li:nth-child(2n+1){}");
        css(
            "@media screen and (min-width: 30em) { .a { color: red; } }",
            "@media screen and (min-width:30em){.a{color:red}}",
        );
        css(":not (.a) { }", ":not (.a){}");
    }

    #[test]
    fn keeps_strings_urls_and_custom_property_edges() {
        css(
            ".a { content: \"/* stay */\"; }",
            ".a{content:\"/* stay */\"}",
        );
        css(
            ".a { background: url(\"a b.png\"); }",
            ".a{background:url(\"a b.png\")}",
        );
        css(
            ".a { background: url( a.png ); }",
            ".a{background:url(a.png)}",
        );
        css(".a { --Ink: #AABBCC; }", ".a{--Ink: #AABBCC}");
        css(".a { --pad:  ; }", ".a{--pad: }");
        css("#AABBCC { color: #FF0000; }", "#AABBCC{color:#f00}");
    }

    #[test]
    fn shortens_numbers_keyframes_and_attributes() {
        css(
            ".a { margin: 0.50rem; line-height: 1.0; }",
            ".a{margin:.5rem;line-height:1}",
        );
        css(".a { margin: 0px; }", ".a{margin:0px}");
        css(
            "@keyframes fade { from { opacity: 0; } 50% { opacity: 1; } to { opacity: 1; } }",
            "@keyframes fade{from{opacity:0}50%{opacity:1}to{opacity:1}}",
        );
        css(
            "button[aria-pressed=\"true\"] { color: red !important; }",
            "button[aria-pressed=\"true\"]{color:red!important}",
        );
        css("@import \"theme.css\";", "@import\"theme.css\";");
        css(
            "p { color: rgb(255 71 133 / 45%); }",
            "p{color:rgb(255 71 133/45%)}",
        );
        css(
            ".a { background: color-mix(in srgb, var(--accent) 14%, #fff); }",
            ".a{background:color-mix(in srgb,var(--accent) 14%,#fff)}",
        );
    }

    #[test]
    fn minifies_the_storybook_and_foundry_stylesheets() {
        let workshop = include_str!("../examples/storybook/src/workshop.css");
        let ui = include_str!("../examples/storybook/src/ui.css");
        let foundry = include_str!("../examples/foundry/src/foundry.css");
        let joined = format!("{workshop}\n{ui}\n{foundry}");
        let out = minify_css(&joined);
        assert_eq!(minify_css(&out), out);
        assert!(out.len() < joined.len(), "{}", out.len());
        assert!(out.contains(".sb-brand p"));
        assert!(out.contains(".ui-time article::before"));
        assert!(out.contains("content:\"\""));
        assert!(out.contains("grid-template-columns:15.5rem 1fr"));
        assert!(out.contains("font-family:\"Nunito Sans\",-apple-system"));
        assert!(out.contains("rgb(0 0 0/10%)"));
        assert!(out.contains("@media(max-width:800px)"));
        assert!(out.contains("calc(100vh -3.2rem)"));
        assert!(!out.contains("/*"));
    }

    fn pretty(source: &str, expected: &str) {
        let out = prettify_css(source);
        assert_eq!(out, expected, "source:\n{source}");
        assert_eq!(prettify_css(&out), out);
    }

    #[test]
    fn prettifies_rules_comments_and_minified_css() {
        pretty(
            "/* banner */\nbody {\n  color: red;\n}\n",
            "/* banner */\nbody {\n  color: red;\n}\n",
        );
        pretty(
            "body{color:red;margin:0}",
            "body {\n  color: red;\n  margin: 0;\n}\n",
        );
        pretty(
            ".a>.b{color:red!important}",
            ".a > .b {\n  color: red !important;\n}\n",
        );
        pretty(".a .b{color:red}", ".a .b {\n  color: red;\n}\n");
        pretty(".a.b{color:red}", ".a.b {\n  color: red;\n}\n");
        pretty(".a/**/.b{color:red}", ".a/**/.b {\n  color: red;\n}\n");
        pretty(
            ".a /* x */ .b{color:red}",
            ".a /* x */ .b {\n  color: red;\n}\n",
        );
        pretty(
            "@media screen and (min-width:30em){.a{color:red}}",
            "@media screen and (min-width: 30em) {\n  .a {\n    color: red;\n  }\n}\n",
        );
        pretty("@import\"theme.css\";", "@import \"theme.css\";\n");
        pretty(
            "@keyframes fade{from{opacity:0}50%{opacity:1}to{opacity:1}}",
            "@keyframes fade {\n  from {\n    opacity: 0;\n  }\n  50% {\n    opacity: 1;\n  }\n  to {\n    opacity: 1;\n  }\n}\n",
        );
        pretty(
            ".n{height:calc(100vh - 3.2rem)}",
            ".n {\n  height: calc(100vh - 3.2rem);\n}\n",
        );
        pretty(
            ".n{height:calc(100vh -3.2rem)}",
            ".n {\n  height: calc(100vh -3.2rem);\n}\n",
        );
        pretty(".a{--Ink: #AABBCC}", ".a {\n  --Ink: #AABBCC;\n}\n");
        pretty(
            "h1{margin:1px 2px;font:1em/1.2 Arial}",
            "h1 {\n  margin: 1px 2px;\n  font: 1em/1.2 Arial;\n}\n",
        );
        let min = minify_css("/*! keep */\n.a { color: #ffffff; }\n");
        let out = prettify_css(&min);
        assert_eq!(out, ".a {\n  color: #fff;\n}\n");
        assert_eq!(prettify_css(&out), out);
        let workshop = include_str!("../examples/storybook/src/workshop.css");
        let ui = include_str!("../examples/storybook/src/ui.css");
        let foundry = include_str!("../examples/foundry/src/foundry.css");
        let joined = format!("{workshop}\n{ui}\n{foundry}");
        let once = prettify_css(&joined);
        assert_eq!(prettify_css(&once), once);
        assert!(once.contains("var(--accent) 14%"), "{once}");
        let compact = prettify_css(&minify_css(&joined));
        assert_eq!(prettify_css(&compact), compact);
        assert!(compact.contains("\n  "), "{compact}");
        assert!(compact.contains("var(--accent) 14%"), "{compact}");
    }
}
