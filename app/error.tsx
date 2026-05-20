'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

// Next.js จะส่ง props สองตัวให้อัตโนมัติ:
// - error: object ข้อผิดพลาดที่เกิดขึ้น
// - reset: function สำหรับลอง render หน้าใหม่อีกครั้ง
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <h2 className="text-lg font-bold text-white">Something went wrong</h2>

        <p className="text-sm text-slate-400">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>

        {/* กดปุ่มนี้ → Next.js จะลอง render page component ใหม่ */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm font-medium text-cyan-400 transition-all"
        >
          <RotateCcw size={14} />
          Try again
        </button>
      </div>
    </div>
  );
}
