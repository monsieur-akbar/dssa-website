"use client";

import { useEffect, useState } from "react";
import projectData from "@/data/projects.json";

const filters = [
  "All",
  "AI/ML",
  "Data Analytics",
  "Web Development",
  "Research",
];

function ProjectSlideshow({ images, title, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

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

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredImages = projectData.featuredImages || [];
  const projects = projectData.projects || [];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.domain === activeFilter);

  useEffect(() => {
    if (featuredImages.length <= 1) return;

    const timer = setInterval(() => {
      setFeaturedIndex(
        (current) => (current + 1) % featuredImages.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredImages.length]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            DSSA Innovation Hub
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Projects Showcase
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Discover innovative projects developed by DSSA members
            across technology, analytics, artificial intelligence and
            research.
          </p>
        </section>

        {/* TOP FEATURED SLIDESHOW */}
        <section className="relative mb-16">

          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-40 blur-xl animate-pulse" />

          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/40 bg-slate-900 p-2 shadow-[0_0_60px_rgba(34,211,238,0.15)]">

            <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] sm:h-[420px] lg:h-[520px]">

              {featuredImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Featured showcase ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                    index === featuredIndex
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  Featured Work
                </p>

                <h2 className="text-3xl font-black sm:text-5xl">
                  DSSA Projects
                </h2>

                <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
                  A collection of innovative ideas, technical
                  experiments and data-driven solutions created by
                  our community.
                </p>

              </div>

              {/* FEATURED INDICATORS */}
              <div className="absolute bottom-6 right-6 flex gap-2 sm:bottom-10 sm:right-10">
                {featuredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFeaturedIndex(index)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === featuredIndex
                        ? "w-10 bg-cyan-400"
                        : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
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
                      ? "border-cyan-400 bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                      : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300"
                  }`}
                >
                  {filter}
                </button>
              );
            })}

          </div>
        </section>

        {/* PROJECT SHOWCASE */}
        <section className="space-y-16">

          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/30 shadow-[0_0_40px_rgba(15,23,42,0.6)]"
            >

              {/* SMALL PROJECT SLIDESHOW */}
              <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">

                <div className="relative h-[230px] overflow-hidden rounded-2xl border border-cyan-400/25 bg-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.10)] sm:h-[320px] lg:h-[380px]">

                  <ProjectSlideshow
                    images={project.images}
                    title={project.title}
                    interval={3000}
                  />

                  {/* PROJECT GLOW */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

                </div>
              </div>

              {/* GLASS INFORMATION PANEL */}
              <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:mx-6 sm:p-8 lg:mx-10 lg:mb-8 lg:p-10">

                <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

                  <div className="max-w-3xl">

                    <div className="mb-3 flex flex-wrap items-center gap-3">

                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {project.domain}
                      </span>

                      <span className="text-xs text-slate-500">
                        Project {index + 1}
                      </span>

                    </div>

                    <h2 className="text-2xl font-black sm:text-3xl">
                      {project.title}
                    </h2>

                    <p className="mt-4 leading-7 text-slate-400">
                      {project.description}
                    </p>

                    {/* TECHNOLOGIES */}
                    <div className="mt-6">

                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Technology Stack
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {project.technologies?.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300"
                          >
                            {technology}
                          </span>
                        ))}

                      </div>
                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex shrink-0 flex-wrap gap-3">

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                      GitHub ↗
                    </a>

                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    >
                      Live Demo ↗
                    </a>

                  </div>

                </div>

              </div>
            </article>
          ))}

          {filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
              <p className="text-slate-400">
                No projects available in this category yet.
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}