// ─── Shared enums ───────────────────────────────────────
export type Region = 'global' | 'us' | 'eu' | 'jp' | 'cn' | 'th' | 'sa' | 'ae' | 'il' | 'tr';
export type RegionTab = 'global' | 'us' | 'eu' | 'asia' | 'mena';
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
  tickers: { symbol: string; sentiment: 'up' | 'down' | 'flat'; sentimentScore: number }[];
  narrativeGroupId?: string;
  logoUrl?: string;
}

export interface StockSentimentRow {
  symbol: string;
  impact: ImpactLevel;
  sentiment: 'up' | 'down' | 'flat';
  sentimentLabel: 'Positive' | 'Negative' | 'Neutral';
  mentionCount: number;
  historical: { positive: number; neutral: number; negative: number };
  score: number;
}

export interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
  mentionCount: number;
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
