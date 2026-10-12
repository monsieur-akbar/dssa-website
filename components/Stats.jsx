export default function Stats() {
  const metrics = [
    { label: "Community Members", value: "500+" },
    { label: "Events & Workshops", value: "25+" },
    { label: "Student Projects", value: "40+" },
    { label: "Hackathon Wins", value: "15+" },
  ];

  return (
    <section className="py-12 border-t border-[#262626] w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] hover:border-[#404040] transition-colors"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] font-mono tracking-tight">
              {m.value}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#A3A3A3] font-mono uppercase tracking-wider mt-1.5">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}