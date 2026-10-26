// CSV export of a text report: one header row and one numeric row.
function exportReportCsv(text) {
  const t = String(text == null ? "" : text);
  const words = t.trim() === "" ? 0 : t.trim().split(/\s+/).length;
  const sentences = (t.match(/[^.!?]*[A-Za-z0-9][^.!?]*[.!?]?/g) || []).length;
  return `wordCount,characterCount,sentenceCount\n${words},${t.length},${sentences}`;
}
module.exports = { exportReportCsv };
