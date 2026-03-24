'use client';

import { useRouter } from 'next/navigation';
import { TickerAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopStockCardProps {
  item: TickerAnalysis;
}

const sentimentConfig = {
  up: { icon: TrendingUp, iconColor: 'text-[#10B981]', bgColor: 'bg-[#17382D]', label: 'Positive', dotColor: 'bg-[#10B981]', barColor: 'bg-[#10B981]', textColor: 'text-white' },
  down: { icon: TrendingDown, iconColor: 'text-[#EF4444]', bgColor: 'bg-[#592424]', label: 'Negative', dotColor: 'bg-[#EF4444]', barColor: 'bg-[#EF4444]', textColor: 'text-[#EF4444]' },
  flat: { icon: Minus, iconColor: 'text-[#808080]', bgColor: 'bg-[#262626]', label: 'Neutral', dotColor: 'bg-[#7F7F7F]', barColor: 'bg-[#7F7F7F]', textColor: 'text-white' },
};

export default function TopStockCard({ item }: TopStockCardProps) {
  const router = useRouter();
  const config = sentimentConfig[item.sentiment];
  const TrendIcon = config.icon;
  const scoreNormalized = Math.min(item.score, 100);

  return (
    <div
      onClick={() => router.push(`/stock-sentiment/${item.symbol.toLowerCase()}`)}
      className="bg-[#0a1017] border border-[#222F44] rounded-xl p-4 flex flex-col gap-3 hover:border-[#666] transition-colors cursor-pointer">
      {/* Header: Symbol + Trend Icon */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-base">{item.symbol}</h3>
          <p className="text-[#808080] text-xs line-clamp-2 min-h-[32px]">{item.name}</p>
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
            config.bgColor
          )}
        >
          <TrendIcon size={16} className={config.iconColor} />
        </div>
      </div>

      {/* Sentiment Score */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-medium">Sentiment Score</span>
          <span className="text-white font-semibold text-sm">
            {item.score}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', config.barColor)}
            style={{ width: `${scoreNormalized}%` }}
          />
        </div>
      </div>

      {/* Sentiment Badge */}
      <div className="flex items-center gap-2">
        <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        <span className={cn('text-xs font-medium', config.textColor)}>{config.label}</span>
      </div>
    </div>
  );
}
