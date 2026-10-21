/**
 * CelebMate AI — Input Validation Utilities
 * Validates user inputs before processing or sending to AI
 * @module utils/validators
 */

/**
 * Checks if a string is non-empty after trimming.
 * @param {string} value - The string to check
 * @returns {boolean} True if the string has content
 */
export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates that a number is positive and within a range.
 * @param {number} value - The number to validate
 * @param {number} [min=1] - Minimum allowed value
 * @param {number} [max=100000] - Maximum allowed value
 * @returns {boolean} True if valid
 */
export function isValidNumber(value, min = 1, max = 100000) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Validates guest count is within reasonable range.
 * @param {number} count - Number of guests
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateGuestCount(count) {
  const num = Number(count);
  if (isNaN(num) || num < 1) {
    return { valid: false, message: 'Guest count must be at least 1' };
  }
  if (num > 10000) {
    return { valid: false, message: 'Guest count cannot exceed 10,000' };
  }
  if (!Number.isInteger(num)) {
    return { valid: false, message: 'Guest count must be a whole number' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates budget amount in INR.
 * @param {number} amount - Budget amount in rupees
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateBudget(amount) {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, message: 'Budget must be a positive number' };
  }
  if (num < 1000) {
    return { valid: false, message: 'Minimum budget is ₹1,000' };
  }
  if (num > 100000000) {
    return { valid: false, message: 'Budget cannot exceed ₹10 Crore' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates an event date is in the future.
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateEventDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { valid: false, message: 'Please select a valid date' };
  }
  const eventDate = new Date(dateStr);
  if (isNaN(eventDate.getTime())) {
    return { valid: false, message: 'Invalid date format' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eventDate < today) {
    return { valid: false, message: 'Event date must be in the future' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates API key format (basic check — not empty, reasonable length).
 * @param {string} key - The API key to validate
 * @returns {{ valid: boolean, message: string }} Validation result
 */
export function validateApiKey(key) {
  if (!key || typeof key !== 'string') {
    return { valid: false, message: 'API key is required' };
  }
  const trimmed = key.trim();
  if (trimmed.length < 10) {
    return { valid: false, message: 'API key appears too short' };
  }
  if (trimmed.length > 256) {
    return { valid: false, message: 'API key appears too long' };
  }
  return { valid: true, message: '' };
}
