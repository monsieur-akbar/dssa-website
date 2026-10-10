import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#000000] text-[#A3A3A3] text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Top Section with Brand & Slogan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-[#262626] overflow-hidden flex-shrink-0">
              <Image
                src="/dssa-logo.png"
                alt="DSSA Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-[#FFFFFF] tracking-tight">
                Data Science Student Association (DSSA)
              </p>
              <p className="text-xs text-[#737373]">
                Vishwakarma Institute of Technology, Pune
              </p>
            </div>
          </div>

          {/* Slogan with Horizontal Rules mirroring the emblem */}
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest text-[#A3A3A3] uppercase">
            <span className="h-px w-8 bg-[#404040]" />
            <span>Where Data Meets Discovery</span>
            <span className="h-px w-8 bg-[#404040]" />
          </div>
        </div>

        {/* Bottom Section with Navigation and Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex flex-wrap gap-6 text-[#A3A3A3]">
            <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">About</Link>
            <Link href="/team" className="hover:text-[#FFFFFF] transition-colors">Team</Link>
            <Link href="/events" className="hover:text-[#FFFFFF] transition-colors">Events</Link>
            <Link href="/achievements" className="hover:text-[#FFFFFF] transition-colors">Achievements</Link>
            <Link href="/opportunities" className="hover:text-[#FFFFFF] transition-colors">Opportunities</Link>
            <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors">Contact</Link>
            <Link href="/join" className="hover:text-[#FFFFFF] transition-colors font-medium">Join DSSA</Link>
          </div>

          <p className="text-[#737373] font-mono text-[11px]">
            © 2026 DSSA VIT Pune. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}