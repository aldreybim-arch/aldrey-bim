# Implementation Plan: Skills Animation

## Overview

Implement the `initSkillsAnimation()` function in `js/main.js`, add the required CSS to `css/style.css`, and write property-based tests in `tests/skills-animation.test.js`. The feature renders animated pill-shaped skill-label particles on a `<canvas>` behind the `#skills` section content, with boundary reflection, billiard-ball collision response, IntersectionObserver-based pause/resume, and reduced-motion support.

## Tasks

- [x] 1. Add CSS for the skills canvas to `css/style.css`
  - Append the three rules from the design's "CSS additions" block:
    - `#skills { position: relative; overflow: hidden; }`
    - `#skills-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }`
    - `#skills > .container { position: relative; z-index: 1; }`
  - Verify the existing `.skill-category` cards and heading remain visible above the canvas layer
  - _Requirements: 1.2, 8.3, 8.4_

- [x] 2. Implement particle measurement and initialisation helpers
  - [x] 2.1 Implement `measureParticle(ctx, label)`
    - Use `ctx.measureText(label)` to get text width
    - Add `PADDING_X * 2` to width and `PADDING_Y * 2 + line-height` to height
    - Return `{ width, height }` — both values must be positive and non-zero
    - Set canvas font to `FONT` constant before measuring
    - _Requirements: 2.4_

  - [x] 2.2 Implement `createParticle(label, x, y, vx, vy, width, height)`
    - Return a plain object with all seven fields as specified in the design's Particle typedef
    - _Requirements: 2.1, 2.3_

  - [x] 2.3 Implement `initParticles(ctx, canvasWidth, canvasHeight, labels)`
    - Deduplicate the `labels` array using `new Set(labels)`
    - For each unique label, call `measureParticle` to get dimensions
    - Place each particle at a random position fully within canvas bounds:
      - `x` in `[0, canvasWidth - width]`
      - `y` in `[0, canvasHeight - height]`
    - Assign a random direction (angle 0–2π) and speed in `[MIN_SPEED, MAX_SPEED]` (0.5–1.5 px/frame)
    - Return the array of `Particle` objects
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.4 Write property test for `initParticles` — Property 1: particles initialised fully within canvas bounds
    - **Property 1: Particles are initialised fully within canvas bounds**
    - **Validates: Requirements 2.2, 1.5**
    - Generate random canvas dimensions (width 200–2000, height 200–1500) and label arrays (1–40 labels, 1–20 chars each)
    - Assert every particle satisfies `x >= 0 && y >= 0 && x + width <= canvasWidth && y + height <= canvasHeight`

  - [x] 2.5 Write property test for `initParticles` — Property 2: particle speed within specified range
    - **Property 2: Particle speed is within the specified range**
    - **Validates: Requirements 2.3**
    - Generate same inputs as Property 1
    - Assert `Math.hypot(p.vx, p.vy)` is in `[0.5, 1.5]` for every particle

  - [x] 2.6 Write property test for `initParticles` — Property 3: one particle per unique label
    - **Property 3: One particle is created per unique label**
    - **Validates: Requirements 2.1**
    - Generate random arrays of label strings (1–50 labels, may contain duplicates)
    - Assert particle count equals `new Set(labels).size`

- [x] 3. Implement the physics step
  - [x] 3.1 Implement `reflectBoundaries(particle, canvasWidth, canvasHeight)`
    - Negate `vx` and clamp `x` when the particle crosses the left (`x < 0`) or right (`x + width > canvasWidth`) boundary
    - Negate `vy` and clamp `y` when the particle crosses the top (`y < 0`) or bottom (`y + height > canvasHeight`) boundary
    - After clamping, the particle's bounding rectangle must be fully within canvas bounds
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.2 Write property test for `reflectBoundaries` — Property 5: boundary reflection keeps particles in bounds
    - **Property 5: Boundary reflection keeps particles in bounds**
    - **Validates: Requirements 4.3**
    - Generate random canvas dimensions and particles whose positions may be out of bounds
    - Assert that after `reflectBoundaries` the particle satisfies `x >= 0 && y >= 0 && x + width <= canvasWidth && y + height <= canvasHeight`

  - [x] 3.3 Write property test for `reflectBoundaries` — Property 6: boundary reflection negates correct velocity component
    - **Property 6: Boundary reflection negates correct velocity component**
    - **Validates: Requirements 4.1, 4.2**
    - Generate particles placed at or beyond each of the four boundaries with known velocities
    - Assert the perpendicular velocity component is negated; the parallel component is unchanged
    - Assert a particle that does not cross any boundary has its velocity unchanged

  - [x] 3.4 Implement `resolveCollisions(particles)`
    - O(n²) pairwise AABB overlap check: two particles overlap when their bounding rectangles intersect
    - On overlap: swap the full velocity vectors of the two particles
    - After swapping: separate the pair along the axis of minimum overlap so their bounding rectangles no longer touch
    - Resolve each overlapping pair independently in sequence
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 3.5 Write property test for `resolveCollisions` — Property 7: no overlap after collision resolution
    - **Property 7: After collision resolution, no two particles overlap**
    - **Validates: Requirements 5.2**
    - Generate random lists of particles whose positions may overlap
    - Assert that after `resolveCollisions` no two particles have overlapping AABBs

  - [x] 3.6 Write property test for `resolveCollisions` — Property 8: collision resolution performs velocity exchange
    - **Property 8: Collision resolution performs a velocity exchange**
    - **Validates: Requirements 5.1**
    - Generate two particles that are guaranteed to overlap
    - Record `vx`/`vy` of both before the call
    - Assert that after `resolveCollisions` particle A's velocity equals particle B's pre-call velocity and vice versa

  - [x] 3.7 Implement `updateParticles(particles, canvasWidth, canvasHeight)`
    - For each particle, add `vx` to `x` and `vy` to `y` (position update step)
    - Call `reflectBoundaries` on each particle
    - Call `resolveCollisions` on the full particle array
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 5.3_

  - [x] 3.8 Write property test for the position update step — Property 4: position update adds velocity to position
    - **Property 4: Position update adds velocity to position**
    - **Validates: Requirements 3.1**
    - Generate a random particle with arbitrary position and velocity; use a canvas large enough that no boundary reflection occurs
    - Assert that after one `updateParticles` call `newX === oldX + vx` and `newY === oldY + vy`

- [x] 4. Checkpoint — run all property tests
  - Ensure all tests pass, ask the user if questions arise.
  - Run: `node --import ./tests/dom-stub.js tests/skills-animation.test.js`

- [x] 5. Implement `renderParticles(ctx, particles)`
  - Clear the canvas with `ctx.clearRect` before drawing
  - For each particle, draw a pill-shaped rounded rectangle using the visual constants from the design:
    - Fill: `BG_COLOR` (`rgba(0, 200, 255, 0.08)`)
    - Stroke: `BORDER_COLOR` (`rgba(0, 200, 255, 0.25)`)
    - Border radius: `BORDER_RADIUS` (9999 px, clamped to half the shorter dimension)
    - Font: `FONT` (`'500 0.875rem "Segoe UI", system-ui, sans-serif'`)
    - Text fill: `TEXT_COLOR` (`#66dfff`)
    - Text baseline: `middle`, text align: `center`
  - _Requirements: 2.4, 3.3, 8.1, 8.2_

- [x] 6. Implement `initSkillsAnimation()` and wire it into the `DOMContentLoaded` handler
  - [x] 6.1 Add the reduced-motion guard
    - Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
    - Return early (no canvas injected) when true
    - Where the media query API is unavailable, proceed normally
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Inject the `<canvas>` element and set up the rendering context
    - Query `document.getElementById('skills')`; return early if not found
    - Query all `.skill-tag` elements inside `#skills`; return early if none found
    - Create a `<canvas>` element, set `id="skills-canvas"` and `aria-hidden="true"`
    - Insert it as the first child of `#skills`
    - Obtain the 2D context; return early if `getContext('2d')` returns null
    - _Requirements: 1.1, 1.3, 8.4_

  - [x] 6.3 Read skill labels, initialise particles, and start the animation loop
    - Extract `textContent.trim()` from each `.skill-tag` element to build the labels array
    - Size the canvas to match `#skills` dimensions
    - Call `initParticles` to create the particle list
    - Implement the `requestAnimationFrame` loop: call `updateParticles` then `renderParticles` on each frame; skip both when `paused === true`
    - _Requirements: 2.1, 3.1, 3.2, 3.3_

  - [x] 6.4 Add IntersectionObserver for pause/resume
    - When `#skills` leaves the viewport set `paused = true`; when it re-enters set `paused = false`
    - If `IntersectionObserver` is unavailable, run the loop continuously
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.5 Add ResizeObserver (with `window.resize` fallback) for canvas resize
    - On resize: update canvas dimensions to match `#skills`, then call `initParticles` again to re-initialise all particles
    - Guard against zero-dimension canvas (skip re-init if width or height is 0)
    - If `ResizeObserver` is unavailable, fall back to `window.addEventListener('resize', ...)`
    - _Requirements: 1.4, 1.5_

  - [x] 6.6 Call `initSkillsAnimation()` from the `DOMContentLoaded` handler in `js/main.js`
    - Add the call alongside the existing `initParticles()`, `initBinaryRain()`, etc.
    - _Requirements: 1.1_

- [x] 7. Final checkpoint — run all tests
  - Ensure all tests pass, ask the user if questions arise.
  - Run: `node --import ./tests/dom-stub.js tests/skills-animation.test.js`

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` (already a dev dependency at v3.23.2) and run with `node --import ./tests/dom-stub.js tests/skills-animation.test.js`
- Properties 5 and 6 both test `reflectBoundaries` but verify different invariants (position clamp vs. velocity sign flip) — both are necessary
- The `dom-stub.js` test harness already exists and stubs browser globals for Node.js; it will need to be extended to stub `CanvasRenderingContext2D.measureText` for the skills-animation tests
