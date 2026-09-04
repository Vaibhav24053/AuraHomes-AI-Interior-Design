aura/homes

AI-powered room redesign that actually understands how Indians live — your tenure, your regional roots, your household, and your budget — not just your style.

Built for BITSOM Pitchfest 2026.

What this is

Every existing AI interior design tool treats personalization as a style picker. AuraHomes treats it as a context problem: a rented Mumbai 1BHK, a joint family home in Kochi, and a Gen-Z solo apartment in Bengaluru all need fundamentally different design logic — not just a different color palette.

AuraHomes runs one unified flow — quiz, room upload, and generation — where every answer (age, location, regional/traditional background, tenure, household, budget, and a gamified taste-DNA swipe round) compiles into a single AI generation that:

Edits your actual room photo, not a generic stock render
Corrects for Vastu directly in the render — not a separate scored PDF report
Respects rental constraints — no drilling, no permanent changes, when you're renting
Draws from authentic regional design traditions — Nalukettu, Chettinad, Punjabi Haveli, and more — not a generic "Indian style"
Prices everything across three real sourcing tiers — branded retail, local markets, and regional artisans — so affordability and craft support aren't a tradeoff
Why it's different

Most Vastu tools (SquareYards, VastuIQ, Kshetra AI) stop at a compliance score. Most design tools (Coohom, HomeByMe) personalize on style alone. Competitors claiming rental-friendly or Vastu-aware AI design (e.g. Studio Matrx) were tested directly during development and found non-functional on their core AI features. AuraHomes is built narrower and deeper on purpose: one thing, working end-to-end, rather than many things claimed.

Core features
Feature	What it does
Unified Design Flow	One continuous quiz → context → generation experience, not separate disconnected tools
Design DNA	A gamified swipe round infers taste (ornate vs. clean, bold vs. muted, etc.) instead of asking users to self-label their style
Regional Style Library	12+ authentic traditional Indian home styles, each with real material/motif research — not generic state labels
Location-Aware Suggestions	Your city suggests a starting regional style, but every choice is fully overridable
Vastu-in-Render	Corrections are applied directly in the generated image, with plain-language reasoning, and filtered to non-structural fixes for renters
AR-Style Furniture Preview	Live camera view with a scaled furniture cutout overlay, for previewing a single piece without redesigning the whole room
Tiered Sourcing	Every recommended item priced across Branded / Local Market / Artisan tiers, scaled to room size
EMI Budget Mode	Budget planning as a monthly affordability figure, not just a lump sum
Community	Real user transformations, filterable by regional style, plus a no-commitment sandbox mode
Tech stack

Frontend: React + Vite + TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion Backend: Express + TypeScript AI:

OpenAI gpt-image-1 — the only model used for image generation/editing (image-to-image, not text-to-image — the actual uploaded room is edited, never replaced with a generic render)
Anthropic Claude — used for all text reasoning: room/orientation detection from photos, Design Archetype generation, and structured JSON output Data: Supabase
Project structure
aurahomes/
├── src/
│   ├── pages/          # Landing, Design (unified flow), Budget, Community
│   ├── components/     # Reusable UI: cards, sliders, style picker, etc.
│   ├── data/
│   │   └── regionalStyles.ts   # Single source of truth for every style name, region, image, and caption
│   ├── hooks/
│   └── lib/
├── public/
│   └── images/regional-styles/  # Curated real photos per regional style
└── ...

api-server/
├── src/
│   ├── routes/
│   │   ├── detect-context.ts   # Claude vision — room type + orientation
│   │   ├── generate-design.ts  # OpenAI gpt-image-1 — the actual room edit
│   │   ├── design-archetype.ts # Claude — persona/taste generation
│   │   └── vastu-check.ts      # Rule-based, no AI call
│   └── middleware/
Environment variables
OPENAI_API_KEY=       # gpt-image-1 access required
ANTHROPIC_API_KEY=
AURAHOMES_API_KEY=    # your own generated secret — protects the backend from unauthorized use, not from a provider
Regional styles supported

Nalukettu (Kerala) · Chettinad (Tamil Nadu) · Rajasthani Haveli · Pol House (Gujarat) · Bonedi Bari (Bengal) · Assam-Type (Northeast) · Punjabi Haveli · Awadhi (Uttar Pradesh) · Wada Style (Maharashtra) · Nizami Style (Hyderabad/Deccan) · Indo-Portuguese (Goa) · Kashmiri Wood Style — plus Gen-Z Minimal, Vastu-Modern, and global styles (Japandi, Bohemian, Industrial Loft, Coastal Modern).

All style data lives in one file (src/data/regionalStyles.ts) — every component that displays a style name, image, or caption reads from it, so the taxonomy can never drift out of sync across pages.

Roadmap (not in current build)
Full spatial/depth-based AR (true 3D object placement — current AR mode is a scaled 2D camera overlay, not depth-sensing)
Joint-family automated space zoning
Growing-family visual timeline (nursery → kid's room → study)
Contractor quote sanity-check
Scheduled DIY workshops with regional artisans
Real (non-placeholder) sourcing links and verified artisan partnerships
Status

Actively in development for BITSOM Pitchfest, iterating fast — some features above are demo-scoped rather than production-hardened, and that's a deliberate sequencing choice, not an oversight.
