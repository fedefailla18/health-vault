/**
 * Robust CSV parser that handles commas inside quoted fields and multiline values.
 */
export function parseCsv<T>(csvText: string): T[] {
  if (!csvText || !csvText.trim()) return [];

  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(val => val.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(val => val.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.trim());
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const val = row[j] !== undefined ? row[j] : '';
      
      // Auto cast numeric values if strictly numeric
      if (val !== '' && !isNaN(Number(val)) && !val.includes('-') && !val.startsWith('+')) {
        obj[header] = Number(val);
      } else {
        obj[header] = val;
      }
    }
    rows.push(obj as T);
  }

  return rows;
}

/**
 * Serializes an array of objects to CSV string.
 */
export function serializeCsv<T extends Record<string, any>>(data: T[], headers: (keyof T)[]): string {
  if (!headers || headers.length === 0) return '';

  const headerRow = headers.map(String).join(',');
  const rowLines = data.map(item => {
    return headers.map(header => {
      const val = item[header];
      if (val === null || val === undefined) return '';
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });

  return [headerRow, ...rowLines].join('\n') + '\n';
}
