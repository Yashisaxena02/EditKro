# Editkaro.in — Portfolio (VaultofCodes college project)

## Problem Statement
Interactive, dynamic, fully responsive portfolio webpage for "Editkaro.in" (social media
marketing & video editing agency). STRICT constraint: plain HTML, CSS, Vanilla JS only —
no React/Vue/Tailwind/frameworks. Showcase 9 exact categories: short-form, long-form,
gaming, football edits, eCommerce ads, documentary, color grading, anime, ads. Needs
filters/navigation, video previews, animations, mobile+desktop responsiveness. Deliver
index.html, style.css, script.js for download & deployment.

## User Choices
- Videos/thumbnails: none provided → used curated placeholders + real CC0 sample clips.
- Contact: real Editkaro.in info (info@editkaro.in, Instagram @editkaro.in), per brief.
- Theme: "whatever looks cool" → bold cinematic dark, acid-lime accent.

## Architecture
- Pure static site. NO backend, NO MongoDB used.
- Served for preview via the React dev server's `public/` folder; `src/index.js` is a
  deliberate no-op so React never mounts/interferes.
- Deliverables (clean, framework-free):
  - `/app/frontend/public/index.html|style.css|script.js` (live preview at root URL)
  - Grouped copy for download/deploy: `/app/editkaro-portfolio/` (+ `videos/`)
- Sample videos: 5 CC0 clips in `public/videos/` (Google gtv bucket blocked by ORB;
  W3C/test-videos hosts used, downloaded server-side, served same-origin).

## Design
- Fonts: Bricolage Grotesque (display), Manrope (body), JetBrains Mono (labels).
- Colors: base #0A0A0C, cream ink #F4F1EA, acid-lime #CCFF00, coral #FF5A3C, film grain.
- Sections: intro loader → kinetic masked hero (CSS line reveals) → editorial marquee →
  numbered manifesto chapters → filterable Work grid (12 cards, duotone posters, hover
  video preview, lightbox) → count-up stats → 4-step process → contact + quote form → footer.
- Interactivity (vanilla): IntersectionObserver reveals, scroll progress + hero parallax,
  custom cursor, category filters, hover-to-play previews, video lightbox (Esc/X close),
  count-up stats, floating-label validated form, mobile burger menu, smooth anchor scroll.

## Status (implemented) — 2025
- Dark cinematic theme kept & polished (accent glow, magnetic buttons, labeled cursor).
- Hero: compact "Watch Showreel" button in bottom-right corner; SCROLL cue moved to right edge.
- Categories (client-updated, replaces brief list): Short-Form, Long-Form, Song Edits, Gaming,
  Anime, Cricket Edit, Documentary, Love Stories, Travelling (+ All Work). 12 cards.
- Studio section replaced with interactive Before/After drag slider (raw → graded).
- Stats count up from 0 → 500+ / 150+ / 500M+ / 10+.
- Contact form is frontend-only: submit opens the user's email app to info@editkaro.in (mailto).
- Removed "Built for VaultofCodes" footer line; neutral (non-fake) card labels.
- Verified (main-agent Playwright): filters (Cricket=2, Anime=2, All=12), Before/After --pos drag,
  lightbox open/close, form validation + success, footer clean, zero console errors.
- NOTE: testing subagent was temporarily unavailable (infra); validated via Playwright instead.

## Status (implemented) — 2026-07-24
- Gap analysis done against the VaultofCodes brief PDF vs reference site (editkaro-in-website.vercel.app).
- User decision: keep existing 13 portfolio categories/videos AS-IS (no change); implement
  everything else the brief asked for using backend API (not Google Sheets) for storage.
- Backend (FastAPI + MongoDB) now actually wired up: created missing `/app/backend/.env`
  (MONGO_URL, DB_NAME) and `/app/frontend/.env` (REACT_APP_BACKEND_URL) — backend was
  previously crash-looping (KeyError MONGO_URL) since no .env existed.
- New endpoints: POST /api/subscribe (newsletter, dedupes by email), POST /api/contact
  (quote/contact form) — both store to MongoDB (`subscribers`, `contact_messages` collections).
- New sections added to index.html/style.css/script.js (mirrored in /app/editkaro-portfolio/):
  Services (6 cards), About Us (mission + 4 pillars + team image), Team grid (4 placeholder
  members w/ stock photos + invented names/roles per brief's "placeholder" instruction),
  Testimonials (3 cards), Newsletter subscribe bar (calls /api/subscribe).
- Contact form: added required Phone field; now POSTs to /api/contact in addition to mailto;
  contact-list restyled as a 2-col card grid (Email/Call/Visit/Instagram/Website) to balance
  height against the form column — fixed a "large dead space before footer" visual issue.
- Nav updated: Work, Services, About, Process, Contact (+ mobile menu, renumbered eyebrows 01-07).
- SEO: favicon, OG/Twitter meta tags, canonical, robots.txt, sitemap.xml added.
- Verified via Playwright + auto_frontend_testing_agent: all nav links, services cards, about/team
  images, testimonials, filters/lightbox (untouched), newsletter subscribe (200 OK), contact form
  incl. phone field (200 OK), no console errors.
- NOTE: found that CRA dev server does NOT hot-reload changes to `public/index.html` reliably —
  needed `supervisorctl restart frontend` twice to pick up edits. Remember this for future sessions.

## Status (implemented) — 2026-07-24 (v2)
- Redesigned footer per user request: was a giant centered outline "EDITKARO" wordmark with
  huge dead space above it; now a compact 3-col left-aligned footer (Brand+tagline / Quick
  Links / Get In Touch — all 5 contact details) — mobile collapses to 2-col then 1-col.
- Removed the duplicate contact-list cards from the #contact section (info now lives only in
  footer) to avoid repetition; contact section is now just heading+lede+quote form.
- Re-added the big outline "EDITKARO" wordmark (hover-fills lime) per user request — now smaller,
  left-aligned, placed as a decorative header above the 3-col footer grid instead of the old
  giant centered version.

- FINAL footer design (user picked "Bold Card" from 3 options shown): 2 parallel columns only —
  left = outline wordmark "Editkaro" that fills solid lime on hover + tagline; right = "Get In
  Touch" bordered rounded card with all 5 contact details in a 2x3 mini-grid. Quick Links column
  removed (redundant with topbar nav). Verified default (outline) + hover (solid fill) states.

- Admin dashboard added at /admin.html (JWT bearer auth, single hardcoded admin seeded into
  MongoDB `admin_users` on startup, bcrypt-hashed, 5-attempt/15min brute-force lockout). Shows
  live tables of newsletter subscribers + contact/quote messages from MongoDB, with CSV export.
  Credentials in /app/memory/test_credentials.md. Endpoints: POST /api/auth/login, GET /api/auth/me,
  GET /api/admin/subscribers, GET /api/admin/contact-messages (all protected except login).

## Status (implemented) — 2026-07-24 (v3, cleanup)
- Removed unused boilerplate: generic StatusCheck model + POST/GET /api/status endpoints
  (leftover template code, never used by this app).
- Cleaned App.js: removed dead helloWorldApi/console.log test code (React app isn't even
  mounted for this static site — index.js is intentionally a no-op).
- Cleared all test data from MongoDB (`subscribers`, `contact_messages`, `login_attempts`,
  dropped `status_checks`) — admin_users (real login) kept intact.
- Confirmed no stray console.log/debugger/TODO left in frontend or backend.

## Status (implemented) — 2026-07-24 (v4, code cleanup for submission)
- Removed ALL comments from index.html, style.css, script.js, server.py (HTML/CSS/JS/Python
  comments stripped; code behavior unchanged, verified via lint + syntax check + live screenshot).
- Deleted /app/test_result.md and cleared /app/test_reports/ (Emergent testing artifacts).
- Removed unused dead scaffold: src/constants/testIds/ folder (was orphaned after App.js cleanup).
- Self-hosted favicon.jpeg + og-image.jpeg locally (frontend/public/) instead of referencing
  static.prod-images.emergentagent.com — removes tool/platform domain references from the HTML.
- Rewrote README.md as a normal project readme (was placeholder "Here are your Instructions").
- Confirmed no remaining "emergent" text references anywhere in frontend/public, src, backend,
  or the editkaro-portfolio download copy.
- NOTE told to user: I cannot fabricate/backdate a custom git commit history (no git write access,
  and the Emergent platform auto-commits after each step) — pushing to GitHub is done via the
  "Save to GitHub" button in the chat input; commit messages there are platform-generated.

## Backlog / Next
- P1: Replace placeholder clips with real Editkaro.in reels/YouTube/Instagram embeds.
- P2: Deploy to Netlify/Vercel/GitHub Pages per brief's deployment requirement (not yet deployed).
- P2: Write the brief's required short report (changes made / challenges / how overcome) for submission.
- P3: Real testimonials/team data once client provides them (current ones are placeholders per brief).
