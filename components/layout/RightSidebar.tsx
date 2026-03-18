import ImpactProCard from '@/components/widgets/ImpactProCard';
import TickerCloud from '@/components/tickers/TickerCloud';

export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex w-80 shrink-0 border-l border-[#222F44] overflow-y-auto p-4 flex-col gap-4">
      <ImpactProCard />
      <TickerCloud />
    </aside>
  );
}
