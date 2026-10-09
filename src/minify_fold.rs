//! Folds literal expressions that the oxc compressor leaves in place.
//!
//! The pass runs on the parsed bundle before compression. It only replaces an
//! expression when the replacement has the same value and the original had no
//! side effects.

use oxc_allocator::Allocator;
use oxc_ast::ast::{
    BinaryOperator, Expression, ObjectExpression, ObjectPropertyKind, Program, PropertyKey,
    PropertyKind, UnaryOperator,
};
use oxc_ast::builder::AstBuilder;
use oxc_ast_visit::walk::walk_with_statement;
use oxc_ast_visit::walk_mut::walk_expression as walk_expression_mut;
use oxc_ast_visit::{Visit, VisitMut};
use oxc_span::{GetSpan, Span, SPAN};
use oxc_str::{Ident, Str};
use oxc_syntax::identifier::is_identifier_name;
use oxc_syntax::number::NumberBase;
use serde::de::{DeserializeSeed, Deserializer, MapAccess, SeqAccess, Visitor};

const MAX_DEPTH: u32 = 32;
const MAX_JSON_LEN: usize = 500_000;
const MAX_BUILT_LEN: usize = 8_192;
const MAX_PARTS: usize = 1_024;
const SAFE_INT_MAX: i64 = 9_007_199_254_740_991;

#[derive(Clone)]
enum Pure {
    Str(String),
    Num(f64),
    Bool(bool),
    Null,
    Undef,
    Array(Vec<Pure>),
    Object(Vec<(String, Pure)>),
}

struct Folder<'a> {
    builder: AstBuilder<'a>,
    json_ok: bool,
}

struct JsonGuard {
    allowed: bool,
}

pub fn fold_literals<'a>(allocator: &'a Allocator, program: &mut Program<'a>) {
    let json_ok = json_parse_allowed(program);
    let mut folder = Folder {
        builder: AstBuilder::new(allocator),
        json_ok,
    };
    folder.visit_program(program);
}

fn json_parse_allowed(program: &Program) -> bool {
    let mut guard = JsonGuard { allowed: true };
    guard.visit_program(program);
    guard.allowed
}

impl<'a> Visit<'a> for JsonGuard {
    fn visit_binding_identifier(&mut self, ident: &oxc_ast::ast::BindingIdentifier<'a>) {
        if ident.name.as_str() == "JSON" {
            self.allowed = false;
        }
    }

    fn visit_with_statement(&mut self, stmt: &oxc_ast::ast::WithStatement<'a>) {
        self.allowed = false;
        walk_with_statement(self, stmt);
    }
}

impl<'a> VisitMut<'a> for Folder<'a> {
    fn visit_expression(&mut self, expr: &mut Expression<'a>) {
        walk_expression_mut(self, expr);
        for _ in 0..8 {
            let Some(folded) = fold_one(expr, &self.builder, self.json_ok) else {
                break;
            };
            *expr = folded;
        }
    }
}

fn fold_one<'a>(
    expr: &Expression<'a>,
    builder: &AstBuilder<'a>,
    json_ok: bool,
) -> Option<Expression<'a>> {
    let span = expr.span();
    let value = fold_unary(expr)
        .or_else(|| fold_binary(expr))
        .or_else(|| fold_template(expr))
        .or_else(|| fold_call(expr, json_ok))
        .or_else(|| fold_member(expr))?;
    Some(emit(&value, span, builder))
}

fn fold_unary(expr: &Expression) -> Option<Pure> {
    let Expression::UnaryExpression(unary) = expr else {
        return None;
    };
    match unary.operator {
        UnaryOperator::UnaryNegation => {
            let number = as_safe_int(&unary.argument)?;
            int_value(number.checked_neg()?)
        }
        UnaryOperator::UnaryPlus => int_value(as_safe_int(&unary.argument)?),
        _ => None,
    }
}

fn fold_binary(expr: &Expression) -> Option<Pure> {
    let Expression::BinaryExpression(binary) = expr else {
        return None;
    };
    let left = as_pure(&binary.left, 0)?;
    let right = as_pure(&binary.right, 0)?;
    match binary.operator {
        BinaryOperator::Addition => fold_add(&left, &right),
        BinaryOperator::Subtraction => num_op(&left, &right, i64::checked_sub),
        BinaryOperator::Multiplication => num_op(&left, &right, i64::checked_mul),
        BinaryOperator::Division => {
            let left = to_number(&left)?;
            let right = to_number(&right)?;
            if right == 0 || left % right != 0 {
                return None;
            }
            int_value(left / right)
        }
        BinaryOperator::Remainder => {
            let left = to_number(&left)?;
            let right = to_number(&right)?;
            if right == 0 {
                return None;
            }
            int_value(left % right)
        }
        _ => None,
    }
}

fn fold_add(left: &Pure, right: &Pure) -> Option<Pure> {
    if let (Some(left), Some(right)) = (pure_int(left), pure_int(right)) {
        return int_value(left.checked_add(right)?);
    }
    if matches!(left, Pure::Str(_)) || matches!(right, Pure::Str(_)) {
        let left = stringify_primitive(left)?;
        let right = stringify_primitive(right)?;
        if left.len() + right.len() > MAX_BUILT_LEN {
            return None;
        }
        return Some(Pure::Str(left + &right));
    }
    if let (Some(left), Some(right)) = (to_number(left), to_number(right)) {
        return int_value(left.checked_add(right)?);
    }
    None
}

fn fold_template(expr: &Expression) -> Option<Pure> {
    let Expression::TemplateLiteral(template) = expr else {
        return None;
    };
    if template.quasis.iter().any(|quasi| quasi.lone_surrogates) {
        return None;
    }
    let mut out = String::new();
    for (index, quasi) in template.quasis.iter().enumerate() {
        let cooked = quasi.value.cooked.as_ref()?;
        if cooked
            .chars()
            .any(|ch| matches!(ch, '\n' | '\r' | '\u{2028}' | '\u{2029}'))
        {
            return None;
        }
        out.push_str(cooked.as_str());
        if let Some(expression) = template.expressions.get(index) {
            out.push_str(text_of(expression)?);
        }
        if out.len() > MAX_BUILT_LEN {
            return None;
        }
    }
    Some(Pure::Str(out))
}

struct CallView<'a> {
    object: &'a Expression<'a>,
    name: &'a str,
    args: Vec<&'a Expression<'a>>,
}

fn fold_call(expr: &Expression, json_ok: bool) -> Option<Pure> {
    let call = call_parts(expr)?;
    if let Some(text) = text_of(call.object) {
        return fold_string_call(text, call.name, &call.args);
    }
    if let Some(Pure::Array(items)) = as_pure(call.object, 0) {
        return fold_array_call(items, call.name, &call.args);
    }
    if call.name == "parse" {
        return fold_json_parse(call.object, &call.args, json_ok);
    }
    None
}

fn call_parts<'a>(expr: &'a Expression<'a>) -> Option<CallView<'a>> {
    let Expression::CallExpression(call) = expr else {
        return None;
    };
    if call.optional || call.type_arguments.is_some() {
        return None;
    }
    let Expression::StaticMemberExpression(member) = &call.callee else {
        return None;
    };
    if member.optional {
        return None;
    }
    let mut args = Vec::with_capacity(call.arguments.len());
    for argument in &call.arguments {
        args.push(argument.as_expression()?);
    }
    Some(CallView {
        object: &member.object,
        name: member.property.name.as_str(),
        args,
    })
}

fn fold_json_parse(object: &Expression, args: &[&Expression], json_ok: bool) -> Option<Pure> {
    if !json_ok || args.len() != 1 {
        return None;
    }
    let Expression::Identifier(ident) = peel(object) else {
        return None;
    };
    if ident.name.as_str() != "JSON" {
        return None;
    }
    let text = text_of(args[0])?;
    if text.len() > MAX_JSON_LEN {
        return None;
    }
    let mut deserializer = serde_json::Deserializer::from_str(text);
    let value = JsonSeed { depth: 0 }.deserialize(&mut deserializer).ok()?;
    deserializer.end().ok()?;
    Some(value)
}

struct JsonSeed {
    depth: u32,
}

impl<'de> DeserializeSeed<'de> for JsonSeed {
    type Value = Pure;

    fn deserialize<D: Deserializer<'de>>(self, deserializer: D) -> Result<Pure, D::Error> {
        deserializer.deserialize_any(self)
    }
}

impl<'de> Visitor<'de> for JsonSeed {
    type Value = Pure;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("JSON value")
    }

    fn visit_bool<E: serde::de::Error>(self, value: bool) -> Result<Pure, E> {
        Ok(Pure::Bool(value))
    }

    fn visit_i64<E: serde::de::Error>(self, value: i64) -> Result<Pure, E> {
        json_number(value as f64)
    }

    fn visit_u64<E: serde::de::Error>(self, value: u64) -> Result<Pure, E> {
        json_number(value as f64)
    }

    fn visit_f64<E: serde::de::Error>(self, value: f64) -> Result<Pure, E> {
        json_number(value)
    }

    fn visit_unit<E: serde::de::Error>(self) -> Result<Pure, E> {
        Ok(Pure::Null)
    }

    fn visit_str<E: serde::de::Error>(self, value: &str) -> Result<Pure, E> {
        Ok(Pure::Str(value.to_string()))
    }

    fn visit_string<E: serde::de::Error>(self, value: String) -> Result<Pure, E> {
        Ok(Pure::Str(value))
    }

    fn visit_seq<A: SeqAccess<'de>>(self, mut seq: A) -> Result<Pure, A::Error> {
        if self.depth > MAX_DEPTH {
            return Err(serde::de::Error::custom("JSON value is too deep"));
        }
        let mut items = Vec::new();
        while let Some(item) = seq.next_element_seed(JsonSeed {
            depth: self.depth + 1,
        })? {
            items.push(item);
        }
        Ok(Pure::Array(items))
    }

    fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Pure, A::Error> {
        if self.depth > MAX_DEPTH {
            return Err(serde::de::Error::custom("JSON value is too deep"));
        }
        let mut properties = Vec::new();
        while let Some(key) = map.next_key::<String>()? {
            let value = map.next_value_seed(JsonSeed {
                depth: self.depth + 1,
            })?;
            if key == "__proto__" {
                return Err(serde::de::Error::custom("JSON object has a __proto__ key"));
            }
            if let Some(existing) = properties.iter_mut().find(|(name, _)| name == &key) {
                existing.1 = value;
            } else {
                properties.push((key, value));
            }
        }
        Ok(Pure::Object(properties))
    }
}

fn json_number<E: serde::de::Error>(number: f64) -> Result<Pure, E> {
    if !number.is_finite() {
        return Err(E::custom("JSON number is not finite"));
    }
    Ok(Pure::Num(number))
}

fn fold_string_call(text: &str, name: &str, args: &[&Expression]) -> Option<Pure> {
    match name {
        "endsWith" => {
            if args.len() != 1 {
                return None;
            }
            Some(Pure::Bool(text.ends_with(text_of(args[0])?)))
        }
        "includes" => {
            if args.len() != 1 {
                return None;
            }
            Some(Pure::Bool(text.contains(text_of(args[0])?)))
        }
        "repeat" => fold_repeat(text, args),
        "padStart" => fold_pad(text, args, false),
        "padEnd" => fold_pad(text, args, true),
        "split" => fold_split(text, args),
        "at" => fold_string_at(text, args),
        _ => None,
    }
}

fn fold_repeat(text: &str, args: &[&Expression]) -> Option<Pure> {
    if args.len() != 1 {
        return None;
    }
    let count = as_safe_int(args[0])?;
    if count < 0 {
        return None;
    }
    let count = usize::try_from(count).ok()?;
    let len = text.len().checked_mul(count)?;
    if len > MAX_BUILT_LEN {
        return None;
    }
    Some(Pure::Str(text.repeat(count)))
}

fn fold_pad(text: &str, args: &[&Expression], at_end: bool) -> Option<Pure> {
    if !text.is_ascii() || (args.len() != 1 && args.len() != 2) {
        return None;
    }
    let target = as_safe_int(args[0])?;
    let pad = if args.len() == 2 {
        text_of(args[1])?
    } else {
        " "
    };
    if !pad.is_ascii() || pad.len() > MAX_BUILT_LEN {
        return None;
    }
    let target = usize::try_from(target.max(0)).ok()?;
    if target > MAX_BUILT_LEN || text.len() >= target || pad.is_empty() {
        return Some(Pure::Str(text.to_string()));
    }
    let fill = target - text.len();
    let mut filler = String::new();
    while filler.len() < fill {
        filler.push_str(pad);
        if filler.len() > MAX_BUILT_LEN {
            return None;
        }
    }
    let piece = &filler[..fill];
    let mut out = String::with_capacity(target);
    if at_end {
        out.push_str(text);
        out.push_str(piece);
    } else {
        out.push_str(piece);
        out.push_str(text);
    }
    Some(Pure::Str(out))
}

fn fold_split(text: &str, args: &[&Expression]) -> Option<Pure> {
    if args.len() != 1 && args.len() != 2 {
        return None;
    }
    let separator = text_of(args[0])?;
    let limit = if args.len() == 2 {
        let limit = as_safe_int(args[1])?;
        if limit < 0 {
            return None;
        }
        Some(usize::try_from(limit).ok()?)
    } else {
        None
    };
    if limit == Some(0) {
        return Some(Pure::Array(Vec::new()));
    }
    if separator.is_empty() {
        if !text.is_ascii() {
            return None;
        }
        let mut items = Vec::new();
        for byte in text.bytes() {
            if limit == Some(items.len()) {
                break;
            }
            if items.len() >= MAX_PARTS {
                return None;
            }
            items.push(Pure::Str((byte as char).to_string()));
        }
        return Some(Pure::Array(items));
    }
    let parts: Vec<&str> = text.split(separator).collect();
    if parts.len() > MAX_PARTS {
        return None;
    }
    let take = limit.unwrap_or(parts.len()).min(parts.len());
    Some(Pure::Array(
        parts
            .into_iter()
            .take(take)
            .map(|part| Pure::Str(part.to_string()))
            .collect(),
    ))
}

fn fold_string_at(text: &str, args: &[&Expression]) -> Option<Pure> {
    if args.len() != 1 || !text.is_ascii() {
        return None;
    }
    let len = i64::try_from(text.len()).ok()?;
    let Some(index) = resolve_at(len, as_safe_int(args[0])?) else {
        return Some(Pure::Undef);
    };
    Some(Pure::Str((text.as_bytes()[index] as char).to_string()))
}

fn fold_array_call(items: Vec<Pure>, name: &str, args: &[&Expression]) -> Option<Pure> {
    match name {
        "join" => fold_join(&items, args),
        "slice" => fold_slice(&items, args),
        "concat" => fold_concat(items, args),
        "includes" => {
            if args.len() != 1 {
                return None;
            }
            let search = as_pure(args[0], 0)?;
            Some(Pure::Bool(
                items.iter().any(|item| same_value_zero(item, &search)),
            ))
        }
        "indexOf" => {
            if args.len() != 1 {
                return None;
            }
            let search = as_pure(args[0], 0)?;
            let index = items
                .iter()
                .position(|item| strict_eq(item, &search))
                .map_or(-1, |index| index as i64);
            int_value(index)
        }
        "at" => {
            if args.len() != 1 {
                return None;
            }
            let len = i64::try_from(items.len()).ok()?;
            let Some(index) = resolve_at(len, as_safe_int(args[0])?) else {
                return Some(Pure::Undef);
            };
            Some(items[index].clone())
        }
        _ => None,
    }
}

fn fold_join(items: &[Pure], args: &[&Expression]) -> Option<Pure> {
    let separator = match args {
        [] => ",",
        [separator] => text_of(separator)?,
        _ => return None,
    };
    let mut out = String::new();
    for (index, item) in items.iter().enumerate() {
        if index > 0 {
            out.push_str(separator);
        }
        out.push_str(&primitive_string(item)?);
        if out.len() > MAX_BUILT_LEN {
            return None;
        }
    }
    Some(Pure::Str(out))
}

fn fold_slice(items: &[Pure], args: &[&Expression]) -> Option<Pure> {
    if args.len() > 2 {
        return None;
    }
    let len = i64::try_from(items.len()).ok()?;
    let start = if args.is_empty() {
        0
    } else {
        as_safe_int(args[0])?
    };
    let end = if args.len() < 2 {
        len
    } else {
        as_safe_int(args[1])?
    };
    let start = clamp_relative(start, len);
    let end = clamp_relative(end, len);
    if start >= end {
        return Some(Pure::Array(Vec::new()));
    }
    Some(Pure::Array(items[start as usize..end as usize].to_vec()))
}

fn fold_concat(mut items: Vec<Pure>, args: &[&Expression]) -> Option<Pure> {
    for arg in args {
        match as_pure(arg, 0)? {
            Pure::Array(extra) => {
                if items.len() + extra.len() > MAX_PARTS {
                    return None;
                }
                items.extend(extra);
            }
            other => {
                if items.len() >= MAX_PARTS {
                    return None;
                }
                items.push(other);
            }
        }
    }
    Some(Pure::Array(items))
}

fn fold_member(expr: &Expression) -> Option<Pure> {
    match expr {
        Expression::StaticMemberExpression(member) if !member.optional => {
            fold_access(&member.object, member.property.name.as_str())
        }
        Expression::ComputedMemberExpression(member) if !member.optional => {
            fold_access(&member.object, &key_text(&member.expression)?)
        }
        _ => None,
    }
}

fn fold_access(object: &Expression, key: &str) -> Option<Pure> {
    if let Some(text) = text_of(object) {
        return fold_string_key(text, key);
    }
    match as_pure(object, 0)? {
        Pure::Array(items) => fold_array_key(&items, key),
        Pure::Object(properties) => properties
            .into_iter()
            .find(|(name, _)| name == key)
            .map(|(_, value)| value),
        _ => None,
    }
}

fn fold_string_key(text: &str, key: &str) -> Option<Pure> {
    if key == "length" {
        return Some(Pure::Num(utf16_len(text) as f64));
    }
    let index = canonical_index(key)?;
    if index < 0 {
        return Some(Pure::Undef);
    }
    if !text.is_ascii() {
        return None;
    }
    let Some(index) = usize::try_from(index).ok() else {
        return Some(Pure::Undef);
    };
    match text.as_bytes().get(index) {
        Some(byte) => Some(Pure::Str((*byte as char).to_string())),
        None => Some(Pure::Undef),
    }
}

fn fold_array_key(items: &[Pure], key: &str) -> Option<Pure> {
    if key == "length" {
        return int_value(i64::try_from(items.len()).ok()?);
    }
    let index = canonical_index(key)?;
    if index < 0 {
        return Some(Pure::Undef);
    }
    let Some(index) = usize::try_from(index).ok() else {
        return Some(Pure::Undef);
    };
    Some(items.get(index).cloned().unwrap_or(Pure::Undef))
}

fn key_text(expr: &Expression) -> Option<String> {
    if let Some(text) = text_of(expr) {
        return Some(text.to_string());
    }
    Some(as_safe_int(expr)?.to_string())
}

fn peel<'a>(expr: &'a Expression<'a>) -> &'a Expression<'a> {
    let mut expr = expr;
    while let Expression::ParenthesizedExpression(paren) = expr {
        expr = &paren.expression;
    }
    expr
}

fn as_pure(expr: &Expression, depth: u32) -> Option<Pure> {
    if depth > MAX_DEPTH {
        return None;
    }
    let expr = peel(expr);
    match expr {
        Expression::StringLiteral(literal) if !literal.lone_surrogates => {
            Some(Pure::Str(literal.value.to_string()))
        }
        Expression::NumericLiteral(literal) if literal.value.is_finite() => {
            Some(Pure::Num(literal.value))
        }
        Expression::BooleanLiteral(literal) => Some(Pure::Bool(literal.value)),
        Expression::NullLiteral(_) => Some(Pure::Null),
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::Void => {
            as_pure(&unary.argument, depth + 1)?;
            Some(Pure::Undef)
        }
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::UnaryNegation => {
            int_value(as_safe_int(&unary.argument)?.checked_neg()?)
        }
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::UnaryPlus => {
            int_value(as_safe_int(&unary.argument)?)
        }
        Expression::ArrayExpression(array) => {
            let mut items = Vec::with_capacity(array.elements.len());
            for element in &array.elements {
                items.push(as_pure(element.as_expression()?, depth + 1)?);
            }
            Some(Pure::Array(items))
        }
        Expression::ObjectExpression(object) => as_object(object, depth),
        _ => None,
    }
}

fn as_object(object: &ObjectExpression, depth: u32) -> Option<Pure> {
    if depth > MAX_DEPTH {
        return None;
    }
    let mut properties = Vec::new();
    for property in &object.properties {
        let ObjectPropertyKind::ObjectProperty(property) = property else {
            return None;
        };
        if property.kind != PropertyKind::Init || property.method || property.shorthand {
            return None;
        }
        let key = property_name(&property.key)?;
        if key == "__proto__" {
            return None;
        }
        let value = as_pure(&property.value, depth + 1)?;
        if let Some(existing) = properties.iter_mut().find(|(name, _)| name == &key) {
            existing.1 = value;
        } else {
            properties.push((key, value));
        }
    }
    Some(Pure::Object(properties))
}

fn property_name(key: &PropertyKey) -> Option<String> {
    match key {
        PropertyKey::StaticIdentifier(ident) => Some(ident.name.to_string()),
        PropertyKey::PrivateIdentifier(_) => None,
        other => {
            let expr = other.as_expression()?;
            if let Some(text) = text_of(expr) {
                return Some(text.to_string());
            }
            Some(as_safe_int(expr)?.to_string())
        }
    }
}

fn as_safe_int(expr: &Expression) -> Option<i64> {
    let expr = peel(expr);
    match expr {
        Expression::NumericLiteral(literal) => f64_safe(literal.value),
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::UnaryNegation => {
            safe_int(as_safe_int(&unary.argument)?.checked_neg()?)
        }
        Expression::UnaryExpression(unary) if unary.operator == UnaryOperator::UnaryPlus => {
            as_safe_int(&unary.argument)
        }
        _ => None,
    }
}

fn text_of<'a>(expr: &'a Expression<'a>) -> Option<&'a str> {
    let expr = peel(expr);
    match expr {
        Expression::StringLiteral(literal) if !literal.lone_surrogates => {
            Some(literal.value.as_str())
        }
        _ => None,
    }
}

fn pure_int(value: &Pure) -> Option<i64> {
    match value {
        Pure::Num(number) => f64_safe(*number),
        _ => None,
    }
}

fn to_number(value: &Pure) -> Option<i64> {
    match value {
        Pure::Num(number) => f64_safe(*number),
        Pure::Bool(true) => Some(1),
        Pure::Bool(false) => Some(0),
        Pure::Null => Some(0),
        _ => None,
    }
}

fn stringify_primitive(value: &Pure) -> Option<String> {
    match value {
        Pure::Str(text) => Some(text.clone()),
        Pure::Num(number) => Some(f64_safe(*number)?.to_string()),
        Pure::Bool(true) => Some("true".to_string()),
        Pure::Bool(false) => Some("false".to_string()),
        Pure::Null => Some("null".to_string()),
        Pure::Undef => Some("undefined".to_string()),
        Pure::Array(_) | Pure::Object(_) => None,
    }
}

fn primitive_string(value: &Pure) -> Option<String> {
    match value {
        Pure::Null | Pure::Undef => Some(String::new()),
        other => stringify_primitive(other),
    }
}

fn num_op(left: &Pure, right: &Pure, op: fn(i64, i64) -> Option<i64>) -> Option<Pure> {
    int_value(op(to_number(left)?, to_number(right)?)?)
}

fn int_value(number: i64) -> Option<Pure> {
    Some(Pure::Num(safe_int(number)? as f64))
}

fn safe_int(number: i64) -> Option<i64> {
    if (-SAFE_INT_MAX..=SAFE_INT_MAX).contains(&number) {
        Some(number)
    } else {
        None
    }
}

fn f64_safe(number: f64) -> Option<i64> {
    if !number.is_finite() || number.fract() != 0.0 {
        return None;
    }
    let integer = number as i64;
    if integer as f64 != number {
        return None;
    }
    safe_int(integer)
}

fn canonical_index(key: &str) -> Option<i64> {
    if key == "-0" {
        return None;
    }
    let number: i64 = key.parse().ok()?;
    if number.to_string() != key {
        return None;
    }
    safe_int(number)
}

fn utf16_len(text: &str) -> usize {
    text.encode_utf16().count()
}

fn clamp_relative(index: i64, len: i64) -> i64 {
    let index = if index < 0 {
        len.saturating_add(index)
    } else {
        index
    };
    index.clamp(0, len)
}

fn resolve_at(len: i64, index: i64) -> Option<usize> {
    let index = if index < 0 {
        len.saturating_add(index)
    } else {
        index
    };
    if index < 0 || index >= len {
        None
    } else {
        usize::try_from(index).ok()
    }
}

fn same_value_zero(left: &Pure, right: &Pure) -> bool {
    match (left, right) {
        (Pure::Str(left), Pure::Str(right)) => left == right,
        (Pure::Num(left), Pure::Num(right)) => left == right || (left.is_nan() && right.is_nan()),
        (Pure::Bool(left), Pure::Bool(right)) => left == right,
        (Pure::Null, Pure::Null) | (Pure::Undef, Pure::Undef) => true,
        _ => false,
    }
}

fn strict_eq(left: &Pure, right: &Pure) -> bool {
    match (left, right) {
        (Pure::Num(left), Pure::Num(right)) if left.is_nan() || right.is_nan() => false,
        _ => same_value_zero(left, right),
    }
}

fn emit<'a>(value: &Pure, span: Span, builder: &AstBuilder<'a>) -> Expression<'a> {
    match value {
        Pure::Str(text) => {
            Expression::new_string_literal(span, Str::from_str_in(text, builder), None, builder)
        }
        Pure::Num(number) => {
            Expression::new_numeric_literal(span, *number, None, NumberBase::Decimal, builder)
        }
        Pure::Bool(value) => Expression::new_boolean_literal(span, *value, builder),
        Pure::Null => Expression::new_null_literal(span, builder),
        Pure::Undef => Expression::new_unary_expression(
            span,
            UnaryOperator::Void,
            Expression::new_numeric_literal(span, 0.0, None, NumberBase::Decimal, builder),
            builder,
        ),
        Pure::Array(items) => {
            let mut elements = oxc_allocator::Vec::new_in(builder);
            for item in items {
                elements.push(emit(item, span, builder).into());
            }
            Expression::new_array_expression(span, elements, builder)
        }
        Pure::Object(properties) => {
            let mut fields = oxc_allocator::Vec::new_in(builder);
            for (key, item) in properties {
                fields.push(ObjectPropertyKind::new_object_property(
                    SPAN,
                    PropertyKind::Init,
                    emit_key(key, builder),
                    emit(item, span, builder),
                    false,
                    false,
                    false,
                    builder,
                ));
            }
            Expression::new_object_expression(span, fields, builder)
        }
    }
}

fn emit_key<'a>(key: &str, builder: &AstBuilder<'a>) -> PropertyKey<'a> {
    if key != "__proto__" && is_identifier_name(key) {
        return PropertyKey::new_static_identifier(SPAN, Ident::from_str_in(key, builder), builder);
    }
    if let Some(number) = canonical_index(key) {
        return PropertyKey::new_numeric_literal(
            SPAN,
            number as f64,
            None,
            NumberBase::Decimal,
            builder,
        );
    }
    PropertyKey::new_string_literal(SPAN, Str::from_str_in(key, builder), None, builder)
}
