"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import achievements from "@/data/achievements.json";
import { ExternalLink, Award } from "lucide-react";

const filters = [
  "All",
  "Hackathons",
  "Research",
  "Milestones",
];

function AchievementSlideshow({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center bg-[#000000] text-[#737373] text-xs font-mono">
        No visual preview available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[240px] sm:min-h-[280px] overflow-hidden rounded-xl bg-[#000000]">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`${title} preview ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[#000000]/60" />

      {/* Clean Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-[#00A3FF]"
                : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAchievements =
    activeFilter === "All"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.category === activeFilter
        );

  return (
    <div className="min-h-screen bg-[#000000] pb-24 text-[#FFFFFF]">
      <PageHeader
        eyebrow="WALL OF FAME"
        title="DSSA Achievements & Milestones"
        description="Celebrating student accomplishments in competitive hackathons, research publications, and community engineering milestones."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors border ${
                  active
                    ? "border-[#262626] bg-[#0D0D0D] text-[#00A3FF] font-bold"
                    : "border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:border-[#404040] hover:text-[#FFFFFF]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Achievements List */}
        <div className="space-y-8">
          {filteredAchievements.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#262626] bg-[#0D0D0D] p-5 sm:p-7 hover:border-[#404040] transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Visual Slideshow (5 cols) */}
                <div className="lg:col-span-5">
                  <AchievementSlideshow images={item.images} title={item.title} />
                </div>

                {/* Details (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#000000] text-[#00A3FF] border border-[#262626]">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-[#737373]">
                        {item.year}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight mb-2">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-2 text-xs text-[#A3A3A3] font-mono mb-4">
                      <span className="text-[#00A3FF] font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {item.position}
                      </span>
                      <span>•</span>
                      <span>{item.team}</span>
                    </div>

                    <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#000000] hover:bg-[#1A1A1A] border border-[#404040] text-xs font-semibold text-[#FFFFFF] transition-colors"
                    >
                      <span>View Credential / Paper</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filteredAchievements.length === 0 && (
            <div className="rounded-xl border border-[#262626] bg-[#0D0D0D] p-12 text-center">
              <p className="text-sm text-[#A3A3A3]">
                No achievements recorded in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
