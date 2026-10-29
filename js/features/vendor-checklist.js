/**
 * CelebMate AI — Vendor Hub & Checklist Feature
 * Manages celebration vendor hiring, status pipelines, and AI negotiation guidance
 * @module features/vendor-checklist
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';

const DEFAULT_VENDORS = [
  { id: 'v1', category: 'Venue & Mandap', name: 'Royal Grand Banquet & Lawn', status: 'Booked', cost: '₹5,00,000' },
  { id: 'v2', category: 'Catering', name: 'Annapoorna Traditional Feast (Veg/Sadhya)', status: 'Shortlisted', cost: '₹3,50,000' },
  { id: 'v3', category: 'Photography', name: 'Cinematic Memories Studio', status: 'To Contact', cost: '₹1,50,000' },
  { id: 'v4', category: 'Décor & Florals', name: 'Marigold & Mogra Stage Décor', status: 'To Contact', cost: '₹2,00,000' },
  { id: 'v5', category: 'Priest / Pandit', name: 'Vedic Ceremonies & Puja Samagri', status: 'Booked', cost: '₹25,000' }
];

/**
 * Initializes and mounts the Vendor Checklist UI.
 */
export function initVendorHub() {
  const container = qs('#section-vendors');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>🏪 Vendor Hub & Checklist</h2>
      <p class="section-subtitle">Track service providers across key celebration categories with AI negotiation support.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Vendor Pipeline</h3>
        <div id="vendorListContainer"></div>
      </div>

      <div class="card">
        <h3>AI Negotiation Assistant</h3>
        <p class="section-subtitle">Get strategic questions and contract safeguards before confirming vendor advances.</p>
        <div class="form-group">
          <label for="vendorCategorySelect" class="form-label">Vendor Service Type</label>
          <select id="vendorCategorySelect" class="form-control">
            <option value="Catering">Traditional Catering & Dining</option>
            <option value="Venue & Mandap">Venue, Lawn & Mandap</option>
            <option value="Photography">Photography & Videography</option>
            <option value="Decoration">Floral & Stage Décor</option>
          </select>
        </div>
        <button id="getVendorTipsBtn" class="btn btn-primary"><span aria-hidden="true">💡</span> Get Negotiation Strategy</button>
        <div class="glass-panel card-spacing" id="vendorTipsBox">
          <p id="vendorTipsText" class="section-subtitle">Click 'Get Negotiation Strategy' to reveal contract safeguards.</p>
        </div>
      </div>
    </div>
  `;

  qs('#getVendorTipsBtn')?.addEventListener('click', handleGetVendorTips);
  renderVendors();
}

/**
 * Handles fetching negotiation questions and tips for the selected vendor category.
 */
async function handleGetVendorTips() {
  const category = qs('#vendorCategorySelect')?.value || 'Catering';
  const btn = qs('#getVendorTipsBtn');
  const tipsBox = qs('#vendorTipsText');
  if (btn) btn.disabled = true;

  try {
    const prompt = `Give concise vendor negotiation tips and 3 essential contract questions for hiring an Indian event ${category} vendor. Format as clean text without markdown asterisks.`;
    const response = await generateContent(prompt, `vendor_tips_${category}`);
    if (tipsBox) tipsBox.textContent = response.replace(/\*\*/g, '').trim();
    showToast('Negotiation advice updated!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to fetch vendor tips.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Renders interactive vendor cards with pipeline status cycling.
 */
function renderVendors() {
  const container = qs('#vendorListContainer');
  if (!container) return;
  clearChildren(container);

  const vendors = getLocal(STORAGE_KEYS.VENDOR_DATA, DEFAULT_VENDORS);

  vendors.forEach((v, index) => {
    const card = createElement('div', { className: 'vendor-card card-spacing' });

    const top = createElement('div');
    const cat = createElement('span', { className: 'stat-label' }, v.category);
    const title = createElement('h4', {}, v.name);
    top.appendChild(cat);
    top.appendChild(title);

    const bottom = createElement('div', { className: 'card-actions-row' });
    const cost = createElement('span', { className: 'muhurat-meta-val' }, v.cost);

    const statusPill = createElement('button', {
      className: `vendor-status-pill status-${v.status.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'button',
      'aria-label': `Change status for ${v.name}`
    }, v.status);

    statusPill.addEventListener('click', () => {
      const nextStatus = v.status === 'To Contact' ? 'Shortlisted' : v.status === 'Shortlisted' ? 'Booked' : 'To Contact';
      vendors[index].status = nextStatus;
      setLocal(STORAGE_KEYS.VENDOR_DATA, vendors);
      renderVendors();
      showToast(`Updated ${v.name} status to ${nextStatus}`, 'info');
    });

    bottom.appendChild(cost);
    bottom.appendChild(statusPill);

    card.appendChild(top);
    card.appendChild(bottom);
    container.appendChild(card);
  });
}
