/**
 * CelebMate AI — Ideas Studio & Multilingual Invitation Feature
 * Crafts personalized, multilingual celebration invitations with cultural warmth & themes
 * @module features/invitation
 */

import { qs } from '../utils/dom-helpers.js';
import { EVENT_TYPES, STORAGE_KEYS } from '../config.js';
import { getLocal } from '../utils/storage.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';
import { isNonEmpty } from '../utils/validators.js';
import { cleanInvitationText } from '../utils/sanitizer.js';
import { exportInvitationToPdf } from '../utils/pdf-printer.js';
import { setupInvitationChips } from '../components/invitation-chips.js';
import { initEventTypeDropdown, updateHonoreeField, loadThemesIntoContainer } from '../components/invitation-helpers.js';

const state = {
  selectedLang: 'english',
  selectedTone: 'traditional'
};

/**
 * Initializes and mounts the Ideas Studio & Invitation Designer UI.
 */
export function initInvitationGenerator() {
  const container = qs('#section-ideas');
  if (!container) return;

  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding' });

  container.innerHTML = `
    <div class="section-header">
      <h2>✨ Ideas Studio & Invitation Designer</h2>
      <p class="section-subtitle">Craft multilingual celebration cards with native PDF export, and explore curated décor themes.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>1. Multilingual Invitation Details</h3>
        <div class="form-group">
          <label for="invEventType" class="form-label">Celebration Type</label>
          <select id="invEventType" class="form-control"></select>
        </div>
        <div class="form-group">
          <label for="invHosts" class="form-label">Host Family / Organizer</label>
          <input type="text" id="invHosts" class="form-control" value="Sharma Family" placeholder="e.g., Sharma Family">
        </div>
        <div class="form-group">
          <label for="invHonoree" class="form-label" id="invHonoreeLabel">Honoree / Name(s)</label>
          <input type="text" id="invHonoree" class="form-control" value="Ananya" placeholder="e.g., Ananya">
        </div>
        <div class="form-group">
          <label class="form-label">Language</label>
          <div class="tag-chips" id="langChips"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Tone</label>
          <div class="tag-chips" id="toneChips"></div>
        </div>
        <button id="generateInvBtn" class="btn btn-primary"><span aria-hidden="true">💌</span> Generate Invitation</button>
      </div>
      <div class="card">
        <h3>Celebration Card Preview</h3>
        <div class="celebration-card" id="invitationCard">
          <div class="card-header-motif" aria-hidden="true">✨ 🪔 🌸 🪔 ✨</div>
          <div class="card-header-title" id="cardHeaderTitle">Celebration Invitation</div>
          <hr class="card-divider">
          <div id="invitationResultText" class="card-message-body">Click 'Generate Invitation' to compose your card message.</div>
          <hr class="card-divider">
          <div class="card-footer" id="cardFooterText">With warm regards & blessings</div>
        </div>
        <div class="card-actions-row">
          <button id="copyInvBtn" class="btn btn-secondary"><span aria-hidden="true">📋</span> Copy to Clipboard</button>
          <button id="downloadPdfBtn" class="btn btn-primary"><span aria-hidden="true">📄</span> Download / Print PDF</button>
        </div>
      </div>
    </div>
    <div class="card card-spacing">
      <div class="modal-header">
        <h3>2. AI Ideas & Theme Explorer</h3>
        <button id="exploreThemesBtn" class="btn btn-secondary btn-sm"><span aria-hidden="true">🎨</span> Refresh Themes</button>
      </div>
      <p class="section-subtitle">Curated color palettes and décor aesthetics matching your celebration.</p>
      <div id="ideasThemesList" class="grid-2 card-spacing"></div>
    </div>
  `;

  initEventTypeDropdown(eventData.eventId);
  setupInvitationChips(qs('#langChips'), qs('#toneChips'), state);

  qs('#generateInvBtn')?.addEventListener('click', handleGenerateInvitation);
  qs('#copyInvBtn')?.addEventListener('click', handleCopyInvitation);
  qs('#downloadPdfBtn')?.addEventListener('click', handleDownloadPdf);
  qs('#exploreThemesBtn')?.addEventListener('click', () => loadThemesIntoContainer('ideasThemesList'));

  window.addEventListener('celebmate:event-updated', (e) => {
    if (e.detail?.eventId) {
      const select = qs('#invEventType');
      if (select) {
        select.value = e.detail.eventId;
        updateHonoreeField(e.detail.eventId);
      }
    }
  });

  loadThemesIntoContainer('ideasThemesList');
}

/**
 * Generates celebration invitation text with AI.
 */
async function handleGenerateInvitation() {
  const hosts = qs('#invHosts')?.value || '';
  const honoree = qs('#invHonoree')?.value || '';
  const eventId = qs('#invEventType')?.value || 'wedding';

  if (!isNonEmpty(hosts) || !isNonEmpty(honoree)) {
    showToast('Please provide both host family and honoree names.', 'warning');
    return;
  }

  const eventConfig = Object.values(EVENT_TYPES).find((e) => e.id === eventId);
  const eventLabel = eventConfig ? eventConfig.label : eventId;
  const genBtn = qs('#generateInvBtn');
  if (genBtn) genBtn.disabled = true;

  try {
    const prompt = `Write a ${state.selectedTone} invitation message in ${state.selectedLang} language from ${hosts} celebrating ${honoree} for a ${eventLabel}.
Strict rules:
1. This is strictly a ${eventLabel} invitation. If Birthday, do NOT mention wedding/marriage/bride/groom. Mention birthday celebration and blessings.
2. Do not use markdown asterisks (**) or bullet points. Use clean text.
3. Include Date, Time, Venue, and RSVP placeholders cleanly.
Return only the message text.`;

    const rawMessage = await generateContent(prompt, `inv_${eventId}_${state.selectedLang}_${state.selectedTone}_${honoree}`);
    const cleanMessage = cleanInvitationText(rawMessage);

    const titleEl = qs('#cardHeaderTitle');
    const resultEl = qs('#invitationResultText');
    const footerEl = qs('#cardFooterText');

    if (titleEl) titleEl.textContent = `${eventConfig ? eventConfig.icon : '🎉'} ${eventLabel} Invitation`;
    if (resultEl) resultEl.textContent = cleanMessage;
    if (footerEl) footerEl.textContent = `Warmly invited by ${hosts}`;

    showToast('Celebration card crafted!', 'success');
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

/**
 * Downloads or prints the invitation card as a formatted PDF.
 */
function handleDownloadPdf() {
  const title = qs('#cardHeaderTitle')?.textContent || 'Celebration Invitation';
  const text = qs('#invitationResultText')?.textContent;
  if (!text || text.includes('Click \'Generate Invitation\'')) {
    showToast('Please generate an invitation first.', 'warning');
    return;
  }
  exportInvitationToPdf(title, text);
}
