# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People deciding whether to work with Shahriar Azad Evan. The owner chose no single priority audience, so the site serves all of them at once:
- partners and sponsors (Google for Developers, MLH, Kaggle, HerWILL, the EMK Center, embassies) deciding whether to back his next program;
- recruiters hiring for program or community manager roles;
- scholarship and fellowship panels;
- students looking for ML Bangladesh events.

Most arrive from a LinkedIn profile, an email signature or a résumé link, often on a phone, and spend under a minute.

## Product Purpose

A personal portfolio that also works as a résumé. It should show in seconds that he runs real, large, free tech programs across Bangladesh, prove it with numbers, photos and press, and lead to email or the PDF résumé. It succeeds when a visitor emails him or downloads the résumé.

## Positioning

He is a volunteer organizer who runs programs at national scale, in public and on the record, backed by international partners. Examples: 11 free hackathons in five cities in 2026, a 7,000+ member AI community, 42 events hosted since 2020, and national Kaggle competitions. A generic "community manager" page could not claim these specific programs, venues, partners and counts.

## Operating Context

- **Programs:**
  - hackathons in university halls (UIU, DIU, UITS, RUET, Rajshahi University, SEU, Bangladesh Agricultural University, the EMK Center, Asian University for Women);
  - Kaggle competitions;
  - Hacktoberfest editions in Dinajpur and Dhaka;
  - nonprofit drives (Cedar Initiative).
- **Path:** from Pirganj in Rangpur, to Dhaka, to Iowa (CCI scholarship), and back.
- **Tools:** Kaggle, Devpost, Luma, Bevy, Discord.

## Capabilities and Constraints

- **Stack:** static single-file HTML/CSS/vanilla JS on GitHub Pages, deployed from `main` (CNAME msaevan.com). There's no build step. Work happens on branch `redesign-2026-11`; nothing is deployed until the owner says "deploy".
- **Résumé:** `resume.html` (ATS single column) and `resume.pdf` must stay ATS-safe.
- **Search:** SEO and ATS readable. Keep JSON-LD Person/ProfilePage, the h-card, OG/Twitter cards, the sitemap, real text (not images of text) and a semantic heading order.
- **Security:** a CSP meta tag. Images may be hotlinked only from mlbangladesh.org, its Supabase image CDN, and cedar-initiative.org.
- **Accessibility:** support prefers-reduced-motion, light and dark mode, and 44px tap targets. No sideways scroll from 320 to 1920px.

## Brand Commitments

- **Name:** "Shahriar Azad Evan" (legal: Md Shahriar Azad Evan); "S. A. Evan" when space is short.
- **Contact:** email shahriar@sarc.edu.bd only. Never show his personal Gmail.
- **Socials:** linkedin.com/in/msaevan101, instagram.com/msaevan101, x.com/msaevan101, kaggle.com/msaevan, and Facebook.
- **Photos:** never use the photo of him holding a microphone while speaking. The hero portrait is the Washington, D.C. photo (sunglasses, monument and flags). Sticker-like cutouts have been rejected.
- **Owner feedback so far:**
  - He rejected random or rainbow colours as "AI-looking".
  - He found plain layouts "too basic".
  - He liked blue gradients, linear design elements and animated blob rings.
  - He is open to a new visual world.
- **Voice:** first person, plain, specific, no hype.

## Evidence on Hand

- **Facts and numbers:**
  - ML Bangladesh: 7,000+ members.
  - 11 hackathons in 2026 across five cities.
  - 42 events hosted since 2020.
  - Cedar Initiative: 4,000+ people reached.
  - Build With Gemma: 268 registered, 82 teams, 42 universities, 47 projects.
  - ML Olympiad 2024: 353 entrants, 70 teams, 1,160 submissions.
  - Dhaka Breath Index: 72 entrants, 26 teams, 333 submissions.
  - Tech For Her: 12 teams.
- **Press:**
  - Dhaka Tribune (Oct 2026): Global Digital Forum delegation.
  - The Business Standard (Nov 2025): CICA.
  - The Daily Star and The Business Standard (Sep 2026): Tech For Her.
  - Google Developers Blog (2024): ML Olympiad.
- **Awards:**
  - CCI Scholar (2024–25).
  - Platinum Eagle Leadership Award.
  - 3rd Place, CICA AI Art Competition.
  - Dean's List.
  - Google Crowdsource Community Champion.
  - Awareness360 Star Fellow.
- **Photos:**
  - `hero-portrait-dc.webp` and its @2x version.
  - Hotlinked event photos from mlbangladesh.org and cedar-initiative.org: Hacktoberfest Dhaka group, Gemma, DIU, Tech For Her, CS Ed Week.
- **Absent, do not fabricate:**
  - testimonials or quotes;
  - partner logos as image files (use names);
  - any count not listed above.

## Product Principles

1. Proof before adjectives: every claim carries a number, a venue or a source.
2. Real programs and real photographs lead. Decoration supports them and never replaces them.
3. Fast to scan in under a minute on a phone, and still readable as a résumé by machines.
4. Bangladesh is the home of the story. The scale is national and the partners are international.

## Accessibility & Inclusion

WCAG AA contrast in both themes, full keyboard access, reduced-motion parity, and semantic structure readable by screen readers and ATS parsers.
