'use client';

import { NewsItem, ImpactLevel, Region } from '@/lib/types';
import { cn, timeAgo } from '@/lib/utils';
import TickerChip from '@/components/tickers/TickerChip';

const impactConfig: Record<ImpactLevel, { label: string; bg: string; text: string; border: string }> = {
  high: {
    label: 'HIGH IMPACT',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  medium: {
    label: 'MEDIUM IMPACT',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  low: {
    label: 'LOW IMPACT',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
};

import { Globe } from 'lucide-react';

const sourceColors: Record<string, string> = {
  REUTERS: 'bg-orange-500',
  BLOOMBERG: 'bg-blue-500',
  CNBC: 'bg-yellow-500',
  WSJ: 'bg-slate-400',
  FT: 'bg-pink-400',
  NIKKEI: 'bg-red-500',
  CAIXIN: 'bg-red-600',
  BANGKOKPOST: 'bg-blue-400',
  NATURE: 'bg-green-500',
  SEMI: 'bg-slate-500',
};

function CountryFlag({ code }: { code: Region }) {
  if (code === 'global') return <Globe size={16} className="text-slate-400" />;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={code}
      className="w-5 h-auto rounded-sm"
    />
  );
}

interface NewsCardProps {
  item: NewsItem;
  compact?: boolean;
}

export default function NewsCard({ item, compact = false }: NewsCardProps) {
  const impact = impactConfig[item.impact];
  const sourceName = item.source.charAt(0) + item.source.slice(1).toLowerCase();

  return (
    <article
      className={cn(
        'flex flex-col h-full bg-[#1A1A1A] border border-[#4D4D4D] rounded-xl p-4 transition-all duration-200 hover:border-[#666] hover:bg-[#222222] group cursor-pointer',
        item.impact === 'high' && 'hover:border-red-500/20',
        compact && 'p-3'
      )}
    >
      {/* Header: impact badge + time + flag */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-md border',
            impact.bg, impact.text, impact.border
          )}
        >
          {impact.label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{timeAgo(item.publishedAt)}</span>
          <CountryFlag code={item.countryCode} />
        </div>
      </div>

      {/* Headline */}
      <h3
        className={cn(
          'font-bold text-white leading-snug mb-2 group-hover:text-cyan-50 transition-colors uppercase line-clamp-2',
          compact ? 'text-sm' : 'text-base'
        )}
      >
        {highlightTickers(item.headline)}
      </h3>

      {/* Body */}
      {!compact && (
        <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-3 flex-1">
          {highlightTickers(item.body)}
        </p>
      )}

      {/* Tickers */}
      <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
        {item.tickers.map((t) => (
          <TickerChip
            key={t.symbol}
            symbol={t.symbol}
            trend={t.sentiment}
            showBookmark
          />
        ))}
      </div>

      {/* Footer: source + view more */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className={cn('w-5 h-5 rounded-full', sourceColors[item.source] || 'bg-slate-500')} />
          <span className="text-xs text-slate-400">{sourceName} Reporting</span>
        </div>
        <button className="text-xs text-cyan-400 font-medium hover:text-cyan-300 underline underline-offset-2 transition-colors">
          View more
        </button>
      </div>
    </article>
  );
}

function highlightTickers(text: string) {
  const parts = text.split(/(\$[A-Z]{1,5})/g);
  return parts.map((part, i) =>
    part.startsWith('$') ? (
      <span key={i} className="text-cyan-400 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}
