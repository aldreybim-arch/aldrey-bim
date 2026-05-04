/* js/skills-animation.js — Pure skills animation helpers (no DOM side-effects) */

// ── Visual constants ──────────────────────────────────────────────────────────
export const FONT          = '500 0.875rem "Segoe UI", system-ui, sans-serif';
export const PADDING_X     = 12;    // px — matches var(--space-3)
export const PADDING_Y     = 4;     // px — matches var(--space-1)
export const BORDER_RADIUS = 9999;  // full pill
export const TEXT_COLOR    = 'rgba(102, 223, 255, 0.2)';
export const BG_COLOR      = 'rgba(0, 200, 255, 0.2)';
export const BORDER_COLOR  = 'rgba(0, 200, 255, 0.2)';
export const MIN_SPEED     = 0.5;   // px/frame
export const MAX_SPEED     = 1.5;   // px/frame
export const LINE_HEIGHT   = 20;    // px — fixed pill line-height

/**
 * Measure the bounding-box dimensions of a skill label pill.
 * Sets ctx.font before measuring so the result matches the rendered text.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} label
 * @returns {{ width: number, height: number }}
 */
export function measureParticle(ctx, label) {
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
export function createParticle(label, x, y, vx, vy, width, height) {
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
export function initSkillParticles(ctx, canvasWidth, canvasHeight, labels) {
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
export function reflectBoundaries(particle, canvasWidth, canvasHeight) {
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
export function resolveCollisions(particles) {
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

  // Space particles along x-axis: keep the leftmost in place,
  // push each subsequent particle to the right of the previous one.
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const minX = prev.x + prev.width;
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
export function updateSkillParticles(particles, canvasWidth, canvasHeight) {
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
export function renderParticles(ctx, particles) {
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
