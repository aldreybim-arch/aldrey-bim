/**
 * tests/skills-animation.test.js
 *
 * Property-based tests for the skills animation helpers.
 * Uses fast-check for property generation (minimum 100 iterations per property).
 *
 * Feature: skills-animation
 *
 * Run with: node --import ./tests/dom-stub.js tests/skills-animation.test.js
 */

import fc from 'fast-check';
import { measureParticle, createParticle, initSkillParticles, reflectBoundaries, resolveCollisions, updateSkillParticles } from '../js/skills-animation.js';

// ─── Mock canvas context ──────────────────────────────────────────────────────

/**
 * Create a minimal mock CanvasRenderingContext2D for Node.js testing.
 * measureText returns width = text.length * textWidthPerChar.
 *
 * @param {number} [textWidthPerChar=8]
 * @returns {Object}
 */
function makeMockCtx(textWidthPerChar = 8) {
  return {
    font: '',
    measureText: (text) => ({ width: text.length * textWidthPerChar }),
    clearRect: () => {},
    beginPath: () => {},
    roundRect: () => {},
    fill: () => {},
    stroke: () => {},
    fillText: () => {},
  };
}

// ─── Minimal test runner ──────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const canvasWidth  = fc.integer({ min: 200, max: 2000 });
const canvasHeight = fc.integer({ min: 200, max: 1500 });
const labelArray   = fc.array(
  fc.string({ minLength: 1, maxLength: 20 }),
  { minLength: 1, maxLength: 40 }
);

// ─── Property 1: Particles initialised fully within canvas bounds ─────────────

console.log('\nProperty 1: Particles initialised fully within canvas bounds');
console.log('  Validates: Requirements 2.2, 1.5');
console.log('  Feature: skills-animation, Property 1: particles initialised fully within canvas bounds');

test('every particle is fully within canvas bounds after initSkillParticles', () => {
  fc.assert(
    fc.property(canvasWidth, canvasHeight, labelArray, (w, h, labels) => {
      const ctx = makeMockCtx();
      const particles = initSkillParticles(ctx, w, h, labels);
      return particles.every(
        (p) => p.x >= 0 && p.y >= 0 && p.x + p.width <= w && p.y + p.height <= h
      );
    }),
    { numRuns: 100 }
  );
});

// ─── Property 2: Particle speed within specified range ────────────────────────

console.log('\nProperty 2: Particle speed within specified range');
console.log('  Validates: Requirements 2.3');
console.log('  Feature: skills-animation, Property 2: particle speed within specified range');

test('every particle speed is in [0.5, 1.5] px/frame after initSkillParticles', () => {
  fc.assert(
    fc.property(canvasWidth, canvasHeight, labelArray, (w, h, labels) => {
      const ctx = makeMockCtx();
      const particles = initSkillParticles(ctx, w, h, labels);
      return particles.every((p) => {
        const speed = Math.hypot(p.vx, p.vy);
        return speed >= 0.5 - 1e-10 && speed <= 1.5 + 1e-10;
      });
    }),
    { numRuns: 100 }
  );
});

// ─── Property 3: One particle per unique label ────────────────────────────────

console.log('\nProperty 3: One particle per unique label');
console.log('  Validates: Requirements 2.1');
console.log('  Feature: skills-animation, Property 3: one particle per unique label');

test('particle count equals the number of unique labels', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 50 }),
      (labels) => {
        // Use a canvas large enough that any label fits comfortably
        const ctx = makeMockCtx();
        const particles = initSkillParticles(ctx, 2000, 1500, labels);
        return particles.length === new Set(labels).size;
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Property 4: Position update adds velocity to position ───────────────────

console.log('\nProperty 4: position update adds velocity to position');
console.log('  Validates: Requirements 3.1');
console.log('  Feature: skills-animation, Property 4: position update adds velocity to position');

test('after one update step, particle position equals old position plus velocity', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 100, max: 8900, noNaN: true }),  // x — well inside 10000 canvas with margin
      fc.float({ min: 100, max: 8900, noNaN: true }),  // y
      fc.float({ min: Math.fround(-3), max: Math.fround(3), noNaN: true }),  // vx
      fc.float({ min: Math.fround(-3), max: Math.fround(3), noNaN: true }),  // vy
      (x, y, vx, vy) => {
        // Use a canvas large enough that no boundary reflection occurs
        // Particle is 50x28, x in [100,8900], vx in [-3,3] → x+vx in [97,8903] — still inside 10000
        const particle = createParticle('test', x, y, vx, vy, 50, 28);
        const oldX = particle.x;
        const oldY = particle.y;
        updateSkillParticles([particle], 10000, 10000);
        return (
          Math.abs(particle.x - (oldX + vx)) < 1e-10 &&
          Math.abs(particle.y - (oldY + vy)) < 1e-10
        );
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Property 5: Boundary reflection keeps particles in bounds ────────────────

console.log('\nProperty 5: boundary reflection keeps particles in bounds');
console.log('  Validates: Requirements 4.3');
console.log('  Feature: skills-animation, Property 5: boundary reflection keeps particles in bounds');

test('after reflectBoundaries, particle bounding rect is fully within canvas', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 200, max: 2000 }),                        // canvasWidth
      fc.integer({ min: 200, max: 1500 }),                        // canvasHeight
      fc.float({ min: -200, max: 2200, noNaN: true }),            // x (may be out of bounds)
      fc.float({ min: -200, max: 1700, noNaN: true }),            // y (may be out of bounds)
      fc.integer({ min: 1, max: 100 }),                           // width
      fc.integer({ min: 1, max: 50 }),                            // height
      fc.float({ min: -3, max: 3, noNaN: true }),                 // vx
      fc.float({ min: -3, max: 3, noNaN: true }),                 // vy
      (canvasWidth, canvasHeight, x, y, width, height, vx, vy) => {
        // Only test when particle fits within canvas
        if (width > canvasWidth || height > canvasHeight) return true;
        const particle = createParticle('test', x, y, vx, vy, width, height);
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return (
          particle.x >= 0 &&
          particle.y >= 0 &&
          particle.x + particle.width <= canvasWidth &&
          particle.y + particle.height <= canvasHeight
        );
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Property 6: Boundary reflection negates correct velocity component ───────

console.log('\nProperty 6: boundary reflection negates correct velocity component');
console.log('  Validates: Requirements 4.1, 4.2');
console.log('  Feature: skills-animation, Property 6: boundary reflection negates correct velocity component');

test('reflectBoundaries negates vx when crossing left boundary', () => {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),   // |vx| positive
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vy arbitrary
      (absVx, vy) => {
        const canvasWidth = 500; const canvasHeight = 500;
        // x < 0, vx < 0 → should flip vx to positive
        const particle = createParticle('test', -10, 100, -absVx, vy, 50, 28);
        const oldVy = particle.vy;
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return particle.vx > 0 && Math.abs(particle.vy - oldVy) < 1e-10;
      }
    ),
    { numRuns: 100 }
  );
});

test('reflectBoundaries negates vx when crossing right boundary', () => {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),   // vx positive
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vy arbitrary
      (vx, vy) => {
        const canvasWidth = 500; const canvasHeight = 500;
        // x + width > canvasWidth, vx > 0 → should flip vx to negative
        const particle = createParticle('test', 460, 100, vx, vy, 50, 28);
        const oldVy = particle.vy;
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return particle.vx < 0 && Math.abs(particle.vy - oldVy) < 1e-10;
      }
    ),
    { numRuns: 100 }
  );
});

test('reflectBoundaries negates vy when crossing top boundary', () => {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vx arbitrary
      fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),   // |vy| positive
      (vx, absVy) => {
        const canvasWidth = 500; const canvasHeight = 500;
        // y < 0, vy < 0 → should flip vy to positive
        const particle = createParticle('test', 100, -10, vx, -absVy, 50, 28);
        const oldVx = particle.vx;
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return particle.vy > 0 && Math.abs(particle.vx - oldVx) < 1e-10;
      }
    ),
    { numRuns: 100 }
  );
});

test('reflectBoundaries negates vy when crossing bottom boundary', () => {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vx arbitrary
      fc.float({ min: Math.fround(0.1), max: Math.fround(3.0), noNaN: true }),   // vy positive
      (vx, vy) => {
        const canvasWidth = 500; const canvasHeight = 500;
        // y + height > canvasHeight, vy > 0 → should flip vy to negative
        const particle = createParticle('test', 100, 480, vx, vy, 50, 28);
        const oldVx = particle.vx;
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return particle.vy < 0 && Math.abs(particle.vx - oldVx) < 1e-10;
      }
    ),
    { numRuns: 100 }
  );
});

test('reflectBoundaries leaves velocity unchanged for particle fully inside bounds', () => {
  fc.assert(
    fc.property(
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vx
      fc.float({ min: Math.fround(-3.0), max: Math.fround(3.0), noNaN: true }),  // vy
      (vx, vy) => {
        const canvasWidth = 500; const canvasHeight = 500;
        // Particle fully inside — no boundary crossing
        const particle = createParticle('test', 100, 100, vx, vy, 50, 28);
        const oldVx = particle.vx;
        const oldVy = particle.vy;
        reflectBoundaries(particle, canvasWidth, canvasHeight);
        return (
          Math.abs(particle.vx - oldVx) < 1e-10 &&
          Math.abs(particle.vy - oldVy) < 1e-10
        );
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Property 7: No overlap after collision resolution ────────────────────────

console.log('\nProperty 7: after collision resolution no two particles overlap');
console.log('  Validates: Requirements 5.2');
console.log('  Feature: skills-animation, Property 7: after collision resolution no two particles overlap');

test('after resolveCollisions, no two particles have overlapping AABBs', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          x: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
          y: fc.float({ min: Math.fround(0), max: Math.fround(500), noNaN: true }),
          vx: fc.float({ min: Math.fround(-3), max: Math.fround(3), noNaN: true }),
          vy: fc.float({ min: Math.fround(-3), max: Math.fround(3), noNaN: true }),
        }),
        { minLength: 2, maxLength: 10 }
      ),
      (configs) => {
        const particles = configs.map((c) =>
          createParticle('test', c.x, c.y, c.vx, c.vy, 50, 28)
        );
        resolveCollisions(particles);
        const eps = 1e-6; // tolerance for floating-point separation
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const overlaps =
              a.x < b.x + b.width - eps &&
              a.x + a.width > b.x + eps &&
              a.y < b.y + b.height - eps &&
              a.y + a.height > b.y + eps;
            if (overlaps) return false;
          }
        }
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Property 8: Velocity exchange on collision ───────────────────────────────

console.log('\nProperty 8: collision resolution performs velocity exchange');
console.log('  Validates: Requirements 5.1');
console.log('  Feature: skills-animation, Property 8: collision resolution performs velocity exchange');

test('resolveCollisions swaps velocities of two overlapping particles', () => {
  fc.assert(
    fc.property(
      fc.float({ min: -3, max: 3, noNaN: true }),  // a.vx
      fc.float({ min: -3, max: 3, noNaN: true }),  // a.vy
      fc.float({ min: -3, max: 3, noNaN: true }),  // b.vx
      fc.float({ min: -3, max: 3, noNaN: true }),  // b.vy
      (avx, avy, bvx, bvy) => {
        // Both particles at (0,0) with same size — guaranteed overlap
        const a = createParticle('A', 0, 0, avx, avy, 50, 28);
        const b = createParticle('B', 0, 0, bvx, bvy, 50, 28);
        const oldAvx = a.vx; const oldAvy = a.vy;
        const oldBvx = b.vx; const oldBvy = b.vy;
        resolveCollisions([a, b]);
        return (
          Math.abs(a.vx - oldBvx) < 1e-10 &&
          Math.abs(a.vy - oldBvy) < 1e-10 &&
          Math.abs(b.vx - oldAvx) < 1e-10 &&
          Math.abs(b.vy - oldAvy) < 1e-10
        );
      }
    ),
    { numRuns: 100 }
  );
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error('\nSome tests failed.');
  process.exit(1);
} else {
  console.log('\nAll tests passed.');
}
