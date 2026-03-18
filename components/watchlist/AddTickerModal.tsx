'use client';

import { useRef, useEffect, useMemo } from 'react';
import { mockNews } from '@/lib/api';
import { deriveTickerSummaries } from './WatchlistStocksRow';
import { cn } from '@/lib/utils';

interface AddTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackedTickers: string[];
  onAddTicker: (symbol: string) => void;
}

export default function AddTickerModal({
  isOpen,
  onClose,
  trackedTickers,
  onAddTicker,
}: AddTickerModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const allSummaries = useMemo(() => deriveTickerSummaries(mockNews), []);

  const availableTickers = allSummaries.filter(
    (item) => !trackedTickers.includes(item.symbol)
  );

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#222F44] rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-[#222F44]">
        <p className="text-xs text-slate-400 font-medium">Add to Watchlist</p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {availableTickers.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-slate-500">
            No more tickers available
          </div>
        ) : (
          availableTickers.map((item) => (
            <button
              key={item.symbol}
              onClick={() => {
                onAddTicker(item.symbol);
                onClose();
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors text-left'
              )}
            >
              <div>
                <span className="text-white font-semibold text-sm">
                  {item.symbol}
                </span>
                <p className="text-xs text-slate-500">{item.mentionCount} mentions</p>
              </div>
              <span className="text-xs text-[#0D7FF2]">+ Add</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
