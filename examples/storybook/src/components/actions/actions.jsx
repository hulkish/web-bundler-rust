import React from "react";
import { Blank, Frame, bind, choices, fire } from "../kit.jsx";

export function Button(props) {
  return (
    <Frame {...props}>
      <div className="ui-row">
        <button type="button" className="ui-btn is-primary" onClick={function () { fire(props, "click", { row: "primary" }); }}>Save</button>
        <button type="button" className="ui-btn" onClick={function () { fire(props, "click", { row: "secondary" }); }}>Cancel</button>
        <button type="button" className="ui-btn is-danger" onClick={function () { fire(props, "click", { row: "danger" }); }}>Delete</button>
      </div>
    </Frame>
  );
}

export function IconButton(props) {
  const items = choices(props, ["Bold", "Italic", "Underline", "Link", "Code"]);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {items.map(function (item) {
            return (
              <button key={item.id} type="button" className="ui-btn" aria-label={item.label} title={item.label} onClick={function () {
                fire(props, "click", { row: item.label });
              }}>{item.label.slice(0, 1)}</button>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function ButtonGroup(props) {
  const items = choices(props, ["Left", "Center", "Right", "Justify"]);
  const [value, setValue] = React.useState(0);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row" role="group">
          {items.map(function (item, index) {
            return (
              <button key={item.id} type="button" className={value === index ? "ui-btn is-primary" : "ui-btn"} onClick={function () {
                setValue(index);
                fire(props, "select", { row: item.label });
              }}>{item.label}</button>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function SplitButton(props) {
  const items = choices(props, ["Save", "Save as", "Export", "Print"]);
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState(items[0] ? items[0].label : "Save");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <div className="ui-row">
            <button type="button" className="ui-btn is-primary" onClick={function () { fire(props, "click", { row: label }); }}>{label}</button>
            <button type="button" className="ui-btn is-primary" aria-label="More actions" onClick={function () { setOpen(!open); }}>▾</button>
          </div>
          {open ? (
            <ul className="ui-menu">
              {items.map(function (item) {
                return (
                  <li key={item.id}>
                    <button type="button" onClick={function () {
                      setLabel(item.label);
                      setOpen(false);
                      fire(props, "select", { row: item.label });
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

export function ToggleButton(props) {
  const items = choices(props, ["Bold", "Italic", "Strike"]);
  const [on, setOn] = React.useState({});
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {items.map(function (item) {
            const pressed = !!on[item.id];
            return (
              <button key={item.id} type="button" className="ui-btn" aria-pressed={pressed} onClick={function () {
                const next = Object.assign({}, on);
                next[item.id] = !pressed;
                setOn(next);
                fire(props, "toggle", { row: item.label });
              }}>{item.label}</button>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Fab(props) {
  return (
    <Frame {...props}>
      <button type="button" className="ui-fab" aria-label="Add" onClick={function () { fire(props, "click", { row: "add" }); }}>+</button>
    </Frame>
  );
}

export function LinkButton(props) {
  const items = choices(props, ["Docs", "Source", "Issues", "Releases"]);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {items.map(function (item) {
            return (
              <button key={item.id} type="button" className="ui-btn is-quiet" onClick={function () { fire(props, "click", { row: item.label }); }}>
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function SpeedDial(props) {
  const items = choices(props, ["Note", "Task", "Event", "File"]);
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          {open ? (
            <div className="ui-row">
              {items.map(function (item) {
                return <button key={item.id} type="button" className="ui-btn" onClick={function () { fire(props, "click", { row: item.label }); }}>{item.label}</button>;
              })}
            </div>
          ) : null}
          <button type="button" className="ui-fab" aria-expanded={open} onClick={function () { setOpen(!open); }}>{open ? "×" : "+"}</button>
        </div>
      )}
    </Frame>
  );
}

export function CopyButton(props) {
  const [copied, setCopied] = React.useState(false);
  const text = props.query || "atelier://" + (props.label || "copy");
  return (
    <Frame {...props}>
      <div className="ui-row">
        <code className="ui-kbd">{text}</code>
        <button type="button" className="ui-btn" onClick={function () {
          setCopied(true);
          fire(props, "copy", { row: text });
        }}>{copied ? "Copied" : "Copy"}</button>
      </div>
    </Frame>
  );
}

export function ButtonMenu(props) {
  const items = choices(props, ["Duplicate", "Archive", "Move", "Share"]);
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <button type="button" className="ui-btn" aria-expanded={open} onClick={function () { setOpen(!open); }}>Actions ▾</button>
          {open ? (
            <ul className="ui-menu ui-overlay">
              {items.map(function (item) {
                return (
                  <li key={item.id}>
                    <button type="button" onClick={function () {
                      setOpen(false);
                      fire(props, "menu", { row: item.label });
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

bind("actions", "Actions", [
  [Button, "button", "Button", "Primary, secondary, and danger buttons.", ["Save", "Cancel", "Delete"], 1, "ink"],
  [IconButton, "icon-button", "Icon button", "Compact buttons labeled by their first letter.", ["Bold", "Italic", "Underline", "Link", "Code"], 5, "sea"],
  [ButtonGroup, "button-group", "Button group", "Alignment choices. One stays selected.", ["Left", "Center", "Right", "Justify"], 4, "gold"],
  [SplitButton, "split-button", "Split button", "A main action plus a menu that replaces it.", ["Save", "Export", "Print"], 4, "clay"],
  [ToggleButton, "toggle-button", "Toggle button", "Bold, italic, and strike stay pressed independently.", ["Bold", "Italic", "Strike"], 3, "ink"],
  [Fab, "fab", "Fab", "A round add button.", ["Add"], 1, "sea"],
  [LinkButton, "link-button", "Link button", "Quiet text buttons for docs, source, issues, and releases.", ["Docs", "Source", "Issues", "Releases"], 4, "gold"],
  [SpeedDial, "speed-dial", "Speed dial", "A round button that reveals note, task, event, and file.", ["Note", "Task", "Event", "File"], 4, "clay"],
  [CopyButton, "copy-button", "Copy button", "Shows a token and reports a copy action.", ["Copy"], 1, "ink"],
  [ButtonMenu, "button-menu", "Button menu", "An actions button that opens duplicate, archive, move, and share.", ["Duplicate", "Archive", "Move", "Share"], 4, "sea"],
]);
