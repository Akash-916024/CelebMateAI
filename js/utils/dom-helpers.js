/**
 * CelebMate AI — DOM Helper Utilities
 * Safe DOM manipulation functions to avoid XSS
 * @module utils/dom-helpers
 */

/**
 * Safely creates an HTML element with attributes and text content.
 * Uses textContent (not innerHTML) to prevent XSS.
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Key-value pairs of attributes
 * @param {string} [text] - Optional text content
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dKey, dVal]) => {
        el.dataset[dKey] = dVal;
      });
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  if (text) {
    el.textContent = text;
  }
  return el;
}

/**
 * Queries a single element by selector, with optional parent.
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent=document] - Parent element to query within
 * @returns {HTMLElement|null} The matched element or null
 */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Queries all elements matching a selector.
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent=document] - Parent element to query within
 * @returns {HTMLElement[]} Array of matched elements
 */
export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Clears all child nodes from an element safely.
 * @param {HTMLElement} element - The element to clear
 */
export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Shows an element by removing the 'hidden' class.
 * @param {HTMLElement} element - The element to show
 */
export function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
    element.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hides an element by adding the 'hidden' class.
 * @param {HTMLElement} element - The element to hide
 */
export function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
    element.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Creates a debounced version of a function.
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function debouncedFn(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
