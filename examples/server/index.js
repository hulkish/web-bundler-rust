// Book shelf served by Node's http module.
// The bundler leaves "http" external. Pages use escape-html, marked, date-fns,
// slugify, and reading-time. mime-types sets the response Content-Type.
// Rooms: shelf, authors, stacks, series, tags, timeline, reading, compare,
// notes, map, about, and a JSON catalog under /api.
// Ten books are hand-set. books/press.js adds a run of 4,000.
import { createServer } from "http";
import { handle } from "./http/router.js";

const port = Number(process.env.PORT || 3000);
const server = createServer(handle);
server.listen(port, "127.0.0.1", function () {
  console.log("listening http://127.0.0.1:" + server.address().port);
});
