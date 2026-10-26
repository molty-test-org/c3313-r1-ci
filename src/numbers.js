const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const BASE = 1024;

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
  let rounded = unit === 0 ? Math.round(value) : Math.round(value * 100) / 100;
  if (rounded >= BASE && unit < UNITS.length - 1) {
    value /= BASE;
    unit++;
    rounded = Math.round(value * 100) / 100;
  }
  return `${rounded} ${UNITS[unit]}`;
}

module.exports = { formatBytes };
