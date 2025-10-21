import { GoogleGenAI, Type } from "@google/genai";
import type { Meal } from '../types';

// The function will return a partial meal, as some fields are generated client-side
type AnalyzedMealData = Omit<Meal, 'id' | 'timestamp' | 'image' | 'mealType' | 'type'>;

const dataUrlToGenerativePart = (dataUrl: string) => {
    const base64EncodedData = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];
    return {
        inlineData: { data: base64EncodedData, mimeType },
    };
}

export const analyzeFoodImage = async (base64Image: string): Promise<AnalyzedMealData> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const imagePart = dataUrlToGenerativePart(base64Image);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Analyze the food item in this image. Provide its name, and estimated nutritional information (calories, protein, carbs, fat) in grams for a single serving. Your response MUST be in JSON." },
                    imagePart
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                    },
                    required: ["name", "calories", "protein", "carbs", "fat"],
                },
            }
        });

        const resultText = response.text;
        const parsedResult = JSON.parse(resultText);

        // Basic validation on the parsed result
        if (
            typeof parsedResult.name === 'string' &&
            typeof parsedResult.calories === 'number' &&
            typeof parsedResult.protein === 'number' &&
            typeof parsedResult.carbs === 'number' &&
            typeof parsedResult.fat === 'number'
        ) {
            return parsedResult;
        } else {
            throw new Error("Invalid analysis result structure from API.");
        }
    } catch (error) {
        console.error("Error in Gemini API call:", error);
        // Re-throw the error to be handled by the caller
        throw new Error("Failed to analyze image with AI.");
    }
};
