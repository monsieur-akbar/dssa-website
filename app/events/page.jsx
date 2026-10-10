'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import eventsData from '@/data/events.json';
import EventModal from '@/components/EventModal';

export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    // Derived data
    const upcomingEvents = eventsData.filter(e => e.status !== 'Completed');
    const pastEvents = eventsData.filter(e => e.status === 'Completed');

    const filteredPastEvents = pastEvents.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              e.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || e.category === filter;
        return matchesSearch && matchesFilter;
    });

    const categories = ['All', ...Array.from(new Set(pastEvents.map(e => e.category)))];

    return (
        <div className="min-h-screen bg-[#000000] text-[#FFFFFF] pb-24">
            {/* Header */}
            <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b border-[#262626]">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Events <span className="text-[#A3A3A3]">& Workshops</span></h1>
                <p className="text-[#A3A3A3] max-w-2xl text-lg">
                    Discover upcoming hackathons, bootcamps, and technical sessions hosted by DSSA.
                </p>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A3FF]" />
                    <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="flex flex-col rounded-xl border border-[#262626] bg-[#0D0D0D] overflow-hidden group hover:border-[#404040] transition-colors">
                            <div className="h-48 overflow-hidden relative border-b border-[#262626]">
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" 
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-[#000000] border border-[#262626] text-xs font-medium rounded-full text-[#FFFFFF]">
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#00A3FF] transition-colors">{event.title}</h3>
                                <p className="text-[#A3A3A3] text-sm mb-6 line-clamp-3">{event.description}</p>
                                
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
                                    <button 
                                        onClick={() => openModal(event)}
                                        className="flex-1 py-2.5 rounded-lg border border-[#262626] bg-[#000000] hover:bg-[#1A1A1A] text-sm font-medium transition-colors"
                                    >
                                        Details
                                    </button>
                                    <a 
                                        href={event.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                    <div className="p-12 text-center border border-[#262626] rounded-xl bg-[#0D0D0D]">
                        <p className="text-[#A3A3A3]">No upcoming events at the moment. Stay tuned!</p>
                    </div>
                )}
            </section>

            {/* Past Events Section */}
            <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#262626]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-2xl font-bold tracking-tight">Past Events Archive</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Search events..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-[#0D0D0D] border border-[#262626] rounded-lg text-sm text-[#FFFFFF] placeholder-[#A3A3A3] focus:outline-none focus:border-[#404040]"
                            />
                        </div>
                        <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-none">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                                        filter === cat 
                                        ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                                        : 'bg-[#000000] text-[#A3A3A3] border-[#262626] hover:bg-[#0D0D0D]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPastEvents.map(event => (
                        <div key={event.id} className="flex flex-col rounded-xl border border-[#262626] bg-[#000000] hover:bg-[#0D0D0D] overflow-hidden group transition-colors">
                            <div className="h-32 overflow-hidden border-b border-[#262626]">
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300 grayscale" 
                                />
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs text-[#00A3FF] font-medium">{event.date}</span>
                                    <span className="px-2 py-0.5 border border-[#262626] rounded text-[10px] text-[#A3A3A3] uppercase tracking-wider">{event.category}</span>
                                </div>
                                <h3 className="text-base font-bold mb-2 group-hover:text-[#00A3FF] transition-colors line-clamp-2">{event.title}</h3>
                                <p className="text-xs text-[#A3A3A3] line-clamp-2 mb-4 mt-auto">{event.description}</p>
                                <button 
                                    onClick={() => openModal(event)}
                                    className="text-xs font-semibold text-[#FFFFFF] flex items-center gap-2 group-hover:text-[#00A3FF] transition-colors"
                                >
                                    View Details <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredPastEvents.length === 0 && (
                    <div className="p-12 text-center border border-[#262626] rounded-xl bg-[#000000]">
                        <p className="text-[#A3A3A3]">No past events match your search.</p>
                    </div>
                )}
            </section>

            {/* Modal */}
            <EventModal 
                isOpen={isModalOpen} 
                event={selectedEvent} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}
