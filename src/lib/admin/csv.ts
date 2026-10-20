// CSV export helpers. Cells that start with = + - @ are prefixed with ' so
// Excel and Google Sheets do not run a visitor's text as a formula.
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}

export function csvResponse(filename: string, csv: string) {
  // The BOM makes Excel open the file as UTF-8 (names in Hindi, ₹ signs).
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function csvFilename(prefix: string) {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;
}

export const EXPORT_LIMIT = 10000;
