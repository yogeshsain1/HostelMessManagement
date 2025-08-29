export type ReportRow = Record<string, string | number | boolean | null | undefined>

export function toCsv(rows: ReportRow[], delimiter = ",") {
  if (rows.length === 0) return ""
  const headers = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((k) => set.add(k))
      return set
    }, new Set<string>())
  )

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (str.includes("\"")) {
      return `"${str.replaceAll("\"", '""')}"`
    }
    if (str.includes(delimiter) || str.includes("\n") || str.includes("\r")) {
      return `"${str}"`
    }
    return str
  }

  const headerLine = headers.map(escape).join(delimiter)
  const dataLines = rows.map((row) => headers.map((h) => escape(row[h])).join(delimiter))
  return [headerLine, ...dataLines].join("\n")
}

export function downloadText(content: string, filename: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function downloadCsv(rows: ReportRow[], filename: string) {
  const csv = toCsv(rows)
  downloadText(csv, filename.endsWith('.csv') ? filename : `${filename}.csv`, "text/csv;charset=utf-8")
}

export function printHtml(title: string, htmlContent: string) {
  const w = window.open("", "_blank")
  if (!w) return
  w.document.open()
  w.document.write(`<!doctype html><html><head><title>${title}</title><meta charset=\"utf-8\"><style>
    body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px}
    table{width:100%; border-collapse: collapse}
    th,td{border:1px solid #ddd; padding:8px; font-size:12px}
    th{background:#f5f5f5; text-align:left}
  </style></head><body>${htmlContent}</body></html>`)
  w.document.close()
  w.focus()
  w.print()
}


