import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="font-bold text-slate-200">Data Science Student Association (DSSA)</p>
          <p className="text-xs text-slate-500">Vishwakarma Institute of Technology, Pune</p>
        </div>

        <div className="flex gap-6 text-xs text-slate-400">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/events" className="hover:underline">Events</Link>
          <Link href="/learning" className="hover:underline">Learning Hub</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>

        <p className="text-xs text-slate-600">
          
            © 2026 DSSA VIT Pune. Prototype v1.0.
        </p>
      </div>
    </footer>
  );
}