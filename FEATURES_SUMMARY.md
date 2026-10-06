# Collectly - Feature Summary

## Project Overview
Collectly is a full-stack SaaS platform for creating AI-powered forms, surveys, and quizzes. Built with React, Vite, TypeScript, and Supabase. Features drag-and-drop form building, multi-provider AI generation, conditional logic, quiz grading, analytics, and team collaboration.

---

## 1. CORE FORM BUILDER

### 30+ Field Types
- **Basic & Contact**: text, textarea, email, phone, url, date, time, datetime
- **Choice & Selection**: select, radio, checkbox, rating, scale, nps, ranking, matrix, slider
- **Advanced & Interactive**: signature, file, color, code, map, audio, video, terms, payment
- **Layout Controls**: section, page_break
- **Quiz Specific**: quiz_mcq, quiz_tf, quiz_matching, quiz_short, quiz_ordering, quiz_fill_blank

### Drag & Drop Interface
- Left palette with category-based field grouping
- Center canvas with live preview (desktop/tablet/mobile)
- Right inspector for field properties and conditional logic
- Field reordering via drag-and-drop or up/down arrows
- Page management with multi-page forms

### Conditional Logic
- **Actions**: show, hide, jump_to_page, calculate_score
- **Operators**: equals, not_equals, contains, not_contains, greater_than, less_than, is_empty, is_not_empty
- Live evaluation in preview mode
- Logic rules stored per field, evaluated on form submission

### Form Validation
- Required field checking
- Email/URL/phone format validation
- Custom regex validation patterns
- Number range (min/max) validation
- Slider range validation
- Logic-aware hidden field handling

### Multi-Page Forms
- Configurable page count
- Per-field page assignment
- Pagination navigation (Next/Previous)
- Smart field distribution across pages

---

## 2. AI FEATURES

### AI Form Generation
- Natural language prompt → complete form with fields, logic, and settings
- Multi-provider engine: Gemini → OpenRouter → Groq → Smart Local Fallback
- Free-tier models only (no paid API requirements)
- Configurable: category, tone, language, quiz mode, point values
- AI tone options: Professional, Friendly, Playful, Formal

### AI Provider Management
- API key storage in Supabase user_settings (per-user, RLS-protected)
- Preferred provider selection with automatic fallback chain
- Zero-downtime guarantee: if primary key fails, auto-falls back down the chain
- Key migration from env vars to Supabase on first load

### AI Question Improver
- Rephrase form questions for clarity and engagement
- AI-powered suggestion service with gemini fallback

### Sentiment Analysis
- Keyword-based sentiment detection (positive/neutral/negative)
- Simple word matching algorithm
- Confidence scoring

### Template AI Integration
- 140+ pre-built templates across 7 categories
- Template seeding to Supabase database
- One-click template instantiation with remapped logic refs

---

## 3. QUIZ & ASSESSMENT

### 8 Quiz Question Types
- **quiz_mcq**: Multiple choice (4 options, exactly one correct)
- **quiz_tf**: True/False with correctAnswer
- **quiz_short**: Short answer with correctAnswer string
- **quiz_matching**: Matching pairs (left ↔ right)
- **quiz_ordering**: Ordering/ranking fields in correct sequence
- **quiz_fill_blank**: Fill in the blank with correctAnswer
- **quiz_rating**: Star rating with points
- **quiz_scale**: Linear scale rating with points

### Anti-Cheat Proctoring
- Tab-switching detection with logging and warnings
- Copy/paste/right-click disabling during quizzes
- Violation tracking with audit trail
- Automatic flagging after 3+ tab switches or any copy attempts
- Violation tags persisted with response data

### Scoring & Grading
- Per-question point assignment
- Total score calculation with logic-based score adjustments
- Configurable pass percentage (default: 70%)
- Pass/fail determination based on threshold
- Score distribution analytics

### PDF Certificates
- Auto-generated certificates for quiz passers
- Customizable certificate title and design
- Recipient name, quiz title, score percentage, issue date
- Supabase storage with public URLs
- Print/download functionality

### Leaderboard & Feedback
- Real-time leaderboard top performers
- Immediate feedback upon submission
- configurable showing/hiding of leaderboard and feedback

---

## 4. TEMPLATES LIBRARY

### 140+ Pre-Built Templates
Categories and counts:
- **Feedback** (21): NPS surveys, product reviews, support checks
- **Quiz** (21): Topic-specific quizzes with AI-generated Q&A
- **Survey** (21): Employee engagement, market research, UX research
- **Registration** (21): Conferences, workshops, webinars, meetups
- **Lead Generation** (21): Product demos, free trials, consultations
- **Application** (21): Job applications, internships, scholarships, grants
- **General** (21): Contact us, quick polls, bookings, orders

### Template Features
- Category and search filtering
- Popularity and rating sorting
- Logic rule visualization
- Field count and point total display
- One-click form creation from template
- Supabase seeding for persistent storage

### Template Categories
- **Feedback**: CSAT, NPS, product feedback, support quality
- **Quiz**: Subject-specific knowledge assessments
- **Survey**: Demographic, satisfaction, and research surveys
- **Registration**: Events, conferences, workshops, meetups
- **Lead Gen**: Demos, trials, quotes, newsletter signups
- **Application**: Jobs, scholarships, admissions, rentals
- **General**: Contact, booking, ordering, feedback, suggestions

---

## 5. RESPONSES & ANALYTICS

### Response Management
- Real-time response tracking via Supabase subscriptions
- Team private notes per response
- Tag system (custom tags for categorization)
- Bulk actions: delete, tag, untag
- Duplicate detection across devices/browsers
- Response search within answers

### Analytics Dashboard
**KPI Cards:**
- Total responses, average time, pass rate, positive/negative/neutral split
- Flagged responses (tab-switch, copy-block indicators)

**Audience Analysis:**
- Device split (desktop/tablet/mobile/unknown)
- Geographic breakdown (top 8 countries)
- Browser & OS mix (last 12 responses)

**Funnel Analytics:**
- View → Start → Submit conversion tracking
- Custom trackable events (form_view, form_submit)
- Funnel chart visualization

**Question Analysis:**
- NPS score distribution (0-10 scale)
- Rating/Scale average scores
- Per-question choice distributions
- Correct answer highlighting for quiz questions

**Sentiment Analysis:**
- Sentiment split (positive/neutral/negative pie chart)
- Sentiment trend over time (line chart)
- Sentiment per response text analysis

**Quiz Performance:**
- Score distribution histogram (0-49, 50-69, 70-89, 90-100)
- Pass vs fail pie chart
- Average score tracking
- Time-spent analytics

**Export Options:**
- CSV export with all response data
- Excel export with formatted table
- PDF export with per-response detail
- JSON data export from Settings page

---

## 6. SETTINGS & USER MANAGEMENT

### Profile Management
- Full name, email, team name editing
- Avatar upload and Supabase storage
- Role-based access (Owner, Admin, Viewer)

### Notification Preferences
- Email notifications for new responses
- Push browser notifications for realtime updates
- Weekly analytics report subscription

### Security Settings
- Two-factor authentication flag
- Session timeout configuration (15min/30min/1hr/2hrs/Never)
- Change password functionality (with current password verification)
- Sign out all sessions

### Appearance Customization
- Theme mode: Light / Dark / System
- Global accent colors (primary + accent)
- 4 quick preset color pairs
- CSS variable injection for app-wide theming
- Persisted to Supabase user_settings

### Data & Privacy
- JSON export of all user data (profile, forms, responses, preferences)
- Account deletion (signs out all devices, reloads app)
- Supabase configuration check and migration

---

## 7. PUBLISHING & SHARING

### Public Form View
- Password-protected forms (owner-set password)
- Schedule start/end dates
- Response limits (max submissions)
- Countdown timer for closed forms
- CAPTCHA spam protection
- Timer countdown display

### Sharing Options
- Direct form link (`#/form/{id}`)
- QR code generation for public forms
- HTML embed snippet
- Form status states: draft, published, archived, closed

### Form Lifecycle
- Create, edit, duplicate, delete forms
- Publish/unpublish with version snapshots
- Form versioning in `form_versions` table
- Auto-snapshot on content edits (8s debounce, max 1/min)
- Restore previous form versions

### Respondent Experience
- Progressive disclosure (page navigation)
- Conditional field visibility (logic rules)
- Dynamic thank you messages based on quiz scores
- Certificate generation for quiz passers
- Confetti celebration on pass

---

## 8. DATABASE & SUPABASE INTEGRATION

### Core Tables
- **forms**: Form metadata, fields (JSON), settings (JSON), response counts
- **fields**: Individual form fields with type, options, logic rules
- **responses**: Submitted responses with answers, scores, sentiment, device info, tags, team notes
- **templates**: Pre-built template library (public, is_quiz, fields, settings)
- **certificates**: Generated certificates (response_id, recipient, PDF URL, score)
- **exports**: Export records (form_id, type, file_url, record_count, requested_by)
- **form_versions**: Historical form snapshots with change descriptions
- **user_settings**: Per-user settings (theme, aiConfig, notifications, branding)
- **profiles**: User profiles (full_name, team_name, role, avatar_url)
- **analytics_events**: Tracked events (form_view, form_submit with payload)

### Real-Time Subscriptions
- `forms:changes` - Form updates across clients
- `responses:{formId}` - New response arrivals
- Authentication state changes

### Form Versioning
- Auto-snapshot on content edits
- Version history restore capability
- Change description tracking
- Supabase `form_versions` table management

### AI Configuration
- Per-user AI API key storage
- Preferred provider persistence
- Bootstrap migration from env to Supabase

---

## 9. ADDITIONAL FEATURES

### Form Builder Enhancements
- Field drag-and-drop reordering
- Stable shuffle with seeded randomness
- Order list widget for ranking fields
- Matrix grid widget with radio-style selection
- Matching pairs widget for quiz_matching
- File upload with Supabase storage
- Color picker field
- Map location picker
- Audio recorder (browser MediaRecorder)
- Video embed (YouTube/Vimeo)
- Payment field (masked display, demo mode)

### Import/Export
- Template instantiation from AI prompts
- Template seeding to Supabase
- Response export (CSV, Excel, PDF)
- JSON data export from settings

### Accessibility
- Focus-visible outlines (3px accent color)
- Reduced motion preference respect
- Semantic HTML structure
- Keyboard-navigable interactions
- Screen reader compatible labels

### Internationalization
- Language option in AI generation
- Date/time formatting (locale-aware)
- Multi-language placeholder text

### Error Handling
- Supabase configuration gating (`isSupabaseConfigured`)
- Graceful fallbacks when Supabase unavailable
- User-friendly error messages
- Loading states and spinners throughout

### Performance
- Debounced auto-saves (5s interval)
- Memoized computations (analytics, logic evaluation)
- Pagination and virtual scrolling for large lists
- Interval cleanup on component unmount
- Session-scoped duplicate submission prevention

---