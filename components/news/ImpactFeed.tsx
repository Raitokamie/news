'use client';

import { Fragment, useMemo, useState } from 'react';
import { mockNews } from '@/lib/api';
import { useTerminalStore } from '@/lib/store';
import NewsCard from './NewsCard';
import MobileSentimentToggle from './MobileSentimentToggle';
import { TrendingDown, TrendingUp, Globe } from 'lucide-react';
import { NewsItem } from '@/lib/types';

const HOURS_24 = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 10;

// Country ordering from big to small (major markets first)
const COUNTRY_ORDER: string[] = [
  'us', 'cn', 'jp', 'de', 'gb', 'fr', 'in', 'it', 'br', 'ca',
  'kr', 'au', 'es', 'mx', 'nl', 'ch', 'tw', 'th', 'sg', 'ie',
  'global'
];

// Country display names
const COUNTRY_NAMES: Record<string, string> = {
  'us': 'USA',
  'cn': 'China',
  'jp': 'Japan',
  'de': 'Germany',
  'gb': 'United Kingdom',
  'fr': 'France',
  'in': 'India',
  'it': 'Italy',
  'br': 'Brazil',
  'ca': 'Canada',
  'kr': 'South Korea',
  'au': 'Australia',
  'es': 'Spain',
  'mx': 'Mexico',
  'nl': 'Netherlands',
  'ch': 'Switzerland',
  'tw': 'Taiwan',
  'th': 'Thailand',
  'sg': 'Singapore',
  'ie': 'Ireland',
  'global': 'Global',
};

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  if (code === 'global') {
    return <Globe size={size} className="text-white" />;
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={code}
      className="rounded-sm object-cover"
      style={{ width: size, height: size * 0.75 }}
    />
  );
}

export default function ImpactFeed() {
  const { activeRegion, activeCountry, activeTicker, activeImpact, sortOrder, selectedSymbols, mobileSentiment } = useTerminalStore();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    setVisibleCount(PAGE_SIZE);

    let items = mockNews;

    // Dashboard: only last 24 hours
    const cutoff = new Date(Date.now() - HOURS_24);
    items = items.filter((n) => n.publishedAt >= cutoff);

    // Filter by region tab (uses regionTag directly from data)
    if (activeRegion !== 'global') {
      items = items.filter((n) => n.regionTag === activeRegion);
    }
    // Filter by country
    if (activeCountry !== 'all') {
      items = items.filter((n) => n.countryCode === activeCountry);
    }
    if (activeTicker) {
      items = items.filter((n) => n.tickers.some((t) => t.symbol === activeTicker));
    }
    if (activeImpact !== 'all') {
      items = items.filter((n) => n.impact === activeImpact);
    }

    if (selectedSymbols.length > 0) {
      items = items.filter((n) =>
        n.tickers.some((t) => selectedSymbols.includes(t.symbol))
      );
    }

    return items;
  }, [activeRegion, activeCountry, activeTicker, activeImpact, sortOrder, selectedSymbols]);

  // Group news by country when viewing all countries
  const groupedByCountry = useMemo(() => {
    if (activeCountry !== 'all') return null;

    const groups: Record<string, NewsItem[]> = {};
    for (const item of filtered) {
      const country = item.countryCode;
      if (!groups[country]) groups[country] = [];
      groups[country].push(item);
    }

    // Sort countries by COUNTRY_ORDER
    const sortedCountries = Object.keys(groups).sort((a, b) => {
      const indexA = COUNTRY_ORDER.indexOf(a);
      const indexB = COUNTRY_ORDER.indexOf(b);
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      return orderA - orderB;
    });

    return sortedCountries.map(country => ({
      country,
      name: COUNTRY_NAMES[country] || country.toUpperCase(),
      items: groups[country]
    }));
  }, [filtered, activeCountry]);

  const sortItems = (list: typeof filtered) => {
    const impactOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    if (sortOrder === 'latest') {
      return [...list].sort((a, b) => {
        const timeDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
        return timeDiff !== 0 ? timeDiff : impactOrder[a.impact] - impactOrder[b.impact];
      });
    } else if (sortOrder === 'oldest') {
      return [...list].sort((a, b) => {
        const timeDiff = a.publishedAt.getTime() - b.publishedAt.getTime();
        return timeDiff !== 0 ? timeDiff : impactOrder[a.impact] - impactOrder[b.impact];
      });
    } else if (sortOrder === 'impact') {
      return [...list].sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
    }
    return list;
  };

  const badItems = sortItems(filtered.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral'));
  const goodItems = sortItems(filtered.filter((n) => n.sentiment === 'good'));
  const maxRows = Math.max(badItems.length, goodItems.length);
  const visibleRows = Math.min(visibleCount, maxRows);
  const hasMore = visibleCount < maxRows;

  // Mobile: show only selected sentiment
  const mobileItems = mobileSentiment === 'bad' ? badItems : goodItems;
  const mobileVisibleItems = mobileItems.slice(0, visibleCount);
  const mobileHasMore = visibleCount < mobileItems.length;

  return (
    <div className="px-4">
      {/* Mobile View: Single column with sentiment toggle */}
      <div className="md:hidden">
        {/* Grouped by country when viewing all */}
        {groupedByCountry ? (
          <div>
            {groupedByCountry.map(({ country, name, items: countryItems }) => {
              const countryBad = sortItems(countryItems.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral'));
              const countryGood = sortItems(countryItems.filter((n) => n.sentiment === 'good'));
              const countryFiltered = mobileSentiment === 'bad' ? countryBad : countryGood;

              if (countryItems.length === 0) return null;

              return (
                <div key={country}>
                  {/* Country Header */}
                  <div className="flex items-center gap-2 py-3 -mx-4 px-4 bg-[#111722] border-b border-[#222F44]">
                    <CountryFlag code={country} size={20} />
                    <h2 className="text-base font-bold text-white">{name}</h2>
                    <span className="ml-auto text-xs text-white border border-[#222F44] px-2 py-0.5 rounded-full">
                      {countryItems.length}
                    </span>
                  </div>

                  {/* Sentiment Toggle under country */}
                  <div className="py-3">
                    <MobileSentimentToggle />
                  </div>

                  <div className="space-y-3 pb-6">
                    {countryFiltered.length > 0 ? (
                      countryFiltered.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-600 text-sm">No {mobileSentiment} sentiment news</div>
                    )}
                  </div>
                </div>
              );
            })}
            {groupedByCountry.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
            )}
          </div>
        ) : (
          /* Single country view */
          <>
            {/* Sentiment Toggle */}
            <div className="py-3">
              <MobileSentimentToggle />
            </div>

            <div className="space-y-3 pb-6">
              {mobileVisibleItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
              {mobileItems.length === 0 && (
                <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
              )}
            </div>
            {mobileHasMore && (
              <div className="flex justify-center mt-6 pb-6">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-6 py-2 text-sm font-bold text-[#0D7FF2] border border-[#0D7FF2]/30 rounded-lg hover:bg-[#0D7FF2]/10 transition-colors"
                >
                  Load more ({mobileItems.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop View: Two-column grid */}
      <div className="hidden md:block">
        {/* Grouped by country when viewing all */}
        {groupedByCountry ? (
          <div className="space-y-8">
            {groupedByCountry.map(({ country, name, items: countryItems }) => {
              const countryBad = sortItems(countryItems.filter((n) => n.sentiment === 'bad' || n.sentiment === 'neutral'));
              const countryGood = sortItems(countryItems.filter((n) => n.sentiment === 'good'));
              const countryMaxRows = Math.max(countryBad.length, countryGood.length);

              if (countryMaxRows === 0) return null;

              return (
                <div key={country}>
                  {/* Country Header */}
                  <div className="flex items-center gap-3 py-3 -mx-4 px-4 bg-[#111722] border-b border-[#222F44]">
                    <CountryFlag code={country} size={24} />
                    <h2 className="text-lg font-bold text-white">{name}</h2>
                    <span className="ml-auto text-sm text-white border border-[#222F44] px-3 py-0.5 rounded-full">
                      {countryItems.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
                    {/* Column Headers */}
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown size={18} className="text-red-400" />
                      <h3 className="text-sm font-bold tracking-widest uppercase text-red-400">Bad Sentiment</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={18} className="text-green-400" />
                      <h3 className="text-sm font-bold tracking-widest uppercase text-green-400">Good Sentiment</h3>
                    </div>

                    {/* Paired Cards */}
                    {Array.from({ length: countryMaxRows }).map((_, i) => (
                      <Fragment key={i}>
                        {countryBad[i] ? <NewsCard item={countryBad[i]} /> : <div />}
                        {countryGood[i] ? <NewsCard item={countryGood[i]} /> : <div />}
                      </Fragment>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {groupedByCountry.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
            )}
          </div>
        ) : (
          /* Single country view */
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {/* Column Headers */}
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={18} className="text-red-400" />
                <h2 className="text-base font-bold tracking-widest uppercase text-red-400">Bad Sentiment</h2>
                <span className="ml-auto text-xs text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
                  {badItems.length}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={18} className="text-green-400" />
                <h2 className="text-base font-bold tracking-widest uppercase text-green-400">Good Sentiment</h2>
                <span className="ml-auto text-xs text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">
                  {goodItems.length}
                </span>
              </div>

              {/* Paired Cards — same grid row = same height */}
              {Array.from({ length: visibleRows }).map((_, i) => (
                <Fragment key={i}>
                  {badItems[i] ? <NewsCard item={badItems[i]} /> : <div />}
                  {goodItems[i] ? <NewsCard item={goodItems[i]} /> : <div />}
                </Fragment>
              ))}

              {/* Empty state */}
              {maxRows === 0 && (
                <>
                  <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
                  <div className="text-center py-12 text-slate-600 text-sm">No news matching filters</div>
                </>
              )}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-6 py-2 text-sm font-bold text-[#0D7FF2] border border-[#0D7FF2]/30 rounded-lg hover:bg-[#0D7FF2]/10 transition-colors"
                >
                  Load more ({maxRows - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
