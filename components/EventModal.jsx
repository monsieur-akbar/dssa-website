'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, Users, ExternalLink, Info, Trophy, Shield, LucideCheckCircle } from 'lucide-react';

export default function EventModal({ event, isOpen, onClose }) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Top Header Solid Accent Bar */}
        <div className="h-1 w-full bg-[#FFFFFF]" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#262626] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#000000] text-[#00A3FF] border border-[#262626]">
                {event.category}
              </span>
              {event.status === 'Upcoming' && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#000000] text-[#00A3FF] border border-[#262626] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]"></span>
                  Registration Open
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-tight">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#262626] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Event Meta Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#000000] border border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Date</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF]">{event.date}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#000000] border border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-1">
                <Clock className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Time</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF]">{event.time}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#000000] border border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Venue</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF] truncate">{event.location}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#000000] border border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-1">
                <Users className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span>Mode</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF]">{event.mode}</p>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">
              About the Event
            </h3>
            <p className="text-[#A3A3A3] text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Guidelines & Prizes Section */}
          <div className="space-y-4">

            {/* Prizes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#00A3FF]" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">Prizes & Rewards</h3>
              </div>
              {event.prizes && event.prizes.length > 0 ? (
                event.prizes.length === 1 ? (
                  /* Single winner — wide hero card */
                  <div className="flex items-center gap-5 p-5 rounded-xl bg-[#000000] border border-[#262626] relative overflow-hidden">
                    {/* Subtle left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A3FF] rounded-l-xl" />
                    <div className="ml-2 flex-shrink-0 w-12 h-12 rounded-full bg-[#001A29] border border-[#00A3FF]/40 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-[#00A3FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#00A3FF] uppercase tracking-widest font-semibold mb-0.5">{event.prizes[0].position}</p>
                      <p className="text-lg font-bold text-[#FFFFFF] leading-tight">{event.prizes[0].reward}</p>
                      {event.prizes[0].details && (
                        <p className="text-xs text-[#A3A3A3] mt-1">{event.prizes[0].details}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Multiple prizes — compact grid */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {event.prizes.map((prize, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#000000] border border-[#262626] text-center">
                        <p className="text-xs text-[#A3A3A3] mb-1 uppercase tracking-wider font-medium">{prize.position}</p>
                        <p className="text-base font-bold text-[#FFFFFF]">{prize.reward}</p>
                        {prize.details && <p className="text-[10px] text-[#A3A3A3] mt-1">{prize.details}</p>}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="p-4 rounded-lg bg-[#000000] border border-dashed border-[#404040]">
                  <p className="text-sm text-[#A3A3A3] italic">Prize details will be announced soon. Stay tuned!</p>
                </div>
              )}
            </div>

            {/*ELIGIBILITY*/}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LucideCheckCircle className="w-4 h-4 text-[#00A3FF]" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">Eligibility </h3>
              </div>
              {event.eligibility && event.eligibility.length > 0 ? (
                <ul className="space-y-2">
                  {event.eligibility.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00A3FF] flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 rounded-lg bg-[#000000] border border-dashed border-[#404040]">
                  <p className="text-sm text-[#A3A3A3] italic">Guidelines will be shared with registered participants before the event.</p>
                </div>
              )}
            </div>
            {/* Guidelines */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#00A3FF]" />
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">Rules & Guidelines</h3>
              </div>
              {event.guidelines && event.guidelines.length > 0 ? (
                <ul className="space-y-2">
                  {event.guidelines.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00A3FF] flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 rounded-lg bg-[#000000] border border-dashed border-[#404040]">
                  <p className="text-sm text-[#A3A3A3] italic">Guidelines will be shared with registered participants before the event.</p>
                </div>
              )}
            </div>


          </div>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider mb-3">
                Key Speakers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.speakers.map((speaker, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#000000] border border-[#262626]">
                    <p className="text-sm font-semibold text-[#FFFFFF]">{speaker.name}</p>
                    <p className="text-xs text-[#A3A3A3]">{speaker.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info notice */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/25 text-xs text-[#A3A3A3]">
              <Info className="w-3.5 h-3.5 text-[#00A3FF] flex-shrink-0" />
              <span>Further details will be directly shared to candidates after registration.</span>
            </div>
            <div className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#262626]/60 border border-[#333333] text-xs text-[#A3A3A3]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#00A3FF] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.62 5 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18z" /></svg>
              <span>For help or support contact:</span>
              <span className="text-[#FFFFFF] font-medium">Neel Agarwal</span>
              <span className="text-[#262626]">|</span>
              <span className="text-[#00A3FF] font-medium tracking-wide">9850175809</span>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#262626] bg-[#000000] flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] hover:bg-[#1A1A1A] text-[#FFFFFF] text-sm font-medium transition-colors"
          >
            Close
          </button>

          {event.status === 'Upcoming' && event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Register Now <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
