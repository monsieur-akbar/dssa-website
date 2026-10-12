import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code,
  Compass,
  Eye,
  GraduationCap,
  Lightbulb,
  Rocket,
  Target,
  Terminal,
  Trophy,
  Users,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import about from "@/data/about.json";

export const metadata = {
  title: "About | DSSA VIT Pune",
  description:
    "The vision, mission, core objectives, and student experience of the Data Science Student Association at VIT Pune.",
};

const objectiveIcons = {
  graduation: GraduationCap,
  code: Code,
  trophy: Trophy,
  users: Users,
  lightbulb: Lightbulb,
  briefcase: Briefcase,
};

const pillarIcons = {
  "learn-by-doing": Terminal,
  "community-collaboration": Users,
  "innovation-opportunities": Rocket,
  "mentorship-growth": Compass,
};

function VisionMissionCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#0D0D0D] p-6 sm:p-8 hover:border-[#404040] transition-colors">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D0D0D] text-[#00A3FF] border border-[#262626]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-[#FFFFFF] tracking-tight">{title}</h2>
      <p className="mt-2 leading-relaxed text-sm text-[#A3A3A3]">{text}</p>
    </div>
  );
}

export default function About() {
  const { vision, mission, objectives, specialPillars, studentJourney } = about;

  return (
    <div className="min-h-screen bg-[#000000] pb-24 text-[#FFFFFF]">
      <PageHeader
        eyebrow="ABOUT DSSA"
        title="Learning Data Science by Building With It"
        description="The Data Science Student Association is a premier technical community at Vishwakarma Institute of Technology, Pune."
      />

      <section
        aria-label="Vision and mission"
        className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2"
      >
        <VisionMissionCard
          icon={Eye}
          title={vision.title}
          text={vision.text}
        />
        <VisionMissionCard
          icon={Target}
          title={mission.title}
          text={mission.text}
        />
      </section>

      <section
        aria-labelledby="objectives-heading"
        className="mx-auto mt-20 max-w-5xl px-4 sm:px-6"
      >
        <div className="pb-4 border-b border-[#262626] mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFFFFF] block mb-1">
            Focus Areas
          </span>
          <h2 id="objectives-heading" className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
            Core Objectives
          </h2>
          <p className="mt-1 text-sm text-[#A3A3A3]">
            Key technical and organizational pursuits driven by the club each semester.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => {
            const Icon = objectiveIcons[objective.icon] ?? Lightbulb;
            return (
              <li
                key={objective.title}
                className="rounded-xl border border-[#262626] bg-[#0D0D0D] p-5 transition-colors hover:border-[#404040]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#262626] flex items-center justify-center text-[#00A3FF] mb-3">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-sm text-[#FFFFFF]">{objective.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A3A3A3]">
                  {objective.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="special-heading"
        className="mx-auto mt-20 max-w-5xl px-4 sm:px-6"
      >
        <div className="pb-4 border-b border-[#262626] mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00A3FF] block mb-1">
            Why DSSA
          </span>
          <h2 id="special-heading" className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
            What Makes DSSA Special
          </h2>
          <p className="mt-1 text-sm text-[#A3A3A3]">
            How our technical community bridges academic concepts with real-world engineering, peer collaboration, and student growth.
          </p>
        </div>

        {/* Core Experience Pillars */}
        <div className="grid gap-5 md:grid-cols-2">
          {specialPillars?.map((pillar) => {
            const Icon = pillarIcons[pillar.id] ?? Terminal;
            return (
              <div
                key={pillar.id}
                className="group rounded-xl border border-[#262626] bg-[#0D0D0D] p-6 sm:p-7 hover:border-[#404040] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#000000] border border-[#262626] flex items-center justify-center text-[#00A3FF]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373] bg-[#000000] px-2.5 py-1 rounded border border-[#262626]">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#FFFFFF] tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-[#00A3FF] mt-0.5">
                    {pillar.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#262626]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#737373] block mb-2.5">
                    Key Highlights
                  </span>
                  <ul className="space-y-2">
                    {pillar.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#A3A3A3]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3FF] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Learning Journey */}
        <div className="mt-16 pt-12 border-t border-[#262626]">
          <div className="pb-4 border-b border-[#262626] mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFFFFF] block mb-1">
              Growth Pathway
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight">
              The DSSA Student Experience
            </h3>
            <p className="mt-1 text-sm text-[#A3A3A3]">
              A four-stage progression that takes members from curious beginners to confident builders and mentors.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studentJourney?.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-[#262626] bg-[#0D0D0D] p-5 hover:border-[#404040] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black font-mono text-[#00A3FF] tracking-tight">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">
                      Phase {step.step}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#FFFFFF] tracking-tight">
                    {step.phase}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#A3A3A3]">
                    {step.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Get Involved Callout */}
        <div className="mt-12 rounded-xl border border-[#262626] bg-[#0D0D0D] p-6 sm:p-8 hover:border-[#404040] transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00A3FF] block mb-1">
                Get Involved
              </span>
              <h3 className="text-xl font-bold text-[#FFFFFF] tracking-tight">
                Build With the DSSA Community
              </h3>
              <p className="mt-2 text-sm text-[#A3A3A3] leading-relaxed">
                Whether you want to contribute to active AI pods, participate in upcoming hackathons, or attend hands-on workshops, explore where you can jump in.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FFFFFF] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#000000] hover:bg-[#E5E5E5] transition-colors border border-[#262626]"
              >
                <span>View Opportunities</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FFFFFF] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#404040] transition-colors"
              >
                <span>Events</span>
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#404040] transition-colors"
              >
                <span>Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}