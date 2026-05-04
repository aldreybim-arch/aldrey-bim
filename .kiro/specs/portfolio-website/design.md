# Design Document

## Overview

This document describes the technical design for Aldrey Dela Pena Canlas's personal portfolio website. The site is a single-page application (SPA-style) built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build tools, no external CDN dependencies. It is deployed as a static site on GitHub Pages.

The design prioritizes simplicity, performance, and maintainability. All interactivity (smooth scroll, active nav highlighting, hamburger menu, form validation, scroll animations) is implemented in a single `js/main.js` file. Styling lives in `css/style.css`. The entire site is one `index.html` file.

---

## Architecture

The site follows a flat, static file architecture:

```
portfolio-website/
├── index.html          # Single HTML page containing all sections
├── css/
│   └── style.css       # All styles, including responsive media queries
├── js/
│   └── main.js         # All interactivity and DOM manipulation
└── README.md           # GitHub Pages deployment instructions
```

No build step, package manager, or server-side processing is required. The browser loads `index.html`, which references `css/style.css` and `js/main.js` via relative paths. This ensures the site works correctly when served from any GitHub Pages URL of the form `https://<username>.github.io/<repository-name>/`.

### Rendering Model

All content is statically embedded in `index.html`. JavaScript enhances the experience progressively — the page is fully readable without JavaScript enabled. CSS handles layout and visual design; JavaScript handles behavior only.

### Scroll and Navigation Model

The page uses the browser's native scroll container. Navigation links use `href="#section-id"` anchors. JavaScript intercepts click events to apply smooth scrolling (via `window.scrollTo` with `behavior: 'smooth'` or a polyfill for older browsers). An `IntersectionObserver` watches each section and updates the active nav link as sections enter the viewport.

---

## Components and Interfaces

### 1. Navigation Bar (`<header>` / `<nav>`)

- Fixed to the top of the viewport (`position: fixed`).
- Contains the site logo/name on the left and nav links on the right.
- On mobile (≤768px): nav links are hidden; a hamburger button (`<button>`) is shown.
- Hamburger toggle adds/removes an `.open` class on the nav, revealing links as a vertical list.
- Active link state managed by JavaScript via `.active` class.

**JavaScript interface:**
```js
initNavigation()
  - Attaches click handlers to all nav links for smooth scroll
  - Attaches click handler to hamburger button for menu toggle
  - Closes mobile menu when a nav link is selected
  - Sets up IntersectionObserver for active link highlighting
```

### 2. Hero Section (`<section id="hero">`)

- Full viewport height (`height: 100vh`).
- Displays: name (h1), title (h2), tagline (p), two CTA buttons.
- "View My Work" button scrolls to `#projects`.
- "Contact Me" button scrolls to `#contact`.
- Buttons use `<button>` elements with `data-target` attributes pointing to section IDs.

### 3. About Section (`<section id="about">`)

- Two-column layout on desktop (profile text left, details right); single column on mobile.
- Email rendered as `<a href="mailto:aldrey.bim@gmail.com">`.
- Phone rendered as `<a href="tel:+639750280986">`.
- Education displayed as a structured list item.

### 4. Skills Section (`<section id="skills">`)

- Skills grouped by category using `<article>` or `<div>` with a category heading.
- Each skill rendered as a `<span class="skill-tag">` badge.
- Categories: NLP, Machine Learning, Deep Learning, Programming Languages, Data Science & Analytics, Cloud Platforms, Version Control, Tools.
- Layout: CSS Grid or Flexbox wrapping grid of category cards.

### 5. Experience Section (`<section id="experience">`)

- Vertical timeline layout using CSS pseudo-elements (`::before`) for the connecting line.
- Each entry is an `<article>` with: job title (`<h3>`), company + location (`<p>`), date range (`<span>`), and bullet points for responsibilities.
- Entries ordered most-recent-first in the HTML source.

### 6. Projects Section (`<section id="projects">`)

- CSS Grid layout: 3 columns (desktop), 2 columns (tablet), 1 column (mobile).
- Each project is a `<article class="project-card">` containing: title (`<h3>`), description (`<p>`).
- Hover effect applied via CSS `transition` on `transform` and `box-shadow`.

### 7. Certifications Section (`<section id="certifications">`)

- Two subsections: "Certifications" and "Achievements", each with its own `<h3>` heading.
- Certifications listed as `<ul>` items.
- Achievements listed as `<ul>` items with distinct styling (e.g., checkmark icon via CSS `::before`).

### 8. Contact Section (`<section id="contact">`)

- Left column: contact info (email, phone, address) with icons.
- Right column: contact form.
- Form fields: Name, Email, Subject, Message (all required).
- Form submission handled by JavaScript (no backend); displays a success message on valid submit.
- Validation: HTML5 `required` attributes + JavaScript fallback validation.

**JavaScript interface:**
```js
initContactForm()
  - Attaches submit handler to the form
  - Validates all required fields are non-empty and email is valid format
  - On success: hides form, shows .success-message element
  - On failure: shows inline error messages per field
```

### 9. Footer (`<footer>`)

- Simple centered footer with copyright text.

---

## Data Models

The site has no dynamic data store. All content is static HTML. The following describes the logical structure of content entities as they appear in the DOM.

### NavLink

```
{
  label: string,       // e.g. "About"
  targetId: string     // e.g. "about" (matches section id)
}
```

### ExperienceEntry

```
{
  title: string,       // e.g. "AI Engineer"
  company: string,     // e.g. "Boulder Labs"
  location: string,    // e.g. "US Remote"
  dateRange: string,   // e.g. "March 2022 – Present"
  bullets: string[]    // responsibility bullet points
}
```

### ProjectCard

```
{
  title: string,       // e.g. "E-Commerce Recommendation System"
  description: string  // brief summary
}
```

### SkillCategory

```
{
  category: string,    // e.g. "NLP"
  skills: string[]     // e.g. ["NLTK", "spaCy", "Transformers", ...]
}
```

### Certification

```
{
  name: string         // e.g. "TensorFlow Developer Certificate"
}
```

### Achievement

```
{
  text: string         // e.g. "Improved model interface latency by 60%"
}
```

### ContactFormData

```
{
  name: string,        // required, non-empty
  email: string,       // required, valid email format
  subject: string,     // required, non-empty
  message: string      // required, non-empty
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Contact form rejects submissions with empty required fields

*For any* contact form submission where one or more required fields (name, email, subject, message) are empty or whitespace-only, the JavaScript validation function SHALL return an invalid result and SHALL NOT display the success message.

**Validates: Requirements 8.6, 8.7**

### Property 2: Contact form accepts valid submissions

*For any* contact form submission where all required fields are non-empty and the email field contains a valid email format, the JavaScript validation function SHALL return a valid result and SHALL display the success confirmation message.

**Validates: Requirements 8.5, 8.7**

### Property 3: Email format validation rejects malformed addresses

*For any* string that does not conform to the pattern `<local>@<domain>.<tld>`, the email validation function SHALL classify it as invalid.

**Validates: Requirements 8.5, 8.6**

### Property 4: Active navigation link reflects visible section

*For any* scroll position on the page, the navigation link corresponding to the section currently most visible in the viewport SHALL have the `.active` class, and all other navigation links SHALL NOT have the `.active` class.

**Validates: Requirements 1.5**

### Property 5: Smooth scroll targets correct section

*For any* navigation link click, the page SHALL scroll to the section whose `id` matches the link's `data-target` or `href` anchor value.

**Validates: Requirements 1.4, 2.4, 2.5**

### Property 6: Mobile menu collapses after link selection

*For any* navigation link selected while the mobile menu is open, the menu SHALL transition to the closed state after the link is activated.

**Validates: Requirements 1.8**

### Property 7: Responsive layout has no horizontal overflow

*For any* viewport width between 320px and 1440px, no element in the page SHALL cause horizontal scrollbar to appear (i.e., `document.body.scrollWidth <= window.innerWidth`).

**Validates: Requirements 9.2, 9.4**

---

## Error Handling

### Form Validation Errors

- Each required field that fails validation receives an `.error` class and an adjacent `<span class="error-msg">` element is shown with a descriptive message.
- On re-submission, all previous error states are cleared before re-validation.
- If the browser supports HTML5 constraint validation, native browser UI is used as the first line of defense. The JavaScript layer provides a consistent fallback.

### Missing `mailto:` / `tel:` Support

- These are standard browser features. No special error handling is needed. The links degrade gracefully — if the OS has no mail client configured, the browser handles the fallback.

### JavaScript Disabled

- The page is fully readable without JavaScript. Navigation links still work as standard anchor links (no smooth scroll). The contact form falls back to HTML5 `required` validation only.

### IntersectionObserver Not Supported

- A feature-detection guard wraps the `IntersectionObserver` setup. If unavailable (very old browsers), the active nav highlighting is simply not applied — the nav remains functional.

```js
if ('IntersectionObserver' in window) {
  // set up active nav highlighting
}
```

---

## Testing Strategy

This is a static HTML/CSS/JS site with no build pipeline. Testing focuses on:

### Unit Tests (JavaScript Logic)

The following pure functions in `main.js` are unit-testable in isolation:

- `validateEmail(email: string): boolean` — email format validation
- `validateForm(formData: ContactFormData): ValidationResult` — form field validation
- `getActiveSectionId(sections: Element[], scrollY: number): string` — active section detection logic

A lightweight test runner (e.g., plain `console.assert` in a `tests/` directory, or a zero-dependency runner like [uvu](https://github.com/lukeed/uvu)) can be used since no framework is allowed.

### Property-Based Tests

Since the site uses plain JavaScript, property-based testing can be applied to the pure validation and DOM-query logic using a library such as [fast-check](https://github.com/dubzzz/fast-check) (zero runtime dependency, runs in Node.js).

Each property test MUST run a minimum of 100 iterations.

Tag format: **Feature: portfolio-website, Property {number}: {property_text}**

| Property | Test Description | Library |
|---|---|---|
| Property 1 | Generate form objects with one or more empty/whitespace fields; assert `validateForm` returns invalid | fast-check |
| Property 2 | Generate form objects with all valid fields; assert `validateForm` returns valid | fast-check |
| Property 3 | Generate arbitrary non-email strings; assert `validateEmail` returns false | fast-check |
| Property 4 | Generate scroll positions and section layouts; assert `getActiveSectionId` returns the correct section | fast-check |
| Property 5 | Generate nav link clicks; assert scroll target matches link anchor | fast-check |
| Property 6 | Simulate mobile menu open + link click; assert menu closes | fast-check |
| Property 7 | Simulate viewport widths 320–1440px; assert no horizontal overflow | Manual / browser testing |

### Integration / Manual Tests

The following are verified manually in a browser (Chrome, Firefox, Safari, mobile):

- All sections render correctly at 320px, 768px, 1024px, 1440px viewport widths.
- Hamburger menu opens and closes correctly on mobile.
- Smooth scroll works for all nav links and CTA buttons.
- `mailto:` and `tel:` links open the correct OS handler.
- Open Graph meta tags render correctly when URL is shared (use [opengraph.xyz](https://www.opengraph.xyz) or similar).
- Keyboard Tab navigation shows visible focus indicators on all interactive elements.
- Page title is "Aldrey Dela Pena Canlas | AI Engineer".
- GitHub Pages deployment serves the site correctly from the expected URL.

### Accessibility Checks

- Run [axe DevTools](https://www.deque.com/axe/) or Lighthouse accessibility audit.
- Verify all `<img>` elements have `alt` attributes.
- Verify semantic HTML structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- Verify visible focus indicators for keyboard navigation.

> Note: Full WCAG compliance requires manual testing with assistive technologies and expert accessibility review beyond automated tooling.
