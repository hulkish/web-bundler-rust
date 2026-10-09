import React from "react";
import { Blank, Frame, bind, choices, fire, records } from "../kit.jsx";

export function TextField(props) {
  const [value, setValue] = React.useState(props.query || "");
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Name</span>
        <input className="ui-input" value={value} placeholder="Ada North" onChange={function (event) {
          setValue(event.target.value);
          fire(props, "change", { row: event.target.value });
        }} />
      </label>
    </Frame>
  );
}

export function TextArea(props) {
  const [value, setValue] = React.useState(props.query || "");
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Notes</span>
        <textarea className="ui-area" value={value} placeholder="Press notes" rows={Math.max(3, Math.min(8, props.rows | 0))} onChange={function (event) {
          setValue(event.target.value);
          fire(props, "change", { row: "notes" });
        }} />
      </label>
    </Frame>
  );
}

export function NumberField(props) {
  const [value, setValue] = React.useState(props.rows | 0);
  return (
    <Frame {...props}>
      <div className="ui-row">
        <button type="button" className="ui-btn" onClick={function () { setValue(value - 1); fire(props, "step", { row: String(value - 1) }); }}>−</button>
        <input className="ui-input" type="number" value={value} onChange={function (event) { setValue(Number(event.target.value)); }} />
        <button type="button" className="ui-btn" onClick={function () { setValue(value + 1); fire(props, "step", { row: String(value + 1) }); }}>+</button>
      </div>
    </Frame>
  );
}

export function PasswordField(props) {
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Password</span>
        <div className="ui-row">
          <input className="ui-input" type={show ? "text" : "password"} value={value} onChange={function (event) {
            setValue(event.target.value);
            fire(props, "change", { column: "password" });
          }} />
          <button type="button" className="ui-btn" onClick={function () { setShow(!show); }}>{show ? "Hide" : "Show"}</button>
        </div>
      </label>
    </Frame>
  );
}

export function SearchField(props) {
  const [value, setValue] = React.useState(props.query || "");
  const hits = records(Object.assign({}, props, { query: value, rows: props.rows || 6 }));
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Search</span>
        <div className="ui-row">
          <input className="ui-input" type="search" value={value} placeholder="Name, role, or city" onChange={function (event) { setValue(event.target.value); }} />
          <button type="button" className="ui-btn" onClick={function () { setValue(""); }}>Clear</button>
        </div>
      </label>
      <ul className="ui-menu">
        {hits.slice(0, 5).map(function (hit) {
          return <li key={hit.id}><button type="button" onClick={function () { fire(props, "select", { row: hit.name }); }}>{hit.name} · {hit.city}</button></li>;
        })}
      </ul>
    </Frame>
  );
}

export function Select(props) {
  const items = records(props);
  const [value, setValue] = React.useState(items[0] ? items[0].name : "");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <label className="ui-field">
          <span>Person</span>
          <select className="ui-select" value={value} onChange={function (event) {
            setValue(event.target.value);
            fire(props, "select", { row: event.target.value });
          }}>
            {items.map(function (item) {
              return <option key={item.id} value={item.name}>{item.name}</option>;
            })}
          </select>
        </label>
      )}
    </Frame>
  );
}

export function Combobox(props) {
  const items = records(props);
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const q = value.toLowerCase();
  const hits = items.filter(function (item) { return !q || item.name.toLowerCase().indexOf(q) !== -1; });
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Person</span>
        <input className="ui-input" value={value} placeholder="Type a name" onFocus={function () { setOpen(true); }} onChange={function (event) {
          setValue(event.target.value);
          setOpen(true);
        }} />
      </label>
      {open ? (
        hits.length === 0 ? <Blank query={value} /> : (
          <ul className="ui-menu">
            {hits.map(function (item) {
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
        )
      ) : null}
    </Frame>
  );
}

export function DateField(props) {
  const [value, setValue] = React.useState("2026-10-04");
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Date</span>
        <input className="ui-input" type="date" value={value} onChange={function (event) {
          setValue(event.target.value);
          fire(props, "change", { row: event.target.value });
        }} />
      </label>
    </Frame>
  );
}

export function Slider(props) {
  const [value, setValue] = React.useState(Math.min(100, (props.rows | 0) * 8));
  return (
    <Frame {...props}>
      <label className="ui-field">
        <span>Amount · {value}</span>
        <input className="ui-slider" type="range" min="0" max="100" value={value} onChange={function (event) {
          setValue(Number(event.target.value));
          fire(props, "change", { row: event.target.value });
        }} />
      </label>
    </Frame>
  );
}

export function Switch(props) {
  const items = choices(props, ["Mail", "Push", "Digest", "Quiet hours"]);
  const [on, setOn] = React.useState({});
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {items.map(function (item) {
            const checked = !!on[item.id];
            return (
              <div key={item.id}>
                <span>{item.label}</span>
                <button type="button" className="ui-switch" role="switch" aria-checked={checked} onClick={function () {
                  const next = Object.assign({}, on);
                  next[item.id] = !checked;
                  setOn(next);
                  fire(props, "toggle", { row: item.label });
                }}><i /></button>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

bind("inputs", "Inputs", [
  [TextField, "text-field", "Text field", "Single-line name field. The query arg seeds the value.", ["Name"], 1, "ink"],
  [TextArea, "text-area", "Text area", "Notes field. The row count sets the visible lines.", ["Notes"], 4, "sea"],
  [NumberField, "number-field", "Number field", "Stepper around a number. Starts from the row count.", ["Amount"], 4, "gold"],
  [PasswordField, "password-field", "Password field", "Masked input with a show and hide toggle.", ["Password"], 1, "clay"],
  [SearchField, "search-field", "Search field", "Filters the directory and lists up to five hits.", ["Search", "Name", "City"], 6, "ink"],
  [Select, "select", "Select", "Native select of people.", ["Person"], 6, "sea"],
  [Combobox, "combobox", "Combobox", "Type to filter the list, then pick a name.", ["Person"], 8, "gold"],
  [DateField, "date-field", "Date field", "Date input defaulting to 4 October 2026.", ["Date"], 1, "clay"],
  [Slider, "slider", "Slider", "Range from 0 to 100. The row count sets the start.", ["Amount"], 6, "ink"],
  [Switch, "switch", "Switch", "On and off switches for mail, push, digest, and quiet hours.", ["Mail", "Push", "Digest"], 4, "sea"],
]);
