/**
 * CelebMate AI — Invitation Message Generator Feature
 * Crafts personalized, multilingual celebration invitations with cultural warmth
 * @module features/invitation
 */

import { qs, createElement } from '../utils/dom-helpers.js';
import { LANGUAGES, TONES } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';
import { isNonEmpty } from '../utils/validators.js';

let selectedLang = 'english';
let selectedTone = 'traditional';

/**
 * Initializes and mounts the Invitation Generator UI.
 */
export function initInvitationGenerator() {
  const container = qs('#section-invitation');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>Multilingual Invitation Generator</h2>
      <p class="section-subtitle">Compose heartfelt invitations in Indian regional languages with custom cultural tones.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Invitation Details</h3>
        <div class="form-group">
          <label for="invHosts" class="form-label">Host Family / Organizer</label>
          <input type="text" id="invHosts" class="form-control" value="Sharma Family" placeholder="e.g., Sharma Family">
        </div>
        <div class="form-group">
          <label for="invCouple" class="form-label">Honoree / Couple Name(s)</label>
          <input type="text" id="invCouple" class="form-control" value="Aarav & Ananya" placeholder="e.g., Aarav & Ananya">
        </div>
        <div class="form-group">
          <label class="form-label">Language</label>
          <div class="tag-chips" id="langChips"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Tone</label>
          <div class="tag-chips" id="toneChips"></div>
        </div>
        <button id="generateInvBtn" class="btn btn-primary">
          <span aria-hidden="true">💌</span> Generate Invitation
        </button>
      </div>

      <div class="card">
        <h3>Crafted Message</h3>
        <div class="glass-panel" id="invitationPreviewBox">
          <p id="invitationResultText" class="section-subtitle">Click 'Generate Invitation' to compose your card message.</p>
        </div>
        <button id="copyInvBtn" class="btn btn-secondary card-spacing">
          <span aria-hidden="true">📋</span> Copy to Clipboard
        </button>
      </div>
    </div>
  `;

  renderChips();

  const genBtn = qs('#generateInvBtn');
  if (genBtn) genBtn.addEventListener('click', handleGenerateInvitation);

  const copyBtn = qs('#copyInvBtn');
  if (copyBtn) copyBtn.addEventListener('click', handleCopyInvitation);
}

/**
 * Renders language and tone chip selectors.
 */
function renderChips() {
  const langBox = qs('#langChips');
  if (langBox) {
    LANGUAGES.forEach((lang) => {
      const btn = createElement('button', {
        className: `chip-btn ${lang.id === selectedLang ? 'active' : ''}`,
        type: 'button'
      }, lang.label);
      btn.addEventListener('click', () => {
        selectedLang = lang.id;
        langBox.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      langBox.appendChild(btn);
    });
  }

  const toneBox = qs('#toneChips');
  if (toneBox) {
    TONES.forEach((tone) => {
      const btn = createElement('button', {
        className: `chip-btn ${tone.id === selectedTone ? 'active' : ''}`,
        type: 'button'
      }, `${tone.emoji} ${tone.label}`);
      btn.addEventListener('click', () => {
        selectedTone = tone.id;
        toneBox.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      toneBox.appendChild(btn);
    });
  }
}

/**
 * Generates invitation text with AI.
 */
async function handleGenerateInvitation() {
  const hosts = qs('#invHosts')?.value || '';
  const honorees = qs('#invCouple')?.value || '';

  if (!isNonEmpty(hosts) || !isNonEmpty(honorees)) {
    showToast('Please provide both host family and honoree names.', 'warning');
    return;
  }

  const genBtn = qs('#generateInvBtn');
  const resultText = qs('#invitationResultText');

  if (genBtn) genBtn.disabled = true;

  try {
    const prompt = `Write a ${selectedTone} celebration invitation message in ${selectedLang} from ${hosts} celebrating ${honorees}. Include warm traditional Indian welcoming phrases and RSVP requests. Return only the invitation text.`;
    const message = await generateContent(prompt, `inv_${selectedLang}_${selectedTone}`);

    if (resultText) {
      resultText.textContent = message.trim();
    }
    showToast('Invitation crafted successfully!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to generate invitation.', 'error');
  } finally {
    if (genBtn) genBtn.disabled = false;
  }
}

/**
 * Copies generated invitation text to clipboard.
 */
async function handleCopyInvitation() {
  const text = qs('#invitationResultText')?.textContent;
  if (!text || text.includes('Click \'Generate Invitation\'')) {
    showToast('Please generate an invitation first.', 'warning');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('Invitation copied to clipboard!', 'success');
  } catch {
    showToast('Could not access clipboard.', 'error');
  }
}
