import React from "react";

export const PEOPLE = [
  { name: "Ada North", role: "Editor", city: "Lisbon", status: "Active", score: 92 },
  { name: "Jules Peck", role: "Printer", city: "Lyon", status: "Review", score: 74 },
  { name: "Mina Cho", role: "Binder", city: "Seoul", status: "Active", score: 88 },
  { name: "Omar Vale", role: "Archivist", city: "Tunis", status: "Away", score: 61 },
  { name: "Ruth Hale", role: "Proof", city: "Bath", status: "Hold", score: 53 },
  { name: "Leo Ibarra", role: "Compositor", city: "Oaxaca", status: "Active", score: 81 },
  { name: "Noor Elmi", role: "Designer", city: "Nairobi", status: "Review", score: 69 },
  { name: "Seth Quinn", role: "Shipper", city: "Cork", status: "Active", score: 77 },
  { name: "Hana Ito", role: "Curator", city: "Kyoto", status: "Away", score: 84 },
  { name: "Idris Berg", role: "Press", city: "Bergen", status: "Hold", score: 58 },
  { name: "Pia Rossi", role: "Sales", city: "Trieste", status: "Active", score: 90 },
  { name: "Evan Moss", role: "Clerk", city: "Halifax", status: "Review", score: 66 },
];

export const STATUSES = ["Active", "Review", "Away", "Hold"];

export function records(props) {
  const count = Math.max(0, props.rows | 0);
  const query = String(props.query || "").trim().toLowerCase();
  const out = [];
  for (let i = 0; i < count; i++) {
    const base = PEOPLE[i % PEOPLE.length];
    const row = {
      id: i + 1,
      name: i < PEOPLE.length ? base.name : base.name + " " + (i + 1),
      role: base.role,
      city: base.city,
      status: base.status,
      score: (base.score + i * 3) % 100,
    };
    const hay = (row.name + " " + row.role + " " + row.city + " " + row.status).toLowerCase();
    if (query && hay.indexOf(query) === -1) continue;
    out.push(row);
  }
  return out;
}

export function choices(props, list) {
  const count = Math.max(0, props.rows | 0);
  const query = String(props.query || "").trim().toLowerCase();
  const out = [];
  for (let i = 0; i < count; i++) {
    const item = list[i % list.length];
    const label = i < list.length ? item : item + " " + (i + 1);
    if (query && String(label).toLowerCase().indexOf(query) === -1) continue;
    out.push({ id: i + 1, label: label });
  }
  return out;
}

export function fire(props, type, extra) {
  if (typeof props.onAction === "function") {
    props.onAction(Object.assign({ type: type, component: props.label || "" }, extra || {}));
  }
}

export function Blank(props) {
  return <p className="ui-empty">{props.query ? "No matches." : "Nothing to show."}</p>;
}

export function Frame(props) {
  const dense = props.density === "dense" ? " is-dense" : "";
  const off = props.disabled ? " is-disabled" : "";
  const warn = props.alert ? " is-alert" : "";
  const empty = (props.rows | 0) < 1;
  return (
    <section className={"ui tone-" + (props.tone || "ink") + dense + off + warn} aria-label={props.label}>
      <header className="ui-head">
        <h2 className="ui-title">{props.label}</h2>
      </header>
      {props.alert ? <p className="ui-alert" role="alert">{props.label} needs attention.</p> : null}
      {empty ? <p className="ui-empty">Nothing to show.</p> : (
        <fieldset disabled={!!props.disabled} className="ui-body">
          {props.children}
        </fieldset>
      )}
    </section>
  );
}

export function bind(familyId, familyTitle, rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const component = row[0];
    component.displayName = component.name;
    component.spec = {
      id: row[1],
      familyId: familyId,
      familyTitle: familyTitle,
      kind: row[1],
      index: i + 1,
      displayName: component.name,
      label: row[2],
      title: familyTitle + "/" + row[2],
      tone: row[6],
      rows: row[5],
      blurb: row[3],
      fieldLabels: row[4],
    };
  }
}
