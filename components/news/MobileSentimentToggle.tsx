'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTerminalStore } from '@/lib/store';

export default function MobileSentimentToggle() {
  const { mobileSentiment, setMobileSentiment } = useTerminalStore();

  return (
    <div className="flex items-center justify-between">
      {/* Left side: Icon + Label */}
      <div className="flex items-center gap-2">
        {mobileSentiment === 'bad' ? (
          <TrendingDown size={20} className="text-red-400" />
        ) : (
          <TrendingUp size={20} className="text-green-400" />
        )}
        <span
          className={cn(
            'text-sm font-bold uppercase tracking-wider',
            mobileSentiment === 'bad' ? 'text-red-400' : 'text-green-400'
          )}
        >
          {mobileSentiment === 'bad' ? 'BAD SENTIMENT' : 'GOOD SENTIMENT'}
        </span>
      </div>

      {/* Right side: Toggle buttons */}
      <div className="flex rounded-lg overflow-hidden border border-[#222F44]">
        <button
          onClick={() => setMobileSentiment('bad')}
          className={cn(
            'px-4 py-1.5 text-xs font-bold transition-colors',
            mobileSentiment === 'bad'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-transparent text-slate-400 hover:bg-white/5'
          )}
        >
          BAD
        </button>
        <button
          onClick={() => setMobileSentiment('good')}
          className={cn(
            'px-4 py-1.5 text-xs font-bold transition-colors',
            mobileSentiment === 'good'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-transparent text-slate-400 hover:bg-white/5'
          )}
        >
          GOOD
        </button>
      </div>
    </div>
  );
}
