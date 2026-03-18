'use client';

import { MarketTrendItem } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopStockCardProps {
  item: MarketTrendItem;
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    iconColor: 'text-[#10B981]',
    bgColor: 'bg-[#17382D]',
  },
  down: {
    icon: TrendingDown,
    iconColor: 'text-[#EF4444]',
    bgColor: 'bg-[#592424]',
  },
  flat: {
    icon: Minus,
    iconColor: 'text-[#808080]',
    bgColor: 'bg-[#262626]',
  },
};

const sentimentConfig = {
  good: { label: 'Positive', dotColor: 'bg-[#10B981]', barColor: 'bg-[#10B981]', textColor: 'text-white' },
  bad: { label: 'NEGATIVE', dotColor: 'bg-[#EF4444]', barColor: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
  neutral: { label: 'Neutral', dotColor: 'bg-[#7F7F7F]', barColor: 'bg-[#7F7F7F]', textColor: 'text-white' },
};

export default function TopStockCard({ item }: TopStockCardProps) {
  const trend = trendConfig[item.trend];
  const sentiment = sentimentConfig[item.sentiment];
  const TrendIcon = trend.icon;
  const scorePercent = (Math.abs(item.impactScore) / 10) * 100;

  return (
    <div className="bg-[#0d0d0d] border border-[#222F44] rounded-xl p-4 flex flex-col gap-3 hover:border-[#666] transition-colors">
      {/* Header: Symbol + Trend Icon */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-base">{item.symbol}</h3>
          <p className="text-[#808080] text-xs">{item.name}</p>
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            trend.bgColor
          )}
        >
          <TrendIcon size={16} className={trend.iconColor} />
        </div>
      </div>

      {/* Impact Score */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-medium">Sentiment Score</span>
          <span className="text-white font-semibold text-sm">
            {item.impactScore}/10
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', sentiment.barColor)}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Sentiment Badge */}
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', sentiment.dotColor)} />
        <span className={cn('text-xs font-medium', sentiment.textColor)}>{sentiment.label}</span>
      </div>
    </div>
  );
}
