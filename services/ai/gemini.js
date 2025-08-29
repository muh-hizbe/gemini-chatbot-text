import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import fs from 'fs/promises';
const GEMINI_MODEL = 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateText = (prompt) => {
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
};

export const generateFromImage = async ({ file, prompt }) => {
  const imageBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: imageBase64 } }, { text: prompt }],
  });
};

export const generateFromDocument = async ({ file, prompt }) => {
  const docBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: docBase64 } }, { text: prompt || 'Ringkas dokument berikut:' }],
  });
};

export const generateFromAudio = async (file) => {
  const audioBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: audioBase64 } }, { text: 'Buatkan transkrip dari audio berikut:' }],
  });
};
