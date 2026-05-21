'use client';

import { useEffect, useRef } from 'react';
import { useTerminalStore } from '@/lib/store';
import { NewsItem } from '@/lib/types';

// Pool of simulated news events
const SIMULATED_NEWS_POOL = [
  {
    id: 'sim-tsla-1',
    headline: 'Tesla faces unexpected European regulatory probe into gigafactory water usage',
    body: 'German environmental regulators have opened an inquiry into Tesla\'s Berlin Gigafactory, potentially halting expansion plans due to local water consumption concerns. Tesla shares dip 3.4% pre-market.',
    sources: [{ name: 'REUTERS', url: 'https://reuters.com' }],
    regionTag: 'eu',
    countryCode: 'de',
    category: 'tech',
    impact: 'high',
    sentiment: 'bad',
    tickers: [{ symbol: 'TSLA', name: 'Tesla, Inc.', sentiment: 'down', sentimentScore: -7 }],
    imageUrl: 'https://picsum.photos/seed/teslaprobe/800/450'
  },
  {
    id: 'sim-aapl-1',
    headline: 'Apple developers report massive productivity gains from Siri Copilot API beta',
    body: 'Early testing of Siri 2.0\'s developer APIs shows developers automating app workflows with 40% less code. iOS ecosystem loyalty expected to strengthen ahead of autumn release.',
    sources: [{ name: 'BLOOMBERG', url: 'https://bloomberg.com' }],
    regionTag: 'us',
    countryCode: 'us',
    category: 'tech',
    impact: 'medium',
    sentiment: 'good',
    tickers: [{ symbol: 'AAPL', name: 'Apple Inc.', sentiment: 'up', sentimentScore: 6 }],
    imageUrl: 'https://picsum.photos/seed/applesiri2/800/450'
  },
  {
    id: 'sim-msft-1',
    headline: 'Microsoft to host annual AI & Security summit in Seattle this November',
    body: 'Microsoft announced its next major security conference focused entirely on AI threat intelligence and enterprise defensive models. Industry experts from top cybersecurity firms will present.',
    sources: [{ name: 'CNBC', url: 'https://cnbc.com' }],
    regionTag: 'us',
    countryCode: 'us',
    category: 'tech',
    impact: 'low',
    sentiment: 'neutral',
    tickers: [{ symbol: 'MSFT', name: 'Microsoft Corporation', sentiment: 'flat', sentimentScore: 0 }],
  },
  {
    id: 'sim-nvda-1',
    headline: 'NVIDIA announces custom Blackwell supercomputer cluster for major medical research group',
    body: 'A leading global medical consortium has signed a multi-billion dollar agreement to utilize NVIDIA\'s GB200 platform for next-generation drug discovery. Blackwell demand accelerates further.',
    sources: [{ name: 'FT', url: 'https://ft.com' }],
    regionTag: 'us',
    countryCode: 'us',
    category: 'tech',
    impact: 'high',
    sentiment: 'good',
    tickers: [{ symbol: 'NVDA', name: 'NVIDIA Corporation', sentiment: 'up', sentimentScore: 9 }],
    imageUrl: 'https://picsum.photos/seed/nvdaclinic/800/450'
  },
  {
    id: 'sim-amd-1',
    headline: 'AMD clinches major supply deal for European cloud infrastructure expansion',
    body: 'Advanced Micro Devices has won a competitive bidding process to supply its latest MI325X accelerators for a major European sovereign cloud project, positioning itself as a strong competitor.',
    sources: [{ name: 'TECHCRUNCH', url: 'https://techcrunch.com' }],
    regionTag: 'eu',
    countryCode: 'fr',
    category: 'tech',
    impact: 'high',
    sentiment: 'good',
    tickers: [{ symbol: 'AMD', name: 'Advanced Micro Devices', sentiment: 'up', sentimentScore: 7 }],
    imageUrl: 'https://picsum.photos/seed/amdeurope/800/450'
  },
  {
    id: 'sim-coin-1',
    headline: 'Coinbase experiences brief transaction delay due to network congestion',
    body: 'Coinbase users reported delays in withdrawing funds during a sudden spike in crypto trading activity. The issue was resolved in under 2 hours with no security incidents.',
    sources: [{ name: 'COINDESK', url: 'https://coindesk.com' }],
    regionTag: 'global',
    countryCode: 'global',
    category: 'crypto',
    impact: 'medium',
    sentiment: 'bad',
    tickers: [{ symbol: 'COIN', name: 'Coinbase Global, Inc.', sentiment: 'down', sentimentScore: -3 }]
  },
  {
    id: 'sim-googl-1',
    headline: 'US Justice Department pushes for break-up of Google AdTech division',
    body: 'In a landmark antitrust ruling, the DOJ requested the court to force Alphabet to spin off its double-click services, sparking concerns over future advertisement revenue.',
    sources: [{ name: 'WSJ', url: 'https://wsj.com' }],
    regionTag: 'us',
    countryCode: 'us',
    category: 'tech',
    impact: 'high',
    sentiment: 'bad',
    tickers: [{ symbol: 'GOOGL', name: 'Alphabet Inc.', sentiment: 'down', sentimentScore: -8 }],
    imageUrl: 'https://picsum.photos/seed/googlebreakup/800/450'
  },
  {
    id: 'sim-amzn-1',
    headline: 'Amazon rolls out biometric checkout terminals across 500 grocery stores',
    body: 'Amazon announced the wide installation of palm-recognition checkouts across all its retail outlets, aiming to speed up transaction queues by 35% on average.',
    sources: [{ name: 'ENGADGET', url: 'https://engadget.com' }],
    regionTag: 'us',
    countryCode: 'us',
    category: 'tech',
    impact: 'low',
    sentiment: 'good',
    tickers: [{ symbol: 'AMZN', name: 'Amazon.com, Inc.', sentiment: 'up', sentimentScore: 3 }]
  }
];

export default function AutoSimulator() {
  const addNewsItem = useTerminalStore((s) => s.addNewsItem);
  const poolIndexRef = useRef(0);

  useEffect(() => {
    // Initial delay of 15 seconds before the first simulated news item arrives,
    // then every 35 seconds a new event is injected automatically.
    const runSimulation = () => {
      const baseNews = SIMULATED_NEWS_POOL[poolIndexRef.current];
      poolIndexRef.current = (poolIndexRef.current + 1) % SIMULATED_NEWS_POOL.length;

      const newsItem: NewsItem = {
        ...baseNews,
        id: `${baseNews.id}-${Date.now()}`,
        publishedAt: new Date()
      } as NewsItem;

      addNewsItem(newsItem);
    };

    const initialTimeout = setTimeout(() => {
      runSimulation();
      const interval = setInterval(runSimulation, 35000);
      return () => clearInterval(interval);
    }, 15000);

    return () => clearTimeout(initialTimeout);
  }, [addNewsItem]);

  return null;
}
