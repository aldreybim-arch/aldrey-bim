/* js/validation.js — Pure validation and utility functions (no DOM access) */

/**
 * Validate an email address string using a standard RFC-5321-compatible regex.
 *
 * @param {string} email
 * @returns {boolean} true if the string looks like a valid email address
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

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
 *
 * @param {ContactFormData} formData
 * @returns {ValidationResult}
 */
export function validateForm(formData) {
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

/**
 * Given an array of section elements and a scroll position (scrollY),
 * return the id of the section that is most visible at that scroll position.
 *
 * @param {Array<{id: string, offsetTop: number}>} sections
 * @param {number} scrollY
 * @returns {string|null}
 */
export function getActiveSectionId(sections, scrollY) {
  if (!sections || sections.length === 0) return null;

  let activeSection = sections[0];

  for (const section of sections) {
    if (section.offsetTop <= scrollY + 1) {
      activeSection = section;
    }
  }

  return activeSection.id || null;
}
