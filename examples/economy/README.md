# Economy

A browser workbook of the US statistics that were already published on October 3, 2026. The grid sorts, filters, groups, hides and reorders columns, flags large moves, exports the visible rows, and keeps a detail panel. The workbook adds an outline, a where-clause, formula columns, pinned comparisons, undo, saved layouts, and several derived checks. Tables are grouped into Prices, Labor, Output, and Checks.

```bash
cargo run -- --config examples/economy/webbundler.config.json
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/economy/preview/index.html`.

`node examples/economy/preview/economy.js` prints the headline readings. The package is `"type": "module"` because the bundle is an ES module.

The tables are:

- **Ledger** mixes labor, output, prices, and the federal funds range. Each row names its source.
- **Prices** is the August 2026 CPI-U table, with a sparkline for February through August.
- **Accounts** compares the advance, second, and third estimates of 2026 Q2.
- **Q1 revisions** is the annual update published with that GDP release.
- **September labor** is the October 2 employment report.
- **August payrolls** is the industry change table from the August employment report. July and August were still preliminary in that release.
- **State jobs** is a subset of the BLS July 2026 industry-employment table: Alabama, Colorado, Georgia, Nevada, New Hampshire, New York, North Carolina, and Texas. Mining, construction, and manufacturing are also shown as a combined goods column. The BLS “mining, logging, and construction” column overlaps those parts, so it is not repeated.
- **State extremes** are the high and low ends BEA published for the quarter, not a full 50-state file.
- **Calendar** separates releases that were out from releases still scheduled after October 3.
- **CPI compound** compounds the seven published February–August monthly changes and subtracts that from the published 12-month change. It is not an official index.
- **Identities** adds the published September payroll levels and shows that the rounded private and government levels miss the published nonfarm total by 0.01 million. It also subtracts published GDP from GDI, and core PCE from PCE.
- **State shares** turns the eight transcribed state rows into sector shares of that state and of the eight-state subset.
- **Crosswalk** joins those state jobs to the BEA extremes. New York is the only state present on both lists.
- **CPI detail** is BLS Table 2 for August 2026, joined to the Table 6 one-month effect, standard error, and record. Weight times the August change is shown beside the official effect and labeled as a different calculation.
- **CPI special** is Table 3, including the index levels.
- **CPI places** is Table 4 for regions and metro areas. Odd-month and even-month areas leave the other month blank.
- **CPI history** is Table 5, December 2013 through August 2026, CPI-U beside C-CPI-U. The archived table text has no October 2025 row.
- **CPI weights** adds the published relative-importance groups and the official food, energy, and core effects.
- **September industries** is establishment Table B-1, seasonally adjusted, for 174 industries. The published over-the-month change is kept beside the change implied by the levels. Private plus government equals nonfarm in these thousands. The 0.01 million gap remains only on the rounded million levels.
- **Underutilization** is Table A-15, U-1 through U-6.
- **Jobless spells** is Table A-12, seasonally adjusted counts, weeks, and shares.
- **Cell audit** is one row per published numeric cell, including the new tables.

Prices, August payrolls, and September industries are outlines: the disclosure triangle hides the children of a row. Shift-click a column heading to add a sort. A numeric filter accepts `>1`, `<=0`, or `2..4`.

The workbook panel takes a where-clause and formula columns in the same language: `year - aug`, `pct(jobs, 1000)`, `compound()`, and `lookup("prices", "series", "Gasoline (all types)", "year")`. Comparisons use `==`, `!=`, `>`, `>=`, `<`, `<=`, `&&`, and `||`. Pin keeps up to four rows side by side. Undo and redo cover table changes, sorts, outline folds, pins, and formulas. A named layout is stored in this browser.
