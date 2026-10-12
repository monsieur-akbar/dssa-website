"use client";

import { useEffect, useState } from "react";
import achievementsData from "@/data/achievements.json";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const categories = ["All", "Hackathons", "Research", "Milestones"];

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGallery, setActiveGallery] = useState(null);
  const [slideIndexes, setSlideIndexes] = useState({});

  const achievements = Array.isArray(achievementsData)
    ? achievementsData
    : achievementsData.achievements || [];

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesCategory =
      activeCategory === "All" ||
      achievement.category === activeCategory;

    const searchableText = [
      achievement.title,
      achievement.category,
      achievement.description,
      ...(achievement.highlights || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      searchableText.includes(searchQuery.trim().toLowerCase())
    );
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndexes((previous) => {
        const updated = { ...previous };

        achievements.forEach((achievement, index) => {
          const images = achievement.images || [];

          if (images.length > 1) {
            updated[index] =
              ((previous[index] || 0) + 1) % images.length;
          }
        });

        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [achievements]);

  useEffect(() => {
    if (!activeGallery) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveGallery(null);
      if (event.key === "ArrowRight") changeGalleryImage(1);
      if (event.key === "ArrowLeft") changeGalleryImage(-1);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeGallery]);

  function changeGalleryImage(direction) {
    setActiveGallery((current) => {
      if (!current || current.images.length <= 1) return current;

      return {
        ...current,
        index:
          (current.index + direction + current.images.length) %
          current.images.length,
      };
    });
  }

  function openGallery(achievement, index = 0) {
    if (!achievement.images?.length) return;

    setActiveGallery({
      title: achievement.title,
      images: achievement.images,
      index,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-20 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute -right-40 top-[500px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Department hero */}
        <section className="relative mb-16 overflow-hidden rounded-[30px] border border-white/[0.09] bg-gradient-to-br from-white/[0.055] via-[#0b1024]/70 to-cyan-950/20 px-5 py-12 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)] sm:px-10 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

          <div className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full border border-cyan-300/[0.08]" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full border border-violet-300/[0.08]" />

          <div className="relative">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200 sm:text-xs">
              <Sparkles size={15} />
              CSE · Data Science Department
            </div>

            <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Moments That{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Make Us
              </span>
              <br className="hidden sm:block" />{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
                  Proud
                </span>
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 opacity-80" />
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              Every achievement tells a story. Explore the ideas,
              discoveries, teamwork, and unforgettable experiences
              that shape our department&apos;s journey.
            </p>

            <a
              href="#achievement-wall"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07] px-5 py-3.5 text-sm font-semibold text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/[0.12]"
            >
              Explore Achievements
              <ArrowDownRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </section>

        {/* Beautiful Achievement Wall heading */}
        <section id="achievement-wall" className="mb-9 scroll-mt-24">
          <div className="mb-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                <span className="h-px w-8 bg-gradient-to-r from-cyan-300 to-blue-400" />
                Our Journey · Our Pride
              </div>

              <div className="relative inline-block">
                <h2 className="relative text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  <span className="text-white">Achievement</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Wall
                  </span>
                </h2>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-[3px] w-14 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                  <span className="h-[3px] w-7 rounded-full bg-blue-400/80" />
                  <span className="h-[3px] w-3 rounded-full bg-violet-400/80" />
                </div>
              </div>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                A showcase of our proudest moments, creative minds,
                groundbreaking ideas, and accomplishments worth celebrating.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search achievements..."
                aria-label="Search achievements"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                    isActive
                      ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.08)]"
                      : "border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}

            <span className="ml-auto self-center text-xs text-slate-500">
              Showing {filteredAchievements.length}{" "}
              {filteredAchievements.length === 1
                ? "achievement"
                : "achievements"}
            </span>
          </div>
        </section>

        {/* Achievement cards */}
        <section className="space-y-8">
          {filteredAchievements.map((achievement) => {
            const originalIndex = achievements.indexOf(achievement);
            const images = achievement.images || [];
            const currentImageIndex = slideIndexes[originalIndex] || 0;
            const currentImage = images[currentImageIndex];

            return (
              <article
                key={`${achievement.title}-${originalIndex}`}
                className="group relative rounded-[26px] p-[1px] transition duration-500 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(34,211,238,0.65), rgba(99,102,241,0.4), rgba(217,70,239,0.55), rgba(34,211,238,0.35))",
                  backgroundSize: "250% 250%",
                  animation: "achievementBorderFlow 8s ease infinite",
                }}
              >
                <div className="rounded-[25px] bg-[#080d20]/95 p-3 sm:p-5 lg:p-6">
                  <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-7">
                    {/* Large image section */}
                    <div className="min-w-0">
                      <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.10)] sm:h-[380px] lg:h-full lg:min-h-[420px]">
                        {currentImage ? (
                          <>
                            <img
                              src={currentImage}
                              alt={achievement.title}
                              className="h-full w-full cursor-zoom-in object-cover transition duration-700 group-hover:scale-[1.025]"
                              onClick={() =>
                                openGallery(achievement, currentImageIndex)
                              }
                            />

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xl">
                              {achievement.category || "Achievement"}
                            </span>

                            {images.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  aria-label="Previous image"
                                  onClick={() =>
                                    setSlideIndexes((previous) => ({
                                      ...previous,
                                      [originalIndex]:
                                        (currentImageIndex -
                                          1 +
                                          images.length) %
                                        images.length,
                                    }))
                                  }
                                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-cyan-400/30"
                                >
                                  <ChevronLeft size={21} />
                                </button>

                                <button
                                  type="button"
                                  aria-label="Next image"
                                  onClick={() =>
                                    setSlideIndexes((previous) => ({
                                      ...previous,
                                      [originalIndex]:
                                        (currentImageIndex + 1) %
                                        images.length,
                                    }))
                                  }
                                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-cyan-400/30"
                                >
                                  <ChevronRight size={21} />
                                </button>

                                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                                  {images.map((_, imageIndex) => (
                                    <button
                                      key={imageIndex}
                                      type="button"
                                      aria-label={`Show image ${imageIndex + 1}`}
                                      onClick={() =>
                                        setSlideIndexes((previous) => ({
                                          ...previous,
                                          [originalIndex]: imageIndex,
                                        }))
                                      }
                                      className={`h-1.5 rounded-full transition-all ${
                                        imageIndex === currentImageIndex
                                          ? "w-7 bg-cyan-300"
                                          : "w-2 bg-white/60 hover:bg-white"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                openGallery(achievement, currentImageIndex)
                              }
                              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-black/70"
                            >
                              <Images size={15} />
                              View gallery
                            </button>
                          </>
                        ) : (
                          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-slate-500">
                            <Images size={42} strokeWidth={1.2} />
                            <span className="text-sm">
                              No images available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Image thumbnails */}
                      {images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                          {images.map((image, imageIndex) => (
                            <button
                              key={`${image}-${imageIndex}`}
                              type="button"
                              onClick={() =>
                                setSlideIndexes((previous) => ({
                                  ...previous,
                                  [originalIndex]: imageIndex,
                                }))
                              }
                              className={`h-[66px] w-[88px] shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-[76px] sm:w-[104px] ${
                                currentImageIndex === imageIndex
                                  ? "border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.18)]"
                                  : "border-white/10 opacity-65 hover:border-white/40 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${achievement.title} thumbnail ${imageIndex + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Achievement details */}
                    <div className="flex min-w-0 flex-col justify-center py-2 sm:px-1 lg:py-5 lg:pl-1">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-xs font-medium text-violet-200">
                          <Award size={14} />
                          Department highlight
                        </span>

                        {images.length > 0 && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Images size={14} />
                            {images.length}{" "}
                            {images.length === 1 ? "image" : "images"}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold leading-snug tracking-tight text-white transition group-hover:text-cyan-100 sm:text-3xl">
                        {achievement.title}
                      </h3>

                      <div className="mt-4 h-[2px] w-20 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" />

                      <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                        {achievement.description}
                      </p>

                      {achievement.highlights?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            Highlights
                          </h4>

                          <ul className="space-y-3">
                            {achievement.highlights.map(
                              (highlight, highlightIndex) => (
                                <li
                                  key={`${highlight}-${highlightIndex}`}
                                  className="flex items-start gap-3 text-sm leading-6 text-slate-400"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(34,211,238,0.65)]" />
                                  <span>{highlight}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5">
                        <button
                          type="button"
                          onClick={() =>
                            openGallery(achievement, currentImageIndex)
                          }
                          disabled={!images.length}
                          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.07] px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Images size={16} />
                          Explore photos
                          <ExternalLink size={14} />
                        </button>

                        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                          <Sparkles size={14} />
                          Innovation in action
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200">
              <Search size={27} />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No achievements found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Try another search term or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.08] pt-7 text-center">
          <p className="text-sm font-medium text-slate-400">
            CSE — Data Science Department
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Every achievement is part of our story.
          </p>
        </footer>
      </div>

      {/* Full-screen image gallery */}
      {activeGallery && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeGallery.title} photo gallery`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02040b]/95 p-3 backdrop-blur-xl sm:p-6"
          onClick={() => setActiveGallery(null)}
        >
          <div
            className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080d1b] shadow-[0_0_80px_rgba(34,211,238,0.08)] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-xs">
                  Achievement gallery
                </p>
                <h3 className="mt-1 truncate text-base font-bold text-white sm:text-xl">
                  {activeGallery.title}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close gallery"
                onClick={() => setActiveGallery(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-rose-300/40 hover:bg-rose-300/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
              <img
                src={activeGallery.images[activeGallery.index]}
                alt={`${activeGallery.title} image ${activeGallery.index + 1}`}
                className="max-h-[64vh] max-w-full rounded-xl object-contain sm:max-h-[68vh]"
              />

              {activeGallery.images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous gallery image"
                    onClick={() => changeGalleryImage(-1)}
                    className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-300/15 sm:left-6 sm:h-12 sm:w-12"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next gallery image"
                    onClick={() => changeGalleryImage(1)}
                    className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:border-cyan-300/40 hover:bg-cyan-300/15 sm:right-6 sm:h-12 sm:w-12"
                  >
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 sm:text-sm">
                  Image {activeGallery.index + 1} of{" "}
                  {activeGallery.images.length}
                </span>

                <span className="text-xs text-slate-500">
                  ← → Navigate · Esc to close
                </span>
              </div>

              {activeGallery.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {activeGallery.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`Open gallery image ${index + 1}`}
                      onClick={() =>
                        setActiveGallery((current) => ({
                          ...current,
                          index,
                        }))
                      }
                      className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24 ${
                        activeGallery.index === index
                          ? "border-cyan-300 opacity-100"
                          : "border-white/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes achievementBorderFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}