import React from "react";
import { Blank, Frame, bind, records } from "../kit.jsx";

const COLORS = ["#1ea7fd", "#ff4785", "#e69d00", "#fc521f", "#2eaa6e", "#7b61ff", "#2e3438", "#66c2a5"];

export function BarChart(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {rows.map(function (row) {
            return (
              <div key={row.id}>
                <span>{row.name.split(" ")[0]}</span>
                <span className="ui-bar"><i style={{ width: Math.max(4, row.score) + "%" }} /></span>
                <span>{row.score}</span>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Donut(props) {
  const rows = records(props);
  let total = 0;
  for (let i = 0; i < rows.length; i++) total += rows[i].score || 1;
  let angle = 0;
  const stops = [];
  for (let i = 0; i < rows.length; i++) {
    const span = ((rows[i].score || 1) / total) * 360;
    stops.push(COLORS[i % COLORS.length] + " " + angle + "deg " + (angle + span) + "deg");
    angle += span;
  }
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-row">
          <div className="ui-donut" style={{ background: "conic-gradient(" + stops.join(",") + ")" }}><span>{total}</span></div>
          <div className="ui-legend">
            {rows.map(function (row, index) {
              return <span key={row.id}><i style={{ background: COLORS[index % COLORS.length] }} />{row.city}</span>;
            })}
          </div>
        </div>
      )}
    </Frame>
  );
}

export function Sparkline(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-spark" aria-hidden="true">
          {rows.map(function (row) {
            return <i key={row.id} style={{ height: Math.max(8, row.score) + "%" }} title={row.name + " " + row.score} />;
          })}
        </div>
      )}
    </Frame>
  );
}

export function AreaChart(props) {
  const rows = records(props);
  const points = [];
  for (let i = 0; i < rows.length; i++) {
    const x = rows.length === 1 ? 0 : (i / (rows.length - 1)) * 100;
    const y = 40 - (rows[i].score / 100) * 36;
    points.push(x + "," + y);
  }
  const line = points.join(" ");
  const fill = (points.length ? "0,40 " + line + " 100,40" : "");
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <svg viewBox="0 0 100 40" width="100%" height="120" role="img" aria-label="Area chart">
          <polygon points={fill} fill="currentColor" opacity="0.2" />
          <polyline points={line} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </Frame>
  );
}

export function Gauge(props) {
  const rows = records(props);
  let total = 0;
  for (let i = 0; i < rows.length; i++) total += rows[i].score;
  const value = rows.length ? Math.round(total / rows.length) : 0;
  return (
    <Frame {...props}>
      <div className="ui-donut" style={{ background: "conic-gradient(var(--accent) " + (value * 3.6) + "deg, #e8eef3 0)" }}>
        <span>{value}</span>
      </div>
    </Frame>
  );
}

export function Heatmap(props) {
  const count = Math.max(0, props.rows | 0);
  const cells = [];
  for (let i = 0; i < count * 4; i++) cells.push((i * 17) % 100);
  return (
    <Frame {...props}>
      {cells.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-heat" aria-hidden="true">
          {cells.map(function (cell, index) {
            return <i key={index} style={{ opacity: 0.2 + cell / 140 }} />;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Legend(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-legend">
          {rows.map(function (row, index) {
            return <span key={row.id}><i style={{ background: COLORS[index % COLORS.length] }} />{row.status} · {row.city}</span>;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Bullet(props) {
  const rows = records(props);
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {rows.map(function (row) {
            return (
              <div key={row.id}>
                <span>{row.city}</span>
                <span className="ui-bullet"><i style={{ width: row.score + "%" }} /></span>
                <span>{row.score}</span>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

export function Funnel(props) {
  const steps = ["Visit", "Quote", "Proof", "Print", "Ship"];
  const count = Math.max(0, Math.min(steps.length, props.rows | 0));
  return (
    <Frame {...props}>
      {count === 0 ? <Blank query={props.query} /> : (
        <div className="ui-funnel">
          {steps.slice(0, count).map(function (step, index) {
            const width = 100 - index * 14;
            return <i key={step} style={{ width: width + "%" }}>{step}</i>;
          })}
        </div>
      )}
    </Frame>
  );
}

export function Histogram(props) {
  const rows = records(props);
  const bins = [0, 0, 0, 0, 0];
  for (let i = 0; i < rows.length; i++) {
    const bin = Math.min(4, Math.floor(rows[i].score / 20));
    bins[bin] += 1;
  }
  const labels = ["0–19", "20–39", "40–59", "60–79", "80–99"];
  const max = Math.max.apply(null, bins.concat([1]));
  return (
    <Frame {...props}>
      {rows.length === 0 ? <Blank query={props.query} /> : (
        <div className="ui-hlist">
          {bins.map(function (bin, index) {
            return (
              <div key={labels[index]}>
                <span>{labels[index]}</span>
                <span className="ui-bar"><i style={{ width: (bin / max) * 100 + "%" }} /></span>
                <span>{bin}</span>
              </div>
            );
          })}
        </div>
      )}
    </Frame>
  );
}

bind("charts", "Charts", [
  [BarChart, "bar-chart", "Bar chart", "Horizontal bars of each person's score.", ["Name", "Score"], 6, "ink"],
  [Donut, "donut", "Donut", "Shares of score by city, with a total in the middle.", ["City", "Score"], 5, "sea"],
  [Sparkline, "sparkline", "Sparkline", "A compact column of scores.", ["Score"], 8, "gold"],
  [AreaChart, "area-chart", "Area chart", "A filled line of scores across the rows.", ["Score"], 6, "clay"],
  [Gauge, "gauge", "Gauge", "A ring showing the average score.", ["Score"], 6, "ink"],
  [Heatmap, "heatmap", "Heat map", "A grid of cells. The row count sets how many weeks.", ["Week"], 4, "sea"],
  [Legend, "legend", "Legend", "Color keys for status and city.", ["Status", "City"], 5, "gold"],
  [Bullet, "bullet", "Bullet", "A bullet bar for each city.", ["City", "Score"], 5, "clay"],
  [Funnel, "funnel", "Funnel", "Visit, quote, proof, print, and ship. The row count trims the funnel.", ["Visit", "Quote", "Proof", "Print", "Ship"], 5, "ink"],
  [Histogram, "histogram", "Histogram", "Scores grouped into five bins.", ["Score"], 8, "sea"],
]);
