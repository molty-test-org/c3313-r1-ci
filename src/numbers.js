const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const BASE = 1024;
const DECIMALS = 2;

function formatBytes(bytes) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError("bytes must be a finite non-negative number");
  }
  let unit = 0;
  let value = bytes;
  while (value >= BASE && unit < UNITS.length - 1) {
    value /= BASE;
    unit++;
  }
  let rounded = unit === 0 ? Math.round(value) : Math.round(value * 10 ** DECIMALS) / 10 ** DECIMALS;
  if (rounded >= BASE && unit < UNITS.length - 1) {
    value /= BASE;
    unit++;
    rounded = Math.round(value * 10 ** DECIMALS) / 10 ** DECIMALS;
  }
  return `${rounded} ${UNITS[unit]}`;
}

function clamp(value, min, max) {
  for (const arg of [value, min, max]) {
    if (typeof arg !== "number" || !Number.isFinite(arg)) {
      throw new RangeError("value, min and max must be finite numbers");
    }
  }
  if (min > max) {
    throw new RangeError("min must be less than or equal to max");
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

module.exports = { formatBytes, clamp };
