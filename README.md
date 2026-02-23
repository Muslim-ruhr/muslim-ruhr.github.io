# Muslim Ruhr Landing Page

Static GitHub Pages site for **Muslim Ruhr — Komunitas Muslim Indonesia di Ruhrgebiet**.

## Structure

- `index.html` - semantic page layout and sections.
- `styles.css` - theme, responsive layout, animation, scroll snap, accessibility styles.
- `app.js` - all interactions + language loader + global CTA constant.
- `lang/id.json` - konten Bahasa Indonesia.
- `lang/de.json` - konten Bahasa Jerman.
- `lang/en.json` - konten Bahasa Inggris.
- `assets/favicon.svg` - favicon icon.
- `assets/og-image.svg` - Open Graph preview image.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open repository settings: `Settings -> Pages`.
3. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
4. Save and wait for GitHub Pages to publish.
5. Your site URL will be shown in the Pages settings.

Notes:
- The site uses **relative paths** (`styles.css`, `app.js`, `assets/...`) so it works on GitHub Pages subpath URLs (for example `https://username.github.io/repo-name/`).
- No build step is required.

## Edit Content Quickly

### 1) Edit CTA globally

At the top of `app.js`, edit:

- `CTA_BUTTON.url`
- `CTA_BUTTON.textByLang.id`
- `CTA_BUTTON.textByLang.de`
- `CTA_BUTTON.textByLang.en`

### 2) Edit full-page language content

Semua teks halaman ada di file bahasa:

- `lang/id.json`
- `lang/de.json`
- `lang/en.json`

Setiap file berisi:

- `meta` (title/description/OG)
- `ui` (label tombol, aria labels, hint, disclaimer)
- `hero`
- `sections.about`
- `sections.activities` (filter + cards)
- `sections.timeline`
- `sections.faq`
- `sections.footer`

## Accessibility and UX features

- Keyboard-accessible interactive controls (`button`, proper focus rings, aria attributes).
- `prefers-reduced-motion` support (reduced transitions, floating background disabled).
- Theme toggle (light/dark) saved in `localStorage`.
- Focus mode toggle (larger text/reduced visuals) saved in `localStorage`.
- Full language switch (`id/de/en`) untuk seluruh halaman, bukan hanya hero.
- Scroll progress bar and section reveal animations.

## Local Preview

Open `index.html` directly in browser, or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.
