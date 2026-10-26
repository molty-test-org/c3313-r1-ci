const test = require("node:test");
const assert = require("node:assert/strict");
const { mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const cli = path.join(__dirname, "../bin/text-stats.js");

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
}

function withFile(text, check) {
  const dir = mkdtempSync(path.join(tmpdir(), "text-stats-"));
  const file = path.join(dir, "input.txt");
  try {
    writeFileSync(file, text, "utf8");
    check(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("reports whole-file statistics with first-line slug and excerpt", () => {
  withFile("Hello, WORLD!\nhello world. More", (file) => {
    const result = run(file);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, "");
    assert.equal(result.stdout.trimEnd().split("\n").length, 1);
    assert.deepEqual(JSON.parse(result.stdout), {
      wordCount: 5,
      wordFrequencies: { hello: 2, world: 2, more: 1 },
      readingTimeMinutes: 0.025,
      slug: "hello-world",
      excerpt: "Hello, WORLD!",
    });
  });
});

test("truncates a long first line but counts the whole file", () => {
  const title = "Long TITLE ".repeat(8);
  withFile(`${title}\r\nbody`, (file) => {
    const report = JSON.parse(run(file).stdout);
    assert.equal(report.slug, "long-title-".repeat(8).slice(0, -1));
    assert.equal(report.excerpt, `${title.slice(0, 79)}…`);
    assert.equal(report.excerpt.length, 80);
    assert.equal(report.wordCount, 17);
  });
});

test("reports empty and blank first lines without borrowing later lines", () => {
  for (const [text, count, frequencies] of [["", 0, {}], ["\nOne two", 2, { one: 1, two: 1 }]]) {
    withFile(text, (file) => {
      const result = run(file);
      assert.equal(result.status, 0);
      assert.equal(result.stderr, "");
      assert.deepEqual(JSON.parse(result.stdout), {
        wordCount: count,
        wordFrequencies: frequencies,
        readingTimeMinutes: count / 200,
        slug: "",
        excerpt: "",
      });
    });
  }
});

test("treats a whitespace-only first line as blank", () => {
  withFile("   \nOne two", (file) => {
    const result = run(file);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, "");
    assert.deepEqual(JSON.parse(result.stdout), {
      wordCount: 2,
      wordFrequencies: { one: 1, two: 1 },
      readingTimeMinutes: 0.01,
      slug: "",
      excerpt: "",
    });
  });
});

test("rejects a missing argument without stdout", () => {
  const result = run();
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /Usage:/);
});

test("rejects an unreadable path without stdout or file content", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "text-stats-"));
  try {
    const result = run(path.join(dir, "missing.txt"));
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /Cannot read file:/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects multiple paths without emitting a report", () => {
  const result = run("one.txt", "two.txt");
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /Usage:/);
});
