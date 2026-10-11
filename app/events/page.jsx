'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  X,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from '@/data/events.json';
import EventModal from '@/components/EventModal';

const AUTOPLAY_DURATION = 6000;
const PAST_EVENTS_PREVIEW_COUNT = 8;

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSeminarsModal, setShowAllSeminarsModal] = useState(false);
  const [allSeminarsSearch, setAllSeminarsSearch] = useState('');

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [slideImageOverrides, setSlideImageOverrides] = useState({});

  const carouselRef = useRef(null);
  const touchStartX = useRef(null);

  const handleSelectSlideImage = (slideIndex, imgUrl) => {
    setSlideImageOverrides(prev => ({
      ...prev,
      [slideIndex]: imgUrl
    }));
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Data extraction
  const eventsList = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
  const heroSlides = (Array.isArray(eventsData) ? eventsData.heroSlides : eventsData.heroSlides) || [
    {
      id: 'slide-01',
      slideNumber: '01',
      title: 'Data Odyssey: Annual Analytics Summit',
      category: 'Annual Summit',
      date: '15/09/2026, Monday',
      description: 'Explored state-of-the-art architectures in generative models and scalable deep learning pipelines.',
      image: '/events/model_evaluation_session_banner.png',
      mode: 'Hybrid / Auditorium 1'
    }
  ];

  const upcomingEvents = eventsList.filter(e => e.status !== 'Completed');
  const pastEvents = eventsList.filter(e => e.status === 'Completed');

  const filteredPastEvents = pastEvents.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || e.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...Array.from(new Set(pastEvents.map(e => e.category)))];

  // Motion preference detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Visibility detection (pause on hidden tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Slide navigation with rapid click lock
  const changeSlide = (newIndex, newDir) => {
    if (isTransitioning || newIndex === currentIndex) return;
    setIsTransitioning(true);
    setDirection(newDir);
    setCurrentIndex(newIndex);
    setProgressKey(k => k + 1);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextIdx = (currentIndex + 1) % heroSlides.length;
    changeSlide(nextIdx, 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    const prevIdx = (currentIndex - 1 + heroSlides.length) % heroSlides.length;
    changeSlide(prevIdx, -1);
  };

  const goToSlide = (idx) => {
    if (isTransitioning || idx === currentIndex) return;
    const dir = idx > currentIndex ? 1 : -1;
    changeSlide(idx, dir);
  };

  // Autoplay timer
  useEffect(() => {
    if (isHovered || isTabHidden || isTransitioning) return;

    const timer = setTimeout(() => {
      handleNext();
    }, AUTOPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, isHovered, isTabHidden, isTransitioning, progressKey]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isTransitioning, isModalOpen]);

  // Touch / Drag swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Mouse move parallax
  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !carouselRef.current) return;
    const rect = carouselRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseParallax({ x: 0, y: 0 });
  };

  // Slide transition variants for Curtain Wipe & Parallax
  const slideVariants = {
    enter: (dir) => {
      if (prefersReducedMotion) {
        return {
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          x: '0%',
          zIndex: 20,
        };
      }
      return {
        // Curtain wipe reveal:
        // When going next (dir > 0), incoming reveals from left to right (starts clipped from right)
        // When going prev (dir < 0), incoming reveals from right to left (starts clipped from left)
        clipPath: dir > 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        x: '0%',
        opacity: 1,
        zIndex: 20,
      };
    },
    center: {
      clipPath: 'inset(0% 0% 0% 0%)',
      x: '0%',
      opacity: 1,
      zIndex: 20,
    },
    exit: (dir) => {
      if (prefersReducedMotion) {
        return {
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          x: '0%',
          zIndex: 10,
        };
      }
      return {
        // Outgoing slide shifts slightly in opposite direction (parallax)
        clipPath: 'inset(0% 0% 0% 0%)',
        x: dir > 0 ? '-10%' : '10%',
        opacity: 1,
        zIndex: 10,
      };
    },
  };

  const currentSlide = heroSlides[currentIndex] || heroSlides[0];
  const activeImage = slideImageOverrides[currentIndex] || currentSlide.image;

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] pb-24 overflow-x-hidden">
      {/* Dynamic Keyframes for Progress Bar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes autoplayBarFill {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
        `
      }} />

      {/* Header */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b border-[#262626]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D0D0D] border border-[#262626] text-xs font-mono text-[#00A3FF] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EVENTS & WORKSHOPS</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          Events <span className="text-[#A3A3A3]">& Masterclasses</span>
        </h1>
        <p className="text-[#A3A3A3] max-w-2xl text-lg leading-relaxed">
          Discover upcoming hackathons, bootcamps, and technical sessions hosted by the Data Science Student Association.
        </p>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A3FF] animate-ping" />
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              onClick={() => openModal(event)}
              className="flex flex-col rounded-2xl border border-[#262626] bg-[#0D0D0D] overflow-hidden group hover:border-[#404040] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="h-52 overflow-hidden relative border-b border-[#262626]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#000000]/80 backdrop-blur-md border border-[#262626] text-xs font-mono uppercase rounded-full text-[#00A3FF]">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#00A3FF] transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-[#A3A3A3] text-sm mb-6 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-8 mt-auto">
                  <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
                    <Calendar className="w-4 h-4 text-[#00A3FF]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
                    <Clock className="w-4 h-4 text-[#00A3FF]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
                    <MapPin className="w-4 h-4 text-[#00A3FF]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[#262626]">
                  <span className="flex-1 py-2.5 rounded-lg border border-[#262626] bg-[#000000] text-sm font-medium text-center text-[#FFFFFF] group-hover:border-[#404040] transition-colors">
                    View Details
                  </span>
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Register
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {upcomingEvents.length === 0 && (
          <div className="p-12 text-center border border-[#262626] rounded-2xl bg-[#0D0D0D]">
            <p className="text-[#A3A3A3]">No upcoming events at the moment. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 1. FULL-WIDTH HERO CAROUSEL: PAST EVENTS ARCHIVE SPOTLIGHT */}
      {/* ======================================================== */}
      <section className="relative w-full pt-10 pb-6 border-t border-[#262626] bg-black">
        {/* Section Header Banner */}
        <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00A3FF] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00A3FF]" />
              <span>Glimpses of Past Events</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Past Events Archive
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-md">
            Relive DSSA’s flagship events, competitive contests, hackathons and more.
          </p>
        </div>

        {/* Carousel Container (Edge to edge, full width, 21:9 desktop, taller on mobile) */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[380px] sm:h-[420px] md:h-[460px] lg:h-[480px] overflow-hidden bg-[#0A0A0A] select-none"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: prefersReducedMotion ? 0.35 : 1.0,
                ease: [0.77, 0, 0.175, 1],
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image with Ken Burns & Mouse Parallax */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={currentSlide.title}
                  initial={{ scale: 1.0, opacity: 0.9 }}
                  animate={{ scale: prefersReducedMotion ? 1.0 : 1.08, opacity: 1 }}
                  transition={{
                    duration: 6.0,
                    ease: 'linear',
                  }}
                  style={{
                    x: prefersReducedMotion ? 0 : mouseParallax.x * -16,
                    y: prefersReducedMotion ? 0 : mouseParallax.y * -16,
                    objectPosition: currentSlide.imagePosition || 'center center',
                  }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Seamless Scrim Gradient: Ultra-Smooth Cubic Roll-off with Zero Sharp Edges */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.65)_30%,rgba(0,0,0,0.35)_46%,rgba(0,0,0,0.12)_60%,rgba(0,0,0,0.02)_72%,transparent_80%)] pointer-events-none" />
                <div className="sm:hidden absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,transparent_50%)] pointer-events-none" />
              </div>

              {/* Event Moments / Photo Gallery Thumbnails */}
              {currentSlide.images && currentSlide.images.length > 1 && (
                <div className="absolute top-5 sm:top-6 right-6 sm:right-12 md:right-16 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 shadow-2xl">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mr-1 hidden sm:flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]" />
                    <span>Moments</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {currentSlide.images.map((imgUrl, imgIdx) => {
                      const isSelected = activeImage === imgUrl;
                      return (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSlideImage(currentIndex, imgUrl);
                          }}
                          aria-label={`View photo ${imgIdx + 1} of ${currentSlide.title}`}
                          className={`group relative w-12 h-8 sm:w-16 sm:h-11 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer ${isSelected
                            ? 'border-[#00A3FF] ring-2 ring-[#00A3FF]/50 scale-105 opacity-100 shadow-[0_0_12px_rgba(0,163,255,0.4)]'
                            : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/60 hover:scale-102'
                            }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${currentSlide.title} highlight ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Big Oversized Slide Number (Decorative Parallax Element) */}
              <motion.div
                style={{
                  x: prefersReducedMotion ? 0 : mouseParallax.x * -32,
                  y: prefersReducedMotion ? 0 : mouseParallax.y * -32,
                }}
                className="absolute right-6 sm:right-12 md:right-20 bottom-4 sm:bottom-6 pointer-events-none select-none z-10"
              >
                <span className="text-6xl sm:text-8xl md:text-[10rem] font-mono font-black text-white/[0.05] tracking-tighter leading-none block select-none">
                  {currentSlide.slideNumber || String(currentIndex + 1).padStart(2, '0')}
                </span>
              </motion.div>

              {/* Slide Content: Staggered Text Reveal */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-10 sm:px-16 md:px-24 flex flex-col justify-center pt-14 sm:pt-20 pb-4 sm:pb-6">
                <div className="max-w-2xl sm:max-w-3xl space-y-3 sm:space-y-3.5 translate-y-4 sm:translate-y-8">
                  {/* Category Pill */}
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: prefersReducedMotion ? 0 : 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-[#00A3FF]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
                        {currentSlide.category}
                      </span>
                    </motion.div>
                  </div>

                  {/* Title (Staggered slide-up from overflow) */}
                  <div className="overflow-hidden">
                    <motion.h3
                      aria-live="polite"
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: prefersReducedMotion ? 0 : 0.23,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                    >
                      {currentSlide.title}
                    </motion.h3>
                  </div>

                  {/* Date & Mode Meta */}
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: prefersReducedMotion ? 0 : 0.31,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-200 font-medium"
                    >
                      <span className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 shadow-md">
                        <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
                        {currentSlide.date}
                      </span>
                      {currentSlide.mode && (
                        <span className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-zinc-300 shadow-md">
                          <Users className="w-3.5 h-3.5 text-[#00A3FF]" />
                          {currentSlide.mode}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  {/* One-Line Description */}
                  <div className="overflow-hidden">
                    <motion.p
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: prefersReducedMotion ? 0 : 0.39,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-xs sm:text-sm md:text-base text-zinc-200 max-w-xl sm:max-w-2xl line-clamp-2 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    >
                      {currentSlide.description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow: Glass-style with Center Fill & Directional Nudge */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isTransitioning}
            aria-label="Previous slide"
            className="group absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-2xl transition-all duration-300 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" />
            <ChevronLeft className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 text-white group-hover:text-black group-hover:-translate-x-1" />
          </button>

          {/* Right Arrow: Glass-style with Center Fill & Directional Nudge */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isTransitioning}
            aria-label="Next slide"
            className="group absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-2xl transition-all duration-300 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" />
            <ChevronRight className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 text-white group-hover:text-black group-hover:translate-x-1" />
          </button>

          {/* Bottom Progress Bar & Counter in a sleek glass pill */}
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-12 md:right-16 z-30 flex items-center gap-3 sm:gap-4 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-2xl">
            {/* "02 / 06" Counter */}
            <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white flex items-center pr-2.5 border-r border-white/15">
              <span className="text-[#00A3FF]">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-zinc-600 mx-1.5">/</span>
              <span className="text-zinc-400">
                {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Thin Segmented Progress Bars */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {heroSlides.map((_, idx) => {
                const isActive = idx === currentIndex;
                const isPast = idx < currentIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    disabled={isTransitioning}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className="h-5 flex items-center py-1 group/bar cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00A3FF] rounded"
                  >
                    <div className="w-6 sm:w-10 h-1 rounded-full bg-white/20 overflow-hidden relative transition-all group-hover/bar:bg-white/40">
                      {isActive && (
                        <div
                          key={`progress-${idx}-${progressKey}`}
                          className="h-full w-full bg-white rounded-full origin-left"
                          style={{
                            animation: `autoplayBarFill ${AUTOPLAY_DURATION}ms linear forwards`,
                            animationPlayState: (isHovered || isTabHidden) ? 'paused' : 'running',
                          }}
                        />
                      )}
                      {isPast && (
                        <div className="h-full w-full bg-white/60 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SEMINAR CARDS (DIRECTLY BELOW THE HERO CAROUSEL) */}
      {/* ======================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#262626]">
        {/* Section Header & Search / Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00A3FF] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00A3FF]" />
              <span>Technical Workshops & Sessions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Past Seminars
            </h2>
            <p className="text-[#A3A3A3] text-sm md:text-base mt-2 max-w-xl">
              Browse our complete archive of speaker sessions, code walkthroughs, and interview bootcamps.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search past seminars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-[#0D0D0D] border border-[#262626] rounded-xl text-sm text-[#FFFFFF] placeholder-[#737373] focus:outline-none focus:border-[#00A3FF] transition-colors"
              />
            </div>
            {/* Turn this on when filter is required. */}


            {/* <div className="flex overflow-x-auto gap-2 pb-1 sm:pb-0 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${filter === cat
                    ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]'
                    : 'bg-[#0D0D0D] text-[#A3A3A3] border-[#262626] hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div> */}


          </div>
        </div>

        {/* Responsive Grid: 3 columns desktop, 2 tablet, 1 mobile — capped at first 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPastEvents.slice(0, PAST_EVENTS_PREVIEW_COUNT).map((event, index) => {
            const speakerName = event.speakers && event.speakers.length > 0
              ? (typeof event.speakers[0] === 'string' ? event.speakers[0] : event.speakers[0]?.name)
              : null;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: prefersReducedMotion ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => openModal(event)}
                className="group flex flex-col rounded-2xl border border-[#262626] bg-[#0D0D0D] overflow-hidden hover:border-[#404040] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,163,255,0.06)] transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail with Zoom Effect */}
                <div className="h-48 overflow-hidden relative border-b border-[#262626] bg-[#000000]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    style={{ objectPosition: event.imagePosition || 'center top' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md border border-[#262626] text-[11px] font-mono uppercase tracking-wider text-[#00A3FF] rounded-full">
                      {event.category}
                    </span>
                  </div>

                  {/* Mode Badge if present */}
                  {event.mode && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-[#262626] text-[10px] text-zinc-300 rounded">
                        {event.mode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-[#00A3FF] font-medium mb-2.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2.5 line-clamp-2 group-hover:text-[#00A3FF] transition-colors leading-snug">
                      {event.title}
                    </h3>

                    {/* Speaker Info */}
                    {speakerName && (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3 bg-black/40 px-2.5 py-1.5 rounded-lg border border-[#262626] self-start">
                        <User className="w-3.5 h-3.5 text-[#00A3FF]" />
                        <span>Speaker: <strong className="text-white font-medium">{speakerName}</strong></span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#A3A3A3] line-clamp-3 leading-relaxed mb-6">
                      {event.description}
                    </p>
                  </div>

                  {/* View Details Action Link */}
                  <div className="pt-4 border-t border-[#262626] flex items-center justify-between text-xs font-semibold text-[#00A3FF] group-hover:text-white transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Seminars Button — visible only if there are more than preview count */}
        {filteredPastEvents.length > PAST_EVENTS_PREVIEW_COUNT && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-sm text-[#737373] font-mono">
              Showing {PAST_EVENTS_PREVIEW_COUNT} of {filteredPastEvents.length} sessions
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAllSeminarsModal(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0D0D0D] border border-[#404040] hover:border-[#00A3FF] text-white font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,163,255,0.15)] cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-[#00A3FF] group-hover:rotate-12 transition-transform duration-300" />
              View All {filteredPastEvents.length} Seminars &amp; Sessions
              <ArrowRight className="w-4 h-4 text-[#00A3FF] transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        )}

        {/* Empty Search Result Fallback */}
        {filteredPastEvents.length === 0 && (
          <div className="p-16 text-center border border-[#262626] rounded-2xl bg-[#0D0D0D]">
            <p className="text-[#A3A3A3] text-base mb-2">No past seminars match your search or filter.</p>
            <button
              onClick={() => { setFilter('All'); setSearchQuery(''); }}
              className="text-xs font-mono text-[#00A3FF] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Shared Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ============================================================ */}
      {/* ALL SEMINARS FULL-SCREEN MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showAllSeminarsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="All Seminars"
          >
            {/* Modal Header */}
            <div className="flex-shrink-0 border-b border-[#262626] bg-[#0A0A0A]">
              <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00A3FF] mb-1">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Complete Archive</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    All Seminars &amp; Expert Sessions
                  </h2>
                  <p className="text-xs text-[#737373] mt-1">{pastEvents.length} sessions total</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Search inside modal */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search seminars..."
                      value={allSeminarsSearch}
                      onChange={(e) => setAllSeminarsSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-56 bg-[#0D0D0D] border border-[#262626] rounded-xl text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#00A3FF] transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => { setShowAllSeminarsModal(false); setAllSeminarsSearch(''); }}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] text-zinc-400 hover:text-white hover:border-[#404040] transition-all cursor-pointer"
                    aria-label="Close seminars modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body — Scrollable Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-10">
                {(() => {
                  const modalEvents = pastEvents.filter(e => {
                    if (!allSeminarsSearch.trim()) return true;
                    const q = allSeminarsSearch.toLowerCase();
                    return (
                      e.title.toLowerCase().includes(q) ||
                      e.description.toLowerCase().includes(q) ||
                      (e.speakers || []).some(s =>
                        (typeof s === 'string' ? s : s?.name || '').toLowerCase().includes(q)
                      )
                    );
                  });

                  if (modalEvents.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Search className="w-10 h-10 text-[#404040]" />
                        <p className="text-[#A3A3A3]">No sessions match your search.</p>
                        <button
                          onClick={() => setAllSeminarsSearch('')}
                          className="text-xs font-mono text-[#00A3FF] underline cursor-pointer"
                        >
                          Clear Search
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {modalEvents.map((event, index) => {
                        const speakerName = event.speakers && event.speakers.length > 0
                          ? (typeof event.speakers[0] === 'string' ? event.speakers[0] : event.speakers[0]?.name)
                          : null;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => { setShowAllSeminarsModal(false); openModal(event); }}
                            className="group flex flex-col rounded-2xl border border-[#262626] bg-[#0D0D0D] overflow-hidden hover:border-[#404040] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,163,255,0.08)] transition-all duration-300 cursor-pointer"
                          >
                            {/* Card Image */}
                            <div className="h-40 overflow-hidden relative border-b border-[#262626] bg-[#000]">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                                style={{ objectPosition: event.imagePosition || 'center top' }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
                              <div className="absolute top-2.5 left-2.5">
                                <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-[#262626] text-[10px] font-mono uppercase tracking-wider text-[#00A3FF] rounded-full">
                                  {event.category}
                                </span>
                              </div>
                              {event.mode && (
                                <div className="absolute top-2.5 right-2.5">
                                  <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-[#262626] text-[9px] text-zinc-300 rounded">
                                    {event.mode}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Card Info */}
                            <div className="p-4 flex flex-col flex-1 justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 text-[10px] text-[#00A3FF] font-medium mb-1.5">
                                  <Calendar className="w-3 h-3" />
                                  <span>{event.date}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-2 group-hover:text-[#00A3FF] transition-colors leading-snug">
                                  {event.title}
                                </h3>
                                {speakerName && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-2 bg-black/40 px-2 py-1 rounded-lg border border-[#262626]">
                                    <User className="w-3 h-3 text-[#00A3FF]" />
                                    <span className="truncate"><strong className="text-white font-medium">{speakerName}</strong></span>
                                  </div>
                                )}
                              </div>
                              <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[10px] font-semibold text-[#00A3FF] group-hover:text-white transition-colors">
                                <span>View Details</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
