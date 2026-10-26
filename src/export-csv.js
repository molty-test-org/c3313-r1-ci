const { buildReport } = require("./report");
function toCsv(text) {
  const r = buildReport(text);
  return "words,characters,lines\n" + r.words + "," + r.characters + "," + r.lines;
}
module.exports = { toCsv };
