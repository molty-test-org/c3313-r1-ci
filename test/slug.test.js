const test = require("node:test");
const assert = require("node:assert");
const { slugify } = require("../src/slug");

test("slugify lowercases and joins words with one hyphen", () => {
  assert.strictEqual(slugify("Hello, World!"), "hello-world");
  assert.strictEqual(slugify("  Stable Lower CASE  title 2 "), "stable-lower-case-title-2");
});

test("slugify collapses repeated punctuation into one hyphen", () => {
  assert.strictEqual(slugify("a---b...c!!!d"), "a-b-c-d");
  assert.strictEqual(slugify("one _ / \\ two"), "one-two");
});

test("slugify trims hyphens from both edges", () => {
  assert.strictEqual(slugify("--edge--"), "edge");
  assert.strictEqual(slugify("(  leading and trailing  )"), "leading-and-trailing");
});

test("slugify returns an empty string for blank or punctuation-only input", () => {
  assert.strictEqual(slugify(""), "");
  assert.strictEqual(slugify("   \t "), "");
  assert.strictEqual(slugify("!?-.,"), "");
});

test("slugify keeps only ASCII a-z and 0-9", () => {
  assert.strictEqual(slugify("café déjà vu"), "caf-d-j-vu");
  assert.strictEqual(slugify("日本語"), "");
});
