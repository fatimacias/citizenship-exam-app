# Citizenship Exam Study App

A free, mobile-friendly web app to study for the USCIS naturalization **civics test**, with
support for all three official question sets and four progressively harder study modes.
Everything runs in the browser — there is no backend, no login, and no tracking. Your
progress is saved locally in `localStorage` on the device you study from.

## Features (v1)

- **Three official USCIS question sets**, selectable from the home screen:
  - **2025 version** — 128 questions (current list for Form N-400 filed on/after Oct 20,
    2025). The real interview asks up to 20 of these; 12/20 correct passes.
  - **2008 version** — the previous 100-question list.
  - **65/20 special mode** — the 20-question subset USCIS designates for applicants who
    are 65+ and have been a lawful permanent resident for 20+ years; 6/10 correct passes.
    This mode re-uses the same question records as the 2025 list (filtered, not duplicated)
    so there's a single source of truth for the content.
- **Four study levels**, picked freely in any order (no forced unlock sequence):
  - **Level 0 — Flashcards**: flip-style cards for pure memorization, no scoring.
  - **Level 1 — Multiple choice**: pick the right answer from a few options.
  - **Level 2 — Matching**: click-to-match questions and answers in small batches.
  - **Level 3 — Write the answer**: free-text input with lenient fuzzy matching
    (case/accent/punctuation-insensitive, tolerant of small typos, and accepts any one of
    several valid answers for questions like "who is one of your state's senators").
- **Per-session progress tracking** in `localStorage`, per exam version and level: correct
  / incorrect counts, current streak, and a running list of missed questions you can review
  from the level-picker screen.
- **English practice module** — intentionally kept separate from the civics content. v1
  ships a simple "more content coming soon" landing page with a couple of sample
  vocabulary cards, so the route/structure exists to expand later without reshaping the
  civics app.

## Tech stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [react-router-dom](https://reactrouter.com/) for client-side routing
- Plain CSS (mobile-first, CSS variables, a light dark-mode media query) — no UI
  component library
- No backend, no database, no auth — all state lives in the browser

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev      # start the local dev server (prints the local URL)
```

### Build for production

```bash
npm run build    # type-checks with tsc, then builds a static bundle into dist/
npm run preview  # optional: serve the production build locally to sanity-check it
```

`npm run build` produces a standard static Vite build (`dist/`) with no server-side code,
so it deploys cleanly to any static host.

## Deploying to Vercel

This repo is ready to deploy on Vercel's free tier with zero extra configuration:

- **Framework preset**: Vite (auto-detected)
- **Build command**: `npm run build`
- **Output directory**: `dist`

A minimal `vercel.json` is included with a catch-all rewrite to `index.html`. This is
required because the app uses client-side routing (`react-router-dom`'s `BrowserRouter`);
without it, a hard refresh or direct link to a route like `/study/2025/level1` would 404
on Vercel.

## Project structure

```
src/
  types.ts           # Core domain types (CivicsQuestion, ExamVersion, StudyLevel, progress, ...)
  data/
    questions100.ts  # Official 2008 100-question list
    questions128.ts  # Official 2025 128-question list (includes the 65/20 subset flag)
    index.ts         # Data access helpers (getQuestionsForVersion, getQuestionById, labels)
  hooks/
    useProgress.ts   # localStorage-backed per-version/per-level progress tracking
    useQuiz.ts        # Generic quiz session state machine (shuffle, index, score, restart)
    fuzzyMatch.ts     # Lenient text-answer validation for Level 3
  components/
    Flashcard.tsx        # Level 0
    MultipleChoice.tsx    # Level 1
    Matching.tsx          # Level 2
    WriteAnswer.tsx       # Level 3
  pages/
    Home.tsx           # Exam version picker
    VersionLevels.tsx  # Level picker + missed-questions review, per version
    StudyLevel0.tsx
    Level1.tsx
    Level2.tsx
    Level3.tsx
    EnglishPractice.tsx # Separate, decoupled placeholder module
```

Question content is fully decoupled from the UI components and typed through
`src/types.ts`, so the plan is to be able to swap in a backend/auth layer later without
rewriting the study levels or quiz logic.

## Content source & notes

Civics questions and answers are sourced from the official USCIS PDFs:
- [2025 Civics Test – 128 Questions and Answers](https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf)
- [100 Civics Questions and Answers](https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf) (2008 version)

A few notes on the data:
- Questions whose correct answer changes over time (e.g. "who is one of your state's
  U.S. senators?", "who is the president now?") are flagged with `answerChangesOverTime`
  and intentionally do **not** hard-code a name, since USCIS requires the answer to
  reflect whoever currently holds the office at the time of the interview.
- English (`question`/`answers`) text is complete for all 228 questions across both
  lists. Spanish translations (`questionEs` / `answersEs` fields already exist on the
  type) were deferred for v1 and are a natural follow-up.

## Roadmap / ideas for v2+

- **Spanish translations** for all civics questions (the type system already has
  optional `questionEs` / `answersEs` fields ready for this).
- **Login + accounts**, so progress can sync across devices instead of living only in
  one browser's `localStorage`.
- **Payments / premium tier**, if/when there's a reason to gate extra content or
  features behind a subscription.
- **Android packaging via [Capacitor](https://capacitorjs.com/)**, wrapping this same
  web app as a native Android app. The UI was built mobile-first with this in mind.
- **Expanded English practice module** — the full USCIS reading/writing vocabulary
  list, plus reading and writing practice exercises (currently just a placeholder
  landing page with two sample cards).
- **Spaced repetition** for missed questions instead of a simple flat list.
