const test = require("node:test");
const assert = require("node:assert");
const { formatBytes } = require("../src/numbers");

test("formatBytes formats zero as bytes", () => {
  assert.strictEqual(formatBytes(0), "0 B");
});
test("formatBytes keeps values below 1024 in bytes", () => {
  assert.strictEqual(formatBytes(1), "1 B");
  assert.strictEqual(formatBytes(1023), "1023 B");
});
test("formatBytes switches units at 1024 multiples", () => {
  assert.strictEqual(formatBytes(1024), "1 KB");
  assert.strictEqual(formatBytes(1536), "1.5 KB");
  assert.strictEqual(formatBytes(1024 * 1024), "1 MB");
  assert.strictEqual(formatBytes(1024 ** 3), "1 GB");
  assert.strictEqual(formatBytes(1024 ** 4), "1 TB");
  assert.strictEqual(formatBytes(1024 ** 6), "1 EB");
});
test("formatBytes rolls over when rounding reaches the next unit", () => {
  assert.strictEqual(formatBytes(1024 * 1024 - 1), "1 MB");
  assert.strictEqual(formatBytes(1023.996 * 1024), "1 MB");
  assert.strictEqual(formatBytes(1023.95 * 1024), "1023.95 KB");
});
test("formatBytes shows at most two decimals without trailing zeros", () => {
  assert.strictEqual(formatBytes(1024 * 2), "2 KB");
  assert.strictEqual(formatBytes(1024 + 102), "1.1 KB");
  assert.strictEqual(formatBytes(1536), "1.5 KB");
  assert.strictEqual(formatBytes(1234567), "1.18 MB");
});
test("formatBytes rejects invalid numbers", () => {
  for (const bytes of [NaN, -1, Infinity, "1024", null, undefined]) {
    assert.throws(() => formatBytes(bytes), RangeError);
  }
});
