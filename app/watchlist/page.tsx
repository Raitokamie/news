'use client';

import { useState, useMemo } from 'react';
import { useTerminalStore } from '@/lib/store';
import { usePageLayout } from '@/hooks/usePageLayout';
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

  // Memoize custom sidebar to prevent recreation on every render
  const customSidebar = useMemo(
    () => (
      <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4 bg-[#0a1017]">
        <TelegramStatusWidget
          trackedSymbols={trackedTickers}
          notifications={mockTelegramNotifications}
        />
      </aside>
    ),
    [trackedTickers]
  );

  // Custom sidebar for watchlist
  usePageLayout({
    useDefaultSidebar: false,
    rightSidebar: customSidebar,
  });

  if (userPlan === 'free') {
    return (
      <PremiumLock featureName="Watchlist" />
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-0">
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
    </>
  );
}
