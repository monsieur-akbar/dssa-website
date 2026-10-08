import FacultyCard from "@/components/FacultyCard";
import PageHeader from "@/components/PageHeader";
import ProfileCard from "@/components/ProfileCard";
import team from "@/data/team.json";

export const metadata = {
title: "Team | DSSA VIT Pune",
description:
"Meet the faculty coordinator and core committee of the Data Science Student Association at VIT Pune.",
};

export default function Team() {
const { faculty, committee } = team;

return ( <div className="pb-20"> <PageHeader
     eyebrow="Our team"
     title="The people behind DSSA"
     description="A faculty coordinator and a student core committee that keep the club learning, building and shipping."
   />

```
  {/* Faculty Coordinator */}
  <section
    aria-label="Faculty coordinator"
    className="mx-auto max-w-5xl px-4 sm:px-6"
  >
    <FacultyCard faculty={faculty} />
  </section>

  {/* Core Committee */}
  <section
    aria-labelledby="committee-heading"
    className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8"
  >
    <h2
      id="committee-heading"
      className="text-center text-2xl font-bold text-white"
    >
      Core committee
    </h2>

    {/* Committee Navigation */}
    <nav
      aria-label="Committee domains"
      className="mt-4 flex flex-wrap justify-center gap-2"
    >
      {committee.map((domain) => (
        <a
          key={domain.id}
          href={`#${domain.id}`}
          className="rounded-full border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          {domain.title}
        </a>
      ))}
    </nav>

    {/* Committee Domains */}
    <div className="mt-12 space-y-16">
      {committee.map((domain) => (
        <section
          key={domain.id}
          id={domain.id}
          aria-labelledby={`${domain.id}-heading`}
          className="scroll-mt-24"
        >
          {/* Domain Heading */}
          <div className="text-center">
            <h3
              id={`${domain.id}-heading`}
              className="text-xl font-semibold text-white"
            >
              {domain.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {domain.description}
            </p>
          </div>

          {/* Members */}
          <ul className="mt-6 flex flex-wrap justify-center gap-4">
            {domain.members.map((member, index) => (
              <li
                key={`${domain.id}-${index}`}
                className="w-72 sm:w-80"
              >
                <ProfileCard
                  member={member}
                  accent={domain.accent}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </section>
</div>


);
}
