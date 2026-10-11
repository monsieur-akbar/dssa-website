"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  X, 
  Send, 
  RotateCcw, 
  ArrowRight
} from "lucide-react";

import eventsData from "@/data/events.json";
import opportunitiesData from "@/data/opportunities.json";
import projectsData from "@/data/projects.json";
import aboutData from "@/data/about.json";
import teamData from "@/data/team.json";
import achievementsData from "@/data/achievements.json";

// Quick suggestion prompts
const SUGGESTIONS = [
  { label: "📅 Upcoming Events", query: "What events and workshops are coming up?" },
  { label: "🚀 How to Join DSSA", query: "How can I join DSSA and what is the recruitment process?" },
  { label: "💼 Open Roles & Careers", query: "What technical and research opportunities are open?" },
  { label: "💻 Student Projects", query: "What flagship projects has DSSA built?" },
  { label: "🧠 6 Technical Domains", query: "Tell me about the DSSA domains and tech stack" },
  { label: "🏆 Club Achievements", query: "What are DSSA's major hackathon wins and milestones?" },
  { label: "👨‍🏫 Faculty & Leadership", query: "Who is the faculty advisor and club leadership?" },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am the **DSSA AI Assistant**.\n\nI can help you explore verified club events, recruitment tracks, research projects, and technical domains at **VIT Pune**.\n\nWhat would you like to explore today?",
      quickActions: [
        { label: "Explore Events", href: "/events" },
        { label: "Apply to Join", href: "/join" },
        { label: "View Opportunities", href: "/opportunities" },
      ],
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setShowBadge(false);
    }
  }, [isOpen]);

  // Auto-dismiss the floating helper badge after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBadge(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Response Generator strictly utilizing the repository's original data files
  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // ─── A. SPECIFIC EVENT MATCH ───────────────────────────
    const specificEvent = eventsData.find((e) => {
      const titleMatch = e.title.toLowerCase().includes(q) || q.includes(e.title.toLowerCase().split(":")[0].toLowerCase());
      const tagMatch = e.tags && e.tags.some((t) => q.includes(t.toLowerCase()));
      const speakerMatch = e.speakers && e.speakers.some((s) => q.includes(s.name.toLowerCase()));
      return titleMatch || tagMatch || speakerMatch;
    });

    if (specificEvent && (q.includes(specificEvent.title.toLowerCase().split(" ")[0]) || q.includes("datastorm") || q.includes("rag") || q.includes("kafka") || q.includes("yolo") || q.includes("quant"))) {
      const speakerList = specificEvent.speakers?.map((s) => `• ${s.name} (${s.role})`).join("\n") || "DSSA Technical Mentors";
      return {
        text: `**${specificEvent.title}** (${specificEvent.category})\n\n• **Status:** ${specificEvent.status}\n• **Date & Time:** ${specificEvent.date} • ${specificEvent.time}\n• **Venue:** ${specificEvent.location} (${specificEvent.mode})\n• **Overview:** ${specificEvent.description}\n\n**Featured Speakers / Leads:**\n${speakerList}\n\n**Key Focus Topics:** ${specificEvent.tags?.join(", ")}`,
        quickActions: [
          { label: "View on Events Page", href: "/events" },
          { label: "Registration Link", href: specificEvent.registrationLink || "/events" },
        ],
      };
    }

    // ─── B. SPECIFIC PROJECT MATCH ─────────────────────────
    const specificProject = projectsData.find((p) => {
      const nameParts = p.title.toLowerCase().split(":");
      const primaryName = nameParts[0].trim();
      return q.includes(primaryName) || q.includes(p.id.toLowerCase());
    });

    if (specificProject) {
      const leadsStr = specificProject.leads?.join(", ") || "DSSA Research Leads";
      const techStr = specificProject.techStack?.join(", ") || "Python, PyTorch";
      const metricsArr = specificProject.metrics ? Object.entries(specificProject.metrics).map(([k, v]) => `• **${k}:** ${v}`).join("\n") : "";

      return {
        text: `🚀 **${specificProject.title}**\n*Category: ${specificProject.category} • Status: ${specificProject.status}*\n\n${specificProject.summary}\n\n**Tech Stack:**\n${techStr}\n\n**Project Leads:** ${leadsStr}\n\n${metricsArr ? `**Key Metrics:**\n${metricsArr}\n\n` : ""}Check out the full repository and live interactive demo:`,
        quickActions: [
          { label: "Live Demo", href: specificProject.demo || "/" },
          { label: "GitHub Code", href: specificProject.github || "https://github.com" },
        ],
      };
    }

    // ─── C. SPECIFIC OPPORTUNITY / ROLE MATCH ──────────────
    const specificOpp = opportunitiesData.find((o) => {
      const roleLower = o.role.toLowerCase();
      const trackLower = o.track.toLowerCase();
      return q.includes(roleLower) || q.includes(trackLower) || (q.includes("designer") && roleLower.includes("design")) || (q.includes("developer") && roleLower.includes("developer")) || (q.includes("research") && roleLower.includes("research"));
    });

    if (specificOpp && (q.includes("role") || q.includes("opening") || q.includes("apply") || q.includes("requirement") || q.includes("job") || q.includes("intern") || q.includes("associate") || q.includes("lead"))) {
      const reqList = specificOpp.requirements?.slice(0, 3).map((r) => `• ${r}`).join("\n");
      const perkList = specificOpp.perks?.slice(0, 3).map((p) => `• ${p}`).join("\n");

      return {
        text: `💼 **${specificOpp.role}**\n*Track: ${specificOpp.track} (${specificOpp.type})*\n\n• **Open Positions:** ${specificOpp.openings}\n• **Eligibility:** ${specificOpp.eligibility}\n• **Overview:** ${specificOpp.description}\n\n**Key Requirements:**\n${reqList}\n\n**Perks & Benefits:**\n${perkList}`,
        quickActions: [
          { label: "Apply Now", href: "/join" },
          { label: "All Opportunities", href: "/opportunities" },
        ],
      };
    }

    // ─── D. SPECIFIC PERSON / TEAM MATCH ───────────────────
    const faculty = teamData.faculty;
    if (q.includes("shinde") || q.includes("advisor") || q.includes("faculty")) {
      return {
        text: `👨‍🏫 **${faculty.name}**\n*${faculty.designation}*\n\n• **Department:** ${faculty.department}\n• **Mentorship Role:** ${faculty.bio}\n• **Email:** ${faculty.email}`,
        quickActions: [
          { label: "Meet the Team", href: "/team" },
          { label: "Contact Department", href: "/contact" },
        ],
      };
    }

    // Check Committee Members
    let foundMember = null;
    let foundCommittee = null;
    for (const comm of teamData.committee) {
      for (const m of comm.members) {
        if (q.includes(m.name.toLowerCase())) {
          foundMember = m;
          foundCommittee = comm;
          break;
        }
      }
      if (foundMember) break;
    }

    if (foundMember) {
      return {
        text: `👤 **${foundMember.name}**\n• **Role:** ${foundMember.role}\n• **Department/Wing:** ${foundCommittee.title}\n• **Wing Mission:** ${foundCommittee.description}`,
        quickActions: [
          { label: "View Team Page", href: "/team" },
          { label: "Contact Us", href: "/contact" },
        ],
      };
    }

    // ─── E. GENERAL PROJECTS LIST ──────────────────────────
    if (q.includes("project") || q.includes("neuropulse") || q.includes("aether") || q.includes("visionflow") || q.includes("alphastream") || q.includes("datasphere")) {
      const projList = projectsData.map((p) => `• **${p.title.split(":")[0]}** (${p.category}) — *${p.status}*`).join("\n");
      return {
        text: `**Official DSSA Technical Projects (${projectsData.length} Shipped/Active):**\n\n${projList}\n\nAll student projects are built with production-grade architectures and published open-source on our GitHub organization.`,
        quickActions: [
          { label: "About Our Work", href: "/about" },
          { label: "Contribute / Join", href: "/join" },
        ],
      };
    }

    // ─── F. GENERAL EVENTS & WORKSHOPS ─────────────────────
    if (
      q.includes("event") || 
      q.includes("workshop") || 
      q.includes("hackathon") || 
      q.includes("calendar") || 
      q.includes("upcoming")
    ) {
      const upcoming = eventsData.filter((e) => e.status !== "Completed");
      const past = eventsData.filter((e) => e.status === "Completed");

      let details = `**DSSA Event Pipeline (${upcoming.length} Upcoming, ${past.length} Completed):**\n\n`;
      upcoming.forEach((ev) => {
        details += `🔥 **${ev.title}** (${ev.category})\n- **Date:** ${ev.date} (${ev.time})\n- **Venue:** ${ev.location} [${ev.mode}]\n- **Speakers:** ${ev.speakers?.map((s) => s.name).join(", ") || "Technical Leads"}\n\n`;
      });
      details += `Recent completed sessions include *${past.map((p) => p.title.split(":")[0]).join(", ")}*.`;

      return {
        text: details,
        quickActions: [
          { label: "View All Events", href: "/events" },
          { label: "DataStorm Hackathon", href: upcoming[0]?.registrationLink || "/events" },
        ],
      };
    }

    // ─── G. RECRUITMENT & HOW TO JOIN ──────────────────────
    if (
      q.includes("join") || 
      q.includes("recruit") || 
      q.includes("apply") || 
      q.includes("member") || 
      q.includes("first year") || 
      q.includes("eligib") || 
      q.includes("hiring")
    ) {
      const tracksSummary = opportunitiesData.map((o) => `• **${o.role}** (${o.openings} Openings)`).join("\n");
      return {
        text: `**Recruitment & Membership at DSSA VIT Pune:**\n\nWe welcome **FY, SY, and TY students across all engineering branches**! We value problem solving, consistency, and passion for artificial intelligence.\n\n**Currently Open Application Tracks:**\n${tracksSummary}\n\n**Selection Process:**\n1. Online Application Form\n2. Technical Task / Portfolio Review\n3. Friendly Interactive Interview`,
        quickActions: [
          { label: "Submit Application", href: "/join" },
          { label: "Explore Roles", href: "/opportunities" },
        ],
      };
    }

    // ─── H. GENERAL OPPORTUNITIES LIST ─────────────────────
    if (q.includes("opportunity") || q.includes("role") || q.includes("career") || q.includes("opening") || q.includes("intern")) {
      const oppList = opportunitiesData.map((o) => `• **${o.role}** (${o.track}) — *${o.openings} slots*`).join("\n");
      return {
        text: `**Active Student Openings (${opportunitiesData.reduce((acc, curr) => acc + curr.openings, 0)} Total Positions):**\n\n${oppList}\n\n**Perks:** Faculty guidance, compute grants, paper publication opportunities, and recommendation letters.`,
        quickActions: [
          { label: "View Opportunities", href: "/opportunities" },
          { label: "Apply on Portal", href: "/join" },
        ],
      };
    }

    // ─── I. ACHIEVEMENTS & HACKATHON PODIUMS ───────────────
    if (q.includes("achievement") || q.includes("win") || q.includes("award") || q.includes("milestone") || q.includes("trophy")) {
      const achList = achievementsData.map((a) => `• **${a.title} (${a.year}):** ${a.position} by *${a.team}* — ${a.description}`).join("\n\n");
      return {
        text: `🏆 **DSSA Honors & Milestones:**\n\n${achList}\n\nOur members continuously represent VIT Pune in national hackathons and academic conferences.`,
        quickActions: [
          { label: "View Achievements", href: "/achievements" },
          { label: "About DSSA", href: "/about" },
        ],
      };
    }

    // ─── J. LEADERSHIP & FULL COMMITTEE ───────────────────
    if (q.includes("team") || q.includes("lead") || q.includes("president") || q.includes("committee") || q.includes("head") || q.includes("who is")) {
      const core = teamData.committee.find((c) => c.id === "core");
      const tech = teamData.committee.find((c) => c.id === "technical");
      const event = teamData.committee.find((c) => c.id === "events");
      const design = teamData.committee.find((c) => c.id === "aesthetics");

      return {
        text: `**DSSA Organizational Structure:**\n\n• **Faculty Advisor:** ${faculty.name} (${faculty.designation})\n• **Executive Core:** ${core?.members.map((m) => `${m.name} (${m.role})`).join(", ")}\n• **Technical Wing:** ${tech?.members.map((m) => `${m.name} (${m.role})`).join(", ")}\n• **Events Wing:** ${event?.members.map((m) => `${m.name} (${m.role})`).join(", ")}\n• **Design Wing:** ${design?.members.map((m) => `${m.name} (${m.role})`).join(", ")}`,
        quickActions: [
          { label: "Meet the Team", href: "/team" },
          { label: "Contact Us", href: "/contact" },
        ],
      };
    }

    // ─── K. ABOUT VISION, MISSION & MILESTONES ─────────────
    if (q.includes("about") || q.includes("vision") || q.includes("mission") || q.includes("history") || q.includes("founded") || q.includes("vit") || q.includes("pune")) {
      const milestoneList = aboutData.milestones.map((m) => `• **${m.year}:** ${m.title} — ${m.description}`).join("\n");
      return {
        text: `**About DSSA VIT Pune:**\n\n• **Vision:** ${aboutData.vision.text}\n• **Mission:** ${aboutData.mission.text}\n\n**Key Objectives:**\n${aboutData.objectives.map((o) => `• **${o.title}:** ${o.description}`).join("\n")}\n\n**Club Milestones:**\n${milestoneList}`,
        quickActions: [
          { label: "Read Full Story", href: "/about" },
          { label: "Explore Team", href: "/team" },
        ],
      };
    }

    // ─── L. 6 DOMAINS ──────────────────────────────────────
    if (q.includes("domain") || q.includes("stack") || q.includes("cube") || q.includes("pillar")) {
      return {
        text: `**The 6 Core Pillars of DSSA:**\n\n1. **AI / ML:** Neural networks, PyTorch, generative models, and computer vision.\n2. **Data Science:** Big Data pipelines, predictive modeling, statistical inference, and Scikit-Learn.\n3. **Analytics:** SQL, Power BI, Tableau, and visual intelligence dashboards.\n4. **Development:** Full-Stack web platforms (Next.js, FastAPI, Docker, PostgreSQL).\n5. **DSSA Core:** Hackathons, bootcamps, and student mentorship.\n6. **Innovate:** Research publications, open-source repositories, and national competitions.\n\nYou can interactively explore these on the 3D DataCube on the Home page!`,
        quickActions: [
          { label: "Home Page Cube", href: "/" },
          { label: "About DSSA", href: "/about" },
        ],
      };
    }

    // ─── M. CONTACT ────────────────────────────────────────
    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("social") || q.includes("discord")) {
      return {
        text: `**Contact DSSA VIT Pune:**\n\n• **Club Email:** dssa@vit.edu\n• **Faculty Advisor:** ${faculty.email}\n• **Location:** Department of Computer Engineering & Data Science, VIT Pune, Maharashtra, India.\n• **Community:** Connect with us on Discord, LinkedIn, and GitHub!`,
        quickActions: [
          { label: "Contact Page", href: "/contact" },
          { label: "Join DSSA", href: "/join" },
        ],
      };
    }

    // ─── N. GREETINGS & FALLBACK ───────────────────────────
    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("namaste") || q === "yo") {
      return {
        text: `Hello! 👋 How can I help you explore DSSA VIT Pune today? You can ask me about:\n\n• **Upcoming Hackathons & Bootcamps** (DataStorm, RAG, Quant)\n• **Open Positions & Eligibility** (ML Research, Dev, Design)\n• **Student Projects** (NeuroPulse, Aether-RAG, VisionFlow)\n• **Club Leadership & Mentorship** (Dr. S. R. Shinde, Core team)`,
        quickActions: [
          { label: "Upcoming Events", href: "/events" },
          { label: "Join the Club", href: "/join" },
          { label: "Open Opportunities", href: "/opportunities" },
        ],
      };
    }

    return {
      text: `I'm here to assist you with all official DSSA VIT Pune details! Here are the core areas you can explore:\n\n• **Events & Hackathons:** DataStorm 2026, LLMs & RAG workshop, Quant seminars\n• **Opportunities:** 22+ openings across AI, Dev, Design, and Logistics\n• **Flagship Projects:** 5 open-source data science tools\n• **Club Leadership:** Faculty advisor and committee heads\n\nFeel free to ask a specific question!`,
      quickActions: [
        { label: "Upcoming Events", href: "/events" },
        { label: "Club Opportunities", href: "/opportunities" },
        { label: "Contact Us", href: "/contact" },
      ],
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate realistic typing and response generation
    setTimeout(() => {
      const responseData = generateAIResponse(text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseData.text,
        quickActions: responseData.quickActions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "ai",
        text: "Conversation reset! How can I help you explore DSSA VIT Pune?",
        quickActions: [
          { label: "Upcoming Events", href: "/events" },
          { label: "How to Join", href: "/join" },
          { label: "Open Opportunities", href: "/opportunities" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Helper to format markdown-like text
  const formatMessageText = (content) => {
    return content.split("\n").map((line, idx) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-[#FFFFFF]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith("• ") || line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-[#D4D4D8] leading-relaxed my-0.5">
            {formattedParts}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING ASSISTANT TRIGGER BUTTON (Bottom-Right)
          ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-end gap-3 select-none">
        {/* Helper Pill Banner */}
        {showBadge && !isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0D0D0D] border border-[#262626] shadow-xl text-xs text-[#FFFFFF] cursor-pointer hover:border-[#00A3FF] transition-all animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-ping" />
            <span className="font-medium">Ask DSSA AI</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowBadge(false);
              }}
              className="text-[#737373] hover:text-[#FFFFFF] ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Bubble Button with DSSA Logo */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close DSSA AI Assistant" : "Open DSSA AI Assistant"}
          className={`relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00A3FF] overflow-hidden ${
            isOpen
              ? "bg-[#171717] border-2 border-[#404040] text-[#FFFFFF]"
              : "bg-[#0A0A0A] hover:bg-[#141414] border-2 border-[#262626] hover:border-[#00A3FF] text-[#FFFFFF] hover:scale-105"
          }`}
        >
          {/* Subtle Outer Neon Glow Pulse */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#00A3FF]/20 animate-pulse pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-[#FFFFFF]" />
          ) : (
            <div className="relative w-full h-full p-1.5 flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#0D0D0D]">
                <Image
                  src="/dssa-logo.png"
                  alt="DSSA Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
              {/* Green Online Dot */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#0A0A0A]" />
            </div>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPANDABLE CHAT PANEL (Properly arranged for Mobile & Desktop)
          ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div 
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-24 sm:right-6 z-50 w-auto sm:w-[410px] h-[calc(100dvh-1.5rem)] sm:h-[580px] max-h-[640px] flex flex-col rounded-2xl bg-[#0A0A0A]/95 border border-[#262626] backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* HEADER */}
          <div className="px-4 py-3.5 border-b border-[#262626] bg-[#0F0F0F] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src="/dssa-logo.png"
                  alt="DSSA Logo"
                  width={30}
                  height={30}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#FFFFFF] tracking-tight">DSSA Assistant</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-[#00A3FF]/20 text-[#00A3FF] border border-[#00A3FF]/30">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-[10px] text-[#A3A3A3] font-mono">VIT Pune Knowledge Base</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-[#737373] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-[#737373] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES THREAD */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[#262626]">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {isAi && (
                      <div className="w-6 h-6 rounded-full bg-[#0D0D0D] border border-[#262626] overflow-hidden flex items-center justify-center flex-shrink-0 mb-1">
                        <Image
                          src="/dssa-logo.png"
                          alt="DSSA Logo"
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`px-3.5 py-2.5 rounded-2xl ${
                        isAi
                          ? "bg-[#141414] border border-[#262626] text-[#FFFFFF] rounded-bl-sm"
                          : "bg-[#00A3FF] text-[#000000] font-medium rounded-br-sm selection:bg-[#000000] selection:text-[#FFFFFF]"
                      }`}
                    >
                      <div className="space-y-1">
                        {isAi ? formatMessageText(msg.text) : (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>
                        )}
                      </div>

                      {/* AI Direct Action Links */}
                      {isAi && msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="pt-2.5 mt-2 border-t border-[#262626] flex flex-wrap gap-1.5">
                          {msg.quickActions.map((action, i) => (
                            <Link
                              key={i}
                              href={action.href}
                              onClick={() => {
                                if (window.innerWidth < 640) setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#1C1C1C] hover:bg-[#262626] text-[#FFFFFF] border border-[#333333] hover:border-[#00A3FF] transition-colors"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3 h-3 text-[#00A3FF]" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-[#525252] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0D0D0D] border border-[#262626] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/dssa-logo.png"
                    alt="DSSA Logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[#141414] border border-[#262626] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT SUGGESTION PILLS */}
          <div className="px-3 py-2 border-t border-[#1F1F1F] bg-[#0D0D0D]/90 overflow-x-auto scrollbar-none flex gap-1.5 flex-shrink-0">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-[#171717] hover:bg-[#242424] text-[#A3A3A3] hover:text-[#FFFFFF] border border-[#262626] hover:border-[#404040] transition-colors flex-shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-[#0A0A0A] border-t border-[#262626] flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events, domains, joining..."
              className="flex-1 bg-[#141414] text-xs sm:text-sm text-[#FFFFFF] placeholder-[#737373] px-3.5 py-2.5 rounded-xl border border-[#262626] focus:outline-none focus:border-[#00A3FF] transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                inputValue.trim() && !isTyping
                  ? "bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] cursor-pointer"
                  : "bg-[#1A1A1A] text-[#525252] cursor-not-allowed"
              }`}
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
