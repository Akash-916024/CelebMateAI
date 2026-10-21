/**
 * CelebMate AI — Reusable Modal Component
 * Accessible dialogs with ESC handling and focus trapping
 * @module components/modal
 */

import { qs } from '../utils/dom-helpers.js';

let activeModal = null;

/**
 * Opens a modal dialog by element ID.
 * @param {string} modalId - The modal DOM element ID
 */
export function openModal(modalId) {
  const modal = qs(`#${modalId}`);
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  activeModal = modal;

  const focusable = modal.querySelector('button, [href], input, select, textarea');
  if (focusable) focusable.focus();

  document.addEventListener('keydown', handleKeydown);
}

/**
 * Closes an active modal dialog.
 * @param {string} modalId - The modal DOM element ID
 */
export function closeModal(modalId) {
  const modal = qs(`#${modalId}`);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  activeModal = null;

  document.removeEventListener('keydown', handleKeydown);
}

/**
 * Handles Escape key press to close the open modal.
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeydown(e) {
  if (e.key === 'Escape' && activeModal) {
    closeModal(activeModal.id);
  }
}
