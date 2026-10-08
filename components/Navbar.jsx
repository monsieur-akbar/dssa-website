import Link from "next/link";

export default function Navbar() {
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Achievements", href: "/achievements" },
    { name: "Learning", href: "/learning" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Club Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-wider text-blue-500">DSSA</span>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">| VIT Pune</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-blue-400 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/join"
            className="rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 transition"
          >
            Join DSSA
          </Link>
        </div>
      </div>
    </header>
  );
}