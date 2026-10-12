export default function Timeline({ items }) {
  return (
    <ol className="relative ml-2 border-l border-[#262626] sm:ml-0">
      {items.map((item) => (
        <li
          key={item.year}
          className="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[7rem_1fr] md:gap-6 md:pl-10"
        >
          <span
            aria-hidden="true"
            className="absolute -left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-[#FFFFFF] ring-4 ring-[#000000]"
          />
          <p className="text-base font-bold font-mono text-[#00A3FF] md:text-right">{item.year}</p>
          <div className="mt-1 rounded-xl border border-[#262626] bg-[#0D0D0D] p-5 hover:border-[#404040] transition-colors md:mt-0">
            <h3 className="font-semibold text-[#FFFFFF]">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#A3A3A3]">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
