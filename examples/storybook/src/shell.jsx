import React from "react";
import {
  ARG_TYPES,
  FAMILIES,
  STORIES,
  byId,
  compose,
  composedCount,
  counts,
  describe,
  familyComponents,
  searchComponents,
  storyArgs,
  storySource,
} from "./catalog.js";

const THEMES = ["canvas", "paper", "night"];
const PREF_COOKIE = "sb-prefs";

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (let i = 0; i < parts.length; i++) {
    const eq = parts[i].indexOf("=");
    if (eq <= 0) continue;
    if (decodeURIComponent(parts[i].slice(0, eq)) !== name) continue;
    return decodeURIComponent(parts[i].slice(eq + 1));
  }
  return "";
}

function writeCookie(name, value) {
  if (typeof document === "undefined") return;
  const year = 60 * 60 * 24 * 365;
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; Path=/; Max-Age=" + year + "; SameSite=Lax";
}

function readTheme() {
  const raw = readCookie(PREF_COOKIE);
  if (!raw) return "canvas";
  try {
    const prefs = JSON.parse(raw);
    if (prefs && THEMES.indexOf(prefs.theme) >= 0) return prefs.theme;
  } catch (error) {
    return "canvas";
  }
  return "canvas";
}

function saveTheme(theme) {
  writeCookie(PREF_COOKIE, JSON.stringify({ theme: theme }));
}

function readHash() {
  if (typeof location === "undefined") return null;
  const hash = location.hash.replace(/^#/, "");
  const slash = hash.indexOf("/");
  if (slash <= 0) return null;
  const id = decodeURIComponent(hash.slice(0, slash));
  const story = decodeURIComponent(hash.slice(slash + 1));
  const spec = byId.get(id);
  if (!spec || STORIES.indexOf(story) === -1) return null;
  return { spec: spec, story: story };
}

function initialSelection() {
  return readHash() || { spec: byId.get("data-grid"), story: "Resting" };
}

class Guard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error: error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return <p className="boom">{this.state.error.message}</p>;
    }
    return this.props.children;
  }
}

function Logo() {
  return (
    <svg className="sb-logo" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#FF4785" />
      <path fill="#FC521F" d="M7 22.5 16 8l3.2 5.2L12.2 24H7.6z" />
      <path fill="#FFAE00" d="M14.2 24 19.4 14.8 23 20.2 18.4 24z" />
      <path fill="#1EA7FD" d="M18.8 24h6.4L22.6 18.6 19.4 24z" />
    </svg>
  );
}

function Icon(props) {
  return (
    <svg className="sb-icon" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      {props.children}
    </svg>
  );
}

function sidebarRows(familyId, spec, story, query) {
  const q = String(query || "").trim();
  if (q) {
    return searchComponents(q).map(function (hit) {
      return { kind: "hit", spec: hit, current: hit.id === spec.id };
    });
  }
  const rows = [];
  for (let f = 0; f < FAMILIES.length; f++) {
    const family = FAMILIES[f];
    const open = family.id === familyId;
    rows.push({ kind: "group", family: family, open: open });
    if (!open) continue;
    const list = familyComponents(family.id);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const selected = item.id === spec.id;
      rows.push({ kind: "component", spec: item, open: selected });
      if (!selected) continue;
      for (let s = 0; s < STORIES.length; s++) {
        rows.push({
          kind: "story",
          spec: item,
          story: STORIES[s],
          current: STORIES[s] === story,
        });
      }
    }
  }
  return rows;
}

function rowKey(row) {
  if (row.kind === "group") return "g-" + row.family.id;
  if (row.kind === "component") return "c-" + row.spec.id;
  if (row.kind === "story") return "s-" + row.spec.id + "/" + row.story;
  return "h-" + row.spec.id;
}

function Explorer(props) {
  const scroller = React.useRef(null);
  const [scroll, setScroll] = React.useState(0);
  const [height, setHeight] = React.useState(320);
  const rowHeight = 28;
  React.useEffect(function () {
    const node = scroller.current;
    if (!node) return undefined;
    function measure() {
      setHeight(node.clientHeight || 320);
    }
    measure();
    window.addEventListener("resize", measure);
    return function () {
      window.removeEventListener("resize", measure);
    };
  }, []);
  const start = Math.max(0, Math.floor(scroll / rowHeight) - 4);
  const visible = Math.ceil(height / rowHeight) + 8;
  const slice = props.rows.slice(start, start + visible);
  return (
    <div
      className="sb-tree"
      ref={scroller}
      onScroll={function (event) { setScroll(event.currentTarget.scrollTop); }}
    >
      {props.rows.length === 0 ? <p className="sb-empty">No components found</p> : (
        <div className="sb-tree-spacer" style={{ height: props.rows.length * rowHeight }}>
          {slice.map(function (row, index) {
            const top = (start + index) * rowHeight;
            return (
              <button
                type="button"
                key={rowKey(row)}
                className={rowClass(row)}
                style={{ top: top, height: rowHeight }}
                aria-current={row.kind === "story" && row.current ? "true" : undefined}
                onClick={function () { props.onRow(row); }}
              >
                <RowLabel row={row} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function rowClass(row) {
  const current = !!row.current;
  return "sb-row depth-" + depthOf(row) + (current ? " is-current" : "") + (row.open ? " is-open" : "");
}

function depthOf(row) {
  if (row.kind === "group" || row.kind === "hit") return 0;
  if (row.kind === "component") return 1;
  return 2;
}

function RowLabel(props) {
  const row = props.row;
  if (row.kind === "group") {
    return (
      <>
        <Caret open={row.open} />
        <span>{row.family.title}</span>
      </>
    );
  }
  if (row.kind === "component") {
    return (
      <>
        <Caret open={row.open} />
        <span className="sb-component">{row.spec.label}</span>
      </>
    );
  }
  if (row.kind === "story") {
    return (
      <>
        <i className="sb-dot" />
        <span>{row.story}</span>
      </>
    );
  }
  return <span>{row.spec.title}</span>;
}

function Caret(props) {
  return <span className={props.open ? "sb-caret is-open" : "sb-caret"} aria-hidden="true" />;
}

function Controls(props) {
  const keys = Object.keys(ARG_TYPES);
  return (
    <div className="sb-controls">
      <div className="sb-control sb-control-head">
        <span>Name</span>
        <span>Control</span>
      </div>
      {keys.map(function (key) {
        const type = ARG_TYPES[key];
        const value = props.args[key];
        let input = null;
        if (type.control === "boolean") {
          input = (
            <input
              type="checkbox"
              checked={!!value}
              aria-label={key}
              onChange={function (event) { props.onChange(key, event.target.checked); }}
            />
          );
        } else if (type.control === "select") {
          input = (
            <select
              value={value}
              aria-label={key}
              onChange={function (event) { props.onChange(key, event.target.value); }}
            >
              {type.options.map(function (option) {
                return <option key={option} value={option}>{option}</option>;
              })}
            </select>
          );
        } else if (type.control === "number") {
          input = (
            <input
              type="number"
              min={type.min}
              max={type.max}
              value={value}
              aria-label={key}
              onChange={function (event) { props.onChange(key, Number(event.target.value)); }}
            />
          );
        } else {
          input = (
            <input
              type="text"
              value={value}
              aria-label={key}
              onChange={function (event) { props.onChange(key, event.target.value); }}
            />
          );
        }
        return (
          <label className="sb-control" key={key}>
            <span className="sb-arg">{key}</span>
            {input}
          </label>
        );
      })}
    </div>
  );
}

function Crumb(props) {
  const parts = String(props.spec.title || "").split("/");
  return (
    <nav className="sb-crumb" aria-label="Story path">
      {parts.map(function (part, index) {
        return (
          <span key={part + index}>
            {index > 0 ? <span className="sb-sep">/</span> : null}
            <span className={index === parts.length - 1 ? "is-leaf" : ""}>{part}</span>
          </span>
        );
      })}
      <span className="sb-sep">/</span>
      <strong>{props.story}</strong>
    </nav>
  );
}

const PANELS = [
  { id: "controls", label: "Controls" },
  { id: "actions", label: "Actions" },
  { id: "docs", label: "Docs" },
];

export function App() {
  const first = initialSelection();
  const [selection, setSelection] = React.useState(first);
  const [args, setArgs] = React.useState(function () {
    return storyArgs(first.spec, first.story);
  });
  const [familyId, setFamilyId] = React.useState(first.spec.familyId);
  const [query, setQuery] = React.useState("");
  const [panel, setPanel] = React.useState("controls");
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [background, setBackground] = React.useState(readTheme);
  const [zoom, setZoom] = React.useState(1);
  const [viewport, setViewport] = React.useState("full");
  const [outline, setOutline] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const rootRef = React.useRef(null);
  const browserFullscreen = React.useRef(false);
  const [actions, setActions] = React.useState([]);
  const seq = React.useRef(0);
  const spec = selection.spec;
  const story = selection.story;
  const rows = sidebarRows(familyId, spec, story, query);
  const Composed = compose(spec, story);
  const resetKey = spec.id + "/" + story;

  React.useEffect(function () {
    if (typeof document === "undefined") return;
    document.title = spec.label + " - " + story + " ⋅ Storybook";
  }, [spec, story]);

  React.useEffect(function () {
    if (typeof document === "undefined") return undefined;
    function onFullscreenChange() {
      const node = rootRef.current;
      const active = !!node && document.fullscreenElement === node;
      if (active) browserFullscreen.current = true;
      if (!active && browserFullscreen.current) {
        browserFullscreen.current = false;
        setFullscreen(false);
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return function () {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  function chooseTheme(next) {
    setBackground(next);
    saveTheme(next);
  }

  function toggleFullscreen() {
    const node = rootRef.current;
    const next = !fullscreen;
    setFullscreen(next);
    if (!node || typeof document === "undefined") return;
    if (next) {
      if (node.requestFullscreen) node.requestFullscreen().catch(function () {});
      return;
    }
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  }

  function openStory(nextSpec, nextStory) {
    setSelection({ spec: nextSpec, story: nextStory });
    setArgs(storyArgs(nextSpec, nextStory));
    setFamilyId(nextSpec.familyId);
    if (typeof history !== "undefined") {
      history.replaceState(null, "", "#" + nextSpec.id + "/" + nextStory);
    }
  }

  function onRow(row) {
    if (row.kind === "group") {
      setQuery("");
      if (row.family.id === familyId) return;
      setFamilyId(row.family.id);
      const list = familyComponents(row.family.id);
      if (list[0]) openStory(list[0], "Resting");
      return;
    }
    if (row.kind === "component" || row.kind === "hit") {
      openStory(row.spec, "Resting");
      return;
    }
    openStory(row.spec, row.story);
  }

  function onAction(event) {
    seq.current += 1;
    const entry = Object.assign({ n: seq.current }, event);
    setActions(function (prev) {
      const next = prev.concat([entry]);
      return next.length > 12 ? next.slice(next.length - 12) : next;
    });
  }

  const canvasStyle = fullscreen
    ? { width: "100%", height: "100%" }
    : { transform: "scale(" + zoom + ")", transformOrigin: "top left" };
  const frameStyle = fullscreen || viewport === "full" ? null : { width: viewport + "px", margin: "0 auto" };
  const zoomLabel = Math.round(zoom * 100) + "%";

  return (
    <div className={fullscreen ? "sb is-fullscreen" : "sb"} ref={rootRef}>
      <aside className="sb-sidebar">
        <div className="sb-brand">
          <Logo />
          <div>
            <strong>Atelier</strong>
            <p>Storybook 10.6 · React 19</p>
          </div>
        </div>
        <label className="sb-search">
          <Icon><circle cx="6" cy="6" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M9 9.2 12 12" stroke="currentColor" strokeWidth="1.4" /></Icon>
          <input
            type="search"
            value={query}
            placeholder="Find components"
            aria-label="Find components"
            onChange={function (event) { setQuery(event.target.value); }}
          />
        </label>
        <Explorer
          key={query.trim() ? "search-" + query : familyId}
          rows={rows}
          onRow={onRow}
        />
        <p className="sb-meta">
          {counts.components + " components · " + counts.stories + " stories · " + composedCount() + " composed"}
          {" · "}
          <a href="../../index.html">Examples</a>
        </p>
      </aside>
      <div className="sb-main">
        <header className="sb-toolbar">
          <Crumb spec={spec} story={story} />
          <div className="sb-tools">
            <button type="button" className={background === "canvas" ? "is-active" : ""} aria-label="Canvas background" title="Canvas" onClick={function () { chooseTheme("canvas"); }}>
              <Icon><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" fill="none" stroke="currentColor" /></Icon>
            </button>
            <button type="button" className={background === "paper" ? "is-active" : ""} aria-label="Paper background" title="Paper" onClick={function () { chooseTheme("paper"); }}>
              <Icon><rect x="2" y="1.5" width="10" height="11" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" /></Icon>
            </button>
            <button type="button" className={background === "night" ? "is-active" : ""} aria-label="Night background" title="Night" onClick={function () { chooseTheme("night"); }}>
              <Icon><path d="M8.2 1.6A5 5 0 1 0 12.4 8 4 4 0 0 1 8.2 1.6z" fill="currentColor" /></Icon>
            </button>
            <span className="sb-tool-gap" />
            {[["full", "Full"], ["480", "480"], ["320", "320"]].map(function (pair) {
              return (
                <button
                  type="button"
                  key={pair[0]}
                  className={viewport === pair[0] ? "is-active" : ""}
                  aria-label={"Viewport " + pair[1]}
                  onClick={function () { setViewport(pair[0]); }}
                >
                  {pair[1]}
                </button>
              );
            })}
            <span className="sb-tool-gap" />
            <button type="button" aria-label="Zoom out" onClick={function () { setZoom(zoom > 0.75 ? zoom - 0.25 : 0.75); }}>−</button>
            <span className="sb-zoom">{zoomLabel}</span>
            <button type="button" aria-label="Zoom in" onClick={function () { setZoom(zoom < 1.25 ? zoom + 0.25 : 1.25); }}>+</button>
            <button type="button" className={outline ? "is-active" : ""} aria-label="Outline" title="Outline" onClick={function () { setOutline(!outline); }}>
              <Icon><rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeDasharray="2 1.5" /></Icon>
            </button>
            <span className="sb-tool-gap" />
            <button
              type="button"
              className={fullscreen ? "is-active sb-fullscreen" : "sb-fullscreen"}
              aria-pressed={fullscreen}
              aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              title={fullscreen ? "Exit full screen" : "Full screen"}
              onClick={toggleFullscreen}
            >
              {fullscreen ? "Exit full screen" : "Full screen"}
            </button>
          </div>
        </header>
        <div className={outline ? "stage show-outline bg-" + background : "stage bg-" + background}>
          <div className="frame" style={frameStyle}>
            <div className="sb-canvas" style={canvasStyle}>
              <Guard resetKey={resetKey}>
                <Composed {...args} onAction={onAction} />
              </Guard>
            </div>
          </div>
        </div>
        <section className={panelOpen ? "sb-panel" : "sb-panel is-collapsed"} aria-label="Addons">
          <div className="sb-tabs" role="tablist">
            {PANELS.map(function (item) {
              return (
                <button
                  type="button"
                  key={item.id}
                  role="tab"
                  aria-selected={panel === item.id}
                  className={panel === item.id ? "is-active" : ""}
                  onClick={function () {
                    if (panel === item.id) setPanelOpen(!panelOpen);
                    else {
                      setPanel(item.id);
                      setPanelOpen(true);
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            <button type="button" className="sb-collapse" aria-label={panelOpen ? "Hide addons" : "Show addons"} onClick={function () { setPanelOpen(!panelOpen); }}>
              {panelOpen ? "▾" : "▴"}
            </button>
          </div>
          {panelOpen && panel === "controls" ? (
            <Controls
              args={args}
              onChange={function (key, value) {
                setArgs(function (prev) {
                  const next = Object.assign({}, prev);
                  next[key] = value;
                  return next;
                });
              }}
            />
          ) : null}
          {panelOpen && panel === "docs" ? (
            <div className="sb-docs">
              <p>{describe(spec)}</p>
              <pre>{storySource(spec, story)}</pre>
            </div>
          ) : null}
          {panelOpen && panel === "actions" ? (
            <ol className="sb-actions">
              {actions.length === 0 ? <li className="sb-empty">No actions yet.</li> : null}
              {actions.map(function (entry) {
                return (
                  <li key={entry.n}>
                    {"#" + entry.n + " " + entry.type + " " + entry.component + " " + (entry.row || entry.column || "")}
                  </li>
                );
              })}
            </ol>
          ) : null}
        </section>
      </div>
    </div>
  );
}
