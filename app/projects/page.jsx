"use client";

import { useEffect, useMemo, useState } from "react";
import projectData from "@/data/projects.json";

const filters = [
  "All",
  "AI/ML",
  "Data Analytics",
  "Web Development",
  "Research",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

function ImageSlideshow({
  images = [],
  interval = 3500,
  className = "",
  alt = "Technology showcase",
}) {
  const safeImages = useMemo(
    () => (images.length ? images : [fallbackImage]),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  useEffect(() => {
    setActiveIndex(0);
    setFailedImages([]);
  }, [safeImages]);

  useEffect(() => {
    if (safeImages.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [safeImages, interval]);

  const usableImages = safeImages.filter(
    (src) => !failedImages.includes(src)
  );

  const currentImage =
    usableImages.length > 0
      ? usableImages[activeIndex % usableImages.length]
      : fallbackImage;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {usableImages.length > 0 ? (
        usableImages.map((src) => (
          <img
            key={src}
            src={src}
            alt={alt}
            onError={() =>
              setFailedImages((previous) =>
                previous.includes(src) ? previous : [...previous, src]
              )
            }
            className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ${
              src === currentImage
                ? "scale-100 opacity-100"
                : "scale-110 opacity-0"
            }`}
          />
        ))
      ) : (
        <img
          src={fallbackImage}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-[#050816]/20 to-transparent" />

      {usableImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {usableImages.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                src === currentImage
                  ? "w-7 bg-cyan-300"
                  : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function FloatingMessage({ message, index }) {
  const accentClasses = [
    "hover:border-cyan-300/50 hover:shadow-cyan-400/10",
    "hover:border-violet-300/50 hover:shadow-violet-400/10",
    "hover:border-blue-300/50 hover:shadow-blue-400/10",
    "hover:border-fuchsia-300/50 hover:shadow-fuchsia-400/10",
  ];

  const symbols = ["✳", "⌘", "↗", "◇", "✦", "∞"];

  return (
    <article
      className={`projects-glass rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        accentClasses[index % accentClasses.length]
      }`}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-lg text-cyan-200">
        {symbols[index % symbols.length]}
      </div>

      <h3 className="text-base font-bold text-white">{message.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {message.description}
      </p>
    </article>
  );
}

function InnovationSection({ area, index }) {
  const accentClasses = {
    cyan: "from-cyan-400/60 via-blue-500/30 to-transparent",
    violet: "from-violet-400/60 via-fuchsia-500/30 to-transparent",
    blue: "from-blue-400/60 via-cyan-500/30 to-transparent",
    fuchsia: "from-fuchsia-400/60 via-violet-500/30 to-transparent",
  };

  const remoteImages = area.images?.length ? area.images : [fallbackImage];

  // Local photos are tried first; online images are the fallback.
  const slideshowImages = useMemo(
    () => [...(area.localImages || []), ...remoteImages],
    [area.localImages, remoteImages]
  );

  return (
    <article className="group relative">
      <div
        className={`absolute -inset-[1px] rounded-[28px] bg-gradient-to-br ${
          accentClasses[area.accent] || accentClasses.cyan
        } opacity-60 blur-[2px] transition duration-500 group-hover:opacity-100 group-hover:blur-md`}
      />

      <div className="relative grid overflow-hidden rounded-[27px] border border-white/10 bg-[#090f22]/95 lg:grid-cols-2">
        <div
          className={`relative min-h-[290px] overflow-hidden ${
            index % 2 === 1 ? "lg:order-2" : ""
          }`}
        >
          <ImageSlideshow
            images={slideshowImages}
            interval={3200 + index * 300}
            className="absolute inset-0 h-full min-h-[290px] w-full lg:min-h-[430px]"
            alt={area.title}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#090f22]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#090f22]/30" />

          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-lg">
            INNOVATION AREA 0{index + 1}
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
            {area.eyebrow}
          </p>

          <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
            {area.title}
          </h3>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            {area.description}
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
              Explore the Domain
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {area.domainMessage}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
              Learning & Guidance
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {area.facultyMessage}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {area.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project, index }) {
  const images = project.images?.length ? project.images : [fallbackImage];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000 + index * 250);

    return () => clearInterval(timer);
  }, [images, index]);

  return (
    <article className="group relative">
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-400/35 via-violet-500/20 to-blue-500/35 opacity-50 blur-sm transition duration-500 group-hover:opacity-100 group-hover:blur-md" />

      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#090f22]">
        <div className="relative h-52 overflow-hidden">
          {images.map((src, imageIndex) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                imageIndex === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090f22] via-transparent to-transparent" />

          <span className="absolute left-4 top-4 rounded-full border border-cyan-300/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-md">
            {project.domain}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-white transition group-hover:text-cyan-200">
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies?.map((technology) => (
              <span
                key={technology}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
              >
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
            >
              GitHub ↗
            </a>

            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Live Demo ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const featuredImages = projectData.featuredImages || [];
  const innovationAreas = projectData.innovationAreas || [];
  const cultureMessages = projectData.cultureMessages || [];
  const projects = projectData.projects || [];

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;

    return projects.filter((project) => project.domain === activeFilter);
  }, [activeFilter, projects]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes projectsGlow {
          0%,
          100% {
            box-shadow: 0 0 18px rgba(34, 211, 238, 0.08);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.17);
          }
        }

        .projects-glow {
          animation: projectsGlow 5s ease-in-out infinite;
        }

        .projects-glass {
          animation: projectsGlow 6s ease-in-out infinite;
        }

        .projects-grid-bg {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.035) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* HERO */}
      <section className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="projects-grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-cyan-300/70" />
            <p className="text-center text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">
              Discover Our Innovation
            </p>
            <span className="h-px w-8 bg-cyan-300/70" />
          </div>

          <h1 className="mx-auto max-w-5xl text-center text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            More Than Projects.
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              A Culture of Creation.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-7 text-slate-300 sm:text-base">
            A space where curiosity meets technology, students collaborate
            across disciplines, and ideas grow through learning and innovation.
          </p>

          <div className="mx-auto mt-10 max-w-6xl">
            <div className="projects-glow relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-slate-900/60 p-1.5 sm:rounded-[36px] sm:p-2">
              <ImageSlideshow
                images={featuredImages}
                interval={3500}
                className="h-[300px] rounded-[22px] sm:h-[430px] sm:rounded-[30px] lg:h-[500px]"
                alt="Technology and student innovation"
              />

              <div className="absolute inset-x-5 bottom-8 z-10 sm:inset-x-10 sm:bottom-12">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200 sm:text-sm">
                  Imagine · Build · Discover
                </p>
                <h2 className="mt-3 max-w-2xl text-2xl font-extrabold sm:text-4xl">
                  Every idea has the potential to make a difference.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR MAIN SECTIONS + FLOATING BOXES */}
      <section className="relative px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Innovation Landscape"
            title="Four Domains. One Community."
            description="Explore the learning environment, technical domains and research mindset that shape our department and club."
          />

          <div className="space-y-7">
            {innovationAreas.map((area, index) => (
              <div key={area.id} className="space-y-7">
                <InnovationSection area={area} index={index} />

                {index < innovationAreas.length - 1 && (
                  <div className="grid gap-4 py-1 sm:grid-cols-2 lg:grid-cols-3">
                    {cultureMessages
                      .slice(index, index + 3)
                      .map((message, messageIndex) => (
                        <FloatingMessage
                          key={message.title}
                          message={message}
                          index={index + messageIndex}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXISTING PROJECT DIRECTORY */}
      <section
        id="project-directory"
        className="relative px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="projects-grid-bg pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Explore the Showcase"
            title="Projects Built With Purpose"
            description="Explore the projects contributed by our student community. This directory can grow as more work is added."
          />

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                  activeFilter === filter
                    ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/10"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.06] hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">
                More projects are on the way.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                We are preparing more work for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CLOSING SECTION */}
      <section className="px-4 pb-20 pt-6 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.08] via-[#0b1024] to-violet-500/[0.08] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">
            Your Next Idea Starts Here
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
            Think boldly. Experiment freely. Create something meaningful.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Every learning experience is an opportunity to explore new ideas,
            build confidence and grow together as a technical community.
          </p>

          <a
            href="#project-directory"
            className="mt-8 inline-flex rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            Explore Projects ↓
          </a>
        </div>
      </section>
    </main>
  );
}