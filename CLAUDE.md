# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

### Tech Stack

- **Next.js 15.1.4** with App Router
- **React 19.0.0** with TypeScript 5
- **Tailwind CSS 3.4.1** for styling
- **No state management library** (React hooks only)
- **No external UI library** (custom components)

### Routing Structure

The app uses **Next.js App Router with route groups**:

- `(auth)/` - Authentication pages (no header/sidebar layout)
- `(main)/` - Main application with shared Header + Sidebar layout
- `onboarding/` - Multi-step onboarding flow (profile → join-room → schedule)

**Main app flow:**
1. Root (`/`) → redirects to `/login`
2. Login (mock Google OAuth) → `/onboarding/profile`
3. Onboarding: profile → join-room → schedule → `/dashboard`
4. Main app: dashboard, schedule, assign, result pages

### Data Layer (Mock API Pattern)

**Location:** `lib/api/client.ts` and `lib/api/mockData.ts`

The entire app runs on **simulated API calls** with mock data:

- `client.ts` exports async functions that return mock data with delays (500ms)
- Each function has JSDoc comments describing the future backend endpoint
- **Backend integration:** Replace mock returns with actual `fetch()` calls

**API Function Categories:**
- Authentication: `getCurrentUser()`, `logout()`, `getGoogleAuthUrl()`
- Profile: `updateProfile(data)`
- Room: `createRoom()`, `joinRoom()`, `getMyRoom()`, `getRoomMembers()`
- Schedule: `getMySchedule()`, `saveSchedule()`, `getAllSchedules()`
- Preferences: `getTasks()`, `getMyPreference()`, `savePreference()`
- Assignments: `getCurrentAssignments()`, `getAssignmentsByWeek()`, `getMyAssignments()`

**Mock Data Setup:**
- 5 mock users: 양희석, 이세용, 정준영, 조재현, 허주환
- Current user: 허주환 (user-5)
- 1 mock room: "301호" with code "ABC123"
- Pre-populated schedules and assignments for testing

### Component Organization

```
components/
├── ui/              # Reusable UI primitives (Button, Card, Input, Select, Modal)
├── layout/          # Header (hamburger menu), Sidebar (navigation)
├── auth/            # GoogleButton
├── dashboard/       # MonthlyCalendar, TimelineBar, FilterButtons, DailyTasks
├── schedule/        # ScheduleEditor, WeeklyGrid
└── assign/          # (future components)
```

**Component Design Pattern:**
- **Variant-based styling:** `<Button variant="primary|secondary|outline" />`
- **Composition over configuration:** Small, focused components
- **Props-based customization:** size, fullWidth, padding, shadow, etc.
- **TypeScript interfaces** for all props
- **Client components** marked with `'use client'`

### Type System

**Location:** `types/index.ts`

Core types: `User`, `Room`, `Task`, `Preference`, `Assignment`, `WeeklySchedule`

**Important constants:**
- `TASKS`: 5 household tasks with weights (bathroom: 9, trash: 7, room: 6, laundry: 4, dishes: 2)
- `DayOfWeek`: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
- `TimeSlot`: 'quiet' | 'out' | null (null = free time)
- `COUNTRIES`, `LANGUAGES`, `DAY_NAMES` for i18n support

## Important Conventions

### Week-based Assignment System

- **Week starts on Monday** (not Sunday)
- Assignments are keyed by `weekStart` date (YYYY-MM-DD format of Monday)
- Use helper functions: `getWeekStart(date)`, `getDayOfWeek(date)`
- Deadline for preference submission: **Next Sunday 23:59:59**

### File Organization

- Page components in `app/` directories (`page.tsx`)
- Shared layouts in `layout.tsx` files
- Reusable components in `components/`
- Business logic/data in `lib/`
- All TypeScript files use `.tsx` for components, `.ts` for utilities

### Naming Conventions

- **PascalCase** for components and types
- **camelCase** for functions and variables
- **SCREAMING_SNAKE_CASE** for constants
- File names match component names

### Data Fetching Pattern

Standard pattern in page components:

```typescript
'use client';

export default function MyPage() {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await apiFunction();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return <div>{/* render data */}</div>;
}
```

### Form Validation

- Client-side validation before submission
- Error state object: `{ fieldName?: string }`
- Display errors inline with form fields
- Simple `alert()` for success/error messages (no toast library yet)

### Styling Conventions

- **Tailwind CSS only** (no CSS modules or styled-components)
- Custom primary color palette (blue theme): `primary-50` to `primary-900`
- Common patterns:
  - Rounded corners: `rounded-lg`
  - Shadows: `shadow-sm`, `shadow-md`
  - Gradients: `bg-gradient-to-br from-primary-50 to-primary-100`
  - Responsive: Mobile-first approach with `md:`, `lg:` breakpoints

### Layout Pattern for Main App Pages

All pages in `(main)/` route group have fixed header (h-16):

```typescript
// Correct min-height accounting for fixed header
<div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
  {/* page content */}
</div>
```

### UI/UX Conventions

- **No task weights shown to users** (weights are internal only)
- **Emoji indicators:** 🚽 bathroom, 🗑️ trash, 🧹 room, 👔 laundry, 🍽️ dishes
- **Color coding for time slots:**
  - Purple: sleep
  - Red: busy
  - Blue: quiet
  - Green: task
  - Gray: free
- **Active menu item:** `bg-blue-50 text-blue-600 border-l-4 border-blue-600`
- **Selected date:** `border-2 border-primary-400`
- **Today's date:** `border-2 border-primary-500`

### Known TODOs

**Schedule Page (app/(main)/schedule/page.tsx):**
- Currently a placeholder with detailed TODO comments
- Needs to reuse `WeeklyGrid` component from onboarding
- Must adapt to main layout (with header/sidebar)
- Remove progress indicator, change to "주간 타임테이블 수정"
- Only show "저장" button (not "이전"/"다음")
- Navigate to `/dashboard` after save

## Project-Specific Notes

### Current Development Status

- **Phase 1 (Completed):** Login, Profile, Join-Room, Schedule onboarding pages
- **Phase 2 (In Progress):** Dashboard, Assign, Schedule, Result pages
- **Backend:** Not implemented yet (all API calls are mocked)

### Authentication Status

- Login page exists but **does not enforce authentication**
- Google OAuth is mocked (button redirects to onboarding)
- No protected routes or middleware yet
- Will need auth middleware when backend is connected

### Client vs Server Components

- Most components are **Client Components** (`'use client'`)
- Pages that need interactivity (state, effects, event handlers) use `'use client'`
- No Server Components pattern implemented yet
- Consider refactoring for SSR/RSC optimization later

### State Management

- **No global state library** (no Redux, Zustand, Jotai, etc.)
- Using local `useState` and props drilling
- For future: Consider adding state management if complexity grows

### Deployment

- Designed for **Vercel** deployment (Next.js native)
- Connect GitHub repo to Vercel for automatic deployments
- Build command: `npm run build`
- Output directory: `.next/` (default)
