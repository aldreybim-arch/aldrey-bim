/**
 * tests/dom-stub.js
 *
 * Minimal DOM stub loaded before js/main.js via --import flag.
 * Provides just enough of the browser globals that main.js references at
 * module-evaluation time, so the pure functions can be imported in Node.js.
 */

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => [],
  };
}

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {};
}
