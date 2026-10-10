"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import opportunitiesData from "@/data/opportunities.json";
import { ArrowRight, Briefcase, CheckCircle2, Users, Compass } from "lucide-react";

export default function Opportunities() {
  const [selectedTrack, setSelectedTrack] = useState("all");

  const tracks = ["all", ...new Set(opportunitiesData.map((op) => op.track))];

  const filtered =
    selectedTrack === "all"
      ? opportunitiesData
      : opportunitiesData.filter((op) => op.track === selectedTrack);

  return (
    <div className="min-h-screen bg-[#000000] pb-24 text-[#FFFFFF]">
      <PageHeader
        eyebrow="RECRUITMENT & PODS"
        title="Open Opportunities at DSSA"
        description="Join specialized student pods, research clusters, and management teams. Build industry-grade systems and represent DSSA at national stages."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        {/* Track Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tracks.map((track) => {
            const active = selectedTrack === track;
            return (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`rounded-lg px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors border ${
                  active
                    ? "border-[#262626] bg-[#0D0D0D] text-[#00A3FF] font-bold"
                    : "border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:border-[#404040] hover:text-[#FFFFFF]"
                }`}
              >
                {track === "all" ? "All Tracks" : track}
              </button>
            );
          })}
        </div>

        {/* Opportunities List */}
        <div className="space-y-8">
          {filtered.map((op) => (
            <article
              key={op.id}
              className="rounded-2xl border border-[#262626] bg-[#0D0D0D] p-6 sm:p-8 hover:border-[#404040] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#262626]">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#000000] text-[#00A3FF] border border-[#262626]">
                      {op.track}
                    </span>
                    <span className="text-xs font-mono text-[#A3A3A3]">
                      {op.type}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight">
                    {op.role}
                  </h2>
                  <p className="text-xs text-[#A3A3A3] font-mono mt-1">
                    Eligibility: {op.eligibility}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-[#00A3FF] font-mono font-bold justify-end">
                      <Users className="w-3.5 h-3.5" />
                      <span>{op.openings} Openings</span>
                    </div>
                    <span className="text-[11px] text-[#737373] font-mono">Cohort 2026</span>
                  </div>

                  <Link
                    href={`/join?role=${encodeURIComponent(op.role)}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs font-semibold transition-colors border border-[#262626]"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#A3A3A3] leading-relaxed my-5">
                {op.description}
              </p>

              {/* Requirements & Perks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 rounded-xl bg-[#000000] border border-[#262626]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    <span>Candidate Prerequisites</span>
                  </h3>
                  <ul className="space-y-2">
                    {op.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-[#A3A3A3] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] mt-1.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#000000] border border-[#262626]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3FF]" />
                    <span>Track Perks & Benefits</span>
                  </h3>
                  <ul className="space-y-2">
                    {op.perks.map((perk, i) => (
                      <li key={i} className="text-xs text-[#A3A3A3] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] mt-1.5 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
