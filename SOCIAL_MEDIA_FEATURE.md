# Social Media Links Feature

## Overview
Dynamic social media icons in footer with admin management panel. Icons only display when links are provided.

## Features Implemented

### 1. Database Schema
- **Table**: `social_media_links`
- **Columns**: facebook, instagram, x, snapchat, linkedin, tiktok, youtube
- **Location**: `shared/schema.ts`

### 2. Backend API
- **Route**: `/api/v1/social-media`
- **Endpoints**:
  - `GET /api/v1/social-media` - Public endpoint to fetch links
  - `PUT /api/v1/social-media` - Admin-only endpoint to update links
- **File**: `server/routes/social-media.ts`

### 3. Frontend Components

#### Footer Component
- **File**: `client/src/components/layout/Footer.tsx`
- **Features**:
  - Fetches social media links from API
  - Displays icons only for provided links
  - Opens links in new tab with security attributes
  - Supports all 7 platforms with proper icons

#### Admin Settings Component
- **File**: `client/src/components/admin/SocialMediaSettings.tsx`
- **Features**:
  - Form to manage all social media links
  - URL validation
  - Real-time updates
  - Bilingual support (Arabic/English)

#### Settings Page Integration
- **File**: `client/src/pages/Settings.tsx`
- **Features**:
  - Social media settings visible only to admins
  - Integrated with existing settings page

## Supported Platforms
1. **Facebook** - Facebook icon
2. **Instagram** - Instagram icon
3. **X (Twitter)** - Twitter icon
4. **Snapchat** - Custom SVG icon
5. **LinkedIn** - LinkedIn icon
6. **TikTok** - Custom SVG icon
7. **YouTube** - YouTube icon

## Setup Instructions

### 1. Database Migration
The migration file has been generated. When you restart your server, the table will be created automatically.

Alternatively, run:
```bash
npm run db:migrate
```

### 2. Initialize Social Media Table
```bash
npm run db:seed-social-media
```

### 3. Start Development Server
```bash
npm run dev
```

## Usage

### For Admins
1. Navigate to **Settings** page (`/settings`)
2. Scroll to **Social Media Links** section (visible only to admins)
3. Enter URLs for desired platforms
4. Click **Save Changes**
5. Icons will appear in footer immediately

### For Users
- Social media icons appear in footer
- Only icons with links are displayed
- Clicking opens platform in new tab

## API Examples

### Get Social Media Links (Public)
```bash
GET /api/v1/social-media
```

Response:
```json
{
  "id": "uuid",
  "facebook": "https://facebook.com/aqarcity",
  "instagram": "https://instagram.com/aqarcity",
  "x": null,
  "snapchat": null,
  "linkedin": "https://linkedin.com/company/aqarcity",
  "tiktok": null,
  "youtube": "https://youtube.com/@aqarcity",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Social Media Links (Admin Only)
```bash
PUT /api/v1/social-media
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "facebook": "https://facebook.com/aqarcity",
  "instagram": "https://instagram.com/aqarcity",
  "x": "https://x.com/aqarcity",
  "snapchat": "",
  "linkedin": "https://linkedin.com/company/aqarcity",
  "tiktok": "https://tiktok.com/@aqarcity",
  "youtube": "https://youtube.com/@aqarcity"
}
```

## Technical Details

### Security
- Admin-only write access via `requireAdmin` middleware
- Public read access for footer display
- URL validation on frontend
- XSS protection with `rel="noopener noreferrer"`

### Performance
- React Query caching for API responses
- Single database row (no pagination needed)
- Conditional rendering (no icons if no links)

### Internationalization
- Full Arabic/English support
- RTL layout support
- Translated labels and placeholders

## Files Modified/Created

### Created
- `server/routes/social-media.ts` - API routes
- `client/src/components/admin/SocialMediaSettings.tsx` - Admin form
- `drizzle/seed-social-media.ts` - Seed script
- `drizzle/migrations/0014_greedy_lifeguard.sql` - Migration file

### Modified
- `shared/schema.ts` - Added socialMediaLinks table
- `server/index.ts` - Registered social media routes
- `client/src/components/layout/Footer.tsx` - Dynamic icons
- `client/src/pages/Settings.tsx` - Admin settings integration
- `package.json` - Added seed script

## Testing Checklist

### Database
- [x] Table created with correct schema
- [x] Migration generated successfully
- [x] Seed script initializes table

### Backend
- [x] GET endpoint returns data
- [x] PUT endpoint updates data (admin only)
- [x] Non-admin users cannot update
- [x] Null values handled correctly

### Frontend
- [x] Footer fetches and displays icons
- [x] Only provided links show icons
- [x] Admin form loads existing data
- [x] Admin form saves changes
- [x] Icons open in new tab
- [x] Bilingual support works

## Future Enhancements
- Add more platforms (WhatsApp Business, Telegram, etc.)
- Analytics tracking for social media clicks
- Custom icon upload support
- Platform-specific validation rules
- Bulk import/export functionality
