---
platform: LinkedIn
title: "I Built a Tesla Comparison Tool as a Side Project — Here's What I Learned About Data-Driven Product Design"
suggested_tags: #sideproject #webdevelopment #product #tesla #entrepreneurship
---

# I Built a Tesla Comparison Tool as a Side Project — Here's What I Learned About Data-Driven Product Design

Six months ago, I started shopping for a Tesla. Within an hour, I was buried in browser tabs — Tesla's configurator, Reddit threads, YouTube reviews, forum posts, each giving me a different number for the same spec. I couldn't find a single place that showed me every Model 3 trim from 2017 to 2025, side by side, with consistent data.

So I built one.

[MyDreamTesla](https://mydreamtesla.com) is a comparison tool that covers every Tesla model, every generation, every trim — with 50+ specs per vehicle. Model 3 Original vs. Highland. Model Y pre-Juniper vs. Juniper. Cybertruck AWD vs. Cyberbeast. Any combination, all in one place.

Here's what I learned building it.

## 1. The Best Products Solve Your Own Problem

I didn't start with a business plan. I started with frustration. I wanted to know: is the 2025 Model 3 Highland Long Range actually better than the 2023 version I could buy used for $15,000 less? The answer wasn't easily found online.

That personal frustration drove every product decision. When I asked "should I add this feature?" the question was really "would this have helped me make my buying decision?" That filter kept the scope tight.

**Takeaway:** If you're looking for a side project idea, pay attention to the moments when you can't find the tool you need. That gap is your opportunity.

## 2. Data Quality Is the Product

The most time-consuming part of this project wasn't writing code. It was researching and verifying the data.

I tracked down EPA range ratings, MSRP histories, acceleration times, battery capacities, cargo volumes, and towing capacities for 100+ vehicle trims. Every number came from Tesla press releases, EPA filings, or verified automotive press tests. No crowdsourced data. No "approximately."

This matters because the product's entire value proposition is accuracy. A comparison tool with wrong numbers is worse than no tool at all — it leads to bad purchasing decisions.

**Takeaway:** In a data-driven product, the data isn't a feature. The data IS the product. Invest disproportionately in data quality.

## 3. Start With the Minimum Valuable Comparison

My first version showed just two things: range and price, for current-year trims only. No historical data. No Performance metrics. No cargo dimensions.

But it was useful immediately. Visitors could see at a glance that the Model 3 RWD gives you 321 miles for $38,990, while the Model Y RWD gives you the same 321 miles for $44,990. That $6,000 delta — visible in one second — is valuable.

I shipped that, watched how people used it, and then expanded. Historical data came next (because people were comparing new vs. used). Then performance specs. Then charging data. Each addition was driven by what users actually needed.

**Takeaway:** Don't build the comprehensive tool first. Build the minimum useful comparison, validate it, then expand.

## 4. Technical Decisions Should Serve the User, Not the Resume

I built this with Next.js, PostgreSQL, Drizzle ORM, and TailwindCSS. Not because they're trendy, but because:

- **Server-side rendering** means the comparison pages load with full content, which matters for SEO and for users on slow connections.
- **PostgreSQL** handles the relational vehicle data naturally — a vehicle belongs to a model, has typed specs, needs indexed lookups by slug.
- **Drizzle ORM** gives me type safety from the database schema all the way to the React component. If I add a new spec field, TypeScript tells me every place I need to update.

I was tempted to use a headless CMS or a NoSQL database for "flexibility." I'm glad I didn't. The data is inherently structured and relational. Using the right tool for the data model saved me from fighting my infrastructure.

**Takeaway:** Choose your stack based on the shape of your data and the needs of your users, not on what's popular on Hacker News this week.

## 5. Internationalization Isn't Optional — It's Day-One Architecture

Tesla sells globally, and my visitors come from everywhere. I added English and Chinese language support from day one using next-intl, and I built region-aware spec display (US miles vs. Canadian kilometers, trim availability differences between markets).

Adding i18n retroactively is painful. Adding it from the start — when the component tree is still small — is almost free.

**Takeaway:** If your product has any international audience potential, build i18n into the architecture early.

## 6. The Side Project Advantage: Speed and Focus

Working alone, without stakeholders or sprint ceremonies, I shipped the core product in two weekends. Not because I worked insane hours, but because there were zero coordination costs. Every decision was made in seconds.

- "Should we add cargo volume?" Yes — I added it.
- "Should the comparison be side-by-side or stacked?" Side-by-side — decided, implemented, shipped.
- "Should we add a dark mode?" Yes — TailwindCSS makes it trivial.

In a larger team, each of those decisions would have been a meeting. Solo, they were each five minutes.

**Takeaway:** The speed advantage of side projects isn't just about fewer people. It's about the elimination of coordination overhead. Protect that advantage.

## 7. Metrics That Matter

I don't track vanity metrics. The two numbers I care about:

1. **Comparison sessions completed** — how many people actually finish comparing two vehicles? This tells me if the tool is useful.
2. **Return visitors** — are people coming back when they're further along in their buying journey? This tells me if the tool is trustworthy.

Both numbers have grown steadily. The highest-traffic pages are the Model 3 vs. Model Y comparison and the year-over-year Model 3 history — exactly the use cases I built for.

## What's Next

The core tool is solid. Next priorities:

- **More regional data** — EU pricing and specs are next
- **Total cost of ownership calculator** — factoring in electricity costs, maintenance, insurance
- **Community features** — letting owners contribute real-world range and charging data

If you're curious, check it out at [mydreamtesla.com](https://mydreamtesla.com). And if you've built a side project that solved your own problem, I'd love to hear your story in the comments.

---

*Building in public, one data point at a time.*
