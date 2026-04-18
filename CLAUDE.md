@AGENTS.md

# Running Plan App — Developer Reference

## What This App Does

AI-powered 5K training plan generator. Users input their age, activity level, days per week, plan duration, and any injuries. The app calls Claude via the Anthropic API and returns a structured week-by-week running plan. Admins can edit the coaching guidelines that shape Claude's output.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI | React 19.2.4 |
| Language | TypeScript 5.9.3 (strict mode) |
| Styling | Tailwind CSS 4.2.2 (PostCSS) |
| AI | Anthropic SDK 0.90.0 — Claude Sonnet 4.6 |
| Runtime | Node.js via Next.js |

No UI component library. No external state management. No database — guidelines persist to a flat file (`data/guidelines.txt`, git-ignored).

---

## Project Structure

```
app/
  page.tsx                  — Home page: form + plan display
  layout.tsx                — Root layout with header and admin nav link
  globals.css               — Tailwind v4 imports + CSS variables
  admin/page.tsx            — Coaching guidelines editor
  api/
    generate-plan/route.ts  — POST: calls Claude to generate a plan
    guidelines/route.ts     — GET/POST: read and write guidelines file
components/
  RunnerForm.tsx            — User input form (age, activity, days, duration, injuries)
  RunningPlan.tsx           — Renders parsed JSON plan week-by-week
lib/
  guidelines.ts             — File I/O for coaching guidelines
data/                       — Runtime-generated, git-ignored
  guidelines.txt            — Persisted coaching guidelines
```

---

## Getting Started

1. Install dependencies: `npm install`
2. Create `.env.local` with:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. Run dev server: `npm run dev` → http://localhost:3000
4. Admin panel: http://localhost:3000/admin

**Other commands:**
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint

---

## Key Architecture Decisions

**Data flow:**
1. `RunnerForm` collects user input → POST `/api/generate-plan`
2. API route combines coaching guidelines + user data into a Claude prompt
3. Claude returns a JSON plan (with a plain-text fallback if parsing fails)
4. `RunningPlan` renders the parsed plan week-by-week

**Prompt caching:** The API route uses Anthropic's ephemeral cache control on the system prompt (coaching guidelines). This reduces latency and cost on repeated calls with the same guidelines.

**Guidelines storage:** Flat file at `data/guidelines.txt`. Simple and zero-dependency. Not appropriate for multi-instance deployments — would need a DB or shared volume.

**No user accounts:** Plans are generated in-session only. Nothing is stored per user.

---

## What's Been Built

- Home page with form and rendered plan output
- Week-by-week plan display with color-coded session types (Rest / Walk / Walk-Run / Easy Run / Cross-Train / Strength)
- Collapsible week sections
- Coaching tips panel
- Plain-text fallback if Claude returns non-JSON
- Admin page to view and edit coaching guidelines
- API route for plan generation with prompt caching
- API route for reading/writing guidelines
- Error and loading states throughout

---

## What's Not Built Yet (Known Gaps)

- **Plan persistence** — generated plans vanish on page refresh; no user history
- **Authentication** — admin page is publicly accessible
- **PDF / print export** — no export options
- **Backend input validation** — only HTML-level form validation; API trusts client input
- **Retry logic** — no automatic retry on Claude API errors
- **Multi-instance guidelines** — flat file won't work across multiple server instances

---

## Conventions

- Components use `"use client"` directive where interactivity is needed
- All components and props are explicitly typed with TypeScript interfaces
- Components: PascalCase filenames. Utilities: camelCase.
- API error responses: `{ error: "message" }`. Success: varies per route.
- Color scheme: gray-50 → gray-900 base, green (`#059669`) for accents
- Consistent rounded-lg / rounded-xl corners, Tailwind spacing scale throughout

---

## Important Notes for Future Developers

- **Next.js version:** This is Next.js 16, which has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing new routes or server components — APIs and conventions may differ from training data.
- **Tailwind v4:** Uses the new `@import "tailwindcss"` syntax (not `@tailwind base/components/utilities`). Config is via PostCSS, not `tailwind.config.js`.
- **Claude model:** Currently hardcoded to `claude-sonnet-4-6`. To change, update `app/api/generate-plan/route.ts`.
- **`data/` directory:** Created at runtime by the guidelines API. It's git-ignored. On a fresh clone the directory won't exist until the admin page is visited or guidelines are fetched.
