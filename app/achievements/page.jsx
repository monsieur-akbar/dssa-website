
"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import achievementsData from "@/data/achievements.json";
import projectData from "@/data/projects.json";
import {
  Award,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Cpu,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Microscope,
  Sparkles,
  Users,
} from "lucide-react";

const heroFallbackImages = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85",
];

const domainFallbackImages = {
  software: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  ],
  hardware: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
  ],
  ai: [
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
  ],
  data: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  ],
  research: [
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1455390582262-044c04d277ea?auto=format&fit=crop&w=1200&q=85",
  ],
  culture: [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
  ],
};

// Keep these paths aligned with the local photo paths used in
// your previous showcase. Add the corresponding real photos in public.
const localAchievementImages = [
  "/achievements/achievement-1.jpg",
  "/achievements/achievement-2.jpg",
  "/achievements/achievement-3.jpg",
  "/achievements/achievement-4.jpg",
];

const domains = [
  {
    id: "software",
    number: "01",
    title: "Software Development",
    eyebrow: "Build for the real world",
    description:
      "Transform ideas into useful digital experiences through web applications, software engineering, and practical problem-solving.",
    tags: ["Web Development", "Application Design", "Engineering"],
    images: domainFallbackImages.software,
    icon: Code2,
  },
  {
    id: "hardware",
    number: "02",
    title: "Hardware & IoT",
    eyebrow: "Make ideas tangible",
    description:
      "Explore electronics, embedded systems, connected devices, and prototypes that bridge software with the physical world.",
    tags: ["Electronics", "Embedded Systems", "IoT"],
    images: domainFallbackImages.hardware,
    icon: Cpu,
  },
  {
    id: "ai",
    number: "03",
    title: "AI & Machine Learning",
    eyebrow: "Make intelligence useful",
    description:
      "Experiment with intelligent systems, predictive models, computer vision, and machine learning to investigate real-world problems.",
    tags: ["Machine Learning", "AI", "Computer Vision"],
    images: domainFallbackImages.ai,
    icon: Lightbulb,
  },
  {
    id: "data",
    number: "04",
    title: "Data Science & Analytics",
    eyebrow: "Find meaning in data",
    description:
      "Turn raw information into insights through data exploration, statistical thinking, visualization, and analytical problem-solving.",
    tags: ["Data Analytics", "Statistics", "Visualization"],
    images: domainFallbackImages.data,
    icon: FlaskConical,
  },
  {
    id: "research",
    number: "05",
    title: "Research Culture",
    eyebrow: "Ask better questions",
    description:
      "Encourage curiosity, structured experimentation, literature exploration, and the development of ideas backed by evidence.",
    tags: ["Experimentation", "Research", "Innovation"],
    images: domainFallbackImages.research,
    icon: Microscope,
  },
  {
    id: "collaboration",
    number: "06",
    title: "Innovation & Collaboration",
    eyebrow: "Create together",
    description:
      "Bring different skills and perspectives together through teamwork, peer learning, technical discussions, and shared challenges.",
    tags: ["Teamwork", "Peer Learning", "Creativity"],
    images: domainFallbackImages.culture,
    icon: Users,
  },
];

const cultureMessages = [
  {
    title: "Learn by doing",
    description:
      "Explore concepts through experimentation, practice, iteration, and hands-on technical learning.",
    icon: Lightbulb,
  },
  {
    title: "Grow through mentorship",
    description:
      "Learn from faculty guidance, constructive feedback, and the experience of fellow members.",
    icon: GraduationCap,
  },
  {
    title: "Build through teamwork",
    description:
      "Share knowledge, combine strengths, and collaborate to develop better ideas and solutions.",
    icon: Users,
  },
  {
    title: "Think like a researcher",
    description:
      "Stay curious, question assumptions, explore evidence, and keep improving your understanding.",
    icon: Microscope,
  },
];

const categories = [
  "All",
  "Hackathons",
  "Research",
  "Milestones",
  "Participation",
  "Industrial Visits",
];

function AutomaticSlideshow({
  images,
  alt,
  interval = 4500,
  className = "",
  imageClassName = "",
}) {
  const safeImages = images?.length ? images : heroFallbackImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  useEffect(() => {
    setCurrentIndex(0);
    setFailedImages([]);
  }, [images]);

  useEffect(() => {
    if (safeImages.length <= 1) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % safeImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [safeImages, interval]);

  const currentImage = safeImages[currentIndex];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {currentImage && !failedImages.includes(currentImage) ? (
        <img
          key={currentImage}
          src={currentImage}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover ${imageClassName}`}
          onError={() => {
            setFailedImages((previous) =>
              previous.includes(currentImage)
                ? previous
                : [...previous, currentImage]
            );
          }}
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center bg-[#0D0D0D] px-5 text-center text-sm text-[#737373]">
          Add the corresponding photo to display it here.
        </div>
      )}

      {safeImages.length > 1 && (
        <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md">
          {currentIndex + 1} / {safeImages.length}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8 border-b border-[#262626] pb-5 sm:mb-10">
      <p className="mb-2 text-xs font-mono uppercase tracking-[0.2em] text-[#00A3FF]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#A3A3A3] sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function AchievementCard({ achievement, index }) {
  const suppliedImages = Array.isArray(achievement.images)
    ? achievement.images.filter(Boolean)
    : [];

  // Use existing achievement photo paths when the JSON has no image list.
  const images = suppliedImages.length
    ? suppliedImages
    : [localAchievementImages[index % localAchievementImages.length]];

  return (
    <article className="group overflow-hidden rounded-xl border border-[#262626] bg-[#0D0D0D] transition duration-300 hover:-translate-y-1 hover:border-[#00A3FF]/60">
      <div className="relative h-52 overflow-hidden border-b border-[#262626] sm:h-60">
        <AutomaticSlideshow
          images={images}
          alt={achievement.title}
          className="h-full w-full"
          imageClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/65 px-3 py-1.5 text-xs text-white backdrop-blur-md">
          <Award size={14} className="text-[#00A3FF]" />
          {achievement.category || "Achievement"}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-white">
          {achievement.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#A3A3A3]">
          {achievement.description}
        </p>

        {achievement.highlights?.length > 0 && (
          <div className="mt-5 border-t border-[#262626] pt-4">
            <p className="mb-3 text-[11px] font-mono uppercase tracking-widest text-[#737373]">
              Highlights
            </p>
            <ul className="space-y-2.5">
              {achievement.highlights.map((highlight, highlightIndex) => (
                <li
                  key={`${highlight}-${highlightIndex}`}
                  className="flex items-start gap-2.5 text-sm leading-6 text-[#A3A3A3]"
                >
                  <CheckCircle2
                    size={15}
                    className="mt-1 shrink-0 text-[#00A3FF]"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function DomainCard({ domain }) {
  const Icon = domain.icon;

  return (
    <article className="group overflow-hidden rounded-xl border border-[#262626] bg-[#0D0D0D] transition duration-300 hover:-translate-y-1 hover:border-[#00A3FF]/60">
      <div className="relative h-56 overflow-hidden sm:h-64">
        <AutomaticSlideshow
          images={domain.images}
          alt={domain.title}
          className="h-full w-full"
          interval={4000}
          imageClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 rounded-md border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md">
          {domain.number} / DSSA
        </div>

        <div className="absolute bottom-4 left-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[#00A3FF]/30 bg-black/70 text-[#00A3FF] backdrop-blur-md">
          <Icon size={20} />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#00A3FF]">
          {domain.eyebrow}
        </p>

        <h3 className="mt-2 text-xl font-bold tracking-tight text-white">
          {domain.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#A3A3A3]">
          {domain.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {domain.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[#262626] bg-black px-2.5 py-1.5 text-xs text-[#A3A3A3] transition-colors group-hover:border-[#404040]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-[#262626] pt-4 text-xs text-[#737373]">
          <Sparkles size={14} className="text-[#00A3FF]" />
          Explore, experiment, innovate
        </div>
      </div>
    </article>
  );
}

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const achievements = Array.isArray(achievementsData)
    ? achievementsData
    : achievementsData.achievements || [];

  // Reuse the images already configured in the previous showcase.
  const configuredHeroImages = Array.isArray(projectData.featuredImages)
    ? projectData.featuredImages.filter(Boolean)
    : [];

  const heroImages = [
    ...new Set([...configuredHeroImages, ...heroFallbackImages]),
  ];

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

  return (
    <main className="min-h-screen overflow-hidden bg-[#000000] pb-24 text-white">
      <PageHeader
        eyebrow="DSSA · Achievements & Innovation"
        title="Ideas Into Impact"
        description="Celebrating student accomplishments, technical curiosity, collaborative learning, and a culture of innovation."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero: one large automatic slideshow, with no thumbnail previews. */}
        <section className="relative mt-8 sm:mt-12">
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-[#00A3FF]/10 blur-xl" />

          <div className="relative overflow-hidden rounded-xl border border-[#262626] bg-[#0D0D0D]">
            <div className="relative h-[340px] sm:h-[460px] lg:h-[540px]">
              <AutomaticSlideshow
                images={heroImages}
                alt="DSSA technical innovation showcase"
                interval={5000}
                className="absolute inset-0"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-end p-6 sm:p-10 lg:p-14">
                <div className="max-w-2xl">
                  <p className="mb-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#33B5FF]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00A3FF]" />
                    Think · Build · Explore · Publish
                  </p>

                  <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    More than achievements.
                    <span className="mt-2 block text-[#33B5FF]">
                      A culture of creation.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#D4D4D4] sm:text-base">
                    Discover the accomplishments, ideas, technical communities,
                    and shared learning that shape the DSSA experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section id="achievements" className="mt-20 scroll-mt-24 sm:mt-28">
          <SectionHeading
            eyebrow="Wall of Fame"
            title="Achievements & Milestones"
            description="Recognizing accomplishments across hackathons, research, internships, competitions, and student initiatives."
          />

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                      active
                        ? "border-[#00A3FF] bg-[#001A29] text-[#33B5FF]"
                        : "border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:border-[#404040] hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <label className="flex w-full items-center gap-2 rounded-lg border border-[#262626] bg-[#0D0D0D] px-3 py-2.5 sm:max-w-xs">
              <span className="text-xs text-[#737373]">Search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Find an achievement..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#737373]"
              />
            </label>
          </div>

          {filteredAchievements.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id ?? achievement.title}
                  achievement={achievement}
                  index={achievements.indexOf(achievement)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#262626] bg-[#0D0D0D] px-5 py-12 text-center">
              <Award className="mx-auto mb-3 text-[#00A3FF]" size={28} />
              <h3 className="font-semibold text-white">
                No matching achievements
              </h3>
              <p className="mt-2 text-sm text-[#A3A3A3]">
                Try another category or search term.
              </p>
            </div>
          )}
        </section>

        {/* Technical domains */}
        <section id="domains" className="mt-20 scroll-mt-24 sm:mt-28">
          <SectionHeading
            eyebrow="Explore Our Domains"
            title="Where Ideas Take Shape"
            description="DSSA encourages exploration across software, hardware, artificial intelligence, data, research, and collaborative innovation."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {domains.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </section>

        {/* Culture and mentorship */}
        <section id="culture" className="mt-20 scroll-mt-24 sm:mt-28">
          <SectionHeading
            eyebrow="The DSSA Experience"
            title="People Behind the Progress"
            description="Strong technical communities grow through mentorship, curiosity, experimentation, and people who help each other improve."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cultureMessages.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group rounded-xl border border-[#262626] bg-[#0D0D0D] p-5 transition-colors hover:border-[#00A3FF]/50 sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#262626] bg-black text-[#00A3FF] transition-colors group-hover:border-[#00A3FF]/40">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-4 font-bold text-white">{item.title}</h3>

                  <p className="mt-2 text-sm leading-7 text-[#A3A3A3]">
                    {item.description}
                  </p>

                  <div className="mt-5 border-t border-[#262626] pt-4 text-xs text-[#737373]">
                    DSSA · Learn and grow
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-[#262626] bg-[#0D0D0D] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#00A3FF]">
                Keep Exploring
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">
                Curiosity is where innovation begins.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#A3A3A3]">
                Discover more of the DSSA community through its events,
                people, learning opportunities, and shared experiences.
              </p>
            </div>

            <a
              href="/events"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#262626] bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#E5E5E5]"
            >
              Explore Events
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
