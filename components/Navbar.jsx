"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Contact", href: "/contact" },
  ];

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu on Esc key or window resize to desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262626] bg-[#000000]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Club Brand with Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-9 h-9 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#404040] transition-colors">
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#A3A3A3] hover:text-[#FFFFFF]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action (Desktop CTA + Mobile Menu Button) */}
        <div className="flex items-center gap-3">
          <Link
            href="/join"
            className="rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 transition-colors border border-[#262626]"
          >
            Join DSSA
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors focus:outline-none focus:ring-1 focus:ring-[#404040]"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5 text-[#FFFFFF]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#000000]/98 backdrop-blur-xl px-4 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#FFFFFF] bg-[#141414] font-semibold border-l-2 border-[#00A3FF]"
                      : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0D0D0D]"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]" />
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#1F1F1F]">
              <Link
                href="/join"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-sm font-semibold transition-colors"
              >
                Join DSSA Chapter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}