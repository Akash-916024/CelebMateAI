/**
 * CelebMate AI — Invitation Chips Selector Component
 * @module components/invitation-chips
 */

import { createElement } from '../utils/dom-helpers.js';
import { LANGUAGES, TONES } from '../config.js';

/**
 * Sets up and renders language and tone chips.
 * @param {HTMLElement} langBox - Container for language chips
 * @param {HTMLElement} toneBox - Container for tone chips
 * @param {Object} state - State container holding selectedLang and selectedTone
 */
export function setupInvitationChips(langBox, toneBox, state) {
  if (langBox) {
    LANGUAGES.forEach((lang) => {
      const btn = createElement('button', {
        className: `chip-btn ${lang.id === state.selectedLang ? 'active' : ''}`,
        type: 'button'
      }, lang.label);
      btn.addEventListener('click', () => {
        state.selectedLang = lang.id;
        langBox.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      langBox.appendChild(btn);
    });
  }

  if (toneBox) {
    TONES.forEach((tone) => {
      const btn = createElement('button', {
        className: `chip-btn ${tone.id === state.selectedTone ? 'active' : ''}`,
        type: 'button'
      }, `${tone.emoji} ${tone.label}`);
      btn.addEventListener('click', () => {
        state.selectedTone = tone.id;
        toneBox.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      toneBox.appendChild(btn);
    });
  }
}
