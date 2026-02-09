import Tesseract from "tesseract.js";

export async function extractTextFromImage(base64Image) {
  const result = await Tesseract.recognize(base64Image, "eng");
  return result.data.text;
}
