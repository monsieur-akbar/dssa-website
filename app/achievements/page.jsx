"use client";

import { useEffect, useState } from "react";
import achievements from "@/data/achievements.json";

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
    }, 3000);

    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900 text-slate-500">
        No image available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`${title} image ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
            index === currentIndex
              ? "scale-100 opacity-100"
              : "scale-105 opacity-0"
          }`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

      {/* IMAGE INDICATORS */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40"
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
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="mb-12 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            DSSA Wall of Fame
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Achievements
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Celebrating the people, ideas and milestones that make the
            DSSA community stronger.
          </p>

        </section>

        {/* FILTERS */}
        <section className="mb-14">

          <div className="flex flex-wrap justify-center gap-3">

            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)]"
                      : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-amber-400/50 hover:text-amber-300"
                  }`}
                >
                  {filter}
                </button>
              );
            })}

          </div>

        </section>

        {/* ACHIEVEMENTS */}
        <section className="space-y-12">

          {filteredAchievements.map((achievement, index) => (

            <article
              key={achievement.id}
              className="group relative overflow-hidden rounded-[2rem] p-[2px]"
            >

              {/* COLOUR CHANGING GLOW */}
              <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-amber-400 via-purple-500 via-pink-500 to-amber-400 bg-[length:300%_300%] opacity-60 blur-[3px] transition-opacity duration-500 group-hover:opacity-100 animate-border-flow" />

              {/* CARD */}
              <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-slate-950/95 backdrop-blur-xl">

                {/* CONTENT */}
                <div className="grid lg:grid-cols-[380px_1fr]">

                  {/* IMAGE */}
                  <div className="p-4 sm:p-6">

                    <div className="relative h-[250px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_0_30px_rgba(251,191,36,0.08)] sm:h-[300px] lg:h-full lg:min-h-[330px]">

                      <AchievementSlideshow
                        images={achievement.images}
                        title={achievement.title}
                      />

                    </div>

                  </div>

                  {/* INFORMATION */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">

                    {/* TOP META */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">

                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                        {achievement.category}
                      </span>

                      <span className="text-sm text-slate-500">
                        {achievement.year}
                      </span>

                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-black sm:text-3xl">
                      {achievement.title}
                    </h2>

                    {/* POSITION */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      <span className="text-lg font-bold text-amber-300">
                        {achievement.position}
                      </span>

                      <span className="text-slate-600">
                        •
                      </span>

                      <span className="text-sm text-slate-400">
                        {achievement.team}
                      </span>

                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-5 max-w-3xl leading-7 text-slate-400">
                      {achievement.description}
                    </p>

                    {/* BUTTON */}
                    <div className="mt-7">

                      <a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-300 transition-all duration-300 hover:border-amber-300 hover:bg-amber-400/20 hover:shadow-[0_0_25px_rgba(251,191,36,0.20)]"
                      >
                        View Achievement ↗
                      </a>

                    </div>

                  </div>

                </div>

              </div>

            </article>

          ))}

          {/* EMPTY STATE */}
          {filteredAchievements.length === 0 && (

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">

              <p className="text-slate-400">
                No achievements available in this category yet.
              </p>

            </div>

          )}

        </section>

      </div>

      {/* BORDER ANIMATION */}
      <style jsx global>{`

        @keyframes borderFlow {

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

        .animate-border-flow {
          animation: borderFlow 7s ease infinite;
        }

      `}</style>

    </main>
  );
}