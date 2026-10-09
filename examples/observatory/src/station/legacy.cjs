const path = require("path");

function base(value) {
  return String(value).split(path.sep).pop();
}

module.exports = {
  file: base(__filename),
  dir: base(__dirname),
  note: "plate-log",
};
