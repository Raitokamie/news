// Country-level region from API data
export type Region = 'global' | 'us' | 'eu' | 'jp' | 'ch' | 'th' | 'sa' | 'ae' | 'il' | 'tr';

// UI tab groups
export type RegionTab = 'global' | 'us' | 'eu' | 'asia' | 'mena';

export type ImpactLevel = 'high' | 'medium' | 'low';
export type Sentiment = 'good' | 'bad' | 'neutral';
export type SortOrder = 'latest' | 'oldest' | 'impact';

export interface TickerMention {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
}

export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  source: string;
  publishedAt: Date;
  regionTag: RegionTab;   // กลุ่ม: 'us' | 'eu' | 'asia' | 'mena' | 'global'
  countryCode: Region;    // ประเทศ: 'us' | 'jp' | 'th' | etc.
  impact: ImpactLevel;
  sentiment: Sentiment;
  tickers: { symbol: string; sentiment: 'up' | 'down' | 'flat' }[];
  narrativeGroupId?: string;
  logoUrl?: string;
}

export interface NarrativeGroup {
  id: string;
  masterHeadline: string;
  items: NewsItem[];
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
