import React from "react";
import { Blank, Frame, bind, choices, fire } from "../kit.jsx";

export function Checkbox(props) {
  const [on, setOn] = React.useState(false);
  return (
    <Frame {...props}>
      <label className="ui-row">
        <input type="checkbox" checked={on} onChange={function (event) {
          setOn(event.target.checked);
          fire(props, "toggle", { row: props.label });
        }} />
        Keep the current layout
      </label>
    </Frame>
  );
}

export function CheckboxGroup(props) {
  const items = choices(props, ["Ink", "Paper", "Binding", "Ship", "Archive"]);
  const [on, setOn] = React.useState({});
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {items.map(function (item) {
            return (
              <label key={item.id} className="ui-row">
                <input type="checkbox" checked={!!on[item.id]} onChange={function (event) {
                  const next = Object.assign({}, on);
                  next[item.id] = event.target.checked;
                  setOn(next);
                  fire(props, "toggle", { row: item.label });
                }} />
                {item.label}
              </label>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function RadioGroup(props) {
  const items = choices(props, ["Octavo", "Quarto", "Folio", "Broadside"]);
  const [value, setValue] = React.useState(items[0] ? items[0].label : "");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist" role="radiogroup">
          {items.map(function (item) {
            return (
              <label key={item.id} className="ui-row">
                <input type="radio" name="size" checked={value === item.label} onChange={function () {
                  setValue(item.label);
                  fire(props, "select", { row: item.label });
                }} />
                {item.label}
              </label>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function SegmentedControl(props) {
  const items = choices(props, ["Day", "Week", "Month", "Year"]);
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

export function PinField(props) {
  const count = Math.min(6, Math.max(1, props.rows | 0));
  const [digits, setDigits] = React.useState(["", "", "", "", "", ""]);
  return (
    <Frame {...props}>
      <div className="ui-pins">
        {digits.slice(0, count).map(function (digit, index) {
          return (
            <input key={index} className="ui-input" inputMode="numeric" maxLength="1" value={digit} aria-label={"Digit " + (index + 1)} onChange={function (event) {
              const next = digits.slice();
              next[index] = event.target.value.replace(/\D/g, "").slice(0, 1);
              setDigits(next);
              fire(props, "change", { column: String(index + 1) });
            }} />
          );
        })}
      </div>
    </Frame>
  );
}

export function TagInput(props) {
  const seed = choices(props, ["folio", "rush", "ink", "linen"]);
  const [tags, setTags] = React.useState(seed.map(function (item) { return item.label; }));
  const [draft, setDraft] = React.useState("");
  return (
    <Frame {...props}>
      <div className="ui-row">
        {tags.map(function (tag) {
          return (
            <button key={tag} type="button" className="ui-tag" onClick={function () {
              setTags(tags.filter(function (item) { return item !== tag; }));
              fire(props, "remove", { row: tag });
            }}>{tag} ×</button>
          );
        })}
      </div>
      <div className="ui-row">
        <input className="ui-input" value={draft} placeholder="Add a tag" onChange={function (event) { setDraft(event.target.value); }} />
        <button type="button" className="ui-btn is-primary" onClick={function () {
          const next = draft.trim();
          if (!next || tags.indexOf(next) !== -1) return;
          setTags(tags.concat([next]));
          setDraft("");
          fire(props, "add", { row: next });
        }}>Add</button>
      </div>
    </Frame>
  );
}

export function FileDrop(props) {
  const [files, setFiles] = React.useState([]);
  return (
    <Frame {...props}>
      <label className="ui-panel-box">
        <span>Drop files or browse</span>
        <input type="file" multiple onChange={function (event) {
          const list = [];
          const chosen = event.target.files;
          const cap = props.rows | 0;
          for (let i = 0; i < chosen.length && list.length < cap; i++) list.push(chosen[i].name);
          setFiles(list);
          fire(props, "upload", { row: String(list.length) });
        }} />
      </label>
      <ul className="ui-list">
        {files.map(function (name) { return <li key={name}>{name}</li>; })}
      </ul>
    </Frame>
  );
}

export function ColorSwatches(props) {
  const colors = ["#1b1c23", "#1ea7fd", "#ff4785", "#e69d00", "#fc521f", "#2eaa6e", "#7b61ff", "#f6f9fc"];
  const items = colors.slice(0, Math.max(0, props.rows | 0));
  const [value, setValue] = React.useState(items[0] || "");
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {items.map(function (color) {
            return (
              <button key={color} type="button" aria-label={color} className={value === color ? "is-picked" : ""} style={{ width: 28, height: 28, borderRadius: 6, background: color, border: "1px solid #d0d7de" }} onClick={function () {
                setValue(color);
                fire(props, "select", { row: color });
              }} />
            );
          })}
          <span className="ui-note">{value}</span>
        </div>
      )}
    </Frame>
  );
}

export function Rating(props) {
  const max = Math.min(5, Math.max(1, props.rows | 0));
  const [value, setValue] = React.useState(Math.min(3, max));
  const stars = [];
  for (let i = 1; i <= max; i++) stars.push(i);
  return (
    <Frame {...props}>
      <div className="ui-stars" role="radiogroup" aria-label="Rating">
        {stars.map(function (star) {
          return (
            <button key={star} type="button" className={star <= value ? "is-on" : ""} aria-label={star + " stars"} onClick={function () {
              setValue(star);
              fire(props, "rate", { row: String(star) });
            }}>★</button>
          );
        })}
      </div>
    </Frame>
  );
}

export function TransferList(props) {
  const seed = choices(props, ["Ada North", "Mina Cho", "Leo Ibarra", "Hana Ito", "Pia Rossi", "Seth Quinn"]);
  const [left, setLeft] = React.useState(seed.map(function (item) { return item.label; }));
  const [right, setRight] = React.useState([]);
  const [picked, setPicked] = React.useState("");
  function move(from, to, setFrom, setTo) {
    if (!picked || from.indexOf(picked) === -1) return;
    setFrom(from.filter(function (item) { return item !== picked; }));
    setTo(to.concat([picked]));
    fire(props, "move", { row: picked });
  }
  return (
    <Frame {...props}>
      {seed.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-transfer">
          <ul className="ui-menu ui-side">
            {left.map(function (name) {
              return <li key={name}><button type="button" className={picked === name ? "is-picked" : ""} onClick={function () { setPicked(name); }}>{name}</button></li>;
            })}
          </ul>
          <div className="ui-row">
            <button type="button" className="ui-btn" onClick={function () { move(left, right, setLeft, setRight); }}>→</button>
            <button type="button" className="ui-btn" onClick={function () { move(right, left, setRight, setLeft); }}>←</button>
          </div>
          <ul className="ui-menu ui-side">
            {right.map(function (name) {
              return <li key={name}><button type="button" className={picked === name ? "is-picked" : ""} onClick={function () { setPicked(name); }}>{name}</button></li>;
            })}
          </ul>
        </div>
      )}
    </Frame>
  );
}

bind("choices", "Choices", [
  [Checkbox, "checkbox", "Checkbox", "A single checkbox for keeping the current layout.", ["Layout"], 1, "ink"],
  [CheckboxGroup, "checkbox-group", "Checkbox group", "Independent checks for ink, paper, binding, ship, and archive.", ["Ink", "Paper", "Binding", "Ship", "Archive"], 5, "sea"],
  [RadioGroup, "radio-group", "Radio group", "One sheet size: octavo, quarto, folio, or broadside.", ["Octavo", "Quarto", "Folio", "Broadside"], 4, "gold"],
  [SegmentedControl, "segmented-control", "Segmented control", "Day, week, month, or year.", ["Day", "Week", "Month", "Year"], 4, "clay"],
  [PinField, "pin-field", "Pin field", "One box per digit. The row count sets the length, up to six.", ["Digit"], 4, "ink"],
  [TagInput, "tag-input", "Tag input", "Chips you can remove, plus a field to add one.", ["Tag"], 4, "sea"],
  [FileDrop, "file-drop", "File drop", "Browse for files. The row count caps how many names are kept.", ["File"], 3, "gold"],
  [ColorSwatches, "color-swatches", "Color swatches", "A palette. The chosen swatch shows its hex.", ["Color"], 6, "clay"],
  [Rating, "rating", "Rating", "Star rating. The row count sets how many stars, up to five.", ["Stars"], 5, "ink"],
  [TransferList, "transfer-list", "Transfer list", "Move names between two lists.", ["Available", "Chosen"], 6, "sea"],
]);
