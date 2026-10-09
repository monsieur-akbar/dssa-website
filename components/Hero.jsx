"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Terminal } from "lucide-react";

// Dynamically import full-screen 3D DataCube with SSR disabled
const DataCube = dynamic(() => import("./DataCube"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-black">
      <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-white animate-spin" />
      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
        Initializing Space Environment...
      </span>
    </div>
  ),
});

// Smooth Animated Counter with Cubic Easing
function MetricCounter({ target, suffix = "", duration = 1800 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const startTime = performance.now();

          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(ease * target));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(target);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {displayValue}
      <span className="text-zinc-400">{suffix}</span>
    </span>
  );
}

export default function Hero() {
  const stats = [
    { label: "Community Members", value: 500, suffix: "+" },
    { label: "Technical Events", value: 50, suffix: "+" },
    { label: "Student Projects", value: 25, suffix: "+" },
    { label: "Hands-on Workshops", value: 30, suffix: "+" },
    { label: "Awards & Milestones", value: 15, suffix: "+" },
  ];

  return (
    <div className="w-full flex flex-col bg-black text-white">
      {/* ─────────────────────────────────────────────────────────────
          SCREEN 1: Full-Screen 3D Cube & Space Environment (Image 1)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-x-hidden lg:overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Full-Screen 3D Space Canvas with Revolving Satellites */}
        <div className="relative w-full h-full min-h-[calc(100vh-4rem)] lg:min-h-0 z-10 flex flex-col">
          <DataCube />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2: Scrolled Theory & Impact Grid (Image 2 Wireframe)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Asymmetric 2-Column Grid matching Wireframe Image 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: Stacked Two Boxes (Top Box: Numbers, Bottom Box: Mission & CTAs) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Box 1 (Top-Left): Community Impact Numbers */}
              <div className="p-6 sm:p-7 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-5">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Community Impact
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[11px] font-mono text-zinc-300 font-semibold">Active Metrics</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {stats.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-black border border-zinc-800/80 text-center"
                    >
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                        <MetricCounter target={item.value} suffix={item.suffix} />
                      </div>
                      <div className="text-[11px] font-medium text-zinc-400 leading-tight">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5th Metric spanning full width */}
                <div className="mt-3 p-3.5 rounded-lg bg-black border border-zinc-800/80 flex items-center justify-between px-5">
                  <span className="text-xs font-medium text-zinc-400">
                    {stats[4].label}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    <MetricCounter target={stats[4].value} suffix={stats[4].suffix} />
                  </span>
                </div>
              </div>

              {/* Box 2 (Bottom-Left): Tagline & Action Hub */}
              <div className="p-6 sm:p-7 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between flex-1">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium mb-4">
                    <span className="font-mono text-[11px] uppercase text-zinc-300">VIT Pune Chapter</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                    Explore. Analyze.<br />
                    <span className="text-zinc-200">
                      Innovate.
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-6">
                    Join the premier technical student chapter dedicated to bridging fundamental theory with real-world artificial intelligence and data systems.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
                  >
                    <span>Discover DSSA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="#events"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Upcoming Events</span>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Large Theory / Introduction Box (Image 2 Wireframe) */}
            <div className="lg:col-span-7 p-7 sm:p-9 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Association Blueprint
                  </span>
                  <span className="text-xs font-mono text-zinc-400">VIT Pune</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-4">
                  Empowering Students to Lead the Future of Data & AI
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                  The <strong className="text-white font-semibold">Data Science Student Association (DSSA)</strong> at VIT Pune is a student-driven technical body focused on developing practical competency in artificial intelligence, modern analytics, and computational systems. We foster a collaborative environment where students move beyond textbook formulas to build production-grade projects, publish technical research, and compete on global stages.
                </p>

                {/* The 3 Core Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 mb-6">
                  <div className="p-4 rounded-lg bg-black border border-zinc-800/80">
                    <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      01 • Technical
                    </div>
                    <div className="text-xs font-semibold text-white mb-1">Algorithmic Rigor</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Mastering deep learning architectures, statistical hypothesis testing, and scalable database systems.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black border border-zinc-800/80">
                    <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      02 • Active
                    </div>
                    <div className="text-xs font-semibold text-white mb-1">Hands-On Practice</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      High-energy hackathon teams, weekly technical build sessions, and project incubators.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black border border-zinc-800/80">
                    <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      03 • Growth
                    </div>
                    <div className="text-xs font-semibold text-white mb-1">Career & Network</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Alumni mentorship, resume guidance, paper publication support, and industry placement tracks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Hub Roadmap Tags */}
              <div className="pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                  Core Learning Tracks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "SQL", "Statistics", "Machine Learning", "Deep Learning", "Generative AI"].map((track, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                    >
                      {track}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}