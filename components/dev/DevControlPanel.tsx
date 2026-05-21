'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTerminalStore } from '@/lib/store';
import { Crown, Zap, Play, Pause, Settings, X, PlusCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export default function DevControlPanel() {
  const { userPlan, setUserPlan, addNewsItem, trackedTickers } = useTerminalStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [simInterval, setSimInterval] = useState<number>(20); // seconds
  const poolIndexRef = useRef(0);

  const isPremium = userPlan === 'premium';

  // Manual news generation
  const generateSimulatedNews = () => {
    const baseNews = SIMULATED_NEWS_POOL[poolIndexRef.current];
    
    // Cycle through pool
    poolIndexRef.current = (poolIndexRef.current + 1) % SIMULATED_NEWS_POOL.length;

    // Create news item with current timestamp and unique ID
    const newsItem: NewsItem = {
      ...baseNews,
      id: `${baseNews.id}-${Date.now()}`,
      publishedAt: new Date()
    } as NewsItem;

    addNewsItem(newsItem);
  };

  // Auto-simulation effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (autoSimulate) {
      timer = setInterval(() => {
        generateSimulatedNews();
      }, simInterval * 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoSimulate, simInterval]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Floating control panel */}
      {panelOpen && (
        <div className="bg-[#111722] border border-[#222F44] p-4 rounded-xl shadow-2xl w-72 md:w-80 text-slate-200 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#222F44]">
            <div className="flex items-center gap-2">
              <Settings size={15} className="text-[#0D7FF2]" />
              <span className="font-bold text-xs uppercase tracking-wider text-white">Dev Control Panel</span>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Plan toggle */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Application Tier:</span>
              <button
                onClick={() => setUserPlan(isPremium ? 'free' : 'premium')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all',
                  isPremium
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                )}
              >
                <Crown size={12} />
                {isPremium ? 'Premium (Active)' : 'Free Tier'}
              </button>
            </div>

            {/* Manual generate button */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Manual Simulation:</span>
              <button
                onClick={generateSimulatedNews}
                className="w-full flex items-center justify-center gap-2 bg-[#0D7FF2] hover:bg-[#0B6FD4] text-white font-bold py-2 px-3 rounded-lg transition-colors border border-white/5"
              >
                <Zap size={14} className="text-yellow-300" />
                Inject Simulated News Event
              </button>
            </div>

            {/* Auto simulator toggle */}
            <div className="space-y-2 border-t border-[#222F44] pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium font-semibold text-white">Auto News Injector</span>
                <button
                  onClick={() => setAutoSimulate(!autoSimulate)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border',
                    autoSimulate
                      ? 'bg-green-500/15 border-green-500/30 text-green-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  )}
                >
                  {autoSimulate ? <Pause size={10} /> : <Play size={10} />}
                  {autoSimulate ? 'ON' : 'OFF'}
                </button>
              </div>

              {autoSimulate && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Interval:</span>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={simInterval}
                    onChange={(e) => setSimInterval(Number(e.target.value))}
                    className="flex-1 accent-[#0D7FF2] h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-400 font-semibold w-8 text-right">
                    {simInterval}s
                  </span>
                </div>
              )}
            </div>

            {/* Notification rule info */}
            <div className="bg-[#090d14] border border-[#1f2a3c] rounded-lg p-2.5 text-[11px] leading-relaxed text-slate-400">
              <div className="flex gap-1.5 items-start mb-1 text-white font-bold">
                <Info size={12} className="text-[#0D7FF2] mt-0.5 shrink-0" />
                <span>Notification Rules</span>
              </div>
              <p className="mb-1">
                News alerts will trigger if:
              </p>
              <ul className="list-disc pl-3.5 space-y-0.5">
                <li>News is <strong className="text-red-400">High Impact</strong>, OR</li>
                <li>News contains tickers on your <strong className="text-blue-400">Watchlist</strong>.</li>
              </ul>
              <div className="mt-2 text-slate-500 border-t border-[#1f2a3c] pt-1.5 flex flex-wrap gap-1">
                <span>Watchlist symbols:</span>
                <span className="font-mono text-[#0D7FF2] font-semibold">
                  {trackedTickers.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trigger floating button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-colors shadow-lg',
          panelOpen
            ? 'bg-[#1a2434] border-[#0D7FF2] text-white'
            : isPremium
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-[#1A1A1A] border-[#222F44] text-[#808080] hover:bg-[#2A2A2A]'
        )}
      >
        {autoSimulate ? (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        ) : (
          <Settings size={14} className={panelOpen ? 'animate-spin duration-1000' : ''} />
        )}
        {panelOpen ? 'Close Dev Panel' : 'Dev Panel'}
      </button>
    </div>
  );
}
