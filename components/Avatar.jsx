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
        className={`rounded-full object-cover ring-1 ring-[#262626] ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} (photo coming soon)`}
      style={{ ...style, fontSize: size / 3 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#0D0D0D] font-semibold text-[#A3A3A3] ring-1 ring-[#262626] ${className}`}
    >
      {initials(name)}
    </div>
  );
}
