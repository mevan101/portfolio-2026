# portfolio-2026

Personal site and CV of Shahriar Azad Evan, served at https://msaevan.com via GitHub Pages.

- `index.html`: the whole site. Hand-written HTML and CSS, no framework or build step, a few lines of inline JS for the theme toggle.
- `fonts/`: self-hosted Inter and Instrument Serif (SIL Open Font License, see `fonts/LICENSE.txt`).
- `resume.pdf`: two-page A4 CV generated from the page's print stylesheet. Printing the page (Ctrl/Cmd+P) gives the same layout.
- `portrait.webp` / `portrait.jpg`: profile photo. `og.png`: social sharing image.

To regenerate `resume.pdf` after editing `index.html`, serve the folder over HTTP (fonts don't load from `file://`), then print to PDF in Chrome (A4, default margins) or use Playwright's `page.pdf({ format: 'A4', preferCSSPageSize: true })`.
