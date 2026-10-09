import Image from "next/image";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * Shows the member photo when `photo` is set (path under /public, e.g. "/team/riya.jpg"),
 * otherwise a placeholder with the member's initials.
 */
export default function Avatar({ name, photo, size = 96, className = "" }) {
  const style = { width: size, height: size };

  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size * 2}
        height={size * 2}
        style={style}
        className={`rounded-full object-cover ring-1 ring-slate-700 ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} (photo coming soon)`}
      style={{ ...style, fontSize: size / 3 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-800 to-slate-900 font-semibold text-slate-300 ring-1 ring-slate-700 ${className}`}
    >
      {initials(name)}
    </div>
  );
}
