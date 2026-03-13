'use client';

import { CheckCircle2, Zap } from 'lucide-react';

const features = [
  'Real-time sentiment API',
  'Institutional flow data',
  'Priority alert delivery',
  'Advanced ticker filters',
];

export default function ImpactProCard() {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#4D4D4D]">
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-[#1a2540] to-[#0d1a35]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/10" />

      <div className="relative p-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full px-2.5 py-1 mb-3">
          <CheckCircle2 size={11} className="text-cyan-400" />
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Impact Pro</span>
        </div>

        <h3 className="text-sm font-bold text-white mb-1">
          Unlock real-time sentiment API
        </h3>
        <p className="text-sm text-slate-400 mb-3 leading-relaxed">
          and institutional flow
        </p>

        <ul className="space-y-1 mb-4">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0c0e14] font-bold text-xs py-2 rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">
          <Zap size={12} />
          UPGRADE NOW
        </button>
      </div>
    </div>
  );
}
