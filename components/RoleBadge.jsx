const accents = {
blue: "bg-blue-500/10 text-blue-300 ring-blue-500/30",
cyan: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30",
indigo: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/30",

emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
teal: "bg-teal-500/10 text-teal-300 ring-teal-500/30",

amber: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
orange: "bg-orange-500/10 text-orange-300 ring-orange-500/30",

violet: "bg-violet-500/10 text-violet-300 ring-violet-500/30",
rose: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
pink: "bg-pink-500/10 text-pink-300 ring-pink-500/30",
};

export default function RoleBadge({
children,
accent = "blue",
}) {
const accentClass = accents[accent] ?? accents.blue;

return (
<span
className={`         inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        ring-1
        ring-inset
        ${accentClass}
      `}
>
{children} </span>
);
}
