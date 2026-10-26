#!/usr/bin/env node
const fs = require("node:fs");
const { countWords, wordFrequencies, estimateReadingTime, slugify, truncate } = require("../src/words");

const [filePath, ...extra] = process.argv.slice(2);
if (!filePath || extra.length) {
  console.error("Usage: text-stats <file-path>");
  process.exitCode = 1;
} else {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    const firstLine = text.split(/\r?\n/, 1)[0];
    const report = {
      wordCount: countWords(text),
      wordFrequencies: wordFrequencies(text),
      readingTimeMinutes: estimateReadingTime(text),
      slug: slugify(firstLine),
      excerpt: truncate(firstLine, 80),
    };
    console.log(JSON.stringify(report));
  } catch (error) {
    console.error(`Cannot read file: ${filePath}`);
    process.exitCode = 1;
  }
}
