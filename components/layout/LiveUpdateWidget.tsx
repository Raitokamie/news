'use client';

import { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { liveUpdate } from '@/lib/api';

export default function LiveUpdateWidget() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#141414] border border-[#4C4C4C] rounded-2xl p-4 relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-[#B3B3B3] hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-bold text-white" style={{ fontSize: '16px' }}>
          Live Update
        </span>
      </div>
      <p className="text-[#B3B3B3] leading-relaxed pr-6 mb-3" style={{ fontSize: '14px' }}>{liveUpdate.headline}</p>
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#222F44] rounded-lg font-medium text-white hover:bg-white/5 transition-colors" style={{ fontSize: '14px' }}>
        See more <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
