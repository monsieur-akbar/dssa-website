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

function VisionMissionCard({ icon: Icon, title, text, tone }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

export default function About() {
  const { vision, mission, objectives, milestones } = about;

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="About DSSA"
        title="Learning data science by building with it"
        description="The Data Science Student Association is a student-run community at Vishwakarma Institute of Technology, Pune."
      />

      <section
        aria-label="Vision and mission"
        className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2"
      >
        <VisionMissionCard
          icon={Eye}
          title={vision.title}
          text={vision.text}
          tone="bg-blue-500/10 text-blue-400"
        />
        <VisionMissionCard
          icon={Target}
          title={mission.title}
          text={mission.text}
          tone="bg-cyan-500/10 text-cyan-400"
        />
      </section>

      <section
        aria-labelledby="objectives-heading"
        className="mx-auto mt-20 max-w-5xl px-4 sm:px-6"
      >
        <h2 id="objectives-heading" className="text-2xl font-bold text-white">
          Core objectives
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          What the club works on, every semester.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => {
            const Icon = objectiveIcons[objective.icon] ?? Lightbulb;
            return (
              <li
                key={objective.title}
                className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 transition-colors hover:border-slate-700"
              >
                <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-white">{objective.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
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
        <h2 id="journey-heading" className="text-2xl font-bold text-white">
          Our journey
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Key moments in how DSSA grew.
        </p>
        <div className="mt-8">
          <Timeline items={milestones} />
        </div>
      </section>
    </div>
  );
}