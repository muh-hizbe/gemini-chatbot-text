import 'dotenv/config';
import * as geminiAI from './services/ai/gemini.js';
import { extractText } from './utils.js';

export const ChatbotText = async (req, res) => {
  const { messages } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  const contents = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
  
  try {
    const response = await geminiAI.generateText(contents);
    
    res.json({ reply: extractText(response) });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
};

export const GenerateText = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const response = await geminiAI.generateText(prompt);
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
};

export const GenerateFromImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'Only PNG and JPEG images are supported' });
  }

  try {
    const response = await geminiAI.generateFromImage({ file: req.file, prompt });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from image:', error);
    res.status(500).json({ error: 'Failed to generate text from image' });
  }
};

export const GenerateFromDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Document file is required' });
  }
  const { prompt } = req.body;
  try {
    const response = await geminiAI.generateFromDocument({ file: req.file, prompt });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from document:', error);
    res.status(500).json({ error: 'Failed to generate text from document' });
  }
};

export const GenerateFromAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }
  if (req.file.mimetype !== 'audio/wav' && req.file.mimetype !== 'audio/mpeg') {
    return res.status(400).json({ error: 'Only WAV and MP3 audio files are supported' });
  }
  try {
    const response = await geminiAI.generateFromAudio(req.file);
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from audio:', error);
    res.status(500).json({ error: 'Failed to generate text from audio' });
  }
};
