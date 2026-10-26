const test = require("node:test");
const assert = require("node:assert");
const { countWords, slugify, truncate } = require("../src/words");
const { wordFrequencies, estimateReadingTime } = require("../src/words");

test("countWords counts whitespace-separated words", () => {
  assert.strictEqual(countWords("one two  three"), 3);
  assert.strictEqual(countWords("   "), 0);
});
test("wordFrequencies normalizes case and punctuation", () => {
  assert.deepStrictEqual(wordFrequencies("Hello, hello! WORLD. world?"), { hello: 2, world: 2 });
  assert.deepStrictEqual(wordFrequencies("one-two, one; two"), { one: 2, two: 2 });
});
test("wordFrequencies treats decomposed and precomposed accents as one word", () => {
  assert.deepStrictEqual(wordFrequencies("café cafe\u0301"), { café: 2 });
});
test("wordFrequencies returns an empty object for empty or punctuation-only text", () => {
  assert.deepStrictEqual(wordFrequencies(""), {});
  assert.deepStrictEqual(wordFrequencies("  !?  "), {});
});
test("estimateReadingTime returns minutes at 200 words per minute", () => {
  assert.strictEqual(estimateReadingTime(""), 0);
  assert.strictEqual(estimateReadingTime("   "), 0);
  assert.strictEqual(estimateReadingTime("one two"), 0.01);
  assert.strictEqual(estimateReadingTime(Array(200).fill("word").join(" ")), 1);
});
test("slugify makes a url slug", () => {
  assert.strictEqual(slugify("Hello, World!"), "hello-world");
});
test("truncate shortens with an ellipsis", () => {
  assert.strictEqual(truncate("abcdef", 4), "abc…");
  assert.strictEqual(truncate("abc", 4), "abc");
});
test("slugify returns an empty string for blank or punctuation-only text", () => {
  assert.strictEqual(slugify(""), "");
  assert.strictEqual(slugify("   \t "), "");
  assert.strictEqual(slugify("!?-.,"), "");
});
test("slugify lowercases and hyphenates words", () => {
  assert.strictEqual(slugify("  Stable Lower CASE  title 2 "), "stable-lower-case-title-2");
});
test("truncate returns text unchanged when its length equals max", () => {
  assert.strictEqual(truncate("abcd", 4), "abcd");
});
test("truncate adds one ellipsis that counts toward max", () => {
  assert.strictEqual(truncate("abcdef", 4), "abc…");
  assert.strictEqual(truncate("abcdef", 4).length, 4);
});
test("truncate returns short text unchanged", () => {
  assert.strictEqual(truncate("ab", 4), "ab");
  assert.strictEqual(truncate("", 4), "");
});
