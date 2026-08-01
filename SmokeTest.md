# EduVoice — Manual Smoke Test Reference (Epic UI-8)

> This document is a **manual, run-without-AI** checklist for verifying the platform before handover.
> It complements the automated gates: `npm run build` (zero errors) and `php artisan test` (195 passed, 1333 assertions).
>
> Fill every `[ ]` box with `[x]` when the check passes. If something fails, note the page + browser console errors at the end.

---

## 1. Prerequisites (one-time setup)

```bash
# From the project root
composer install
npm install

# Fresh database + demo data
php artisan migrate:fresh --seed

# Serve the app (local storage for uploads)
php artisan storage:link
php artisan serve          # terminal 1 — http://127.0.0.1:8000
npm run dev                # terminal 2 — Vite dev server
```

Open http://127.0.0.1:8000 in a normal browser window (no incognito needed).

### Demo accounts (password is `password` for all)

| Role | Email | Name |
|------|-------|------|
| super_admin | `super@gmail.com` | Super Admin |
| institution_admin | `admin@gmail.com` | Admin Sharma |
| teacher | `ram@gmail.com` | Ram Pandey |
| teacher | `sita@gmail.com` | Sita Adhikari |
| student | `arun.gurung@student.edu` | Arun Gurung |
| student | `bina.rai@student.edu` | Bina Rai |

---

## 2. Automated gates (rerun before the manual pass)

```bash
npm run build
php artisan test
```

Expected: build finishes with `✓ built` and no errors; tests report **195 passed (1333 assertions)**.

- [ ] `npm run build` completes with zero errors
- [ ] `php artisan test` reports 195 passed / 1333 assertions

---

## 3. Design acceptance criteria (apply to EVERY page below)

The whole app must share one design language. When visiting any page, check:

- [ ] Primary action color is **indigo-600**; buttons are solid indigo, hover `indigo-700`
- [ ] Cards are **white (`bg-white`) with `rounded-xl` and `border-gray-200`**
- [ ] Icons are **Font Awesome** (`fa-*`), not lucide/material-symbols SVGs
- [ ] No leftover `rounded-2xl`, `rounded-3xl`, `bg-primary`, `text-on-surface`, `border-gray-200/60`
- [ ] Page background is gray-50/white; text is gray-900/700/500 hierarchy
- [ ] Empty states are present where lists can be empty ("No ... yet")

The **Welcome landing page is intentionally dark** (slate-950 background) — do not flag it as wrong.

---

## 4. Role-by-role walkthrough

### 4.1 Guest / Marketing (no login)

| # | Action | Expected | Pass |
|---|--------|----------|------|
| G1 | Visit `/` | Dark landing page renders; indigo glow orbs; no white-page / console errors | [ ] |
| G2 | Scroll to `#features`, `#community`, `#stats`, `#showcase` anchors | Sections render; role tabs switch Students/Teachers/Admins content | [ ] |
| G3 | Click "Get Started" / "Join the Community" | Goes to `/register` | [ ] |
| G4 | Click "Log in" / "Sign In" | Goes to `/login` | [ ] |
| G5 | Visit `/login` | Split-screen: indigo-900 branding left, white card right, rounded-xl card/inputs, solid indigo submit | [ ] |
| G6 | Login with wrong password | Inline error shown on the card | [ ] |
| G7 | Click "Forgot password?" | Goes to `/forgot-password`; card is rounded-xl on gray-50 | [ ] |
| G8 | Visit `/register` | Same split-screen layout; card + inputs token-aligned | [ ] |

### 4.2 Student — login as `arun.gurung@student.edu`

| # | Page (sidebar order) | Expected | Pass |
|---|----------------------|----------|------|
| S1 | `Dashboard` (`/student/dashboard`) | Renders; sidebar shows student menu only (Dashboard, My Subjects, Assignments, Resources, Announcements, Anonymous Q&A, Grievances, Talent Showcase, Mentorship, Profile) | [ ] |
| S2 | `My Subjects` (`/student/mysubject`) | Lists enrolled subjects only | [ ] |
| S3 | `Assignments` (`/assignments`) | White rounded-xl cards; student sees assignments for enrolled subjects | [ ] |
| S4 | `Resources` (`/resources`) | Cards with type badges; filter works | [ ] |
| S5 | `Announcements` (`/announcements`) | Cards with author/date; "New Announcement" button opens **modal** | [ ] |
| S6 | `Anonymous Q&A` (`/questions`) | Feed of questions; anonymous posts show adjective+animal name; "Ask Question" opens **modal**; vote buttons are FA icons | [ ] |
| S7 | Open a question (`/questions/{id}`) | Edit opens modal; answer form present; delete confirm modal works | [ ] |
| S8 | `Grievances` (`/grievances/feed`) | Feed + filters; "Submit" links to `/grievances/create` wizard; "Track" opens **modal** | [ ] |
| S9 | Grievance create wizard (3 steps) | Step 1 details → Step 2 description/evidence → Step 3 review → submit; anonymous toggle works | [ ] |
| S10 | `Talent Showcase` (`/talent-showcase`) | Project cards; "Add Project" form (student only) | [ ] |
| S11 | `Mentorship` (`/mentor-board`) | Open help requests + Top Mentors leaderboard | [ ] |
| S12 | `Profile` (`/profile`) | Update profile / password / delete forms, rounded-xl cards | [ ] |

### 4.3 Teacher — login as `ram@gmail.com`

| # | Page | Expected | Pass |
|---|------|----------|------|
| T1 | `Dashboard` (`/dashboard`) | Teacher dashboard; sidebar has My Classes + Teaching group | [ ] |
| T2 | `My Classes` (`/classes`) | Lists only subjects assigned to this teacher | [ ] |
| T3 | `Assignments` (`/assignments`) | "New Assignment" opens **modal** (title/desc/file/due); edit/delete work | [ ] |
| T4 | `Resources` (`/resources`) | "Add Resource" opens **modal** (subject select, type, file upload) | [ ] |
| T5 | `Announcements` (`/announcements`) | "New Announcement" opens **modal**; subject select shows taught subjects | [ ] |
| T6 | `Anonymous Q&A` (`/questions`) | Teacher sees questions for taught subjects; can answer | [ ] |
| T7 | `Grievances` (`/grievances/feed`) | Feed visible; teacher CANNOT see admin grievances panel | [ ] |
| T8 | `Talent Showcase` | Review form visible on project cards (teacher/admins only) | [ ] |
| T9 | `Mentorship` (`/mentor-board`) | Accept Request works | [ ] |

### 4.4 Institution Admin — login as `admin@gmail.com`

| # | Page | Expected | Pass |
|---|------|----------|------|
| A1 | `Dashboard` (`/admin`) | Admin dashboard | [ ] |
| A2 | `Students` (`/admin/enrollments`) | DataTable (search/sort); remove enrollment confirm modal works | [ ] |
| A3 | `Semesters` (`/admin/semesters`) | DataTable + create/edit pages | [ ] |
| A4 | `Subjects` (`/admin/subjects`) | DataTable; edit shows assigned teachers list + teacher select | [ ] |
| A5 | `Assignments` / `Resources` / `Announcements` | Institution-wide lists; modals open | [ ] |
| A6 | `Anonymous Q&A` (`/questions`) | Sees all institution questions | [ ] |
| A7 | `Grievances` (`/admin/grievances`) | Admin table (ref, status, priority, spam, votes); links to detail | [ ] |
| A8 | Grievance detail (`/admin/grievances/{id}`) | Status/priority/assign selects + resolution summary + events timeline | [ ] |
| A9 | `Moderation` (`/admin/moderation`) | Pending queue; hide/dismiss works | [ ] |
| A10 | `Talent Showcase` / `Mentorship` | Render; review form visible | [ ] |
| A11 | Try opening `/admin/institutions` | **Blocked** (403 / redirect) — not in admin's scope | [ ] |

### 4.5 Super Admin — login as `super@gmail.com`

| # | Page | Expected | Pass |
|---|------|----------|------|
| X1 | `Dashboard` (`/dashboard`) | Super admin dashboard; sidebar shows Tenant/Platform/Community/Support groups | [ ] |
| X2 | `Institutions` (`/admin/institutions`) | DataTable; "Add Institution" → `/admin/institutions/create` page | [ ] |
| X3 | `Institution Admins` (`/admin/institution_admins`) | Renders (under-construction card style is fine) | [ ] |
| X4 | `Users` (`/admin/users`) | DataTable + client-side role filter; role cards | [ ] |
| X5 | `Roles & Permissions` (`/admin/roles`) | Role badges + per-row role assign select | [ ] |
| X6 | `Analytics` / `Reports` / `Monitoring` / `User Activity` | DataTable / under-construction cards render without errors | [ ] |
| X7 | `Announcements` / `Anonymous Q&A` / `Talent Showcase` / `Mentorship` | Render; Q&A shows questions across ALL institutions | [ ] |
| X8 | `Grievances` (`/admin/grievances`) | All institutions' grievances | [ ] |
| X9 | `Moderation` (`/admin/moderation`) + `Spam Logs` (`/admin/spam-logs`) | Render with data | [ ] |
| X10 | `Profile` (`/profile`) | Update forms render | [ ] |

---

## 5. Feature deep-dive (functional, run as the stated role)

### 5.1 Anonymous Q&A (student)
- [ ] Post a question anonymously → author shows as adjective+animal, NOT real name
- [ ] Other students see the anonymous name; real identity is never shown
- [ ] Upvote/downvote a question and an answer (FA heart/thumbs); count updates
- [ ] Mark an answer as accepted (teacher role) — badge appears
- [ ] Edit own question via modal; delete via confirm modal

### 5.2 Grievances (student + institution_admin)
- [ ] Submit a grievance through the 3-step wizard (add photo/video evidence)
- [ ] Track modal shows live status
- [ ] Admin detail page: change status → event added to timeline
- [ ] Admin: assign to staff, set admin priority, add resolution summary when resolved
- [ ] Anonymity: comments/reactions on a grievance never reveal the submitter

### 5.3 Assignments (teacher + student)
- [ ] Teacher: create assignment via modal, upload attachment, set due date
- [ ] Student: view assignment, submit work with file
- [ ] Teacher: grade submission with score + feedback

### 5.4 Resources & Announcements (teacher)
- [ ] Create resource via modal with file upload; appears in student list
- [ ] Create announcement via modal; appears for enrolled students only

### 5.5 Auth flows
- [ ] Register → lands on a dashboard
- [ ] Logout → back to `/login`
- [ ] `forgot-password` → submit email → status message shown

---

## 6. Responsive / browser checks (pick any 3 pages)

- [ ] Resize to mobile width (<640px) → sidebar collapses to hamburger; mobile menu opens/closes
- [ ] Modals (e.g. QuestionFormModal, TrackGrievanceModal) scroll internally and close on Escape + overlay click
- [ ] Tables (Admin Grievances, Users, Enrollments) are readable on mobile (overflow/scroll)
- [ ] Test in both Chrome and Firefox; open DevTools console and confirm **no red errors** on the pages visited above

---

## 7. Known / deferred items (do NOT fail on these)

- Marketing copy still says **"GMC Backbenchers"**; in-app branding is **"EduVoice"** — rebranding deferred (copy-only change).
- `Welcome.jsx` is intentionally dark — excluded from the light design acceptance criteria.
- `Admin/Analytics`, `InstitutionAdmins`, `Monitoring`, `Reports` are under-construction styled cards (accepted).
- Cypress E2E (`cypress/e2e/basic.cy.js`, `grievance.cy.js`) exist but Cypress is not yet installed — the manual pass above is the current gate.

---

## 8. Failure log

| Date | Role | Page/Step | What failed | Console errors | Fixed? |
|------|------|-----------|-------------|----------------|--------|
|      |      |           |             |                |        |
