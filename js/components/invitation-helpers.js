/**
 * CelebMate AI — Invitation & Theme Helpers
 * Event selector, honoree sync, and theme rendering
 * @module components/invitation-helpers
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { EVENT_TYPES, STORAGE_KEYS } from '../config.js';
import { getLocal } from '../utils/storage.js';
import { generateContent } from '../ai-engine.js';

/**
 * Initializes celebration type select options.
 * @param {string} activeId
 */
export function initEventTypeDropdown(activeId) {
  const select = qs('#invEventType');
  if (!select) return;

  Object.values(EVENT_TYPES).forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.icon} ${item.label}`;
    select.appendChild(opt);
  });

  select.value = activeId || 'wedding';
  updateHonoreeField(select.value);
  select.addEventListener('change', () => updateHonoreeField(select.value));
}

/**
 * Updates label and placeholder based on selected event type.
 * @param {string} eventId
 */
export function updateHonoreeField(eventId) {
  const label = qs('#invHonoreeLabel');
  const input = qs('#invHonoree');
  if (!label || !input) return;

  if (eventId === 'birthday') {
    label.textContent = "Birthday Person's Name";
    input.placeholder = 'e.g., Ananya';
    if (!input.value || input.value.includes('&')) input.value = 'Ananya';
  } else if (eventId === 'wedding' || eventId === 'engagement') {
    label.textContent = 'Couple Name(s)';
    input.placeholder = 'e.g., Aarav & Ananya';
    if (!input.value || !input.value.includes('&')) input.value = 'Aarav & Ananya';
  } else {
    label.textContent = 'Honoree / Family Name';
    input.placeholder = 'e.g., Sharma Family';
  }
}

/**
 * Loads AI themes into container.
 */
export async function loadThemesIntoContainer(containerId) {
  const container = qs(`#${containerId}`);
  if (!container) return;
  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });

  try {
    const prompt = `Suggest 2 creative Indian celebration themes for a ${eventData.eventId}. Return JSON array of objects with: title, colors (array of 3 hex colors), vibe.`;
    const response = await generateContent(prompt, `themes_idea_${eventData.eventId}`);
    let themes;
    try {
      themes = JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      themes = JSON.parse(response);
    }
    clearChildren(container);
    themes.forEach((th) => {
      const card = createElement('div', { className: 'card' });
      card.innerHTML = `<h4>${th.title}</h4><p class="section-subtitle">${th.vibe}</p>`;
      const swatches = createElement('div', { className: 'swatch-group' });
      (th.colors || ['#E91E63', '#FF9800', '#9C27B0']).forEach((col) => {
        const s = createElement('div', { className: 'swatch' });
        s.style.setProperty('--swatch-bg', col);
        swatches.appendChild(s);
      });
      card.appendChild(swatches);
      container.appendChild(card);
    });
  } catch {
    /* fallback */
  }
}
