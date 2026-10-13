"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

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

  // Close mobile menu on pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key and lock body scroll when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262626] bg-[#000000]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Club Brand with Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF] rounded-lg"
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

        {/* Right side: Desktop CTA + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/join"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs sm:text-sm font-semibold px-4 py-2 transition-colors border border-[#262626]"
          >
            Join DSSA
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#404040] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF] transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out border-b border-[#262626] bg-[#000000]/95 backdrop-blur-xl ${
          isOpen
            ? "max-h-[calc(100vh-4rem)] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden border-transparent pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1A1A1A] text-[#FFFFFF] font-semibold border border-[#262626]"
                      : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#0D0D0D]"
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? "text-[#FFFFFF] translate-x-0.5" : "text-[#737373]"}`} />
                </Link>
              );
            })}
          </nav>

          {/* Mobile CTA & Info */}
          <div className="pt-4 border-t border-[#262626] flex flex-col gap-3">
            <Link
              href="/join"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-sm font-semibold py-2.5 transition-colors"
            >
              <span>Join DSSA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between px-2 pt-2 text-[11px] font-mono text-[#737373]">
              <span>VIT Pune Chapter</span>
              <span>Where Data Meets Discovery</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}