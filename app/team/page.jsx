"use client";
import { Users } from 'lucide-react';

export default function Team() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-900/20 rounded-full border border-blue-500/20">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Our Team
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Meet the minds behind DSSA.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="animate-pulse bg-slate-800/50 h-24 w-24 rounded-full mb-4"></div>
          <div className="animate-pulse bg-slate-800/50 h-4 w-48 rounded-full"></div>
          <div className="animate-pulse bg-slate-800/50 h-4 w-32 rounded-full"></div>
          <p className="text-slate-500 text-lg mt-8 font-medium tracking-wide uppercase">Under Construction</p>
        </div>
      </div>
    </div>
  );
}
