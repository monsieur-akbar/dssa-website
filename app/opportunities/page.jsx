
"use client";

import { useState } from "react";

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Data Science Intern – Analytics Team",
    org: "Tata Consultancy Services",
    type: "Internship",
    domain: "Data Science",
    skills: ["Python", "SQL", "Pandas"],
    location: "Pune / Hybrid",
    deadline: "2026-10-18",
    description: "Work on real client datasets, build dashboards and predictive models. 3–6 month internship with stipend.",
  },
  {
    id: 2,
    title: "ML Research Intern",
    org: "IIT Bombay – AI Lab",
    type: "Research",
    domain: "Machine Learning",
    skills: ["Python", "PyTorch", "Research"],
    location: "Mumbai (Remote possible)",
    deadline: "2026-10-12",
    description: "Assist in ongoing research on computer vision and multimodal models. Ideal for final-year students.",
  },
  {
    id: 3,
    title: "National Level Hackathon – Smart India Hackathon",
    org: "Ministry of Education",
    type: "Hackathon",
    domain: "AI / Full Stack",
    skills: ["Python", "ML", "Problem Solving"],
    location: "Online + Offline Finale",
    deadline: "2026-10-25",
    description: "Solve real-world problems using AI/ML. Team of 6, great for portfolio and networking.",
  },
  {
    id: 4,
    title: "Business Analyst Intern",
    org: "Deloitte",
    type: "Internship",
    domain: "Analytics",
    skills: ["SQL", "Excel", "Power BI"],
    location: "Bangalore / Hybrid",
    deadline: "2026-11-05",
    description: "Support consulting teams with data analysis, reporting and stakeholder presentations.",
  },
  {
    id: 5,
    title: "Generative AI Hackathon",
    org: "Microsoft + DSSA Partner",
    type: "Hackathon",
    domain: "Generative AI",
    skills: ["Python", "LLMs", "Prompt Engineering"],
    location: "Online",
    deadline: "2026-10-15",
    description: "Build applications using Azure OpenAI / open-source LLMs. Prizes and internship opportunities.",
  },
  {
    id: 6,
    title: "Undergraduate Research Assistant – NLP",
    org: "VIT Pune Faculty Project",
    type: "Research",
    domain: "NLP",
    skills: ["Python", "Transformers", "Research"],
    location: "VIT Pune Campus",
    deadline: "2026-10-30",
    description: "Work with faculty on a published research paper in natural language processing.",
  },
  {
    id: 7,
    title: "Data Engineering Intern",
    org: "Infosys",
    type: "Internship",
    domain: "Data Engineering",
    skills: ["SQL", "Python", "Spark"],
    location: "Pune",
    deadline: "2026-11-10",
    description: "Build and maintain data pipelines. Good exposure to enterprise-scale systems.",
  },
  {
    id: 8,
    title: "Open Source Contribution Sprint",
    org: "DSSA x GitHub Campus",
    type: "Hackathon",
    domain: "Open Source",
    skills: ["Git", "Python", "Documentation"],
    location: "Online",
    deadline: "2026-10-20",
    description: "Contribute to open-source data science tools. Mentorship and certificates provided.",
  },
];

const FILTERS = ["All", "Internship", "Hackathon", "Research"];
const DOMAIN_FILTERS = ["All", "Data Science", "Machine Learning", "Generative AI", "Analytics", "NLP", "Data Engineering"];

function daysLeft(deadline) {
  const today = new Date("2026-10-08");
  const end = new Date(deadline);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function DeadlineBadge({ deadline }) {
  const days = daysLeft(deadline);
  let style = "bg-slate-700 text-slate-300";
  let text = `${days} days left`;

  if (days <= 3) {
    style = "bg-red-500/20 text-red-400 border border-red-500/40";
    text = days <= 0 ? "Deadline passed" : `Only \( {days} day \){days === 1 ? "" : "s"} left!`;
  } else if (days <= 7) {
    style = "bg-amber-500/20 text-amber-400 border border-amber-500/40";
    text = `${days} days left`;
  } else {
    style = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
      ⏰ {text}
    </span>
  );
}

function TypeBadge({ type }) {
  const styles = {
    Internship: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Hackathon: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Research: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type] || "bg-slate-700 text-slate-300"}`}>
      {type}
    </span>
  );
}

export default function Opportunities() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");

  const filtered = OPPORTUNITIES.filter((o) => {
    const matchType = typeFilter === "All" || o.type === typeFilter;
    const matchDomain = domainFilter === "All" || o.domain === domainFilter;
    return matchType && matchDomain;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-400 text-sm font-medium mb-2">Education & Career</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Opportunities Board</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Internships, hackathons and research openings curated for DSSA members. Filter by type or domain and watch the deadlines.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center mr-1">Type:</span>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  typeFilter === f
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center mr-1">Domain:</span>
            {DOMAIN_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setDomainFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  domainFilter === f
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">
          Showing {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"}
        </p>

        {/* Listing */}
        <div className="space-y-4">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <TypeBadge type={opp.type} />
                    <DeadlineBadge deadline={opp.deadline} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-2">{opp.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{opp.org} · {opp.location}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed">{opp.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {opp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No opportunities match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}