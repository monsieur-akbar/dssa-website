# DSSA Student Hub - Opportunities Board

## Overview
The Opportunities Board is a comprehensive, interactive platform showcasing 30 curated opportunities for DSSA students:
- **10 Internships** (Data Science, AI/ML, Analytics roles)
- **10 Hackathons** (Local and national coding competitions)
- **10 Scholarships** (Government and institutional financial aid)

## Features Implemented

### 1. **Real-Time Search**
- Live filtering across title, organization, and tech stack tags
- Instant results with no page reload
- Case-insensitive matching

### 2. **Category Filtering**
- Four filter pills: All, Internship, Hackathon, Scholarship
- Dynamic counts showing opportunities per category
- Smooth visual transitions

### 3. **Deadline Urgency System**
- Automatic calculation of days remaining until deadline
- "Closing Soon" badge for opportunities within 7 days
- Visual urgency indicators (red badges)
- Based on current date: 2026-10-11

### 4. **Bookmark Persistence**
- Interactive bookmark button on each card
- Saved to browser `localStorage` as `dssa-hub-bookmarks`
- Dedicated "Your Bookmarks" section at bottom
- Survives page reloads and browser sessions

### 5. **Responsive Design**
- Mobile-first approach
- 1-column (mobile) → 2-column (tablet) → 3-column (desktop) grid
- Optimized touch targets for mobile
- Smooth hover states on desktop

### 6. **DSSA Design System Integration**
- Uses existing color tokens from `globals.css`
- Brand primary: `#00A3FF`
- Surface hierarchy: ground (`#000000`), panel (`#0D0D0D`), elevated (`#1A1A1A`)
- Border styles: subtle (`#262626`), strong (`#404040`)
- Text colors: primary (`#FFFFFF`), secondary (`#A3A3A3`), muted (`#737373`)

## File Structure

```
data/dssa-hub/
└── opportunitiesData.js         # Dataset with 30 opportunities

components/dssa-hub/
├── OpportunitiesPage.jsx        # Main interactive component
└── README.md                     # This documentation

app/hub/
└── page.jsx                      # Route wrapper with metadata
```

## Component Architecture

### `OpportunitiesPage.jsx`
**State Management:**
- `selectedCategory`: Active filter (All/Internship/Hackathon/Scholarship)
- `searchQuery`: User's search input
- `bookmarkedIds`: Array of bookmarked opportunity IDs

**Key Functions:**
- `calculateDaysUntil(deadline)`: Returns days remaining
- `isUrgent(deadline)`: Returns true if ≤7 days remaining
- `toggleBookmark(id)`: Adds/removes bookmark and syncs to localStorage
- `filteredOpportunities`: Memoized computation combining category + search filters

**Effects:**
- Load bookmarks from localStorage on mount
- Save bookmarks to localStorage on every change

### `opportunitiesData.js`
**Data Schema:**
```javascript
{
  id: "unique-id",              // Format: int-001, hack-001, schol-001
  title: "Opportunity Title",
  organization: "Organization Name",
  category: "Internship" | "Hackathon" | "Scholarship",
  tags: ["Python", "SQL", ...], // Tech stack or relevant keywords
  stipend: "Compensation details",
  deadline: "YYYY-MM-DD",        // ISO date format
  applyUrl: "https://...",       // Direct application link
  description: "Brief description"
}
```

## Usage

### Accessing the Board
Navigate to: `/hub`

### Search Examples
- **By title**: "Data Science Intern"
- **By organization**: "Barclays", "IIT Madras"
- **By tech stack**: "Python", "Machine Learning", "SQL"

### Filtering
1. Click category pills to filter by type
2. Search bar filters within selected category
3. Both filters work together (AND logic)

### Bookmarking
1. Click bookmark icon on any card
2. Bookmarked cards appear in dedicated section at bottom
3. Bookmarks persist across sessions via localStorage
4. Click again to remove bookmark

## Technical Details

### Performance Optimizations
- `useMemo` for expensive filtering operations
- Lazy loading of bookmark state from localStorage
- No re-renders on localStorage writes (handled in useEffect)

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive buttons
- Keyboard navigation support
- Clear focus states
- Color contrast meets WCAG AA standards

### Browser Compatibility
- Modern browsers with localStorage support
- Graceful degradation if localStorage unavailable
- React 19 compatible
- Next.js 16 App Router

## Future Enhancements (Part 2 & 3 Roadmap)

### Suggested Additions:
1. **Advanced Filters**: Stipend range, location, remote/in-person
2. **Sorting**: By deadline, stipend, alphabetical
3. **Export**: Download bookmarked opportunities as PDF/CSV
4. **Notifications**: Email alerts for closing deadlines
5. **User Profiles**: Save preferences and application history
6. **Admin Panel**: Add/edit/remove opportunities via UI
7. **Application Tracker**: Track application status
8. **Tags Cloud**: Visual representation of popular skills

## Development Notes

### Adding New Opportunities
1. Open `data/dssa-hub/opportunitiesData.js`
2. Add new object to array following schema
3. Use unique ID format: `int-XXX`, `hack-XXX`, `schol-XXX`
4. Ensure deadline is in `YYYY-MM-DD` format
5. Build will automatically include new data

### Customizing Urgency Threshold
In `OpportunitiesPage.jsx`, modify the `isUrgent` function:
```javascript
const isUrgent = (deadline) => {
  const daysUntil = calculateDaysUntil(deadline);
  return daysUntil >= 0 && daysUntil <= 7; // Change 7 to desired days
};
```

### Changing Current Date Reference
The component uses hardcoded date `2026-10-11` for deadline calculations:
```javascript
const today = new Date("2026-10-11"); // Update this line
```
For production, change to: `const today = new Date();`

## Testing Checklist

- [x] Build completes without errors
- [x] All 30 opportunities display correctly
- [x] Category filters work independently
- [x] Search filters by title, organization, tags
- [x] Bookmark persistence across page reloads
- [x] Urgent deadlines flagged correctly
- [x] External links open in new tabs
- [x] Responsive on mobile/tablet/desktop
- [x] Design system colors applied consistently
- [x] No console errors or warnings

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Development Server
```bash
npm run dev
# Visit: http://localhost:3000/hub
```

## Support & Maintenance

**Created**: October 11, 2026  
**Last Updated**: October 11, 2026  
**Component Version**: 1.0.0  
**Framework**: Next.js 16.4.0 (App Router)  
**React Version**: 19.3.0

For issues or enhancements, please coordinate with the DSSA development team.
