# Requirements Document

## Introduction

A personal portfolio website for Aldrey Dela Pena Canlas, an AI Engineer with 6 years of experience in Machine Learning and Deep Learning. The website will be built using plain HTML, CSS, and JavaScript (no frameworks) and deployed on GitHub Pages. It will showcase Aldrey's professional profile, skills, work experience, projects, certifications, and contact information in a clean, modern, and responsive single-page layout.

## Glossary

- **Website**: The portfolio website built for Aldrey Dela Pena Canlas
- **Visitor**: Any person who accesses the portfolio website via a browser
- **Section**: A distinct content area of the single-page website (e.g., Hero, About, Skills, Experience, Projects, Certifications, Contact)
- **Navigation_Bar**: The fixed top navigation element containing links to each section
- **Hero_Section**: The top-most section displaying the subject's name, title, and a call-to-action
- **About_Section**: The section displaying personal profile summary and basic information
- **Skills_Section**: The section displaying technical skills grouped by category
- **Experience_Section**: The section displaying work history in chronological order
- **Projects_Section**: The section displaying notable projects
- **Certifications_Section**: The section displaying professional certifications and achievements
- **Contact_Section**: The section displaying contact information and a contact form
- **Smooth_Scroll**: Browser-native or JavaScript-driven animated scrolling between sections
- **GitHub_Pages**: The static site hosting service provided by GitHub at `<username>.github.io`
- **Responsive_Layout**: A layout that adapts to screen widths including mobile (≤768px), tablet (769px–1024px), and desktop (≥1025px)

---

## Requirements

### Requirement 1: Single-Page Layout and Navigation

**User Story:** As a Visitor, I want to navigate the portfolio through a fixed navigation bar, so that I can jump to any section without losing context.

#### Acceptance Criteria

1. THE Website SHALL render all content sections on a single HTML page.
2. THE Navigation_Bar SHALL remain fixed at the top of the viewport while the Visitor scrolls.
3. THE Navigation_Bar SHALL contain links to the following sections in order: Home, About, Skills, Experience, Projects, Certifications, Contact.
4. WHEN a Visitor clicks a Navigation_Bar link, THE Website SHALL scroll to the corresponding section using Smooth_Scroll.
5. WHEN a Visitor scrolls to a section, THE Navigation_Bar SHALL highlight the active link corresponding to the currently visible section.
6. WHEN the viewport width is 768px or less, THE Navigation_Bar SHALL collapse into a hamburger menu icon.
7. WHEN a Visitor taps the hamburger menu icon, THE Navigation_Bar SHALL expand to display the navigation links as a vertical list.
8. WHEN a Visitor selects a link from the expanded mobile menu, THE Navigation_Bar SHALL collapse the menu after navigation.

---

### Requirement 2: Hero Section

**User Story:** As a Visitor, I want to see a compelling introduction at the top of the page, so that I immediately understand who Aldrey is and what he does.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the full name "Aldrey Dela Pena Canlas" as the primary heading.
2. THE Hero_Section SHALL display the professional title "AI Engineer" as a subtitle.
3. THE Hero_Section SHALL display a brief tagline summarizing Aldrey's specialization in NLP and Predictive Analytics.
4. THE Hero_Section SHALL display a "View My Work" call-to-action button that scrolls to the Projects_Section when clicked.
5. THE Hero_Section SHALL display a "Contact Me" button that scrolls to the Contact_Section when clicked.
6. THE Hero_Section SHALL occupy the full viewport height on initial page load.

---

### Requirement 3: About Section

**User Story:** As a Visitor, I want to read a professional summary and basic personal details, so that I can understand Aldrey's background and experience level.

#### Acceptance Criteria

1. THE About_Section SHALL display the professional profile summary describing Aldrey's 6 years of AI engineering experience.
2. THE About_Section SHALL display the following personal details: Email (aldrey.bim@gmail.com), Phone (+63 9750280986), Location (Mexico, Pampanga, Philippines).
3. THE About_Section SHALL display Aldrey's educational background: "Bachelor of Science in Computer Science, University of the Philippines Diliman, Graduated 2017".
4. WHEN a Visitor clicks the displayed email address, THE Website SHALL open the default mail client with the address pre-filled using a `mailto:` link.
5. WHEN a Visitor clicks the displayed phone number, THE Website SHALL initiate a call intent using a `tel:` link.

---

### Requirement 4: Skills Section

**User Story:** As a Visitor, I want to see Aldrey's technical skills organized by category, so that I can quickly assess his expertise areas.

#### Acceptance Criteria

1. THE Skills_Section SHALL display skills grouped into the following categories: NLP, Machine Learning, Deep Learning, Programming Languages, Data Science & Analytics, Cloud Platforms, Version Control.
2. THE Skills_Section SHALL display each skill category with a distinct heading and a list of associated technologies and libraries.
3. THE Skills_Section SHALL display the Tools subsection listing: Jupyter, Google Colab, VS Code, Git, PostMan, Airflow, Docker, FastAPI, PostgreSQL, Tableau.
4. THE Skills_Section SHALL render each skill item as a visually distinct tag or badge element.

---

### Requirement 5: Experience Section

**User Story:** As a Visitor, I want to view Aldrey's work history in a timeline format, so that I can follow his career progression.

#### Acceptance Criteria

1. THE Experience_Section SHALL display work history entries in reverse chronological order (most recent first).
2. THE Experience_Section SHALL display the following entries:
   - "AI Engineer | Boulder Labs – US Remote | March 2022 – Present"
   - "AI Engineer | TechnoYuga – Philippines | January 2020 – March 2022"
   - "Junior AI Engineer | Flatworld Solutions – Philippines | June 2017 – December 2019"
3. THE Experience_Section SHALL display each entry with the job title, company name, location, and date range.
4. THE Experience_Section SHALL render entries in a vertical timeline layout with a visible connecting line between entries.

---

### Requirement 6: Projects Section

**User Story:** As a Visitor, I want to browse Aldrey's notable projects, so that I can evaluate the practical applications of his skills.

#### Acceptance Criteria

1. THE Projects_Section SHALL display the following six projects as individual cards:
   - "E-Commerce Recommendation System"
   - "Chatbot for Automated Customer Support"
   - "Predictive Text Analytics for Market Trends"
   - "Image Classification for Retail Inventory"
   - "Document Summarization Tool"
   - "Financial Forecasting Model"
2. THE Projects_Section SHALL display each project card with a project title and a brief descriptive summary derived from the project name.
3. THE Projects_Section SHALL display project cards in a responsive grid layout: 3 columns on desktop (≥1025px), 2 columns on tablet (769px–1024px), and 1 column on mobile (≤768px).
4. WHEN a Visitor hovers over a project card, THE Projects_Section SHALL apply a visible visual highlight effect to the card.

---

### Requirement 7: Certifications and Achievements Section

**User Story:** As a Visitor, I want to see Aldrey's certifications and key achievements, so that I can verify his credentials and impact.

#### Acceptance Criteria

1. THE Certifications_Section SHALL display the following certifications:
   - "Hugging Face NLP Course"
   - "TensorFlow Developer Certificate"
   - "AWS Certified Machine Learning – Specialty"
2. THE Certifications_Section SHALL display the following achievements:
   - "Top Performer Award – CloudSwyft (2022)"
   - "Improved model interface latency by 60%"
   - "Deployed 10+ ML models into production with 99% uptime"
   - "Reduced training time by 40%"
3. THE Certifications_Section SHALL visually distinguish certifications from achievements using separate subsection headings.

---

### Requirement 8: Contact Section

**User Story:** As a Visitor, I want to find Aldrey's contact information and send him a message, so that I can reach out for professional opportunities.

#### Acceptance Criteria

1. THE Contact_Section SHALL display the email address "aldrey.bim@gmail.com" as a clickable `mailto:` link.
2. THE Contact_Section SHALL display the phone number "+63 9750280986" as a clickable `tel:` link.
3. THE Contact_Section SHALL display the address "Mexico, Pampanga, Philippines".
4. THE Contact_Section SHALL render a contact form with the following fields: Name (text, required), Email (email, required), Subject (text, required), Message (textarea, required).
5. WHEN a Visitor submits the contact form with all required fields filled, THE Contact_Section SHALL display a success confirmation message to the Visitor.
6. WHEN a Visitor submits the contact form with one or more required fields empty, THE Contact_Section SHALL display a validation error message identifying the missing fields.
7. IF the Visitor's browser does not support the HTML5 `required` attribute validation, THEN THE Contact_Section SHALL perform JavaScript-based field validation before submission.

---

### Requirement 9: Responsive Design

**User Story:** As a Visitor, I want the website to display correctly on any device, so that I can view the portfolio on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Website SHALL apply a Responsive_Layout using CSS media queries without any CSS framework.
2. THE Website SHALL render without horizontal scrollbars at viewport widths of 320px, 768px, and 1440px.
3. THE Website SHALL use relative units (rem, em, %, vw, vh) for font sizes and spacing to support browser zoom levels from 100% to 200%.
4. WHILE the viewport width is 768px or less, THE Website SHALL stack all multi-column layouts into a single column.

---

### Requirement 10: Performance and Accessibility

**User Story:** As a Visitor, I want the website to load quickly and be accessible, so that I have a smooth and inclusive browsing experience.

#### Acceptance Criteria

1. THE Website SHALL load all assets (HTML, CSS, JavaScript) from local files with no external CDN dependencies, ensuring compatibility with GitHub Pages static hosting.
2. THE Website SHALL include a `<meta name="viewport">` tag to enable proper scaling on mobile devices.
3. THE Website SHALL provide `alt` attributes for all `<img>` elements.
4. THE Website SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) for document structure.
5. THE Website SHALL include a `<title>` element with the value "Aldrey Dela Pena Canlas | AI Engineer".
6. THE Website SHALL include Open Graph meta tags (`og:title`, `og:description`, `og:type`) to support link previews when shared on social platforms.
7. WHEN a Visitor navigates using keyboard Tab key, THE Website SHALL display a visible focus indicator on all interactive elements (links, buttons, form fields).

---

### Requirement 11: GitHub Pages Deployment

**User Story:** As a developer, I want the website to be deployable on GitHub Pages, so that it is publicly accessible at no cost.

#### Acceptance Criteria

1. THE Website SHALL consist of a single `index.html` file, a `css/style.css` file, and a `js/main.js` file at the repository root level.
2. THE Website SHALL not require a build step, server-side processing, or package manager to run.
3. THE Website SHALL function correctly when served from a GitHub Pages URL of the form `https://<username>.github.io/<repository-name>/`.
4. THE Website SHALL include a `README.md` file at the repository root with deployment instructions for GitHub Pages.
