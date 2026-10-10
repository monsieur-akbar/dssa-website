"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Globe,
  ExternalLink,
  Navigation,
  Building,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";

// Clean, standalone SVG icons for social platforms
function LinkedinIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-[#00A3FF]"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-[#A3A3A3]"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-[#00A3FF]"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-[#A3A3A3]"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

// Official DSSA Communication Channels
const SOCIAL_CHANNELS = [
  {
    name: "LinkedIn",
    handle: "dssa-vit-pune",
    url: "https://linkedin.com/company/dssa-vit-pune",
    description: "Official club updates, hackathon announcements, and student spotlights.",
    icon: <LinkedinIcon />,
    badge: "Official",
  },
  {
    name: "GitHub",
    handle: "@dssa-vit",
    url: "https://github.com/dssa-vit",
    description: "Open source ML repositories, research codebases, and website repos.",
    icon: <GithubIcon />,
    badge: "Open Source",
  },
  {
    name: "Instagram",
    handle: "@dssa_vitpune",
    url: "https://instagram.com/dssa_vitpune",
    description: "Behind-the-scenes, event reels, member highlights, and live stories.",
    icon: <InstagramIcon />,
    badge: "Community",
  },
  {
    name: "X (Twitter)",
    handle: "@dssa_vit",
    url: "https://x.com/dssa_vit",
    description: "Tech discussions, paper reviews, AI news bites, and hackathon threads.",
    icon: <TwitterIcon />,
    badge: "Tech News",
  },
];

// Query Categories
const INQUIRY_CATEGORIES = [
  "General Inquiry",
  "Hackathon & Event Sponsorship",
  "Speaker & Workshop Collaboration",
  "Research & Project Mentorship",
  "Recruitment & Application Query",
  "Feedback / Website Bug Report",
];

export default function ContactPage() {
  // Form State
  const initialFormState = {
    senderName: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.senderName.trim()) {
      errors.senderName = "Your name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message cannot be empty";
    } else if (formData.message.trim().length < 20) {
      errors.message = "Please provide at least 20 characters in your message";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      return;
    }

    setIsSubmitting(true);

    // Simulate Network Request
    setTimeout(() => {
      setIsSubmitting(false);
      const receipt = {
        ...formData,
        ticketId: `DSSA-INQ-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
      setSubmittedReceipt(receipt);
      setFormData(initialFormState);
      setFormErrors({});
    }, 1000);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("contact@dssavit.org");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#FFFFFF] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO / CONTACT HEADER
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-16 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#262626] bg-[#000000]">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#000000] border border-[#262626] text-[#00A3FF] text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT WITH DSSA VIT PUNE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight leading-tight mb-4">
            Get in Touch with Our Team
          </h1>

          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Have questions about upcoming hackathons, speaker sessions, sponsorship opportunities, or joining our research pods? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: MAIN GRID (INQUIRY FORM + DIRECT INFO)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Interactive Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-9 rounded-2xl bg-[#0D0D0D] border border-[#262626] shadow-xl">
            <div className="mb-6 pb-4 border-b border-[#262626]">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-1">
                Send an Inquiry Message
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Fill out the form below and our executive desk will respond within 24–48 hours.
              </p>
            </div>

            {submittedReceipt ? (
              <div className="p-8 rounded-xl bg-[#0D0D0D] border border-[#262626] text-[#FFFFFF] flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[#00A3FF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs text-[#A3A3A3] max-w-md mb-6 leading-relaxed">
                  Thank you, <strong className="text-white">{submittedReceipt.senderName}</strong>. Your inquiry regarding{" "}
                  <strong className="text-white">{submittedReceipt.category}</strong> has been logged.
                </p>

                <div className="w-full max-w-md p-4 rounded-lg bg-[#0D0D0D] border border-[#262626] text-left font-mono text-xs space-y-1.5 mb-6">
                  <div className="flex justify-between border-b border-[#262626] pb-1.5">
                    <span className="text-[#A3A3A3]">Inquiry Ticket ID:</span>
                    <span className="text-[#00A3FF] font-bold">{submittedReceipt.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A3A3A3]">Sender Email:</span>
                    <span className="text-[#A3A3A3]">{submittedReceipt.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A3A3A3]">Subject:</span>
                    <span className="text-[#A3A3A3]">{submittedReceipt.subject}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#262626] text-[11px] text-[#A3A3A3]">
                    <span>Logged At:</span>
                    <span>{submittedReceipt.timestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="px-5 py-2 bg-[#0D0D0D] hover:bg-[#0D0D0D] text-white text-xs font-semibold rounded-lg transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="senderName" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                      Your Name <span className="text-[#00A3FF]">*</span>
                    </label>
                    <input
                      id="senderName"
                      name="senderName"
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                        formErrors.senderName
                          ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                          : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                      }`}
                    />
                    {formErrors.senderName && (
                      <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.senderName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                      Email Address <span className="text-[#00A3FF]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                        formErrors.email
                          ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                          : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Category & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="category" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all focus:outline-none"
                    >
                      {INQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626] transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                    Subject Line <span className="text-[#00A3FF]">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="e.g. Sponsorship Proposal for DataStorm 2026"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none ${
                      formErrors.subject
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  {formErrors.subject && (
                    <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Body */}
                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase text-[#A3A3A3] mb-1.5 font-semibold">
                    Message Body <span className="text-[#00A3FF]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe your inquiry, collaboration details, or requirements in detail..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0D0D0D] text-[#A3A3A3] text-sm border transition-all focus:outline-none leading-relaxed ${
                      formErrors.message
                        ? "border-[#262626] focus:ring-1 focus:ring-[#262626]"
                        : "border-[#262626] focus:border-[#262626] focus:ring-1 focus:ring-[#262626]"
                    }`}
                  />
                  <div className="flex justify-between items-center text-[11px] text-[#A3A3A3] mt-1 font-mono">
                    <span>Minimum 20 characters</span>
                    <span>{formData.message.length} chars</span>
                  </div>
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-[#00A3FF] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formErrors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] hover:bg-[#E5E5E5] disabled:bg-[#404040] text-[#000000] disabled:text-[#A3A3A3] font-semibold text-sm rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Transmission</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: Direct Info & Social Channels (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Quick Contact Info Box */}
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#262626]">
              <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#262626] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#00A3FF]" />
                <span>Direct Contact Information</span>
              </h3>

              <div className="space-y-4 text-xs">
                {/* Email with copy button */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0D0D0D] border border-[#262626]">
                  <Mail className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[#A3A3A3] font-mono text-[11px]">Official Email Desk</div>
                    <div className="text-[#A3A3A3] font-semibold mt-0.5 select-all">contact@dssavit.org</div>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="p-1.5 rounded hover:bg-[#0D0D0D] text-[#A3A3A3] hover:text-white transition"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-[#00A3FF]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Faculty Advisor Desk */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0D0D0D] border border-[#262626]">
                  <Phone className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[#A3A3A3] font-mono text-[11px]">Department Office</div>
                    <div className="text-[#A3A3A3] font-semibold mt-0.5">+91 20 2420 2180</div>
                    <div className="text-[11px] text-[#A3A3A3]">Dept. of Computer & Data Science</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0D0D0D] border border-[#262626]">
                  <Clock className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[#A3A3A3] font-mono text-[11px]">Lab & Desk Hours</div>
                    <div className="text-[#A3A3A3] font-semibold mt-0.5">Mon – Sat: 09:00 AM – 06:00 PM IST</div>
                    <div className="text-[11px] text-[#A3A3A3]">Closed on Sundays & National Holidays</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels Network */}
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#262626]">
              <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#262626] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00A3FF]" />
                <span>Community Channels</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SOCIAL_CHANNELS.map((ch) => (
                  <a
                    key={ch.name}
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0D0D0D] border border-[#262626] hover:border-[#262626] hover:bg-[#0D0D0D] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {ch.icon}
                          <span className="text-xs font-bold text-white group-hover:text-[#00A3FF] transition-colors">
                            {ch.name}
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-[#A3A3A3] group-hover:text-[#A3A3A3] transition-colors" />
                      </div>
                      <div className="text-[11px] font-mono text-[#A3A3A3]">
                        {ch.handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: VIT PUNE CAMPUS & EMBEDDED MAP
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#262626]">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0D0D0D] border border-[#262626] text-[#A3A3A3] text-xs font-mono uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#00A3FF]" />
            <span>Campus Headquarters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Visit Us at VIT Pune
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1">
            Our student chapter and AI incubation lab is situated on the main campus in Bibwewadi, Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-[#0D0D0D] border border-[#262626] overflow-hidden">

          {/* Location Details Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262626]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00A3FF] uppercase tracking-wider mb-2 font-semibold">
                <span>Institutional Address</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Vishwakarma Institute of Technology
              </h3>

              <div className="space-y-3 text-xs text-[#A3A3A3] mb-6">
                <p className="leading-relaxed flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                  <span>
                    666, Upper Indiranagar, Bibwewadi,<br />
                    Pune, Maharashtra 411037, India
                  </span>
                </p>

                <p className="leading-relaxed flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-[#A3A3A3] shrink-0 mt-0.5" />
                  <span>
                    <strong>Lab & Chamber:</strong> Room 402 / AI Innovation Lab, Computer & Data Science Building
                  </span>
                </p>

                <p className="leading-relaxed flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                  <span>
                    <strong>Transit Landmark:</strong> Near Bibwewadi Bus Depot & Swami Vivekanand Statue
                  </span>
                </p>
              </div>

              {/* Coordinates Pill */}
              <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#262626] text-[11px] font-mono text-[#A3A3A3] flex items-center justify-between">
                <span>GPS Coordinates:</span>
                <span className="text-[#A3A3A3] font-semibold">18.4637° N, 73.8682° E</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#262626]">
              <a
                href="https://maps.google.com/?q=Vishwakarma+Institute+of+Technology+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#404040] text-[#FFFFFF] text-xs font-semibold rounded-lg transition"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map (7 Cols) */}
          <div className="lg:col-span-7 h-80 sm:h-96 lg:h-auto min-h-[350px] relative bg-[#0D0D0D]">
            <iframe
              title="VIT Pune Campus Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.4419515949174!2d73.86562877598816!3d18.46372297091492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2ea950f616219%3A0x321bdae2cad9f190!2sVishwakarma%20Institute%20of%20Technology%20(VIT)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 filter grayscale contrast-125 opacity-90 hover:opacity-100 hover:filter-none transition-all duration-500"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>
    </div>
  );
}
