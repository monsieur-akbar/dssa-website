const fs = require('fs');
const filePath = 'C:/Users/gicsc/.gemini/antigravity/scratch/dssa-website/app/events/page.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `// Sample Data Structure
const FLAGSHIP_BOOTCAMP = {
    id: 'dssa-fest-2026',
    title: 'DSSA Fest 2026',
    tag: 'Flagship Event',
    date: 'October 13 - 14, 2026',
    time: '10:00 AM Onwards',
    venue: 'Main Campus',
    capacity: '300 Seats',
    registeredCount: 85,
    isUpcoming: true,
    category: 'Event',
    description: \`Join us for our two-day extravaganza! Day 1 is dedicated to a vibrant cultural celebration, and Day 2 kicks off our intense Hackathon.\`,
    days: [
        {
            day: 'Day 1',
            date: 'Oct 13',
            title: 'Cultural Event',
            desc: 'A grand celebration featuring music, arts, and cultural performances by students. (Information only, no registration required).',
            topics: ['Music', 'Arts', 'Performances'],
            badge: 'Open to All',
        },
        {
            day: 'Day 2',
            date: 'Oct 14',
            title: 'Annual Hackathon',
            desc: 'A 24-hour hackathon where teams compete to build innovative solutions. Register now to secure your spot!',
            topics: ['Coding', 'Innovation', 'Prizes'],
            badge: 'Registration Open',
        }
    ],
};

const UPCOMING_EVENTS = [];
const PAST_EVENTS = [];

export default function EventsPage() {`;

const startIndex = content.indexOf('// Sample Data Structure');
const endIndex = content.indexOf('export default function EventsPage() {');
if(startIndex !== -1 && endIndex !== -1) {
    const endStrLength = 'export default function EventsPage() {'.length;
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex + endStrLength);
    fs.writeFileSync(filePath, content);
    console.log('Successfully updated events page.');
} else {
    console.log('Failed to find start or end index.');
}
