"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Bookmark, ExternalLink, Calendar, Award, Briefcase } from "lucide-react";
import { opportunitiesData } from "@/data/dssa-hub/opportunitiesData";

export default function OpportunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Internship");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("dssa-hub-bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error("Failed to parse bookmarks:", error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dssa-hub-bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Toggle bookmark
  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bookmarkId) => bookmarkId !== id) : [...prev, id]
    );
  };

  // Calculate days until deadline
  const calculateDaysUntil = (deadline) => {
    const today = new Date("2026-10-11"); // Current date from context
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if deadline is urgent (within 7 days)
  const isUrgent = (deadline) => {
    const daysUntil = calculateDaysUntil(deadline);
    return daysUntil >= 0 && daysUntil <= 7;
  };

  // Filter and search logic
  const filteredOpportunities = useMemo(() => {
    return opportunitiesData.filter((opportunity) => {
      // Category filter - must match selected category exactly
      const matchesCategory = opportunity.category === selectedCategory;

      // Search filter (title, organization, tags)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        opportunity.title.toLowerCase().includes(searchLower) ||
        opportunity.organization.toLowerCase().includes(searchLower) ||
        opportunity.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      Internship: opportunitiesData.filter((o) => o.category === "Internship").length,
      Hackathon: opportunitiesData.filter((o) => o.category === "Hackathon").length,
      Scholarship: opportunitiesData.filter((o) => o.category === "Scholarship").length,
    };
  }, []);

  const categories = ["Internship", "Hackathon", "Scholarship"];

  return (
    <div className="min-h-screen bg-[#000000] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#FFFFFF] mb-4">
            Opportunities Board
          </h1>
          <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto">
            Discover internships, hackathons, and scholarships curated for data science and
            tech students
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, organization, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0D0D0D] border border-[#262626] rounded-lg text-[#FFFFFF] placeholder-[#737373] focus:outline-none focus:border-[#00A3FF] transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-[#00A3FF] text-[#FFFFFF] shadow-lg shadow-[#00A3FF]/20"
                  : "bg-[#0D0D0D] text-[#A3A3A3] border border-[#262626] hover:border-[#404040] hover:text-[#FFFFFF]"
              }`}
            >
              {category}
              <span className="ml-2 text-sm opacity-75">({categoryCounts[category]})</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-[#A3A3A3]">
            Showing <span className="text-[#00A3FF] font-semibold">{filteredOpportunities.length}</span> opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 rounded-full bg-[#0D0D0D] mb-4">
              <Search className="w-12 h-12 text-[#737373]" />
            </div>
            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-2">No opportunities found</h3>
            <p className="text-[#A3A3A3]">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => {
              const daysUntil = calculateDaysUntil(opportunity.deadline);
              const urgent = isUrgent(opportunity.deadline);
              const isBookmarked = bookmarkedIds.includes(opportunity.id);

              return (
                <div
                  key={opportunity.id}
                  className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-6 hover:border-[#00A3FF] transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/10 flex flex-col"
                >
                  {/* Header with Category Badge and Bookmark */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {opportunity.category === "Internship" && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full">
                          <Briefcase className="w-3.5 h-3.5 text-[#10b981]" />
                          <span className="text-xs font-semibold text-[#10b981]">
                            Internship
                          </span>
                        </div>
                      )}
                      {opportunity.category === "Hackathon" && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-full">
                          <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span className="text-xs font-semibold text-[#f59e0b]">
                            Hackathon
                          </span>
                        </div>
                      )}
                      {opportunity.category === "Scholarship" && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00A3FF]/10 border border-[#00A3FF]/30 rounded-full">
                          <Award className="w-3.5 h-3.5 text-[#00A3FF]" />
                          <span className="text-xs font-semibold text-[#00A3FF]">
                            Scholarship
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(opportunity.id)}
                      className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isBookmarked
                            ? "fill-[#00A3FF] text-[#00A3FF]"
                            : "text-[#737373] hover:text-[#A3A3A3]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#FFFFFF] mb-2 line-clamp-2">
                    {opportunity.title}
                  </h3>

                  {/* Organization */}
                  <p className="text-sm text-[#A3A3A3] mb-4 line-clamp-2">
                    {opportunity.organization}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#737373] mb-4 line-clamp-3 flex-grow">
                    {opportunity.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-xs text-[#A3A3A3]"
                      >
                        {tag}
                      </span>
                    ))}
                    {opportunity.tags.length > 3 && (
                      <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-xs text-[#737373]">
                        +{opportunity.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stipend/Prize */}
                  <div className="mb-4 p-3 bg-[#1A1A1A] border border-[#262626] rounded-lg">
                    <p className="text-xs text-[#737373] mb-1">
                      {opportunity.category === "Internship" && "Stipend"}
                      {opportunity.category === "Hackathon" && "Prizes"}
                      {opportunity.category === "Scholarship" && "Grant"}
                    </p>
                    <p className="text-sm font-semibold text-[#FFFFFF]">
                      {opportunity.stipend}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#737373]" />
                      <span className="text-xs text-[#737373]">
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {urgent && (
                      <span className="px-2 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-md text-xs font-semibold text-[#ef4444]">
                        {daysUntil === 0 ? "Today!" : `${daysUntil}d left`}
                      </span>
                    )}
                  </div>

                  {/* Apply Button */}
                  <a
                    href={opportunity.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-semibold rounded-lg transition-colors"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Bookmarked Section */}
        {bookmarkedIds.length > 0 && (
          <div className="mt-16 pt-16 border-t border-[#262626]">
            <h2 className="text-3xl font-bold text-[#FFFFFF] mb-8 text-center">
              Your Bookmarks
              <span className="ml-3 text-xl text-[#00A3FF]">({bookmarkedIds.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunitiesData
                .filter((opp) => bookmarkedIds.includes(opp.id))
                .map((opportunity) => {
                  const daysUntil = calculateDaysUntil(opportunity.deadline);
                  const urgent = isUrgent(opportunity.deadline);

                  return (
                    <div
                      key={opportunity.id}
                      className="bg-[#0D0D0D] border border-[#00A3FF]/30 rounded-xl p-6 hover:border-[#00A3FF] transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/10 flex flex-col"
                    >
                      {/* Compact bookmarked card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {opportunity.category === "Internship" && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full">
                              <span className="text-xs font-semibold text-[#10b981]">
                                Internship
                              </span>
                            </div>
                          )}
                          {opportunity.category === "Hackathon" && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-full">
                              <span className="text-xs font-semibold text-[#f59e0b]">
                                Hackathon
                              </span>
                            </div>
                          )}
                          {opportunity.category === "Scholarship" && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00A3FF]/10 border border-[#00A3FF]/30 rounded-full">
                              <span className="text-xs font-semibold text-[#00A3FF]">
                                Scholarship
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => toggleBookmark(opportunity.id)}
                          className="p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                        >
                          <Bookmark className="w-5 h-5 fill-[#00A3FF] text-[#00A3FF]" />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-[#FFFFFF] mb-2 line-clamp-2">
                        {opportunity.title}
                      </h3>

                      <p className="text-sm text-[#A3A3A3] mb-3">
                        {opportunity.organization}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#737373]" />
                          <span className="text-xs text-[#737373]">
                            {new Date(opportunity.deadline).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {urgent && (
                          <span className="px-2 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-md text-xs font-semibold text-[#ef4444]">
                            {daysUntil === 0 ? "Today!" : `${daysUntil}d left`}
                          </span>
                        )}
                      </div>

                      <a
                        href={opportunity.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A3FF] hover:bg-[#0082CC] text-[#FFFFFF] font-semibold rounded-lg transition-colors text-sm"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
