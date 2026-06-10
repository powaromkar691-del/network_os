import JSZip from "jszip";

export function getBaseName(path) {
  const parts = String(path || "").split("/");
  return parts[parts.length - 1];
}

export function findExportFile(files, targetFileName) {
  const target = String(targetFileName || "").toLowerCase();

  return files.find((file) => {
    return getBaseName(file.name).toLowerCase() === target;
  });
}

export function findExportText(files, targetFileName) {
  const file = findExportFile(files, targetFileName);
  return file ? file.text : "";
}

export async function readLinkedInZip(file) {
  if (!file) {
    throw new Error("No ZIP file selected.");
  }

  if (!file.name.toLowerCase().endsWith(".zip")) {
    throw new Error("Please upload a .zip file exported from LinkedIn.");
  }

  const zip = await JSZip.loadAsync(file);

  const files = [];

  const entries = Object.values(zip.files);

  for (const entry of entries) {
    if (entry.dir) continue;

    const name = entry.name;
    const baseName = getBaseName(name);
    const isCsv = baseName.toLowerCase().endsWith(".csv");

    if (!isCsv) continue;

    const text = await entry.async("string");

    files.push({
      name,
      baseName,
      size: text.length,
      text
    });
  }

  return files;
}

export function getFilePresence(files, expectedFiles) {
  return expectedFiles.map((expectedName) => {
    const found = findExportFile(files, expectedName);

    return {
      name: expectedName,
      found: Boolean(found),
      path: found ? found.name : "",
      size: found ? found.size : 0
    };
  });
}