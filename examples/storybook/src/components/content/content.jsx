import React from "react";
import { Blank, Frame, bind, choices, fire, records } from "../kit.jsx";

const WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar(props) {
  const rows = records(props);
  const marks = {};
  for (let i = 0; i < rows.length; i++) marks[(rows[i].id % 28) + 1] = rows[i].name;
  const [day, setDay] = React.useState(4);
  const cells = [];
  for (let i = 0; i < 4; i++) cells.push(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  return (
    <Frame {...props}>
      <div className="ui-cal">
        {WEEK.map(function (name) { return <span key={name} className="dow">{name}</span>; })}
        {cells.map(function (cell, index) {
          if (!cell) return <span key={"e" + index} />;
          return (
            <button
              key={cell}
              type="button"
              className={marks[cell] ? "is-mark" : ""}
              aria-pressed={day === cell}
              onClick={function () {
                setDay(cell);
                fire(props, "select", { row: String(cell) });
              }}
            >{cell}</button>
          );
        })}
      </div>
      <p className="ui-note">{marks[day] ? marks[day] + " on " + day + " Oct" : "4 Oct 2026 is the resting day."}</p>
    </Frame>
  );
}

export function Blockquote(props) {
  const rows = records(props);
  const person = rows[0];
  return (
    <Frame {...props}>
      {!person ? <Blank query={props.query} /> : (
        <blockquote className="ui-quote">
          The {person.role.toLowerCase()} in {person.city} kept the {person.status.toLowerCase()} copy.
          <footer>{person.name}</footer>
        </blockquote>
      )}
    </Frame>
  );
}

export function CodeBlock(props) {
  const rows = records(props);
  const lines = rows.map(function (row) { return row.name + "  " + row.role + "  " + row.score; });
  return (
    <Frame {...props}>
      {lines.length === 0 ? <Blank query={props.query} /> : <pre className="ui-code">{lines.join("\n")}</pre>}
    </Frame>
  );
}

export function Keyboard(props) {
  const keys = choices(props, ["⌘", "K", "Shift", "Enter", "Esc", "Tab"]);
  return (
    <Frame {...props}>
      {keys.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {keys.map(function (key) { return <kbd key={key.id} className="ui-kbd">{key.label}</kbd>; })}
        </div>
      )}
    </Frame>
  );
}

export function MediaFrame(props) {
  const rows = records(props);
  const person = rows[0];
  return (
    <Frame {...props}>
      {!person ? <Blank query={props.query} /> : (
        <figure>
          <div className="ui-media" role="img" aria-label={person.city} />
          <figcaption className="ui-note">{person.name} · {person.city}</figcaption>
        </figure>
      )}
    </Frame>
  );
}

export function FileList(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-list">
          {rows.map(function (row) {
            return (
              <li key={row.id} className="ui-item">
                <span>{row.name.replace(" ", "-").toLowerCase()}.pdf</span>
                <small>{row.score} KB</small>
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

export function FilterBar(props) {
  const items = choices(props, ["Active", "Review", "Away", "Hold"]);
  const [on, setOn] = React.useState({});
  const rows = records(props).filter(function (row) {
    const any = Object.keys(on).some(function (key) { return on[key]; });
    if (!any) return true;
    return !!on[row.status];
  });
  return (
    <Frame {...props}>
      <div className="ui-row">
        {items.map(function (item) {
          return (
            <button key={item.id} type="button" className={on[item.label] ? "ui-btn is-primary" : "ui-btn"} onClick={function () {
              const next = Object.assign({}, on);
              next[item.label] = !on[item.label];
              setOn(next);
              fire(props, "filter", { row: item.label });
            }}>{item.label}</button>
          );
        })}
      </div>
      <p className="ui-note">{rows.length} shown</p>
    </Frame>
  );
}

export function ColumnPicker(props) {
  const items = choices(props, ["Name", "Role", "City", "Status", "Score"]);
  const [on, setOn] = React.useState({ Name: true, Role: true, City: true });
  return (
    <Frame {...props}>
      {items.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {items.map(function (item) {
            return (
              <label key={item.id} className="ui-row">
                <input type="checkbox" checked={!!on[item.label]} onChange={function (event) {
                  const next = Object.assign({}, on);
                  next[item.label] = event.target.checked;
                  setOn(next);
                  fire(props, "toggle", { column: item.label });
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

export function Schedule(props) {
  const rows = records(props);
  const hours = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <table className="ui-grid">
          <tbody>
            {rows.map(function (row, index) {
              return (
                <tr key={row.id}>
                  <td>{hours[index % hours.length]}</td>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Frame>
  );
}

export function Wizard(props) {
  const steps = choices(props, ["Who", "When", "Where", "Review"]);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({ Who: "Ada North", When: "4 Oct", Where: "Lisbon" });
  const step = steps[Math.min(index, Math.max(0, steps.length - 1))];
  return (
    <Frame {...props}>
      {steps.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <p className="ui-note">Step {index + 1} of {steps.length}</p>
          <label className="ui-field">
            <span>{step.label}</span>
            <input className="ui-input" value={answers[step.label] || ""} onChange={function (event) {
              const next = Object.assign({}, answers);
              next[step.label] = event.target.value;
              setAnswers(next);
            }} />
          </label>
          <div className="ui-row">
            <button type="button" className="ui-btn" disabled={index === 0} onClick={function () { setIndex(index - 1); }}>Back</button>
            {index < steps.length - 1 ? (
              <button type="button" className="ui-btn is-primary" onClick={function () { setIndex(index + 1); }}>Next</button>
            ) : (
              <button type="button" className="ui-btn is-primary" onClick={function () { fire(props, "confirm", { row: answers.Who || step.label }); }}>Finish</button>
            )}
          </div>
        </div>
      )}
    </Frame>
  );
}

bind("content", "Content", [
  [Calendar, "calendar", "Calendar", "October 2026. Marks land on days taken from the row ids.", ["Day"], 6, "ink"],
  [Blockquote, "blockquote", "Blockquote", "A sentence built from the first matching person.", ["Quote", "Name"], 1, "sea"],
  [CodeBlock, "code-block", "Code block", "A monospace listing of name, role, and score.", ["Name", "Role", "Score"], 6, "gold"],
  [Keyboard, "keyboard", "Keyboard", "Key caps for a shortcut.", ["Shortcut"], 4, "clay"],
  [MediaFrame, "media-frame", "Media frame", "A captioned frame for the first match.", ["Name", "City"], 1, "ink"],
  [FileList, "file-list", "File list", "PDF names derived from the directory.", ["File"], 5, "sea"],
  [FilterBar, "filter-bar", "Filter bar", "Status filters and a count of rows still shown.", ["Active", "Review", "Away", "Hold"], 8, "gold"],
  [ColumnPicker, "column-picker", "Column picker", "Checks for name, role, city, status, and score.", ["Name", "Role", "City", "Status", "Score"], 5, "clay"],
  [Schedule, "schedule", "Schedule", "A day plan with a time beside each person.", ["Time", "Name", "Role"], 6, "ink"],
  [Wizard, "wizard", "Wizard", "Who, when, where, then review. Finish reports the name.", ["Who", "When", "Where", "Review"], 4, "sea"],
]);
