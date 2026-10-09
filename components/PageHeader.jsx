export default function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-20">
      {eyebrow && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-blue-400">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
