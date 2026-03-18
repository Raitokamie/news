import { NewsItem, TickerAnalysis, LiveUpdate, TelegramNotificationStatus } from './types';

export const mockNews: NewsItem[] = [
  // ── US ─────────────────────────────────────────────
  {
    id: '1',
    headline: 'Antitrust Updates: DOJ Closing Arguments Focus on Google\'s Default Search Deals',
    body: 'The landmark trial enters its final phase as regulators argue that payment to phone makers stifles competition...',
    sources: [
      { name: 'REUTERS', url: 'https://www.reuters.com/technology/google-antitrust-doj' },
    ],
    publishedAt: new Date(Date.now() - 4 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'high',
    sentiment: 'bad',
    tickers: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'down', sentimentScore: -7 },
    ],
    narrativeGroupId: 'ng-google-antitrust',
  },
  {
    id: '2',
    headline: 'Google Cloud Growth Accelerates as AI Demand Surges Among Enterprise Clients',
    body: 'Quarterly reports show a 28% increase in cloud revenue, driven by the rapid adoption of Vertex AI tools...',
    sources: [{ name: 'BLOOMBERG', url: 'https://www.bloomberg.com/news/google-cloud-ai' }],
    publishedAt: new Date(Date.now() - 4 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'high',
    sentiment: 'good',
    tickers: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'up', sentimentScore: 8 },
    ],
    narrativeGroupId: 'ng-google-cloud',
  },
  {
    id: '2b',
    headline: 'YouTube Advertising Revenue Beats Expectations Despite Creator Shift Trends',
    body: 'YouTube continues to dominate video advertising space with strong Q4 performance despite competition from short-form video platforms.',
    sources: [{ name: 'CNBC', url: 'https://www.cnbc.com/youtube-advertising-revenue' }],
    publishedAt: new Date(Date.now() - 12 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'medium',
    sentiment: 'bad',
    tickers: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'down', sentimentScore: -4 },
    ],
    narrativeGroupId: 'ng-google-ads',
  },
  {
    id: '2c',
    headline: 'Gemini 1.5 Pro Integration in Workspace Set to Redefine Productivity Suites',
    body: 'Google announces deep integration of Gemini 1.5 Pro across all Workspace applications, challenging Microsoft\'s Copilot dominance.',
    sources: [{ name: 'BLOOMBERG', url: 'https://www.bloomberg.com/news/gemini-workspace' }],
    publishedAt: new Date(Date.now() - 8 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'medium',
    sentiment: 'good',
    tickers: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'up', sentimentScore: 6 },
    ],
    narrativeGroupId: 'ng-google-ai',
  },
  {
    id: '3',
    headline: 'Nvidia Accelerates Data Center Dominance With New Blackwell Shipments',
    body: '$NVDA begins mass shipments of GB200 "Blackwell" GPUs to hyperscalers. $MSFT, $GOOGL, and $AMZN confirmed as top-tier customers, sending NVDA to fresh all-time highs.',
    sources: [
      { name: 'REUTERS', url: 'https://www.reuters.com/technology/nvidia-blackwell-shipments' },
      { name: 'CNBC', url: 'https://www.cnbc.com/nvidia-blackwell-gpu-shipments' },
    ],
    publishedAt: new Date(Date.now() - 12 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'high',
    sentiment: 'good',
    tickers: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sentiment: 'up', sentimentScore: 9 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sentiment: 'up', sentimentScore: 4 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'up', sentimentScore: 3 },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', sentiment: 'up', sentimentScore: 3 },
    ],
    narrativeGroupId: 'ng-tech-earnings',
  },
  {
    id: '4',
    headline: 'Microsoft Cloud Revenue Misses Estimates on AI Capacity Constraints',
    body: '$MSFT Azure growth decelerates to 28% as GPU supply bottlenecks limit AI workload expansion. CFO warns capital expenditure will remain elevated through FY26.',
    sources: [{ name: 'CNBC', url: 'https://www.cnbc.com/microsoft-cloud-revenue-miss' }],
    publishedAt: new Date(Date.now() - 18 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'medium',
    sentiment: 'bad',
    tickers: [
      { symbol: 'MSFT', name: 'Microsoft Corporation', sentiment: 'down', sentimentScore: -5 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sentiment: 'up', sentimentScore: 3 },
    ],
    narrativeGroupId: 'ng-tech-earnings',
  },
  {
    id: '5',
    headline: 'Tesla Faces Recall Over FSD Software Anomaly in Cold Weather',
    body: 'NHTSA issues recall notice for 350,000 $TSLA vehicles due to Full Self-Driving software failures in temperatures below -10°C. Stock slides 3% in pre-market trading.',
    sources: [{ name: 'WSJ', url: 'https://www.wsj.com/autos/tesla-fsd-recall-cold-weather' }],
    publishedAt: new Date(Date.now() - 25 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'high',
    sentiment: 'bad',
    tickers: [
      { symbol: 'TSLA', name: 'Tesla, Inc.', sentiment: 'down', sentimentScore: -8 },
    ],
  },
  {
    id: '6',
    headline: 'SEC Investigates Crypto Listing Practices at Major Exchanges',
    body: 'The SEC has opened investigations into several major exchanges regarding their token listing procedures, raising concerns about market manipulation and undisclosed conflicts of interest.',
    sources: [{ name: 'CNBC', url: 'https://www.cnbc.com/sec-crypto-listing-investigation' }],
    publishedAt: new Date(Date.now() - 35 * 60 * 1000),
    regionTag: 'us',
    countryCode: 'us',
    impact: 'low',
    sentiment: 'bad',
    tickers: [
      { symbol: 'COIN', name: 'Coinbase Global', sentiment: 'down', sentimentScore: -4 },
      { symbol: 'MSTR', name: 'MicroStrategy Inc.', sentiment: 'down', sentimentScore: -3 },
    ],
  },

  // ── EU ─────────────────────────────────────────────
  {
    id: '7',
    headline: 'ECB Signals Pause in Rate Hikes Amid Slowing Euro Zone Growth',
    body: 'European Central Bank policymakers signal a potential pause in interest rate increases as economic data from Germany and France show contraction. $DAX futures rise on the news.',
    sources: [{ name: 'FT', url: 'https://www.ft.com/content/ecb-rate-pause-signal' }],
    publishedAt: new Date(Date.now() - 30 * 60 * 1000),
    regionTag: 'eu',
    countryCode: 'de',
    impact: 'high',
    sentiment: 'good',
    tickers: [
      { symbol: 'EWG', name: 'iShares MSCI Germany', sentiment: 'up', sentimentScore: 5 },
      { symbol: 'FXE', name: 'Invesco CurrencyShares Euro', sentiment: 'up', sentimentScore: 4 },
    ],
  },
  {
    id: '8',
    headline: 'Amazon Acquires European Logistics Firm to Expand Delivery Network',
    body: '$AMZN acquires Dutch logistics giant PostNL in a €4.2B deal, strengthening last-mile delivery in 12 EU countries and threatening local rivals.',
    sources: [{ name: 'REUTERS', url: 'https://www.reuters.com/business/amazon-postnl-acquisition' }],
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    regionTag: 'eu',
    countryCode: 'nl',
    impact: 'medium',
    sentiment: 'good',
    tickers: [
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', sentiment: 'up', sentimentScore: 6 },
    ],
  },

  // ── Asia ──────────────────────────────────────────
  {
    id: '9',
    headline: 'BOJ Maintains Ultra-Loose Monetary Policy, Yen Weakens',
    body: 'The Bank of Japan holds yield curve control unchanged, disappointing markets expecting a hawkish pivot. $USDJPY climbs above 150, raising intervention risk.',
    sources: [{ name: 'NIKKEI', url: 'https://asia.nikkei.com/boj-monetary-policy-unchanged' }],
    publishedAt: new Date(Date.now() - 45 * 60 * 1000),
    regionTag: 'asia',
    countryCode: 'jp',
    impact: 'high',
    sentiment: 'bad',
    tickers: [
      { symbol: 'FXY', name: 'Invesco CurrencyShares Yen', sentiment: 'down', sentimentScore: -6 },
      { symbol: 'EWJ', name: 'iShares MSCI Japan', sentiment: 'up', sentimentScore: 3 },
    ],
  },
  {
    id: '10',
    headline: 'China Stimulus Package Fails to Impress Markets',
    body: 'Beijing\'s latest round of fiscal stimulus falls short of analyst expectations. $FXI drops 2% in pre-market as property sector concerns persist.',
    sources: [{ name: 'CAIXIN', url: 'https://www.caixinglobal.com/china-stimulus-markets' }],
    publishedAt: new Date(Date.now() - 60 * 60 * 1000),
    regionTag: 'asia',
    countryCode: 'cn',
    impact: 'high',
    sentiment: 'bad',
    tickers: [
      { symbol: 'FXI', name: 'iShares China Large-Cap', sentiment: 'down', sentimentScore: -7 },
      { symbol: 'BABA', name: 'Alibaba Group', sentiment: 'down', sentimentScore: -5 },
      { symbol: 'PDD', name: 'PDD Holdings', sentiment: 'down', sentimentScore: -4 },
    ],
  },
  {
    id: '11',
    headline: 'SET Index Eyes 1,400 as Foreign Inflows Return to Thai Equities',
    body: 'Foreign investors return to Thai stocks after three months of outflows. Tourism recovery and baht stability bolster confidence in $GULF and $CPALL.',
    sources: [{ name: 'BANGKOKPOST', url: 'https://www.bangkokpost.com/business/set-1400-foreign-inflows' }],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    regionTag: 'asia',
    countryCode: 'th',
    impact: 'medium',
    sentiment: 'good',
    tickers: [
      { symbol: 'GULF', name: 'Gulf Energy Development', sentiment: 'up', sentimentScore: 5 },
      { symbol: 'CPALL', name: 'CP ALL Public Company', sentiment: 'up', sentimentScore: 4 },
    ],
  },

  // ── Global ─────────────────────────────────────────
  {
    id: '12',
    headline: 'Apple Unveils Next-Gen Vision Pro With 40% Cost Reduction',
    body: '$AAPL announces Vision Pro 2 at $2,499 targeting mainstream adoption. Analysts upgrade price targets citing spatial computing growth runway.',
    sources: [{ name: 'BLOOMBERG', url: 'https://www.bloomberg.com/news/apple-vision-pro-2' }],
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    regionTag: 'global',
    countryCode: 'global',
    impact: 'medium',
    sentiment: 'good',
    tickers: [
      { symbol: 'AAPL', name: 'Apple Inc.', sentiment: 'up', sentimentScore: 7 },
    ],
  },
  {
    id: '13',
    headline: 'Google DeepMind Achieves Breakthrough in Protein Structure Prediction',
    body: '$GOOGL DeepMind\'s latest model predicts drug-protein interactions with 99.2% accuracy, potentially shortcutting years of pharmaceutical R&D pipeline.',
    sources: [{ name: 'NATURE', url: 'https://www.nature.com/articles/deepmind-protein-prediction' }],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    regionTag: 'global',
    countryCode: 'global',
    impact: 'medium',
    sentiment: 'good',
    tickers: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'up', sentimentScore: 6 },
    ],
  },
  {
    id: '14',
    headline: 'Oil Prices Surge as OPEC+ Announces Deeper Production Cuts',
    body: 'Brent crude jumps 4.2% after Saudi Arabia leads coalition in surprise 1.5M barrel/day reduction. Energy stocks $XOM $CVX rally while airlines $DAL $UAL face margin pressure.',
    sources: [
      { name: 'REUTERS', url: 'https://www.reuters.com/business/energy/opec-production-cuts' },
      { name: 'BLOOMBERG', url: 'https://www.bloomberg.com/news/opec-deeper-cuts' },
    ],
    publishedAt: new Date(Date.now() - 50 * 60 * 1000),
    regionTag: 'global',
    countryCode: 'global',
    impact: 'high',
    sentiment: 'neutral',
    tickers: [
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', sentiment: 'up', sentimentScore: 6 },
      { symbol: 'CVX', name: 'Chevron Corporation', sentiment: 'up', sentimentScore: 5 },
    ],
  },
  {
    id: '15',
    headline: 'Global Semiconductor Shortage Eases as TSMC Ramps 3nm Production',
    body: 'TSMC reports 3nm yields above 80%, clearing backlog for $AAPL and $NVDA orders. Chip lead times fall to 12-week average, the lowest since 2021.',
    sources: [{ name: 'SEMI', url: 'https://www.semi.org/tsmc-3nm-production-ramp' }],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    regionTag: 'global',
    countryCode: 'global',
    impact: 'low',
    sentiment: 'good',
    tickers: [
      { symbol: 'AAPL', name: 'Apple Inc.', sentiment: 'up', sentimentScore: 4 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sentiment: 'up', sentimentScore: 5 },
    ],
  },
];


export const mockStockSentiment: TickerAnalysis[] = [
  { symbol: 'GOOG', name: 'Alphabet Inc.', impactLevel: 'high', sentiment: 'down', mentionCount: 25, sentimentHistorical: { positive: 16, neutral: 4, negative: 5 }, score: 40 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', impactLevel: 'high', sentiment: 'up', mentionCount: 14, sentimentHistorical: { positive: 12, neutral: 4, negative: 2 }, score: 85 },
  { symbol: 'AAPL', name: 'Apple Inc.', impactLevel: 'medium', sentiment: 'flat', mentionCount: 17, sentimentHistorical: { positive: 12, neutral: 2, negative: 3 }, score: 57 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', impactLevel: 'low', sentiment: 'up', mentionCount: 18, sentimentHistorical: { positive: 12, neutral: 4, negative: 2 }, score: 75 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', impactLevel: 'high', sentiment: 'up', mentionCount: 20, sentimentHistorical: { positive: 4, neutral: 2, negative: 14 }, score: 81 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', impactLevel: 'low', sentiment: 'flat', mentionCount: 31, sentimentHistorical: { positive: 4, neutral: 2, negative: 25 }, score: 42 },
  { symbol: 'MA', name: 'Mastercard Incorporated', impactLevel: 'high', sentiment: 'up', mentionCount: 14, sentimentHistorical: { positive: 12, neutral: 1, negative: 1 }, score: 90 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', impactLevel: 'medium', sentiment: 'flat', mentionCount: 7, sentimentHistorical: { positive: 1, neutral: 1, negative: 5 }, score: 45 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', impactLevel: 'high', sentiment: 'down', mentionCount: 4, sentimentHistorical: { positive: 3, neutral: 0, negative: 1 }, score: 23 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', impactLevel: 'high', sentiment: 'up', mentionCount: 34, sentimentHistorical: { positive: 24, neutral: 4, negative: 5 }, score: 69 },
];

export const liveUpdate: LiveUpdate = {
  headline: 'The Federal Reserve keeps interest rates unchanged at 3.50% – 3.75% following the latest FOMC meeting.',
  shortHeadline: 'Fed holds rates at 3.50%–3.75% after FOMC meeting.',
  publishedAt: new Date(Date.now() - 2 * 60 * 1000),
};

// Market Trends data
export const mockMarketTrends: TickerAnalysis[] = [
  { symbol: 'GOOGL', name: 'Alphabet Inc.', impactLevel: 'high', sentiment: 'up', mentionCount: 25, sentimentHistorical: { positive: 16, negative: 5, neutral: 4 }, score: 60 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', impactLevel: 'high', sentiment: 'up', mentionCount: 14, sentimentHistorical: { positive: 12, negative: 2, neutral: 4 }, score: 85 },
  { symbol: 'AAPL', name: 'Apple Inc. \u2022 Nasdaq GS', impactLevel: 'medium', sentiment: 'up', mentionCount: 17, sentimentHistorical: { positive: 12, negative: 3, neutral: 2 }, score: 70 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', impactLevel: 'low', sentiment: 'up', mentionCount: 18, sentimentHistorical: { positive: 12, negative: 2, neutral: 4 }, score: 75 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', impactLevel: 'high', sentiment: 'down', mentionCount: 20, sentimentHistorical: { positive: 4, negative: 14, neutral: 2 }, score: 20 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', impactLevel: 'low', sentiment: 'flat', mentionCount: 31, sentimentHistorical: { positive: 4, negative: 25, neutral: 2 }, score: 42 },
  { symbol: 'MA', name: 'Mastercard Incorporated', impactLevel: 'high', sentiment: 'up', mentionCount: 14, sentimentHistorical: { positive: 12, negative: 1, neutral: 1 }, score: 90 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', impactLevel: 'medium', sentiment: 'flat', mentionCount: 7, sentimentHistorical: { positive: 1, negative: 5, neutral: 1 }, score: 45 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', impactLevel: 'high', sentiment: 'down', mentionCount: 4, sentimentHistorical: { positive: 3, negative: 1, neutral: 0 }, score: 23 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', impactLevel: 'high', sentiment: 'up', mentionCount: 34, sentimentHistorical: { positive: 24, negative: 5, neutral: 4 }, score: 69 },
  { symbol: 'ASML', name: 'ASML Holding N.V.', impactLevel: 'high', sentiment: 'up', mentionCount: 12, sentimentHistorical: { positive: 10, negative: 1, neutral: 1 }, score: 78 },
];

// Top 4 stocks for cards row
export const topTrendingStocks: TickerAnalysis[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', impactLevel: 'high', sentiment: 'up', mentionCount: 14, sentimentHistorical: { positive: 12, negative: 2, neutral: 4 }, score: 85 },
  { symbol: 'AAPL', name: 'Apple Inc. \u2022 Nasdaq GS', impactLevel: 'medium', sentiment: 'up', mentionCount: 17, sentimentHistorical: { positive: 12, negative: 3, neutral: 2 }, score: 70 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', impactLevel: 'high', sentiment: 'down', mentionCount: 20, sentimentHistorical: { positive: 4, negative: 14, neutral: 2 }, score: 20 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', impactLevel: 'low', sentiment: 'flat', mentionCount: 31, sentimentHistorical: { positive: 4, negative: 25, neutral: 2 }, score: 42 },
];

// Telegram notification status for watchlist
export const mockTelegramNotifications: TelegramNotificationStatus[] = [
  { symbol: 'NVDA', status: 'SENT', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
  { symbol: 'TSLA', status: 'FAILED', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
  { symbol: 'AAPL', status: 'SENT', timestamp: new Date(Date.now() - 75 * 60 * 1000) },
  { symbol: 'ASML', status: 'PROCESSING', timestamp: new Date(Date.now() - 75 * 60 * 1000) },
];

// AI Intelligence Outlook per stock
export const mockAIOutlook: Record<string, string> = {
  GOOG: "Alphabet's aggressive integration of Gemini 1.5 Pro across Workspace and Search is yielding significant engagement gains. With Google Cloud reaching a $36B annual run rate, the company's AI monetization thesis is strengthening. However, ongoing DOJ antitrust proceedings create material regulatory risk that could reshape the search distribution model.",
  NVDA: "NVIDIA's data center dominance continues to accelerate with Blackwell GPU shipments exceeding expectations. Hyperscaler demand remains robust with all major cloud providers expanding AI infrastructure. Supply constraints are the primary growth limiter, not demand — a strong position heading into FY26.",
  AAPL: "Apple's Vision Pro 2 announcement at a significantly reduced price point signals serious intent in spatial computing. TSMC's improving 3nm yields should help margin expansion. The stock remains range-bound as investors await clearer AI strategy articulation beyond on-device ML.",
  MSFT: "Azure growth deceleration to 28% reflects GPU supply constraints rather than demand weakness. Microsoft's Copilot ecosystem is gaining enterprise traction, but elevated capex through FY26 will pressure near-term margins. The long-term AI platform positioning remains best-in-class.",
  TSLA: "Tesla faces near-term headwinds from the NHTSA FSD recall affecting 350K vehicles. Cold weather software anomalies raise questions about autonomous driving timeline. However, manufacturing efficiency improvements and energy storage growth provide diversification beyond auto sales.",
  AMZN: "Amazon's European logistics expansion through the PostNL acquisition strengthens last-mile delivery across 12 EU countries. AWS remains the cloud market leader but faces intensifying competition from Azure and GCP. Retail margins continue their structural improvement trajectory.",
  MA: "Mastercard's cross-border transaction volumes remain exceptionally strong, benefiting from global travel recovery and digital payment adoption. The company's value-added services segment is growing above 20%, providing high-margin revenue diversification beyond core payment processing.",
  AMD: "AMD's data center GPU portfolio is gaining share against NVIDIA in inference workloads, though training remains dominated by competitors. The Xilinx integration is delivering cost synergies ahead of schedule. Client PC recovery provides cyclical tailwind.",
  SPY: "Broad market sentiment remains cautious as investors weigh strong earnings against elevated valuations and uncertainty around Federal Reserve policy. Sector rotation from growth to value suggests a maturing bull market cycle.",
  META: "Meta's ad revenue reacceleration driven by Reels monetization and AI-powered targeting improvements has exceeded expectations. Reality Labs losses remain elevated but the Quest 3 adoption curve is encouraging. Cost discipline under the 'Year of Efficiency' framework continues to drive margin expansion.",
  GOOGL: "Alphabet's aggressive integration of Gemini 1.5 Pro across Workspace and Search is yielding significant engagement gains. With Google Cloud reaching a $36B annual run rate, the company's AI monetization thesis is strengthening. However, ongoing DOJ antitrust proceedings create material regulatory risk that could reshape the search distribution model.",
};
