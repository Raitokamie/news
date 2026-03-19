'use client';

import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useTerminalStore } from '@/lib/store';
import { mockTelegramNotifications } from '@/lib/api';
import {
  WatchlistHeader,
  WatchlistStocksRow,
  WatchlistActivityFeed,
  TelegramStatusWidget,
  AddTickerModal,
} from '@/components/watchlist';
import PremiumLock from '@/components/premium/PremiumLock';

export default function WatchlistPage() {
  const { trackedTickers, addTicker, removeTicker, userPlan } = useTerminalStore();
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (userPlan === 'free') {
    return (
      <div className="flex h-full bg-[#0a1017]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <PremiumLock featureName="Watchlist" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0a1017]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-y-auto">
          {/* Header with ADD button */}
          <div className="relative">
            <WatchlistHeader onAddClick={() => setAddModalOpen(!addModalOpen)} />
            <AddTickerModal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              trackedTickers={trackedTickers}
              onAddTicker={addTicker}
            />
          </div>

          {/* Main Content */}
          <div className="px-6 pb-6 pt-0 flex flex-col gap-4">
            {/* Stock Cards Row */}
            <WatchlistStocksRow trackedSymbols={trackedTickers} onRemove={removeTicker} />

            {/* Recent Activity Section */}
            <WatchlistActivityFeed trackedSymbols={trackedTickers} />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        <TelegramStatusWidget
          trackedSymbols={trackedTickers}
          notifications={mockTelegramNotifications}
        />
      </aside>
    </div>
  );
}
