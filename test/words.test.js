const test = require("node:test");
const assert = require("node:assert");
const { countWords, slugify, truncate } = require("../src/words");

test("countWords counts whitespace-separated words", () => {
  assert.strictEqual(countWords("one two  three"), 3);
  assert.strictEqual(countWords("   "), 0);
});
test("slugify makes a url slug", () => {
  assert.strictEqual(slugify("Hello, World!"), "hello-world");
});
test("truncate shortens with an ellipsis", () => {
  assert.strictEqual(truncate("abcdef", 4), "abc…");
  assert.strictEqual(truncate("abc", 4), "abc");
});
