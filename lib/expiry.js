export function extractExpiryFromText(text) {
  const patterns = [
    /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/,   // DD/MM/YYYY
    /\b\d{4}[\/\-]\d{2}[\/\-]\d{2}\b/,   // YYYY-MM-DD
    /\b\d{2}\/\d{4}\b/,                  // MM/YYYY
  ];

  for (const p of patterns) {
    const match = text.match(p);
    if (match) return match[0];
  }

  return "Not found";
}
