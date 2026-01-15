export interface NewsItem {
  headline: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface TopicSummary {
  topic: string;
  news: NewsItem[];
  fetchedAt: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface UserPreferences {
  name: string;
  topics: string[];
  apiKey?: string; // Stored locally for convenience if needed, though env is preferred
}

export const DEFAULT_TOPICS = [
  "Artificial Intelligence",
  "Quantum Computing",
  "Space Exploration",
  "Cybersecurity"
];