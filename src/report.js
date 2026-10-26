const { countWords } = require("./words");

function buildReport(text) {
  return {
    words: countWords(text),
    characters: text.length,
    lines: text.split("\n").length,
  };
}

function toJson(text) {
  return JSON.stringify(buildReport(text));
}

module.exports = { buildReport, toJson };
