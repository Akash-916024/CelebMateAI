/**
 * CelebMate AI — Muhurat & Auspicious Date Finder Feature
 * Recommends auspicious celebration dates based on Indian Panchang traditions
 * @module features/muhurat
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS, EVENT_TYPES } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';

/**
 * Initializes and mounts the Muhurat Finder UI.
 */
export function initMuhuratFinder() {
  const container = qs('#section-muhurat');
  if (!container) return;

  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });

  container.innerHTML = `
    <div class="section-header">
      <h2>🕉️ Auspicious Date & Muhurat Finder</h2>
      <p class="section-subtitle">Discover favorable dates, tithis, and nakshatras aligned with Vedic and regional traditions.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Calendar & Season Preferences</h3>
        <div class="form-group">
          <label for="muhuratMonth" class="form-label">Target Timeframe</label>
          <select id="muhuratMonth" class="form-control">
            <option value="November - December 2026">Late 2026 (Nov - Dec 2026 / Karthigai / Margazhi)</option>
            <option value="January - March 2027">Early 2027 (Jan - Mar 2027 / Thai / Masi)</option>
            <option value="April - June 2027">Mid 2027 (Apr - Jun 2027 / Chithirai / Vaikasi)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="muhuratTradition" class="form-label">Regional Tradition</label>
          <select id="muhuratTradition" class="form-control">
            <option value="Pan-Indian Vedic Panchang">Pan-Indian Vedic Panchang</option>
            <option value="South Indian Tamil Subha Muhurtham">South Indian Tamil (Subha Muhurtham)</option>
            <option value="Telugu & Kannada Panchangam">Telugu & Kannada Panchangam</option>
            <option value="Malayalam Kollavarsham Muhurtham">Malayalam (Kollavarsham / Nalla Neram)</option>
          </select>
        </div>
        <button id="findMuhuratBtn" class="btn btn-primary"><span aria-hidden="true">✨</span> Find Auspicious Dates</button>
      </div>

      <div class="card">
        <h3>Recommended Auspicious Windows</h3>
        <div id="muhuratResultsList" class="muhurat-grid"></div>
      </div>
    </div>
  `;

  qs('#findMuhuratBtn')?.addEventListener('click', handleFindMuhurat);
  renderSavedMuhurat();
}

/**
 * Handles requesting auspicious dates from the AI engine.
 */
async function handleFindMuhurat() {
  const timeframe = qs('#muhuratMonth')?.value || 'Late 2026';
  const tradition = qs('#muhuratTradition')?.value || 'Pan-Indian Vedic Panchang';
  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });
  const eventConfig = Object.values(EVENT_TYPES).find((e) => e.id === eventData.eventId);
  const eventLabel = eventConfig ? eventConfig.label : 'Wedding';

  const btn = qs('#findMuhuratBtn');
  if (btn) btn.disabled = true;

  try {
    const prompt = `Provide 3 auspicious Muhurat dates for an Indian ${eventLabel} in ${timeframe} following ${tradition}.
Return a strict JSON array of objects with: date, day, tithi, nakshatra, time (e.g. 09:30 AM - 11:45 AM), and significance.`;

    const response = await generateContent(prompt, `muhurat_${eventData.eventId}_${timeframe}_${tradition}`);
    let dates;
    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      dates = JSON.parse(cleaned);
    } catch {
      dates = JSON.parse(response);
    }

    setLocal(STORAGE_KEYS.MUHURAT_DATA, dates);
    renderMuhuratCards(dates);
    showToast('Auspicious dates discovered!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to calculate muhurat dates.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Renders auspicious date cards with Panchang details and selection action.
 * @param {Array<{date: string, day: string, tithi: string, nakshatra: string, time: string, significance: string}>} dates
 */
function renderMuhuratCards(dates) {
  const list = qs('#muhuratResultsList');
  if (!list) return;
  clearChildren(list);

  dates.forEach((item) => {
    const card = createElement('div', { className: 'muhurat-card' });

    const badge = createElement('div', { className: 'muhurat-date-badge' }, `📅 ${item.date} (${item.day})`);
    const timeRow = createElement('div', { className: 'muhurat-meta-row' });
    timeRow.innerHTML = `<span>Shubh Time:</span><span class="muhurat-meta-val">${item.time}</span>`;

    const nakshatraRow = createElement('div', { className: 'muhurat-meta-row' });
    nakshatraRow.innerHTML = `<span>Nakshatra:</span><span class="muhurat-meta-val">${item.nakshatra}</span>`;

    const tithiRow = createElement('div', { className: 'muhurat-meta-row' });
    tithiRow.innerHTML = `<span>Tithi:</span><span class="muhurat-meta-val">${item.tithi}</span>`;

    const desc = createElement('p', { className: 'section-subtitle card-spacing' }, item.significance);

    const selectBtn = createElement('button', {
      className: 'btn btn-secondary btn-sm card-spacing',
      type: 'button'
    }, 'Select as Event Date');

    selectBtn.addEventListener('click', () => {
      showToast(`Selected ${item.date} as your celebration date!`, 'success');
    });

    card.appendChild(badge);
    card.appendChild(timeRow);
    card.appendChild(nakshatraRow);
    card.appendChild(tithiRow);
    card.appendChild(desc);
    card.appendChild(selectBtn);
    list.appendChild(card);
  });
}

/**
 * Loads saved muhurat list or runs initial lookup.
 */
function renderSavedMuhurat() {
  const saved = getLocal(STORAGE_KEYS.MUHURAT_DATA);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    renderMuhuratCards(saved);
  } else {
    handleFindMuhurat();
  }
}
