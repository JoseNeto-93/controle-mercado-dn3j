import { GoogleGenAI, Type } from "@google/genai";
import { MarketItem } from "../types";
import { v4 as uuidv4 } from 'uuid';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateShoppingList = async (prompt: string, budget?: number): Promise<MarketItem[]> => {
  const ai = getAiClient();
  
  const budgetContext = budget ? `The user has a budget of R$ ${budget}. Try to keep the total estimated cost within this limit.` : '';
  
  const systemInstruction = `
    You are a helpful shopping assistant for a Brazilian supermarket context.
    Your goal is to generate a shopping list based on the user's request.
    Estimate prices in BRL (Brazilian Real) realistically for the current market.
    Categories should be one of: "Hortifruti", "Açougue", "Mercearia", "Bebidas", "Limpeza", "Higiene", "Padaria", "Outros".
    ${budgetContext}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the product in Portuguese" },
            quantity: { type: Type.NUMBER, description: "Quantity of items" },
            estimatedPrice: { type: Type.NUMBER, description: "Estimated unit price in BRL" },
            category: { type: Type.STRING, description: "Product category" }
          },
          required: ["name", "quantity", "estimatedPrice", "category"]
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "[]");

  // Map to our internal type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawData.map((item: any) => ({
    id: uuidv4(),
    name: item.name,
    quantity: item.quantity || 1,
    price: item.estimatedPrice || 0,
    category: item.category || "Outros",
    checked: false,
    isEstimated: true
  }));
};