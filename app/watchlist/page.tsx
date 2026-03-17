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

export default function WatchlistPage() {
  const { trackedTickers, addTicker } = useTerminalStore();
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#0d0d0d]">
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
            <WatchlistStocksRow trackedSymbols={trackedTickers} />

            {/* Recent Activity Section */}
            <WatchlistActivityFeed trackedSymbols={trackedTickers} />
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#4D4D4D] overflow-y-auto p-4 flex-col gap-4 bg-[#0d0d0d]">
        <TelegramStatusWidget
          trackedSymbols={trackedTickers}
          notifications={mockTelegramNotifications}
        />
      </aside>
    </div>
  );
}
