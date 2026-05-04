/* js/main.js — Portfolio Website: Aldrey Dela Pena Canlas */

/* ==========================================================================
   Typewriter effect — hero h1
   ========================================================================== */

/**
 * Types out the text content of the hero h1 character by character,
 * then shows a blinking cursor that stays visible indefinitely.
 */
function initTypewriter() {
  const el = document.getElementById('hero-heading');
  if (!el) return;

  const fullText   = el.textContent.trim();
  const typeDelay  = 60;   // ms between each character
  const startDelay = 400;  // ms pause before typing begins

  // Clear the element and make it visible immediately (no layout shift)
  el.textContent = '';
  el.setAttribute('aria-label', fullText); // keep accessible name intact

  // Create a cursor span
  const cursor = document.createElement('span');
  cursor.className    = 'typewriter-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent  = '|';
  el.appendChild(cursor);

  let index = 0;

  function typeNext() {
    if (index < fullText.length) {
      // Insert the next character before the cursor
      el.insertBefore(document.createTextNode(fullText[index]), cursor);
      index++;
      setTimeout(typeNext, typeDelay);
    }
    // When done, cursor stays and blinks via CSS — nothing more to do
  }

  setTimeout(typeNext, startDelay);
}

/* ==========================================================================
   Binary rain background animation (Matrix-style falling 0s and 1s)
   ========================================================================== */

/**
 * Renders Matrix-style falling binary columns on a canvas.
 * @param {string} canvasId - id of the <canvas> element to draw on
 */
function initBinaryRain(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx      = canvas.getContext('2d');
  const FONT_SIZE = 14;          // px — character cell height
  const COLOR     = '#00c8ff';   // teal accent
  const FPS       = 20;          // frames per second (keeps CPU low)

  let cols    = [];   // y-position (in rows) for each column's leading drop
  let paused  = false;
  let lastTime = 0;
  const interval = 1000 / FPS;

  function resize() {
    const section  = canvas.parentElement;
    canvas.width   = section.offsetWidth;
    canvas.height  = section.offsetHeight;
    initCols();
  }

  function initCols() {
    const numCols = Math.floor(canvas.width / FONT_SIZE);
    cols = [];
    for (let i = 0; i < numCols; i++) {
      // Stagger start positions so columns don't all begin at the top together
      cols.push(Math.floor(Math.random() * -(canvas.height / FONT_SIZE)));
    }
  }

  function draw(timestamp) {
    if (timestamp - lastTime < interval) {
      requestAnimationFrame(draw);
      return;
    }
    lastTime = timestamp;

    // Semi-transparent black overlay creates the fading trail effect
    ctx.fillStyle = 'rgba(10, 14, 23, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px monospace`;

    for (let i = 0; i < cols.length; i++) {
      const y = cols[i] * FONT_SIZE;

      if (y > 0) {
        // Leading character — bright white
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * FONT_SIZE, y);

        // Trail character just behind — full teal
        if (cols[i] > 1) {
          ctx.fillStyle = `rgba(0, 200, 255, 0.7)`;
          ctx.fillText(
            Math.random() > 0.5 ? '1' : '0',
            i * FONT_SIZE,
            y - FONT_SIZE
          );
        }
      }

      // Advance the column; reset randomly to create varied column lengths
      cols[i]++;
      if (y > canvas.height && Math.random() > 0.975) {
        cols[i] = Math.floor(Math.random() * -(canvas.height / FONT_SIZE / 2));
      }
    }

    if (!paused) requestAnimationFrame(draw);
  }

  function resume() {
    paused = false;
    requestAnimationFrame(draw);
  }

  // Pause when off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        resume();
      } else {
        paused = true;
      }
    }, { threshold: 0 }).observe(canvas.parentElement);
  }

  resize();

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas.parentElement);
  } else {
    window.addEventListener('resize', resize);
  }

  requestAnimationFrame(draw);
}

/* ==========================================================================
   Hero particle network animation
   ========================================================================== */

/**
 * Draws a slowly drifting particle network on the hero canvas.
 * Dots move in random directions; lines are drawn between nearby pairs.
 */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Config ────────────────────────────────────────────────────────────────
  const PARTICLE_COUNT   = 70;    // number of dots
  const MAX_SPEED        = 0.4;   // max pixels per frame
  const CONNECTION_DIST  = 140;   // px — max distance to draw a line
  const DOT_RADIUS       = 2;     // dot size in px
  const DOT_COLOR        = 'rgba(0, 200, 255, 0.7)';
  const LINE_COLOR_BASE  = '0, 200, 255'; // RGB for lines (opacity varies)

  let particles = [];
  let paused    = false;

  // ── Resize handling ───────────────────────────────────────────────────────
  function resize() {
    const hero = canvas.parentElement;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  // ── Particle factory ──────────────────────────────────────────────────────
  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = MAX_SPEED * (0.2 + Math.random() * 0.8);
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)             p.x += canvas.width;
      if (p.x > canvas.width)  p.x -= canvas.width;
      if (p.y < 0)             p.y += canvas.height;
      if (p.y > canvas.height) p.y -= canvas.height;
    }
  }

  // ── Draw ──────────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines first (behind dots)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          // Opacity fades as distance increases
          const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${LINE_COLOR_BASE}, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw dots on top
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLOR;
      ctx.fill();
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  function loop() {
    if (!paused) {
      update();
      draw();
    }
    requestAnimationFrame(loop);
  }

  // ── Pause when hero is off-screen (performance) ───────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => { paused = !entries[0].isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas.parentElement);
  }

  // ── Resize observer ───────────────────────────────────────────────────────
  resize();
  initParticleList();

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      resize();
      initParticleList();
    }).observe(canvas.parentElement);
  } else {
    window.addEventListener('resize', () => {
      resize();
      initParticleList();
    });
  }

  loop();
}

/* ==========================================================================
   3.5 initNavigation — hamburger toggle, close-on-link-select, smooth scroll
   3.6 IntersectionObserver-based active link highlighting
   ========================================================================== */

/**
 * Initialise all navigation behaviour:
 *  - Hamburger menu toggle (open / close)
 *  - Close mobile menu when a nav link is selected
 *  - Smooth scroll to target section for every nav link
 *  - IntersectionObserver active-link highlighting (with feature-detection guard)
 */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navbar    = document.getElementById('navbar');

  if (!hamburger || !navLinks) return;

  // ── Hamburger toggle ──────────────────────────────────────────────────────
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // ── Smooth scroll + close-on-link-select ─────────────────────────────────
  const links = navLinks.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1); // strip leading '#'
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        event.preventDefault();

        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }

      // Close mobile menu after link selection
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── IntersectionObserver active-link highlighting ─────────────────────────
  // 3.6 Feature-detection guard
  if ('IntersectionObserver' in window) {
    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'certifications',
      'contact',
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    /**
     * Given a section element, return the corresponding nav <a> element
     * (matches href="#<sectionId>").
     * @param {Element} section
     * @returns {Element|null}
     */
    function getLinkForSection(section) {
      return navLinks.querySelector(`a[href="#${section.id}"]`);
    }

    /**
     * Remove .active from all nav links.
     */
    function clearActiveLinks() {
      links.forEach((l) => l.classList.remove('active'));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearActiveLinks();
            const activeLink = getLinkForSection(entry.target);
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      },
      {
        // Trigger when 50%+ of the section is visible
        threshold: 0.5,
        // Account for the fixed nav bar so sections are measured below it
        rootMargin: `-${document.getElementById('navbar')?.offsetHeight ?? 64}px 0px 0px 0px`,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

/* ==========================================================================
   4.4 initHero — CTA button smooth-scroll handlers
   ========================================================================== */

/**
 * Wire up the hero section CTA buttons.
 * Each button carries a `data-target` attribute whose value is the id of the
 * section to scroll to (e.g. data-target="projects").
 * Scrolling accounts for the fixed navigation bar height.
 */
function initHero() {
  const navbar  = document.getElementById('navbar');
  const buttons = document.querySelectorAll('#hero [data-target]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

/* ==========================================================================
   10.5 validateEmail — pure email format validation
   ========================================================================== */

/**
 * Validate an email address string using a standard RFC-5321-compatible regex.
 * This is a pure function — no DOM access.
 *
 * @param {string} email
 * @returns {boolean} true if the string looks like a valid email address
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  // Pattern: local@domain.tld — allows common characters in local part and domain
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/* ==========================================================================
   10.6 validateForm — pure form data validation
   ========================================================================== */

/**
 * @typedef {Object} ContactFormData
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {{ name?: string, email?: string, subject?: string, message?: string }} errors
 */

/**
 * Validate a contact form data object.
 * Checks that all required fields are non-empty (after trimming) and that the
 * email field contains a valid email address.
 * This is a pure function — no DOM access.
 *
 * @param {ContactFormData} formData
 * @returns {ValidationResult}
 */
function validateForm(formData) {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required.';
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!formData.subject || formData.subject.trim() === '') {
    errors.subject = 'Subject is required.';
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Message is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/* ==========================================================================
   10.7 initContactForm — attach submit handler, validate, show results
   ========================================================================== */

/**
 * Initialise the contact form:
 *  - Attaches a submit event handler to #contact-form
 *  - Calls validateForm with the current field values
 *  - On success: hides the form, shows the .success-message element
 *  - On failure: shows per-field inline error messages
 */
function initContactForm() {
  const form           = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect form data
    const formData = {
      name:    form.elements['name'].value,
      email:   form.elements['email'].value,
      subject: form.elements['subject'].value,
      message: form.elements['message'].value,
    };

    // Clear previous error states
    ['name', 'email', 'subject', 'message'].forEach((field) => {
      const input    = form.elements[field];
      const errorEl  = document.getElementById(`${field}-error`);
      if (input)   input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    });

    const { isValid, errors } = validateForm(formData);

    if (isValid) {
      // Hide form, show success message
      form.hidden = true;
      if (successMessage) {
        successMessage.hidden = false;
      }
    } else {
      // Show per-field error messages
      Object.entries(errors).forEach(([field, message]) => {
        const input   = form.elements[field];
        const errorEl = document.getElementById(`${field}-error`);
        if (input)   input.classList.add('error');
        if (errorEl) errorEl.textContent = message;
      });

      // Focus the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && form.elements[firstErrorField]) {
        form.elements[firstErrorField].focus();
      }
    }
  });
}

/* ==========================================================================
   getActiveSectionId — pure function for active section detection
   ========================================================================== */

/**
 * Given an array of section elements and a scroll position (scrollY),
 * return the id of the section that is most visible at that scroll position.
 *
 * "Most visible" is determined by which section's top edge is closest to
 * (but not below) the current scrollY position. This mirrors the behaviour
 * of the IntersectionObserver-based active link highlighting.
 *
 * This is a pure function — it reads only the offsetTop of the provided
 * elements and performs no other DOM mutations.
 *
 * @param {Element[]} sections  - Array of section DOM elements
 * @param {number}    scrollY   - Current vertical scroll position (window.scrollY)
 * @returns {string|null}       - The id of the active section, or null if sections is empty
 */
function getActiveSectionId(sections, scrollY) {
  if (!sections || sections.length === 0) return null;

  let activeSection = sections[0];

  for (const section of sections) {
    if (section.offsetTop <= scrollY + 1) {
      // This section's top is at or above the current scroll position —
      // it is a candidate for the active section.
      activeSection = section;
    }
  }

  return activeSection.id || null;
}

/* ==========================================================================
   DOMContentLoaded — wire up all initialisers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initParticles();
  initBinaryRain('projects-canvas');
  initNavigation();
  initHero();
  initContactForm();

  // Update footer year dynamically
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
