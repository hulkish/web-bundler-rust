import React from "react";
import { Blank, Frame, bind, fire, records } from "../kit.jsx";

export function Dialog(props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn is-primary" onClick={function () { setOpen(true); }}>Open dialog</button>
      {open ? (
        <div className="ui-backdrop">
          <div className="ui-overlay" role="dialog" aria-modal="true" aria-label={props.label}>
            <strong>Save this view?</strong>
            <p className="ui-note">The current columns and sort stay with this story.</p>
            <div className="ui-row">
              <button type="button" className="ui-btn" onClick={function () { setOpen(false); }}>Cancel</button>
              <button type="button" className="ui-btn is-primary" onClick={function () {
                setOpen(false);
                fire(props, "confirm", { row: "save" });
              }}>Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </Frame>
  );
}

export function Drawer(props) {
  const rows = records(props);
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn" onClick={function () { setOpen(true); }}>Open drawer</button>
      {open ? (
        <aside className="ui-overlay ui-drawer">
          <div className="ui-row">
            <strong>Directory</strong>
            <button type="button" className="ui-btn" onClick={function () { setOpen(false); }}>Close</button>
          </div>
          {rows.length === 0 ? <Blank query={props.query} /> : (
            <ul className="ui-menu">
              {rows.map(function (row) {
                return <li key={row.id}><button type="button" onClick={function () { fire(props, "select", { row: row.name }); }}>{row.name}</button></li>;
              })}
            </ul>
          )}
        </aside>
      ) : null}
    </Frame>
  );
}

export function Popover(props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn" aria-expanded={open} onClick={function () { setOpen(!open); }}>Details</button>
      {open ? (
        <div className="ui-overlay" role="dialog">
          <strong>Press mark</strong>
          <p className="ui-note">Octavo, cream stock, one color.</p>
          <button type="button" className="ui-btn" onClick={function () { setOpen(false); fire(props, "close", { row: "details" }); }}>Dismiss</button>
        </div>
      ) : null}
    </Frame>
  );
}

export function Tooltip(props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button
        type="button"
        className="ui-btn"
        onMouseEnter={function () { setOpen(true); }}
        onMouseLeave={function () { setOpen(false); }}
        onFocus={function () { setOpen(true); }}
        onBlur={function () { setOpen(false); }}
      >
        Hover
      </button>
      {open ? <div className="ui-overlay" role="tooltip">Shows the story label: {props.label}</div> : null}
    </Frame>
  );
}

export function Toast(props) {
  const [items, setItems] = React.useState([]);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn is-primary" onClick={function () {
        const next = items.concat([{ id: items.length + 1, text: "Saved view " + (items.length + 1) }]);
        setItems(next.slice(-1 * Math.max(1, props.rows | 0)));
        fire(props, "toast", { row: String(next.length) });
      }}>Add toast</button>
      <div className="ui-toast">
        {items.map(function (item) {
          return (
            <div key={item.id} className="ui-banner">
              <span>{item.text}</span>
              <button type="button" className="ui-btn" onClick={function () {
                setItems(items.filter(function (entry) { return entry.id !== item.id; }));
              }}>Dismiss</button>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

export function Banner(props) {
  const [open, setOpen] = React.useState(true);
  return (
    <Frame {...props}>
      {open ? (
        <div className="ui-banner" role="status">
          <span>{props.alert ? "A check failed on this story." : "The edition is ready to print."}</span>
          <button type="button" className="ui-btn" onClick={function () { setOpen(false); fire(props, "dismiss", { row: "banner" }); }}>Dismiss</button>
        </div>
      ) : <button type="button" className="ui-btn" onClick={function () { setOpen(true); }}>Show banner</button>}
    </Frame>
  );
}

export function Confirm(props) {
  const [open, setOpen] = React.useState(true);
  const [done, setDone] = React.useState("");
  return (
    <Frame {...props}>
      {open ? (
        <div className="ui-overlay">
          <strong>Delete this row?</strong>
          <p className="ui-note">This only updates the story. Nothing is stored.</p>
          <div className="ui-row">
            <button type="button" className="ui-btn" onClick={function () { setOpen(false); setDone("Kept"); }}>Keep</button>
            <button type="button" className="ui-btn is-danger" onClick={function () {
              setOpen(false);
              setDone("Deleted");
              fire(props, "confirm", { row: "delete" });
            }}>Delete</button>
          </div>
        </div>
      ) : <p className="ui-note">{done}</p>}
    </Frame>
  );
}

export function BottomSheet(props) {
  const rows = records(props);
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn" onClick={function () { setOpen(true); }}>Open sheet</button>
      {open ? (
        <div className="ui-overlay ui-sheet">
          <div className="ui-row">
            <strong>Assign</strong>
            <button type="button" className="ui-btn" onClick={function () { setOpen(false); }}>Close</button>
          </div>
          {rows.length === 0 ? <Blank query={props.query} /> : rows.map(function (row) {
            return <button key={row.id} type="button" className="ui-item" onClick={function () { fire(props, "select", { row: row.name }); }}>{row.name}</button>;
          })}
        </div>
      ) : null}
    </Frame>
  );
}

export function HoverCard(props) {
  const rows = records(props);
  const person = rows[0];
  const [open, setOpen] = React.useState(false);
  return (
    <Frame {...props}>
      {!person ? <Blank query={props.query} /> : (
        <div onMouseEnter={function () { setOpen(true); }} onMouseLeave={function () { setOpen(false); }}>
          <button type="button" className="ui-btn">{person.name}</button>
          {open ? (
            <article className="ui-overlay">
              <strong>{person.name}</strong>
              <p className="ui-note">{person.role} in {person.city}</p>
              <span className="ui-status">{person.status}</span>
            </article>
          ) : null}
        </div>
      )}
    </Frame>
  );
}

export function Spotlight(props) {
  const rows = records(props);
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const hits = rows.filter(function (row) {
    return !q || (row.name + " " + row.role).toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  return (
    <Frame {...props}>
      <button type="button" className="ui-btn" onClick={function () { setOpen(true); }}>Search ⌘K</button>
      {open ? (
        <div className="ui-backdrop">
          <div className="ui-overlay" role="dialog" aria-label="Spotlight">
            <input className="ui-input" autoFocus value={q} placeholder="People and roles" onChange={function (event) { setQ(event.target.value); }} />
            {hits.length === 0 ? <Blank query={q} /> : (
              <ul className="ui-menu">
                {hits.map(function (row) {
                  return (
                    <li key={row.id}>
                      <button type="button" onClick={function () {
                        setOpen(false);
                        fire(props, "select", { row: row.name });
                      }}>{row.name}<small>{row.role}</small></button>
                    </li>
                  );
                })}
              </ul>
            )}
            <button type="button" className="ui-btn" onClick={function () { setOpen(false); }}>Close</button>
          </div>
        </div>
      ) : null}
    </Frame>
  );
}

bind("overlays", "Overlays", [
  [Dialog, "dialog", "Dialog", "Modal with cancel and save.", ["Save", "Cancel"], 1, "ink"],
  [Drawer, "drawer", "Drawer", "Side panel listing people.", ["Name"], 6, "sea"],
  [Popover, "popover", "Popover", "Anchored details panel.", ["Details"], 1, "gold"],
  [Tooltip, "tooltip", "Tooltip", "Hint that appears on hover and focus.", ["Hint"], 1, "clay"],
  [Toast, "toast", "Toast", "Stacks dismissible notices. The row count caps the stack.", ["Notice"], 3, "ink"],
  [Banner, "banner", "Banner", "A page banner that can be dismissed.", ["Banner"], 1, "sea"],
  [Confirm, "confirm", "Confirm", "Keep or delete. Delete reports an action.", ["Delete"], 1, "gold"],
  [BottomSheet, "bottom-sheet", "Bottom sheet", "A sheet of people to assign.", ["Name"], 5, "clay"],
  [HoverCard, "hover-card", "Hover card", "Hover a name to see role, city, and status.", ["Name", "Role", "City"], 1, "ink"],
  [Spotlight, "spotlight", "Spotlight", "Command search over the directory.", ["Search", "Name", "Role"], 8, "sea"],
]);
