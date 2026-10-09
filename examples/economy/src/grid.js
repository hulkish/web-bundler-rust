import { FormulaError, evaluate } from "./formula.js";

const LAYOUTS = "economy-board-layouts";

export function mountGrid(root, board) {
  const state = {
    viewId: board.defaultView,
    lane: "All",
    query: "",
    queryExpr: "",
    filters: {},
    sorts: [],
    groupBy: null,
    hidden: new Set(),
    selected: null,
    checked: new Set(),
    density: "compact",
    threshold: 1,
    summaryKey: "",
    formulas: [],
    formulaSeq: 1,
    formulaDraft: { label: "", source: "" },
    formulaError: "",
    pins: [],
    pinSeq: 1,
    collapsed: new Set(),
    order: null,
    open: { columns: false, workbook: false },
    layoutName: "",
    layoutPick: "",
    past: [],
    future: [],
  };
  let whereError = "";

  root.addEventListener("click", onClick);
  root.addEventListener("input", onInput);
  root.addEventListener("keydown", onKey);
  root.addEventListener("toggle", onToggle, true);
  paint();

  function view() {
    return board.views.find((item) => item.id === state.viewId);
  }

  function laneViews() {
    if (state.lane === "All") return board.views;
    return board.views.filter((item) => item.lane === state.lane);
  }

  function activeFormulas() {
    return state.formulas.filter((formula) => formula.viewId === state.viewId);
  }

  function formulaColumns() {
    return activeFormulas().map((formula) => ({
      key: formula.key,
      label: formula.label,
      group: "Formula",
      type: "formula",
      digits: 2,
      heat: true,
      source: formula.source,
    }));
  }

  function allColumns() {
    let columns = [...view().columns, ...formulaColumns()];
    if (state.order) {
      const ranked = [];
      for (const key of state.order) {
        const found = columns.find((column) => column.key === key);
        if (found) {
          ranked.push(found);
        }
      }
      for (const column of columns) {
        if (!ranked.includes(column)) {
          ranked.push(column);
        }
      }
      columns = ranked;
    }
    return columns;
  }

  function columns() {
    return allColumns().filter((column) => !state.hidden.has(column.key));
  }

  function scope(row) {
    return {
      row,
      lookup(sheetId, matchKey, matchValue, valueKey) {
        const sheet = board.views.find((item) => item.id === sheetId || item.label === sheetId);
        if (!sheet) {
          throw new FormulaError(`Unknown sheet ${sheetId}`);
        }
        const found = sheet.rows.find((item) => String(item[matchKey]) === String(matchValue));
        if (!found) {
          throw new FormulaError(`No ${matchKey} matching ${matchValue} on ${sheet.label}`);
        }
        return found[valueKey];
      },
    };
  }

  function applyFormulas(row) {
    const out = { ...row };
    for (const formula of activeFormulas()) {
      try {
        out[formula.key] = evaluate(formula.source, scope(out));
      } catch (error) {
        out[formula.key] = null;
        out[`__err_${formula.key}`] = error.message;
      }
    }
    return out;
  }

  function rows() {
    whereError = "";
    const current = view();
    let list = current.rows.map((row, index) => ({ row: applyFormulas(row), index }));
    const query = state.query.trim().toLowerCase();
    if (query) {
      list = list.filter(({ row }) =>
        current.columns.some((column) => String(display(row, column)).toLowerCase().includes(query)),
      );
    }
    if (state.queryExpr.trim()) {
      try {
        list = list.filter(({ row }) => Boolean(evaluate(state.queryExpr, scope(row))));
      } catch (error) {
        whereError = error.message;
      }
    }
    list = list.filter(({ row }) =>
      columns().every((column) => passes(row[column.key], state.filters[column.key], column)),
    );
    const browsing = !query && !state.queryExpr.trim() && !filtering();
    if (browsing) {
      list = list.filter(({ row }) => !foldedAway(row));
    }
    const sorts = state.sorts.filter((sort) => columns().some((column) => column.key === sort.key));
    if (sorts.length) {
      list.sort((left, right) => {
        for (const sort of sorts) {
          const compared = compare(left.row[sort.key], right.row[sort.key]);
          if (compared !== 0) {
            return sort.direction === "asc" ? compared : -compared;
          }
        }
        return left.index - right.index;
      });
    }
    const grouped = groupedBy();
    if (grouped) {
      list.sort((left, right) => compare(String(left.row[grouped] ?? ""), String(right.row[grouped] ?? "")));
    }
    return list;
  }

  function groupedBy() {
    return state.groupBy == null ? view().groupBy || "" : state.groupBy;
  }

  function filtering() {
    return Object.values(state.filters).some((value) => String(value || "").trim());
  }

  function foldedAway(row) {
    const byId = new Map(view().rows.map((item) => [item.id, item]));
    let parent = row.parent;
    const seen = new Set();
    while (parent && !seen.has(parent)) {
      if (state.collapsed.has(parent)) {
        return true;
      }
      seen.add(parent);
      parent = byId.get(parent)?.parent;
    }
    return false;
  }

  function hasOutline() {
    return view().rows.some((row) => row.parent);
  }

  function paint() {
    const current = view();
    const grouped = groupedBy();
    const visible = columns();
    const shown = rows();
    const layouts = readLayouts();
    root.className = `board density-${state.density}`;
    root.innerHTML = `
      <div class="toolbar">
        <div class="lanes" role="tablist" aria-label="Table groups">
          ${["All", "Prices", "Labor", "Output", "Checks"]
            .map(
              (lane) =>
                `<button type="button" class="lane" data-lane="${lane}" aria-selected="${lane === state.lane}">${lane}</button>`,
            )
            .join("")}
        </div>
        <div class="views" role="tablist" aria-label="Tables">
          ${laneViews()
            .map(
              (item) =>
                `<button type="button" class="view" role="tab" data-view="${item.id}" aria-selected="${item.id === state.viewId}">${escapeHtml(item.label)}</button>`,
            )
            .join("")}
        </div>
        <label class="search">Search
          <input id="grid-search" type="search" value="${escapeHtml(state.query)}" placeholder="Series, source, note">
        </label>
        <label>Group
          <select id="grid-group">
            <option value="">None</option>
            ${groupOptions(current, grouped)}
          </select>
        </label>
        <label>Flag |move| ≥
          <input id="grid-threshold" type="number" min="0" step="0.1" value="${state.threshold}">
        </label>
        <label>Density
          <select id="grid-density">
            <option value="compact" ${state.density === "compact" ? "selected" : ""}>Compact</option>
            <option value="cozy" ${state.density === "cozy" ? "selected" : ""}>Cozy</option>
          </select>
        </label>
        <details class="columns" data-panel="columns" ${state.open.columns ? "open" : ""}>
          <summary>Columns</summary>
          <div>
            ${allColumns()
              .map(
                (column) =>
                  `<label><button type="button" data-nudge="left" data-key="${column.key}" aria-label="Move ${escapeHtml(column.label)} left">←</button><button type="button" data-nudge="right" data-key="${column.key}" aria-label="Move ${escapeHtml(column.label)} right">→</button><input type="checkbox" data-column="${column.key}" ${state.hidden.has(column.key) ? "" : "checked"}> ${escapeHtml(column.label)}</label>`,
              )
              .join("")}
          </div>
        </details>
        <details class="workbook" data-panel="workbook" ${state.open.workbook ? "open" : ""}>
          <summary>Workbook</summary>
          <div>
            <label>Where
              <input id="grid-where" value="${escapeHtml(state.queryExpr)}" placeholder='year &gt; 10 &amp;&amp; basket == "Energy"'>
            </label>
            <label>Formula name
              <input id="formula-label" value="${escapeHtml(state.formulaDraft.label)}" placeholder="Gap">
            </label>
            <label>Formula
              <input id="formula-source" value="${escapeHtml(state.formulaDraft.source)}" placeholder="year - aug">
            </label>
            <button type="button" id="formula-add">Add formula column</button>
            ${formulaList()}
            <label>Layout name
              <input id="layout-name" value="${escapeHtml(state.layoutName)}" placeholder="Energy desk">
            </label>
            <button type="button" id="layout-save">Save layout</button>
            <label>Saved layouts
              <select id="layout-pick">
                <option value="">Choose</option>
                ${Object.keys(layouts)
                  .map((name) => `<option value="${escapeHtml(name)}" ${state.layoutPick === name ? "selected" : ""}>${escapeHtml(name)}</option>`)
                  .join("")}
              </select>
            </label>
            <button type="button" id="layout-load">Load layout</button>
            <p class="formula-error">${escapeHtml([whereError, state.formulaError].filter(Boolean).join(" "))}</p>
          </div>
        </details>
        <button type="button" id="grid-undo" ${state.past.length ? "" : "disabled"}>Undo</button>
        <button type="button" id="grid-redo" ${state.future.length ? "" : "disabled"}>Redo</button>
        <button type="button" id="grid-pin">Pin selected row</button>
        ${hasOutline() ? `<button type="button" id="grid-collapse">Collapse outline</button><button type="button" id="grid-expand">Expand outline</button>` : ""}
        <button type="button" id="grid-export">Export visible CSV</button>
      </div>
      ${pinTable()}
      <div class="table-wrap" tabindex="0" id="grid-wrap">
        <table>
          <thead>
            <tr>${groupHeader(visible)}</tr>
            <tr>${visible.map((column) => headerCell(column)).join("")}</tr>
            <tr class="filters">${visible.map((column) => filterCell(column)).join("")}</tr>
          </thead>
          <tbody>${body(shown, visible, grouped)}</tbody>
        </table>
      </div>
      <footer class="summary-bar">
        <span id="grid-count">${shown.length} of ${current.rows.length} rows</span>
        <span>${state.checked.size} checked</span>
        <span>${summaryText(shown, visible, "visible")}</span>
        <span>${checkedSummary(shown, visible)}</span>
      </footer>
      <aside id="grid-detail" class="detail">${detail(shown)}</aside>
    `;
    const group = root.querySelector("#grid-group");
    if (group) {
      group.value = grouped;
    }
  }

  function formulaList() {
    const formulas = activeFormulas();
    if (!formulas.length) {
      return "";
    }
    return `<ul class="formula-list">${formulas
      .map(
        (formula) =>
          `<li><code>${escapeHtml(formula.label)} = ${escapeHtml(formula.source)}</code> <button type="button" data-drop-formula="${formula.key}">Remove</button></li>`,
      )
      .join("")}</ul>`;
  }

  function pinTable() {
    if (!state.pins.length) {
      return "";
    }
    const labels = [];
    for (const pin of state.pins) {
      for (const cell of pin.cells) {
        if (!labels.includes(cell.label)) {
          labels.push(cell.label);
        }
      }
    }
    const head = state.pins
      .map(
        (pin) =>
          `<th>${escapeHtml(pin.viewLabel)}<br>${escapeHtml(pin.title)} <button type="button" data-unpin="${pin.id}" aria-label="Remove pin">×</button></th>`,
      )
      .join("");
    const bodyRows = labels
      .map((label) => {
        const values = state.pins
          .map((pin) => `<td>${escapeHtml(pin.cells.find((cell) => cell.label === label)?.text ?? "—")}</td>`)
          .join("");
        return `<tr><th>${escapeHtml(label)}</th>${values}</tr>`;
      })
      .join("");
    return `<section class="pins" aria-label="Pinned rows"><div class="table-wrap"><table><thead><tr><th>Field</th>${head}</tr></thead><tbody>${bodyRows}</tbody></table></div><button type="button" id="grid-clear-pins">Clear pins</button></section>`;
  }

  function groupOptions(current, grouped) {
    const keys = current.columns.filter((column) => column.type !== "number" && column.type !== "spark" && column.type !== "formula");
    return keys
      .map(
        (column) =>
          `<option value="${column.key}" ${grouped === column.key ? "selected" : ""}>${escapeHtml(column.label)}</option>`,
      )
      .join("");
  }

  function groupHeader(visible) {
    const cells = [];
    let index = 0;
    while (index < visible.length) {
      const group = visible[index].group || "";
      let span = 1;
      while (index + span < visible.length && (visible[index + span].group || "") === group) {
        span += 1;
      }
      cells.push(`<th colspan="${span}">${escapeHtml(group)}</th>`);
      index += span;
    }
    return cells.join("");
  }

  function headerCell(column) {
    const sort = state.sorts.find((item) => item.key === column.key);
    const mark = sort ? (sort.direction === "asc" ? " ▲" : " ▼") : "";
    const rank = sort ? state.sorts.indexOf(sort) + 1 : "";
    const title = column.source ? ` title="${escapeHtml(column.source)}"` : "";
    return `<th class="${column.frozen ? "frozen" : ""}" data-sort="${column.key}" aria-sort="${sort ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}"${title}>${escapeHtml(column.label)}${mark}${rank && state.sorts.length > 1 ? `<sup>${rank}</sup>` : ""}</th>`;
  }

  function filterCell(column) {
    const value = state.filters[column.key] || "";
    return `<th class="${column.frozen ? "frozen" : ""}"><input data-filter="${column.key}" value="${escapeHtml(value)}" aria-label="Filter ${escapeHtml(column.label)}" placeholder="${column.type === "number" || column.type === "formula" ? ">0" : "contains"}"></th>`;
  }

  function body(shown, visible, grouped) {
    let html = "";
    let previous = null;
    for (const item of shown) {
      const group = grouped ? String(item.row[grouped] ?? "") : "";
      if (grouped && group !== previous) {
        html += `<tr class="group"><th colspan="${visible.length}">${escapeHtml(group || "Ungrouped")} <span>${countGroup(shown, grouped, group)} rows</span></th></tr>`;
        previous = group;
      }
      const selected = state.selected === item.index ? "selected" : "";
      html += `<tr data-row="${item.index}" class="${selected}">${visible.map((column) => cell(item, column, visible)).join("")}</tr>`;
    }
    if (!shown.length) {
      html = `<tr><td class="empty" colspan="${visible.length}">No rows match the current filters.</td></tr>`;
    }
    return html;
  }

  function countGroup(shown, grouped, group) {
    return shown.filter((item) => String(item.row[grouped] ?? "") === group).length;
  }

  function cell(item, column, visible) {
    const value = item.row[column.key];
    if (column.type === "spark") {
      return `<td>${spark(value)}</td>`;
    }
    const text = display(item.row, column);
    const flagged = column.heat && typeof value === "number" && Math.abs(value) >= state.threshold;
    const tone = column.heat && typeof value === "number" ? (value > 0 ? "up" : value < 0 ? "down" : "") : "";
    const frozen = column.frozen ? "frozen" : "";
    const barred = column.bar ? "barred" : "";
    const first = visible[0] && column.key === visible[0].key;
    const indent = first && item.row.depth ? `padding-left:${0.45 + item.row.depth * 0.85}rem` : "";
    const check =
      first && column.frozen
        ? `<input type="checkbox" data-check="${item.index}" ${state.checked.has(item.index) ? "checked" : ""} aria-label="Check row"> `
        : "";
    const kids = first && item.row.id && view().rows.some((row) => row.parent === item.row.id);
    const fold = kids
      ? `<button type="button" class="fold" data-fold="${item.row.id}" aria-expanded="${state.collapsed.has(item.row.id) ? "false" : "true"}">${state.collapsed.has(item.row.id) ? "▸" : "▾"}</button> `
      : "";
    const bar =
      column.bar && typeof value === "number"
        ? `<span class="bar" style="width:${Math.max(0, Math.min(100, value))}%"></span>`
        : "";
    const error = item.row[`__err_${column.key}`];
    const title = error ? ` title="${escapeHtml(error)}"` : "";
    return `<td class="${[tone, frozen, barred, flagged ? "flagged" : ""].filter(Boolean).join(" ")}" style="${heatStyle(value, column)}${indent ? `;${indent}` : ""}"${title}>${bar}${fold}${check}${escapeHtml(text)}</td>`;
  }

  function heatStyle(value, column) {
    if (!column.heat || typeof value !== "number") {
      return "";
    }
    const magnitude = Math.min(Math.abs(value) / 8, 1);
    const color = value > 0 ? `rgba(143, 191, 122, ${0.15 + magnitude * 0.55})` : value < 0 ? `rgba(224, 122, 98, ${0.15 + magnitude * 0.55})` : "transparent";
    return `background:${color}`;
  }

  function spark(values) {
    const series = Array.isArray(values) ? values.filter((value) => typeof value === "number") : [];
    if (series.length < 2) {
      return "";
    }
    const width = 84;
    const height = 22;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = max - min || 1;
    const points = series
      .map((value, index) => {
        const x = (index / (series.length - 1)) * width;
        const y = height - ((value - min) / span) * (height - 2) - 1;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
    return `<svg class="spark" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true"><polyline points="${points}"></polyline></svg>`;
  }

  function detail(shown) {
    const item = shown.find((entry) => entry.index === state.selected) || shown[0];
    if (!item) {
      return "<p>No row selected.</p>";
    }
    const fields = allColumns()
      .map(
        (column) =>
          `<div><dt>${escapeHtml(column.label)}</dt><dd>${escapeHtml(display(item.row, column))}</dd></div>`,
      )
      .join("");
    const drill = item.row.drill
      ? `<button type="button" data-drill="${escapeHtml(item.row.drill)}" data-drill-query="${escapeHtml(item.row.drillQuery || "")}">Open source table</button>`
      : "";
    return `<h2>${escapeHtml(display(item.row, view().columns[0]))}</h2>${drill}<dl>${fields}</dl>`;
  }

  function summaryText(shown, visible, prefix) {
    const key = state.summaryKey || visible.find((column) => column.type === "number" || column.type === "formula")?.key;
    const column = visible.find((item) => item.key === key);
    if (!column) {
      return "";
    }
    const numbers = shown.map((item) => item.row[column.key]).filter((value) => typeof value === "number");
    return `${prefix} ${stats(numbers, column)}`;
  }

  function checkedSummary(shown, visible) {
    if (!state.checked.size) {
      return "";
    }
    const key = state.summaryKey || visible.find((column) => column.type === "number" || column.type === "formula")?.key;
    const column = visible.find((item) => item.key === key);
    if (!column) {
      return "";
    }
    const numbers = shown
      .filter((item) => state.checked.has(item.index))
      .map((item) => item.row[column.key])
      .filter((value) => typeof value === "number");
    return `checked ${stats(numbers, column)}`;
  }

  function stats(numbers, column) {
    if (!numbers.length) {
      return `${column.label}: no numeric values`;
    }
    const sum = numbers.reduce((total, value) => total + value, 0);
    const mean = sum / numbers.length;
    const variance = numbers.reduce((total, value) => total + (value - mean) ** 2, 0) / numbers.length;
    return `${column.label}: n ${numbers.length} · sum ${formatNumber(sum, column.digits)} · min ${formatNumber(Math.min(...numbers), column.digits)} · avg ${formatNumber(mean, column.digits)} · max ${formatNumber(Math.max(...numbers), column.digits)} · sd ${formatNumber(Math.sqrt(variance), column.digits)}`;
  }

  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const laneButton = target.closest("[data-lane]");
    if (laneButton) {
      commit(() => {
        state.lane = laneButton.getAttribute("data-lane");
        const visible = state.lane === "All" ? board.views : board.views.filter((item) => item.lane === state.lane);
        if (!visible.some((item) => item.id === state.viewId)) {
          openView(visible[0].id, "");
        }
      });
      return;
    }
    const viewButton = target.closest("[data-view]");
    if (viewButton) {
      commit(() => openView(viewButton.getAttribute("data-view"), ""));
      return;
    }
    if (target.closest("[data-drill]")) {
      const button = target.closest("[data-drill]");
      commit(() => openView(button.getAttribute("data-drill"), button.getAttribute("data-drill-query") || ""));
      return;
    }
    const sort = target.closest("[data-sort]");
    if (sort) {
      commit(() => {
        const key = sort.getAttribute("data-sort");
        toggleSort(key, event.shiftKey);
        const column = columns().find((item) => item.key === key);
        if (column && (column.type === "number" || column.type === "formula")) {
          state.summaryKey = key;
        }
      });
      return;
    }
    if (target.matches("[data-check]")) {
      commit(() => toggleCheck(Number(target.getAttribute("data-check"))));
      return;
    }
    if (target.matches("[data-fold]")) {
      commit(() => toggleFold(target.getAttribute("data-fold")));
      return;
    }
    if (target.matches("[data-nudge]")) {
      commit(() => moveColumn(target.getAttribute("data-key"), target.getAttribute("data-nudge")));
      return;
    }
    if (target.matches("[data-unpin]")) {
      commit(() => {
        state.pins = state.pins.filter((pin) => String(pin.id) !== target.getAttribute("data-unpin"));
      });
      return;
    }
    if (target.matches("[data-drop-formula]")) {
      commit(() => dropFormula(target.getAttribute("data-drop-formula")));
      return;
    }
    if (target.id === "formula-add") {
      addFormula();
      return;
    }
    if (target.id === "grid-pin") {
      commit(() => pinSelected());
      return;
    }
    if (target.id === "grid-clear-pins") {
      commit(() => {
        state.pins = [];
      });
      return;
    }
    if (target.id === "grid-collapse") {
      commit(() => {
        state.collapsed = new Set(view().rows.map((row) => row.parent).filter(Boolean));
      });
      return;
    }
    if (target.id === "grid-expand") {
      commit(() => {
        state.collapsed = new Set();
      });
      return;
    }
    if (target.id === "grid-undo") {
      undo();
      return;
    }
    if (target.id === "grid-redo") {
      redo();
      return;
    }
    if (target.id === "layout-save") {
      saveLayout();
      return;
    }
    if (target.id === "layout-load") {
      loadLayout();
      return;
    }
    const row = target.closest("[data-row]");
    if (row) {
      state.selected = Number(row.getAttribute("data-row"));
      paint();
      return;
    }
    if (target.id === "grid-export") {
      exportCsv();
    }
  }

  function onInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      return;
    }
    if (target.id === "formula-label" || target.id === "formula-source") {
      state.formulaDraft[target.id === "formula-label" ? "label" : "source"] = target.value;
      return;
    }
    if (target.id === "layout-name") {
      state.layoutName = target.value;
      return;
    }
    if (target.id === "layout-pick") {
      state.layoutPick = target.value;
      return;
    }
    if (target.id === "grid-search") {
      state.query = target.value;
      paint();
      restoreFocus("#grid-search", target.selectionStart);
      return;
    }
    if (target.id === "grid-where") {
      state.queryExpr = target.value;
      state.formulaError = "";
      paint();
      restoreFocus("#grid-where", target.selectionStart);
      return;
    }
    if (target.id === "grid-group") {
      commit(() => {
        state.groupBy = target.value;
      });
      return;
    }
    if (target.id === "grid-density") {
      state.density = target.value;
      paint();
      return;
    }
    if (target.id === "grid-threshold") {
      state.threshold = Number(target.value) || 0;
      paint();
      restoreFocus("#grid-threshold");
      return;
    }
    if (target.matches("[data-filter]")) {
      const key = target.getAttribute("data-filter");
      state.filters[key] = target.value;
      paint();
      restoreFocus(`[data-filter="${CSS.escape(key)}"]`, target.selectionStart);
      return;
    }
    if (target.matches("[data-column]")) {
      const key = target.getAttribute("data-column");
      commit(() => {
        if (target.checked) {
          state.hidden.delete(key);
        } else {
          state.hidden.add(key);
        }
      });
    }
  }

  function onToggle(event) {
    const panel = event.target;
    if (!(panel instanceof HTMLDetailsElement) || !panel.dataset.panel) {
      return;
    }
    state.open[panel.dataset.panel] = panel.open;
  }

  function onKey(event) {
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !typing) {
      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
      return;
    }
    if (typing || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) {
      return;
    }
    const shown = rows();
    if (!shown.length) {
      return;
    }
    const position = shown.findIndex((item) => item.index === state.selected);
    const next = event.key === "ArrowDown" ? Math.min(shown.length - 1, position + 1) : Math.max(0, position - 1);
    state.selected = shown[next === -1 ? 0 : next].index;
    event.preventDefault();
    paint();
  }

  function openView(id, query) {
    const next = board.views.find((item) => item.id === id);
    if (next && state.lane !== "All" && next.lane !== state.lane) state.lane = next.lane;
    state.viewId = id;
    state.query = query;
    state.queryExpr = "";
    state.filters = {};
    state.sorts = [];
    state.groupBy = null;
    state.hidden = new Set();
    state.selected = null;
    state.checked = new Set();
    state.summaryKey = "";
    state.collapsed = new Set();
    state.order = null;
    state.formulaError = "";
  }

  function addFormula() {
    const label = state.formulaDraft.label.trim();
    const source = state.formulaDraft.source.trim();
    if (!label || !source) {
      state.formulaError = "Name and formula are both required.";
      paint();
      return;
    }
    try {
      evaluate(source, { row: new Proxy({}, { has: () => true, get: () => 0 }), lookup: () => 0 });
    } catch (error) {
      state.formulaError = error.message;
      paint();
      return;
    }
    commit(() => {
      const key = `fx${state.formulaSeq}`;
      state.formulaSeq += 1;
      state.formulas.push({ key, label, source, viewId: state.viewId });
      if (state.order) {
        state.order.push(key);
      }
      state.formulaError = "";
      state.open.workbook = true;
    });
  }

  function dropFormula(key) {
    state.formulas = state.formulas.filter((formula) => formula.key !== key);
    state.hidden.delete(key);
    state.sorts = state.sorts.filter((sort) => sort.key !== key);
    if (state.order) {
      state.order = state.order.filter((item) => item !== key);
    }
    if (state.summaryKey === key) {
      state.summaryKey = "";
    }
  }

  function pinSelected() {
    const shown = rows();
    const item = shown.find((entry) => entry.index === state.selected) || shown[0];
    if (!item) {
      state.formulaError = "There is no row to pin.";
      return;
    }
    if (state.pins.length >= 4) {
      state.pins.shift();
    }
    const visible = columns();
    state.pins.push({
      id: state.pinSeq,
      viewLabel: view().label,
      title: display(item.row, visible[0]),
      cells: visible.map((column) => ({ label: column.label, text: display(item.row, column) })),
    });
    state.pinSeq += 1;
    state.formulaError = "";
  }

  function moveColumn(key, direction) {
    const keys = allColumns().map((column) => column.key);
    const index = keys.indexOf(key);
    const next = index + (direction === "left" ? -1 : 1);
    if (index < 0 || next < 0 || next >= keys.length) {
      return;
    }
    const swapped = keys[next];
    keys[next] = keys[index];
    keys[index] = swapped;
    state.order = keys;
    state.open.columns = true;
  }

  function toggleCheck(index) {
    if (state.checked.has(index)) {
      state.checked.delete(index);
    } else {
      state.checked.add(index);
    }
  }

  function toggleFold(id) {
    if (state.collapsed.has(id)) {
      state.collapsed.delete(id);
    } else {
      state.collapsed.add(id);
    }
  }

  function commit(change) {
    state.past.push(snapshot());
    if (state.past.length > 50) {
      state.past.shift();
    }
    state.future = [];
    change();
    paint();
  }

  function undo() {
    const previous = state.past.pop();
    if (!previous) {
      return;
    }
    state.future.push(snapshot());
    restore(previous);
    paint();
  }

  function redo() {
    const next = state.future.pop();
    if (!next) {
      return;
    }
    state.past.push(snapshot());
    restore(next);
    paint();
  }

  function snapshot() {
    return {
      viewId: state.viewId,
      query: state.query,
      queryExpr: state.queryExpr,
      filters: { ...state.filters },
      sorts: state.sorts.map((sort) => ({ ...sort })),
      groupBy: state.groupBy,
      hidden: [...state.hidden],
      selected: state.selected,
      checked: [...state.checked],
      density: state.density,
      threshold: state.threshold,
      summaryKey: state.summaryKey,
      formulas: state.formulas.map((formula) => ({ ...formula })),
      formulaSeq: state.formulaSeq,
      pins: state.pins.map((pin) => ({ ...pin, cells: pin.cells.map((cell) => ({ ...cell })) })),
      pinSeq: state.pinSeq,
      collapsed: [...state.collapsed],
      order: state.order ? [...state.order] : null,
    };
  }

  function restore(shot) {
    state.viewId = shot.viewId;
    state.query = shot.query;
    state.queryExpr = shot.queryExpr;
    state.filters = { ...shot.filters };
    state.sorts = shot.sorts.map((sort) => ({ ...sort }));
    state.groupBy = shot.groupBy;
    state.hidden = new Set(shot.hidden);
    state.selected = shot.selected;
    state.checked = new Set(shot.checked);
    state.density = shot.density;
    state.threshold = shot.threshold;
    state.summaryKey = shot.summaryKey;
    state.formulas = shot.formulas.map((formula) => ({ ...formula }));
    state.formulaSeq = shot.formulaSeq;
    state.pins = shot.pins.map((pin) => ({ ...pin, cells: pin.cells.map((cell) => ({ ...cell })) }));
    state.pinSeq = shot.pinSeq;
    state.collapsed = new Set(shot.collapsed);
    state.order = shot.order ? [...shot.order] : null;
  }

  function saveLayout() {
    const name = state.layoutName.trim();
    if (!name || typeof localStorage === "undefined") {
      state.formulaError = "Name the layout before saving it.";
      paint();
      return;
    }
    const layouts = readLayouts();
    layouts[name] = snapshot();
    localStorage.setItem(LAYOUTS, JSON.stringify(layouts));
    state.layoutPick = name;
    state.formulaError = "";
    state.open.workbook = true;
    paint();
  }

  function loadLayout() {
    const shot = readLayouts()[state.layoutPick];
    if (!shot) {
      state.formulaError = "Choose a saved layout.";
      paint();
      return;
    }
    commit(() => restore(shot));
  }

  function readLayouts() {
    if (typeof localStorage === "undefined") {
      return {};
    }
    try {
      const parsed = JSON.parse(localStorage.getItem(LAYOUTS) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function restoreFocus(selector, cursor) {
    const field = root.querySelector(selector);
    if (field instanceof HTMLInputElement) {
      field.focus();
      if (cursor != null) {
        field.setSelectionRange(cursor, cursor);
      }
    }
  }

  function toggleSort(key, additive) {
    if (!additive) {
      const existing = state.sorts[0];
      state.sorts =
        state.sorts.length === 1 && existing.key === key
          ? [{ key, direction: existing.direction === "asc" ? "desc" : "asc" }]
          : [{ key, direction: "asc" }];
      return;
    }
    const found = state.sorts.find((sort) => sort.key === key);
    if (!found) {
      state.sorts.push({ key, direction: "asc" });
      return;
    }
    found.direction = found.direction === "asc" ? "desc" : "asc";
  }

  function exportCsv() {
    const visible = columns();
    const lines = [visible.map((column) => csv(column.label)).join(",")];
    for (const item of rows()) {
      lines.push(visible.map((column) => csv(display(item.row, column))).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `us-economy-${view().id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

function display(row, column) {
  const value = row[column.key];
  if (column.type === "spark") {
    return Array.isArray(value) ? value.join(" ") : "";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value == null || value === "") {
    return row[`__err_${column.key}`] ? "err" : "—";
  }
  if (column.type === "number" || column.type === "formula") {
    if (typeof value === "number") {
      return formatNumber(value, column.digits ?? 2);
    }
  }
  return String(value);
}

function formatNumber(value, digits) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function passes(value, filter, column) {
  if (!filter) {
    return true;
  }
  const text = filter.trim();
  if (!text) {
    return true;
  }
  if ((column.type === "number" || column.type === "formula") && typeof value === "number") {
    const range = text.match(/^(-?\d+(?:\.\d+)?)\.\.(-?\d+(?:\.\d+)?)$/);
    if (range) {
      return value >= Number(range[1]) && value <= Number(range[2]);
    }
    const comparison = text.match(/^(>=|<=|>|<|=)(-?\d+(?:\.\d+)?)$/);
    if (comparison) {
      const amount = Number(comparison[2]);
      if (comparison[1] === ">") return value > amount;
      if (comparison[1] === ">=") return value >= amount;
      if (comparison[1] === "<") return value < amount;
      if (comparison[1] === "<=") return value <= amount;
      return value === amount;
    }
  }
  return String(display({ [column.key]: value }, column)).toLowerCase().includes(text.toLowerCase());
}

function compare(left, right) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), "en");
}

function csv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
