const test = require("node:test");
const assert = require("node:assert");
const { formatBytes, ordinal } = require("../src/numbers");

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
test("ordinal uses st, nd and rd for final digits 1, 2 and 3", () => {
  assert.strictEqual(ordinal(1), "1st");
  assert.strictEqual(ordinal(2), "2nd");
  assert.strictEqual(ordinal(3), "3rd");
  assert.strictEqual(ordinal(21), "21st");
  assert.strictEqual(ordinal(22), "22nd");
  assert.strictEqual(ordinal(23), "23rd");
});
test("ordinal uses th for other final digits", () => {
  assert.strictEqual(ordinal(0), "0th");
  assert.strictEqual(ordinal(4), "4th");
  assert.strictEqual(ordinal(10), "10th");
  assert.strictEqual(ordinal(20), "20th");
});
test("ordinal follows the final digit with no teen exceptions", () => {
  assert.strictEqual(ordinal(11), "11st");
  assert.strictEqual(ordinal(12), "12nd");
  assert.strictEqual(ordinal(13), "13rd");
  assert.strictEqual(ordinal(111), "111st");
});
test("ordinal rejects non-integer and negative input", () => {
  for (const n of [1.5, NaN, Infinity, -1, "1", null, undefined]) {
    assert.throws(() => ordinal(n), RangeError);
  }
});
