import cpiDetail from "./cpi-detail.json";
import cpiSpecial from "./cpi-special.json";
import cpiAreas from "./cpi-areas.json";
import cpiHistory from "./cpi-history.json";
import payrolls from "./payrolls.json";

const cpiSource = "BLS CPI news release, September 11, 2026";
const jobsSource = "BLS Employment Situation, October 2, 2026";

const baskets = [
  ["Food", "Food"],
  ["Energy", "Energy"],
  ["All items less food and energy", "Core"],
  ["Commodities less food and energy commodities", "Core goods"],
  ["Services less energy services", "Core services"],
];

const payrollRank = new Map([
  ["Total nonfarm", 0],
  ["Total private", 1],
  ["Government", 1],
  ["Goods-producing", 2],
  ["Private service-providing", 2],
  ["Federal", 2],
  ["State government", 2],
  ["Local government", 2],
  ["Mining and logging", 3],
  ["Construction", 3],
  ["Manufacturing", 3],
  ["Trade, transportation, and utilities", 3],
  ["Information", 3],
  ["Financial activities", 3],
  ["Professional and business services", 3],
  ["Private education and health services", 3],
  ["Leisure and hospitality", 3],
  ["Other services", 3],
  ["Durable goods", 4],
  ["Nondurable goods", 4],
  ["Wholesale trade", 4],
  ["Retail trade", 4],
  ["Transportation and warehousing", 4],
  ["Utilities", 4],
  ["Finance and insurance", 4],
  ["Real estate and rental and leasing", 4],
  ["Health care and social assistance", 4],
  ["Private educational services", 4],
  ["Accommodation and food services", 4],
  ["Arts, entertainment, and recreation", 4],
]);

const underuse = [
  ["U-1", "Unemployed 15 weeks or longer", 1.8, 1.8, 1.8, 1.7, 1.8, 1.8],
  ["U-2", "Job losers and people who completed temporary jobs", 2.1, 2.0, 1.9, 2.0, 1.9, 1.9],
  ["U-3", "Official unemployment rate", 4.4, 4.3, 4.2, 4.1, 4.1, 4.2],
  ["U-4", "U-3 plus discouraged workers", 4.7, 4.6, 4.5, 4.4, 4.4, 4.4],
  ["U-5", "U-4 plus other marginally attached", 5.4, 5.3, 5.2, 5.1, 5.1, 5.0],
  ["U-6", "U-5 plus part time for economic reasons", 8.1, 8.1, 7.9, 7.9, 7.7, 7.6],
];

const spells = [
  ["Less than 5 weeks", "People, thousands", 2232, 2210, 2182, 1960, 2000, 2098],
  ["5 to 14 weeks", "People, thousands", 2356, 1946, 1936, 2049, 2077, 1956],
  ["15 to 26 weeks", "People, thousands", 1286, 1077, 1052, 1157, 1147, 1189],
  ["27 weeks and over", "People, thousands", 1815, 1988, 1937, 1771, 1930, 1944],
  ["Average (mean) duration", "Weeks", 24.1, 26.0, 25.5, 24.9, 26.3, 24.8],
  ["Median duration", "Weeks", 10.1, 11.6, 11.0, 10.5, 11.4, 11.5],
  ["Less than 5 weeks", "Percent of unemployed", 29.0, 30.6, 30.7, 28.2, 28.0, 29.2],
  ["5 to 14 weeks", "Percent of unemployed", 30.6, 27.0, 27.2, 29.5, 29.0, 27.2],
  ["15 weeks and over", "Percent of unemployed", 40.3, 42.4, 42.1, 42.2, 43.0, 43.6],
  ["15 to 26 weeks", "Percent of unemployed", 16.7, 14.9, 14.8, 16.7, 16.0, 16.5],
  ["27 weeks and over", "Percent of unemployed", 23.6, 27.5, 27.3, 25.5, 27.0, 27.1],
];

function round(value, digits) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function published(name) {
  for (let i = 0; i < cpiDetail.length; i++) {
    if (cpiDetail[i].series === name) return cpiDetail[i];
  }
  return null;
}

export function detailRows() {
  let basket = "All items";
  return cpiDetail.map((row) => {
    for (let i = 0; i < baskets.length; i++) {
      if (row.series === baskets[i][0]) basket = baskets[i][1];
    }
    const rough = row.weight == null || row.aug == null ? null : round((row.weight * row.aug) / 100, 3);
    const effectGap = rough == null || row.effect == null ? null : round(row.effect - rough, 3);
    return {
      series: row.series,
      basket,
      footnotes: row.footnotes,
      weight: row.weight,
      year: row.year,
      unadj: row.unadj,
      jun: row.jun,
      jul: row.jul,
      aug: row.aug,
      spark: [row.jun, row.jul, row.aug],
      effect: row.effect,
      rough,
      effectGap,
      stderr: row.stderr,
      record: row.record,
      recordChange: row.recordChange,
      source: cpiSource + ", Tables 2 and 6",
    };
  });
}

export function specialRows() {
  return cpiSpecial.map((row) => ({
    series: row.series,
    footnotes: row.footnotes,
    weight: row.weight,
    indexAug2025: row.indexAug2025,
    indexJul: row.indexJul,
    indexAug: row.indexAug,
    indexChange: row.indexAug == null || row.indexJul == null ? null : round(row.indexAug - row.indexJul, 3),
    year: row.year,
    unadj: row.unadj,
    jun: row.jun,
    jul: row.jul,
    aug: row.aug,
    spark: [row.jun, row.jul, row.aug],
    source: cpiSource + ", Table 3",
  }));
}

export function areaRows() {
  return cpiAreas.map((row) => {
    let kind = "Region";
    if (row.area === "U.S. city average") kind = "Nation";
    else if (row.area.indexOf(",") !== -1 || row.area.indexOf("Urban ") === 0) kind = "Metro";
    let cadence = row.schedule;
    if (row.schedule === "M") cadence = "Monthly";
    if (row.schedule === "1") cadence = "Odd months";
    if (row.schedule === "2") cadence = "Even months";
    return {
      area: row.area,
      kind,
      cadence,
      footnotes: row.footnotes,
      augFromYear: row.augFromYear,
      augFromJun: row.augFromJun,
      augFromJul: row.augFromJul,
      julFromYear: row.julFromYear,
      julFromMay: row.julFromMay,
      julFromJun: row.julFromJun,
      source: cpiSource + ", Table 4",
    };
  });
}

export function historyRows() {
  return cpiHistory.map((row) => {
    const year = Number(String(row.period).slice(-4));
    return {
      period: row.period,
      year,
      chainedMonth: row.chainedMonth,
      cpiMonth: row.cpiMonth,
      gapMonth: row.chainedMonth == null || row.cpiMonth == null ? null : round(row.cpiMonth - row.chainedMonth, 1),
      chainedYear: row.chainedYear,
      cpiYear: row.cpiYear,
      gapYear: row.chainedYear == null || row.cpiYear == null ? null : round(row.cpiYear - row.chainedYear, 1),
      note: "Table 5 in this release text has no October 2025 row. That month is left blank rather than filled in.",
      source: cpiSource + ", Table 5",
    };
  });
}

function weightLine(line, kind, value, expression, note) {
  return {
    line,
    kind,
    value,
    expression,
    note,
    source: kind === "Published" ? cpiSource + ", Table 2" : "Calculated on this board",
  };
}

export function weightRows() {
  const foodHomeParts = [
    "Cereals and bakery products",
    "Meats, poultry, fish, and eggs",
    "Dairy and related products",
    "Fruits and vegetables",
    "Nonalcoholic beverages and beverage materials",
    "Other food at home",
  ];
  const foodHome = published("Food at home");
  const foodAway = published("Food away from home");
  const food = published("Food");
  const energy = published("Energy");
  const energyGoods = published("Energy commodities");
  const energyServices = published("Energy services");
  const core = published("All items less food and energy");
  const all = published("All items");
  const partSum = round(foodHomeParts.reduce((sum, name) => sum + published(name).weight, 0), 3);
  const foodSum = round(foodHome.weight + foodAway.weight, 3);
  const allSum = round(food.weight + energy.weight + core.weight, 3);
  const energySum = round(energyGoods.weight + energyServices.weight, 3);
  const effectSum = round(food.effect + energy.effect + core.effect, 3);
  const energyEffect = round(energyGoods.effect + energyServices.effect, 3);
  return [
    weightLine("Food at home", "Published", foodHome.weight, "", "Relative importance, July 2026."),
    weightLine("Sum of the six food-at-home groups", "Sum", partSum, foodHomeParts.join(" + "), "Published group weights, added here."),
    weightLine("Food at home minus that sum", "Difference", round(foodHome.weight - partSum, 3), "food at home − group sum", "A rounding gap in the published weights, not a missing group."),
    weightLine("Food", "Published", food.weight, "", "Relative importance, July 2026."),
    weightLine("Food at home plus food away from home", "Sum", foodSum, foodHome.weight + " + " + foodAway.weight, "The two published food weights."),
    weightLine("Food minus that sum", "Difference", round(food.weight - foodSum, 3), "food − (at home + away)", "Published weights, subtracted here."),
    weightLine("All items", "Published", all.weight, "", "The basket is 100."),
    weightLine("Food plus energy plus core", "Sum", allSum, "food + energy + all items less food and energy", "The three published top-level weights."),
    weightLine("100 minus that sum", "Difference", round(all.weight - allSum, 3), "100 − (food + energy + core)", "Published weights, subtracted here."),
    weightLine("Energy", "Published", energy.weight, "", "Relative importance, July 2026."),
    weightLine("Energy commodities plus energy services", "Sum", energySum, "commodities + services", "The two published energy weights."),
    weightLine("Energy minus that sum", "Difference", round(energy.weight - energySum, 3), "energy − (commodities + services)", "Published weights, subtracted here."),
    weightLine("All-items monthly change", "Published", all.aug, "", "Seasonally adjusted, July 2026 to August 2026. Table 6 prints no effect on this row."),
    weightLine("Food effect", "Published", food.effect, "", "Official seasonally adjusted effect on all items."),
    weightLine("Energy effect", "Published", energy.effect, "", "Official seasonally adjusted effect on all items."),
    weightLine("Core effect", "Published", core.effect, "", "Official seasonally adjusted effect on all items."),
    weightLine("Sum of those three effects", "Sum", effectSum, "food + energy + core effects", "Official effects, added here."),
    weightLine("All-items change minus that sum", "Difference", round(all.aug - effectSum, 3), "0.4 − effect sum", "The official effects are not required to add to the rounded percent change."),
    weightLine("Energy commodities effect plus energy services effect", "Sum", energyEffect, energyGoods.effect + " + " + energyServices.effect, "Official effects, added here."),
    weightLine("Energy effect minus that sum", "Difference", round(energy.effect - energyEffect, 3), "energy effect − part effects", "These two published effects add to the energy effect."),
  ];
}

export function payrollLevels() {
  let nonfarm = null;
  let privateJobs = null;
  let government = null;
  for (let i = 0; i < payrolls.length; i++) {
    if (payrolls[i].industry === "Total nonfarm") nonfarm = payrolls[i];
    if (payrolls[i].industry === "Total private") privateJobs = payrolls[i];
    if (payrolls[i].industry === "Government") government = payrolls[i];
  }
  return { nonfarm, privateJobs, government };
}

export function payrollRows() {
  const stack = [];
  const rows = payrolls.map((row) => {
    const rank = payrollRank.has(row.industry) ? payrollRank.get(row.industry) : 6;
    while (stack.length && stack[stack.length - 1].rank >= rank) stack.pop();
    const parentName = stack.length ? stack[stack.length - 1].name : null;
    stack.push({ rank, name: row.industry });
    const yearChange = round(row.saSep - row.saYearAgo, 1);
    return {
      series: row.industry,
      industry: row.industry,
      parentName,
      footnotes: row.footnotes,
      saYearAgo: row.saYearAgo,
      saJul: row.saJul,
      saAug: row.saAug,
      saSep: row.saSep,
      change: row.change,
      monthGap: round(row.saSep - row.saAug - row.change, 1),
      yearChange,
      yearPercent: row.saYearAgo === 0 ? null : round((yearChange / row.saYearAgo) * 100, 2),
      source: jobsSource + ", Table B-1, seasonally adjusted",
    };
  });
  return outlineIndustry(rows);
}

function outlineIndustry(rows) {
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

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function underuseRows() {
  return underuse.map(([code, series, sep2025, may, jun, jul, aug, sep]) => ({
    code,
    series,
    sep2025,
    may,
    jun,
    jul,
    aug,
    sep,
    points: round(sep - aug, 1),
    spark: [sep2025, may, jun, jul, aug, sep],
    source: jobsSource + ", Table A-15, seasonally adjusted",
  }));
}

export function spellRows() {
  return spells.map(([series, unit, sep2025, may, jun, jul, aug, sep]) => ({
    series,
    unit,
    sep2025,
    may,
    jun,
    jul,
    aug,
    sep,
    change: round(sep - aug, 1),
    spark: [sep2025, may, jun, jul, aug, sep],
    source: jobsSource + ", Table A-12, seasonally adjusted",
  }));
}
