## E-Learning Platform — Foundation Build

A mobile-first, premium e-learning web app with a soft pastel + purple design system, built fully on mock data with a centralized API layer ready for real backend integration later.

### Design System (locked)

- **Background:** `bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50` (soft pastel mesh)
- **Cards & sidebar:** pure `bg-white`, `rounded-3xl`, soft diffused shadow (`shadow-sm` / custom soft shadow). Not transparent.
- **Primary:** soft vibrant purple (`#A855F7` / `purple-500`). Active sidebar tab, buttons, progress bars use `bg-gradient-to-r from-purple-500 to-purple-400`.
- **Text:** `text-slate-800` for headings, `text-slate-500` for secondary. Never pure black.
- **Stat icons:** circular soft tinted backgrounds (e.g. `bg-purple-100 text-purple-600`, `bg-teal-100 text-teal-600`, `bg-pink-100 text-pink-600`, `bg-amber-100 text-amber-600`).
- **Spacing:** generous `p-6`/`p-8` inside cards.
- **Fonts:** Poppins (headings) + Inter (body), loaded via Google Fonts.
- **Motion:** Framer Motion for entrance fades, card stagger, progress bar fills, checkbox strike-through, modal scale-in.
- **Icons:** Lucide React throughout.

### Screens & Routes

1. **`/` — Public Landing**
   - Hero: headline, sub-copy, "Get Started" CTA, decorative mesh blobs.
   - Feature highlights row (3–4 cards with tinted icons).
   - Footer with brand mark + "Login" CTA in header that opens the login modal.

2. **Login Modal (global)**
   - Step 1: phone number input (10 digits, +91 prefix), "Send OTP" button.
   - Step 2: 6-digit OTP input (auto-advance boxes), "Verify" button, resend timer.
   - Mock: any 6 digits succeed after a 1.2s simulated delay.
   - On success → routes to `/checkout`.

3. **`/checkout` — Plan Selection & Payment**
   - Left/main: class selector grid (Class 1 → Class 12) as pill cards; selected card highlighted in purple gradient.
   - Right panel (sticky on desktop, stacked on mobile):
     - Order summary (selected class, plan name, base price)
     - "Apply Coupon" input with animated validation (shake on invalid, green check on valid — `STUDENT10` = 10% off)
     - Subtotal, discount, total
     - "Pay & Continue" CTA → simulates 1.5s payment → routes to `/dashboard`
   - Pricing scales by class (e.g. ₹1,499 for 1–5, ₹2,499 for 6–10, ₹3,499 for 11–12).

4. **`/dashboard` — Student Hub (3-column desktop, stacked mobile with bottom nav)**

   **Left Sidebar (20%, collapsible)**
   Nav: Dashboard, Subjects (expandable → chapters), Tests, AI Doubt Solver, Report Card, Leaderboard, Profile. Active item gets purple gradient pill.

   **Main Center (55%)**
   - Header: "Welcome back, Aarav 👋" + "Class 10" badge.
   - Hero Progress Card: animated dual progress bar — "You: 450 XP" vs "Top: 600 XP" with avatars.
   - Quick Stats Row: 3 cards (Total XP, Today's Watch Time, Lessons Completed) each with a circular tinted icon.
   - Subjects Grid: 6 subject cards (Math, Science, English, Social Studies, Hindi, Computer) — each with subject icon, name, % progress bar. Cards are clickable (route placeholder for next phase).

   **Right Panel (25%)**
   - Today's Progress: circular ring (animated fill) with % daily tasks complete.
   - Arena Ranking: top 5 leaderboard with avatars + XP, divider, then "You — Rank 14" highlighted row.
   - Daily Goals: 3 checklist items with custom checkbox; on tick, animated strike-through + confetti pulse.

   **Mobile Bottom Nav:** 5 icons (Home, Subjects, Tests, Arena, Profile) — fixed, white card with soft shadow, active icon in purple.

### Mock API Architecture

Single file `src/services/apiClient.ts` exports typed async functions:

- `sendOtp(phone)`, `verifyOtp(phone, otp)`
- `getClasses()`, `getPlanForClass(classId)`, `applyCoupon(code, amount)`, `processPayment(payload)`
- `getDashboard(userId)` returning `{ user, heroProgress, quickStats, subjects, todayProgress, leaderboard, dailyGoals }`
- `toggleDailyGoal(goalId)`

Each function:
- Returns a `Promise` resolved via `setTimeout` (1000–1800ms) to exercise loading states.
- Wrapped with a distinct multi-line comment block:
  ```
  // ============================================================
  // TODO: 🚧 REAL API INTEGRATION HERE
  // Step 1: Replace mock body with: const res = await fetch(...)
  // Step 2: const data = await res.json();
  // Step 3: handle non-2xx → throw new ApiError(...)
  // Step 4: return data;
  // Real code (uncomment when backend is ready):
  // const res = await fetch(`${BASE_URL}/dashboard/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  // ...
  // ============================================================
  ```

Loading states surface as skeleton shimmer cards (matching card shape) on dashboard, spinner on buttons during OTP/payment.

### Component Architecture

```
src/
  routes/
    __root.tsx              shell + global modal portal
    index.tsx               landing
    checkout.tsx            class + payment
    dashboard.tsx           3-column hub
  components/
    ui/                     existing shadcn primitives
    landing/Hero.tsx, FeatureGrid.tsx
    auth/LoginModal.tsx, OtpInput.tsx
    checkout/ClassGrid.tsx, OrderSummary.tsx, CouponInput.tsx
    dashboard/Sidebar.tsx, BottomNav.tsx, HeroProgressCard.tsx,
              QuickStats.tsx, SubjectsGrid.tsx, TodayProgressRing.tsx,
              ArenaRanking.tsx, DailyGoals.tsx, DashboardSkeleton.tsx
    shared/SoftCard.tsx, GradientButton.tsx, StatIcon.tsx
  services/apiClient.ts
  lib/mockData.ts            (consumed only by apiClient)
  hooks/useAuth.ts            (mock; localStorage flag)
  styles.css                  Tailwind v4 theme tokens + Poppins/Inter import
```

### Technical Notes

- TanStack Start file-based routing under `src/routes/`. Each page sets its own `head()` meta.
- Tailwind v4 theme tokens in `src/styles.css` — register Poppins/Inter via `@import url(...)` and expose `--font-display` / `--font-sans`.
- Auth gate: `useAuth` reads a `lovable_mock_user` localStorage entry; `/checkout` and `/dashboard` redirect to `/` if absent and trigger login modal.
- Framer Motion variants centralized in `src/lib/motion.ts` for reuse.
- All interactive elements have hover + tap states (subtle scale 1.02 / 0.98).

### Out of Scope (Phase 2 — you'll direct after this lands)

Subject → Chapter → Lesson player, Tests/quiz UI, AI Doubt Solver chat, Report Card, full Leaderboard page, Profile page. The sidebar nav links to these will be present but route to a friendly "Coming soon" placeholder for now.

### Deliverable

A polished, animated, responsive foundation — landing, login (OTP modal), checkout, and the full dashboard — running on mock data with clearly marked TODO blocks at every API call site so swapping to a real backend is a copy-paste job.