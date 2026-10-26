const test = require("node:test");
const assert = require("node:assert");
const { exportReportCsv } = require("../src/export-csv");

test("exports a header and one row", () => {
  assert.strictEqual(exportReportCsv("Hi. There!"), "wordCount,characterCount,sentenceCount\n2,10,2");
});

test("exports zeros for empty text", () => {
  assert.strictEqual(exportReportCsv(""), "wordCount,characterCount,sentenceCount\n0,0,0");
});
