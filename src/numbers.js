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

const ORDINAL_SUFFIXES = { 1: "st", 2: "nd", 3: "rd" };

function ordinal(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError("n must be a non-negative integer");
  }
  return `${n}${ORDINAL_SUFFIXES[n % 10] || "th"}`;
}

module.exports = { formatBytes, ordinal };
