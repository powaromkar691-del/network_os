export function exportJSON(
  fileName,
  data
) {
  const blob = new Blob(
    [
      JSON.stringify(
        data,
        null,
        2
      )
    ],
    {
      type: "application/json"
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = fileName;

  link.click();

  URL.revokeObjectURL(link.href);
}