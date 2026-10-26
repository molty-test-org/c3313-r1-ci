const test = require("node:test");
const assert = require("node:assert");
const { countWords, slugify, truncate, titleCase } = require("../src/words");

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
test("titleCase capitalises the first character of each word", () => {
  assert.strictEqual(titleCase("hello world"), "Hello World");
});
test("titleCase leaves later capitals and mixed case unchanged", () => {
  assert.strictEqual(titleCase("hELLO wORLD"), "HELLO WORLD");
  assert.strictEqual(titleCase("iPhone case"), "IPhone Case");
});
test("titleCase keeps punctuation within words", () => {
  assert.strictEqual(titleCase("don't stop-now"), "Don't Stop-now");
  assert.strictEqual(titleCase("(hello) world!"), "(hello) World!");
});
test("titleCase preserves repeated and mixed whitespace", () => {
  assert.strictEqual(titleCase("one  two\tthree\nfour"), "One  Two\tThree\nFour");
});
test("titleCase returns empty input unchanged", () => {
  assert.strictEqual(titleCase(""), "");
});
