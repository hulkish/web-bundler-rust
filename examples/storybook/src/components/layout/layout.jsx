import React from "react";
import { Blank, Frame, bind, fire, records } from "../kit.jsx";

export function Card(props) {
  const rows = records(props);
  const person = rows[0];
  return (
    <Frame {...props}>
      {!person ? <Blank query={props.query} /> : (
        <article className="ui-card">
          <h3>{person.role}</h3>
          <strong>{person.name}</strong>
          <p className="ui-note">{person.city} · {person.status}</p>
          <button type="button" className="ui-btn" onClick={function () { fire(props, "click", { row: person.name }); }}>Open</button>
        </article>
      )}
    </Frame>
  );
}

export function Accordion(props) {
  const rows = records(props);
  const [open, setOpen] = React.useState(0);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-acc">
          {rows.map(function (row, index) {
            const shown = open === index;
            return (
              <div key={row.id}>
                <button type="button" className="ui-btn" aria-expanded={shown} onClick={function () {
                  setOpen(shown ? -1 : index);
                  fire(props, "toggle", { row: row.name });
                }}>{row.name}</button>
                {shown ? <p className="ui-note">{row.role} in {row.city}. Score {row.score}.</p> : null}
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Collapse(props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn" aria-expanded={open} onClick={function () { setOpen(!open); }}>
        {open ? "Hide notes" : "Show notes"}
      </button>
      {open ? <p className="ui-note">{props.query || "Cream stock, one color, octavo."}</p> : null}
    </Frame>
  );
}

export function Divider(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : rows.map(function (row, index) {
        return (
          <div key={row.id}>
            {index > 0 ? <hr /> : null}
            <p>{row.name}</p>
          </div>
        );
      })}
    </Frame>
  );
}

export function Toolbar(props) {
  const [bold, setBold] = React.useState(false);
  return (
    <Frame {...props}>
      <div className="ui-toolbar" role="toolbar" aria-label={props.label}>
        <div className="ui-row">
          <button type="button" className="ui-btn" aria-pressed={bold} onClick={function () { setBold(!bold); fire(props, "toggle", { row: "bold" }); }}>B</button>
          <button type="button" className="ui-btn" onClick={function () { fire(props, "click", { row: "italic" }); }}>I</button>
          <button type="button" className="ui-btn" onClick={function () { fire(props, "click", { row: "link" }); }}>Link</button>
        </div>
        <span className="ui-note">{props.density === "dense" ? "Dense" : "Regular"}</span>
      </div>
    </Frame>
  );
}

export function Panel(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      <section className="ui-panel-box">
        <h3 className="ui-title">{props.label}</h3>
        {rows.length === 0 ? <Blank query={props.query} /> : (
          <ul className="ui-list">
            {rows.map(function (row) { return <li key={row.id}>{row.name} · {row.score}</li>; })}
          </ul>
        )}
      </section>
    </Frame>
  );
}

export function SplitView(props) {
  const rows = records(props);
  const [current, setCurrent] = React.useState(0);
  const person = rows[Math.min(current, Math.max(0, rows.length - 1))];
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-split">
          <ul className="ui-menu ui-side">
            {rows.map(function (row, index) {
              return (
                <li key={row.id}>
                  <button type="button" className={index === current ? "is-picked" : ""} onClick={function () { setCurrent(index); }}>{row.city}</button>
                </li>
              );
            })}
          </ul>
          <article>
            <h3 className="ui-title">{person.name}</h3>
            <p className="ui-note">{person.role}</p>
          </article>
        </div>
      )}
    </Frame>
  );
}

export function Stack(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-stack">
          {rows.map(function (row) {
            return <div key={row.id} className="ui-card">{row.name}</div>;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Masonry(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-masonry" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          {rows.map(function (row) {
            return (
              <article key={row.id} className="ui-card" style={{ minHeight: 40 + (row.score % 5) * 16 }}>
                <h3>{row.city}</h3>
                <strong>{row.name}</strong>
              </article>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Carousel(props) {
  const rows = records(props);
  const [index, setIndex] = React.useState(0);
  const person = rows[index % Math.max(1, rows.length)];
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <article className="ui-card">
            <h3>{index + 1} / {rows.length}</h3>
            <strong>{person.name}</strong>
            <p className="ui-note">{person.role} · {person.city}</p>
          </article>
          <div className="ui-row">
            <button type="button" className="ui-btn" onClick={function () { setIndex(index > 0 ? index - 1 : rows.length - 1); }}>Prev</button>
            <button type="button" className="ui-btn" onClick={function () {
              const next = index < rows.length - 1 ? index + 1 : 0;
              setIndex(next);
              fire(props, "page", { row: rows[next].name });
            }}>Next</button>
          </div>
        </div>
      )}
    </Frame>
  );
}

bind("layout", "Layout", [
  [Card, "card", "Card", "A person card with an open action.", ["Name", "Role", "City"], 1, "ink"],
  [Accordion, "accordion", "Accordion", "One open section at a time.", ["Name"], 4, "sea"],
  [Collapse, "collapse", "Collapse", "Shows or hides a short note. Query replaces the note.", ["Notes"], 1, "gold"],
  [Divider, "divider", "Divider", "Names separated by rules.", ["Name"], 4, "clay"],
  [Toolbar, "toolbar", "Toolbar", "Bold, italic, and link actions, plus the density.", ["Bold", "Italic", "Link"], 1, "ink"],
  [Panel, "panel", "Panel", "A titled box of names and scores.", ["Name", "Score"], 5, "sea"],
  [SplitView, "split-view", "Split view", "Cities on the left, the person on the right.", ["City", "Name"], 5, "gold"],
  [Stack, "stack", "Stack", "A vertical stack of name cards.", ["Name"], 4, "clay"],
  [Masonry, "masonry", "Masonry", "Two columns of cards with uneven height.", ["Name", "City"], 6, "ink"],
  [Carousel, "carousel", "Carousel", "Previous and next through the matching people.", ["Name"], 4, "sea"],
]);
