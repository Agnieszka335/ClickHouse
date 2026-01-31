import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  icon: string;
}

export const generateProductMetadata = async (prompt: string): Promise<GeneratedProductData | null> => {
  // Always create a new instance to ensure we use the latest API KEY from the environment/dialog
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
      console.error("API Key missing");
      return null;
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    // Upgraded to gemini-3-pro-preview for better creative writing and JSON structure
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Create a single gaming product based on this description: "${prompt}". 
                 Return JSON with: name (string), price (number, typical gaming price in PLN), 
                 description (string, max 100 chars), category (string, e.g. Klawiatury, Myszki), 
                 icon (string, single emoji). Language: Polish.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            icon: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as GeneratedProductData;
    }
    return null;
  } catch (error) {
    console.error("AI Metadata Error:", error);
    return null;
  }
};

export const generateProductImage = async (prompt: string): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Using Nano Banana Pro (gemini-3-pro-image-preview) as requested
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `Professional product photography of ${prompt}, studio lighting, dark background, neon accents, high quality, 4k, centralized composition.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K" 
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Error:", error);
    return null;
  }
};