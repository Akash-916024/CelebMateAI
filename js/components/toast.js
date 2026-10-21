/**
 * CelebMate AI — Toast Notification Component
 * @module components/toast
 */

import { createElement, qs } from '../utils/dom-helpers.js';

let toastContainer = null;

/**
 * Initializes or fetches the toast container element in the DOM.
 * @returns {HTMLElement} The container element
 */
function getContainer() {
  if (!toastContainer) {
    toastContainer = qs('#toastContainer');
    if (!toastContainer) {
      toastContainer = createElement('div', {
        id: 'toastContainer',
        className: 'toast-container',
        'aria-live': 'polite'
      });
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

/**
 * Shows a toast message that automatically dismisses.
 * @param {string} message - Message text
 * @param {'info'|'success'|'warning'|'error'} [type='info'] - Toast category
 * @param {number} [duration=3000] - Duration in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  const container = getContainer();
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';

  const toast = createElement('div', {
    className: 'toast',
    role: 'status'
  });

  const iconSpan = createElement('span', { className: 'toast-icon', 'aria-hidden': 'true' }, icon);
  const textSpan = createElement('span', { className: 'toast-text' }, message);

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}
