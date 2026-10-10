import { Briefcase, Code, Eye, GraduationCap, Lightbulb, Target, Trophy, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";
import about from "@/data/about.json";

export const metadata = {
  title: "About | DSSA VIT Pune",
  description:
    "The vision, mission, objectives and journey of the Data Science Student Association at VIT Pune.",
};

const objectiveIcons = {
  graduation: GraduationCap,
  code: Code,
  trophy: Trophy,
  users: Users,
  lightbulb: Lightbulb,
  briefcase: Briefcase,
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
  const { vision, mission, objectives, milestones } = about;

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
        aria-labelledby="journey-heading"
        className="mx-auto mt-20 max-w-3xl px-4 sm:px-6"
      >
        <div className="pb-4 border-b border-[#262626] mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFFFFF] block mb-1">
            Milestones
          </span>
          <h2 id="journey-heading" className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
            Our Journey
          </h2>
          <p className="mt-1 text-sm text-[#A3A3A3]">
            Key milestones shaping the evolution of DSSA at VIT Pune.
          </p>
        </div>

        <div>
          <Timeline items={milestones} />
        </div>
      </section>
    </div>
  );
}