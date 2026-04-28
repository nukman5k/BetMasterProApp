
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBettingInsights = async (calculatorType: string, inputs: any) => {
  const prompt = `
    Context: Professional Betting Strategy Assistant.
    Calculator: ${calculatorType}
    User Inputs: ${JSON.stringify(inputs)}
    
    Task: 
    1. Explain the results in simple terms.
    2. Identify potential risks or value (EV).
    3. Suggest a bankroll management tip related to this specific calculation.
    4. Keep it concise, professional, and data-driven.
    
    Format: Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate insights at this moment. Please check your inputs and try again.";
  }
};
