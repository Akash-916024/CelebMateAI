/**
 * CelebMate AI — Theme & Décor Suggester Feature
 * Curated celebration aesthetics, color palettes, and stage designs
 * @module features/theme-suggester
 */

import { qs, createElement, clearChildren } from '../utils/dom-helpers.js';
import { getLocal, setLocal } from '../utils/storage.js';
import { STORAGE_KEYS } from '../config.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';

/**
 * Initializes and mounts the Theme & Décor Suggester UI.
 */
export function initThemeSuggester() {
  const container = qs('#section-themes');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>Theme & Décor Suggester</h2>
      <p class="section-subtitle">Discover stunning Indian celebration aesthetics with harmonized color palettes and styling guides.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>Theme Preferences</h3>
        <div class="form-group">
          <label for="themeSeason" class="form-label">Season / Timing</label>
          <select id="themeSeason" class="form-control">
            <option value="Winter">Winter (Cool, evening lights)</option>
            <option value="Monsoon">Monsoon (Indoor, floral elegance)</option>
            <option value="Summer">Summer (Pastels, outdoor evening)</option>
            <option value="Spring">Spring (Vibrant colors, marigold)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="themeVibe" class="form-label">Style / Aesthetic Preference</label>
          <select id="themeVibe" class="form-control">
            <option value="Royal Heritage">Royal Heritage (Palace & Gold)</option>
            <option value="Modern Pastel">Modern Pastel (Fairy lights & Minimal)</option>
            <option value="Traditional Temple">Traditional Temple (Brass, Bells & Mogra)</option>
            <option value="Bollywood Sangeet">Bollywood Sangeet (Vibrant Neon & Mirrors)</option>
          </select>
        </div>
        <button id="generateThemesBtn" class="btn btn-primary">
          <span aria-hidden="true">✨</span> Generate AI Themes
        </button>
      </div>

      <div class="card">
        <h3>Curated Themes</h3>
        <div id="themesList" class="grid-2"></div>
      </div>
    </div>
  `;

  const btn = qs('#generateThemesBtn');
  if (btn) btn.addEventListener('click', handleGenerateThemes);

  renderSavedThemes();
}

/**
 * Handles requesting theme suggestions from AI.
 */
async function handleGenerateThemes() {
  const season = qs('#themeSeason')?.value || 'Winter';
  const vibe = qs('#themeVibe')?.value || 'Royal Heritage';
  const btn = qs('#generateThemesBtn');

  if (btn) btn.disabled = true;

  try {
    const prompt = `Suggest 3 unique Indian celebration themes for ${season} with ${vibe} vibe. Return a JSON array of objects with: title, colors (array of 3 hex colors), and vibe (brief description).`;
    const response = await generateContent(prompt, `themes_${season}_${vibe}`);

    let themes;
    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      themes = JSON.parse(cleaned);
    } catch {
      themes = JSON.parse(response);
    }

    setLocal(STORAGE_KEYS.THEME_PREFS, themes);
    renderThemeCards(themes);
    showToast('Theme concepts created!', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to generate themes.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

/**
 * Renders theme concept cards with color swatches.
 * @param {Array<{title: string, colors: string[], vibe: string}>} themes
 */
function renderThemeCards(themes) {
  const container = qs('#themesList');
  if (!container) return;
  clearChildren(container);

  themes.forEach((th) => {
    const card = createElement('div', { className: 'card' });

    const title = createElement('h4', {}, th.title);
    const desc = createElement('p', { className: 'section-subtitle' }, th.vibe);

    const swatches = createElement('div', { className: 'swatch-group' });
    (th.colors || ['#E91E63', '#FF9800', '#9C27B0']).forEach((col) => {
      const s = createElement('div', { className: 'swatch' });
      s.style.setProperty('--swatch-bg', col);
      swatches.appendChild(s);
    });

    const selectBtn = createElement('button', {
      className: 'btn btn-secondary btn-sm card-spacing',
      type: 'button'
    }, 'Select Theme');

    selectBtn.addEventListener('click', () => {
      showToast(`Selected "${th.title}" as active theme!`, 'success');
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(swatches);
    card.appendChild(selectBtn);
    container.appendChild(card);
  });
}

/**
 * Restores saved themes or triggers initial generation.
 */
function renderSavedThemes() {
  const saved = getLocal(STORAGE_KEYS.THEME_PREFS);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    renderThemeCards(saved);
  } else {
    handleGenerateThemes();
  }
}
