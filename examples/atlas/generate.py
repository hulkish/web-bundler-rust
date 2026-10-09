#!/usr/bin/env python3
"""Build the Atlas example: a large, readable module graph for --threads.

Run from anywhere:

    python3 examples/atlas/generate.py

The script rewrites examples/atlas/src and the config files. It leaves
README.md alone.
"""

import json
import shutil
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"

ENTRIES = ["catalog", "warehouse", "storefront", "dispatch", "archive", "ledger"]
SHARED = 125
BRIDGES = 78
AREA_MODS = 38
LAZY = 18
CSS_FILES = 26
SVG_ICONS = 40
PNG_ICONS = 40

EXTERNALS = [
    "react",
    "react-dom",
    "lodash",
    "axios",
    "vue",
    "express",
    "redux",
    "moment",
    "chalk",
    "commander",
    "debug",
    "glob",
    "minimist",
    "uuid",
    "rxjs",
    "zod",
    "date-fns",
    "classnames",
    "immutable",
    "ramda",
    "underscore",
    "jquery",
    "d3",
    "three",
    "marked",
    "ws",
    "mongoose",
    "sequelize",
    "knex",
    "pg",
    "mysql2",
    "redis",
    "graphql",
    "next",
    "prettier",
    "eslint",
    "typescript",
    "jest",
    "mocha",
    "chai",
    "sinon",
    "dotenv",
    "cors",
    "helmet",
    "morgan",
    "jsonwebtoken",
    "bcrypt",
    "passport",
    "multer",
    "joi",
    "yup",
    "dayjs",
    "luxon",
    "nanoid",
    "semver",
    "execa",
    "globby",
]

KB = 1024


def main():
    if SRC.exists():
        shutil.rmtree(SRC)
    icons = write_icons()
    css = write_styles(icons)
    files = write_javascript(icons) + css
    write_config()
    write_manifest(files)
    js = [item for item in files if item["kind"] == "javascript"]
    css = [item for item in files if item["kind"] == "css"]
    print(f"javascript files: {len(js)}")
    print(f"  smallest: {min(item['bytes'] for item in js)} bytes")
    print(f"  largest:  {max(item['bytes'] for item in js)} bytes")
    print(f"css files: {len(css)}")
    print(f"  smallest: {min(item['bytes'] for item in css)} bytes")
    print(f"  largest:  {max(item['bytes'] for item in css)} bytes")
    print(f"icons: {SVG_ICONS} svg + {PNG_ICONS} png")
    print(f"external packages: {len(EXTERNALS)}")
    if len(js) < 500 or len(js) > 600:
        raise SystemExit(f"expected 500-600 javascript files, found {len(js)}")
    if len(css) < 20 or len(css) > 30:
        raise SystemExit(f"expected 20-30 css files, found {len(css)}")
    for item in js:
        if item["bytes"] < 20 * KB or item["bytes"] > 200 * KB:
            raise SystemExit(f"{item['path']} is {item['bytes']} bytes")
    for item in css:
        if item["bytes"] < 20 * KB or item["bytes"] > 150 * KB:
            raise SystemExit(f"{item['path']} is {item['bytes']} bytes")


def write_icons():
    svg_dir = SRC / "icons" / "svg"
    png_dir = SRC / "icons" / "png"
    svg_dir.mkdir(parents=True)
    png_dir.mkdir(parents=True)
    icons = []
    for index in range(SVG_ICONS):
        name = f"icon-{index:02d}.svg"
        color = f"#{(index * 9973) & 0xFFFFFF:06x}"
        accent = f"#{(index * 431) & 0xFFFFFF:06x}"
        svg_dir.joinpath(name).write_text(
            "\n".join(
                [
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img">',
                    f"  <title>Atlas icon {index}</title>",
                    f'  <rect width="24" height="24" rx="3" fill="{color}"/>',
                    f'  <circle cx="12" cy="12" r="{4 + (index % 5)}" fill="{accent}"/>',
                    "</svg>",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        icons.append(("svg", name))
    for index in range(PNG_ICONS):
        name = f"icon-{index:02d}.png"
        red = (index * 37) % 256
        green = (index * 91) % 256
        blue = (index * 17) % 256
        png_dir.joinpath(name).write_bytes(png_bytes(red, green, blue))
        icons.append(("png", name))
    return icons


def png_bytes(red, green, blue, size=8):
    def chunk(tag, data):
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw = b"".join(b"\x00" + bytes((red, green, blue)) * size for _ in range(size))
    header = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def write_styles(icons):
    style_dir = SRC / "styles"
    style_dir.mkdir(parents=True)
    records = []
    for index in range(CSS_FILES):
        target = css_target(index)
        text = render_css(index, target, icons)
        path = style_dir / f"sheet-{index:02d}.css"
        path.write_text(text, encoding="utf-8")
        records.append({"path": rel(path), "kind": "css", "bytes": path.stat().st_size})
    return records


def css_target(index):
    if index < 4:
        return 20 * KB
    if index >= CSS_FILES - 3:
        return 150 * KB
    return (30 + (index * 17) % 61) * KB


def render_css(index, target, icons):
    parts = [
        f"/* Atlas stylesheet {index:02d}. Imported from src/shared/styles.js. */\n",
        ":root {\n",
        f"  --atlas-sheet: {index};\n",
        "  --atlas-ink: #1b1a17;\n",
        "  --atlas-paper: #f4efe6;\n",
        "}\n",
    ]
    # A few urls that must stay untouched, on the first sheet only.
    if index == 0:
        parts.append(
            "\n".join(
                [
                    ".atlas-remote { background: url(\"https://cdn.example.test/atlas.png\"); }",
                    ".atlas-inline { background: url(\"data:image/png;base64,aaaa\"); }",
                    ".atlas-missing { background: url(\"./not-shipped.png\"); }",
                    "",
                ]
            )
        )
    size = sum(len(part) for part in parts)
    rule = 0
    while size < target:
        icon = icons[(index * 13 + rule) % len(icons)]
        folder = "svg" if icon[0] == "svg" else "png"
        url = f'url("../icons/{folder}/{icon[1]}")'
        block = [
            f".atlas-s{index:02d}-r{rule:04d} {{",
            "  margin: 0px;",
            "  padding: 0px 0px 0px 0px;",
            "  color: #ffffff;",
            "  background-color: rgb(255, 255, 255);",
            "  font-weight: normal;",
        ]
        if rule % 11 == 0:
            block.append(f"  background-image: {url};")
        if rule % 19 == 0:
            block.append(f"  border-image-source: {url};")
        block.append("}")
        if rule % 23 == 0:
            block.append(f".atlas-s{index:02d}-r{rule:04d} {{ margin: 0px; }}")
        if rule % 29 == 0:
            block.extend(
                [
                    f"@media (min-width: {40 + (rule % 20)}rem) {{",
                    f"  .atlas-s{index:02d}-r{rule:04d} {{ outline: 1px solid transparent; }}",
                    "}",
                ]
            )
        text = "\n".join(block) + "\n"
        if size >= target:
            break
        if size + len(text) > 150 * KB and size >= 20 * KB:
            break
        parts.append(text)
        size += len(text)
        rule += 1
    return "".join(parts)


def write_javascript(icons):
    records = []
    records.extend(write_shared())
    records.extend(write_bridges())
    records.extend(write_areas())
    records.extend(write_entries())
    return records


def write_shared():
    records = []
    shared = SRC / "shared"
    shared.mkdir(parents=True)
    # Two modules import each other so the graph has a real cycle.
    for index in range(SHARED):
        path = shared / f"mod-{index:03d}.js"
        role = (
            "Shared by every entry through src/shared/boot.js, so the bundler "
            "places it in chunk.js."
        )
        extra = []
        if index == 0:
            extra.append('import { marker as otherMarker } from "./mod-001.js";')
            extra.append("export function marker() { return 1; }")
            extra.append("export function cycle() { return otherMarker() + 1; }")
        elif index == 1:
            extra.append('import { marker as otherMarker } from "./mod-000.js";')
            extra.append("export function marker() { return 2; }")
            extra.append("export function cycle() { return otherMarker() + 2; }")
        vendor = external_import(index) if index < len(EXTERNALS) else ""
        body = module_source(
            title=f"shared/mod-{index:03d}.js",
            role=role,
            imports=extra + ([vendor] if vendor else []),
            prefix="shared",
            salt=index,
            target=js_target(index),
        )
        path.write_text(body, encoding="utf-8")
        records.append(record(path, "javascript"))

    boot_imports = ['import tables from "./tables.json";', 'import { sheets } from "./styles.js";', 'import { markUrl } from "./marks.js";']
    boot_imports.extend(
        f'import {{ collect as shared{index:03d} }} from "./mod-{index:03d}.js";'
        for index in range(SHARED)
    )
    calls = " + ".join(f"shared{index:03d}(n)" for index in range(SHARED))
    boot = "\n".join(
        [
            "// src/shared/boot.js",
            "// Imported by every entry. Everything it reaches is shared and goes into chunk.js.",
            *boot_imports,
            "export function boot(n) {",
            f"  return {calls} + tables.lanes + sheets + markUrl.length;",
            "}",
            "",
        ]
    )
    boot_path = shared / "boot.js"
    boot_path.write_text(pad_module(boot, "boot", 400, js_target(SHARED + 1)), encoding="utf-8")
    records.append(record(boot_path, "javascript"))

    style_imports = [
        f'import "../styles/sheet-{index:02d}.css";' for index in range(CSS_FILES)
    ]
    styles = "\n".join(
        [
            "// src/shared/styles.js",
            "// Pulls every stylesheet into the CSS bundle. Image urls in those sheets",
            "// are copied next to the output and rewritten.",
            *style_imports,
            f"export const sheets = {CSS_FILES};",
            "",
        ]
    )
    styles_path = shared / "styles.js"
    styles_path.write_text(
        pad_module(styles, "styles", 500, js_target(SHARED + 2)), encoding="utf-8"
    )
    records.append(record(styles_path, "javascript"))

    marks = "\n".join(
        [
            "// src/shared/marks.js",
            "// A JavaScript import of an icon, in addition to the CSS url() references.",
            'import mark from "../icons/svg/icon-00.svg";',
            "export const markUrl = mark;",
            "",
        ]
    )
    marks_path = shared / "marks.js"
    marks_path.write_text(
        pad_module(marks, "marks", 600, js_target(SHARED + 3)), encoding="utf-8"
    )
    records.append(record(marks_path, "javascript"))

    (shared / "tables.json").write_text(
        json.dumps({"lanes": len(ENTRIES), "name": "atlas"}, indent=2) + "\n",
        encoding="utf-8",
    )
    return records


def write_bridges():
    records = []
    folder = SRC / "bridges"
    folder.mkdir(parents=True)
    pairs = [
        (ENTRIES[left], ENTRIES[right])
        for left in range(len(ENTRIES))
        for right in range(left + 1, len(ENTRIES))
    ]
    for index in range(BRIDGES):
        left, right = pairs[index % len(pairs)]
        path = folder / f"bridge-{index:03d}.js"
        role = (
            f"Imported by the {left} and {right} entries only, so it is still shared "
            "and lands in chunk.js."
        )
        body = module_source(
            title=f"bridges/bridge-{index:03d}.js",
            role=role,
            imports=[f'import {{ collect as shared }} from "../shared/mod-{(index % 20):03d}.js";'],
            prefix="bridge",
            salt=1000 + index,
            target=js_target(700 + index),
            tail="export function bridge(n) { return collect(n) + shared(n); }",
        )
        path.write_text(body, encoding="utf-8")
        records.append(record(path, "javascript"))
    return records


def write_areas():
    records = []
    for area_index, area in enumerate(ENTRIES):
        folder = SRC / "areas" / area
        lazy = SRC / "lazy" / area
        folder.mkdir(parents=True)
        lazy.mkdir(parents=True)
        mod_names = []
        for index in range(AREA_MODS):
            jsx = index % 20 == 0
            ext = "jsx" if jsx else "js"
            name = f"mod-{index:03d}.{ext}"
            mod_names.append(name)
            vendor = ""
            slot = area_index * AREA_MODS + index
            if slot < len(EXTERNALS):
                vendor = external_import(slot, alias="areaVendor")
            imports = [
                f'import {{ collect as shared }} from "../../shared/mod-{(index % 20):03d}.js";'
            ]
            if vendor:
                imports.append(vendor)
            if jsx:
                imports.append("export function Card(props) {")
                imports.append('  const label = "lane-" + props.n;')
                imports.append("  return <article className={label}>{1 + 2}</article>;")
                imports.append("}")
            role = (
                f"Private to the {area} entry. Only src/areas/{area}/index.js imports it, "
                "so it stays in that entry's output file."
            )
            body = module_source(
                title=f"areas/{area}/{name}",
                role=role,
                imports=imports,
                prefix=area,
                salt=2000 + slot,
                target=js_target(900 + slot),
                tail="export function area(n) { return collect(n) + shared(n); }",
            )
            path = folder / name
            path.write_text(body, encoding="utf-8")
            records.append(record(path, "javascript"))

        reexports = [
            f'export {{ collect as part{index:03d}, area as area{index:03d} }} from "./{name}";'
            for index, name in enumerate(mod_names)
        ]
        calls = " + ".join(f"part{index:03d}(n)" for index in range(AREA_MODS))
        index_js = "\n".join(
            [
                f"// src/areas/{area}/index.js",
                f"// Barrel for the {area} entry. These modules are not imported by the other entries.",
                *reexports,
                "export function collect(n) {",
                f"  return {calls};",
                "}",
                "",
            ]
        )
        index_path = folder / "index.js"
        index_path.write_text(
            pad_module(index_js, f"{area}Index", 800 + area_index, js_target(1400 + area_index)),
            encoding="utf-8",
        )
        records.append(record(index_path, "javascript"))

        panels = []
        for index in range(LAZY):
            name = f"panel-{index:02d}.js"
            role = (
                f"Loaded with import() from the {area} loader. The specifier is a string "
                "literal so the bundler can include it, and it stays in the entry file."
            )
            body = module_source(
                title=f"lazy/{area}/{name}",
                role=role,
                imports=[
                    f'import {{ collect as shared }} from "../../shared/mod-{(index % 10):03d}.js";'
                ],
                prefix=f"{area}Panel",
                salt=3000 + area_index * LAZY + index,
                target=js_target(1600 + area_index * LAZY + index),
                tail="export function panel(n) { return collect(n) + shared(n); }",
            )
            path = lazy / name
            path.write_text(body, encoding="utf-8")
            records.append(record(path, "javascript"))
            panels.append(name)

        branches = []
        for index, name in enumerate(panels):
            branches.append(
                f'  if (id === {index}) return import("../../lazy/{area}/{name}").then((mod) => mod.panel(id));'
            )
        loader = "\n".join(
            [
                f"// src/areas/{area}/loader.js",
                f"// Dynamic import() of every {area} panel. Each call uses a string literal.",
                "export function loadPanels(id) {",
                *branches,
                f'  return import("../../lazy/{area}/{panels[0]}").then((mod) => mod.panel(id));',
                "}",
                "",
            ]
        )
        loader_path = folder / "loader.js"
        loader_path.write_text(
            pad_module(loader, f"{area}Loader", 820 + area_index, js_target(1800 + area_index)),
            encoding="utf-8",
        )
        records.append(record(loader_path, "javascript"))
    return records


def write_entries():
    records = []
    folder = SRC / "entries"
    folder.mkdir(parents=True)
    bridge_owners = {name: [] for name in ENTRIES}
    pairs = [
        (ENTRIES[left], ENTRIES[right])
        for left in range(len(ENTRIES))
        for right in range(left + 1, len(ENTRIES))
    ]
    for index in range(BRIDGES):
        left, right = pairs[index % len(pairs)]
        bridge_owners[left].append(index)
        bridge_owners[right].append(index)
    for area in ENTRIES:
        imports = [
            f"// src/entries/{area}.js",
            f"// Entry for the {area} desk. Shared modules come from boot.js;",
            "// this desk's own modules come from its area folder.",
            'import { boot } from "../shared/boot.js";',
            f'import {{ collect as area }} from "../areas/{area}/index.js";',
            f'import {{ loadPanels }} from "../areas/{area}/loader.js";',
        ]
        bridge_calls = []
        for index in bridge_owners[area]:
            imports.append(
                f'import {{ bridge as bridge{index:03d} }} from "../bridges/bridge-{index:03d}.js";'
            )
            bridge_calls.append(f"bridge{index:03d}(n)")
        joined = " + ".join(bridge_calls) if bridge_calls else "0"
        imports.extend(
            [
                "export async function main(n) {",
                "  const lazy = await loadPanels(n % "
                + str(LAZY)
                + ");",
                f"  return boot(n) + area(n) + lazy + {joined};",
                "}",
                "const total = await main(1);",
                "console.log(total);",
                "",
            ]
        )
        text = "\n".join(imports)
        path = folder / f"{area}.js"
        path.write_text(
            pad_module(text, f"{area}Entry", 900 + ENTRIES.index(area), js_target(2000 + ENTRIES.index(area))),
            encoding="utf-8",
        )
        records.append(record(path, "javascript"))
    return records


def external_import(index, alias="vendor"):
    name = EXTERNALS[index % len(EXTERNALS)]
    kind = index % 3
    if kind == 0:
        line = f'import {alias} from "{name}";'
    elif kind == 1:
        line = f'import * as {alias} from "{name}";'
    else:
        line = f'import {{ createElement as {alias} }} from "{name}";'
    return line + f"\nvoid {alias};"


def module_source(title, role, imports, prefix, salt, target, tail=""):
    import_lines = []
    rest = []
    for line in imports:
        if not line:
            continue
        for piece in line.split("\n"):
            if piece.startswith("import "):
                import_lines.append(piece)
            elif piece:
                rest.append(piece)
    header = "\n".join(
        [
            f"// src/{title}",
            f"// {role}",
            *import_lines,
            *rest,
            "",
        ]
    )
    return pad_module(header, prefix, salt, target, tail)


def pad_module(header, prefix, salt, target, tail=""):
    parts = [header if header.endswith("\n") else header + "\n"]
    size = len(parts[0])
    index = 0
    names = []
    while size < target:
        name = f"{prefix}Lane{index}"
        block = lane_function(name, salt + index, index % 4)
        footer_guess = 48 * (index + 2)
        if size + len(block) + footer_guess > 200 * KB and size >= 20 * KB:
            break
        parts.append(block)
        size += len(block)
        names.append(name)
        index += 1
    if names and "export function collect(" not in header:
        listed = ", ".join(names)
        footer = (
            f"const {prefix}Lanes = [{listed}];\n"
            f"export function collect(n) {{\n"
            f"  let total = 0;\n"
            f"  for (const lane of {prefix}Lanes) total += lane(n);\n"
            f"  return total;\n"
            f"}}\n"
        )
        parts.append(footer)
    if tail:
        parts.append(tail if tail.endswith("\n") else tail + "\n")
    text = "".join(parts)
    if len(text.encode("utf-8")) < 20 * KB:
        raise SystemExit(f"{prefix} is under 20KB ({len(text)} bytes)")
    return text


def lane_function(name, n, shape):
    left = (n % 4) + 1
    right = (n % 3) + 1
    literal = (n % 10)
    if shape == 1:
        body = "\n".join(
            [
                f"export function {name}(n) {{",
                "  let value = 0;",
                "  try {",
                f"    value = {n % 50} + {(n + 3) % 50};",
                "  } catch (error) {",
                "    value = 0;",
                "  }",
                "  switch (1) {",
                "    case 1:",
                f"      value += {n % 7};",
                "      break;",
                "    default:",
                "      value += missing();",
                "  }",
                "  const listed = Array.of(value, value + 1);",
                "  return listed[0] + n;",
                "}",
                "",
            ]
        )
        return body
    if shape == 2:
        return "\n".join(
            [
                f"export function {name}(n) {{",
                "  const Math = { abs: function (value) { return value; } };",
                f"  const safe = Math.abs({n % 20});",
                "  const roll = globalThis.Math.random();",
                "  const hole = new Array(1);",
                "  return safe + (roll >= 0 ? 0 : 1) + hole.length + n;",
                "}",
                "",
            ]
        )
    if shape == 3:
        return "\n".join(
            [
                f"export function {name}(code) {{",
                "  return function (value) {",
                "    const folded = 1 + 2;",
                "    return folded + value;",
                "  };",
                "}",
                "",
            ]
        )
    return "\n".join(
        [
            f"export function {name}(n) {{",
            f"  const added = {(n % 40)} + {(n % 25) + 1};",
            f'  const text = "atlas" + "-{name}";',
            f"  const flag = true ? {(n % 9) + 1} : missing();",
            f"  const abs = Math.abs(-{(n % 12) + 1});",
            f"  const listed = Array.of({n % 5}, {(n % 5) + 1}, {(n % 5) + 2});",
            '  const key = Object.keys({ a: 1, b: 2 })[0];',
            f"  const cell = [{n % 6}, {(n % 6) + 1}, {(n % 6) + 2}][1];",
            f"  const prop = ({{ lane: {n % 8} }}).lane;",
            "  const tmpl = `n${%d + %d}`;" % (left, right),
            "  const kind = typeof [];",
            "  const parsed = JSON.parse('{\"ok\":true,\"n\":%d}');" % literal,
            f"  const safe = Number.isInteger({n % 15});",
            f"  const pow = Math.pow(2, {n % 6});",
            "  const dead = false && missing();",
            "  const kept = true || missing();",
            f"  const seq = ({n % 3}, {(n % 3) + 1}, {(n % 3) + 2});",
            "  const width = [1, 2, 3].length;",
            "  const mapped = [1, 2].map(function (value) { return value + 1; });",
            "  const roll = Math.random();",
            "  const hole = new Array(1);",
            '  const env = process.env.NODE_ENV === "production" ? 1 : missing();',
            "  const lanes = ATLAS_LANES + 1;",
            "  const nil = null ?? 4;",
            "  const zero = 0 ?? missing();",
            f"  const opt = ({{ lane: {n % 8} }})?.lane;",
            "  if (false) { missing(); }",
            "  return added + text.length + flag + abs + listed[0] + key.length + cell + prop + tmpl.length + kind.length + (parsed.ok ? 1 : 0) + parsed.n + (safe ? 1 : 0) + pow + dead + kept + seq + width + mapped[0] + (roll >= 0 ? 0 : 1) + hole.length + env + lanes + nil + zero + opt + n;",
            "}",
            "",
        ]
    )


def js_target(index):
    if index % 29 == 0:
        return 20 * KB
    if index % 29 == 1:
        return 200 * KB
    return (24 + (index * 13) % 97) * KB


def write_config():
    config = {
        "entries": [f"src/entries/{name}.js" for name in ENTRIES],
        "output": "dist",
        "target": "browser",
        "format": "esm",
        "external": EXTERNALS,
        "define": {
            "process.env.NODE_ENV": '"production"',
            "ATLAS_LANES": str(len(ENTRIES)),
        },
        "jsx": {"pragma": "React.createElement", "fragment": "React.Fragment"},
    }
    (ROOT / "webbundler.config.json").write_text(
        json.dumps(config, indent=2) + "\n", encoding="utf-8"
    )
    package = {
        "name": "atlas",
        "private": True,
        "description": "Large webbundler fixture. Dependencies are external and are not installed.",
        "dependencies": {name: "*" for name in EXTERNALS},
    }
    (ROOT / "package.json").write_text(
        json.dumps(package, indent=2) + "\n", encoding="utf-8"
    )


def write_manifest(files):
    js = [item for item in files if item["kind"] == "javascript"]
    css = [item for item in files if item["kind"] == "css"]
    manifest = {
        "javascript": len(js),
        "css": len(css),
        "svg": SVG_ICONS,
        "png": PNG_ICONS,
        "externals": len(EXTERNALS),
        "entries": ENTRIES,
        "javascriptBytes": {"min": min(item["bytes"] for item in js), "max": max(item["bytes"] for item in js)},
        "cssBytes": {"min": min(item["bytes"] for item in css), "max": max(item["bytes"] for item in css)},
        "files": files,
    }
    (ROOT / "MANIFEST.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


def record(path, kind):
    return {"path": rel(path), "kind": kind, "bytes": path.stat().st_size}


def rel(path):
    return path.relative_to(ROOT).as_posix()


if __name__ == "__main__":
    main()
