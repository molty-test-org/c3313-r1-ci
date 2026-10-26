const { countWords } = require("./words");

function countSentences(text) {
  return String(text).split(/[.!?]/).filter((span) => span.trim() !== "").length;
}

function buildReport(text) {
  return {
    wordCount: countWords(text),
    characterCount: String(text).length,
    sentenceCount: countSentences(text),
  };
}

module.exports = { buildReport };
