function countWords(text) {
  const matches = String(text).match(/[A-Za-z0-9]+/g);
  return matches ? matches.length : 0;
}

module.exports = { countWords: countWords };
