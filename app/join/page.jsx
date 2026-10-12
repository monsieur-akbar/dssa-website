"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2,
  Brain,
  Palette,
  Briefcase,
  Megaphone,
  Calendar,
  FileText,
  UserCheck,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Layers,
  Award
} from "lucide-react";
import opportunitiesData from "@/data/opportunities.json";

// Recruitment Timeline Milestones
const RECRUITMENT_TIMELINE = [
  {
    step: "01",
    phase: "Application Submission",
    date: "Oct 10 - Nov 05, 2026",
    status: "Active Now",
    description:
      "Submit your details, domain preferences, GitHub/portfolio links, and Statement of Purpose through our online portal.",
    highlight: true,
  },
  {
    step: "02",
    phase: "Domain Task & Evaluation",
    date: "Nov 07 - Nov 12, 2026",
    status: "Upcoming",
    description:
      "Shortlisted candidates receive a domain-specific take-home challenge (e.g., ML notebook benchmark, frontend task, design prompt, or case study).",
    highlight: false,
  },
  {
    step: "03",
    phase: "Technical & Cultural Interview",
    date: "Nov 15 - Nov 18, 2026",
    status: "Upcoming",
    description:
      "A 20-minute informal technical walkthrough with domain leads and DSSA executive core to discuss your passion, vision, and team fit.",
    highlight: false,
  },
  {
    step: "04",
    phase: "Final Induction & Kickoff",
    date: "Nov 22, 2026",
    status: "Upcoming",
    description:
      "Official welcome session, project allocation to active DSSA R&D pods, repository access, and internal orientation bootcamp.",
    highlight: false,
  },
];

// Department Options at VIT Pune
const DEPARTMENTS = [
  "Artificial Intelligence & Data Science",
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication (ENTC)",
  "Mechanical Engineering",
  "Instrumentation & Control",
  "Chemical / Production Engineering",
  "Other / Multidisciplinary",
];

// Academic Years
const ACADEMIC_YEARS = [
  "First Year (FY B.Tech)",
  "Second Year (SY B.Tech)",
  "Third Year (TY B.Tech)",
  "Final Year (B.Tech)",
  "Postgraduate / M.Tech",
];

export default function JoinPage() {
  // Selected Track for details modal / filter
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All");

  // Form State
  const initialFormState = {
    fullName: "",
    email: "",
    prn: "",
    phone: "",
    year: "",
    department: "",
    primaryDomain: "AI & Machine Learning",
    secondaryDomain: "Full-Stack & Systems",
    resumeLink: "",
    githubOrPortfolio: "",
    statementOfPurpose: "",
    pastExperience: "",
    agreeToCommitment: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Icon mapping for tracks
  const getTrackIcon = (trackName) => {
    if (trackName.includes("AI") || trackName.includes("Machine")) {
      return <Brain className="w-5 h-5 text-[#00A3FF]" />;
    }
    if (trackName.includes("Stack") || trackName.includes("Developer") || trackName.includes("Systems")) {
      return <Code2 className="w-5 h-5 text-[#FFFFFF]" />;
    }
    if (trackName.includes("Design") || trackName.includes("Creative") || trackName.includes("Media")) {
      return <Palette className="w-5 h-5 text-[#FFFFFF]" />;
    }
    if (trackName.includes("Operations") || trackName.includes("Management")) {
      return <Briefcase className="w-5 h-5 text-[#FFFFFF]" />;
    }
    return <Megaphone className="w-5 h-5 text-[#A3A3A3]" />;
  };

  // Filtered Opportunities
  const filteredOpportunities =
    selectedTrackFilter === "All"
      ? opportunitiesData
      : opportunitiesData.filter((opp) => opp.track.includes(selectedTrackFilter) || opp.type.includes(selectedTrackFilter));

  // Form Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.prn.trim()) {
      errors.prn = "PRN / College Roll Number is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Contact number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.year) {
      errors.year = "Please select your academic year";
    }

    if (!formData.department) {
      errors.department = "Please select your department";
    }

    if (!formData.resumeLink.trim()) {
      errors.resumeLink = "Resume or Drive link is required";
    } else if (!/^https?:\/\//i.test(formData.resumeLink)) {
      errors.resumeLink = "Must be a valid URL starting with http:// or https://";
    }

    if (formData.githubOrPortfolio && !/^https?:\/\//i.test(formData.githubOrPortfolio)) {
      errors.githubOrPortfolio = "Must be a valid URL starting with http:// or https://";
    }

    if (!formData.statementOfPurpose.trim()) {
      errors.statementOfPurpose = "Statement of Purpose is required";
    } else if (formData.statementOfPurpose.trim().length < 50) {
      errors.statementOfPurpose = "Please provide at least 50 characters explaining your interest";
    }

    if (!formData.agreeToCommitment) {
      errors.agreeToCommitment = "You must confirm your availability for DSSA activities";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for field on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API network submission
    setTimeout(() => {
      setIsSubmitting(false);
      const submissionReceipt = {
        ...formData,
        applicationId: `DSSA-2026-REC-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
      setSubmittedData(submissionReceipt);
      setFormData(initialFormState);
      setFormErrors({});
    }, 1200);
  };

  const scrollToApply = (trackName) => {
    setFormData((prev) => ({
      ...prev,
      primaryDomain: trackName,
    }));
    const element = document.getElementById("recruitment-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#FFFFFF] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO & RECRUITMENT STATUS
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#262626] bg-[#000000] overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#000000] border border-[#262626] text-[#00A3FF] text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" />
            <span>ANNUAL RECRUITMENT DRIVE 2026-27 • APPLICATIONS OPEN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFFFFF] tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Build the Future of <br className="hidden sm:inline" />
            <span className="text-[#FFFFFF]">
              Artificial Intelligence
            </span>{" "}
            at VIT Pune
          </h1>

          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed mb-8">
            Join the premier data science organization on campus. Work on industry-grade machine learning pipelines, published research papers, high-traffic web platforms, and national hackathons.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#recruitment-form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-sm rounded-lg transition-colors border border-[#262626]"
            >
              <span>Apply for Core Team</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#recruitment-tracks"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#404040] font-semibold text-sm rounded-lg transition-colors"
            >
              <span>Explore Open Tracks</span>
              <Layers className="w-4 h-4 text-[#A3A3A3]" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto pt-8 border-t border-[#262626]">
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-center">
              <div className="text-2xl font-black text-[#FFFFFF] font-mono">5+</div>
              <div className="text-xs text-[#A3A3A3] font-mono uppercase tracking-wider mt-1">Specialized Tracks</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-center">
              <div className="text-2xl font-black text-[#00A3FF] font-mono">22+</div>
              <div className="text-xs text-[#A3A3A3] font-mono uppercase tracking-wider mt-1">Open Positions</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-center">
              <div className="text-2xl font-black text-[#FFFFFF] font-mono">100%</div>
              <div className="text-xs text-[#A3A3A3] font-mono uppercase tracking-wider mt-1">Hands-on R&D</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-center">
              <div className="text-2xl font-black text-[#FFFFFF] font-mono">Nov 05</div>
              <div className="text-xs text-[#A3A3A3] font-mono uppercase tracking-wider mt-1">Application Deadline</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: RECRUITMENT TIMELINE & PROCESS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#262626]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0D0D0D] border border-[#262626] text-[#A3A3A3] text-xs font-mono uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
            <span>Process Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How the Selection Process Works
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-2">
            A transparent, merit-driven evaluation structured to assess your technical aptitude, passion, and problem-solving creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {RECRUITMENT_TIMELINE.map((item, idx) => (
            <div
              key={item.step}
              className={`relative flex flex-col justify-between p-6 rounded-xl border transition-all duration-300 ${
                item.highlight
                  ? "bg-[#0D0D0D] border-[#262626] shadow-lg "
                  : "bg-[#0D0D0D] border-[#262626] hover:border-[#262626]"
              }`}
            >
              <div>
                {/* Step indicator header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
                  <span className="text-xs font-mono font-bold text-[#00A3FF] tracking-wider">
                    PHASE {item.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      item.status === "Active Now"
                        ? "bg-[#0D0D0D] text-[#00A3FF] border border-[#262626]"
                        : "bg-[#0D0D0D] text-[#A3A3A3]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5">{item.phase}</h3>
                <div className="text-xs font-mono text-[#A3A3A3] mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  <span>{item.date}</span>
                </div>

                <p className="text-xs text-[#A3A3A3] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-[#A3A3A3]">
                <span className="font-mono">Stage {idx + 1} of 4</span>
                {idx < 3 ? <ChevronRight className="w-3.5 h-3.5 text-[#A3A3A3]" /> : <Award className="w-3.5 h-3.5 text-[#00A3FF]" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: RECRUITMENT TRACKS & OPEN ROLES
          ───────────────────────────────────────────────────────────── */}
      <section id="recruitment-tracks" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#262626]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0D0D0D] border border-[#262626] text-[#A3A3A3] text-xs font-mono uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-[#00A3FF]" />
              <span>Available Domains</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Recruitment Tracks & Responsibilities
            </h2>
            <p className="text-sm text-[#A3A3A3] mt-1">
              Select a domain matching your strengths. You can also specify a secondary preference in your application.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {["All", "AI & Machine Learning", "Full-Stack", "Design", "Operations", "Content"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedTrackFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTrackFilter === filter
                    ? "bg-[#0D0D0D] text-white shadow-sm"
                    : "bg-[#0D0D0D] text-[#A3A3A3] hover:text-white border border-[#262626]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Track Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-6 sm:p-7 rounded-xl bg-[#0D0D0D] border border-[#262626] hover:border-[#262626] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Track Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#0D0D0D] border border-[#262626]">
                      {getTrackIcon(opp.track)}
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-[#00A3FF] tracking-wider font-semibold">
                        {opp.track}
                      </div>
                      <h3 className="text-xl font-bold text-white">{opp.role}</h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#0D0D0D] text-[#A3A3A3] border border-[#262626] whitespace-nowrap">
                    {opp.openings} Openings
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed mb-5">
                  {opp.description}
                </p>

                {/* Eligibility Tag */}
                <div className="mb-5 p-2.5 rounded bg-[#0D0D0D] border border-[#262626] text-xs font-mono text-[#A3A3A3] flex items-center gap-2">
                  <span className="text-[#A3A3A3] font-bold uppercase">Eligibility:</span>
                  <span>{opp.eligibility}</span>
                </div>

                {/* Requirements Checklist */}
                <div className="mb-5">
                  <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider mb-2 font-semibold">
                    Core Prerequisites:
                  </div>
                  <ul className="space-y-1.5">
                    {opp.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-[#A3A3A3] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A3FF] shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perks Pills */}
                <div>
                  <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider mb-2 font-semibold">
                    Key Perks & Growth:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.perks.map((perk, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0D0D0D] text-[#00A3FF] border border-[#262626]"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-[#262626] flex items-center justify-between">
                <span className="text-xs text-[#A3A3A3] font-mono">Type: {opp.type}</span>
                <button
                  type="button"
                  onClick={() => scrollToApply(opp.track)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D0D0D] hover:bg-[#0D0D0D] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: INTERACTIVE APPLICATION FORM
          ───────────────────────────────────────────────────────────── */}
      <section id="recruitment-form" className="pt-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0D0D0D] border border-[#262626] shadow-2xl relative">

          {/* Section Header */}
          <div className="mb-8 pb-6 border-b border-[#262626]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0D0D0D] border border-[#262626] text-[#00A3FF] text-xs font-mono uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Candidate Application</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Submit Your Candidacy
            </h2>
            <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
              Please fill out all required details accurately. Selected applicants will receive an email invite for the domain assessment round.
            </p>
          </div>

          {/* Success Feedback Banner */}
          {submittedData ? (
            <div className="p-8 rounded-xl bg-[#0D0D0D] border border-[#262626] text-[#00A3FF] flex flex-col items-center text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#00A3FF]" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-[#00A3FF] max-w-md mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{submittedData.fullName}</strong>. Your application for{" "}
                <strong className="text-white">{submittedData.primaryDomain}</strong> has been logged in our recruitment registry.
              </p>

              {/* Receipt Summary Card */}
              <div className="w-full max-w-lg p-5 rounded-lg bg-[#0D0D0D] border border-[#262626] text-left font-mono text-xs space-y-2 mb-6">
                <div className="flex justify-between border-b border-[#262626] pb-2">
                  <span className="text-[#A3A3A3]">Application Reference ID:</span>
                  <span className="text-[#00A3FF] font-bold">{submittedData.applicationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Applicant:</span>
                  <span className="text-[#A3A3A3]">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Registered Email:</span>
                  <span className="text-[#A3A3A3]">{submittedData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Department / Year:</span>
                  <span className="text-[#A3A3A3]">{submittedData.department} ({submittedData.year})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Primary Track:</span>
                  <span className="text-[#00A3FF] font-semibold">{submittedData.primaryDomain}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#262626] text-[11px] text-[#A3A3A3]">
                  <span>Timestamp:</span>
                  <span>{submittedData.submittedAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedData(null)}
                className="px-6 py-2.5 bg-[#0D0D0D] hover:bg-[#0D0D0D] text-white text-xs font-semibold rounded-lg transition"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Full Name <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="e.g. Yash Kulkarni"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.fullName
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    College / Personal Email <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. yash.kulkarni@vit.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.email
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: PRN & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prn" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    PRN / Roll Number <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="prn"
                    name="prn"
                    type="text"
                    placeholder="e.g. 12210890 / 2201045"
                    value={formData.prn}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.prn
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.prn && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.prn}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    WhatsApp / Contact Number <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.phone
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Academic Year & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="year" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Academic Year <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.year
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  >
                    <option value="" disabled>Select your current year</option>
                    {ACADEMIC_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                  {formErrors.year && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.year}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Department / Branch <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.department
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  >
                    <option value="" disabled>Select your branch</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.department}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Primary Domain & Secondary Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primaryDomain" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Primary Track Preference <span className="text-[#00A3FF]">*</span>
                  </label>
                  <select
                    id="primaryDomain"
                    name="primaryDomain"
                    value={formData.primaryDomain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all focus:outline-none"
                  >
                    {opportunitiesData.map((opp) => (
                      <option key={opp.id} value={opp.track}>
                        {opp.track} ({opp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="secondaryDomain" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Secondary Track Preference (Optional)
                  </label>
                  <select
                    id="secondaryDomain"
                    name="secondaryDomain"
                    value={formData.secondaryDomain}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all focus:outline-none"
                  >
                    <option value="None">None / Primary Preference Only</option>
                    {opportunitiesData.map((opp) => (
                      <option key={`sec-${opp.id}`} value={opp.track}>
                        {opp.track}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Links (Resume & GitHub/Portfolio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="resumeLink" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    Resume / Drive Link <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="resumeLink"
                    name="resumeLink"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.resumeLink
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  <p className="text-[11px] text-[#A3A3A3] mt-1 font-mono">
                    Ensure link access is set to "Anyone with link can view"
                  </p>
                  {formErrors.resumeLink && (
                    <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.resumeLink}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="githubOrPortfolio" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                    GitHub / Portfolio / Behance Link
                  </label>
                  <input
                    id="githubOrPortfolio"
                    name="githubOrPortfolio"
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={formData.githubOrPortfolio}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.githubOrPortfolio
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.githubOrPortfolio && (
                    <p className="mt-1.5 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.githubOrPortfolio}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Statement of Purpose */}
              <div>
                <label htmlFor="statementOfPurpose" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                  Statement of Purpose / Why DSSA? <span className="text-[#00A3FF]">*</span>
                </label>
                <textarea
                  id="statementOfPurpose"
                  name="statementOfPurpose"
                  rows={4}
                  placeholder="Tell us about your technical passion, why you wish to join DSSA, and what unique perspective or skills you bring to our team..."
                  value={formData.statementOfPurpose}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none leading-relaxed ${
                    formErrors.statementOfPurpose
                      ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                      : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                  }`}
                />
                <div className="flex justify-between items-center text-[11px] text-[#A3A3A3] mt-1 font-mono">
                  <span>Minimum 50 characters required</span>
                  <span>{formData.statementOfPurpose.length} characters</span>
                </div>
                {formErrors.statementOfPurpose && (
                  <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.statementOfPurpose}</span>
                  </p>
                )}
              </div>

              {/* Past Projects / Experience */}
              <div>
                <label htmlFor="pastExperience" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2 font-semibold">
                  Key Projects, Hackathons, or Extracurricular Experience (Optional)
                </label>
                <textarea
                  id="pastExperience"
                  name="pastExperience"
                  rows={3}
                  placeholder="Briefly mention any projects you built, datasets you explored, hackathons you attended, or relevant tools you have mastered..."
                  value={formData.pastExperience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all focus:outline-none leading-relaxed"
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeToCommitment"
                    checked={formData.agreeToCommitment}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded bg-[#0D0D0D] border-[#262626] text-[#00A3FF] focus:ring-[#262626] focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-[#A3A3A3] leading-normal">
                    I confirm that the information provided is accurate, and I am willing to commit 4–6 hours per week towards DSSA projects, meetings, and college technical initiatives.
                  </span>
                </label>
                {formErrors.agreeToCommitment && (
                  <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.agreeToCommitment}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#A3A3A3] font-mono">
                  Applications close Nov 05, 2026 at 11:59 PM IST
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFFFFF] hover:bg-[#E5E5E5] disabled:bg-[#404040] text-[#000000] disabled:text-[#A3A3A3] font-semibold text-sm rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
