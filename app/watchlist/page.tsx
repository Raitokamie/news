'use client';

import TopBar from '@/components/layout/TopBar';
import { Send, Star, Bell, Shield, ChevronRight } from 'lucide-react';

export default function WatchlistPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-10">
          {/* Telegram connect card */}
          <div className="relative rounded-2xl overflow-hidden border border-[#4D4D4D] mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2540] to-[#0c1420]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/10" />
            <div className="relative p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-5">
                <Send size={28} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Connect Telegram</h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
                Link your Telegram account to save your watchlist and receive instant
                alerts when high-impact news hits your tracked tickers.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { icon: Star, label: 'Save Watchlist', desc: 'Pin your favorite tickers' },
                  { icon: Bell, label: 'Instant Alerts', desc: 'Get notified immediately' },
                  { icon: Shield, label: 'Secure & Private', desc: 'No data sold to 3rd parties' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-[#1A1A1A] border border-[#4D4D4D] rounded-xl p-3">
                    <Icon size={16} className="text-cyan-400 mx-auto mb-1.5" />
                    <div className="text-xs font-semibold text-white mb-0.5">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0c0e14] font-bold text-sm px-8 py-3 rounded-xl transition-all duration-150 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                <Send size={16} />
                Connect via Telegram
                <ChevronRight size={14} />
              </button>

              <p className="mt-4 text-[11px] text-slate-600">
                You will be redirected to Telegram to authorize the Impact Terminal bot.
              </p>
            </div>
          </div>

          {/* Empty watchlist placeholder */}
          <div className="bg-[#1A1A1A] border border-[#4D4D4D] border-dashed rounded-xl p-10 text-center">
            <Star size={28} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-medium">Your watchlist is empty</p>
            <p className="text-xs text-slate-700 mt-1">
              Connect Telegram and click $TICKER chips to add tickers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
