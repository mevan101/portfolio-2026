# portfolio-2026

Personal site and résumé of Shahriar Azad Evan, served at https://msaevan.com via GitHub Pages.

- `index.html`: the whole site. Hand-written HTML and CSS with no framework or build step, plus a few lines of inline JS for the theme toggle.
- `resume.pdf`: two-page A4 résumé generated from the same page's print stylesheet. Printing the page (Ctrl/Cmd+P) gives the same layout.
- `portrait.webp` / `portrait.jpg`: profile photo (WebP for the page, JPEG for link previews and structured data).
- `og.png`: social sharing image.

To regenerate `resume.pdf` after editing `index.html`, print the page to PDF in Chrome (A4, margins "Default", background graphics on), or use Playwright's `page.pdf({ format: 'A4', preferCSSPageSize: true })`.
