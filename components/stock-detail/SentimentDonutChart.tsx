'use client';

interface SentimentDonutChartProps {
  historical: { positive: number; neutral: number; negative: number };
  mentionCount: number;
}

type Segment = {
  key: string;
  label: string;
  pct: number;
  count: number;
  color: string;
};

export default function SentimentDonutChart({ historical, mentionCount }: SentimentDonutChartProps) {
  const { positive, neutral, negative } = historical;
  const total = positive + neutral + negative;

  const negPct = Math.round((negative / total) * 100);
  const neuPct = Math.round((neutral / total) * 100);
  const posPct = 100 - negPct - neuPct;

  // Build segments array
  const allSegments: Segment[] = [
    { key: 'positive', label: 'Positive', pct: posPct, count: positive, color: '#10B981' },
    { key: 'neutral', label: 'Neutral', pct: neuPct, count: neutral, color: '#7F7F7F' },
    { key: 'negative', label: 'Negative', pct: negPct, count: negative, color: '#EF4444' },
  ];

  // Sort by percentage descending (dominant first)
  const segments = [...allSegments].sort((a, b) => b.pct - a.pct);
  const dominant = segments[0];

  // SVG donut params
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segment lengths and offsets dynamically
  const segmentLengths = segments.map(s => (s.pct / 100) * circumference);
  const segmentOffsets = segments.map((_, i) => {
    let offset = 0;
    for (let j = 0; j < i; j++) {
      offset -= segmentLengths[j];
    }
    return offset;
  });

  return (
    <div className="bg-[#0a1017] border border-[#333333] rounded-xl p-5 flex flex-col h-full">
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
            {/* Render segments in sorted order (dominant first) */}
            {segments.map((seg, i) => (
              <circle
                key={seg.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLengths[i]} ${circumference - segmentLengths[i]}`}
                strokeDashoffset={segmentOffsets[i]}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{dominant.pct}%</span>
            <span className="text-base font-medium text-white">{dominant.label}</span>
          </div>
        </div>
      </div>

      {/* Legend - ordered by dominant sentiment */}
      <div className="flex items-start justify-between px-4">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: seg.color }} />
            <div className="flex flex-col items-start">
              <span className="text-sm text-white font-extrabold">{seg.label}</span>
              <span className="text-base text-white font-extrabold">{seg.pct}%({seg.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
