'use client';

import React from 'react';
import { X, Calendar, Clock, MapPin, Users, ExternalLink, Info } from 'lucide-react';

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

          {/* Tags & Topics */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider mb-3">
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#000000] border border-[#262626] text-[#A3A3A3] text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

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

          {/* Prerequisites / Requirements */}
          <div className="p-4 rounded-xl bg-[#000000] border border-[#262626] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00A3FF] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#A3A3A3] leading-normal">
              <span className="font-semibold text-[#FFFFFF] block mb-0.5">Participation Guidelines</span>
              Ensure you have the necessary prerequisites installed. Event details will be shared directly with registered participants.
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
