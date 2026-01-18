import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from '../types';

// We use the environment variable if available, otherwise we might rely on a passed key
// In this architecture, we assume process.env.API_KEY is available as per instructions.
const API_KEY = process.env.API_KEY || '';

export const generateTopicSummary = async (topic: string, modelName?: string, baseUrl?: string): Promise<{ news: NewsItem[], sources: { title: string, url: string }[] }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ 
    apiKey: API_KEY,
    baseUrl: baseUrl && baseUrl.trim() !== '' ? baseUrl : undefined
  });

  // Schema for the structured output we want from the model
  const schema = {
    type: Type.OBJECT,
    properties: {
      news: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "A catchy headline for the specific news story." },
            summary: { type: Type.STRING, description: "A concise summary of the event (approx 30 words)." },
            date: { type: Type.STRING, description: "The specific date or relative time of the event (e.g., 'Oct 24' or 'Yesterday')." },
            impact: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "The potential impact of this news on the industry." },
            url: { type: Type.STRING, description: "The EXACT source URL of the article found in the search results. Return an empty string if a specific article URL is not available. DO NOT FABRICATE." },
            source: { type: Type.STRING, description: "The name of the publisher (e.g., TechCrunch, The Verge)." }
          },
          required: ["headline", "summary", "date", "impact", "url", "source"]
        }
      }
    },
    required: ["news"]
  };

  // Use the custom model if provided, otherwise default to flash
  const targetModel = modelName && modelName.trim() !== '' ? modelName : 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: `Find the absolute latest and most significant news regarding "${topic}" from the last 7 days.
      
      Instructions:
      1. Use Google Search to find top 3 distinct stories.
      2. For each story, extract the details.
      3. For the 'url' field: You must ONLY use a URL that was returned by the Google Search tool for that specific story. 
      4. If you cannot find a direct link to the story in the search results, leave the 'url' field as an empty string ("").
      5. DO NOT hallucinate, guess, or construct URLs. 
      6. DO NOT use homepage URLs (e.g. 'https://www.verge.com' is bad).
      
      Return the results in JSON format matching the schema.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a strict, factual news aggregator.
        
        ANTI-HALLUCINATION RULES FOR URLS:
        - The 'url' field MUST match a URL found in the search grounding/results exactly.
        - If a specific article URL is not found, return an empty string for the 'url' field.
        - NEVER fabricate a URL.
        - NEVER use a generic homepage URL.
        
        Prioritize accuracy over having a link.`,
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