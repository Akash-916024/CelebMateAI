/**
 * CelebMate AI — Guest RSVP & Dietary Management Feature
 * Tracks attendee confirmations, dietary preferences, and guest list exports
 * @module features/guest-manager
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS } from '../config.js';
import { showToast } from '../components/toast.js';
import { isNonEmpty } from '../utils/validators.js';

const DEFAULT_GUESTS = [
  { id: 'g1', name: 'Rajesh & Family', count: 4, diet: 'veg', rsvp: 'Confirmed' },
  { id: 'g2', name: 'Dr. Suresh Nair', count: 2, diet: 'nonveg', rsvp: 'Confirmed' },
  { id: 'g3', name: 'Mehta Parivar', count: 5, diet: 'jain', rsvp: 'Confirmed' },
  { id: 'g4', name: 'Karthik & Friends', count: 3, diet: 'nonveg', rsvp: 'Pending' }
];

/**
 * Initializes and mounts the Guest Manager UI.
 */
export function initGuestManager() {
  const container = qs('#section-guests');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>👥 Guest Management & RSVP Tracker</h2>
      <p class="section-subtitle">Manage guest headcounts, traditional dietary requirements, and CSV export for caterers.</p>
    </div>
    <div class="guest-metrics-bar" id="guestMetricsBar"></div>
    <div class="grid-2">
      <div class="card">
        <h3>Add New Guest</h3>
        <form id="addGuestForm">
          <div class="form-group">
            <label for="guestNameInput" class="form-label">Guest / Family Name</label>
            <input type="text" id="guestNameInput" class="form-control" placeholder="e.g., Sharma Family" required>
          </div>
          <div class="form-group">
            <label for="guestCountInput" class="form-label">Number of Attendees</label>
            <input type="number" id="guestCountInput" class="form-control" value="2" min="1" max="50">
          </div>
          <div class="form-group">
            <label for="guestDietSelect" class="form-label">Dietary Preference</label>
            <select id="guestDietSelect" class="form-control">
              <option value="veg">🌱 Pure Vegetarian</option>
              <option value="nonveg">🍗 Non-Vegetarian</option>
              <option value="jain">🌿 Jain Vegetarian</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary"><span aria-hidden="true">➕</span> Add to Guest List</button>
        </form>
      </div>

      <div class="card">
        <div class="modal-header">
          <h3>Attendee Roster</h3>
          <button id="exportCsvBtn" class="btn btn-secondary btn-sm"><span aria-hidden="true">📥</span> Export CSV</button>
        </div>
        <div id="guestListContainer" class="card-spacing"></div>
      </div>
    </div>
  `;

  qs('#addGuestForm')?.addEventListener('submit', handleAddGuest);
  qs('#exportCsvBtn')?.addEventListener('click', handleExportCsv);

  renderGuestRoster();
}

/**
 * Handles adding a new guest entry to local storage.
 * @param {Event} e - Form submit event
 */
function handleAddGuest(e) {
  e.preventDefault();
  const nameInput = qs('#guestNameInput');
  const countInput = qs('#guestCountInput');
  const dietSelect = qs('#guestDietSelect');

  const name = nameInput ? nameInput.value.trim() : '';
  const count = Number(countInput ? countInput.value : 1) || 1;
  const diet = dietSelect ? dietSelect.value : 'veg';

  if (!isNonEmpty(name)) {
    showToast('Please enter a valid guest name.', 'warning');
    return;
  }

  const guests = getLocal(STORAGE_KEYS.GUEST_DATA, DEFAULT_GUESTS);
  guests.push({
    id: `g_${Date.now()}`,
    name,
    count,
    diet,
    rsvp: 'Confirmed'
  });

  setLocal(STORAGE_KEYS.GUEST_DATA, guests);
  if (nameInput) nameInput.value = '';
  renderGuestRoster();
  showToast(`Added ${name} to the guest list!`, 'success');
}

/**
 * Renders summary metrics and guest item rows.
 */
function renderGuestRoster() {
  const listContainer = qs('#guestListContainer');
  const metricsBar = qs('#guestMetricsBar');
  if (!listContainer || !metricsBar) return;

  const guests = getLocal(STORAGE_KEYS.GUEST_DATA, DEFAULT_GUESTS);

  let totalGuests = 0;
  let vegCount = 0;
  let nonVegCount = 0;
  let jainCount = 0;

  guests.forEach((g) => {
    totalGuests += g.count;
    if (g.diet === 'veg') vegCount += g.count;
    else if (g.diet === 'nonveg') nonVegCount += g.count;
    else if (g.diet === 'jain') jainCount += g.count;
  });

  metricsBar.innerHTML = `
    <div class="card stat-card"><div class="stat-value">${totalGuests}</div><div class="stat-label">Total Attending</div></div>
    <div class="card stat-card"><div class="stat-value">${vegCount}</div><div class="stat-label">🌱 Pure Veg</div></div>
    <div class="card stat-card"><div class="stat-value">${nonVegCount}</div><div class="stat-label">🍗 Non-Veg</div></div>
    <div class="card stat-card"><div class="stat-value">${jainCount}</div><div class="stat-label">🌿 Jain Veg</div></div>
  `;

  clearChildren(listContainer);
  guests.forEach((g, idx) => {
    const row = createElement('div', { className: 'guest-item-row' });
    const info = createElement('div');
    info.innerHTML = `<strong>${g.name}</strong> (${g.count} Guests) <span class="diet-pill diet-${g.diet}">${g.diet.toUpperCase()}</span>`;

    const delBtn = createElement('button', {
      className: 'btn btn-secondary btn-sm',
      type: 'button',
      'aria-label': `Remove ${g.name}`
    }, '✕ Remove');

    delBtn.addEventListener('click', () => {
      guests.splice(idx, 1);
      setLocal(STORAGE_KEYS.GUEST_DATA, guests);
      renderGuestRoster();
      showToast(`Removed ${g.name}`, 'info');
    });

    row.appendChild(info);
    row.appendChild(delBtn);
    listContainer.appendChild(row);
  });
}

/**
 * Generates and downloads a CSV spreadsheet for caterers and venue planners.
 */
function handleExportCsv() {
  const guests = getLocal(STORAGE_KEYS.GUEST_DATA, DEFAULT_GUESTS);
  const rows = [['Name', 'Headcount', 'Dietary Preference', 'RSVP Status']];

  guests.forEach((g) => {
    rows.push([`"${g.name}"`, g.count, g.diet, g.rsvp]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = createElement('a', {
    href: encodedUri,
    download: 'CelebMate_Guest_List.csv'
  });

  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Guest list exported to CSV!', 'success');
}
