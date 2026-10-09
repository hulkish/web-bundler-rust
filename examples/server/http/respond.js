import { contentType } from "mime-types";

export function send(res, status, type, body) {
  const payload = Buffer.from(body);
  res.writeHead(status, {
    "content-type": type,
    "content-length": payload.length,
  });
  res.end(payload);
}

export function sendHTML(res, status, html) {
  send(res, status, contentType("html"), html);
}

export function sendJSON(res, status, value) {
  send(res, status, contentType("json"), JSON.stringify(value));
}
