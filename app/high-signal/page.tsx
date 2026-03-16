'use client';

import { useState, useRef, useEffect } from 'react';
import TopBar from '@/components/layout/TopBar';
import TickerCloud from '@/components/tickers/TickerCloud';
import ImpactProCard from '@/components/widgets/ImpactProCard';
import { mockStockSentiment } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Rss, X, Plus, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImpactLevel } from '@/lib/types';

const impactStyle: Record<ImpactLevel, { label: string; bg: string; text: string }> = {
  high: { label: 'HIGH', bg: 'bg-red-500/15', text: 'text-red-400' },
  medium: { label: 'MEDIUM', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  low: { label: 'LOW', bg: 'bg-blue-500/15', text: 'text-blue-400' },
};

const sentimentStyle = {
  up: { Icon: TrendingUp, bg: 'bg-green-500/15', text: 'text-green-400' },
  down: { Icon: TrendingDown, bg: 'bg-red-500/15', text: 'text-red-400' },
  flat: { Icon: Minus, bg: 'bg-slate-500/15', text: 'text-slate-400' },
} as const;

const ROWS_OPTIONS = [10, 20, 50];

export default function StockSentimentPage() {
  const { trackedTickers, addTicker, removeTicker } = useTerminalStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#4D4D4D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
              <Rss size={14} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-white uppercase">Stock Sentiment</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Range:</span>
            <button className="flex items-center gap-1 bg-[#1A1A1A] border border-[#4D4D4D] rounded-md px-3 py-1.5 text-white text-xs">
              Last 24H
              <ChevronDown size={12} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Ticker Filter Bar */}
        <div className="px-4 py-3 border-b border-[#4D4D4D] flex flex-wrap items-center gap-2">
          <div className="relative" ref={addRef}>
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="flex items-center gap-1 bg-[#0D7FF2] text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-[#0B6FD4] transition-colors"
            >
              <Plus size={14} />
              ADD
            </button>
            {addOpen && availableToAdd.length > 0 && (
              <div className="absolute top-full mt-1 left-0 z-50 bg-[#1A1A1A] border border-[#4D4D4D] rounded-md shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                {availableToAdd.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => { addTicker(symbol); setAddOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-white/10 transition-colors"
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
              className="flex items-center gap-1.5 bg-[#2A2A2A] border border-[#4D4D4D] text-white text-xs font-medium px-2.5 py-1.5 rounded-md"
            >
              {symbol}
              <button
                onClick={() => removeTicker(symbol)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto rounded-xl border border-[#4D4D4D]">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-[#4D4D4D] bg-[#1A1A1A]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticker</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Impact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mention</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment Historical</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4D4D4D] bg-[#1A1A1A]">
                {paged.map((row) => {
                  const impact = impactStyle[row.impact];
                  const sent = sentimentStyle[row.sentiment];
                  const SentIcon = sent.Icon;
                  const scoreColor = row.score > 0 ? 'text-green-400 bg-green-500/15' : row.score < 0 ? 'text-red-400 bg-red-500/15' : 'text-slate-400 bg-slate-500/15';

                  return (
                    <tr key={row.symbol} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-cyan-400">${row.symbol}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('text-xs font-bold px-2 py-1 rounded-md', impact.bg, impact.text)}>
                          {impact.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md', sent.bg, sent.text)}>
                          <SentIcon size={12} />
                          {row.sentimentLabel}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center text-white font-semibold">{row.mentionCount}</td>
                      <td className="px-4 py-3.5">
                        <SentimentBar historical={row.historical} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-center">
                          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', scoreColor)}>
                            {row.score}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-md px-2 py-1 text-white text-xs"
              >
                {ROWS_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="hidden xl:flex w-64 shrink-0 border-l border-[#4D4D4D] overflow-y-auto p-4 flex-col gap-4">
        <ImpactProCard />
        <TickerCloud />
      </aside>
    </div>
  );
}

function SentimentBar({ historical }: { historical: { positive: number; neutral: number; negative: number } }) {
  const total = historical.positive + historical.neutral + historical.negative;
  if (total === 0) return null;

  const segments = [
    { value: historical.positive, color: 'bg-green-500', label: historical.positive },
    { value: historical.neutral, color: 'bg-slate-500', label: historical.neutral },
    { value: historical.negative, color: 'bg-red-500', label: historical.negative },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex h-6 rounded-md overflow-hidden min-w-[180px]">
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{ width: `${(seg.value / total) * 100}%` }}
          className={cn('flex items-center justify-center text-xs font-semibold text-white', seg.color)}
        >
          {seg.label}
        </div>
      ))}
    </div>
  );
}
