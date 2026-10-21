/**
 * CelebMate AI — AI Engine
 * Integrates with Google Gemini 3.1 Flash Lite API with BYOK & mock fallback
 * @module ai-engine
 */

import { GEMINI_API_BASE, GEMINI_MODEL, STORAGE_KEYS } from './config.js';
import { getLocal, getSession, setSession } from './utils/storage.js';

/**
 * Retrieves the user-provided Gemini API key from local storage.
 * @returns {string} The API key or empty string
 */
export function getApiKey() {
  return getLocal(STORAGE_KEYS.API_KEY, '');
}

/**
 * Calls Gemini 3.1 Flash Lite API or falls back to smart offline generator.
 * @param {string} prompt - The prompt to send
 * @param {string} [cacheKey] - Optional session cache key
 * @returns {Promise<string>} The generated text response
 */
export async function generateContent(prompt, cacheKey = '') {
  if (cacheKey) {
    const cached = getSession(cacheKey);
    if (cached) return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return generateSmartFallback(prompt);
  }

  const endpoint = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error('Empty response from Gemini');

    if (cacheKey) setSession(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('Gemini API call failed, using intelligent fallback:', err);
    return generateSmartFallback(prompt);
  }
}

/**
 * Generates structured JSON or content from prompt using intelligent domain heuristics.
 * Ensures the app works 100% seamlessly even without an external API key.
 * @param {string} prompt - The request prompt
 * @returns {string} Simulated response
 */
export function generateSmartFallback(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes('budget')) {
    return JSON.stringify({
      categories: [
        { name: 'Venue & Mandap', percentage: 35, note: 'Banquet hall/lawn booking' },
        { name: 'Catering & Dining', percentage: 25, note: 'Multi-cuisine traditional buffet' },
        { name: 'Decoration & Florals', percentage: 15, note: 'Stage, entrance & lighting' },
        { name: 'Photography & Media', percentage: 10, note: 'Candid & cinematic coverage' },
        { name: 'Attire & Makeup', percentage: 8, note: 'Traditional wear & artists' },
        { name: 'Miscellaneous & Pandit/Priest', percentage: 7, note: 'Ritual items & buffer' }
      ],
      aiTips: 'Book vendors 4 months early to secure off-peak discounts in your chosen city.'
    });
  }

  if (lower.includes('timeline')) {
    return JSON.stringify([
      { period: '6 Months Before', task: 'Finalize venue and auspicious muhurat / date', done: false },
      { period: '4 Months Before', task: 'Book catering and primary photographer', done: false },
      { period: '2 Months Before', task: 'Send out digital invitations & track RSVPs', done: false },
      { period: '3 Weeks Before', task: 'Final dress trials and theme décor check', done: false },
      { period: '1 Week Before', task: 'Confirm schedule with Pandit/DJ and prepare puja list', done: false },
      { period: 'Day of Event', task: 'Enjoy the celebration and cherish memories!', done: false }
    ]);
  }

  if (lower.includes('invitation')) {
    return 'With joyful hearts and blessings of our elders, we warmly invite you to celebrate with us! Your gracious presence will make this auspicious occasion truly unforgettable.';
  }

  if (lower.includes('theme') || lower.includes('decor')) {
    return JSON.stringify([
      { title: 'Royal Marigold & Crimson', colors: ['#D81B60', '#FFA000', '#FFD54F'], vibe: 'Traditional vibrant palace look' },
      { title: 'Pastel Garden Dream', colors: ['#F8BBD0', '#E1BEE7', '#C8E6C9'], vibe: 'Modern subtle elegance with fairy lights' },
      { title: 'Golden Temple Heritage', colors: ['#FFB300', '#BF360C', '#FFF8E1'], vibe: 'Auspicious South/North classic motifs' }
    ]);
  }

  return 'I am your CelebMate AI planning companion! Ask me anything regarding themes, regional dishes, rituals, or budget balancing.';
}
