import React from "react";
import { Blank, Frame, bind, fire, records } from "../kit.jsx";

const COLS = ["name", "role", "city", "status", "score"];

export function DataGrid(props) {
  const data = records(props);
  const [sort, setSort] = React.useState("name");
  const [dir, setDir] = React.useState(1);
  const [picked, setPicked] = React.useState(0);
  const rows = data.slice().sort(function (a, b) {
    if (a[sort] < b[sort]) return -dir;
    if (a[sort] > b[sort]) return dir;
    return 0;
  });
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-grid-wrap">
          <table className="ui-grid">
            <thead>
              <tr>
                {COLS.map(function (key) {
                  return (
                    <th key={key} className={key === "score" ? "num" : ""}>
                      <button type="button" onClick={function () {
                        if (sort === key) setDir(-dir);
                        else { setSort(key); setDir(1); }
                        fire(props, "sort", { column: key });
                      }}>
                        {key}{sort === key ? (dir > 0 ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(function (row) {
                return (
                  <tr key={row.id} className={picked === row.id ? "is-picked" : ""} onClick={function () {
                    setPicked(row.id);
                    fire(props, "select", { row: row.name });
                  }}>
                    <td>{row.name}</td>
                    <td>{row.role}</td>
                    <td>{row.city}</td>
                    <td><span className="ui-status">{row.status}</span></td>
                    <td className="num">{row.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Frame>
  );
}

export function Table(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <table className="ui-grid">
          <thead>
            <tr><th>Name</th><th>Role</th><th>City</th></tr>
          </thead>
          <tbody>
            {rows.map(function (row) {
              return <tr key={row.id}><td>{row.name}</td><td>{row.role}</td><td>{row.city}</td></tr>;
            })}
          </tbody>
          <tfoot>
            <tr><td colSpan="3">{rows.length} rows</td></tr>
          </tfoot>
        </table>
      )}
    </Frame>
  );
}

export function List(props) {
  const rows = records(props);
  const [picked, setPicked] = React.useState(0);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-list">
          {rows.map(function (row) {
            return (
              <li key={row.id}>
                <button type="button" className={picked === row.id ? "ui-item is-picked" : "ui-item"} onClick={function () {
                  setPicked(row.id);
                  fire(props, "select", { row: row.name });
                }}>
                  <span className="ui-avatar">{row.name.slice(0, 1)}</span>
                  <span><strong>{row.name}</strong><small>{row.role} · {row.city}</small></span>
                  <span className="ui-status">{row.status}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

export function DescriptionList(props) {
  const rows = records(props);
  const [index, setIndex] = React.useState(0);
  const row = rows[Math.min(index, Math.max(0, rows.length - 1))];
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div>
          <div className="ui-row">
            <button type="button" className="ui-btn" onClick={function () { setIndex(index > 0 ? index - 1 : 0); }}>Previous</button>
            <button type="button" className="ui-btn" onClick={function () { setIndex(index < rows.length - 1 ? index + 1 : index); }}>Next</button>
          </div>
          <dl className="ui-hlist">
            <div><dt className="ui-k">Name</dt><dd>{row.name}</dd></div>
            <div><dt className="ui-k">Role</dt><dd>{row.role}</dd></div>
            <div><dt className="ui-k">City</dt><dd>{row.city}</dd></div>
            <div><dt className="ui-k">Status</dt><dd>{row.status}</dd></div>
            <div><dt className="ui-k">Score</dt><dd>{row.score}</dd></div>
          </dl>
        </div>
      )}
    </Frame>
  );
}

export function TreeTable(props) {
  const data = records(props);
  const [closed, setClosed] = React.useState({});
  const groups = [];
  const seen = {};
  for (let i = 0; i < data.length; i++) {
    const city = data[i].city;
    if (!seen[city]) {
      seen[city] = { city: city, rows: [] };
      groups.push(seen[city]);
    }
    seen[city].rows.push(data[i]);
  }
  return (
    <Frame {...props}>
      {groups.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-tree">
          {groups.map(function (group) {
            const open = !closed[group.city];
            return (
              <li key={group.city}>
                <button type="button" className="ui-btn" onClick={function () {
                  const next = Object.assign({}, closed);
                  next[group.city] = open;
                  setClosed(next);
                  fire(props, "toggle", { row: group.city });
                }}>{open ? "▾" : "▸"} {group.city} ({group.rows.length})</button>
                {open ? (
                  <ul>
                    {group.rows.map(function (row) {
                      return <li key={row.id} className="ui-item"><span>{row.name}</span><small>{row.role}</small></li>;
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

export function PropertyGrid(props) {
  const rows = records(props);
  const [values, setValues] = React.useState(null);
  const source = rows[0];
  const current = values || source;
  return (
    <Frame {...props}>
      {!current ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {["name", "role", "city", "status"].map(function (key) {
            return (
              <label key={key} className="ui-field">
                <span>{key}</span>
                <input className="ui-input" value={current[key]} onChange={function (event) {
                  const next = Object.assign({}, current);
                  next[key] = event.target.value;
                  setValues(next);
                  fire(props, "edit", { column: key });
                }} />
              </label>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Timeline(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-time">
          {rows.map(function (row) {
            return (
              <article key={row.id}>
                <strong>{row.name}</strong>
                <p className="ui-note">{row.role} joined from {row.city}. Score {row.score}.</p>
              </article>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function ActivityFeed(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <ul className="ui-list">
          {rows.map(function (row) {
            return (
              <li key={row.id} className="ui-item">
                <span>{row.name} moved to {row.status}</span>
                <small>{row.score}m</small>
              </li>
            );
          })}
        </ul>
      )}
    </Frame>
  );
}

export function StatCards(props) {
  const rows = records(props);
  let total = 0;
  let active = 0;
  const cities = {};
  for (let i = 0; i < rows.length; i++) {
    total += rows[i].score;
    if (rows[i].status === "Active") active += 1;
    cities[rows[i].city] = true;
  }
  const cards = [
    ["People", rows.length],
    ["Active", active],
    ["Cities", Object.keys(cities).length],
    ["Avg score", rows.length ? Math.round(total / rows.length) : 0],
  ];
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-kpis">
          {cards.map(function (card) {
            return <article key={card[0]} className="ui-card ui-kpi"><h3>{card[0]}</h3><strong>{card[1]}</strong></article>;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Kanban(props) {
  const rows = records(props);
  const columns = ["Active", "Review", "Away", "Hold"];
  const [picked, setPicked] = React.useState("");
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-board">
          {columns.map(function (status) {
            return (
              <section key={status} className="ui-col">
                <h3>{status}</h3>
                {rows.filter(function (row) { return row.status === status; }).map(function (row) {
                  return (
                    <button key={row.id} type="button" className={picked === row.name ? "ui-item is-picked" : "ui-item"} onClick={function () {
                      setPicked(row.name);
                      fire(props, "select", { row: row.name, column: status });
                    }}>
                      <span>{row.name}</span>
                      <small>{row.role}</small>
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

bind("data", "Data display", [
  [DataGrid, "data-grid", "Data grid", "Sortable data grid with row selection. Search matches name, role, city, and status.", ["Name", "Role", "City", "Status", "Score"], 8, "ink"],
  [Table, "table", "Table", "Plain table with a row count in the footer.", ["Name", "Role", "City"], 6, "sea"],
  [List, "list", "List", "Selectable list with an avatar, a subtitle, and a status.", ["Name", "Role", "Status"], 6, "gold"],
  [DescriptionList, "description-list", "Description list", "Steps through one record and shows its fields.", ["Name", "Role", "City", "Status", "Score"], 6, "clay"],
  [TreeTable, "tree-table", "Tree table", "Rows grouped by city. Groups expand and collapse.", ["City", "Name", "Role"], 8, "ink"],
  [PropertyGrid, "property-grid", "Property grid", "Edits the fields of the first matching record.", ["Name", "Role", "City", "Status"], 1, "sea"],
  [Timeline, "timeline", "Timeline", "Vertical timeline of people and scores.", ["Name", "Role", "City"], 6, "gold"],
  [ActivityFeed, "activity-feed", "Activity feed", "A feed of status changes, newest row first in the list order.", ["Name", "Status"], 6, "clay"],
  [StatCards, "stat-cards", "Stat cards", "Counts people, active rows, cities, and the average score.", ["People", "Active", "Cities", "Score"], 8, "ink"],
  [Kanban, "kanban", "Kanban", "Four status columns. Selecting a card reports the column.", ["Active", "Review", "Away", "Hold"], 8, "sea"],
]);
