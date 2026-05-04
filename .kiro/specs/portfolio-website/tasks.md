# Implementation Plan

## Tasks

- [x] 1. Project scaffold and file structure
  - [x] 1.1 Create repository root with `index.html`, `css/style.css`, `js/main.js`, and `README.md`
  - [x] 1.2 Add `<meta name="viewport">`, `<title>Aldrey Dela Pena Canlas | AI Engineer</title>`, and Open Graph meta tags to `index.html`
  - [x] 1.3 Add semantic HTML5 skeleton: `<header>`, `<nav>`, `<main>`, all `<section>` elements with correct IDs, `<footer>`
  - [x] 1.4 Link `css/style.css` and `js/main.js` from `index.html` using relative paths
  - [x] 1.5 Write `README.md` with GitHub Pages deployment instructions

- [x] 2. CSS foundation and design tokens
  - [x] 2.1 Define CSS custom properties (variables) for color palette, typography scale, spacing, and breakpoints
  - [x] 2.2 Write CSS reset / base styles using relative units (rem, em, %, vw, vh) — no px for font sizes or spacing
  - [x] 2.3 Write global typography styles (headings, body text, links)
  - [x] 2.4 Write utility classes (container width, section padding, flex/grid helpers)

- [x] 3. Navigation bar
  - [x] 3.1 Write HTML for `<header>` with logo/name and `<nav>` containing links to all 7 sections in order
  - [x] 3.2 Style nav as fixed top bar with logo left, links right (desktop layout)
  - [x] 3.3 Add hamburger `<button>` element (hidden on desktop, visible on mobile ≤768px)
  - [x] 3.4 Write CSS for mobile nav: hide links, show hamburger; `.open` class reveals links as vertical list
  - [x] 3.5 Implement `initNavigation()` in `main.js`: hamburger toggle, close-on-link-select, smooth scroll for all nav links
  - [x] 3.6 Implement `IntersectionObserver`-based active link highlighting with feature-detection guard
  - [x] 3.7 Write CSS `.active` state for nav links

- [x] 4. Hero section
  - [x] 4.1 Write HTML for hero: h1 (full name), h2 (title), p (tagline), two CTA buttons with `data-target` attributes
  - [x] 4.2 Style hero section to occupy full viewport height (`height: 100vh`) with centered content
  - [x] 4.3 Style CTA buttons with hover/focus states
  - [x] 4.4 Wire CTA button click handlers in `main.js` to smooth-scroll to `#projects` and `#contact`

- [x] 5. About section
  - [x] 5.1 Write HTML for about: profile summary paragraph, personal details list (email, phone, location), education entry
  - [x] 5.2 Render email as `<a href="mailto:aldrey.bim@gmail.com">` and phone as `<a href="tel:+639750280986">`
  - [x] 5.3 Style about section as two-column layout on desktop, single column on mobile

- [x] 6. Skills section
  - [x] 6.1 Write HTML for all skill categories (NLP, ML, Deep Learning, Programming Languages, Data Science & Analytics, Cloud Platforms, Version Control, Tools) with `<span class="skill-tag">` badges
  - [x] 6.2 Style skill category cards and `.skill-tag` badge elements
  - [x] 6.3 Style skills grid layout (responsive wrapping)

- [x] 7. Experience section
  - [x] 7.1 Write HTML for three experience entries in reverse chronological order, each as `<article>` with title, company, location, date range
  - [x] 7.2 Style vertical timeline layout with CSS `::before` pseudo-element connecting line
  - [x] 7.3 Style individual experience entry cards

- [x] 8. Projects section
  - [x] 8.1 Write HTML for six project cards, each as `<article class="project-card">` with title and description
  - [x] 8.2 Style project grid: 3 columns (≥1025px), 2 columns (769px–1024px), 1 column (≤768px) using CSS Grid
  - [x] 8.3 Add CSS hover effect on `.project-card` (transform + box-shadow transition)

- [x] 9. Certifications section
  - [x] 9.1 Write HTML with two subsections: "Certifications" (`<h3>`) and "Achievements" (`<h3>`), each with a `<ul>` list
  - [x] 9.2 Populate certifications list (3 items) and achievements list (4 items)
  - [x] 9.3 Style the two subsections with visually distinct presentation (e.g., different icon/color for achievements)

- [x] 10. Contact section
  - [x] 10.1 Write HTML for contact info column: email (`mailto:`), phone (`tel:`), address
  - [x] 10.2 Write HTML for contact form: Name, Email, Subject, Message fields (all `required`), submit button
  - [x] 10.3 Write hidden `.success-message` element and per-field `.error-msg` `<span>` elements
  - [x] 10.4 Style contact section as two-column layout (info + form) on desktop, single column on mobile
  - [x] 10.5 Implement `validateEmail(email)` pure function in `main.js`
  - [x] 10.6 Implement `validateForm(formData)` pure function in `main.js` (checks all fields non-empty, email valid)
  - [x] 10.7 Implement `initContactForm()` in `main.js`: attach submit handler, call `validateForm`, show success or per-field errors

- [x] 11. Footer
  - [x] 11.1 Write HTML for `<footer>` with copyright text
  - [x] 11.2 Style footer (centered, minimal)

- [x] 12. Responsive design and cross-section polish
  - [x] 12.1 Write CSS media queries for ≤768px breakpoint: single-column stacking for about, skills, contact sections
  - [x] 12.2 Write CSS media queries for 769px–1024px breakpoint: tablet adjustments for projects grid and nav
  - [x] 12.3 Verify no horizontal scrollbar at 320px, 768px, and 1440px viewport widths
  - [x] 12.4 Add visible CSS focus indicators for all interactive elements (links, buttons, form fields)
  - [x] 12.5 Add `alt` attributes to all `<img>` elements (if any images are used)

- [x] 13. Accessibility and performance audit
  - [x] 13.1 Verify all semantic HTML5 elements are used correctly (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`)
  - [x] 13.2 Run Lighthouse or axe DevTools audit and fix any critical accessibility issues
  - [x] 13.3 Confirm no external CDN dependencies in HTML, CSS, or JS
  - [x] 13.4 Confirm page is fully readable with JavaScript disabled

- [x] 14. JavaScript validation unit and property tests
  - [x] 14.1 Create `tests/` directory with a test runner file (plain Node.js with `console.assert` or uvu)
  - [x] 14.2 Write property-based tests for `validateForm` with empty/whitespace fields using fast-check (Property 1: Feature: portfolio-website, Property 1: Contact form rejects submissions with empty required fields)
  - [x] 14.3 Write property-based tests for `validateForm` with all valid fields using fast-check (Property 2: Feature: portfolio-website, Property 2: Contact form accepts valid submissions)
  - [x] 14.4 Write property-based tests for `validateEmail` with non-email strings using fast-check (Property 3: Feature: portfolio-website, Property 3: Email format validation rejects malformed addresses)
  - [x] 14.5 Write property-based tests for `getActiveSectionId` with generated scroll positions (Property 4: Feature: portfolio-website, Property 4: Active navigation link reflects visible section)
  - [x] 14.6 Write property-based tests for nav link scroll target mapping (Property 5: Feature: portfolio-website, Property 5: Smooth scroll targets correct section)
  - [x] 14.7 Write property-based tests for mobile menu close-on-link-select (Property 6: Feature: portfolio-website, Property 6: Mobile menu collapses after link selection)

- [x] 15. Final review and GitHub Pages deployment
  - [x] 15.1 Manually test all sections at 320px, 768px, 1024px, 1440px viewport widths
  - [x] 15.2 Test hamburger menu open/close and link navigation on mobile
  - [x] 15.3 Test `mailto:` and `tel:` links open correct OS handlers
  - [x] 15.4 Test contact form: valid submission shows success, invalid submission shows errors
  - [x] 15.5 Test keyboard Tab navigation shows visible focus indicators on all interactive elements
  - [x] 15.6 Verify Open Graph meta tags using an OG preview tool
  - [x] 15.7 Push to GitHub and enable GitHub Pages; verify site loads at `https://<username>.github.io/<repository-name>/`
