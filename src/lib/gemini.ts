import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getGeminiModel = () => {
  if (!genAI) return null;
  return genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: "Hello" }] }]
  });
};
