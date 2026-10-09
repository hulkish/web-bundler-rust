import React from "react";
import { Blank, Frame, bind, choices, fire, records } from "../kit.jsx";

export function Menu(props) {
  const items = records(props);
  const [current, setCurrent] = React.useState(0);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-menu" role="menu">
          {items.map(function (item) {
            return (
              <li key={item.id}>
                <button type="button" role="menuitem" className={current === item.id ? "is-picked" : ""} onClick={function () {
                  setCurrent(item.id);
                  fire(props, "menu", { row: item.name });
                }}>
                  <span>{item.name}</span>
                  <small>{item.role}</small>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

export function MenuBar(props) {
  const items = records(props);
  const [open, setOpen] = React.useState("");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <div className="ui-appbar" role="menubar">
            {items.slice(0, 4).map(function (item) {
              return (
                <button key={item.id} type="button" className={open === item.name ? "ui-btn is-picked" : "ui-btn"} onClick={function () {
                  setOpen(open === item.name ? "" : item.name);
                  fire(props, "menu", { row: item.name });
                }}>{item.role}</button>
              );
            })}
          </div>
          {open ? (
            <ul className="ui-menu">
              {items.map(function (item) {
                return <li key={item.id}><button type="button" onClick={function () { fire(props, "select", { row: item.name, column: open }); }}>{item.name}</button></li>;
              })}
            </ul>
          ) : <p className="ui-note">Choose a menu.</p>}
        </div>
      )}
    </Frame>
  );
}

export function Dropdown(props) {
  const items = records(props);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <button type="button" className="ui-btn" aria-expanded={open} onClick={function () { setOpen(!open); }}>
            {value || "Choose a person"} ▾
          </button>
          {open ? (
            <ul className="ui-menu" role="listbox">
              {items.map(function (item) {
                return (
                  <li key={item.id}>
                    <button type="button" onClick={function () {
                      setValue(item.name);
                      setOpen(false);
                      fire(props, "select", { row: item.name });
                    }}>{item.name}</button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </Frame>
  );
}

export function ContextMenu(props) {
  const items = choices(props, ["Cut", "Copy", "Paste", "Rename", "Delete"]);
  const [pos, setPos] = React.useState(null);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div
          className="ui-panel-box"
          onContextMenu={function (event) {
            event.preventDefault();
            setPos({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
          }}
        >
          <p className="ui-note">Right-click this surface.</p>
          {pos ? (
            <ul className="ui-menu ui-overlay" style={{ position: "relative" }}>
              {items.map(function (item) {
                return (
                  <li key={item.id}>
                    <button type="button" onClick={function () {
                      fire(props, "menu", { row: item.label });
                      setPos(null);
                    }}>{item.label}</button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </Frame>
  );
}

export function Tabs(props) {
  const items = records(props);
  const [current, setCurrent] = React.useState(0);
  const tab = items[current] || items[0];
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <div className="ui-tabs" role="tablist">
            {items.map(function (item, index) {
              return (
                <button key={item.id} type="button" role="tab" aria-selected={index === current} onClick={function () {
                  setCurrent(index);
                  fire(props, "tab", { row: item.name });
                }}>{item.city}</button>
              );
            })}
          </div>
          <div className="ui-panel" role="tabpanel">
            <strong>{tab.name}</strong>
            <p className="ui-note">{tab.role} · {tab.status}</p>
          </div>
        </div>
      )}
    </Frame>
  );
}

export function Breadcrumbs(props) {
  const items = records(props);
  const [depth, setDepth] = React.useState(items.length);
  const trail = items.slice(0, depth || items.length);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <nav className="ui-crumbs" aria-label="Breadcrumb">
          {trail.map(function (item, index) {
            const last = index === trail.length - 1;
            return (
              <span key={item.id}>
                {index > 0 ? <span className="ui-k"> / </span> : null}
                <button type="button" aria-current={last ? "page" : undefined} onClick={function () {
                  setDepth(index + 1);
                  fire(props, "navigate", { row: item.name });
                }}>{item.city}</button>
              </span>
            );
          })}
        </nav>
      )}
    </Frame>
  );
}

export function Pagination(props) {
  const total = Math.max(1, props.rows | 0);
  const [page, setPage] = React.useState(1);
  const safe = Math.min(page, total);
  const windowStart = Math.max(1, safe - 2);
  const pages = [];
  for (let n = windowStart; n <= Math.min(total, windowStart + 4); n++) pages.push(n);
  return (
    <Frame {...props}>
      <div className="ui-pages">
        <button type="button" className="ui-btn" onClick={function () { setPage(safe > 1 ? safe - 1 : 1); }}>Prev</button>
        {pages.map(function (n) {
          return (
            <button key={n} type="button" className={n === safe ? "ui-btn is-primary" : "ui-btn"} onClick={function () {
              setPage(n);
              fire(props, "page", { row: String(n) });
            }}>{n}</button>
          );
        })}
        <button type="button" className="ui-btn" onClick={function () { setPage(safe < total ? safe + 1 : total); }}>Next</button>
        <span className="ui-note">{safe} / {total}</span>
      </div>
    </Frame>
  );
}

export function Stepper(props) {
  const steps = choices(props, ["Details", "Schedule", "Review", "Confirm", "Done"]);
  const [index, setIndex] = React.useState(0);
  const step = steps[Math.min(index, Math.max(0, steps.length - 1))];
  return (
    <Frame {...props}>
      {steps.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <ol className="ui-steps">
            {steps.map(function (item, i) {
              return (
                <li key={item.id}>
                  <i className={i <= index ? "ui-dot is-on" : "ui-dot"} />
                  <button type="button" onClick={function () { setIndex(i); fire(props, "step", { row: item.label }); }}>{item.label}</button>
                </li>
              );
            })}
          </ol>
          <p>{step.label} is the current step.</p>
          <div className="ui-row">
            <button type="button" className="ui-btn" disabled={index === 0} onClick={function () { setIndex(index - 1); }}>Back</button>
            <button type="button" className="ui-btn is-primary" disabled={index >= steps.length - 1} onClick={function () { setIndex(index + 1); }}>Next</button>
          </div>
        </div>
      )}
    </Frame>
  );
}

export function TreeView(props) {
  const data = records(props);
  const [open, setOpen] = React.useState("Lisbon");
  const cities = [];
  const seen = {};
  for (let i = 0; i < data.length; i++) {
    if (!seen[data[i].city]) {
      seen[data[i].city] = [];
      cities.push(data[i].city);
    }
    seen[data[i].city].push(data[i]);
  }
  return (
    <Frame {...props}>
      {cities.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-tree">
          {cities.map(function (city) {
            return (
              <li key={city}>
                <button type="button" className="ui-btn" onClick={function () {
                  setOpen(open === city ? "" : city);
                  fire(props, "toggle", { row: city });
                }}>{open === city ? "▾" : "▸"} {city}</button>
                {open === city ? (
                  <ul>
                    {seen[city].map(function (row) {
                      return <li key={row.id}>{row.name}</li>;
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

export function SideNav(props) {
  const items = records(props);
  const [current, setCurrent] = React.useState(0);
  const item = items[current] || items[0];
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-split">
          <nav className="ui-side">
            {items.map(function (row, index) {
              return (
                <button key={row.id} type="button" className={index === current ? "ui-item is-picked" : "ui-item"} onClick={function () {
                  setCurrent(index);
                  fire(props, "navigate", { row: row.name });
                }}>{row.role}</button>
              );
            })}
          </nav>
          <article className="ui-panel">
            <h3 className="ui-title">{item.name}</h3>
            <p className="ui-note">{item.city} · {item.status}</p>
          </article>
        </div>
      )}
    </Frame>
  );
}

bind("navigation", "Navigation", [
  [Menu, "menu", "Menu", "Vertical menu. The chosen item stays highlighted.", ["Name", "Role"], 6, "ink"],
  [MenuBar, "menu-bar", "Menu bar", "Horizontal menus. Opening one lists the people under that role.", ["File", "Edit", "View"], 6, "sea"],
  [Dropdown, "dropdown", "Dropdown", "A button that opens a list and keeps the chosen name.", ["Choose"], 6, "gold"],
  [ContextMenu, "context-menu", "Context menu", "Right-click the surface to open Cut, Copy, Paste, Rename, and Delete.", ["Cut", "Copy", "Paste", "Rename", "Delete"], 5, "clay"],
  [Tabs, "tabs", "Tabs", "One tab per city, with the person in the panel.", ["City", "Name"], 4, "ink"],
  [Breadcrumbs, "breadcrumbs", "Breadcrumbs", "A path of cities. Choosing one trims the trail.", ["City"], 4, "sea"],
  [Pagination, "pagination", "Pagination", "Page buttons. The row count is the page count.", ["Page"], 8, "gold"],
  [Stepper, "stepper", "Stepper", "Back and next through Details, Schedule, Review, Confirm, and Done.", ["Details", "Schedule", "Review", "Confirm", "Done"], 5, "clay"],
  [TreeView, "tree-view", "Tree view", "Cities expand to the people who belong there.", ["City", "Name"], 8, "ink"],
  [SideNav, "side-nav", "Side nav", "A role list beside the selected person.", ["Role", "Name"], 6, "sea"],
]);
