# Aqar City UAE - Comprehensive Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from premium real estate platforms (Airbnb, Property Finder, Bayut) combined with modern luxury aesthetics suitable for UAE market. The design emphasizes **trust, sophistication, and cinematic visual storytelling** for high-value property investments.

## Core Brand Identity

### Color System
**Light Mode:**
- Primary: 11 61% 15% (Deep Forest Green #0b3d2e) - Headers, CTAs, navigation
- Secondary: 0 0% 100% (Pure White) - Backgrounds, cards
- Accent: 43 71% 53% (Gold #d4af37) - Premium highlights, badges, hover states
- Neutrals: 0 0% 15% (text), 0 0% 45% (secondary text), 0 0% 95% (borders)

**Dark Mode:**
- Background: 11 30% 8% (Dark green-tinted)
- Card surfaces: 11 20% 12%
- Text: 0 0% 95%
- Accent remains: 43 71% 53%

### Typography
- **Primary Font**: Inter (Google Fonts) - Clean, modern, excellent for bilingual support
- **Arabic Font**: Cairo or Tajawal - Professional, readable for RTL
- Hierarchy: 
  - Hero Headlines: 4xl-6xl (bold 700)
  - Section Titles: 3xl-4xl (semibold 600)
  - Body: base-lg (regular 400)
  - Labels: sm-base (medium 500)

### Layout System
**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (Tailwind: p-4, p-6, p-8, py-12, py-16, py-24)
- Container: max-w-7xl for full sections, max-w-6xl for content
- Grid: 12-column responsive grid system
- Vertical rhythm: py-16 to py-24 for desktop sections, py-12 for mobile

## Component Library

### Navigation
- Sticky header with glass morphism effect on scroll (backdrop-blur)
- Logo left, navigation center, language switcher + user menu right
- Mobile: Hamburger with slide-in drawer supporting RTL/LTR
- Bilingual toggle with flag icons (AR/EN)

### Property Cards
- Elevated cards with shadow-lg and hover:shadow-2xl transition
- Image aspect ratio: 4:3 with overlay gradient for price/status badges
- Gold "Featured" ribbon for premium listings
- Quick actions: Heart (favorite), Share, Compare icons
- RTL/LTR aware flex layouts

### Hero Sections
- **Home Hero**: Full-bleed cinematic background with property imagery, gradient overlay (green to transparent)
- Smart search bar: Elevated glass card with location, type, price range filters
- Height: 85vh with centered content
- CTA: Gold accent button "Start Your Investment" with arrow icon

### Forms & Inputs
- Consistent rounded-lg borders with focus:ring-2 ring-accent
- Dark mode: bg-neutral-800 with light borders
- Labels: Floating labels or top-aligned with proper RTL support
- WhatsApp CTA: Green button with icon positioned prominently

### Chat Bot Widget
- Fixed bottom-right (bottom-left for RTL) circular button with pulse animation
- Gold accent color for bot icon
- Popup chat: 400px width, elevated shadow, rounded corners
- Real-time typing indicators and delivery status

### Data Visualization
- Investment charts: Use Chart.js with green-gold gradient fills
- Property comparison: Side-by-side cards with highlight rows
- Analytics dashboard: Grid of stat cards with icons and trend indicators

## Page-Specific Design

### Home Page
1. **Hero**: Cinematic property image, search bar, trust badges
2. **Featured Properties**: 3-column grid (2 on tablet, 1 on mobile)
3. **Interactive Map**: Full-width section with filtering sidebar
4. **Why Choose Us**: 4-column icon features with benefits
5. **Testimonials**: Carousel with client photos and reviews
6. **Latest Blog**: 3-column article cards
7. **CTA Section**: Gold accent background with contact form

### Property Details
- **Image Gallery**: Large hero image with thumbnail strip below
- **Sticky Sidebar**: Price, mortgage calculator, agent card, schedule visit
- **Specs Grid**: 2-column with icons (beds, baths, sqft, year)
- **360° Tour**: Embedded iframe with full-screen option
- **Related Properties**: Horizontal scroll carousel

### Search & Filters
- Left sidebar (right for RTL): Collapsible filter groups
- Main area: Grid view / List view toggle, sort dropdown
- Live results counter with "properties found" label
- Map/List split view option

### Admin Dashboard
- Sidebar navigation: Collapsible with icons and labels
- Top metrics cards: Revenue, listings, leads, views
- Data tables: Sortable, filterable with action menus
- Property management: Drag-and-drop image upload, rich text editor

## Bilingual & RTL Support
- CSS: `dir="rtl"` attribute swaps all positioning
- Typography: Increased line-height for Arabic (1.8 vs 1.6)
- Icons: Mirror directional icons (arrows, chevrons)
- Forms: Right-align labels and inputs for RTL
- Navigation: Reverse flex order for RTL

## Images & Media
**Required Images:**
1. **Hero Backgrounds**: Luxury Dubai properties (Burj Khalifa views, Palm Jumeirah villas)
2. **Property Listings**: High-resolution exterior/interior shots (16:9 or 4:3)
3. **Team/Agent Photos**: Professional headshots with consistent lighting
4. **Trust Badges**: Partner logos (banks, developers, certifications)
5. **City Icons**: Dubai, Abu Dhabi, Sharjah landmarks for location filters

Use Unsplash/Pexels for placeholder images with keywords: "dubai real estate", "luxury villa UAE", "modern apartment interior"

## Animations & Interactions
- Hover transitions: 300ms ease for cards, buttons
- Page transitions: Fade 200ms for route changes
- Scroll reveals: Fade-up on viewport entry (use Intersection Observer)
- Loading states: Skeleton screens for property cards, shimmer effect
- **Minimal use**: Avoid excessive parallax or complex animations

## Accessibility & PWA
- WCAG AA compliant contrast ratios (verified for all color combinations)
- Focus indicators: 2px accent color ring
- Skip to content link for keyboard users
- PWA manifest: Green theme color, property icon
- Offline page: Branded message with cached content access

## Mobile-First Optimizations
- Touch targets: Minimum 44px for buttons/links
- Bottom navigation: Fixed tab bar for key actions (Search, Favorites, Profile, Menu)
- Swipeable galleries and carousels
- Collapsible sections for long property specs
- WhatsApp floating button: 60px with shadow for easy thumb access

This design system creates a **premium, trustworthy, and highly functional** real estate platform that balances visual impact with information density, optimized for the UAE market's luxury property segment.