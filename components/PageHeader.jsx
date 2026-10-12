export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="relative w-full pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#262626] bg-[#000000] text-center">
      <div className="max-w-4xl mx-auto">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000] border border-[#262626] text-[#00A3FF] text-[11px] font-mono uppercase tracking-widest mb-4">
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
