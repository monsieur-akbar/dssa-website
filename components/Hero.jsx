export default function Hero() {
  return (
    <section className="py-20 text-center flex flex-col items-center justify-center">
      <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">VIT Pune</span>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
        Explore. Analyze. <span className="text-blue-500">Innovate.</span>
      </h1>
      <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
        Data Science Student Association - Empowering students to build the future with data.
      </p>
      <div className="mt-8 p-6 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 text-sm">
        [ Member 2: 3D Interactive Data Cube Embed Area ]
      </div>
    </section>
  );
}