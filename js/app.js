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
import { initBudgetPlanner } from './features/budget-planner.js';
import { initTimeline } from './features/timeline.js';
import { initChatAssistant } from './features/chat-assistant.js';
import { initInvitationGenerator } from './features/invitation.js';
import { initThemeSuggester } from './features/theme-suggester.js';

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
 * Updates the dashboard summary card metrics with active celebration data.
 * @param {Object} eventData
 */
function updateDashboardSummary(eventData) {
  const eventConfig = Object.values(EVENT_TYPES).find((e) => e.id === eventData.eventId);
  const eventSummary = qs('#dashEventSummary');
  if (eventSummary) {
    eventSummary.textContent = eventConfig ? `${eventConfig.icon} ${eventConfig.label}` : 'Celebration';
  }

  const budgetSummary = qs('#dashBudgetSummary');
  if (budgetSummary) {
    budgetSummary.textContent = `₹${Number(eventData.budget).toLocaleString('en-IN')}`;
  }
}

/**
 * Handles dashboard quick configuration form and quick action buttons.
 */
function initDashboardActions() {
  const savedData = getLocal(STORAGE_KEYS.EVENT_DATA, {
    eventId: 'wedding',
    city: 'Mumbai',
    guests: 250,
    budget: 1500000
  });

  const eventSelect = qs('#eventSelect');
  const citySelect = qs('#citySelect');
  const guestInput = qs('#guestInput');
  const budgetInput = qs('#budgetInput');

  if (eventSelect) eventSelect.value = savedData.eventId;
  if (citySelect) citySelect.value = savedData.city;
  if (guestInput) guestInput.value = savedData.guests;
  if (budgetInput) budgetInput.value = savedData.budget;

  updateDashboardSummary(savedData);

  const form = qs('#quickEventForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventId = eventSelect?.value || 'wedding';
      const city = citySelect?.value || 'Mumbai';
      const guests = guestInput?.value || 250;
      const budget = budgetInput?.value || 1500000;

      const eventData = { eventId, city, guests: Number(guests), budget: Number(budget) };
      setLocal(STORAGE_KEYS.EVENT_DATA, eventData);
      updateDashboardSummary(eventData);

      window.dispatchEvent(new CustomEvent('celebmate:event-updated', { detail: eventData }));
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
  initBudgetPlanner();
  initTimeline();
  initChatAssistant();
  initInvitationGenerator();
  initThemeSuggester();
});
