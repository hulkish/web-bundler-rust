import {
  allAuthors,
  allSeries,
  allShelves,
  allBooks,
  allTags,
  booksOnShelf,
  booksWithTag,
  compareBooks,
  findAuthor,
  findBook,
  findSeries,
  findShelf,
  noteIndex,
  readingDesk,
  shelfStats,
  timeline,
} from "../books/catalog.js";

function brief(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    authorSlug: book.authorSlug,
    shelf: book.shelfId,
    pages: book.pages,
    published: book.published,
    status: book.status,
    tags: book.tags,
    series: book.seriesSlug || null,
  };
}

export function apiResponse(path, params) {
  if (path === "/api/books") {
    return { status: 200, body: allBooks().map(brief) };
  }
  if (path === "/api/authors") {
    return {
      status: 200,
      body: allAuthors().map(function (author) {
        return {
          name: author.name,
          slug: author.slug,
          pages: author.pages,
          books: author.books.map(function (book) { return book.id; }),
        };
      }),
    };
  }
  if (path === "/api/shelves") {
    return { status: 200, body: allShelves() };
  }
  if (path === "/api/series") {
    return {
      status: 200,
      body: allSeries().map(function (series) {
        return {
          name: series.name,
          slug: series.slug,
          books: series.books.map(function (book) {
            return { id: book.id, index: book.seriesIndex, title: book.title };
          }),
        };
      }),
    };
  }
  if (path === "/api/tags") {
    return { status: 200, body: allTags() };
  }
  if (path === "/api/timeline") {
    return {
      status: 200,
      body: timeline().map(function (group) {
        return { year: group.year, books: group.books.map(brief) };
      }),
    };
  }
  if (path === "/api/reading") {
    const desk = readingDesk();
    return {
      status: 200,
      body: {
        reading: desk.reading.map(brief),
        lent: desk.lent.map(function (book) {
          return { id: book.id, title: book.title, loan: book.loan };
        }),
        shelf: desk.shelf.map(function (book) { return book.id; }),
      },
    };
  }
  if (path === "/api/stats") {
    const stats = shelfStats();
    return {
      status: 200,
      body: {
        books: stats.books,
        authors: stats.authors,
        shelves: stats.shelves,
        series: stats.series,
        tags: stats.tags,
        chapters: stats.chapters,
        pages: stats.pages,
        minutes: stats.minutes,
        reading: stats.reading,
        lent: stats.lent,
        oldest: brief(stats.oldest),
        newest: brief(stats.newest),
      },
    };
  }
  if (path === "/api/notes") {
    return {
      status: 200,
      body: noteIndex().map(function (note) {
        return {
          book: note.book.id,
          chapter: note.chapter.id,
          title: note.chapter.title,
          excerpt: note.excerpt,
        };
      }),
    };
  }
  if (path === "/api/compare") {
    const compared = compareBooks(params.get("a") || "", params.get("b") || "");
    if (!compared) return { status: 404, body: { error: "not found" } };
    return {
      status: 200,
      body: {
        left: brief(compared.left),
        right: brief(compared.right),
        sharedTags: compared.sharedTags,
        sameShelf: compared.sameShelf,
        sameAuthor: compared.sameAuthor,
        sameSeries: compared.sameSeries,
        pageGap: compared.pageGap,
        dayGap: compared.dayGap,
      },
    };
  }

  const book = /^\/api\/books\/([^/]+)$/.exec(path);
  if (book) {
    const found = findBook(decodeURIComponent(book[1]));
    if (!found) return { status: 404, body: { error: "not found" } };
    return { status: 200, body: found };
  }
  const author = /^\/api\/authors\/([^/]+)$/.exec(path);
  if (author) {
    const found = findAuthor(decodeURIComponent(author[1]));
    if (!found) return { status: 404, body: { error: "not found" } };
    return {
      status: 200,
      body: {
        name: found.name,
        slug: found.slug,
        pages: found.pages,
        books: found.books.map(brief),
      },
    };
  }
  const shelf = /^\/api\/shelves\/([^/]+)$/.exec(path);
  if (shelf) {
    const id = decodeURIComponent(shelf[1]);
    const found = findShelf(id);
    if (!found) return { status: 404, body: { error: "not found" } };
    return { status: 200, body: { shelf: found, books: booksOnShelf(id).map(brief) } };
  }
  const series = /^\/api\/series\/([^/]+)$/.exec(path);
  if (series) {
    const found = findSeries(decodeURIComponent(series[1]));
    if (!found) return { status: 404, body: { error: "not found" } };
    return { status: 200, body: { name: found.name, slug: found.slug, books: found.books.map(brief) } };
  }
  const tag = /^\/api\/tags\/([^/]+)$/.exec(path);
  if (tag) {
    const name = decodeURIComponent(tag[1]);
    const found = booksWithTag(name);
    if (!found) return { status: 404, body: { error: "not found" } };
    return { status: 200, body: { tag: name, books: found.map(brief) } };
  }
  return null;
}
