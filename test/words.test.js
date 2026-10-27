const test = require("node:test");
const assert = require("node:assert");
const { countWords, slugify, truncate } = require("../src/words");
const { wordFrequencies, estimateReadingTime, wrapText, reverseWords } = require("../src/words");

test("wrapText fits words exactly at the boundary", () => {
  assert.strictEqual(wrapText("one two six", 7), "one two\nsix");
  assert.strictEqual(wrapText("hi to", 5), "hi to");
});
test("wrapText keeps oversized words intact on their own lines", () => {
  assert.strictEqual(wrapText("a elephant b", 3), "a\nelephant\nb");
  assert.strictEqual(wrapText("elephant", 3), "elephant");
});
test("wrapText normalizes whitespace without trailing spaces", () => {
  const result = wrapText("  one   two\nthree  four  ", 7);
  assert.strictEqual(result, "one two\nthree\nfour");
  assert.ok(result.split("\n").every((line) => !line.endsWith(" ")));
  assert.strictEqual(wrapText(" \t\n ", 4), "");
  assert.strictEqual(wrapText("", 4), "");
});
test("wrapText requires a positive integer width", () => {
  for (const width of [0, -1, 2.5, NaN, "3"]) {
    assert.throws(() => wrapText("one two", width), RangeError);
  }
});
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
test("truncate returns a lone ellipsis for zero or negative max", () => {
  assert.strictEqual(truncate("abc", 0), "…");
  assert.strictEqual(truncate("abc", -1), "…");
  assert.strictEqual(truncate("", 0), "");
  assert.strictEqual(truncate("", -1), "…");
});
test("reverseWords reverses the order of words", () => {
  assert.strictEqual(reverseWords("one two three"), "three two one");
  assert.strictEqual(reverseWords("single"), "single");
});
test("reverseWords keeps punctuation and case within each word", () => {
  assert.strictEqual(reverseWords("Hello, World! ok."), "ok. World! Hello,");
  assert.strictEqual(reverseWords("don't STOP-now"), "STOP-now don't");
});
test("reverseWords normalizes mixed whitespace to single spaces", () => {
  assert.strictEqual(reverseWords("  one\t two\n\nthree  "), "three two one");
});
test("reverseWords returns empty text for blank input", () => {
  assert.strictEqual(reverseWords(""), "");
  assert.strictEqual(reverseWords(" \t\n "), "");
});
