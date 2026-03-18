import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import PlanToggle from '@/components/dev/PlanToggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Impact Terminal — Financial News Dashboard',
  description: 'Real-time market-moving news with ticker integration for financial professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-[#141414] text-slate-100 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — overlay on mobile, static on desktop */}
          <Sidebar />
          {/* Main content fills remaining width on desktop; full width on mobile */}
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
          <PlanToggle />
        </div>
      </body>
    </html>
  );
}
