'use client';

interface SentimentDonutChartProps {
  historical: { positive: number; neutral: number; negative: number };
  mentionCount: number;
}

export default function SentimentDonutChart({ historical, mentionCount }: SentimentDonutChartProps) {
  const { positive, neutral, negative } = historical;
  const total = positive + neutral + negative;

  const negPct = Math.round((negative / total) * 100);
  const neuPct = Math.round((neutral / total) * 100);
  const posPct = 100 - negPct - neuPct;

  // Determine dominant sentiment
  const dominant =
    negative >= positive && negative >= neutral
      ? { label: 'Negative', pct: negPct, color: '#EF4444' }
      : positive >= neutral
        ? { label: 'Positive', pct: posPct, color: '#10B981' }
        : { label: 'Neutral', pct: neuPct, color: '#7F7F7F' };

  // SVG donut params
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment offsets (order: negative → neutral → positive, starting at 12 o'clock)
  const negLen = (negPct / 100) * circumference;
  const neuLen = (neuPct / 100) * circumference;
  const posLen = (posPct / 100) * circumference;

  const negOffset = 0;
  const neuOffset = -(negLen);
  const posOffset = -(negLen + neuLen);

  return (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white">Historical Sentiment</h3>
        <span className="text-sm font-bold text-white bg-[#333333] px-3 py-1 rounded-full">{mentionCount} mention</span>
      </div>

      {/* Donut */}
      <div className="flex justify-center items-center mb-5 flex-1">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#2A2A2A"
              strokeWidth={strokeWidth}
            />
            {/* Negative (red) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#EF4444"
              strokeWidth={strokeWidth}
              strokeDasharray={`${negLen} ${circumference - negLen}`}
              strokeDashoffset={negOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Neutral (gray) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#7F7F7F"
              strokeWidth={strokeWidth}
              strokeDasharray={`${neuLen} ${circumference - neuLen}`}
              strokeDashoffset={neuOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Positive (green) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${posLen} ${circumference - posLen}`}
              strokeDashoffset={posOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{dominant.pct}%</span>
            <span className="text-base font-medium text-white">{dominant.label}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-start justify-between px-4">
        <div className="flex items-start gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EF4444] mt-1.5" />
          <div className="flex flex-col items-start">
            <span className="text-sm text-white font-extrabold">Negative</span>
            <span className="text-base text-white font-extrabold">{negPct}%({negative})</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7F7F7F] mt-1.5" />
          <div className="flex flex-col items-start">
            <span className="text-sm text-white font-extrabold">Neutral</span>
            <span className="text-base text-white font-extrabold">{neuPct}%({neutral})</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-3 h-3 rounded-full bg-[#10B981] mt-1.5" />
          <div className="flex flex-col items-start">
            <span className="text-sm text-white font-extrabold">Positive</span>
            <span className="text-base text-white font-extrabold">{posPct}%({positive})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
