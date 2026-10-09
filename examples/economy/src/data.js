import states from "./states.json";
import { compound } from "./formula.js";
import {
  areaRows,
  detailRows,
  historyRows,
  payrollLevels,
  payrollRows,
  specialRows,
  spellRows,
  underuseRows,
  weightRows,
} from "./more.js";

export const asOf = "2026-10-03";

const cpiMonths = ["feb", "mar", "apr", "may", "jun", "jul", "aug"];

const cpi = [
  ["All items", "Headline", [0.3, 0.9, 0.6, 0.5, -0.4, 0.1, 0.4], 3.4, false, null],
  ["Food", "Food", [0.4, 0.0, 0.5, 0.2, 0.2, 0.1, 0.1], 2.7, false, "All items"],
  ["Food at home", "Food", [0.4, -0.2, 0.7, 0.1, 0.2, -0.1, 0.0], 2.2, false, "Food"],
  ["Food away from home", "Food", [0.3, 0.2, 0.2, 0.3, 0.2, 0.3, 0.3], 3.4, true, "Food"],
  ["Energy", "Energy", [0.6, 10.9, 3.8, 3.9, -5.7, -1.5, 2.1], 16.3, false, "All items"],
  ["Energy commodities", "Energy", [1.1, 21.3, 5.6, 6.7, -9.5, -2.9, 4.2], 28.0, false, "Energy"],
  ["Gasoline (all types)", "Energy", [0.8, 21.2, 5.4, 7.0, -9.7, -2.9, 3.9], 27.4, false, "Energy commodities"],
  ["Fuel oil", "Energy", [11.1, 30.7, 5.8, 3.8, -9.2, -1.7, 10.1], 52.0, false, "Energy commodities"],
  ["Energy services", "Energy", [0.2, 0.4, 1.6, 0.4, -0.7, 0.3, -0.4], 4.0, false, "Energy"],
  ["Electricity", "Energy", [-0.7, 0.8, 2.1, 0.6, -1.0, 0.1, -0.2], 3.8, false, "Energy services"],
  ["Utility (piped) gas service", "Energy", [3.1, -0.9, -0.1, -0.5, 0.5, 0.7, -1.1], 4.4, false, "Energy services"],
  ["All items less food and energy", "Core", [0.2, 0.2, 0.4, 0.2, 0.0, 0.2, 0.3], 2.4, false, "All items"],
  ["Commodities less food and energy", "Core goods", [0.1, 0.1, 0.0, -0.1, -0.1, 0.2, 0.1], 0.7, false, "All items less food and energy"],
  ["New vehicles", "Core goods", [0.0, 0.1, -0.2, -0.3, 0.0, 0.1, 0.3], 0.6, false, "Commodities less food and energy"],
  ["Used cars and trucks", "Core goods", [-0.4, -0.4, 0.0, 0.1, -0.2, 0.4, 0.4], -2.3, false, "Commodities less food and energy"],
  ["Apparel", "Core goods", [1.3, 1.0, 0.6, 0.3, -0.6, 0.1, 0.0], 3.6, false, "Commodities less food and energy"],
  ["Medical care commodities", "Core goods", [0.0, -1.0, -0.4, -0.7, -0.2, -0.6, -0.2], -2.7, true, "Commodities less food and energy"],
  ["Services less energy services", "Core services", [0.3, 0.2, 0.5, 0.3, 0.0, 0.2, 0.3], 3.0, false, "All items less food and energy"],
  ["Shelter", "Core services", [0.2, 0.3, 0.6, 0.3, 0.1, 0.1, 0.3], 3.0, false, "Services less energy services"],
  ["Transportation services", "Core services", [0.2, 0.6, 0.3, -0.6, -0.3, 0.3, 0.5], 2.4, false, "Services less energy services"],
  ["Medical care services", "Core services", [0.6, 0.0, 0.0, 0.5, -0.1, 0.6, -0.2], 2.5, false, "Services less energy services"],
];

const accounts = [
  ["Real GDP", "Output", 1.5, 1.5, 2.2, "Percent change, SAAR, 2026:Q1 to 2026:Q2"],
  ["Current-dollar GDP", "Output", 7.9, 8.0, 8.5, "Percent change, SAAR, 2026:Q1 to 2026:Q2"],
  ["Real final sales to private domestic purchasers", "Demand", 3.9, 4.2, 4.6, "Consumer spending plus gross private fixed investment"],
  ["Real GDI", "Income", null, 2.2, 2.6, "Not in the advance estimate"],
  ["Average of real GDP and real GDI", "Income", null, 1.8, 2.4, "Not in the advance estimate"],
  ["Gross domestic purchases price index", "Prices", 5.7, 5.8, 5.6, "Percent change, SAAR"],
  ["PCE price index", "Prices", 5.1, 5.3, 5.0, "Percent change, SAAR"],
  ["PCE price index excluding food and energy", "Prices", 3.4, 3.6, 3.3, "Percent change, SAAR"],
];

const q1Revisions = [
  ["Real GDP", 2.1, 2.5],
  ["Current-dollar GDP", 5.8, 5.8],
  ["Real final sales to private domestic purchasers", 1.7, 1.8],
  ["Real GDI", 1.2, 2.5],
  ["Average of real GDP and real GDI", 1.7, 2.5],
  ["Gross domestic purchases price index", 3.6, 3.2],
  ["PCE price index", 4.6, 4.2],
  ["PCE price index excluding food and energy", 4.4, 3.9],
];

const augustIndustry = [
  ["Total nonfarm", "Total", null, -70, 31, 21, 162],
  ["Goods-producing", "Goods", "Total nonfarm", -35, 14, 29, 41],
  ["Mining and logging", "Goods", "Goods-producing", -3, -2, -3, 3],
  ["Construction", "Goods", "Goods-producing", -22, 3, 18, 22],
  ["Manufacturing", "Goods", "Goods-producing", -10, 13, 14, 16],
  ["Durable goods", "Goods", "Manufacturing", -15, 13, 24, 15],
  ["Transportation and warehousing", "Services", "Total nonfarm", -1, -19, 5, -23],
  ["Health care and social assistance", "Services", "Total nonfarm", 22.8, 38.6, 13.1, 28.4],
  ["Leisure and hospitality", "Services", "Total nonfarm", 22, -54, -21, 62],
];

const septemberLabor = [
  ["Unemployment rate, U-3", "Rates", 4.4, 4.1, 4.2, 0.1, null, "percent"],
  ["Unemployment rate, U-6", "Rates", 8.1, 7.7, 7.6, -0.1, null, "percent"],
  ["Labor force participation rate", "Rates", null, null, 61.8, 0.2, null, "percent"],
  ["Employment-population ratio", "Rates", null, null, 59.2, 0.1, null, "percent"],
  ["Nonfarm payroll employment", "Levels", null, null, 159.04, null, 29, "millions"],
  ["Private payroll employment", "Levels", null, null, 135.72, null, 46, "millions"],
  ["Government payroll employment", "Levels", null, null, 23.33, null, -17, "millions"],
];

const industryValueAdded = [
  ["Private services-producing industries", 2.5, "Real value added, Q2 2026 SAAR"],
  ["Private goods-producing industries", 2.3, "Real value added, Q2 2026 SAAR"],
  ["Government", 0.0, "BEA reported an increase of less than 0.1 percent"],
  ["Real gross output, total", 5.0, "Q2 2026 SAAR"],
  ["Real gross output, private services", 6.0, "Q2 2026 SAAR"],
  ["Real gross output, private goods", 3.0, "Q2 2026 SAAR"],
  ["Real gross output, government", 2.6, "Q2 2026 SAAR"],
];

const releases = [
  ["2026-09-11", "Consumer Price Index", "August 2026", "BLS", "Published"],
  ["2026-09-16", "FOMC rate decision", "September 15–16 meeting", "Federal Reserve", "Published"],
  ["2026-09-30", "GDP, third estimate", "2026 Q2", "BEA", "Published"],
  ["2026-10-02", "Employment Situation", "September 2026", "BLS", "Published"],
  ["2026-10-06", "Monthly trade update", "August 2026", "BEA", "Scheduled"],
  ["2026-10-14", "Consumer Price Index", "September 2026", "BLS", "Scheduled"],
  ["2026-10-15", "Producer Price Index", "September 2026", "BLS", "Scheduled"],
  ["2026-10-15", "Advance retail sales", "September 2026", "Census Bureau", "Scheduled"],
  ["2026-10-20", "State employment and unemployment", "September 2026", "BLS", "Scheduled"],
  ["2026-10-28", "FOMC rate decision", "October 27–28 meeting", "Federal Reserve", "Scheduled"],
  ["2026-10-29", "GDP, advance estimate", "2026 Q3", "BEA", "Scheduled"],
  ["2026-10-29", "Personal income and outlays", "September 2026", "BEA", "Scheduled"],
];

const regions = [
  ["New York", "Real GDP", 4.0, "Fastest state, 2026 Q2. Finance and insurance led."],
  ["West Virginia", "Real GDP", -2.3, "Slowest state, 2026 Q2. Mining led the decline."],
  ["Wyoming", "Real GDP", null, "Mining also led the decline. The rate was not quoted."],
  ["Delaware", "Real GDP", null, "Finance and insurance led, with New York."],
  ["Wisconsin", "Personal income", 6.4, "Fastest state, 2026 Q2, current-dollar SAAR."],
  ["North Dakota", "Personal income", -4.2, "Only decline among states, 2026 Q2."],
  ["Minnesota", "Earnings", 7.3, "Fastest earnings growth, 2026 Q2."],
  ["North Dakota", "Earnings", -9.3, "Sharpest earnings decline, 2026 Q2."],
  ["Wisconsin", "Transfer receipts", 13.0, "Fastest increase, 2026 Q2."],
  ["Oregon", "Transfer receipts", -3.9, "Decline in personal current transfer receipts."],
  ["Tennessee", "Property income", 5.1, "Fastest dividends, interest, and rent, 2026 Q2."],
  ["Iowa", "Property income", 3.3, "Slowest property-income increase; every state rose."],
  ["Florida", "PCE, 2025", 7.0, "Fastest 2025 current-dollar PCE growth."],
  ["California", "PCE, 2025", 4.2, "Slowest 2025 current-dollar PCE growth. All states rose."],
];

function priceRows() {
  const rows = cpi.map(([series, basket, months, year, unadjusted, parentName]) => {
    const row = {
      series,
      basket,
      year,
      parentName,
      adjustment: unadjusted ? "Not seasonally adjusted" : "Seasonally adjusted",
      spark: months,
      source: "BLS CPI-U, August 2026",
    };
    cpiMonths.forEach((month, index) => {
      row[month] = months[index];
    });
    row.augChange = round(months[6] - months[5], 1);
    return row;
  });
  return outline(rows);
}

function accountRows() {
  const rows = accounts.map(([series, group, advance, second, third, note]) => ({
    series,
    group,
    advance,
    second,
    third,
    revision: third == null || second == null ? null : round(third - second, 1),
    note,
    kind: "Published",
    source: "BEA, September 30, 2026",
  }));
  const gdp = rows.find((row) => row.series === "Real GDP");
  const gdi = rows.find((row) => row.series === "Real GDI");
  const pce = rows.find((row) => row.series === "PCE price index");
  const core = rows.find((row) => row.series === "PCE price index excluding food and energy");
  rows.push(spreadRow("Real GDP minus real GDI", gdp, gdi, "Derived from the published real GDP and real GDI growth rates. Not a BEA series."));
  rows.push(spreadRow("PCE price index minus core PCE", pce, core, "Derived from the published PCE and core PCE rates. Not a BEA series."));
  return rows;
}

function spreadRow(series, left, right, note) {
  const advance = diffOrNull(left.advance, right.advance);
  const second = diffOrNull(left.second, right.second);
  const third = diffOrNull(left.third, right.third);
  return {
    series,
    group: "Derived",
    advance,
    second,
    third,
    revision: second == null || third == null ? null : round(third - second, 1),
    note,
    kind: "Derived",
    expression: `${left.series} − ${right.series}`,
    source: "Calculated on this board",
  };
}

function revisionRows() {
  return q1Revisions.map(([series, previous, revised]) => ({
    series,
    previous,
    revised,
    revision: round(revised - previous, 1),
    period: "2026 Q1",
    source: "BEA annual update, September 30, 2026",
  }));
}

function laborRows() {
  return septemberLabor.map(([series, group, yearAgo, previous, latest, points, thousands, unit]) => ({
    series,
    group,
    yearAgo,
    previous,
    latest,
    points,
    thousands,
    unit,
    period: "September 2026",
    source: "BLS Employment Situation, October 2, 2026",
  }));
}

function industryRows() {
  const rows = augustIndustry.map(([series, group, parentName, aug2025, jun, jul, aug]) => ({
    series,
    group,
    parentName,
    aug2025,
    jun,
    jul,
    aug,
    twoMonth: round(jul + aug, 1),
    period: "Over-the-month change, thousands",
    source: "BLS Employment Situation, August 2026",
  }));
  return outline(rows);
}

function stateRows() {
  return states.map((row) => ({
    ...row,
    privateApprox: round(row.total - row.government, 1),
    goods: round(row.miningLogging + row.construction + row.manufacturing, 1),
    period: "July 2026",
    unit: "Thousands of jobs, seasonally adjusted",
    source: "BLS industry employment by state, July 2026",
  }));
}

function regionRows() {
  return regions.map(([state, measure, value, note]) => ({
    state,
    measure,
    value,
    note,
    source: "BEA, September 30, 2026",
  }));
}

function releaseRows() {
  return releases.map(([date, release, period, agency, status]) => ({
    date,
    release,
    period,
    agency,
    status,
  }));
}

function ledgerRows() {
  const rows = [];
  for (const row of laborRows()) {
    rows.push({
      domain: "Labor",
      series: row.series,
      period: row.period,
      reading: formatReading(row.latest, row.unit),
      value: row.latest,
      change: row.points == null ? row.thousands : row.points,
      source: row.source,
      note: row.yearAgo == null ? "" : `September 2025 was ${formatReading(row.yearAgo, row.unit)}.`,
      drill: "labor",
      drillQuery: row.series,
    });
  }
  rows.push({
    domain: "Labor",
    series: "Average hourly earnings, all private employees",
    period: "September 2025 to September 2026",
    reading: "3.02%",
    value: 3.02,
    change: null,
    source: "BLS / Joint Economic Committee employment update",
    note: "Average weekly earnings rose 3.63 percent over the same year.",
  });
  rows.push({
    domain: "Labor",
    series: "Nonfarm payroll change",
    period: "September 2026",
    reading: "+29 thousand",
    value: 29,
    change: null,
    source: "BLS Employment Situation, October 2, 2026",
    note: "Private payrolls rose 46 thousand and government payrolls fell 17 thousand.",
  });
  for (const row of accountRows()) {
    rows.push({
      domain: "Output",
      series: row.series,
      period: "2026 Q2, third estimate",
      reading: row.third == null ? "—" : `${row.third}% SAAR`,
      value: row.third,
      change: row.revision,
      source: row.source,
      note: row.note,
      drill: "accounts",
      drillQuery: row.series,
    });
  }
  for (const row of industryValueAdded) {
    rows.push({
      domain: "Output",
      series: row[0],
      period: "2026 Q2",
      reading: `${row[1]}% SAAR`,
      value: row[1],
      change: null,
      source: "BEA GDP by industry, September 30, 2026",
      note: row[2],
    });
  }
  rows.push({
    domain: "Output",
    series: "Corporate profits from current production",
    period: "2026 Q2",
    reading: "+$384.0 billion",
    value: 384,
    change: -16.9,
    source: "BEA, September 30, 2026",
    note: "Revised down $16.9 billion from the previous estimate.",
  });
  rows.push({
    domain: "Income",
    series: "Personal income",
    period: "2026 Q2",
    reading: "+$314.3 billion",
    value: 314.3,
    change: 4.7,
    source: "BEA, September 30, 2026",
    note: "Current-dollar personal income increased 4.7 percent at an annual rate. It rose in 49 states and the District of Columbia.",
  });
  for (const row of priceRows()) {
    rows.push({
      domain: "Prices",
      series: `CPI-U, ${row.series}`,
      period: "August 2026",
      reading: `${row.aug}% month / ${row.year}% year`,
      value: row.year,
      change: row.aug,
      source: row.source,
      note: row.adjustment,
      drill: "prices",
      drillQuery: row.series,
    });
  }
  rows.push({
    domain: "Policy",
    series: "Federal funds target range",
    period: "September 16, 2026",
    reading: "3.75–4.00%",
    value: 3.75,
    change: 0.25,
    source: "FOMC, September 16, 2026",
    note: "The target range was raised 25 basis points. The next decision is October 28.",
    drill: "releases",
    drillQuery: "FOMC",
  });
  return rows;
}

function compoundRows() {
  return priceRows().map((row) => {
    const sevenMonth = compound(row.spark);
    return {
      series: row.series,
      basket: row.basket,
      depth: row.depth,
      parent: row.parent,
      id: row.id,
      sevenMonth,
      year: row.year,
      gap: round(row.year - sevenMonth, 2),
      spark: row.spark,
      expression: "compound(Feb..Aug) compared with the published 12-month change",
      note: "The seven-month compound uses only the published February–August monthly percent changes. It is not the official 12-month index.",
      kind: "Derived",
      source: row.source,
    };
  });
}

function identityRows() {
  const privatePlusGovernment = round(135.72 + 23.33, 2);
  const payrollGap = round(159.04 - privatePlusGovernment, 2);
  return [
    identity("Nonfarm payroll employment", "Published", 159.04, "millions", "September 2026 level.", "BLS Employment Situation, October 2, 2026"),
    identity("Private payroll employment", "Published", 135.72, "millions", "September 2026 level.", "BLS Employment Situation, October 2, 2026"),
    identity("Government payroll employment", "Published", 23.33, "millions", "September 2026 level.", "BLS Employment Situation, October 2, 2026"),
    identity("Private plus government", "Sum", privatePlusGovernment, "millions", "135.72 + 23.33, from the published rounded levels.", "Calculated on this board", "135.72 + 23.33"),
    identity("Published nonfarm minus that sum", "Difference", payrollGap, "millions", "The published rounded levels do not add to the published total.", "Calculated on this board", "159.04 - (135.72 + 23.33)"),
    identity("Real GDP", "Published", 2.2, "percent, SAAR", "2026 Q2 third estimate.", "BEA, September 30, 2026"),
    identity("Real GDI", "Published", 2.6, "percent, SAAR", "2026 Q2 third estimate.", "BEA, September 30, 2026"),
    identity("Real GDP minus real GDI", "Difference", round(2.2 - 2.6, 1), "percentage points", "Derived from the two published growth rates.", "Calculated on this board", "2.2 - 2.6"),
    identity("PCE price index", "Published", 5.0, "percent, SAAR", "2026 Q2 third estimate.", "BEA, September 30, 2026"),
    identity("Core PCE price index", "Published", 3.3, "percent, SAAR", "2026 Q2 third estimate.", "BEA, September 30, 2026"),
    identity("PCE minus core PCE", "Difference", round(5.0 - 3.3, 1), "percentage points", "The third-estimate spread. Advance and second estimates were also 1.7 points.", "Calculated on this board", "5.0 - 3.3"),
    identity("Federal funds floor", "Published", 3.75, "percent", "Lower end of the target range after September 16.", "FOMC, September 16, 2026"),
    identity("Federal funds ceiling", "Published", 4.0, "percent", "Upper end of the same target range.", "FOMC, September 16, 2026"),
    identity("Target-range width", "Difference", 0.25, "percentage points", "4.00 − 3.75. The September move was also 25 basis points.", "Calculated on this board", "4.00 - 3.75"),
    ...payrollThousandIdentities(),
  ];
}

function payrollThousandIdentities() {
  const levels = payrollLevels();
  const added = round(levels.privateJobs.saSep + levels.government.saSep, 1);
  const gap = round(levels.nonfarm.saSep - added, 1);
  return [
    identity("Nonfarm payrolls, Table B-1", "Published", levels.nonfarm.saSep, "thousands", "September 2026 level, seasonally adjusted.", "BLS Table B-1, October 2, 2026"),
    identity("Private payrolls, Table B-1", "Published", levels.privateJobs.saSep, "thousands", "September 2026 level, seasonally adjusted.", "BLS Table B-1, October 2, 2026"),
    identity("Government payrolls, Table B-1", "Published", levels.government.saSep, "thousands", "September 2026 level, seasonally adjusted.", "BLS Table B-1, October 2, 2026"),
    identity("Private plus government, Table B-1", "Sum", added, "thousands", "The published thousand levels, added here.", "Calculated on this board", levels.privateJobs.saSep + " + " + levels.government.saSep),
    identity("Nonfarm minus that thousand sum", "Difference", gap, "thousands", "In thousands the published levels add. The 0.01 million gap above is from the rounded million levels.", "Calculated on this board", levels.nonfarm.saSep + " - (" + levels.privateJobs.saSep + " + " + levels.government.saSep + ")"),
  ];
}

function identity(line, kind, value, unit, note, source, expression = "") {
  return { line, kind, value, unit, note, source, expression };
}

const shareFields = [
  ["total", "Total nonfarm", "Published"],
  ["miningLogging", "Mining and logging", "Published"],
  ["construction", "Construction", "Published"],
  ["manufacturing", "Manufacturing", "Published"],
  ["trade", "Trade, transportation, and utilities", "Published"],
  ["information", "Information", "Published"],
  ["financial", "Financial activities", "Published"],
  ["professional", "Professional and business services", "Published"],
  ["educationHealth", "Education and health services", "Published"],
  ["leisure", "Leisure and hospitality", "Published"],
  ["other", "Other services", "Published"],
  ["government", "Government", "Published"],
];

const shareParts = ["miningLogging", "construction", "manufacturing", "trade", "information", "financial", "professional", "educationHealth", "leisure", "other", "government"];

function shareRows() {
  const jobs = stateRows();
  const subset = {};
  for (const [key] of shareFields) {
    subset[key] = jobs.reduce((sum, row) => sum + row[key], 0);
  }
  const rows = [];
  for (const state of jobs) {
    const transcribed = shareParts.reduce((sum, key) => sum + state[key], 0);
    const residual = round(state.total - transcribed, 1);
    const fields = [...shareFields, ["residual", "Total minus transcribed supersectors", "Derived gap"]];
    for (const [key, sector, kind] of fields) {
      const level = key === "residual" ? residual : state[key];
      const sectorTotal = key === "residual"
        ? jobs.reduce((sum, row) => sum + round(row.total - shareParts.reduce((part, name) => part + row[name], 0), 1), 0)
        : subset[key];
      rows.push({
        state: state.state,
        region: state.region,
        sector,
        kind,
        jobs: level,
        shareOfState: round((level / state.total) * 100, 2),
        shareOfSector: sectorTotal ? round((level / sectorTotal) * 100, 2) : null,
        shareOfSubset: round((level / subset.total) * 100, 2),
        expression: kind === "Published" ? "level / published state total" : "state total − sum of transcribed supersectors",
        note: "Shares use only Alabama, Colorado, Georgia, Nevada, New Hampshire, New York, North Carolina, and Texas. They are not national shares.",
        source: "Calculated from BLS July 2026 state employment",
      });
    }
  }
  return rows;
}

function crosswalkRows() {
  const jobs = new Map(stateRows().map((row) => [row.state, row]));
  const extremes = new Map();
  for (const row of regionRows()) {
    if (!extremes.has(row.state)) {
      extremes.set(row.state, []);
    }
    extremes.get(row.state).push(row);
  }
  const names = [...new Set([...jobs.keys(), ...extremes.keys()])].sort((left, right) => left.localeCompare(right));
  return names.map((state) => {
    const job = jobs.get(state);
    const notes = extremes.get(state) || [];
    let linked = "BEA only";
    if (job && notes.length) {
      linked = "Jobs and BEA";
    } else if (job) {
      linked = "Jobs only";
    }
    return {
      state,
      region: job ? job.region : "",
      linked,
      jobs: job ? job.total : null,
      measures: notes.length,
      extremeList: notes.length
        ? notes.map((row) => (row.value == null ? `${row.measure}: not quoted` : `${row.measure}: ${row.value}`)).join("; ")
        : "—",
      source: "BLS July 2026 state jobs joined to BEA September 30 extremes",
    };
  });
}

function factRows() {
  const facts = [];
  const add = (sheet, series, field, value, unit, source) => {
    if (typeof value !== "number") {
      return;
    }
    facts.push({ sheet, series, field, value, unit, source, kind: "Published" });
  };
  for (const row of priceRows()) {
    for (const month of cpiMonths) {
      add("Prices", row.series, month, row[month], "monthly percent change", row.source);
    }
    add("Prices", row.series, "12 months", row.year, "12-month percent change", row.source);
  }
  for (const row of accounts) {
    add("Accounts", row[0], "advance", row[2], "percent, SAAR", "BEA, September 30, 2026");
    add("Accounts", row[0], "second", row[3], "percent, SAAR", "BEA, September 30, 2026");
    add("Accounts", row[0], "third", row[4], "percent, SAAR", "BEA, September 30, 2026");
  }
  for (const row of q1Revisions) {
    add("Q1 revisions", row[0], "previous", row[1], "percent", "BEA annual update, September 30, 2026");
    add("Q1 revisions", row[0], "revised", row[2], "percent", "BEA annual update, September 30, 2026");
  }
  for (const row of laborRows()) {
    add("September labor", row.series, "latest", row.latest, row.unit, row.source);
    add("September labor", row.series, "point change", row.points, "percentage points", row.source);
    add("September labor", row.series, "payroll change", row.thousands, "thousands", row.source);
  }
  for (const row of industryRows()) {
    for (const field of ["aug2025", "jun", "jul", "aug"]) {
      add("August payrolls", row.series, field, row[field], "thousands, over the month", row.source);
    }
  }
  for (const row of stateRows()) {
    for (const [key, label] of shareFields) {
      add("State jobs", row.state, label, row[key], "thousands, seasonally adjusted", row.source);
    }
  }
  for (const row of regionRows()) {
    add("State extremes", row.state, row.measure, row.value, "percent", row.source);
  }
  add("Ledger", "Corporate profits from current production", "change", 384, "billions of dollars", "BEA, September 30, 2026");
  add("Ledger", "Personal income", "change", 314.3, "billions of dollars", "BEA, September 30, 2026");
  add("Ledger", "Average hourly earnings", "12-month change", 3.02, "percent", "BLS / Joint Economic Committee employment update");
  add("Ledger", "Average weekly earnings", "12-month change", 3.63, "percent", "BLS / Joint Economic Committee employment update");
  for (const row of detailRows()) {
    add("CPI detail", row.series, "weight", row.weight, "relative importance, July 2026", row.source);
    add("CPI detail", row.series, "12 months", row.year, "12-month percent change", row.source);
    add("CPI detail", row.series, "August", row.aug, "seasonally adjusted monthly percent change", row.source);
    add("CPI detail", row.series, "effect", row.effect, "effect on all items", row.source);
  }
  for (const row of specialRows()) {
    add("CPI special", row.series, "12 months", row.year, "12-month percent change", row.source);
    add("CPI special", row.series, "August index", row.indexAug, "index, August 2026", row.source);
  }
  for (const row of areaRows()) {
    add("CPI places", row.area, "August from a year ago", row.augFromYear, "percent", row.source);
    add("CPI places", row.area, "July from a year ago", row.julFromYear, "percent", row.source);
  }
  for (const row of historyRows()) {
    add("CPI history", row.period, "CPI-U 12 months", row.cpiYear, "percent", row.source);
    add("CPI history", row.period, "CPI-U 1 month", row.cpiMonth, "percent, not seasonally adjusted", row.source);
  }
  for (const row of payrollRows()) {
    add("September industries", row.industry, "September", row.saSep, "thousands, seasonally adjusted", row.source);
    add("September industries", row.industry, "change", row.change, "thousands, over the month", row.source);
  }
  for (const row of underuseRows()) {
    add("Underutilization", row.code, "September", row.sep, "percent", row.source);
  }
  for (const row of spellRows()) {
    add("Jobless spells", row.series + " (" + row.unit + ")", "September", row.sep, row.unit, row.source);
  }
  return facts.map((fact, index) => ({ ...fact, id: `fact-${index}` }));
}

function outline(rows) {
  for (const row of rows) {
    row.id = slug(row.series);
    row.parent = row.parentName ? slug(row.parentName) : null;
  }
  const byId = new Map(rows.map((row) => [row.id, row]));
  for (const row of rows) {
    let depth = 0;
    let parent = row.parent;
    const seen = new Set();
    while (parent && byId.has(parent) && !seen.has(parent)) {
      seen.add(parent);
      depth += 1;
      parent = byId.get(parent).parent;
    }
    row.depth = depth;
  }
  return rows;
}

function diffOrNull(left, right) {
  if (left == null || right == null) {
    return null;
  }
  return round(left - right, 1);
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatReading(value, unit) {
  if (value == null) {
    return "—";
  }
  if (unit === "percent") {
    return `${value}%`;
  }
  return `${value.toLocaleString("en-US")} million`;
}

function round(value, digits) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

const num = (digits, heat = false) => ({ type: "number", digits, heat });

export const board = {
  defaultView: "ledger",
  views: [
    {
      id: "ledger",
      label: "Ledger",
      groupBy: "domain",
      columns: [
        { key: "domain", label: "Domain", group: "Series", frozen: true },
        { key: "series", label: "Series", group: "Series", frozen: true },
        { key: "period", label: "Period", group: "Series" },
        { key: "reading", label: "Reading", group: "Latest" },
        { key: "value", label: "Value", group: "Latest", ...num(2, true) },
        { key: "change", label: "Change", group: "Latest", ...num(2, true) },
        { key: "source", label: "Source", group: "Provenance" },
        { key: "note", label: "Note", group: "Provenance" },
      ],
      rows: ledgerRows(),
    },
    {
      id: "prices",
      label: "Prices",
      columns: [
        { key: "series", label: "CPI-U series", group: "Index", frozen: true },
        { key: "basket", label: "Basket", group: "Index" },
        { key: "adjustment", label: "Adjustment", group: "Index" },
        { key: "spark", label: "Feb–Aug", group: "Month", type: "spark" },
        ...["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((label, index) => ({
          key: cpiMonths[index],
          label,
          group: "Seasonally adjusted monthly change",
          ...num(1, true),
        })),
        { key: "year", label: "12 months", group: "Year", ...num(1, true) },
        { key: "augChange", label: "Aug minus Jul", group: "Year", ...num(1, true) },
      ],
      rows: priceRows(),
    },
    {
      id: "accounts",
      label: "Accounts",
      groupBy: "group",
      columns: [
        { key: "series", label: "Measure", group: "2026 Q2", frozen: true },
        { key: "group", label: "Group", group: "2026 Q2" },
        { key: "kind", label: "Kind", group: "2026 Q2" },
        { key: "advance", label: "Advance", group: "Estimate", ...num(1, true) },
        { key: "second", label: "Second", group: "Estimate", ...num(1, true) },
        { key: "third", label: "Third", group: "Estimate", ...num(1, true) },
        { key: "revision", label: "Third minus second", group: "Estimate", ...num(1, true) },
        { key: "note", label: "Note", group: "Estimate" },
      ],
      rows: accountRows(),
    },
    {
      id: "revisions",
      label: "Q1 revisions",
      columns: [
        { key: "series", label: "Measure", group: "2026 Q1", frozen: true },
        { key: "previous", label: "Previous", group: "Annual update", ...num(1, true) },
        { key: "revised", label: "Revised", group: "Annual update", ...num(1, true) },
        { key: "revision", label: "Revision", group: "Annual update", ...num(1, true) },
        { key: "source", label: "Source", group: "Annual update" },
      ],
      rows: revisionRows(),
    },
    {
      id: "labor",
      label: "September labor",
      groupBy: "group",
      columns: [
        { key: "series", label: "Series", group: "September 2026", frozen: true },
        { key: "group", label: "Group", group: "September 2026" },
        { key: "unit", label: "Unit", group: "September 2026" },
        { key: "yearAgo", label: "Sep 2025", group: "Level", ...num(2) },
        { key: "previous", label: "Aug 2026", group: "Level", ...num(2) },
        { key: "latest", label: "Sep 2026", group: "Level", ...num(2) },
        { key: "points", label: "Point change", group: "Change", ...num(1, true) },
        { key: "thousands", label: "Payroll change, thousands", group: "Change", ...num(0, true) },
      ],
      rows: laborRows(),
    },
    {
      id: "industry",
      label: "August payrolls",
      columns: [
        { key: "series", label: "Industry", group: "Change, thousands", frozen: true },
        { key: "group", label: "Group", group: "Change, thousands" },
        { key: "aug2025", label: "Aug 2025", group: "Month", ...num(1, true) },
        { key: "jun", label: "Jun 2026", group: "Month", ...num(1, true) },
        { key: "jul", label: "Jul 2026", group: "Month", ...num(1, true) },
        { key: "aug", label: "Aug 2026", group: "Month", ...num(1, true) },
        { key: "twoMonth", label: "Jul+Aug", group: "Month", ...num(1, true) },
      ],
      rows: industryRows(),
    },
    {
      id: "states",
      label: "State jobs",
      groupBy: "region",
      columns: [
        { key: "state", label: "State", group: "July 2026", frozen: true },
        { key: "region", label: "Region", group: "July 2026" },
        { key: "total", label: "Total nonfarm", group: "Employment", ...num(1) },
        { key: "privateApprox", label: "Total minus government", group: "Employment", ...num(1) },
        { key: "goods", label: "Mining, construction, manufacturing", group: "Goods", ...num(1) },
        { key: "miningLogging", label: "Mining and logging", group: "Goods", ...num(1) },
        { key: "construction", label: "Construction", group: "Goods", ...num(1) },
        { key: "manufacturing", label: "Manufacturing", group: "Goods", ...num(1) },
        { key: "trade", label: "Trade, transportation, utilities", group: "Services", ...num(1) },
        { key: "information", label: "Information", group: "Services", ...num(1) },
        { key: "financial", label: "Financial activities", group: "Services", ...num(1) },
        { key: "professional", label: "Professional and business", group: "Services", ...num(1) },
        { key: "educationHealth", label: "Education and health", group: "Services", ...num(1) },
        { key: "leisure", label: "Leisure and hospitality", group: "Services", ...num(1) },
        { key: "other", label: "Other services", group: "Services", ...num(1) },
        { key: "government", label: "Government", group: "Public", ...num(1) },
      ],
      rows: stateRows(),
    },
    {
      id: "regions",
      label: "State extremes",
      groupBy: "measure",
      columns: [
        { key: "state", label: "State", group: "BEA ranges", frozen: true },
        { key: "measure", label: "Measure", group: "BEA ranges" },
        { key: "value", label: "Percent", group: "BEA ranges", ...num(1, true) },
        { key: "note", label: "Note", group: "BEA ranges" },
      ],
      rows: regionRows(),
    },
    {
      id: "releases",
      label: "Calendar",
      groupBy: "status",
      columns: [
        { key: "date", label: "Date", group: "Release", frozen: true },
        { key: "release", label: "Release", group: "Release" },
        { key: "period", label: "Period", group: "Release" },
        { key: "agency", label: "Agency", group: "Release" },
        { key: "status", label: "Status", group: "Release" },
      ],
      rows: releaseRows(),
    },
    {
      id: "compound",
      label: "CPI compound",
      columns: [
        { key: "series", label: "CPI-U series", group: "Derived check", frozen: true },
        { key: "basket", label: "Basket", group: "Derived check" },
        { key: "kind", label: "Kind", group: "Derived check" },
        { key: "spark", label: "Feb–Aug", group: "Path", type: "spark" },
        { key: "sevenMonth", label: "Seven-month compound", group: "Path", ...num(2, true) },
        { key: "year", label: "Published 12 months", group: "Path", ...num(1, true) },
        { key: "gap", label: "12-month minus compound", group: "Path", ...num(2, true) },
        { key: "note", label: "Note", group: "Path" },
      ],
      rows: compoundRows(),
    },
    {
      id: "identity",
      label: "Identities",
      groupBy: "kind",
      columns: [
        { key: "line", label: "Line", group: "Reconciliation", frozen: true },
        { key: "kind", label: "Kind", group: "Reconciliation" },
        { key: "value", label: "Value", group: "Reconciliation", ...num(2, true) },
        { key: "unit", label: "Unit", group: "Reconciliation" },
        { key: "expression", label: "Expression", group: "Work" },
        { key: "note", label: "Note", group: "Work" },
        { key: "source", label: "Source", group: "Work" },
      ],
      rows: identityRows(),
    },
    {
      id: "shares",
      label: "State shares",
      groupBy: "state",
      columns: [
        { key: "state", label: "State", group: "Eight-state subset", frozen: true },
        { key: "region", label: "Region", group: "Eight-state subset" },
        { key: "sector", label: "Sector", group: "Eight-state subset" },
        { key: "kind", label: "Kind", group: "Eight-state subset" },
        { key: "jobs", label: "Jobs, thousands", group: "Level", ...num(1) },
        { key: "shareOfState", label: "Share of state", group: "Share", ...num(2), bar: true },
        { key: "shareOfSector", label: "Share of these states", group: "Share", ...num(2), bar: true },
        { key: "shareOfSubset", label: "Share of subset total", group: "Share", ...num(2), bar: true },
        { key: "note", label: "Note", group: "Share" },
      ],
      rows: shareRows(),
    },
    {
      id: "crosswalk",
      label: "Crosswalk",
      groupBy: "linked",
      columns: [
        { key: "state", label: "State", group: "Join", frozen: true },
        { key: "region", label: "Jobs region", group: "Join" },
        { key: "linked", label: "Link", group: "Join" },
        { key: "jobs", label: "July nonfarm, thousands", group: "Join", ...num(1) },
        { key: "measures", label: "BEA measures", group: "Join", ...num(0) },
        { key: "extremeList", label: "BEA extremes", group: "Join" },
      ],
      rows: crosswalkRows(),
    },
    {
      id: "facts",
      label: "Cell audit",
      groupBy: "sheet",
      columns: [
        { key: "sheet", label: "Sheet", group: "Published cell", frozen: true },
        { key: "series", label: "Series", group: "Published cell", frozen: true },
        { key: "field", label: "Field", group: "Published cell" },
        { key: "value", label: "Value", group: "Published cell", ...num(2, true) },
        { key: "unit", label: "Unit", group: "Published cell" },
        { key: "kind", label: "Kind", group: "Published cell" },
        { key: "source", label: "Source", group: "Published cell" },
      ],
      rows: factRows(),
    },
    {
      id: "detail",
      label: "CPI detail",
      groupBy: "basket",
      columns: [
        { key: "series", label: "Expenditure category", group: "August 2026 CPI-U", frozen: true },
        { key: "basket", label: "Basket", group: "August 2026 CPI-U" },
        { key: "weight", label: "Weight, July", group: "August 2026 CPI-U", ...num(3) },
        { key: "spark", label: "Jun–Aug", group: "Seasonally adjusted", type: "spark" },
        { key: "jun", label: "Jun", group: "Seasonally adjusted", ...num(1, true) },
        { key: "jul", label: "Jul", group: "Seasonally adjusted", ...num(1, true) },
        { key: "aug", label: "Aug", group: "Seasonally adjusted", ...num(1, true) },
        { key: "unadj", label: "Unadjusted month", group: "Seasonally adjusted", ...num(1, true) },
        { key: "year", label: "12 months", group: "Year", ...num(1, true) },
        { key: "effect", label: "Effect on all items", group: "Table 6", ...num(3, true) },
        { key: "rough", label: "Weight times Aug / 100", group: "Table 6", ...num(3, true) },
        { key: "effectGap", label: "Effect minus that product", group: "Table 6", ...num(3, true) },
        { key: "stderr", label: "Median price SE", group: "Table 6", ...num(2) },
        { key: "record", label: "Largest or smallest since", group: "Table 6" },
        { key: "recordChange", label: "That change", group: "Table 6", ...num(1, true) },
      ],
      rows: detailRows(),
    },
    {
      id: "special",
      label: "CPI special",
      columns: [
        { key: "series", label: "Special aggregate", group: "August 2026", frozen: true },
        { key: "weight", label: "Weight, July", group: "August 2026", ...num(3) },
        { key: "indexAug2025", label: "Index, Aug 2025", group: "Index", ...num(3) },
        { key: "indexJul", label: "Index, Jul 2026", group: "Index", ...num(3) },
        { key: "indexAug", label: "Index, Aug 2026", group: "Index", ...num(3) },
        { key: "indexChange", label: "Aug index minus Jul", group: "Index", ...num(3, true) },
        { key: "spark", label: "Jun–Aug", group: "Percent", type: "spark" },
        { key: "jun", label: "Jun", group: "Percent", ...num(1, true) },
        { key: "jul", label: "Jul", group: "Percent", ...num(1, true) },
        { key: "aug", label: "Aug", group: "Percent", ...num(1, true) },
        { key: "year", label: "12 months", group: "Percent", ...num(1, true) },
      ],
      rows: specialRows(),
    },
    {
      id: "places",
      label: "CPI places",
      groupBy: "kind",
      columns: [
        { key: "area", label: "Area", group: "All items", frozen: true },
        { key: "kind", label: "Kind", group: "All items" },
        { key: "cadence", label: "Pricing", group: "All items" },
        { key: "augFromYear", label: "Aug from Aug 2025", group: "To August 2026", ...num(1, true) },
        { key: "augFromJun", label: "Aug from Jun", group: "To August 2026", ...num(1, true) },
        { key: "augFromJul", label: "Aug from Jul", group: "To August 2026", ...num(1, true) },
        { key: "julFromYear", label: "Jul from Jul 2025", group: "To July 2026", ...num(1, true) },
        { key: "julFromMay", label: "Jul from May", group: "To July 2026", ...num(1, true) },
        { key: "julFromJun", label: "Jul from Jun", group: "To July 2026", ...num(1, true) },
      ],
      rows: areaRows(),
    },
    {
      id: "history",
      label: "CPI history",
      groupBy: "year",
      columns: [
        { key: "period", label: "Period", group: "All items, not seasonally adjusted", frozen: true },
        { key: "year", label: "Year", group: "All items, not seasonally adjusted", ...num(0) },
        { key: "cpiMonth", label: "CPI-U month", group: "One month", ...num(1, true) },
        { key: "chainedMonth", label: "C-CPI-U month", group: "One month", ...num(1, true) },
        { key: "gapMonth", label: "CPI-U minus C-CPI-U", group: "One month", ...num(1, true) },
        { key: "cpiYear", label: "CPI-U 12 months", group: "Twelve months", ...num(1, true) },
        { key: "chainedYear", label: "C-CPI-U 12 months", group: "Twelve months", ...num(1, true) },
        { key: "gapYear", label: "CPI-U minus C-CPI-U", group: "Twelve months", ...num(1, true) },
        { key: "note", label: "Note", group: "Twelve months" },
      ],
      rows: historyRows(),
    },
    {
      id: "weights",
      label: "CPI weights",
      groupBy: "kind",
      columns: [
        { key: "line", label: "Line", group: "Published weights and effects", frozen: true },
        { key: "kind", label: "Kind", group: "Published weights and effects" },
        { key: "value", label: "Value", group: "Published weights and effects", ...num(3, true) },
        { key: "expression", label: "Expression", group: "Work" },
        { key: "note", label: "Note", group: "Work" },
      ],
      rows: weightRows(),
    },
    {
      id: "payrolls",
      label: "September industries",
      columns: [
        { key: "industry", label: "Industry", group: "Table B-1", frozen: true },
        { key: "saYearAgo", label: "Sep 2025", group: "Level, thousands", ...num(1) },
        { key: "saJul", label: "Jul 2026", group: "Level, thousands", ...num(1) },
        { key: "saAug", label: "Aug 2026", group: "Level, thousands", ...num(1) },
        { key: "saSep", label: "Sep 2026", group: "Level, thousands", ...num(1) },
        { key: "change", label: "Published change", group: "Change", ...num(1, true) },
        { key: "monthGap", label: "Levels minus published change", group: "Change", ...num(1, true) },
        { key: "yearChange", label: "Sep minus Sep 2025", group: "Change", ...num(1, true) },
        { key: "yearPercent", label: "Percent from Sep 2025", group: "Change", ...num(2, true) },
      ],
      rows: payrollRows(),
    },
    {
      id: "underuse",
      label: "Underutilization",
      columns: [
        { key: "code", label: "Measure", group: "Table A-15", frozen: true },
        { key: "series", label: "Definition", group: "Table A-15" },
        { key: "spark", label: "Path", group: "Seasonally adjusted percent", type: "spark" },
        { key: "sep2025", label: "Sep 2025", group: "Seasonally adjusted percent", ...num(1) },
        { key: "may", label: "May", group: "Seasonally adjusted percent", ...num(1) },
        { key: "jun", label: "Jun", group: "Seasonally adjusted percent", ...num(1) },
        { key: "jul", label: "Jul", group: "Seasonally adjusted percent", ...num(1) },
        { key: "aug", label: "Aug", group: "Seasonally adjusted percent", ...num(1) },
        { key: "sep", label: "Sep 2026", group: "Seasonally adjusted percent", ...num(1) },
        { key: "points", label: "Sep minus Aug", group: "Seasonally adjusted percent", ...num(1, true) },
      ],
      rows: underuseRows(),
    },
    {
      id: "spells",
      label: "Jobless spells",
      groupBy: "unit",
      columns: [
        { key: "series", label: "Duration", group: "Table A-12", frozen: true },
        { key: "unit", label: "Unit", group: "Table A-12" },
        { key: "spark", label: "Path", group: "Seasonally adjusted", type: "spark" },
        { key: "sep2025", label: "Sep 2025", group: "Seasonally adjusted", ...num(1) },
        { key: "may", label: "May", group: "Seasonally adjusted", ...num(1) },
        { key: "jun", label: "Jun", group: "Seasonally adjusted", ...num(1) },
        { key: "jul", label: "Jul", group: "Seasonally adjusted", ...num(1) },
        { key: "aug", label: "Aug", group: "Seasonally adjusted", ...num(1) },
        { key: "sep", label: "Sep 2026", group: "Seasonally adjusted", ...num(1) },
        { key: "change", label: "Sep minus Aug", group: "Seasonally adjusted", ...num(1, true) },
      ],
      rows: spellRows(),
    },
  ],
};

const laneOf = {
  ledger: "Output",
  prices: "Prices",
  accounts: "Output",
  revisions: "Output",
  labor: "Labor",
  industry: "Labor",
  states: "Labor",
  regions: "Output",
  releases: "Output",
  compound: "Prices",
  identity: "Checks",
  shares: "Checks",
  crosswalk: "Checks",
  facts: "Checks",
  detail: "Prices",
  special: "Prices",
  places: "Prices",
  history: "Prices",
  weights: "Checks",
  payrolls: "Labor",
  underuse: "Labor",
  spells: "Labor",
};
for (const view of board.views) view.lane = laneOf[view.id];

export const summary = {
  unemployment: 4.2,
  payrollChange: 29,
  realGdp: 2.2,
  cpi: 3.4,
  fundsFloor: 3.75,
};
