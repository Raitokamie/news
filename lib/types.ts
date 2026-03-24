// ─── Shared enums ───────────────────────────────────────
export type Region = string;
export type RegionTab = 'global' | 'us' | 'eu' | 'asia' | 'mena';
export type Category = 'markets' | 'economic' | 'politic' | 'tech' | 'industry' | 'commodities' | 'crypto' | 'energy' | 'healthcare' | 'real-estate';
export type ImpactLevel = 'high' | 'medium' | 'low';
export type Sentiment = 'good' | 'bad' | 'neutral';
export type SortOrder = 'latest' | 'oldest' | 'impact';

// ─── Types ──────────────────────────────────────────────
export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  sources: { name: string; url: string }[];
  publishedAt: Date;
  regionTag: RegionTab;
  countryCode: Region;
  impact: ImpactLevel;
  sentiment: Sentiment;
  tickers: { symbol: string; name: string; sentiment: 'up' | 'down' | 'flat'; sentimentScore: number }[];
  narrativeGroupId?: string;
  logoUrl?: string;
}

export interface SentimentHistorical {
  positive: number;
  negative: number;
  neutral: number;
}

// Unified ticker analysis — matches GET /tickers/analysis response
export interface TickerAnalysis {
  symbol: string;
  name: string;
  impactLevel: ImpactLevel;
  sentiment: 'up' | 'down' | 'flat';
  mentionCount: number;
  sentimentHistorical: SentimentHistorical;
  score: number;
}

export interface LiveUpdate {
  headline: string;
  shortHeadline: string;
  publishedAt: Date;
}

export interface NarrativeGroup {
  id: string;
  masterHeadline: string;
  items: NewsItem[];
}

export type TrendFilter = 'all' | 'top_positive' | 'top_negative' | 'most_mention';

// Telegram notification status for watchlist
export interface TelegramNotificationStatus {
  symbol: string;
  status: 'SENT' | 'FAILED' | 'PROCESSING';
  timestamp: Date;
}
