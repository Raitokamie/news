'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { SentimentHistoricalBar } from '@/components/market-trends';
import { mockStockSentiment } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Rss, X, Plus, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ImpactLevel } from '@/lib/types';

const impactConfig: Record<ImpactLevel, { label: string; bg: string; text: string; border: string }> = {
  high: { label: 'HIGH', bg: 'bg-transparent', text: 'text-red-400', border: 'border border-red-400/20' },
  medium: { label: 'MEDIUM', bg: 'bg-transparent', text: 'text-amber-400', border: 'border border-amber-400/20' },
  low: { label: 'LOW', bg: 'bg-transparent', text: 'text-blue-400', border: 'border border-blue-400/20' },
};

const sentimentConfig = {
  up: { label: 'Positive', icon: TrendingUp, textColor: 'text-[#22C55E]', iconColor: 'text-[#10B981]', bg: 'bg-[#17382D]' },
  down: { label: 'Negative', icon: TrendingDown, textColor: 'text-[#EF4444]', iconColor: 'text-[#EF4444]', bg: 'bg-[#2F1E1E]' },
  flat: { label: 'Neutral', icon: Minus, textColor: 'text-[#808080]', iconColor: 'text-[#808080]', bg: 'bg-[#262626]' },
};

export default function StockSentimentPage() {
  const router = useRouter();
  const { sentimentTickers, addSentimentTicker, removeSentimentTicker } = useTerminalStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rppOpen, setRppOpen] = useState(false);
  const rppRef = useRef<HTMLDivElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const addRef = useRef<HTMLDivElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Range dropdown state
  type TimeRange = '24H' | '7D' | '30D' | '3M';
  const rangeOptions: { value: TimeRange; label: string }[] = [
    { value: '24H', label: 'Last 24H' },
    { value: '7D', label: 'Last 7D' },
    { value: '30D', label: 'Last 30D' },
    { value: '3M', label: 'Last 3M' },
  ];
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  const currentLabel = rangeOptions.find((o) => o.value === selectedRange)?.label ?? 'Last 24H';

  const availableToAdd = mockStockSentiment
    .map((r) => r.symbol)
    .filter((s) => !sentimentTickers.includes(s));

  const filteredToAdd = addSearch.trim()
    ? availableToAdd.filter((s) => s.toLowerCase().includes(addSearch.trim().toLowerCase()))
    : availableToAdd;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (addRef.current && !addRef.current.contains(e.target as Node)) setAddOpen(false);
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setRangeOpen(false);
      if (rppRef.current && !rppRef.current.contains(e.target as Node)) setRppOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const rows = mockStockSentiment.filter((r) => sentimentTickers.includes(r.symbol));
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paged = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="flex h-full bg-[#0a1017]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Center content area */}
        <div className="flex-1 overflow-y-auto pb-28 md:pb-0">
          {/* Header */}
          <div className="px-4 md:px-6 py-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Rss size={18} className="text-white md:w-5 md:h-5" />
              <h1 className="text-base md:text-lg font-extrabold text-white uppercase tracking-wide whitespace-nowrap">
                STOCK SENTIMENT
              </h1>
            </div>

            {/* Range selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-white hidden sm:inline">Range:</span>
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setRangeOpen(!rangeOpen)}
                  className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222F44] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                >
                  {currentLabel}
                  <ChevronDown size={12} className={cn('text-white transition-transform', rangeOpen && 'rotate-180')} />
                </button>
                {rangeOpen && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                    {rangeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSelectedRange(opt.value); setRangeOpen(false); }}
                        className={cn(
                          'block w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-white/8 transition-colors',
                          selectedRange === opt.value ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticker Filter Bar */}
          <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
            <div className="relative" ref={addRef}>
              <button
                onClick={() => { setAddOpen(!addOpen); setAddSearch(''); setTimeout(() => addInputRef.current?.focus(), 0); }}
                className="flex items-center gap-2 bg-[#0D7FF2] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0B6FD4] transition-colors"
              >
                <Plus size={14} />
                ADD
              </button>
              {addOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#222F44] rounded-lg shadow-xl overflow-hidden w-56">
                  <div className="px-3 py-2 border-b border-[#222F44]">
                    <div className="flex items-center gap-2 bg-[#111722] rounded-lg px-2 py-1.5">
                      <Search size={13} className="text-slate-500 shrink-0" />
                      <input
                        ref={addInputRef}
                        type="text"
                        value={addSearch}
                        onChange={(e) => setAddSearch(e.target.value)}
                        placeholder="Search symbol…"
                        className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredToAdd.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-slate-500">
                        {addSearch.trim() ? 'No matches' : 'No more tickers'}
                      </div>
                    ) : (
                      filteredToAdd.map((symbol) => (
                        <button
                          key={symbol}
                          onClick={() => { addSentimentTicker(symbol); setAddOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          {symbol}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {sentimentTickers.map((symbol) => (
              <div
                key={symbol}
                className="flex items-center gap-2 bg-[#2A2A2A] border border-[#222F44] text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                {symbol}
                <button
                  onClick={() => removeSentimentTicker(symbol)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-0 flex flex-col gap-4">
            {/* Table */}
            <div className="border border-[#222F44] rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#222F44]">
                      <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Ticker</th>
                      <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Impact</th>
                      <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Sentiment</th>
                      <th className="text-center text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Mention</th>
                      <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Sentiment Historical</th>
                      <th className="text-right text-xs font-bold text-white uppercase tracking-wider px-4 py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((row) => {
                      const impact = impactConfig[row.impactLevel];
                      const sent = sentimentConfig[row.sentiment];
                      const SentIcon = sent.icon;

                      return (
                        <tr key={row.symbol} onClick={() => router.push(`/stock-sentiment/${row.symbol.toLowerCase()}`)} className="border-b border-[#222F44] hover:bg-white/5 transition-colors cursor-pointer">
                          <td className="px-4 py-3">
                            <span className="text-[#0D7FF2] font-bold text-sm">${row.symbol}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('text-xs font-bold px-4 py-1.5 rounded-full', impact.bg, impact.text, impact.border)}>
                              {impact.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold', sent.bg)}>
                              <SentIcon size={14} className={sent.iconColor} />
                              <span className={sent.textColor}>{sent.label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-white text-sm font-bold">{row.mentionCount}</span>
                          </td>
                          <td className="px-4 py-3">
                            <SentimentHistoricalBar data={row.sentimentHistorical} height={6} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full border border-[#222F44] text-white font-bold text-sm">
                              {row.score}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination — outside overflow-x-auto so dropdown is not clipped */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#222F44]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Rows per page:</span>
                  <div className="relative" ref={rppRef}>
                    <button
                      onClick={() => setRppOpen(!rppOpen)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#333333] text-white text-sm hover:bg-[#444] transition-colors"
                    >
                      {rowsPerPage}
                      <ChevronDown size={14} className={cn('transition-transform', rppOpen && 'rotate-180')} />
                    </button>
                    {rppOpen && (
                      <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden">
                        {[10, 50, 100].map((n) => (
                          <button
                            key={n}
                            onClick={() => { setRowsPerPage(n); setPage(0); setRppOpen(false); }}
                            className={cn(
                              'block w-full text-left px-4 py-2 text-sm font-bold hover:bg-white/8 transition-colors',
                              rowsPerPage === n ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
}
