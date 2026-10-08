export default function Stats() {
  return (
    <section className="py-10 border-t border-slate-900 w-full max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-2xl font-bold text-blue-400">500+</h3>
          <p className="text-xs text-slate-400 mt-1">Community Members</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-2xl font-bold text-cyan-400">25+</h3>
          <p className="text-xs text-slate-400 mt-1">Events & Workshops</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-2xl font-bold text-indigo-400">40+</h3>
          <p className="text-xs text-slate-400 mt-1">Student Projects</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80">
          <h3 className="text-2xl font-bold text-emerald-400">15+</h3>
          <p className="text-xs text-slate-400 mt-1">Hackathon Wins</p>
        </div>
      </div>
    </section>
  );
}