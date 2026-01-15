import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from '../types';

// We use the environment variable if available, otherwise we might rely on a passed key
// In this architecture, we assume process.env.API_KEY is available as per instructions.
const API_KEY = process.env.API_KEY || '';

export const generateTopicSummary = async (topic: string): Promise<{ news: NewsItem[], sources: { title: string, url: string }[] }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Schema for the structured output we want from the model
  const schema = {
    type: Type.OBJECT,
    properties: {
      news: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "A catchy headline for the news story." },
            summary: { type: Type.STRING, description: "A concise summary of the event (approx 30 words)." },
            impact: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "The potential impact of this news on the industry." }
          },
          required: ["headline", "summary", "impact"]
        }
      }
    },
    required: ["news"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find the absolute latest and most significant news regarding "${topic}" from the last 7 days. Summarize the top 3 distinct stories.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini.");
    }

    const data = JSON.parse(text);
    
    // Extract grounding metadata for sources
    const sources: { title: string, url: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            url: chunk.web.uri
          });
        }
      });
    }

    // Filter duplicate sources by URL
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i).slice(0, 4);

    return {
      news: data.news || [],
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Error generating summary for", topic, error);
    throw error;
  }
};