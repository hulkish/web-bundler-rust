// A deterministic press run. The ten books in data/books.json stay hand-set.
// These volumes share that shape so the same rooms, tags, and API can hold them.

export var PRESS_COUNT = 4000;

var AUTHORS = [
  "Ivo Quire", "Nell Folio", "Seth Margin", "Brigid Spine", "Tomas Gather",
  "Lila Erratum", "Jonah Binding", "Mara Quire", "Owen Colophon", "Ruth Catchword",
  "Paul Imprint", "Cora Leaf", "Hugo Verso", "Ida Recto", "Felix Signature",
  "Nora Running", "Leo Head", "Willa Gather", "Ezra Colophon", "Thea Imprint",
  "Nils Quires", "Pia Leaf", "Otto Margin", "Freya Spine", "Casper Proof",
  "Ines Index", "Roland Ink", "Sable Paper", "Edith Catalog", "Victor Binding",
  "Mina Binding", "Karl Leaf", "Esther Verso", "Jonas Folio", "Greta Margin",
  "Anton Spine", "Clara Erratum", "Simon Gather", "Helen Quire", "Yves Paper",
];

var SHELVES = ["systems", "stories", "reference"];

var TAGS = [
  "bundling", "modules", "editions", "bindings", "compilers", "fiction",
  "names", "numbers", "servers", "http", "software", "orbits",
  "indexes", "paper", "ink", "proofs", "catalogs", "margins",
];

var ADJECTIVES = [
  "Quiet", "Narrow", "Second", "Late", "Open", "Folded", "Measured", "Spare",
  "Amber", "Low", "North", "Inner", "Slow", "Clear", "Third", "Warm",
];

var NOUNS = [
  "Ledger", "Gathering", "Margin", "Index", "Route", "Table", "Garden", "Press",
  "Binding", "Colophon", "Erratum", "Catchword", "Signature", "Quire", "Folio", "Proof",
];

var SERIES = [
  ["Quire", 24],
  ["Folio", 18],
  ["Colophon", 16],
  ["Errata", 14],
  ["Catchword", 12],
  ["Recto", 12],
  ["Verso", 10],
  ["Signature", 10],
];

var DESKS = [
  "North desk", "East carrel", "South window", "West stair", "Annex table", "Gallery ledge",
];

var OPENINGS = [
  "The first leaf names the stack before it names the story.",
  "A reader who starts here should keep a finger on the contents.",
  "The press set this opening in a narrower measure than the chapters that follow.",
  "Nothing in this opening depends on a later page.",
];

var CLOSINGS = [
  "The last line points back at the first, and then the book can close.",
  "What the margin promised is either here or marked missing.",
  "The copy on the shelf should meet this page without a new erratum.",
  "Tomorrow's reader inherits the same totals.",
];

function pad4(n) {
  var s = String(n);
  if (s.length >= 4) return s;
  return ("0000" + s).slice(-4);
}

function leafId(n) {
  return "leaf-" + pad4(n);
}

function isoFrom(year, monthIndex, dayOffset) {
  var utc = Date.UTC(year, monthIndex, 1) + dayOffset * 86400000;
  var d = new Date(utc);
  var y = d.getUTCFullYear();
  var m = d.getUTCMonth() + 1;
  var day = d.getUTCDate();
  var mm = m < 10 ? "0" + m : String(m);
  var dd = day < 10 ? "0" + day : String(day);
  return y + "-" + mm + "-" + dd;
}

function seriesSlots(count) {
  var slots = new Array(count);
  var cursor = 0;
  for (var s = 0; s < SERIES.length; s++) {
    var name = SERIES[s][0];
    var volumes = SERIES[s][1];
    for (var v = 1; v <= volumes; v++) {
      if (cursor >= count) return slots;
      slots[cursor] = { name: name, index: v };
      cursor++;
    }
  }
  return slots;
}

function build(count) {
  var slots = seriesSlots(count);
  var run = new Array(count);
  for (var n = 1; n <= count; n++) {
    var author = AUTHORS[(n - 1) % AUTHORS.length];
    var shelf = SHELVES[(n - 1) % SHELVES.length];
    var adjective = ADJECTIVES[(n * 5) % ADJECTIVES.length];
    var noun = NOUNS[(n * 7) % NOUNS.length];
    var title = adjective + " " + noun + " " + n;
    var tagA = TAGS[(n * 3) % TAGS.length];
    var tagB = TAGS[(n * 5 + 1) % TAGS.length];
    if (tagA === tagB) tagB = TAGS[(tagB.length + n) % TAGS.length];
    if (tagA === tagB) tagB = TAGS[(TAGS.indexOf(tagA) + 1) % TAGS.length];
    var previous = n === 1 ? count : n - 1;
    var next = n === count ? 1 : n + 1;
    var related = [leafId(previous), leafId(next)];
    if (n % 100 === 0) related.push("packing");
    var status = "shelf";
    var loan = null;
    var progress = "";
    if (n % 80 === 0) {
      status = "reading";
      progress = n % 160 === 0 ? "closing" : "opening";
    } else if (n % 80 === 1) {
      status = "lent";
      loan = { to: DESKS[n % DESKS.length], due: isoFrom(2026, 8, n % 180) };
    }
    var opening = OPENINGS[n % OPENINGS.length];
    var closing = CLOSINGS[n % CLOSINGS.length];
    run[n - 1] = {
      id: leafId(n),
      title: title,
      author: author,
      pages: 36 + ((n * 17) % 400),
      published: isoFrom(1998, 0, (n * 7) % 10000),
      shelf: shelf,
      tags: [tagA, tagB],
      series: slots[n - 1] || null,
      status: status,
      loan: loan,
      progress: progress,
      related: related,
      blurb: "A press copy of **" + title + "**, leaf " + n + " on the " + shelf + " stack.",
      chapters: [
        {
          id: "opening",
          title: "Opening",
          body: opening + "\n\n" + author + " files " + title + " as leaf " + n + ". The " + shelf + " stack keeps the copy next to " + leafId(previous) + ".",
        },
        {
          id: "closing",
          title: "Closing",
          body: closing + "\n\nLeaf " + n + " ends by naming " + leafId(next) + ". The page count stamped on the spine is the one the catalog repeats.",
        },
      ],
    };
  }
  return run;
}

export var pressRun = build(PRESS_COUNT);
