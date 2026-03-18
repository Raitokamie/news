'use client';

import { TelegramNotificationStatus } from '@/lib/types';
import { useTerminalStore } from '@/lib/store';
import { cn, timeAgo } from '@/lib/utils';
import { Send, ArrowUpRight, LogOut } from 'lucide-react';

interface TelegramStatusWidgetProps {
  trackedSymbols: string[];
  notifications: TelegramNotificationStatus[];
}

const statusConfig = {
  SENT: {
    label: 'SENT',
    dotColor: 'bg-green-500',
    textColor: 'text-green-400',
  },
  FAILED: {
    label: 'FAILED',
    dotColor: 'bg-red-500',
    textColor: 'text-red-400',
  },
  PROCESSING: {
    label: 'PROCESSING',
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-400',
  },
};

export default function TelegramStatusWidget({
  trackedSymbols,
  notifications,
}: TelegramStatusWidgetProps) {
  const { telegramConnected, connectTelegram, disconnectTelegram } = useTerminalStore();

  // Not connected — show connect card
  if (!telegramConnected) {
    return (
      <div className="bg-[#1A1A1A] border border-[#222F44] rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-cyan-400" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1">Connect Telegram</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Get instant alerts when high-impact news hits your tracked tickers.
          </p>
          <button
            onClick={connectTelegram}
            className="w-full inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0c0e14] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <Send size={14} />
            Connect
          </button>
        </div>
      </div>
    );
  }

  // Connected — show notification status
  const relevantNotifications = trackedSymbols.map((symbol) => {
    const notification = notifications.find((n) => n.symbol === symbol);
    return notification || { symbol, status: 'PROCESSING' as const, timestamp: new Date() };
  });

  return (
    <div className="bg-[#1A1A1A] border border-[#222F44] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222F44]">
        <div className="flex items-center gap-2">
          <Send size={16} className="text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">Telegram</h3>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        <button
          onClick={disconnectTelegram}
          className="text-slate-500 hover:text-red-400 transition-colors"
          title="Disconnect"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-[#333333]">
        {relevantNotifications.map((notification) => {
          const config = statusConfig[notification.status];
          return (
            <div
              key={notification.symbol}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-white font-semibold text-sm">
                  {notification.symbol}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
                  <span className={cn('text-xs font-medium', config.textColor)}>
                    {config.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {timeAgo(notification.timestamp)}
                </span>
                <button className="w-7 h-7 rounded-full bg-[#0D7FF2] flex items-center justify-center hover:bg-[#0B6FD4] transition-colors">
                  <ArrowUpRight size={14} className="text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {relevantNotifications.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-slate-500">Add tickers to receive alerts</p>
        </div>
      )}
    </div>
  );
}
