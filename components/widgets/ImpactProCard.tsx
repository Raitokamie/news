'use client';

import { BadgeCheck } from 'lucide-react';

export default function ImpactProCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#111722' }}>
      {/* Gradient overlay - blue in top right */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#0D7FF2]/60" />

      <div className="relative p-4">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3 mb-4">
          <BadgeCheck size={40} className="text-white" strokeWidth={1.5} />
          <span className="font-bold text-white" style={{ fontFamily: 'var(--font-poppins)', fontSize: '16px' }}>
            Impact Pro
          </span>
        </div>

        {/* Main text */}
        <p className="font-normal text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-poppins)', fontSize: '14px' }}>
          Unlock real-time sentiment API
          <br />
          and institutional flow
        </p>

        {/* Upgrade button */}
        <button className="px-4 py-1.5 border border-[#0D7FF2] rounded-lg text-[#0D7FF2] font-extrabold uppercase hover:bg-[#0D7FF2]/10 transition-colors" style={{ fontSize: '12px', borderRadius: '8px' }}>
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
