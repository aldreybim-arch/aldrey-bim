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
   Skills animation — floating pill-shaped skill-label particles
   ========================================================================== */

// ── Visual constants ──────────────────────────────────────────────────────────
const FONT          = '500 0.875rem "Segoe UI", system-ui, sans-serif';
const PADDING_X     = 12;    // px — matches var(--space-3)
const PADDING_Y     = 4;     // px — matches var(--space-1)
const BORDER_RADIUS = 9999;  // full pill
const TEXT_COLOR    = '#66dfff';
const BG_COLOR      = 'rgba(0, 200, 255, 0.08)';
const BORDER_COLOR  = 'rgba(0, 200, 255, 0.25)';
const MIN_SPEED     = 0.5;   // px/frame
const MAX_SPEED     = 1.5;   // px/frame
const LINE_HEIGHT   = 20;    // px — fixed pill line-height

/**
 * Measure the bounding-box dimensions of a skill label pill.
 * Sets ctx.font before measuring so the result matches the rendered text.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} label
 * @returns {{ width: number, height: number }}
 */
function measureParticle(ctx, label) {
  ctx.font = FONT;
  const textWidth = ctx.measureText(label).width;
  const width  = textWidth + PADDING_X * 2;
  const height = LINE_HEIGHT + PADDING_Y * 2;
  return { width, height };
}

/**
 * Create a plain Particle object.
 *
 * @param {string} label
 * @param {number} x      - left edge (px)
 * @param {number} y      - top edge (px)
 * @param {number} vx     - horizontal velocity (px/frame)
 * @param {number} vy     - vertical velocity (px/frame)
 * @param {number} width  - bounding-box width (px)
 * @param {number} height - bounding-box height (px)
 * @returns {Object}
 */
function createParticle(label, x, y, vx, vy, width, height) {
  return { label, x, y, vx, vy, width, height };
}

/**
 * Initialise one Particle per unique label, each placed at a random
 * fully-visible position with a random velocity in [MIN_SPEED, MAX_SPEED].
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {string[]} labels
 * @returns {Object[]}
 */
function initSkillParticles(ctx, canvasWidth, canvasHeight, labels) {
  const unique = [...new Set(labels)];
  return unique.map((label) => {
    const { width, height } = measureParticle(ctx, label);
    const x     = Math.random() * (canvasWidth  - width);
    const y     = Math.random() * (canvasHeight - height);
    const angle = Math.random() * Math.PI * 2;
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    const vx    = Math.cos(angle) * speed;
    const vy    = Math.sin(angle) * speed;
    return createParticle(label, x, y, vx, vy, width, height);
  });
}

/**
 * Reflect a particle off canvas boundaries, clamping position and negating
 * the appropriate velocity component when a boundary is crossed.
 *
 * @param {Object} particle
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function reflectBoundaries(particle, canvasWidth, canvasHeight) {
  // Left boundary
  if (particle.x < 0) {
    particle.x = 0;
    if (particle.vx < 0) particle.vx = -particle.vx;
  }
  // Right boundary
  if (particle.x + particle.width > canvasWidth) {
    particle.x = canvasWidth - particle.width;
    if (particle.vx > 0) particle.vx = -particle.vx;
  }
  // Top boundary
  if (particle.y < 0) {
    particle.y = 0;
    if (particle.vy < 0) particle.vy = -particle.vy;
  }
  // Bottom boundary
  if (particle.y + particle.height > canvasHeight) {
    particle.y = canvasHeight - particle.height;
    if (particle.vy > 0) particle.vy = -particle.vy;
  }
}

/**
 * Resolve all pairwise AABB collisions in the particle list.
 * On overlap: swap velocity vectors, then separate all particles so no two overlap.
 *
 * @param {Object[]} particles
 */
function resolveCollisions(particles) {
  if (particles.length < 2) return;

  // First pass: detect overlaps and perform velocity exchanges
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];

      const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

      if (overlapX <= 0 || overlapY <= 0) continue; // no overlap

      // Velocity exchange
      const tmpVx = a.vx; const tmpVy = a.vy;
      a.vx = b.vx; a.vy = b.vy;
      b.vx = tmpVx; b.vy = tmpVy;
    }
  }

  // Second pass: separate overlapping particles.
  // Sort by center-x and space out along x-axis to guarantee no overlaps.
  // This is O(n log n) and always converges.
  const sorted = particles.slice().sort((a, b) => (a.x + a.width / 2) - (b.x + b.width / 2));

  // Check if any overlaps exist at all; if not, skip separation
  let hasOverlap = false;
  outer: for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]; const b = particles[j];
      if (
        Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 0 &&
        Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 0
      ) { hasOverlap = true; break outer; }
    }
  }
  if (!hasOverlap) return;

  // Space particles along x-axis: keep the leftmost particle in place,
  // push each subsequent particle to the right of the previous one.
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const minX = prev.x + prev.width; // right edge of previous particle
    if (curr.x < minX) {
      curr.x = minX;
    }
  }
}

/**
 * Advance all particles by one frame: move, reflect off boundaries, resolve collisions.
 *
 * @param {Object[]} particles
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function updateSkillParticles(particles, canvasWidth, canvasHeight) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    reflectBoundaries(p, canvasWidth, canvasHeight);
  }
  resolveCollisions(particles);
}

/**
 * Clear the canvas and draw all skill particles as pill-shaped labels.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object[]} particles
 */
function renderParticles(ctx, particles) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    const r = Math.min(BORDER_RADIUS, p.width / 2, p.height / 2);

    // Draw pill background
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, p.height, r);
    ctx.fillStyle = BG_COLOR;
    ctx.fill();

    // Draw pill border
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, p.height, r);
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label text centered in the pill
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.label, p.x + p.width / 2, p.y + p.height / 2);
  }
}

/**
 * Initialise the skills section animated canvas background.
 * Exits immediately if prefers-reduced-motion: reduce is set.
 * Requirements: 1.1–1.5, 2.1–2.4, 3.1–3.3, 4.1–4.3, 5.1–5.4, 6.1–6.4, 7.1–7.3, 8.1–8.4
 */
function initSkillsAnimation() {
  // ── Task 6.1: Reduced-motion guard ───────────────────────────────────────
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return; // Do not inject canvas; leave section in static layout
  }

  // ── Task 6.2: Inject canvas and get context ───────────────────────────────
  const section = document.getElementById('skills');
  if (!section) return;

  const skillTags = section.querySelectorAll('.skill-tag');
  if (!skillTags.length) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'skills-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ── Task 6.3: Read labels, init particles, start animation loop ───────────
  const labels = Array.from(skillTags).map((el) => el.textContent.trim());

  function resizeCanvas() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  resizeCanvas();

  let particles = initSkillParticles(ctx, canvas.width, canvas.height, labels);
  let paused = false;
  let animFrameId;

  function loop() {
    if (!paused) {
      updateSkillParticles(particles, canvas.width, canvas.height);
      renderParticles(ctx, particles);
    }
    animFrameId = requestAnimationFrame(loop);
  }

  // ── Task 6.4: IntersectionObserver for pause/resume ───────────────────────
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        paused = !entries[0].isIntersecting;
      },
      { threshold: 0 }
    ).observe(section);
  }

  // ── Task 6.5: ResizeObserver (with window.resize fallback) ────────────────
  function handleResize() {
    resizeCanvas();
    if (canvas.width > 0 && canvas.height > 0) {
      particles = initSkillParticles(ctx, canvas.width, canvas.height, labels);
    }
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(handleResize).observe(section);
  } else {
    window.addEventListener('resize', handleResize);
  }

  // Start the animation loop
  animFrameId = requestAnimationFrame(loop);
}

/* ==========================================================================
   Hero ECG background — continuous canvas-drawn heartbeat lines
   ========================================================================== */

/**
 * One ECG waveform shape as normalised Y offsets (0 = centre, -1 = top, +1 = bottom).
 * Represents: flat → small bump → sharp spike up → deep trough → recovery → flat
 */
const ECG_SHAPE = [
  // flat lead-in
  [0, 0], [0.08, 0], [0.14, 0],
  // P wave (small bump)
  [0.17, -0.12], [0.20, -0.18], [0.23, -0.12],
  // PR segment
  [0.26, 0], [0.30, 0],
  // QRS complex
  [0.32, 0.10],   // Q — small dip
  [0.34, -0.95],  // R — sharp spike up
  [0.36, 0.55],   // S — deep trough
  [0.38, 0],
  // ST segment
  [0.42, 0], [0.46, 0],
  // T wave
  [0.50, -0.22], [0.55, -0.35], [0.60, -0.22],
  // flat tail
  [0.65, 0], [0.75, 0], [0.85, 0], [1.0, 0],
];

/**
 * Interpolate the ECG shape at a given x position (0–1).
 * Returns the normalised Y value.
 */
function ecgY(x) {
  const shape = ECG_SHAPE;
  for (let i = 0; i < shape.length - 1; i++) {
    const [x0, y0] = shape[i];
    const [x1, y1] = shape[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return 0;
}

/**
 * Draw a continuously scrolling ECG on a canvas element.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {{ color: string, opacity: number, speed: number, glowRadius: number }} opts
 */
function initEcgTrack(canvas, opts) {
  if (!canvas) return;

  const { color, opacity, speed, glowRadius } = opts;

  // Resize canvas to match its CSS size
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();

  const ro = window.ResizeObserver
    ? new ResizeObserver(resize)
    : null;
  if (ro) ro.observe(canvas);
  else window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');

  // How many pixels one full ECG cycle spans
  const CYCLE_PX = 320;

  // Offset advances each frame — drives the scroll
  let offset = 0;
  let paused = false;

  // Pause when hero is off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      paused = !entries[0].isIntersecting;
    }, { threshold: 0 }).observe(canvas.closest('#hero') || canvas);
  }

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    if (W === 0 || H === 0) {
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    const midY   = H / 2;
    const amp    = H * 0.42; // amplitude in px

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    if (glowRadius > 0) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = glowRadius;
    }

    ctx.beginPath();

    // Draw enough cycles to fill the canvas width, shifted by offset
    const startCycle = Math.floor(-offset / CYCLE_PX) - 1;
    const endCycle   = Math.ceil((W - offset) / CYCLE_PX) + 1;

    let first = true;
    const STEPS = 120; // points per cycle

    for (let c = startCycle; c <= endCycle; c++) {
      for (let s = 0; s <= STEPS; s++) {
        const t  = s / STEPS;                        // 0–1 within cycle
        const px = c * CYCLE_PX + t * CYCLE_PX + offset;
        const py = midY + ecgY(t) * amp;

        if (first) { ctx.moveTo(px, py); first = false; }
        else        { ctx.lineTo(px, py); }
      }
    }

    ctx.stroke();
    ctx.restore();

    if (!paused) offset -= speed;

    // Wrap offset to prevent float drift
    if (Math.abs(offset) > CYCLE_PX * 100) offset = 0;

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/**
 * Initialise all three hero ECG background tracks.
 */
function initHeroEcg() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  initEcgTrack(document.getElementById('ecg-track-top'), {
    color:      '#00d4ff',
    opacity:    0.14,
    speed:      0.8,
    glowRadius: 0,
  });

  initEcgTrack(document.getElementById('ecg-track-mid'), {
    color:      '#00d4ff',
    opacity:    0.28,
    speed:      1.2,
    glowRadius: 6,
  });

  initEcgTrack(document.getElementById('ecg-track-bot'), {
    color:      '#7ae8ff',
    opacity:    0.08,
    speed:      0.5,
    glowRadius: 0,
  });
}

/* ==========================================================================
   Scroll-reveal — fade/slide elements in as they enter the viewport
   ========================================================================== */

/**
 * Observe all [data-reveal] elements and add the .revealed class
 * when they cross into the viewport.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Project detail modal
   ========================================================================== */

const PROJECT_DATA = {
  xray: {
    title: 'Chest X-Ray Abnormality Detection',
    tags: ['PyTorch', 'Vision Transformer', 'DICOM', 'Radiology AI', 'CheXpert'],
    description: 'A Vision Transformer (ViT-L/16) model trained on 100,000+ chest X-rays to detect 14 thoracic conditions including pneumonia, pleural effusion, atelectasis, and cardiomegaly. The model was pre-trained on ImageNet-21k and fine-tuned on the CheXpert dataset with multi-label classification. Deployed as a DICOM-integrated screening tool that surfaces probability scores alongside the original image in the radiologist\'s worklist.',
    highlights: [
      'AUC 0.94 on the CheXpert benchmark across 14 pathology labels',
      'DICOM-native integration — reads directly from PACS without format conversion',
      'Grad-CAM heatmaps overlaid on images for radiologist interpretability',
      'Reduced average radiologist review time by 35% in pilot deployment',
      'Inference latency under 300 ms per study on a single A100 GPU',
    ],
    github: 'https://github.com/aldrey-canlas/chexray-vit',
    live: null,
  },
  deidentify: {
    title: 'Clinical Note De-identification Pipeline',
    tags: ['ClinicalBERT', 'Clinical NLP', 'HIPAA', 'spaCy', 'i2b2'],
    description: 'A HIPAA-compliant NLP pipeline that automatically removes Protected Health Information (PHI) from free-text clinical notes, enabling safe secondary use of EHR data for research and analytics. The system combines a fine-tuned ClinicalBERT NER model with deterministic rule-based post-processing to handle edge cases such as partial dates, provider initials, and facility codes.',
    highlights: [
      '98.7% F1 score on the i2b2 2014 de-identification benchmark',
      'Handles 18 HIPAA PHI categories including names, dates, locations, and IDs',
      'Processes 10,000+ notes per hour on a 4-core CPU instance',
      'Audit trail logging for compliance review and model monitoring',
      'Deployed as a FHIR-compatible microservice with FastAPI',
    ],
    github: 'https://github.com/aldrey-canlas/clinical-deidentify',
    live: null,
  },
  sepsis: {
    title: 'Sepsis Early-Warning System',
    tags: ['LSTM', 'Time-Series', 'ICU', 'FastAPI', 'MIMIC-III'],
    description: 'A real-time sepsis prediction system using bidirectional LSTM networks over multivariate time-series ICU data — vital signs, lab values, and medication records from EHR streams. The model outputs a continuous risk score updated every hour, integrated into a hospital alerting dashboard that notifies the care team when a patient crosses a configurable risk threshold.',
    highlights: [
      '88% sensitivity and 82% specificity at a 6-hour prediction horizon',
      'Trained and validated on MIMIC-III (40,000+ ICU admissions)',
      'Real-time inference pipeline with sub-second latency via FastAPI',
      'Configurable alert thresholds to balance sensitivity vs. alert fatigue',
      'SHAP time-step attribution to explain which vitals drove the risk score',
    ],
    github: 'https://github.com/aldrey-canlas/sepsis-alert',
    live: null,
  },
  icd10: {
    title: 'Automated ICD-10 Coding with LLMs',
    tags: ['GPT-4', 'LangChain', 'ICD-10', 'FHIR', 'RAG'],
    description: 'A GPT-4-based pipeline that reads clinical discharge summaries and suggests ICD-10-CM diagnosis and ICD-10-PCS procedure codes with supporting evidence extracted from the note. The system uses Retrieval-Augmented Generation (RAG) over the ICD-10 code hierarchy to ground suggestions in the official coding guidelines, reducing hallucination and improving specificity.',
    highlights: [
      'Reduced manual coding time by 50% in a US hospital network pilot',
      'Improved coding accuracy by 18% vs. the baseline rule-based system',
      'RAG over ICD-10 hierarchy ensures codes are grounded in official guidelines',
      'Evidence snippets extracted from the note for each suggested code',
      'FHIR R4 output format for direct EHR integration',
    ],
    github: 'https://github.com/aldrey-canlas/icd10-llm',
    live: null,
  },
  histo: {
    title: 'Histopathology Slide Classifier',
    tags: ['PyTorch', 'MIL', 'Pathology AI', 'Whole-Slide Imaging', 'OpenSlide'],
    description: 'A weakly-supervised Multiple Instance Learning (MIL) model for whole-slide image (WSI) classification of colorectal cancer subtypes. The model tiles each gigapixel slide into 256×256 patches, extracts features with a ResNet-50 encoder, and aggregates patch-level embeddings with an attention-based MIL pooling layer to produce a slide-level diagnosis — without requiring patch-level annotations.',
    highlights: [
      '92% accuracy across 9 colorectal cancer subtypes on 3,000+ digitized slides',
      'Attention heatmaps highlight diagnostically relevant tissue regions',
      'No patch-level annotations required — trained on slide-level labels only',
      'Processes a 40× whole-slide image in under 90 seconds on a single GPU',
      'Enables pathologists to prioritize high-risk cases in their review queue',
    ],
    github: 'https://github.com/aldrey-canlas/histo-mil',
    live: null,
  },
  readmit: {
    title: 'Patient Readmission Risk Predictor',
    tags: ['XGBoost', 'SHAP', 'EHR', 'Risk Stratification', 'Scikit-learn'],
    description: 'An XGBoost model predicting 30-day hospital readmission risk from structured EHR features including primary diagnosis, comorbidities, medication count, lab trends, prior admissions, and length of stay. SHAP values are computed per patient at discharge to surface the top contributing risk factors, enabling care teams to target high-risk patients with tailored discharge interventions.',
    highlights: [
      'AUC 0.81 on held-out test set across 50,000+ admissions',
      'SHAP explainability — top 5 risk factors surfaced per patient at discharge',
      'Integrated into the EHR discharge workflow as a real-time risk score widget',
      'Stratifies patients into low / medium / high risk tiers for care coordination',
      'Retrospective validation showed 22% reduction in readmissions for flagged cohort',
    ],
    github: 'https://github.com/aldrey-canlas/readmission-risk',
    live: null,
  },

  druginteract: {
    title: 'Drug–Drug Interaction Predictor',
    tags: ['Graph Neural Network', 'PyTorch Geometric', 'Drug Safety', 'Knowledge Graph', 'DrugBank'],
    description: 'A Graph Neural Network (GNN) trained over a biomedical knowledge graph combining DrugBank, SIDER, and OFFSIDES to predict adverse drug–drug interactions (DDIs). The model represents drugs as nodes and known interactions as edges, learning rich molecular and pharmacological embeddings to flag dangerous polypharmacy combinations before they reach the patient.',
    highlights: [
      'AUROC 0.91 on the DrugBank DDI benchmark across 86 interaction types',
      'Knowledge graph integrates 10,000+ drugs and 200,000+ known interactions',
      'Flags high-risk polypharmacy combinations at prescription time via FastAPI endpoint',
      'Outperforms DeepDDI baseline by 4.2% AUROC on held-out test set',
      'Deployed as a clinical pharmacist decision-support tool in a hospital pilot',
    ],
    github: 'https://github.com/aldrey-canlas/ddi-gnn',
    live: null,
  },

  retinopathy: {
    title: 'Diabetic Retinopathy Grading System',
    tags: ['PyTorch', 'EfficientNet-B4', 'Ophthalmology AI', 'Fundus Imaging', 'Kaggle DR'],
    description: 'An EfficientNet-B4 model trained on 88,000+ fundus photographs to grade diabetic retinopathy severity on the 0–4 International Clinical DR scale (No DR → Proliferative DR). The model uses a combination of standard cross-entropy and ordinal regression loss to respect the severity ordering, with test-time augmentation for robust predictions.',
    highlights: [
      'Quadratic weighted kappa of 0.93 on the Kaggle Diabetic Retinopathy benchmark',
      'Trained on 88,702 fundus images with clinician-verified labels',
      'Grad-CAM visualizations highlight lesion regions driving the grade prediction',
      'Enables automated mass screening — processes 1,000 images per hour on a single GPU',
      'Sensitivity 94% / specificity 91% for referable DR (grade ≥ 2) detection',
    ],
    github: 'https://github.com/aldrey-canlas/retinopathy-grading',
    live: null,
  },

  clinicalsumm: {
    title: 'Clinical Discharge Summary Generator',
    tags: ['LLaMA 3', 'Fine-tuning', 'Clinical NLP', 'Summarization', 'LoRA'],
    description: 'A LLaMA 3 8B model fine-tuned with LoRA on 15,000 paired (clinical notes → discharge summary) examples from de-identified EHR data. The model generates structured discharge summaries covering diagnosis, hospital course, medications, follow-up instructions, and pending results — directly from raw admission notes, progress notes, and procedure reports.',
    highlights: [
      'Reduced physician documentation time by 45% in a 3-department hospital pilot',
      'Physician-rated accuracy of 4.3/5 for clinical correctness and completeness',
      'ROUGE-L score of 0.61 vs. human-written summaries on held-out test set',
      'LoRA fine-tuning on a single A100 GPU in under 8 hours',
      'Hallucination rate under 3% as measured by physician review of 500 samples',
    ],
    github: 'https://github.com/aldrey-canlas/clinical-summarizer',
    live: null,
  },

  braintumor: {
    title: 'Brain Tumor Segmentation (MRI)',
    tags: ['3D U-Net', 'MRI Segmentation', 'BraTS 2023', 'Neuro AI', 'nnU-Net'],
    description: 'A 3D U-Net model (based on nnU-Net framework) segmenting three glioma sub-regions — enhancing tumor (ET), tumor core (TC), and whole tumor (WT) — from multi-modal MRI scans (T1, T1ce, T2, FLAIR). The model uses deep supervision, data augmentation with elastic deformations, and a combined Dice + cross-entropy loss for robust boundary delineation.',
    highlights: [
      'Mean Dice score 0.88 on BraTS 2023 validation set (ET: 0.84, TC: 0.89, WT: 0.91)',
      'Trained on 1,251 multi-modal MRI cases from the BraTS 2023 training set',
      'Inference time under 15 seconds per case on a single RTX 3090',
      '3D volumetric output compatible with ITK-SNAP and 3D Slicer for surgical planning',
      'Uncertainty maps generated via Monte Carlo dropout for radiologist confidence scoring',
    ],
    github: 'https://github.com/aldrey-canlas/brain-tumor-seg',
    live: null,
  },

  federated: {
    title: 'Federated Learning for Multi-Site EHR',
    tags: ['Federated Learning', 'Flower', 'Privacy-Preserving AI', 'Multi-site', 'Differential Privacy'],
    description: 'A federated learning framework built with Flower (flwr) enabling 5 geographically distributed hospital sites to collaboratively train a 30-day ICU mortality prediction model without any raw patient data leaving each site. The system uses FedAvg aggregation with differential privacy noise injection to provide formal privacy guarantees, and supports heterogeneous data distributions across sites.',
    highlights: [
      'Matched centralized training AUC (0.83) within 2% using only federated updates',
      '5 hospital sites — no raw patient data shared across institutional boundaries',
      'Differential privacy (ε=1.0) applied at each client before gradient upload',
      'Handles non-IID data distributions across sites with FedProx regularization',
      'Communication-efficient: converges in 30 rounds vs. 200+ for naive FedAvg',
    ],
    github: 'https://github.com/aldrey-canlas/federated-ehr',
    live: null,
  },

  ecgclassify: {
    title: 'ECG Arrhythmia Classification',
    tags: ['1D CNN', 'Transformer', 'ECG Analysis', 'Cardiology AI', 'PhysioNet'],
    description: 'A hybrid 1D CNN–Transformer model classifying 17 arrhythmia types from 12-lead ECG signals. The CNN layers extract local morphological features (QRS shape, P-wave, T-wave) while the Transformer encoder captures long-range temporal dependencies across the full 10-second recording. Trained on the PhysioNet 2021 Challenge dataset with multi-label classification.',
    highlights: [
      'Macro F1 score of 96.4% across 17 arrhythmia classes on PhysioNet 2021',
      'Real-time inference under 50 ms per 12-lead ECG on CPU — suitable for bedside monitors',
      'Attention maps highlight the specific ECG segments driving each classification',
      'Handles noisy and artifact-corrupted signals with robust preprocessing pipeline',
      'Outperforms single-modality CNN and LSTM baselines by 3.1% macro F1',
    ],
    github: 'https://github.com/aldrey-canlas/ecg-arrhythmia',
    live: null,
  },
};

/**
 * Initialise the project detail modal.
 * Opens on "Details" button click, closes on overlay click, close button, or Escape.
 */
function initProjectModal() {
  const modal     = document.getElementById('project-modal');
  const closeBtn  = document.getElementById('modal-close');
  const content   = document.getElementById('modal-content');

  if (!modal || !closeBtn || !content) return;

  // Open modal
  document.querySelectorAll('.btn-project-detail').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-project]');
      if (!card) return;
      const key  = card.dataset.project;
      const data = PROJECT_DATA[key];
      if (!data) return;

      // Build modal content
      const tagsHtml = data.tags
        .map((t) => `<span class="project-tag">${t}</span>`)
        .join('');

      const highlightsHtml = data.highlights
        .map((h) => `<li>${h}</li>`)
        .join('');

      const actionsHtml = [
        data.github
          ? `<a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
               <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
               View on GitHub
             </a>`
          : '',
        data.live
          ? `<a href="${data.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
               <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
               Live Demo
             </a>`
          : '',
      ].join('');

      content.innerHTML = `
        <div class="modal-tags">${tagsHtml}</div>
        <h2 id="modal-title">${data.title}</h2>
        <p class="modal-description">${data.description}</p>
        <div class="modal-highlights">
          <h3>Key Highlights</h3>
          <ul>${highlightsHtml}</ul>
        </div>
        ${actionsHtml ? `<div class="modal-actions">${actionsHtml}</div>` : ''}
      `;

      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });

  // Close helpers
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
}



document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  // initParticles() removed — hero canvas replaced with ECG line decorations
  initHeroEcg();
  initBinaryRain('projects-canvas');
  initNavigation();
  initHero();
  initContactForm();
  initProjectModal();
  initScrollReveal();

  // Update footer year dynamically
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});


