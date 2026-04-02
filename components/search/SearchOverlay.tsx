'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { mockMarketTrends, mockNews } from '@/lib/api';
import { TickerAnalysis, NewsItem } from '@/lib/types';
import { useTerminalStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';

type SearchTab = 'stocks' | 'news';

// Deterministic avatar colour per symbol
const AVATAR_PALETTE = [
  '#2962FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];
function symbolColor(sym: string): string {
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = sym.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

function fuzzyMatch(query: string, ...targets: string[]): boolean {
  const q = query.toLowerCase();
  return targets.some((t) => t.toLowerCase().includes(q));
}

// ─── Category badge styling ──────────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, { color: string; bg: string }> = {
  markets: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  economy: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  geopolitics: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  tech: { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  ai: { color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  crypto: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  energy: { color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  commodities: { color: '#84CC16', bg: 'rgba(132,204,22,0.12)' },
  healthcare: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'real-estate': { color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  climate: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  defense: { color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  banking: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)' },
};

const SENTIMENT_COLOR: Record<string, string> = {
  good: '#10B981',
  bad: '#EF4444',
  neutral: '#475569',
};

// ─── Stock Row ────────────────────────────────────────────────────────────────
interface StockRowProps {
  stock: TickerAnalysis;
  isHighlighted: boolean;
  isSelected: boolean;
  isLast: boolean;
  onClick: () => void;
  onHover: () => void;
}

function StockRow({ stock, isHighlighted, isSelected, isLast, onClick, onHover }: StockRowProps) {
  const color = symbolColor(stock.symbol);

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-[10px] text-left transition-all duration-100 relative',
        isHighlighted ? 'bg-white/[0.07]' : 'hover:bg-white/[0.05]',
        !isLast && 'border-b border-white/[0.06]',
      )}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {/* Blue left accent bar on highlight */}
      {isHighlighted && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-[#2962FF]" />
      )}

      {/* Circular avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold"
        style={{ backgroundColor: color + '22', color }}
      >
        {stock.symbol[0]}
      </div>

      {/* Symbol + full name */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[14px] font-semibold text-white leading-tight tracking-wide">
          {stock.symbol}
        </span>
        <span className="text-[12px] text-slate-400 truncate leading-tight mt-0.5">
          {stock.name}
        </span>
      </div>

      {/* Impact level */}
      <span className="text-[11px] text-slate-500 shrink-0 w-14 text-right uppercase">
        {stock.impactLevel}
      </span>

      {/* Selection checkmark or sentiment dot */}
      {isSelected ? (
        <span className="w-5 h-5 rounded-full bg-[#2962FF] flex items-center justify-center shrink-0">
          <Check size={12} className="text-white" />
        </span>
      ) : (
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{
            backgroundColor:
              stock.sentiment === 'up' ? '#10B981' :
                stock.sentiment === 'down' ? '#EF4444' :
                  '#475569',
          }}
        />
      )}
    </button>
  );
}

// ─── News Row ─────────────────────────────────────────────────────────────────
interface NewsRowProps {
  item: NewsItem;
  isHighlighted: boolean;
  isLast: boolean;
  onClick: () => void;
  onHover: () => void;
}

const IMPACT_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'HIGH', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  medium: { label: 'MED', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  low: { label: 'LOW', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

function NewsRow({ item, isHighlighted, isLast, onClick, onHover }: NewsRowProps) {
  const badge = IMPACT_BADGE[item.impact] ?? IMPACT_BADGE.low;
  const catStyle = CATEGORY_STYLE[item.category] ?? { color: '#64748B', bg: 'rgba(100,116,139,0.12)' };
  const sentimentDot = SENTIMENT_COLOR[item.sentiment] ?? SENTIMENT_COLOR.neutral;

  return (
    <button
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-100 relative',
        isHighlighted ? 'bg-white/[0.07]' : 'hover:bg-white/[0.05]',
        !isLast && 'border-b border-white/[0.06]',
      )}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {isHighlighted && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-[#2962FF]" />
      )}

      {/* Headline + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-slate-200 line-clamp-2 leading-snug">{item.headline}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {/* Impact badge */}
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide"
            style={{ color: badge.color, backgroundColor: badge.bg }}
          >
            {badge.label}
          </span>
          {/* Category badge */}
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded capitalize tracking-wide"
            style={{ color: catStyle.color, backgroundColor: catStyle.bg }}
          >
            {item.category}
          </span>
          <span className="text-[11px] text-slate-500">{timeAgo(item.publishedAt)}</span>
          {item.tickers.slice(0, 3).map((t) => (
            <span
              key={t.symbol}
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.07] text-slate-400"
            >
              ${t.symbol}
            </span>
          ))}
        </div>
      </div>

      {/* Sentiment dot (moved to the right edge to match StockRow) */}
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
        style={{ backgroundColor: sentimentDot, boxShadow: `0 0 8px ${sentimentDot}33` }}
      />
    </button>
  );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────
export default function SearchOverlay() {
  const { closeSearchOverlay, toggleSymbol, selectedSymbols, setScrollToNewsId, setCategory, setImpact, setCountry, setRegion, setMobileSentiment } = useTerminalStore();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('stocks');
  const [highlightedIdx, setHighlighted] = useState(0);
  const [newsLimit, setNewsLimit] = useState(20);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredStocks = useMemo<TickerAnalysis[]>(() => {
    if (!query.trim()) return mockMarketTrends;
    return mockMarketTrends.filter((s) => fuzzyMatch(query, s.symbol, s.name));
  }, [query]);

  const filteredNews = useMemo<NewsItem[]>(() => {
    // Sort by latest first
    const sorted = [...mockNews].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    if (!query.trim()) return sorted; // Show all news instead of just top 10/20
    return sorted.filter((n) =>
      fuzzyMatch(query, n.headline, n.body, n.category, n.sources[0]?.name || '', ...n.tickers.map((t) => t.symbol), ...n.tickers.map((t) => t.name))
    );
  }, [query]);

  const visibleNews = filteredNews.slice(0, newsLimit);
  const hasMoreNews = filteredNews.length > newsLimit;

  const results = activeTab === 'stocks' ? filteredStocks : filteredNews;
  useEffect(() => { setHighlighted(0); setNewsLimit(20); }, [query, activeTab]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => closeSearchOverlay(), [closeSearchOverlay]);

  const handleSelectStock = useCallback((symbol: string) => {
    toggleSymbol(symbol);
  }, [toggleSymbol]);

  const handleSelectNews = useCallback((item: NewsItem) => {
    // Reset filters so the news card is visible
    setCategory('all');
    setImpact('all');
    setCountry('all');
    setRegion('global');

    // Switch mobile sentiment tab to match the selected news
    if (item.sentiment === 'good') {
      setMobileSentiment('good');
    } else {
      setMobileSentiment('bad');
    }

    // Set the news id to scroll to
    setScrollToNewsId(item.id);

    // Navigate to dashboard if not already there
    if (pathname !== '/') {
      router.push('/');
    }

    closeSearchOverlay();
  }, [closeSearchOverlay, setScrollToNewsId, setCategory, setImpact, setCountry, setRegion, setMobileSentiment, pathname, router]);

  const visibleResults = activeTab === 'stocks' ? filteredStocks : visibleNews;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, visibleResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && visibleResults.length > 0) {
      e.preventDefault();
      const idx = Math.min(highlightedIdx, visibleResults.length - 1);
      if (activeTab === 'stocks') handleSelectStock(filteredStocks[idx].symbol);
      else handleSelectNews(visibleNews[idx]);
    }
  }, [visibleResults, highlightedIdx, activeTab, filteredStocks, visibleNews, handleClose, handleSelectStock, handleSelectNews]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[8vh]">

      {/* ── Ultra-light backdrop — page stays fully visible ── */}
      <div
        className="absolute inset-0 bg-black/30 animate-[search-backdrop-in_0.1s_ease]"
        onClick={handleClose}
      />

      {/* ── Frosted-glass panel ── */}
      <div
        className="relative w-full max-w-[740px] mx-4 rounded-xl border border-white/[0.09] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-[search-overlay-in_0.18s_cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: 'rgba(13,18,30,0.88)',
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          maxHeight: '80vh',
        }}
        onKeyDown={handleKeyDown}
      >

        {/* ── Search input ─────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
          <Search size={17} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbols or news…"
            className="flex-1 bg-transparent text-[14px] text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded border border-white/10 hover:border-white/20 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.07] text-slate-500 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Selected symbols chips ──────────────────────── */}
        {selectedSymbols.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/[0.07] flex-wrap">
            {selectedSymbols.map((sym) => (
              <span
                key={sym}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2962FF]/15 text-[#2962FF] text-[11px] font-semibold"
              >
                {sym}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSymbol(sym); }}
                  className="hover:text-white transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="flex items-center px-2 border-b border-white/[0.07]">
          {(['stocks', 'news'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors capitalize',
                activeTab === tab
                  ? 'text-white border-[#2962FF]'
                  : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-white/20',
              )}
            >
              {tab === 'stocks' ? 'Symbols' : 'News'}
            </button>
          ))}
        </div>


        {/* ── Results ──────────────────────────────────────── */}
        <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-500">
              <Search size={26} className="opacity-30" />
              <p className="text-[13px]">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              {/* Column header — only for stocks */}
              {activeTab === 'stocks' && (
                <div className="flex items-center px-4 py-2 border-b border-white/[0.06]">
                  <span className="flex-1 text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Symbol</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold w-14 text-right">Impact</span>
                  <span className="w-5" />
                </div>
              )}

              {activeTab === 'stocks'
                ? filteredStocks.map((stock, i) => (
                  <StockRow
                    key={stock.symbol}
                    stock={stock}
                    isHighlighted={i === highlightedIdx}
                    isSelected={selectedSymbols.includes(stock.symbol)}
                    isLast={i === filteredStocks.length - 1}
                    onClick={() => handleSelectStock(stock.symbol)}
                    onHover={() => setHighlighted(i)}
                  />
                ))
                : <>
                  {visibleNews.map((item, i) => (
                    <NewsRow
                      key={item.id}
                      item={item}
                      isHighlighted={i === highlightedIdx}
                      isLast={!hasMoreNews && i === visibleNews.length - 1}
                      onClick={() => handleSelectNews(item)}
                      onHover={() => setHighlighted(i)}
                    />
                  ))}
                  {hasMoreNews && (
                    <button
                      onClick={() => setNewsLimit((l) => l + 20)}
                      className="w-full py-3 text-[13px] font-medium text-[#2962FF] hover:bg-white/[0.05] transition-colors border-t border-white/[0.06]"
                    >
                      Show more ({filteredNews.length - newsLimit} remaining)
                    </button>
                  )}
                </>}
            </>
          )}
        </div>


      </div>
    </div>
  );
}
