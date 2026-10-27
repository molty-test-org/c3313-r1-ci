// Small text helpers the fixture app exposes.
function countWords(text) {
  const t = String(text).trim();
  return t === "" ? 0 : t.split(/\s+/).length;
}
function wordFrequencies(text) {
  const words = String(text).normalize("NFC").toLowerCase().match(/[\p{L}\p{N}\p{M}]+/gu) || [];
  const frequencies = new Map();
  for (const word of words) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }
  return Object.fromEntries(frequencies);
}
function estimateReadingTime(text) {
  return countWords(text) / 200;
}
function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function truncate(text, max) {
  const s = String(text);
  return s.length <= max ? s : s.slice(0, Math.max(0, max - 1)) + "…";
}
function wrapText(text, width) {
  if (!Number.isInteger(width) || width <= 0) {
    throw new RangeError("width must be a positive integer");
  }
  const words = String(text).trim().split(/\s+/);
  if (words[0] === "") return "";

  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = "";
    }
    line = line ? `${line} ${word}` : word;
  }
  lines.push(line);
  return lines.join("\n");
}
function reverseWords(text) {
  const t = String(text).trim();
  return t === "" ? "" : t.split(/\s+/).reverse().join(" ");
}
module.exports = { countWords, slugify, truncate, wordFrequencies, estimateReadingTime, wrapText, reverseWords };
