'use client';

import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { liveUpdate } from '@/lib/mock-data';

export default function LiveUpdateWidget() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-lg p-3 relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2.5 right-2.5 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X size={12} />
      </button>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Live Update
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed pr-3">{liveUpdate.headline}</p>
      <button className="mt-2 flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
        See more <ChevronRight size={10} />
      </button>
    </div>
  );
}
