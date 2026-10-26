const test = require("node:test");
const assert = require("node:assert");
const { countWords } = require("../src/words");
const { buildReport, toJson } = require("../src/report");

test("toJson reports words, characters and lines for ordinary text", () => {
  const text = "one two three";
  const parsed = JSON.parse(toJson(text));
  assert.deepStrictEqual(parsed, { words: countWords(text), characters: 13, lines: 1 });
});

test("empty input has zero words, zero characters and one line", () => {
  assert.deepStrictEqual(buildReport(""), { words: 0, characters: 0, lines: 1 });
  assert.deepStrictEqual(JSON.parse(toJson("")), { words: 0, characters: 0, lines: 1 });
});

test("whitespace-only input counts characters and lines but no words", () => {
  const text = "  \t ";
  const parsed = JSON.parse(toJson(text));
  assert.strictEqual(parsed.words, countWords(text));
  assert.strictEqual(parsed.words, 0);
  assert.strictEqual(parsed.characters, 4);
  assert.strictEqual(parsed.lines, 1);
});

test("multiline input counts newline-separated segments", () => {
  const text = "one two\nthree\n\nfour";
  const parsed = JSON.parse(toJson(text));
  assert.strictEqual(parsed.words, countWords(text));
  assert.strictEqual(parsed.words, 4);
  assert.strictEqual(parsed.characters, text.length);
  assert.strictEqual(parsed.lines, 4);
});

test("toJson returns a string holding only the report object", () => {
  const json = toJson("a b");
  assert.strictEqual(typeof json, "string");
  assert.deepStrictEqual(Object.keys(JSON.parse(json)), ["words", "characters", "lines"]);
});
