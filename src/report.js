const { countWords } = require("./words");

function buildReport(text) {
  const value = String(text);
  return {
    words: countWords(value),
    characters: value.length,
    lines: value.split("\n").length,
  };
}

module.exports = { buildReport };
