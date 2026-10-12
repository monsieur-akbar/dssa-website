// Single unified theme — all badge accents use the same monochrome palette
const BADGE_CLASS = "bg-[#0D0D0D] text-[#00A3FF] ring-[#262626]";

export default function RoleBadge({ children, accent = "blue" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${BADGE_CLASS}`}
    >
      {children}
    </span>
  );
}
