# Requirements Document

## Introduction

This feature adds an animated background to the Skills section of the portfolio website. Skill text labels (the existing `.skill-tag` elements) are extracted from their static card layout and rendered as freely-moving particles on a canvas that fills the Skills section background. Each label moves in a random direction at a constant speed. When two labels collide, they exchange velocity vectors, producing a realistic billiard-ball-style bounce. The animation pauses when the section scrolls out of view and resumes when it re-enters, keeping CPU usage low. The existing Skills section heading and category cards remain visible above the animated canvas layer.

## Glossary

- **Animation_Engine**: The JavaScript module (`initSkillsAnimation`) responsible for creating, updating, and rendering all Skill_Particles on the Skills_Canvas.
- **Skills_Canvas**: The `<canvas>` element positioned as the background of the `#skills` section, behind all existing content.
- **Skill_Particle**: A single animated object representing one skill label (e.g. "Python", "TensorFlow"). It has a position, velocity, and renders as a styled pill matching the existing `.skill-tag` visual design.
- **Collision**: The event that occurs when the bounding rectangles of two Skill_Particles overlap.
- **Velocity_Exchange**: The response to a Collision in which the two Skill_Particles swap their velocity vectors so each continues in the direction the other was travelling.
- **Boundary**: The edge of the Skills_Canvas rectangle (top, right, bottom, left).
- **Boundary_Reflection**: The response to a Skill_Particle reaching a Boundary, in which the perpendicular component of its velocity is negated so it bounces back into the canvas.
- **Reduced_Motion**: The operating-system or browser preference `prefers-reduced-motion: reduce`, indicating the user prefers minimal animation.

## Requirements

### Requirement 1: Skills Canvas Setup

**User Story:** As a visitor, I want to see an animated background in the Skills section, so that the section feels dynamic and visually engaging.

#### Acceptance Criteria

1. THE Animation_Engine SHALL inject a `<canvas>` element (the Skills_Canvas) as the first child of the `#skills` section element.
2. THE Skills_Canvas SHALL be positioned absolutely to fill the full width and height of the `#skills` section, behind all existing child elements.
3. THE Skills_Canvas SHALL carry `aria-hidden="true"` so assistive technologies ignore it.
4. WHEN the `#skills` section is resized, THE Animation_Engine SHALL resize the Skills_Canvas to match the new dimensions of the `#skills` section within one animation frame.
5. THE Animation_Engine SHALL re-initialise all Skill_Particle positions and velocities after a resize event to prevent particles from being stranded outside the canvas bounds.

### Requirement 2: Skill Particle Initialisation

**User Story:** As a visitor, I want to see the actual skill names floating around, so that the animation is informative as well as decorative.

#### Acceptance Criteria

1. THE Animation_Engine SHALL read all `.skill-tag` text content from the `#skills` section and create one Skill_Particle per unique label.
2. WHEN initialised, each Skill_Particle SHALL be placed at a random position within the Skills_Canvas bounds such that the particle is fully visible (no part extends outside the canvas).
3. WHEN initialised, each Skill_Particle SHALL be assigned a random direction (angle uniformly distributed over 0–360°) and a speed within the range of 0.5–1.5 pixels per frame.
4. THE Animation_Engine SHALL render each Skill_Particle as a pill-shaped label using the same font, padding, border-radius, text colour (`--color-primary-light`), background colour (`rgba(0, 200, 255, 0.08)`), and border (`rgba(0, 200, 255, 0.25)`) as the existing `.skill-tag` CSS class.

### Requirement 3: Continuous Movement

**User Story:** As a visitor, I want the skill labels to move continuously around the background, so that the animation feels alive.

#### Acceptance Criteria

1. WHILE the Skills_Canvas is visible in the viewport, THE Animation_Engine SHALL update each Skill_Particle's position by adding its velocity vector to its current position on every animation frame.
2. THE Animation_Engine SHALL use `requestAnimationFrame` to drive the animation loop, targeting the browser's native refresh rate.
3. THE Animation_Engine SHALL clear the Skills_Canvas on each frame before redrawing all Skill_Particles, so no ghost trails are left behind.

### Requirement 4: Boundary Reflection

**User Story:** As a visitor, I want the skill labels to bounce off the edges of the section, so that they stay within the visible area at all times.

#### Acceptance Criteria

1. WHEN a Skill_Particle's leading edge reaches or crosses the left or right Boundary of the Skills_Canvas, THE Animation_Engine SHALL negate the horizontal component of that Skill_Particle's velocity (Boundary_Reflection).
2. WHEN a Skill_Particle's leading edge reaches or crosses the top or bottom Boundary of the Skills_Canvas, THE Animation_Engine SHALL negate the vertical component of that Skill_Particle's velocity (Boundary_Reflection).
3. WHEN a Boundary_Reflection occurs, THE Animation_Engine SHALL reposition the Skill_Particle so that its bounding rectangle is fully within the Skills_Canvas bounds, preventing the particle from tunnelling through the Boundary on the next frame.

### Requirement 5: Collision Detection and Response

**User Story:** As a visitor, I want the skill labels to bounce off each other when they meet, so that the animation looks physically plausible.

#### Acceptance Criteria

1. WHEN the bounding rectangles of two Skill_Particles overlap (a Collision), THE Animation_Engine SHALL perform a Velocity_Exchange between those two Skill_Particles.
2. WHEN a Velocity_Exchange occurs, THE Animation_Engine SHALL separate the two Skill_Particles so their bounding rectangles no longer overlap, preventing repeated Collisions between the same pair on consecutive frames.
3. THE Animation_Engine SHALL check every pair of Skill_Particles for Collisions on each animation frame.
4. IF a Skill_Particle is involved in more than one simultaneous Collision on the same frame, THEN THE Animation_Engine SHALL resolve each Collision independently in sequence.

### Requirement 6: Performance and Visibility

**User Story:** As a visitor, I want the animation to use minimal CPU when the Skills section is not visible, so that the rest of the page remains responsive.

#### Acceptance Criteria

1. WHEN the `#skills` section is not intersecting the viewport, THE Animation_Engine SHALL pause the animation loop.
2. WHEN the `#skills` section re-enters the viewport, THE Animation_Engine SHALL resume the animation loop from the current particle positions.
3. THE Animation_Engine SHALL use `IntersectionObserver` to detect viewport visibility changes for the `#skills` section.
4. IF `IntersectionObserver` is not available in the browser, THEN THE Animation_Engine SHALL run the animation loop continuously without pausing.

### Requirement 7: Accessibility — Reduced Motion

**User Story:** As a visitor who prefers reduced motion, I want the animation to be suppressed, so that I am not affected by distracting or potentially harmful movement.

#### Acceptance Criteria

1. WHEN the browser reports `prefers-reduced-motion: reduce`, THE Animation_Engine SHALL not start the animation loop.
2. WHEN the browser reports `prefers-reduced-motion: reduce`, THE Skills_Canvas SHALL not be injected into the DOM, leaving the Skills section in its original static layout.
3. WHERE the `prefers-reduced-motion` media query is not supported by the browser, THE Animation_Engine SHALL proceed with the animation as normal.

### Requirement 8: Visual Integration

**User Story:** As a visitor, I want the animated background to complement the existing page design, so that the Skills section looks cohesive with the rest of the portfolio.

#### Acceptance Criteria

1. THE Skills_Canvas SHALL use the same dark background colour as the `#skills` section (`--color-bg` or `--color-bg-alt` depending on section order) so no colour mismatch is visible.
2. THE Animation_Engine SHALL render Skill_Particles with a semi-transparent style so the section background colour shows through, matching the translucent aesthetic of the existing `.skill-tag` elements.
3. THE existing `.skill-category` cards and the `#skills-heading` SHALL remain fully visible and interactive above the Skills_Canvas at all times (z-index layering).
4. THE Skills_Canvas SHALL not intercept pointer events, so hover and focus interactions on the `.skill-category` cards and `.skill-tag` elements continue to function normally.
