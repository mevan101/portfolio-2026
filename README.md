# portfolio-2026

Personal site and résumé of Shahriar Azad Evan, served at https://msaevan.com via GitHub Pages.

- `index.html`: the portfolio. Hand-written HTML/CSS with a little vanilla JS (theme toggle, count-ups, journey controls). Motion uses native CSS scroll-driven animations where supported and switches off for reduced-motion users; all content is in the HTML without JS.
- `resume.html`: single-column, ATS-friendly résumé. Printing it produces `resume.pdf` (2 pages, A4).
- `fonts/google-sans-flex.woff2`: Google Sans Flex, the site typeface (SIL OFL, see `fonts/LICENSE.txt`).
- SEO: JSON-LD (ProfilePage + Person), Open Graph/Twitter cards (`og-card.png`), `sitemap.xml`, `robots.txt`, `404.html`.

Regenerating `resume.pdf`: serve the folder over HTTP (fonts don't load from `file://`), open `resume.html` and print to PDF (A4), or use Playwright's `page.pdf({ format: 'A4', preferCSSPageSize: true })`.
