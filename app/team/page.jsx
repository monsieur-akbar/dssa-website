"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import teamData from "@/data/team.json";
import { Mail, Shield, User } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

export default function Team() {
  const { faculty, committee } = teamData;
  const [selectedCommittee, setSelectedCommittee] = useState("all");

  const filteredCommittee =
    selectedCommittee === "all"
      ? committee
      : committee.filter((c) => c.id === selectedCommittee);

  return (
    <div className="min-h-screen bg-[#000000] pb-24 text-[#FFFFFF]">
      <PageHeader
        eyebrow="TEAM DIRECTORY"
        title="The People Powering DSSA"
        description="Faculty advisors, executive officers, and departmental coordinators steering data science innovation at VIT Pune."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        {/* 1. FACULTY MENTOR SECTION */}
        {faculty && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#262626]">
              <Shield className="w-4 h-4 text-[#FFFFFF]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#A3A3A3]">
                Faculty Leadership
              </span>
            </div>

            <div className="rounded-2xl border border-[#262626] bg-[#0D0D0D] p-6 sm:p-8 hover:border-[#404040] transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3 flex justify-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-[#000000] border border-[#262626] overflow-hidden flex items-center justify-center">
                    {faculty.photo ? (
                      <img
                        src={faculty.photo}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#737373]" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-9 flex flex-col justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#0D0D0D] text-[#00A3FF] border border-[#262626] inline-block mb-2">
                      {faculty.designation}
                    </span>
                    <h2 className="text-2xl font-bold text-[#FFFFFF] tracking-tight">
                      {faculty.name}
                    </h2>
                    <p className="text-xs text-[#A3A3A3] font-mono mt-0.5 mb-3">
                      {faculty.department}
                    </p>
                    <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-3xl">
                      {faculty.bio}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#262626]">
                    {faculty.linkedin && (
                      <a
                        href={faculty.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#000000] border border-[#262626] hover:border-[#404040] text-[#A3A3A3] hover:text-[#00A3FF] transition-colors"
                        aria-label="LinkedIn Profile"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}
                    {faculty.email && (
                      <a
                        href={`mailto:${faculty.email}`}
                        className="p-2 rounded-lg bg-[#000000] border border-[#262626] hover:border-[#404040] text-[#A3A3A3] hover:text-[#00A3FF] transition-colors"
                        aria-label="Email Contact"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMMITTEE FILTER TABS */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-3 border-b border-[#262626]">
          <div>
            <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight">
              Student Committee
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Explore teams across core governance, engineering, aesthetics, and logistics.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCommittee("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors border ${
                selectedCommittee === "all"
                  ? "border-[#262626] bg-[#0D0D0D] text-[#00A3FF] font-bold"
                  : "border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:border-[#404040]"
              }`}
            >
              All Committees
            </button>
            {committee.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedCommittee(dept.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors border ${
                  selectedCommittee === dept.id
                    ? "border-[#262626] bg-[#0D0D0D] text-[#00A3FF] font-bold"
                    : "border-[#262626] bg-[#0D0D0D] text-[#A3A3A3] hover:border-[#404040]"
                }`}
              >
                {dept.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3. COMMITTEE SECTIONS & MEMBER CARDS */}
        <div className="space-y-12">
          {filteredCommittee.map((dept) => (
            <section key={dept.id} className="space-y-4">
              <div className="flex items-baseline justify-between pb-2 border-b border-[#262626]/70">
                <h3 className="text-lg font-bold text-[#FFFFFF]">
                  {dept.title}
                </h3>
                <span className="text-xs text-[#A3A3A3] font-mono hidden sm:inline">
                  {dept.description}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dept.members.map((member, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#262626] bg-[#0D0D0D] p-5 hover:border-[#404040] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-[#000000] border border-[#262626] flex items-center justify-center font-bold text-sm text-[#FFFFFF] mb-3 font-mono">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <h4 className="font-bold text-sm text-[#FFFFFF] tracking-tight">
                        {member.name}
                      </h4>
                      <p className="text-xs text-[#00A3FF] font-mono mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#262626]">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-[#000000] text-[#A3A3A3] hover:text-[#00A3FF] transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-[#000000] text-[#A3A3A3] hover:text-[#00A3FF] transition-colors"
                          aria-label={`${member.name} GitHub`}
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
