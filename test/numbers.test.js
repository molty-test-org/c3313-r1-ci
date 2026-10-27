const test = require("node:test");
const assert = require("node:assert");
const { formatBytes, clamp } = require("../src/numbers");

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
test("clamp returns the bound for values outside an inclusive range", () => {
  assert.strictEqual(clamp(-5, 0, 10), 0);
  assert.strictEqual(clamp(15, 0, 10), 10);
});
test("clamp returns bounds unchanged when the value sits on them", () => {
  assert.strictEqual(clamp(0, 0, 10), 0);
  assert.strictEqual(clamp(10, 0, 10), 10);
});
test("clamp returns interior values unchanged", () => {
  assert.strictEqual(clamp(5, 0, 10), 5);
  assert.strictEqual(clamp(-0.5, -1, 1), -0.5);
});
test("clamp accepts equal bounds", () => {
  assert.strictEqual(clamp(7, 3, 3), 3);
  assert.strictEqual(clamp(3, 3, 3), 3);
});
test("clamp rejects non-number or non-finite arguments", () => {
  for (const v of [NaN, Infinity, -Infinity, "5", null, undefined]) {
    assert.throws(() => clamp(v, 0, 10), RangeError);
    assert.throws(() => clamp(5, v, 10), RangeError);
    assert.throws(() => clamp(5, 0, v), RangeError);
  }
});
test("clamp rejects inverted bounds", () => {
  assert.throws(() => clamp(5, 10, 0), RangeError);
});
