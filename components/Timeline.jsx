export default function Timeline({ items }) {
  return (
    <ol className="relative ml-2 border-l border-slate-800 sm:ml-0">
      {items.map((item) => (
        <li
          key={item.year}
          className="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[7rem_1fr] md:gap-6 md:pl-10"
        >
          <span
            aria-hidden="true"
            className="absolute -left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-slate-950"
          />
          <p className="text-lg font-bold text-blue-400 md:text-right">{item.year}</p>
          <div className="mt-1 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 md:mt-0">
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
