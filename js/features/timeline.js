/**
 * CelebMate AI — Timeline & Auspicious Dates Feature
 * AI-generated chronological countdown and Panchang-aligned auspicious date explorer
 * @module features/timeline
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS, EVENT_TYPES } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';
import { validateEventDate } from '../utils/validators.js';

/**
 * Initializes and mounts the Timeline & Dates UI into the timeline section.
 */
export function initTimeline() {
  const container = qs('#section-timeline');
  if (!container) return;

  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 6);
  const formattedDate = defaultDate.toISOString().split('T')[0];

  container.innerHTML = `
    <div class="section-header">
      <h2>📅 Smart Timeline & Auspicious Dates</h2>
      <p class="section-subtitle">Countdown planning checklist with regional Panchang date insights.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Event Date & Countdown</h3>
        <div class="form-group">
          <label for="eventDateInput" class="form-label">Target Celebration Date</label>
          <input type="date" id="eventDateInput" class="form-control" value="${formattedDate}">
        </div>
        <button id="generateTimelineBtn" class="btn btn-primary">
          <span aria-hidden="true">📅</span> Generate AI Timeline
        </button>

        <hr class="card-divider card-spacing">
        <h4 class="card-spacing">🕉️ Quick Auspicious Date Suggestions</h4>
        <p class="section-subtitle">Panchang recommendations for your celebration window.</p>
        <button id="quickMuhuratBtn" class="btn btn-secondary btn-sm card-spacing">
          <span aria-hidden="true">✨</span> Explore Auspicious Dates
        </button>
        <div id="timelineMuhuratList" class="muhurat-grid"></div>
      </div>

      <div class="card">
        <h3>Milestone Checklist</h3>
        <div id="timelineList" class="timeline-list"></div>
      </div>
    </div>
  `;

  qs('#generateTimelineBtn')?.addEventListener('click', handleGenerateTimeline);
  qs('#quickMuhuratBtn')?.addEventListener('click', handleQuickMuhurat);

  renderSavedTimeline();
}

/**
 * Handles requesting AI generation for the celebration timeline.
 */
async function handleGenerateTimeline() {
  const dateInput = qs('#eventDateInput')?.value;
  const dateCheck = validateEventDate(dateInput);
  if (!dateCheck.valid) {
    showToast(dateCheck.message, 'warning');
    return;
  }

  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });
  const btn = qs('#generateTimelineBtn');
  if (btn) btn.disabled = true;

  try {
    const prompt = `Generate a JSON array of milestones for planning an Indian ${eventData.eventId} scheduled for ${dateInput}. Each item must have: period (e.g., '6 Months Before'), task, and done (boolean false).`;
    const response = await generateContent(prompt, `timeline_${eventData.eventId}`);

    let items;
    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      items = JSON.parse(cleaned);
    } catch {
      items = JSON.parse(response);
    }

    setLocal(STORAGE_KEYS.TIMELINE_DATA, items);
    renderTimelineItems(items);
    showToast('Timeline checklist generated!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to generate timeline.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Explores auspicious dates and displays them right inside the timeline view.
 */
async function handleQuickMuhurat() {
  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });
  const btn = qs('#quickMuhuratBtn');
  const container = qs('#timelineMuhuratList');
  if (btn) btn.disabled = true;

  try {
    const prompt = `Provide 3 auspicious Muhurat dates for an Indian ${eventData.eventId}. Return strict JSON array with: date, day, tithi, nakshatra, time, significance.`;
    const response = await generateContent(prompt, `muhurat_quick_${eventData.eventId}`);
    let dates;
    try {
      dates = JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      dates = JSON.parse(response);
    }

    if (container) {
      clearChildren(container);
      dates.forEach((d) => {
        const item = createElement('div', { className: 'muhurat-card' });
        item.innerHTML = `
          <div class="muhurat-date-badge">📅 ${d.date} (${d.day})</div>
          <div class="muhurat-meta-row"><span>Shubh Time:</span><span class="muhurat-meta-val">${d.time}</span></div>
          <div class="muhurat-meta-row"><span>Nakshatra:</span><span class="muhurat-meta-val">${d.nakshatra}</span></div>
          <p class="section-subtitle">${d.significance}</p>
        `;
        container.appendChild(item);
      });
    }
    showToast('Auspicious dates loaded!', 'success');
  } catch {
    showToast('Could not load auspicious dates.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Renders the checklist items with interactive completion toggles.
 * @param {Array<{period: string, task: string, done: boolean}>} items
 */
function renderTimelineItems(items) {
  const list = qs('#timelineList');
  if (!list) return;
  clearChildren(list);

  items.forEach((item, index) => {
    const row = createElement('div', {
      className: `timeline-item ${item.done ? 'completed' : ''}`
    });

    const checkbox = createElement('input', {
      type: 'checkbox',
      className: 'timeline-checkbox',
      'aria-label': `Mark task: ${item.task}`
    });
    checkbox.checked = !!item.done;

    checkbox.addEventListener('change', () => {
      items[index].done = checkbox.checked;
      setLocal(STORAGE_KEYS.TIMELINE_DATA, items);
      row.classList.toggle('completed', checkbox.checked);
    });

    const details = createElement('div', { className: 'timeline-details' });
    details.appendChild(createElement('span', { className: 'stat-label' }, item.period));
    details.appendChild(createElement('p', { className: 'timeline-task' }, item.task));

    row.appendChild(checkbox);
    row.appendChild(details);
    list.appendChild(row);
  });
}

/**
 * Loads saved timeline from localStorage on startup.
 */
function renderSavedTimeline() {
  const saved = getLocal(STORAGE_KEYS.TIMELINE_DATA);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    renderTimelineItems(saved);
  } else {
    handleGenerateTimeline();
  }
}
