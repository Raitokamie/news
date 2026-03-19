export type AssetType = 'stock' | 'etf' | 'crypto';
export type Exchange = 'NASDAQ' | 'NYSE' | 'SET' | 'CRYPTO' | 'LSE' | 'TSE';

export interface SearchableStock {
  symbol: string;
  name: string;
  type: AssetType;
  exchange: Exchange;
  sentiment?: 'up' | 'down' | 'flat';
  score?: number;
}

export const searchableStocks: SearchableStock[] = [
  // ── US Stocks ───────────────────────────────────────
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 85 },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 70 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 60 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 75 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'down', score: 20 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'down', score: 20 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 69 },
  { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'down', score: 30 },
  { symbol: 'MA', name: 'Mastercard Incorporated', type: 'stock', exchange: 'NYSE', sentiment: 'up', score: 90 },
  { symbol: 'COIN', name: 'Coinbase Global, Inc.', type: 'stock', exchange: 'NASDAQ', sentiment: 'down', score: 35 },
  { symbol: 'MSTR', name: 'MicroStrategy Incorporated', type: 'stock', exchange: 'NASDAQ', sentiment: 'down', score: 28 },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', type: 'stock', exchange: 'NYSE', sentiment: 'up', score: 62 },
  { symbol: 'CVX', name: 'Chevron Corporation', type: 'stock', exchange: 'NYSE', sentiment: 'up', score: 58 },
  { symbol: 'BABA', name: 'Alibaba Group Holding Limited', type: 'stock', exchange: 'NYSE', sentiment: 'down', score: 32 },

  // ── ETFs ─────────────────────────────────────────────
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf', exchange: 'NYSE', sentiment: 'down', score: 23 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust Series 1', type: 'etf', exchange: 'NASDAQ', sentiment: 'up', score: 55 },
  { symbol: 'EWG', name: 'iShares MSCI Germany ETF', type: 'etf', exchange: 'NYSE', sentiment: 'up', score: 50 },
  { symbol: 'FXE', name: 'Invesco CurrencyShares Euro ETF', type: 'etf', exchange: 'NYSE', sentiment: 'up', score: 48 },
  { symbol: 'FXI', name: 'iShares China Large-Cap ETF', type: 'etf', exchange: 'NYSE', sentiment: 'down', score: 22 },
  { symbol: 'FXY', name: 'Invesco CurrencyShares Japanese Yen ETF', type: 'etf', exchange: 'NYSE', sentiment: 'down', score: 30 },
  { symbol: 'EWJ', name: 'iShares MSCI Japan ETF', type: 'etf', exchange: 'NYSE', sentiment: 'up', score: 45 },

  // ── Thai Stocks (SET) ────────────────────────────────
  { symbol: 'GULF', name: 'Gulf Energy Development PCL', type: 'stock', exchange: 'SET', sentiment: 'up', score: 55 },
  { symbol: 'PTT', name: 'PTT Public Company Limited', type: 'stock', exchange: 'SET', sentiment: 'flat', score: 50 },
  { symbol: 'SCB', name: 'SCB X Public Company Limited', type: 'stock', exchange: 'SET', sentiment: 'flat', score: 48 },
  { symbol: 'BDMS', name: 'Bangkok Dusit Medical Services PCL', type: 'stock', exchange: 'SET', sentiment: 'up', score: 52 },
  { symbol: 'DELTA', name: 'Delta Electronics (Thailand) PCL', type: 'stock', exchange: 'SET', sentiment: 'up', score: 60 },
  { symbol: 'CPALL', name: 'CP ALL Public Company Limited', type: 'stock', exchange: 'SET', sentiment: 'up', score: 57 },

  // ── EU Stocks ────────────────────────────────────────
  { symbol: 'ASML', name: 'ASML Holding N.V.', type: 'stock', exchange: 'NASDAQ', sentiment: 'up', score: 78 },

  // ── Crypto ───────────────────────────────────────────
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', exchange: 'CRYPTO', sentiment: 'up', score: 72 },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', exchange: 'CRYPTO', sentiment: 'up', score: 65 },
  { symbol: 'SOL', name: 'Solana', type: 'crypto', exchange: 'CRYPTO', sentiment: 'up', score: 60 },
];
