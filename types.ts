export interface NewsItem {
  headline: string;
  summary: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low';
  url?: string;
  source?: string;
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
  jobTitle?: string;
  topics: string[];
  avatar?: string;
  plan?: 'Free' | 'Pro';
  apiKey?: string; // Stored locally for convenience if needed
  serpApiKey?: string;
  openAiApiKey?: string;
  customModelName?: string;
  baseUrl?: string;
}

export const DEFAULT_TOPICS = [
  "Artificial Intelligence",
  "Quantum Computing",
  "Space Exploration",
  "Cybersecurity"
];