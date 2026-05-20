import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh] bg-[#0a1017] p-4 text-slate-100">
      <div className="relative group w-full max-w-lg">
        {/* Glowing background effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-cyan-500/50 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        {/* Card content */}
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 text-center w-full shadow-2xl">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-900/50 rounded-full border border-slate-700/50 shadow-inner">
              <AlertCircle className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* 404 Heading */}
          <h1 className="text-7xl font-bold bg-gradient-to-tr from-slate-100 to-slate-500 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-slate-200 mb-4 tracking-wide">
            Page Not Found
          </h2>
          
          <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
            We couldn&apos;t find the page you&apos;re looking for. The link might be broken or the page may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="group/btn flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto text-sm font-medium text-slate-300 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
              <span>Go Back</span>
            </Link>

            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-500/50"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
