"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Users, 
  Calendar, 
  Trophy, 
  Briefcase, 
  UserPlus, 
  Mail,
  Bot
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "🚀 Events & Workshops", href: "/events", query: "Tell me about upcoming events" },
  { label: "👥 Meet the Team", href: "/team", query: "Who is in the DSSA team?" },
  { label: "🏆 Achievements", href: "/achievements", query: "What are DSSA's achievements?" },
  { label: "💼 Career Opportunities", href: "/opportunities", query: "What opportunities does DSSA offer?" },
  { label: "✨ How to Join DSSA", href: "/join", query: "How can I join DSSA?" },
  { label: "📖 About DSSA", href: "/about", query: "Tell me about DSSA VIT Pune" },
  { label: "📬 Contact Us", href: "/contact", query: "How do I contact DSSA?" },
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "bot",
      text: "Welcome to DSSA VIT Pune! I'm your AI guide. How can I help you explore our website today?",
      suggestions: [
        { label: "Explore Events", href: "/events" },
        { label: "Meet the Team", href: "/team" },
        { label: "Join DSSA", href: "/join" },
        { label: "About DSSA", href: "/about" },
      ],
    },
  ]);

  const router = useRouter();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  const generateBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("event") || q.includes("workshop") || q.includes("hackathon") || q.includes("bootcamp")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "DSSA organizes regular technical workshops, AI hackathons, and guest speaker sessions at VIT Pune covering Deep Learning, Data Analytics, and Full-Stack Engineering.",
        action: { label: "Go to Events Page", href: "/events" },
        suggestions: [{ label: "Team", href: "/team" }, { label: "Join DSSA", href: "/join" }],
      };
    }

    if (q.includes("team") || q.includes("lead") || q.includes("member") || q.includes("head") || q.includes("who")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "Our team consists of passionate data scientists, machine learning engineers, and student leaders across VIT Pune, guided by faculty advisors.",
        action: { label: "Meet the Full Team", href: "/team" },
        suggestions: [{ label: "About DSSA", href: "/about" }, { label: "Achievements", href: "/achievements" }],
      };
    }

    if (q.includes("join") || q.includes("apply") || q.includes("membership") || q.includes("recruit")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "We welcome all VIT Pune students passionate about data, AI, and technology! You can join technical tracks, event management, or design teams.",
        action: { label: "Apply to Join DSSA", href: "/join" },
        suggestions: [{ label: "Opportunities", href: "/opportunities" }, { label: "Events", href: "/events" }],
      };
    }

    if (q.includes("achievement") || q.includes("win") || q.includes("award") || q.includes("milestone")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "DSSA members have won national hackathons, published research papers, and developed impactful data analytics solutions for college and industry partners.",
        action: { label: "View Our Achievements", href: "/achievements" },
        suggestions: [{ label: "Events", href: "/events" }, { label: "Team", href: "/team" }],
      };
    }

    if (q.includes("opportunity") || q.includes("career") || q.includes("internship") || q.includes("project")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "DSSA offers research mentorship, alumni networking, hands-on portfolio projects, and guidance for competitive AI programming and internships.",
        action: { label: "Explore Opportunities", href: "/opportunities" },
        suggestions: [{ label: "Join DSSA", href: "/join" }, { label: "Contact Us", href: "/contact" }],
      };
    }

    if (q.includes("contact") || q.includes("reach") || q.includes("email") || q.includes("instagram") || q.includes("location") || q.includes("where")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "You can find us at VIT Pune campus, or connect with us directly via our official contact channels and social handles.",
        action: { label: "Open Contact Page", href: "/contact" },
        suggestions: [{ label: "About DSSA", href: "/about" }, { label: "Join DSSA", href: "/join" }],
      };
    }

    if (q.includes("cube") || q.includes("domain") || q.includes("ai") || q.includes("ml") || q.includes("data science") || q.includes("analytics")) {
      return {
        id: Date.now().toString(),
        sender: "bot",
        text: "The 3D Data Cube showcases DSSA's 6 core pillars: AI/ML, Data Science, Analytics, Development, DSSA Core, and Innovate. Click or tap any domain to rotate the cube!",
        action: { label: "Discover All Domains", href: "/about" },
        suggestions: [{ label: "Events", href: "/events" }, { label: "Team", href: "/team" }],
      };
    }

    return {
      id: Date.now().toString(),
      sender: "bot",
      text: "I can help you navigate to any section on our website! Which of these areas would you like to explore?",
      suggestions: [
        { label: "🚀 Events", href: "/events" },
        { label: "👥 Team", href: "/team" },
        { label: "🏆 Achievements", href: "/achievements" },
        { label: "✨ Join DSSA", href: "/join" },
        { label: "📬 Contact", href: "/contact" },
      ],
    };
  };

  const handleNavigate = (href) => {
    router.push(href);
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING BOTTOM-RIGHT TRIGGER BUTTON
          ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-end">
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-full bg-[#0D0D0D]/95 border border-[#262626] backdrop-blur-md shadow-xl text-xs text-[#A3A3A3] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#FFFFFF]" />
            <span>Need help navigating?</span>
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close DSSA AI Guide" : "Open DSSA AI Guide"}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#262626] bg-[#0D0D0D] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none shadow-2xl"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-[#FFFFFF]" />
            ) : (
              <Image
                src="/dssa-logo.png"
                alt="DSSA AI Assistant"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            )}
          </button>

          {/* Full unclipped green status dot */}
          {!isOpen && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#000000] pointer-events-none" />
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CHATBOT WINDOW DIALOG
          ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-7rem)] rounded-2xl bg-[#0D0D0D]/98 border border-[#262626] backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#262626] bg-[#000000]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/dssa-logo.png"
                  alt="DSSA Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#FFFFFF]">DSSA Assistant</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1A1A1A] text-[#A3A3A3] border border-[#262626]">
                    AI Guide
                  </span>
                </div>
                <span className="text-[11px] text-[#A3A3A3] font-mono">
                  VIT Pune Chapter
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#FFFFFF] text-[#000000] font-medium rounded-br-none"
                      : "bg-[#171717] text-[#E5E5E5] border border-[#262626] rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Direct Page Navigation CTA button */}
                {msg.action && (
                  <button
                    type="button"
                    onClick={() => handleNavigate(msg.action.href)}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Quick Navigation Suggestions */}
                {msg.suggestions && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleNavigate(s.href)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#141414] hover:bg-[#222222] text-[#D4D4D4] hover:text-[#FFFFFF] border border-[#262626] transition-colors cursor-pointer"
                      >
                        <span>{s.label}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-[#737373]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 border-t border-[#262626] bg-[#050505] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(action.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-mono text-[#A3A3A3] hover:text-[#FFFFFF] bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-[#262626] transition-colors cursor-pointer"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#262626] bg-[#000000] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about DSSA..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#0F0F0F] text-[#FFFFFF] placeholder-[#737373] border border-[#262626] focus:outline-none focus:border-[#FFFFFF] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] disabled:opacity-40 disabled:hover:bg-[#FFFFFF] text-[#000000] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
