# Show HN: MyDreamTesla — Compare Every Tesla Model and Generation Side by Side

**Platform:** Hacker News (news.ycombinator.com/submit)
**Type:** Show HN
**Link type:** dofollow (DA 92)
**URL to submit:** https://mydreamtesla.com

---

## Title (max 80 chars)

Show HN: MyDreamTesla – Compare every Tesla model and generation side by side

## Body Text (paste in comment after submission)

Hi HN,

I built a free Tesla vehicle comparison tool that lets you compare specs across all Tesla models (Model 3, Y, S, X, Cybertruck) and their generational variants.

**Why I built this:** When I was shopping for a Tesla, I found it surprisingly hard to compare models across generations. Tesla's own site only shows current models. Used car sites have specs scattered across listings. I wanted a single page where I could compare, say, a 2021 Model 3 Refresh vs a 2025 Highland side by side.

**What it does:**
- 100+ vehicle trims across 5 models and multiple generations
- 50+ specs per vehicle (range, acceleration, pricing, cargo, charging, dimensions, etc.)
- Side-by-side comparison builder — pick any 2-4 vehicles
- Generation timeline for each model (e.g., Model 3: Original → Refresh → Highland)
- Range displayed in km with EPA source data

**Tech stack:**
- Next.js 15 (App Router, SSR)
- PostgreSQL + Drizzle ORM (typed schema, 50+ columns per vehicle)
- TailwindCSS + Radix UI
- Deployed on Vercel + Neon Postgres

**Interesting technical challenges:**
- Data modeling 100+ trims with 50+ nullable spec fields — ended up with a wide table rather than EAV, which simplified queries dramatically
- Generational grouping logic — same model name but different generations (Model 3 "Highland" vs "Refresh") required a custom classification system
- Comparison engine — building a flexible N-way comparison that handles missing data gracefully

The data is sourced from Tesla's official specs, EPA filings, and verified against multiple automotive databases.

Would love feedback from the HN community, especially on:
1. Data accuracy — if you own a Tesla and spot anything wrong
2. UX — the comparison builder flow
3. Additional features that would be useful

Live at https://mydreamtesla.com — no signup required, completely free.
