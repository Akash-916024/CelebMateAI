/**
 * CelebMate AI — Input Sanitizer
 * XSS prevention utilities for safe DOM rendering
 * @module utils/sanitizer
 */

/**
 * Map of HTML characters that need escaping to prevent XSS.
 * @type {Object<string, string>}
 */
const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;'
};

/**
 * Escapes HTML special characters in a string.
 * Prevents XSS when string must be inserted as HTML.
 * @param {string} str - The string to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Strips all HTML tags from a string.
 * @param {string} str - The string to strip
 * @returns {string} Plain text without HTML tags
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes a string for safe use as text content.
 * Trims, strips HTML, and limits length.
 * @param {string} str - The input string
 * @param {number} [maxLength=5000] - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeText(str, maxLength = 5000) {
  if (typeof str !== 'string') return '';
  const cleaned = stripHtml(str).trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Validates and sanitizes a user's chat message.
 * @param {string} message - The raw user message
 * @returns {{ safe: boolean, sanitized: string, reason: string }}
 */
export function sanitizeChatMessage(message) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { safe: false, sanitized: '', reason: 'Message cannot be empty' };
  }
  const sanitized = sanitizeText(message, 2000);
  if (sanitized.length === 0) {
    return { safe: false, sanitized: '', reason: 'Message contained only HTML' };
  }
  return { safe: true, sanitized, reason: '' };
}
