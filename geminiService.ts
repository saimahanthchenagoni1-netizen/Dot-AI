
import { GoogleGenAI, Type } from "@google/genai";
import { StudentLevel, AskMode } from "./types.ts";

export async function solveProblem(
  prompt: string,
  level: StudentLevel,
  mode: AskMode,
  imageData?: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    You are DOT, an elite open-source AI tutor created by SAI. 
    Your goal is to help students UNDERSTAND, not just get the answer.
    User Level: ${level}
    Explanation Style: ${mode}

    FORMATTING RULES:
    - Return a JSON object.
    - Fields: "steps" (array of strings), "explanation" (string), "whyItMatters" (string), "alternativeMethod" (string, optional).
    - Use clear, professional yet accessible language.
    - If math is involved, use markdown formatting.
    - If asked who created you, always say SAI.
  `;

  const contents: any[] = [{ text: prompt }];
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1] || imageData
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          whyItMatters: { type: Type.STRING },
          alternativeMethod: { type: Type.STRING }
        },
        required: ["steps", "explanation", "whyItMatters"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function chatWithNotebook(query: string, context: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const systemInstruction = "You are DOT. Answer questions strictly based on the provided notes. Be concise and helpful. You were created by SAI.";
  const response = await ai.models.generateContent({
    model,
    contents: `Notes Context: ${context}\n\nQuestion: ${query}`,
    config: { systemInstruction }
  });
  return response.text;
}

export async function suggestTasks(currentGoal: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const prompt = `Based on this goal: "${currentGoal}", suggest 3 specific study tasks. Return as JSON array with title, subject, duration, and priority (low, medium, high).`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            duration: { type: Type.STRING },
            priority: { type: Type.STRING }
          },
          required: ["title", "subject", "duration", "priority"]
        }
      }
    }
  });
  return JSON.parse(response.text);
}
