'use client';

import { SentimentHistorical } from '@/lib/types';

interface SentimentHistoricalBarProps {
  data: SentimentHistorical;
  showLabels?: boolean;
  height?: number;
}

export default function SentimentHistoricalBar({
  data,
  showLabels = true,
  height = 8,
}: SentimentHistoricalBarProps) {
  const { positive, negative, neutral } = data;
  const total = positive + negative + neutral;

  // Calculate percentages
  const positivePercent = (positive / total) * 100;
  const negativePercent = (negative / total) * 100;
  const neutralPercent = (neutral / total) * 100;

  return (
    <div className="relative w-full min-w-[120px]">
      {/* Labels row */}
      {showLabels && (
        <div className="flex text-xs text-white mb-1">
          <span
            style={{ width: `${positivePercent}%` }}
            className="text-center font-medium"
          >
            {positive > 0 ? positive : ''}
          </span>
          <span
            style={{ width: `${neutralPercent}%` }}
            className="text-center font-medium"
          >
            {neutral > 0 ? neutral : ''}
          </span>
          <span
            style={{ width: `${negativePercent}%` }}
            className="text-center font-medium"
          >
            {negative > 0 ? negative : ''}
          </span>
        </div>
      )}

      {/* Stacked bar */}
      <div
        className="flex w-full rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="bg-[#10B981]"
          style={{ width: `${positivePercent}%` }}
        />
        <div
          className="bg-[#7F7F7F]"
          style={{ width: `${neutralPercent}%` }}
        />
        <div
          className="bg-[#EF4444]"
          style={{ width: `${negativePercent}%` }}
        />
      </div>
    </div>
  );
}
