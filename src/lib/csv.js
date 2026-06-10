export const LF = String.fromCharCode(10);
export const CR = String.fromCharCode(13);
export const CRLF = CR + LF;

export function splitCSVLine(line) {
  const output = [];

  let current = "";
  let quoted = false;

  const source = String(line || "");

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      output.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  output.push(current.trim());

  return output;
}

export function parseCSV(text) {
  const normalized = String(text || "")
    .replaceAll(CRLF, LF)
    .replaceAll(CR, LF);

  const lines = normalized
    .split(LF)
    .filter((line) => line.trim());

  if (!lines.length) {
    return [];
  }

  let headerIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 40); i += 1) {
    const lower = lines[i].toLowerCase();

    const isConnectionHeader =
      lower.includes("first name") &&
      lower.includes("last name");

    const isMessageHeader =
      lower.includes("conversation id");

    const isCommonHeader =
      lower.includes("name") ||
      lower.includes("title") ||
      lower.includes("company") ||
      lower.includes("headline");

    if (
      isConnectionHeader ||
      isMessageHeader ||
      isCommonHeader
    ) {
      headerIndex = i;
      break;
    }
  }

  const usable = lines.slice(headerIndex);

  const headers = splitCSVLine(usable[0]);

  return usable.slice(1).map((line) => {
    const values = splitCSVLine(line);

    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

export function getValue(row, names) {
  const keys = Object.keys(row || {});

  for (const name of names) {
    const key = keys.find(
      (candidate) =>
        candidate.trim().toLowerCase() ===
        String(name).trim().toLowerCase()
    );

    if (key && row[key]) {
      return String(row[key]).trim();
    }
  }

  return "";
}