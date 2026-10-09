import parseISO from "date-fns/parseISO/index.js";
import format from "date-fns/format/index.js";
import getYear from "date-fns/getYear/index.js";
import compareAsc from "date-fns/compareAsc/index.js";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays/index.js";
import { marked } from "marked";
import readingTime from "reading-time";
import slugify from "slugify";
import handBooks from "../data/books.json" with { type: "json" };
import shelves from "../data/shelves.json" with { type: "json" };
import { pressRun } from "./press.js";

const books = handBooks.concat(pressRun);
const rawByIdMap = Object.create(null);
for (let i = 0; i < books.length; i++) rawByIdMap[books[i].id] = books[i];
const presentedById = Object.create(null);
let presentedOrder = null;

function slug(value) {
  return slugify(String(value || ""), { lower: true, strict: true });
}

function shelfRecord(id) {
  for (let i = 0; i < shelves.length; i++) {
    if (shelves[i].id === id) return shelves[i];
  }
  return null;
}

function chapterView(book, chapter) {
  const body = chapter.body || "";
  return {
    id: chapter.id,
    title: chapter.title,
    body: body,
    href: "/books/" + book.id + "/" + chapter.id,
  };
}

function fillChapter(chapter) {
  if (!Object.prototype.hasOwnProperty.call(chapter, "html")) {
    chapter.html = marked.parse(chapter.body || "").trim();
  }
  return chapter;
}

export function present(book) {
  const shelf = shelfRecord(book.shelf);
  const chapters = (book.chapters || []).map(function (chapter) {
    return chapterView(book, chapter);
  });
  const full = [book.blurb].concat(chapters.map(function (chapter) {
    return chapter.title + "\n" + chapter.body;
  })).join("\n\n");
  const timing = readingTime(full);
  const published = parseISO(book.published);
  const series = book.series || null;
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    pages: book.pages,
    published: book.published,
    blurb: book.blurb,
    html: marked.parse(book.blurb).trim(),
    slug: slug(book.title),
    authorSlug: slug(book.author),
    shelfId: book.shelf,
    shelfTitle: shelf ? shelf.title : book.shelf,
    shelfBlurb: shelf ? shelf.blurb : "",
    tags: book.tags || [],
    seriesName: series ? series.name : "",
    seriesIndex: series ? series.index : 0,
    seriesSlug: series ? slug(series.name) : "",
    status: book.status || "shelf",
    loan: book.loan || null,
    progress: book.progress || "",
    related: book.related || [],
    chapters: chapters,
    publishedLabel: format(published, "d MMM yyyy"),
    year: getYear(published),
    daysOnShelf: differenceInCalendarDays(new Date(), published),
    reading: timing.text,
    minutes: Math.max(1, Math.round(timing.minutes)),
  };
}

function rawById(id) {
  return rawByIdMap[id] || null;
}

function presentCached(book) {
  if (!presentedById[book.id]) presentedById[book.id] = present(book);
  return presentedById[book.id];
}

export function allBooks() {
  if (!presentedOrder) {
    presentedOrder = books.map(presentCached).sort(function (left, right) {
      return compareAsc(parseISO(left.published), parseISO(right.published));
    });
  }
  return presentedOrder;
}

export function findBook(id) {
  const book = rawById(id);
  if (!book) return null;
  const view = presentCached(book);
  for (let i = 0; i < view.chapters.length; i++) fillChapter(view.chapters[i]);
  return view;
}

export function findChapter(bookId, chapterId) {
  const book = findBook(bookId);
  if (!book) return null;
  for (let i = 0; i < book.chapters.length; i++) {
    if (book.chapters[i].id === chapterId) {
      return { book: book, chapter: book.chapters[i], index: i };
    }
  }
  return null;
}

export function relatedBooks(book) {
  const found = [];
  for (let i = 0; i < book.related.length; i++) {
    const other = findBook(book.related[i]);
    if (other) found.push(other);
  }
  return found;
}

function haystack(book) {
  const chapters = (book.chapters || []).map(function (chapter) {
    return chapter.title + " " + chapter.body;
  }).join(" ");
  const tags = (book.tags || []).join(" ");
  const shelf = shelfRecord(book.shelf);
  return (
    book.title + " " + book.author + " " + book.blurb + " " + tags + " " +
    (shelf ? shelf.title + " " + shelf.blurb : "") + " " + chapters
  ).toLowerCase();
}

export function searchBooks(filters) {
  const needle = String(filters.query || "").trim().toLowerCase();
  const shelf = filters.shelf || "";
  const tag = filters.tag || "";
  const status = filters.status || "";
  const matched = books.filter(function (book) {
    if (shelf && book.shelf !== shelf) return false;
    if (tag && (book.tags || []).indexOf(tag) === -1) return false;
    if (status && (book.status || "shelf") !== status) return false;
    if (!needle) return true;
    return haystack(book).indexOf(needle) !== -1;
  });
  return matched.map(presentCached).sort(function (left, right) {
    return left.title < right.title ? -1 : left.title > right.title ? 1 : 0;
  });
}

export function allShelves() {
  return shelves.map(function (shelf) {
    const held = books.filter(function (book) { return book.shelf === shelf.id; });
    return {
      id: shelf.id,
      title: shelf.title,
      blurb: shelf.blurb,
      html: marked.parse(shelf.blurb).trim(),
      count: held.length,
      pages: held.reduce(function (sum, book) { return sum + book.pages; }, 0),
    };
  });
}

export function findShelf(id) {
  const shelvesView = allShelves();
  for (let i = 0; i < shelvesView.length; i++) {
    if (shelvesView[i].id === id) return shelvesView[i];
  }
  return null;
}

export function booksOnShelf(id) {
  return searchBooks({ shelf: id });
}

export function allTags() {
  const counts = Object.create(null);
  for (let i = 0; i < books.length; i++) {
    const tags = books[i].tags || [];
    for (let t = 0; t < tags.length; t++) {
      counts[tags[t]] = (counts[tags[t]] || 0) + 1;
    }
  }
  return Object.keys(counts).sort().map(function (tag) {
    return { tag: tag, count: counts[tag] };
  });
}

export function booksWithTag(tag) {
  const known = allTags().some(function (item) { return item.tag === tag; });
  if (!known) return null;
  return searchBooks({ tag: tag });
}

export function allAuthors() {
  const groups = Object.create(null);
  const order = [];
  const presented = allBooks();
  for (let i = 0; i < presented.length; i++) {
    const book = presented[i];
    if (!groups[book.authorSlug]) {
      groups[book.authorSlug] = {
        name: book.author,
        slug: book.authorSlug,
        books: [],
        pages: 0,
      };
      order.push(book.authorSlug);
    }
    groups[book.authorSlug].books.push(book);
    groups[book.authorSlug].pages += book.pages;
  }
  return order.map(function (key) { return groups[key]; }).sort(function (left, right) {
    return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
  });
}

export function findAuthor(authorSlug) {
  const authors = allAuthors();
  for (let i = 0; i < authors.length; i++) {
    if (authors[i].slug === authorSlug) return authors[i];
  }
  return null;
}

export function allSeries() {
  const groups = Object.create(null);
  const order = [];
  const presented = allBooks();
  for (let i = 0; i < presented.length; i++) {
    const book = presented[i];
    if (!book.seriesSlug) continue;
    if (!groups[book.seriesSlug]) {
      groups[book.seriesSlug] = {
        name: book.seriesName,
        slug: book.seriesSlug,
        books: [],
      };
      order.push(book.seriesSlug);
    }
    groups[book.seriesSlug].books.push(book);
  }
  return order.map(function (key) {
    const series = groups[key];
    series.books.sort(function (left, right) { return left.seriesIndex - right.seriesIndex; });
    return series;
  }).sort(function (left, right) {
    return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
  });
}

export function findSeries(seriesSlug) {
  const series = allSeries();
  for (let i = 0; i < series.length; i++) {
    if (series[i].slug === seriesSlug) return series[i];
  }
  return null;
}

export function timeline() {
  const presented = allBooks();
  const years = [];
  const index = Object.create(null);
  for (let i = 0; i < presented.length; i++) {
    const book = presented[i];
    if (index[book.year] === undefined) {
      index[book.year] = years.length;
      years.push({ year: book.year, books: [] });
    }
    years[index[book.year]].books.push(book);
  }
  years.sort(function (left, right) { return right.year - left.year; });
  return years;
}

export function readingDesk() {
  const presented = allBooks();
  return {
    reading: presented.filter(function (book) { return book.status === "reading"; }),
    lent: presented.filter(function (book) { return book.status === "lent"; }),
    shelf: presented.filter(function (book) { return book.status === "shelf"; }),
  };
}

export function noteIndex() {
  const notes = [];
  const presented = allBooks();
  for (let i = 0; i < presented.length; i++) {
    const book = presented[i];
    for (let c = 0; c < book.chapters.length; c++) {
      const chapter = book.chapters[c];
      const sentence = chapter.body.split("\n")[0];
      notes.push({
        book: book,
        chapter: chapter,
        excerpt: sentence,
      });
    }
  }
  return notes;
}

export function shelfStats() {
  const presented = allBooks();
  const pages = presented.reduce(function (sum, book) { return sum + book.pages; }, 0);
  const minutes = presented.reduce(function (sum, book) { return sum + book.minutes; }, 0);
  const desk = readingDesk();
  let oldest = presented[0];
  let newest = presented[0];
  for (let i = 1; i < presented.length; i++) {
    if (compareAsc(parseISO(presented[i].published), parseISO(oldest.published)) < 0) oldest = presented[i];
    if (compareAsc(parseISO(presented[i].published), parseISO(newest.published)) > 0) newest = presented[i];
  }
  return {
    books: presented.length,
    authors: allAuthors().length,
    shelves: allShelves().length,
    series: allSeries().length,
    tags: allTags().length,
    chapters: noteIndex().length,
    pages: pages,
    minutes: minutes,
    reading: desk.reading.length,
    lent: desk.lent.length,
    oldest: oldest,
    newest: newest,
  };
}

export function compareBooks(leftId, rightId) {
  const left = findBook(leftId);
  const right = findBook(rightId);
  if (!left || !right || left.id === right.id) return null;
  const sharedTags = left.tags.filter(function (tag) { return right.tags.indexOf(tag) !== -1; });
  const sameShelf = left.shelfId === right.shelfId;
  const sameAuthor = left.authorSlug === right.authorSlug;
  const sameSeries = left.seriesSlug && left.seriesSlug === right.seriesSlug;
  return {
    left: left,
    right: right,
    sharedTags: sharedTags,
    sameShelf: sameShelf,
    sameAuthor: sameAuthor,
    sameSeries: sameSeries,
    pageGap: Math.abs(left.pages - right.pages),
    dayGap: Math.abs(left.daysOnShelf - right.daysOnShelf),
  };
}

export function statusLabel(status) {
  if (status === "reading") return "Open on the desk";
  if (status === "lent") return "Out on loan";
  return "On the shelf";
}
