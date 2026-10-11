"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Users,
  Building,
  AlertCircle,
  Bell,
  Ticket
} from "lucide-react";

// Faculty and Student Leads Directory
const FACULTY_DIRECTORY = [
  {
    id: "fac-001",
    name: "Dr. Rajesh Kumar",
    role: "Faculty Advisor - Data Science",
    department: "Computer Science & Engineering",
    email: "rajesh.kumar@vit.edu",
    phone: "+91 20 XXXX XXXX",
    office: "Room 405, AI Innovation Lab"
  },
  {
    id: "fac-002",
    name: "Prof. Priya Sharma",
    role: "Co-Faculty Advisor - ML Research",
    department: "Computer Science & Engineering",
    email: "priya.sharma@vit.edu",
    phone: "+91 20 XXXX XXXX",
    office: "Room 403, AI Innovation Lab"
  },
  {
    id: "lead-001",
    name: "Aarav Patel",
    role: "President - DSSA VIT Pune",
    year: "Final Year, Data Science",
    email: "aarav.patel@vitstudent.ac.in",
    phone: "+91 98765 XXXXX"
  },
  {
    id: "lead-002",
    name: "Diya Mehta",
    role: "Vice President - Operations",
    year: "Third Year, Computer Science",
    email: "diya.mehta@vitstudent.ac.in",
    phone: "+91 98765 XXXXX"
  }
];

// Contact information constants
const CONTACT_INFO = {
  email: "dssa.contact@department.edu",
  phone: "+91 20 XXXX XXXX",
  alternatePhone: "+91 98765 XXXXX",
  labHours: "Monday - Friday: 10:00 AM - 6:00 PM",
  weekendHours: "Saturday: 11:00 AM - 3:00 PM",
  location: {
    room: "Room 402, AI Innovation Lab",
    building: "Engineering Block C, VIT Pune",
    city: "Pune, Maharashtra 411048",
    mapsUrl: "https://maps.google.com/?q=VIT+Pune+Engineering+Block"
  }
};

export default function ContactHubPage() {
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState("");

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // Copy to clipboard state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Submitted inquiries and subscriptions
  const [submittedInquiries, setSubmittedInquiries] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedInquiries = localStorage.getItem("dssa-hub-inquiries");
    const savedSubscribers = localStorage.getItem("dssa-hub-newsletter");

    if (savedInquiries) {
      try {
        setSubmittedInquiries(JSON.parse(savedInquiries));
      } catch (error) {
        console.error("Failed to parse inquiries:", error);
      }
    }

    if (savedSubscribers) {
      try {
        setNewsletterSubscribers(JSON.parse(savedSubscribers));
      } catch (error) {
        console.error("Failed to parse subscribers:", error);
      }
    }
  }, []);

  // Generate unique ticket ID
  const generateTicketId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `DSSA-TICK-2026-${random}`;
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (basic Indian format)
  const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Validate contact form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.phone.trim() && !isValidPhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      errors.message = "Message must be at least 20 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Submit contact form
  const handleSubmitInquiry = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate email sending delay
    setTimeout(() => {
      const ticketId = generateTicketId();

      const inquiry = {
        ticketId,
        ...formData,
        status: "open",
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      const updated = [...submittedInquiries, inquiry];
      setSubmittedInquiries(updated);
      localStorage.setItem("dssa-hub-inquiries", JSON.stringify(updated));

      // Show success state
      setGeneratedTicketId(ticketId);
      setSubmissionSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      // Hide success message after 10 seconds
      setTimeout(() => {
        setSubmissionSuccess(false);
      }, 10000);
    }, 1500);
  };

  // Copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Handle newsletter subscription
  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();

    setNewsletterError("");

    if (!newsletterEmail.trim()) {
      setNewsletterError("Email is required");
      return;
    }

    if (!isValidEmail(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address");
      return;
    }

    // Check if already subscribed
    if (newsletterSubscribers.some(sub => sub.email === newsletterEmail)) {
      setNewsletterError("This email is already subscribed");
      return;
    }

    const subscription = {
      email: newsletterEmail,
      subscribedAt: new Date().toISOString()
    };

    const updated = [...newsletterSubscribers, subscription];
    setNewsletterSubscribers(updated);
    localStorage.setItem("dssa-hub-newsletter", JSON.stringify(updated));

    setNewsletterSuccess(true);
    setNewsletterEmail("");

    setTimeout(() => {
      setNewsletterSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#000000] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFFFFF] mb-4">
            Contact & Inquiries Hub
          </h1>
          <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto">
            Get in touch with DSSA VIT Pune. We're here to help with your questions, suggestions, and collaboration opportunities.
          </p>
        </div>

        {/* Split-Screen: Contact Form + Direct Channels */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side: Contact Form */}
          <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-[#A3A3A3]">
                Fill out the form below and we'll get back to you within 24-48 hours
              </p>
            </div>

            {/* Success Message */}
            {submissionSuccess && (
              <div className="mb-6 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-[#10b981]/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#FFFFFF] mb-1">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-sm text-[#A3A3A3]">
                      We've received your inquiry and sent a confirmation email to your address.
                    </p>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="w-4 h-4 text-[#00A3FF]" />
                    <span className="text-xs text-[#737373]">Your Support Ticket ID:</span>
                  </div>
                  <p className="text-lg font-bold text-[#00A3FF] font-mono">
                    {generatedTicketId}
                  </p>
                  <p className="text-xs text-[#737373] mt-2">
                    Save this ticket ID to track your inquiry status
                  </p>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmitInquiry} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors ${
                      formErrors.name ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-[#ef4444] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors ${
                      formErrors.email ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                    }`}
                    placeholder="john@vitstudent.ac.in"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-[#ef4444] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors ${
                    formErrors.phone ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                  }`}
                  placeholder="+91 98765 43210"
                />
                {formErrors.phone && (
                  <p className="text-xs text-[#ef4444] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className={`w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors ${
                    formErrors.subject ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                  }`}
                  placeholder="e.g., Workshop Collaboration Inquiry"
                />
                {formErrors.subject && (
                  <p className="text-xs text-[#ef4444] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
                  Your Message * (Min 20 characters)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors resize-none ${
                    formErrors.message ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                  }`}
                  placeholder="Tell us about your inquiry, suggestion, or how we can help you..."
                />
                <div className="flex items-center justify-between mt-1">
                  {formErrors.message ? (
                    <p className="text-xs text-[#ef4444] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.message}
                    </p>
                  ) : (
                    <p className="text-xs text-[#737373]">
                      {formData.message.length}/20 characters minimum
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-[#1A1A1A] text-[#737373] cursor-not-allowed"
                    : "bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#737373] border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Direct Contact Channels */}
          <div className="space-y-6">
            {/* Email Contact */}
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#00A3FF]/10 rounded-lg">
                  <Mail className="w-6 h-6 text-[#00A3FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">
                    Email Us
                  </h3>
                  <p className="text-sm text-[#A3A3A3] mb-3">
                    Send us an email directly for official inquiries
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#262626] rounded-lg text-sm text-[#FFFFFF] font-mono">
                      {CONTACT_INFO.email}
                    </code>
                    <button
                      onClick={handleCopyEmail}
                      className="px-4 py-3 bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] rounded-lg transition-colors"
                    >
                      {copiedEmail ? (
                        <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                      ) : (
                        <Copy className="w-5 h-5 text-[#A3A3A3]" />
                      )}
                    </button>
                  </div>
                  {copiedEmail && (
                    <p className="text-xs text-[#10b981] mt-2">Email copied to clipboard!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#10b981]/10 rounded-lg">
                  <Phone className="w-6 h-6 text-[#10b981]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">
                    Call Us
                  </h3>
                  <p className="text-sm text-[#A3A3A3] mb-3">
                    Speak directly with our team during lab hours
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#737373]">Office:</span>
                      <span className="text-sm text-[#FFFFFF] font-semibold">
                        {CONTACT_INFO.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#737373]">Student Leads:</span>
                      <span className="text-sm text-[#FFFFFF] font-semibold">
                        {CONTACT_INFO.alternatePhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Hours */}
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#f59e0b]/10 rounded-lg">
                  <Clock className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">
                    Lab Hours
                  </h3>
                  <p className="text-sm text-[#A3A3A3] mb-3">
                    Visit us during our open lab hours
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Weekdays:</span>
                      <span className="text-sm text-[#FFFFFF] font-semibold">
                        10:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Saturday:</span>
                      <span className="text-sm text-[#FFFFFF] font-semibold">
                        11:00 AM - 3:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Sunday:</span>
                      <span className="text-sm text-[#ef4444]">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Location & Map */}
        <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#00A3FF]/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#00A3FF]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">
                    Visit Our Lab
                  </h2>
                  <p className="text-sm text-[#A3A3A3]">
                    Come visit us at the AI Innovation Lab in VIT Pune campus
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-5 h-5 text-[#00A3FF]" />
                    <h3 className="text-sm font-semibold text-[#FFFFFF]">Location</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#FFFFFF] font-semibold">
                      {CONTACT_INFO.location.room}
                    </p>
                    <p className="text-[#A3A3A3]">
                      {CONTACT_INFO.location.building}
                    </p>
                    <p className="text-[#A3A3A3]">
                      {CONTACT_INFO.location.city}
                    </p>
                  </div>
                </div>

                <a
                  href={CONTACT_INFO.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-semibold rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl overflow-hidden">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-[#00A3FF] mx-auto mb-4" />
                  <p className="text-[#A3A3A3] mb-4">
                    Interactive campus map coming soon
                  </p>
                  <a
                    href={CONTACT_INFO.location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00A3FF] hover:text-[#0082CC] text-sm font-semibold transition-colors"
                  >
                    View on Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-br from-[#00A3FF]/10 to-[#0D0D0D] border border-[#00A3FF]/30 rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block p-4 bg-[#00A3FF]/10 rounded-full mb-4">
              <Bell className="w-8 h-8 text-[#00A3FF]" />
            </div>
            <h2 className="text-3xl font-bold text-[#FFFFFF] mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-[#A3A3A3] mb-6">
              Get weekly updates on workshops, hackathons, opportunities, and DSSA events delivered to your inbox
            </p>

            {newsletterSuccess ? (
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-6">
                <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-sm text-[#A3A3A3]">
                  You'll start receiving our weekly updates soon
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubscribe} className="max-w-xl mx-auto">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        setNewsletterError("");
                      }}
                      className={`w-full px-6 py-4 bg-[#1A1A1A] border rounded-lg text-[#FFFFFF] focus:outline-none transition-colors ${
                        newsletterError ? "border-[#ef4444]" : "border-[#262626] focus:border-[#00A3FF]"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
                {newsletterError && (
                  <p className="text-xs text-[#ef4444] mt-2 text-left flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {newsletterError}
                  </p>
                )}
              </form>
            )}

            <p className="text-xs text-[#737373] mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Faculty & Student Leads Directory */}
        <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-[#00A3FF]/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-[#00A3FF]" />
            </div>
            <h2 className="text-3xl font-bold text-[#FFFFFF] mb-3">
              Meet Our Team
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Connect with our faculty advisors and student leadership team at DSSA VIT Pune
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FACULTY_DIRECTORY.map((member) => (
              <div
                key={member.id}
                className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 hover:border-[#00A3FF] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A3FF] to-[#0082CC] flex items-center justify-center text-2xl font-bold text-[#FFFFFF]">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#FFFFFF] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[#00A3FF] font-semibold mb-2">
                      {member.role}
                    </p>
                    {member.department && (
                      <p className="text-xs text-[#737373] mb-3">
                        {member.department}
                      </p>
                    )}
                    {member.year && (
                      <p className="text-xs text-[#737373] mb-3">
                        {member.year}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#737373]" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-[#A3A3A3] hover:text-[#00A3FF] transition-colors"
                        >
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#737373]" />
                        <span className="text-sm text-[#A3A3A3]">
                          {member.phone}
                        </span>
                      </div>
                      {member.office && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#737373]" />
                          <span className="text-sm text-[#A3A3A3]">
                            {member.office}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries (if any) */}
        {submittedInquiries.length > 0 && (
          <div className="mt-12 bg-[#0D0D0D] border border-[#262626] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#FFFFFF] mb-6">
              Your Recent Inquiries
            </h3>
            <div className="space-y-4">
              {submittedInquiries.slice(-3).reverse().map((inquiry) => (
                <div
                  key={inquiry.ticketId}
                  className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="w-4 h-4 text-[#00A3FF]" />
                        <span className="text-sm font-mono text-[#00A3FF]">
                          {inquiry.ticketId}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-[#FFFFFF]">
                        {inquiry.subject}
                      </h4>
                    </div>
                    <div className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full">
                      <span className="text-xs font-semibold text-[#10b981] capitalize">
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#A3A3A3] mb-2">
                    From: {inquiry.name} ({inquiry.email})
                  </p>
                  <p className="text-xs text-[#737373]">
                    Submitted: {new Date(inquiry.submittedAt).toLocaleDateString()} at{" "}
                    {new Date(inquiry.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
