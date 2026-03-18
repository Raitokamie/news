'use client';

import { useState, useRef, useEffect } from 'react';
import { TickerAnalysis, ImpactLevel } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const ROWS_PER_PAGE_OPTIONS = [10, 50, 100] as const;
import { cn } from '@/lib/utils';
import SentimentHistoricalBar from './SentimentHistoricalBar';

interface TrendDataTableProps {
  items: TickerAnalysis[];
}

const impactConfig: Record<
  ImpactLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  high: {
    label: 'HIGH',
    bg: 'bg-transparent',
    text: 'text-red-400',
    border: 'border border-red-400/20',
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-transparent',
    text: 'text-amber-400',
    border: 'border border-amber-400/20',
  },
  low: {
    label: 'LOW',
    bg: 'bg-transparent',
    text: 'text-blue-400',
    border: 'border border-blue-400/20',
  },
};

const sentimentConfig = {
  up: {
    label: 'Positive',
    icon: TrendingUp,
    textColor: 'text-[#22C55E]',
    iconColor: 'text-[#10B981]',
    bg: 'bg-[#17382D]',
  },
  down: {
    label: 'Negative',
    icon: TrendingDown,
    textColor: 'text-[#EF4444]',
    iconColor: 'text-[#EF4444]',
    bg: 'bg-[#2F1E1E]',
  },
  flat: {
    label: 'Neutral',
    icon: Minus,
    textColor: 'text-[#808080]',
    iconColor: 'text-[#808080]',
    bg: 'bg-[#262626]',
  },
};

export default function TrendDataTable({ items }: TrendDataTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(e.target as Node)) {
        setRowsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to first page
    setRowsDropdownOpen(false);
  };

  const totalPages = Math.ceil(items.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="border border-[#222F44] rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[#222F44]">
            <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              TICKER
            </th>
            <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              IMPACT
            </th>
            <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              SENTIMENT
            </th>
            <th className="text-center text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              MENTION
            </th>
            <th className="text-left text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              SENTIMENT HISTORICAL
            </th>
            <th className="text-right text-xs font-bold text-white uppercase tracking-wider px-4 py-3">
              SCORE
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => {
            const impact = impactConfig[item.impactLevel];
            const sentiment = sentimentConfig[item.sentiment];
            const SentimentIcon = sentiment.icon;

            return (
              <tr
                key={item.symbol}
                className="border-b border-[#222F44] hover:bg-white/5 transition-colors"
              >
                {/* Ticker */}
                <td className="px-4 py-3">
                  <span className="text-[#0D7FF2] font-bold text-sm">
                    ${item.symbol}
                  </span>
                </td>

                {/* Impact Badge */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'text-xs font-bold px-4 py-1.5 rounded-full',
                      impact.bg,
                      impact.text,
                      impact.border
                    )}
                  >
                    {impact.label}
                  </span>
                </td>

                {/* Sentiment */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
                      sentiment.bg
                    )}
                  >
                    <SentimentIcon size={14} className={sentiment.iconColor} />
                    <span className={sentiment.textColor}>{sentiment.label}</span>
                  </span>
                </td>

                {/* Mention Count */}
                <td className="px-4 py-3 text-center">
                  <span className="text-white text-sm font-bold">{item.mentionCount}</span>
                </td>

                {/* Sentiment Historical Bar */}
                <td className="px-4 py-3">
                  <SentimentHistoricalBar data={item.sentimentHistorical} height={6} />
                </td>

                {/* Score */}
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full border border-[#222F44] text-white font-bold text-sm">
                    {item.score}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#222F44]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">Rows per page:</span>
          <div className="relative" ref={rowsDropdownRef}>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#333333] text-white text-sm"
              onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
            >
              {rowsPerPage}
              <ChevronDown size={14} className={cn('transition-transform', rowsDropdownOpen && 'rotate-180')} />
            </button>
            {rowsDropdownOpen && (
              <div className="absolute bottom-full mb-1 left-0 z-50 bg-[#1A1A1A] border border-[#333333] rounded-lg shadow-xl overflow-hidden min-w-[60px]">
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRowsPerPageChange(option)}
                    className={cn(
                      'block w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors',
                      rowsPerPage === option ? 'text-[#0D7FF2] bg-white/5' : 'text-white'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
