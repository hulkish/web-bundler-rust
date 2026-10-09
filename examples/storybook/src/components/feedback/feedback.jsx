import React from "react";
import { Blank, Frame, bind, fire, records } from "../kit.jsx";

export function Progress(props) {
  const value = Math.min(100, Math.max(0, (props.rows | 0) * 8));
  return (
    <Frame {...props}>
      <div className="ui-meter" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" role="progressbar">
        <i style={{ width: value + "%" }} />
      </div>
      <p className="ui-note">{value}%</p>
    </Frame>
  );
}

export function Spinner(props) {
  return (
    <Frame {...props}>
      <div className="ui-row">
        <i className="ui-spin" aria-hidden="true" />
        <span>Loading {props.label}</span>
      </div>
    </Frame>
  );
}

export function Skeleton(props) {
  const lines = Math.max(1, Math.min(8, props.rows | 0));
  const bars = [];
  for (let i = 0; i < lines; i++) bars.push(i);
  return (
    <Frame {...props}>
      <div className="ui-skel" aria-hidden="true">
        {bars.map(function (bar) {
          return <i key={bar} style={{ width: (100 - bar * 8) + "%" }} />;
        })}
      </div>
    </Frame>
  );
}

export function EmptyState(props) {
  return (
    <Frame {...props}>
      <div className="ui-card">
        <h3>No rows yet</h3>
        <p className="ui-note">Add a person to fill this view.</p>
        <button type="button" className="ui-btn is-primary" onClick={function () { fire(props, "click", { row: "add" }); }}>Add person</button>
      </div>
    </Frame>
  );
}

export function Badge(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      <div className="ui-row">
        <span>Inbox</span>
        <span className="ui-badge">{rows.length}</span>
        {props.alert ? <span className="ui-badge">!</span> : null}
      </div>
    </Frame>
  );
}

export function Tag(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          {rows.map(function (row) {
            return <span key={row.id} className="ui-tag">{row.status}</span>;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Avatar(props) {
  const rows = records(props);
  const person = rows[0];
  return (
    <Frame {...props}>
      {!person ? <Blank query={props.query} /> : (
        <div className="ui-row">
          <span className="ui-avatar">{person.name.slice(0, 1)}</span>
          <span><strong>{person.name}</strong><small className="ui-note"> {person.role}</small></span>
        </div>
      )}
    </Frame>
  );
}

export function AvatarGroup(props) {
  const rows = records(props);
  const shown = rows.slice(0, 5);
  const extra = rows.length - shown.length;
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-avatar-group" aria-label={rows.length + " people"}>
          {shown.map(function (row) {
            return <span key={row.id} title={row.name}>{row.name.slice(0, 1)}</span>;
          })}
          {extra > 0 ? <span>+{extra}</span> : null}
        </div>
      )}
    </Frame>
  );
}

export function Callout(props) {
  return (
    <Frame {...props}>
      <div className={props.alert ? "ui-alert" : "ui-banner"} role="note">
        <strong>{props.alert ? "Check the ticket" : "Ready"}</strong>
        <span>{props.query || "The signature is complete."}</span>
      </div>
    </Frame>
  );
}

export function Meter(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {rows.map(function (row) {
            return (
              <div key={row.id}>
                <span>{row.name}</span>
                <span className="ui-meter"><i style={{ width: row.score + "%" }} /></span>
                <span>{row.score}</span>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

bind("feedback", "Feedback", [
  [Progress, "progress", "Progress", "A bar whose width follows the row count.", ["Progress"], 6, "ink"],
  [Spinner, "spinner", "Spinner", "An indeterminate loading mark.", ["Loading"], 1, "sea"],
  [Skeleton, "skeleton", "Skeleton", "Placeholder lines. The row count sets how many.", ["Placeholder"], 4, "gold"],
  [EmptyState, "empty-state", "Empty state", "A prompt to add a person when a view has no rows.", ["Empty"], 1, "clay"],
  [Badge, "badge", "Badge", "A count chip. Alert adds a second mark.", ["Count"], 4, "ink"],
  [Tag, "tag", "Tag", "Status chips for the current rows.", ["Status"], 6, "sea"],
  [Avatar, "avatar", "Avatar", "Initials plus name and role for the first match.", ["Name", "Role"], 1, "gold"],
  [AvatarGroup, "avatar-group", "Avatar group", "Overlapping initials, with a remainder count.", ["Name"], 8, "clay"],
  [Callout, "callout", "Callout", "A note. Alert turns it into a warning. Query replaces the sentence.", ["Note"], 1, "ink"],
  [Meter, "meter", "Meter", "A labeled bar for each person's score.", ["Name", "Score"], 5, "sea"],
]);
