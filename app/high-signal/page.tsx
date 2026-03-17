'use client';

import { useState, useRef, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import RightSidebar from '@/components/layout/RightSidebar';
import { SentimentHistoricalBar } from '@/components/market-trends';
import { mockStockSentiment } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Rss, X, Plus, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const { trackedTickers, addTicker, removeTicker } = useTerminalStore();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  const availableToAdd = mockStockSentiment
    .map((r) => r.symbol)
    .filter((s) => !trackedTickers.includes(s));

  useEffect(() => {
    if (!addOpen) return;
    function handleClick(e: MouseEvent) {
      if (addRef.current && !addRef.current.contains(e.target as Node)) setAddOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [addOpen]);

  const rows = mockStockSentiment.filter((r) => trackedTickers.includes(r.symbol));
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paged = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="flex h-full bg-[#0d0d0d]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Center content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rss size={20} className="text-white" />
              <h1 className="text-lg font-extrabold text-white uppercase tracking-wide">
                STOCK SENTIMENT
              </h1>
            </div>

            {/* Range selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Range:</span>
              <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2">
                Last 24H
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Ticker Filter Bar */}
          <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
            <div className="relative" ref={addRef}>
              <button
                onClick={() => setAddOpen(!addOpen)}
                className="flex items-center gap-2 bg-[#0D7FF2] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#0B6FD4] transition-colors"
              >
                <Plus size={14} />
                ADD
              </button>
              {addOpen && availableToAdd.length > 0 && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {availableToAdd.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => { addTicker(symbol); setAddOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {trackedTickers.map((symbol) => (
              <div
                key={symbol}
                className="flex items-center gap-2 bg-[#2A2A2A] border border-[#4D4D4D] text-white text-sm font-medium px-4 py-2 rounded-full"
              >
                {symbol}
                <button
                  onClick={() => removeTicker(symbol)}
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
            <div className="overflow-x-auto border border-[#333333] rounded-xl overflow-hidden">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#333333]">
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
                    const impact = impactConfig[row.impact];
                    const sent = sentimentConfig[row.sentiment];
                    const SentIcon = sent.icon;

                    return (
                      <tr key={row.symbol} className="border-b border-[#333333] hover:bg-white/5 transition-colors">
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
                          <SentimentHistoricalBar data={row.historical} height={6} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full border border-[#333333] text-white font-bold text-sm">
                            {row.score}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#333333]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">Rows per page:</span>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#333333] text-white text-sm">
                    {rowsPerPage}
                    <ChevronDown size={14} />
                  </button>
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
