const { countWords } = require("./words");

// Non-string input is coerced with String(text): null becomes "null", 42 becomes "42".
// Values whose String() conversion throws count as empty text. buildReport never throws.
function toText(value) {
  try {
    return String(value);
  } catch {
    return "";
  }
}

function buildReport(text) {
  const value = toText(text);
  return {
    words: countWords(value),
    characters: value.length,
    lines: value.split("\n").length,
  };
}

module.exports = { buildReport };
