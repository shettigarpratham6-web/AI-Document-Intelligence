export function extractExpiryFromText(text) {
  if (!text) return "Not found";

  const cleanText = text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const expiryRegex =
    /(expiry date|exp date|expiry date of|use by|best before|best before end)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|\d{1,2}[\/\-]\d{4}|\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s*\d{2,4}|(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s*\d{1,2},?\s*\d{2,4}|(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s*\d{2,4})/i;

  const match = cleanText.match(expiryRegex);

  if (match) {
    return match[2].trim();
  }

  return "Not found";
}
