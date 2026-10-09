function base(value) {
  return String(value).split(/[/\\]/).pop();
}

module.exports = {
  file: base(__filename),
  dir: base(__dirname),
};
