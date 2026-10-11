"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Award,
  Search,
  Calendar,
  Mail,
  Phone,
  Code,
  Users,
  TrendingUp,
  MessageSquare
} from "lucide-react";

// Brand icons (lucide-react v1 doesn't include these)
function GithubIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

// Application status progression
const STATUS_STAGES = [
  { key: "submitted", label: "Submitted", icon: FileText },
  { key: "under_review", label: "Under Review", icon: TrendingUp },
  { key: "interview_scheduled", label: "Interview Scheduled", icon: Calendar },
  { key: "final_offer", label: "Final Offer", icon: Award },
];

// Domain options for applicants
const DOMAIN_OPTIONS = [
  { id: "technical", label: "Technical & Development", icon: Code },
  { id: "content", label: "Content & Media", icon: MessageSquare },
  { id: "events", label: "Event Management", icon: Calendar },
  { id: "outreach", label: "Community Outreach", icon: Users },
];

// Skill categories for self-rating
const SKILL_CATEGORIES = [
  { id: "python", label: "Python Programming" },
  { id: "webdev", label: "Web Development" },
  { id: "data_analysis", label: "Data Analysis" },
  { id: "event_mgmt", label: "Event Management" },
];

export default function JoinDssaPage() {
  const [activeTab, setActiveTab] = useState("apply"); // "apply" or "status"
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Application form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: "",
    email: "",
    phone: "",
    academicYear: "",
    branch: "",
    // Step 2: Domain & Skills
    preferredDomains: [],
    skills: {
      python: 0,
      webdev: 0,
      data_analysis: 0,
      event_mgmt: 0,
    },
    // Step 3: SOP & Resume
    statementOfPurpose: "",
    resumeLink: "",
    githubProfile: "",
    linkedinProfile: "",
  });

  // Status checker state
  const [trackingId, setTrackingId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [submittedApplications, setSubmittedApplications] = useState([]);

  // Load submitted applications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dssa-hub-applications");
    if (saved) {
      try {
        setSubmittedApplications(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse applications:", error);
      }
    }
  }, []);

  // Generate unique tracking ID
  const generateTrackingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `DSSA-2026-${random}`;
  };

  // Determine eligible roles based on academic year and branch
  const getEligibleRole = (year, branch) => {
    const dsaBranches = ["data science", "computer science", "information technology"];
    const branchLower = branch.toLowerCase();

    if (year === "first_year" && branchLower.includes("data science")) {
      return "Volunteer";
    }
    if (year === "second_year" && dsaBranches.some(b => branchLower.includes(b))) {
      return "Coordinator / Secretary";
    }
    return "Not Eligible";
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle skill rating changes
  const handleSkillChange = (skillId, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillId]: value }
    }));
  };

  // Handle domain selection toggle
  const toggleDomain = (domainId) => {
    setFormData(prev => ({
      ...prev,
      preferredDomains: prev.preferredDomains.includes(domainId)
        ? prev.preferredDomains.filter(id => id !== domainId)
        : [...prev.preferredDomains, domainId]
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.phone.trim() !== "" &&
          formData.academicYear !== "" &&
          formData.branch.trim() !== ""
        );
      case 2:
        return (
          formData.preferredDomains.length > 0 &&
          Object.values(formData.skills).some(rating => rating > 0)
        );
      case 3:
        return (
          formData.statementOfPurpose.trim().length >= 50 &&
          formData.resumeLink.trim() !== ""
        );
      default:
        return false;
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit application
  const submitApplication = () => {
    if (!validateStep(3)) return;

    const trackingId = generateTrackingId();
    const eligibleRole = getEligibleRole(formData.academicYear, formData.branch);

    const application = {
      trackingId,
      ...formData,
      eligibleRole,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    const updated = [...submittedApplications, application];
    setSubmittedApplications(updated);
    localStorage.setItem("dssa-hub-applications", JSON.stringify(updated));

    // Reset form and show success
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      academicYear: "",
      branch: "",
      preferredDomains: [],
      skills: { python: 0, webdev: 0, data_analysis: 0, event_mgmt: 0 },
      statementOfPurpose: "",
      resumeLink: "",
      githubProfile: "",
      linkedinProfile: "",
    });
    setCurrentStep(1);
    setIsModalOpen(false);

    // Show success message and switch to status tab
    setTrackingId(trackingId);
    setActiveTab("status");
    checkApplicationStatus(trackingId);
  };

  // Check application status by tracking ID
  const checkApplicationStatus = (id = trackingId) => {
    const application = submittedApplications.find(app => app.trackingId === id);
    setApplicationStatus(application || null);
  };

  // Get current status stage index
  const getCurrentStageIndex = (status) => {
    return STATUS_STAGES.findIndex(stage => stage.key === status);
  };

  return (
    <div className="min-h-screen bg-[#000000] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFFFFF] mb-4">
            Join DSSA
          </h1>
          <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto">
            Apply to become a part of the Data Science Student Association and shape the future of data science at VIT Pune
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "apply"
                ? "bg-[#00A3FF] text-[#FFFFFF]"
                : "bg-[#0D0D0D] text-[#A3A3A3] border border-[#262626] hover:border-[#404040]"
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Apply Now
            </div>
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "status"
                ? "bg-[#00A3FF] text-[#FFFFFF]"
                : "bg-[#0D0D0D] text-[#A3A3A3] border border-[#262626] hover:border-[#404040]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Check Status
            </div>
          </button>
        </div>

        {/* Apply Tab */}
        {activeTab === "apply" && (
          <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-3">
                Start Your DSSA Journey
              </h2>
              <p className="text-[#A3A3A3]">
                Fill out the application form to join our community
              </p>
            </div>

            {/* Role Eligibility Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#10b981]/10 rounded-lg">
                    <Users className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#FFFFFF] mb-1">
                      Volunteer Positions
                    </h3>
                    <p className="text-xs text-[#A3A3A3]">
                      Open to First-year students from Data Science branch
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#00A3FF]/10 rounded-lg">
                    <Award className="w-5 h-5 text-[#00A3FF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#FFFFFF] mb-1">
                      Coordinator / Secretary
                    </h3>
                    <p className="text-xs text-[#A3A3A3]">
                      Open to Second-year students from Data Science / CS / IT branches
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Start Application
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Recent Applications */}
            {submittedApplications.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#262626]">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
                  Your Recent Applications
                </h3>
                <div className="space-y-3">
                  {submittedApplications.slice(-3).reverse().map((app) => (
                    <div
                      key={app.trackingId}
                      className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#FFFFFF]">
                          {app.trackingId}
                        </p>
                        <p className="text-xs text-[#A3A3A3] mt-1">
                          Role: {app.eligibleRole} • Submitted {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setTrackingId(app.trackingId);
                          setActiveTab("status");
                          checkApplicationStatus(app.trackingId);
                        }}
                        className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#262626] text-[#00A3FF] text-sm font-semibold rounded-lg transition-colors"
                      >
                        View Status
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Checker Tab */}
        {activeTab === "status" && (
          <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-3">
                Track Your Application
              </h2>
              <p className="text-[#A3A3A3]">
                Enter your tracking ID to check your application status
              </p>
            </div>

            {/* Tracking ID Input */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g., DSSA-2026-1234)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] placeholder-[#737373] focus:outline-none focus:border-[#00A3FF] transition-colors"
                />
              </div>
              <button
                onClick={() => checkApplicationStatus()}
                className="w-full mt-4 py-3 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-semibold rounded-lg transition-colors"
              >
                Check Status
              </button>
            </div>

            {/* Status Display */}
            {applicationStatus && (
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#FFFFFF]">
                      {applicationStatus.fullName}
                    </h3>
                    <p className="text-sm text-[#A3A3A3] mt-1">
                      {applicationStatus.trackingId} • Applied for: {applicationStatus.eligibleRole}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                    <p className="text-sm font-semibold text-[#10b981] capitalize">
                      {applicationStatus.status.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-8">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#262626]" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-[#00A3FF] transition-all duration-500"
                    style={{
                      width: `${(getCurrentStageIndex(applicationStatus.status) / (STATUS_STAGES.length - 1)) * 100}%`
                    }}
                  />
                  <div className="relative flex justify-between">
                    {STATUS_STAGES.map((stage, index) => {
                      const Icon = stage.icon;
                      const isComplete = getCurrentStageIndex(applicationStatus.status) >= index;
                      const isCurrent = getCurrentStageIndex(applicationStatus.status) === index;

                      return (
                        <div key={stage.key} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                              isComplete
                                ? "bg-[#00A3FF] border-[#00A3FF]"
                                : "bg-[#0D0D0D] border-[#262626]"
                            } ${isCurrent ? "ring-4 ring-[#00A3FF]/20" : ""}`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isComplete ? "text-[#FFFFFF]" : "text-[#737373]"
                              }`}
                            />
                          </div>
                          <p
                            className={`text-xs mt-2 text-center max-w-[80px] ${
                              isComplete ? "text-[#FFFFFF] font-semibold" : "text-[#737373]"
                            }`}
                          >
                            {stage.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application Details */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#737373]" />
                      <span className="text-[#A3A3A3]">{applicationStatus.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-[#737373]" />
                      <span className="text-[#A3A3A3]">{applicationStatus.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-[#737373]" />
                      <span className="text-[#A3A3A3]">
                        Submitted: {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <TrendingUp className="w-4 h-4 text-[#737373]" />
                      <span className="text-[#A3A3A3]">
                        Last Updated: {new Date(applicationStatus.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {applicationStatus === null && trackingId !== "" && (
              <div className="text-center py-12">
                <div className="inline-block p-6 rounded-full bg-[#1A1A1A] mb-4">
                  <Search className="w-12 h-12 text-[#737373]" />
                </div>
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">
                  No Application Found
                </h3>
                <p className="text-[#A3A3A3]">
                  Please check your tracking ID and try again
                </p>
              </div>
            )}
          </div>
        )}

        {/* Application Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0D0D0D] border-b border-[#262626] p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#FFFFFF]">
                    DSSA Application Form
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#737373] hover:text-[#FFFFFF] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentStep >= step
                            ? "bg-[#00A3FF] text-[#FFFFFF]"
                            : "bg-[#1A1A1A] text-[#737373]"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            currentStep > step ? "bg-[#00A3FF]" : "bg-[#262626]"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
                      Personal Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                          placeholder="your.email@vit.edu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          Academic Year *
                        </label>
                        <select
                          value={formData.academicYear}
                          onChange={(e) => handleInputChange("academicYear", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                        >
                          <option value="">Select Year</option>
                          <option value="first_year">First Year</option>
                          <option value="second_year">Second Year</option>
                          <option value="third_year">Third Year</option>
                          <option value="fourth_year">Fourth Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          Branch *
                        </label>
                        <input
                          type="text"
                          value={formData.branch}
                          onChange={(e) => handleInputChange("branch", e.target.value)}
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                          placeholder="e.g., Data Science, Computer Science"
                        />
                      </div>
                    </div>

                    {formData.academicYear && formData.branch && (
                      <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-4">
                        <p className="text-sm text-[#A3A3A3]">
                          Eligible Role: <span className="font-semibold text-[#00A3FF]">
                            {getEligibleRole(formData.academicYear, formData.branch)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Domain & Skills */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
                      Domain Preferences & Skills
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-[#A3A3A3] mb-3">
                        Select Your Preferred Domains (Select at least one) *
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {DOMAIN_OPTIONS.map((domain) => {
                          const Icon = domain.icon;
                          const isSelected = formData.preferredDomains.includes(domain.id);

                          return (
                            <button
                              key={domain.id}
                              onClick={() => toggleDomain(domain.id)}
                              className={`p-4 border-2 rounded-lg transition-all text-left ${
                                isSelected
                                  ? "border-[#00A3FF] bg-[#00A3FF]/10"
                                  : "border-[#262626] bg-[#1A1A1A] hover:border-[#404040]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={`w-5 h-5 ${
                                    isSelected ? "text-[#00A3FF]" : "text-[#737373]"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    isSelected ? "text-[#FFFFFF]" : "text-[#A3A3A3]"
                                  }`}
                                >
                                  {domain.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#A3A3A3] mb-3">
                        Rate Your Skills (1-10) *
                      </label>
                      <div className="space-y-4">
                        {SKILL_CATEGORIES.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#FFFFFF]">{skill.label}</span>
                              <span className="text-sm font-semibold text-[#00A3FF]">
                                {formData.skills[skill.id]}/10
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={formData.skills[skill.id]}
                              onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                              className="w-full h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #00A3FF ${formData.skills[skill.id] * 10}%, #1A1A1A ${formData.skills[skill.id] * 10}%)`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: SOP & Resume */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
                      Statement of Purpose & Links
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                        Why do you want to join DSSA? * (Minimum 50 characters)
                      </label>
                      <textarea
                        value={formData.statementOfPurpose}
                        onChange={(e) => handleInputChange("statementOfPurpose", e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF] resize-none"
                        placeholder="Share your motivation, interests, and what you hope to contribute to DSSA..."
                      />
                      <p className="text-xs text-[#737373] mt-1">
                        {formData.statementOfPurpose.length}/50 characters minimum
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                        Resume/Portfolio Link *
                      </label>
                      <input
                        type="url"
                        value={formData.resumeLink}
                        onChange={(e) => handleInputChange("resumeLink", e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                        placeholder="https://drive.google.com/... or your portfolio URL"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          GitHub Profile (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]">
                            <GithubIcon className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            value={formData.githubProfile}
                            onChange={(e) => handleInputChange("githubProfile", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                            placeholder="github.com/username"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                          LinkedIn Profile (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]">
                            <LinkedinIcon className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            value={formData.linkedinProfile}
                            onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00A3FF]"
                            placeholder="linkedin.com/in/username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-[#0D0D0D] border-t border-[#262626] p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      currentStep === 1
                        ? "bg-[#1A1A1A] text-[#737373] cursor-not-allowed"
                        : "bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#262626]"
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        validateStep(currentStep)
                          ? "bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF]"
                          : "bg-[#1A1A1A] text-[#737373] cursor-not-allowed"
                      }`}
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={submitApplication}
                      disabled={!validateStep(3)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        validateStep(3)
                          ? "bg-[#10b981] hover:bg-[#059669] text-[#FFFFFF]"
                          : "bg-[#1A1A1A] text-[#737373] cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Submit Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
