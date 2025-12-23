
import { GoogleGenAI, Type } from "@google/genai";
import { Category, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseVoiceCommand = async (text: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse this spending note into a JSON transaction: "${text}"`,
    config: {
      systemInstruction: `You are a financial assistant for a student. 
      Analyze the input and extract:
      - amount (number)
      - type (either 'Income' or 'Expense')
      - category (must be one of: 'Food', 'Snacks', 'Transport', 'Laundry', 'Room Items', 'Misc')
      - notes (string)
      
      Default to Expense if not clear. Default to Misc if category not obvious.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          type: { type: Type.STRING, enum: ['Income', 'Expense'] },
          category: { type: Type.STRING, enum: ['Food', 'Snacks', 'Transport', 'Laundry', 'Room Items', 'Misc'] },
          notes: { type: Type.STRING }
        },
        required: ['amount', 'type', 'category']
      }
    }
  });

  return JSON.parse(response.text);
};
