/**
 * CelebMate AI — Application Bootstrap
 * Orchestrates navigation, state, modal triggers, and feature initialization
 * @module app
 */

import { EVENT_TYPES, CITIES, STORAGE_KEYS } from './config.js';
import { qs, qsa } from './utils/dom-helpers.js';
import { getLocal, setLocal, removeLocal } from './utils/storage.js';
import { openModal, closeModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { initNavigation, switchSection } from './components/navigation.js';

/**
 * Initializes dropdown options for event types and cities.
 */
function initDropdowns() {
  const eventSelect = qs('#eventSelect');
  const citySelect = qs('#citySelect');

  if (eventSelect) {
    Object.values(EVENT_TYPES).forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.icon} ${item.label}`;
      eventSelect.appendChild(opt);
    });
  }

  if (citySelect) {
    CITIES.forEach((cityName) => {
      const opt = document.createElement('option');
      opt.value = cityName;
      opt.textContent = cityName;
      citySelect.appendChild(opt);
    });
  }
}

/**
 * Sets up listeners for the BYOK Gemini API key settings modal.
 */
function initSettingsModal() {
  const openBtn = qs('#openSettingsBtn');
  const closeBtn = qs('#closeSettingsBtn');
  const saveBtn = qs('#saveApiKeyBtn');
  const clearBtn = qs('#clearApiKeyBtn');
  const apiKeyInput = qs('#apiKeyInput');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (apiKeyInput) {
        apiKeyInput.value = getLocal(STORAGE_KEYS.API_KEY, '');
      }
      openModal('settingsModal');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('settingsModal'));
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const val = apiKeyInput ? apiKeyInput.value.trim() : '';
      if (val) {
        setLocal(STORAGE_KEYS.API_KEY, val);
        showToast('Gemini API Key saved securely in browser!', 'success');
      } else {
        removeLocal(STORAGE_KEYS.API_KEY);
        showToast('API Key cleared. Using smart offline simulation.', 'info');
      }
      closeModal('settingsModal');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      removeLocal(STORAGE_KEYS.API_KEY);
      if (apiKeyInput) apiKeyInput.value = '';
      showToast('API Key cleared.', 'info');
      closeModal('settingsModal');
    });
  }
}

/**
 * Handles dashboard quick configuration form and quick action buttons.
 */
function initDashboardActions() {
  const form = qs('#quickEventForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventId = qs('#eventSelect')?.value || 'wedding';
      const city = qs('#citySelect')?.value || 'Mumbai';
      const guests = qs('#guestInput')?.value || 250;
      const budget = qs('#budgetInput')?.value || 1500000;

      const eventData = { eventId, city, guests: Number(guests), budget: Number(budget) };
      setLocal(STORAGE_KEYS.EVENT_DATA, eventData);

      const summary = qs('#dashBudgetSummary');
      if (summary) summary.textContent = `₹${Number(budget).toLocaleString('en-IN')}`;

      showToast('Event settings updated!', 'success');
    });
  }

  const quickBtns = qsa('.quick-action-btn');
  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) {
        const navLink = qs(`.nav-link[data-section="${target}"]`);
        if (navLink) navLink.click();
      }
    });
  });
}

/**
 * Main application bootstrap runner.
 */
document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  initSettingsModal();
  initDashboardActions();
  initNavigation((sectionId) => {
    switchSection(sectionId);
  });
});
