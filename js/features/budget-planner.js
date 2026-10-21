/**
 * CelebMate AI — Budget Planner Feature
 * AI-powered itemized cost breakdown with Indian cultural event allocations
 * @module features/budget-planner
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS, EVENT_TYPES } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';

/**
 * Initializes and mounts the Budget Planner UI into the budget section.
 */
export function initBudgetPlanner() {
  const container = qs('#section-budget');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>AI Budget Planner</h2>
      <p class="section-subtitle">Intelligent financial allocation tailored to Indian celebration customs and vendor norms.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Budget Parameters</h3>
        <div class="form-group">
          <label for="bpBudgetInput" class="form-label">Total Budget (INR ₹)</label>
          <input type="number" id="bpBudgetInput" class="form-control" value="1500000" min="10000" step="10000">
        </div>
        <div class="form-group">
          <label for="bpGuestsInput" class="form-label">Estimated Guest Count</label>
          <input type="number" id="bpGuestsInput" class="form-control" value="250" min="10" max="10000">
        </div>
        <button id="calculateBudgetBtn" class="btn btn-primary">
          <span aria-hidden="true">✨</span> Generate AI Allocation
        </button>
      </div>

      <div class="card" id="budgetOutputCard">
        <h3>Estimated Allocation</h3>
        <div class="budget-chart-container">
          <div class="budget-donut" id="budgetDonut">
            <div class="donut-inner">
              <span class="donut-total" id="budgetTotalDisplay">₹15,00,000</span>
              <span class="donut-sub">Total Budget</span>
            </div>
          </div>
        </div>
        <div id="budgetBreakdownList"></div>
      </div>
    </div>
  `;

  const calcBtn = qs('#calculateBudgetBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', handleCalculateBudget);
  }

  // Load existing or default
  renderSavedBudget();
}

/**
 * Handles clicking the Calculate Budget button.
 */
async function handleCalculateBudget() {
  const budgetVal = Number(qs('#bpBudgetInput')?.value) || 1500000;
  const guestsVal = Number(qs('#bpGuestsInput')?.value) || 250;
  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding', city: 'Mumbai' });

  const btn = qs('#calculateBudgetBtn');
  if (btn) btn.disabled = true;

  try {
    const prompt = `Provide an itemized budget breakdown in JSON for an Indian ${eventData.eventId} in ${eventData.city} for ${guestsVal} guests with a budget of ₹${budgetVal}. Return JSON with: categories [{name, percentage, note}] and aiTips.`;
    const response = await generateContent(prompt, `budget_${eventData.eventId}_${budgetVal}`);
    
    let parsed;
    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = JSON.parse(response);
    }

    setLocal(STORAGE_KEYS.BUDGET_DATA, { total: budgetVal, ...parsed });
    renderBudgetBreakdown(budgetVal, parsed.categories);
    showToast('AI Budget breakdown generated!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to calculate budget. Please retry.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Renders the categories list and total display.
 * @param {number} total - Total budget in INR
 * @param {Array<{name: string, percentage: number, note: string}>} categories
 */
function renderBudgetBreakdown(total, categories) {
  const totalDisplay = qs('#budgetTotalDisplay');
  if (totalDisplay) {
    totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  const list = qs('#budgetBreakdownList');
  if (!list) return;
  clearChildren(list);

  categories.forEach((cat) => {
    const amount = Math.round((total * cat.percentage) / 100);
    const item = createElement('div', { className: 'budget-item' });

    const left = createElement('div');
    const title = createElement('strong', {}, cat.name);
    const note = createElement('p', { className: 'section-subtitle' }, cat.note || `${cat.percentage}% allocation`);
    left.appendChild(title);
    left.appendChild(note);

    const right = createElement('span', { className: 'stat-value' }, `₹${amount.toLocaleString('en-IN')}`);

    item.appendChild(left);
    item.appendChild(right);
    list.appendChild(item);
  });
}

/**
 * Renders saved budget on load.
 */
function renderSavedBudget() {
  const saved = getLocal(STORAGE_KEYS.BUDGET_DATA);
  if (saved && saved.categories) {
    renderBudgetBreakdown(saved.total || 1500000, saved.categories);
  } else {
    // Generate initial view
    handleCalculateBudget();
  }
}
