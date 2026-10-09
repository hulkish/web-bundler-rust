use oxc_sourcemap::{OwnedSourceMap, SourceMapBuilder};

#[derive(Debug, Clone)]
pub struct Point {
    pub generated: u32,
    pub original: u32,
    pub source: usize,
}

pub fn build_map(
    file: &str,
    generated: &str,
    sources: &[(String, String)],
    mut points: Vec<Point>,
) -> String {
    points.sort_by_key(|point| (point.generated, point.source, point.original));
    points.dedup_by(|left, right| left.generated == right.generated && left.source == right.source);

    let mut builder = SourceMapBuilder::default();
    builder.set_file(file);
    let mut source_ids = Vec::with_capacity(sources.len());
    for (name, contents) in sources {
        source_ids.push(builder.add_source_and_content(name, contents));
    }
    let generated_lines = LineIndex::new(generated);
    let source_lines = sources
        .iter()
        .map(|(_, contents)| LineIndex::new(contents))
        .collect::<Vec<_>>();
    let mut previous = None;
    for point in points {
        let Some(source_id) = source_ids.get(point.source).copied() else {
            continue;
        };
        let Some(lines) = source_lines.get(point.source) else {
            continue;
        };
        let (dst_line, dst_col) = generated_lines.line_col(point.generated);
        let (src_line, src_col) = lines.line_col(point.original);
        let token = (dst_line, dst_col, source_id);
        if previous == Some(token) {
            continue;
        }
        previous = Some(token);
        builder.add_token(dst_line, dst_col, src_line, src_col, Some(source_id), None);
    }
    builder.into_sourcemap().to_json_string()
}

/// Byte offsets where each line starts, so a mapping can be located without
/// scanning the file from the beginning.
struct LineIndex {
    len: u32,
    starts: Vec<u32>,
}

impl LineIndex {
    fn new(source: &str) -> Self {
        let mut starts = Vec::new();
        starts.push(0);
        for (index, byte) in source.bytes().enumerate() {
            if byte == b'\n' {
                starts.push((index + 1) as u32);
            }
        }
        Self {
            len: source.len() as u32,
            starts,
        }
    }

    fn line_col(&self, offset: u32) -> (u32, u32) {
        let offset = offset.min(self.len);
        let line = self.starts.partition_point(|start| *start <= offset) - 1;
        let start = self.starts[line];
        (line as u32, offset - start)
    }
}

#[cfg(test)]
fn line_col(source: &str, offset: u32) -> (u32, u32) {
    LineIndex::new(source).line_col(offset)
}

pub fn compose_maps(generated: OwnedSourceMap, input: OwnedSourceMap) -> OwnedSourceMap {
    generated.compose(input)
}

pub fn parse_map(json: &str) -> Option<OwnedSourceMap> {
    OwnedSourceMap::from_json_string(json).ok()
}

#[cfg(test)]
mod tests {
    use super::line_col;

    #[test]
    fn line_columns_follow_newlines() {
        let source = "ab\ncd\n";
        assert_eq!(line_col(source, 0), (0, 0));
        assert_eq!(line_col(source, 2), (0, 2));
        assert_eq!(line_col(source, 3), (1, 0));
        assert_eq!(line_col(source, 5), (1, 2));
        assert_eq!(line_col(source, 6), (2, 0));
        assert_eq!(line_col(source, 100), (2, 0));
        assert_eq!(line_col("", 0), (0, 0));
        assert_eq!(line_col("no-nl", 5), (0, 5));
    }
}
