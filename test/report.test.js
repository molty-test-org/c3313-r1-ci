const test = require("node:test");
const assert = require("node:assert");
const { buildReport } = require("../src/report");

test("buildReport counts words, characters including spaces, and one line", () => {
  assert.deepStrictEqual(buildReport("one two  three"), { words: 3, characters: 14, lines: 1 });
});
test("buildReport gives one line and zero words for empty text", () => {
  assert.deepStrictEqual(buildReport(""), { words: 0, characters: 0, lines: 1 });
});
test("buildReport counts whitespace-only text as characters with zero words", () => {
  assert.deepStrictEqual(buildReport("   "), { words: 0, characters: 3, lines: 1 });
});
test("buildReport counts newline-separated segments as lines", () => {
  assert.deepStrictEqual(buildReport("one\ntwo words"), { words: 3, characters: 13, lines: 2 });
});
test("buildReport counts a trailing newline as an extra empty line", () => {
  assert.deepStrictEqual(buildReport("a\nb\n"), { words: 2, characters: 4, lines: 3 });
});
