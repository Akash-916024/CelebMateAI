/**
 * CelebMate AI — Storage Utilities
 * Helpers for localStorage and sessionStorage with error handling
 * @module utils/storage
 */

/**
 * Safely retrieves and parses a JSON value from localStorage.
 * @param {string} key - The storage key
 * @param {*} fallback - Default value if key is missing or parse fails
 * @returns {*} Parsed value or fallback
 */
export function getLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely stores a JSON-serializable value in localStorage.
 * @param {string} key - The storage key
 * @param {*} value - The value to store (will be JSON-stringified)
 * @returns {boolean} True if stored successfully
 */
export function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a key from localStorage.
 * @param {string} key - The key to remove
 */
export function removeLocal(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* silently ignore */
  }
}

/**
 * Safely retrieves and parses a JSON value from sessionStorage.
 * Used for caching AI responses within a session.
 * @param {string} key - The storage key
 * @param {*} fallback - Default value if key is missing
 * @returns {*} Parsed value or fallback
 */
export function getSession(key, fallback = null) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely stores a value in sessionStorage.
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} True if stored successfully
 */
export function setSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
