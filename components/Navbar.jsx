import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262626] bg-[#000000]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Club Brand with Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src="/dssa-logo.png"
              alt="DSSA Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base sm:text-lg font-black tracking-wider text-[#FFFFFF]">DSSA</span>
              <span className="text-xs font-semibold text-[#FFFFFF]">VIT</span>
            </div>
            <span className="text-[10px] tracking-wider text-[#A3A3A3] uppercase font-mono mt-0.5 hidden sm:inline">
              Pune Chapter
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A3A3A3]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[#FFFFFF] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/join"
            className="rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs sm:text-sm font-semibold px-4 py-2 transition-colors border border-[#262626]"
          >
            Join DSSA
          </Link>
        </div>
      </div>
    </header>
  );
}