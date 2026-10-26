const test = require("node:test");
const assert = require("node:assert");
const { buildReport } = require("../src/report");

test("buildReport counts words, characters and sentences in ordinary text", () => {
  assert.deepStrictEqual(buildReport("one two three"), { wordCount: 3, characterCount: 13, sentenceCount: 1 });
});

test("buildReport counts each nonempty span before . ! or ? as a sentence", () => {
  assert.deepStrictEqual(buildReport("Hello there. How are you? Fine!"), {
    wordCount: 6,
    characterCount: 31,
    sentenceCount: 3,
  });
});

test("buildReport counts a trailing nonempty span once", () => {
  assert.deepStrictEqual(buildReport("First one. second part"), { wordCount: 4, characterCount: 22, sentenceCount: 2 });
});

test("buildReport skips empty spans from repeated punctuation", () => {
  assert.strictEqual(buildReport("Wait... what?!").sentenceCount, 2);
});

test("buildReport returns zero counts for empty text", () => {
  assert.deepStrictEqual(buildReport(""), { wordCount: 0, characterCount: 0, sentenceCount: 0 });
});

test("buildReport counts whitespace-only text as no words or sentences but keeps its length", () => {
  assert.deepStrictEqual(buildReport(" \t "), { wordCount: 0, characterCount: 3, sentenceCount: 0 });
});

test("buildReport counts punctuation-only tokens as words, as countWords does", () => {
  assert.deepStrictEqual(buildReport(" . ! ? "), { wordCount: 3, characterCount: 7, sentenceCount: 0 });
});
