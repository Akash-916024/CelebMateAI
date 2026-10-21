/**
 * CelebMate AI — AI Chat Assistant Feature
 * Interactive conversational advisor for customized celebration ideas
 * @module features/chat-assistant
 */

import { qs, createElement } from '../utils/dom-helpers.js';
import { getSession, setSession, getLocal } from '../utils/storage.js';
import { STORAGE_KEYS } from '../config.js';
import { sanitizeChatMessage } from '../utils/sanitizer.js';
import { generateContent } from '../ai-engine.js';
import { showToast } from '../components/toast.js';

/**
 * Initializes and mounts the AI Chat Assistant UI.
 */
export function initChatAssistant() {
  const container = qs('#section-chat');
  if (!container) return;

  container.innerHTML = `
    <div class="section-header">
      <h2>AI Celebration Assistant</h2>
      <p class="section-subtitle">Ask questions about rituals, catering menus, vendor questions, and theme ideas.</p>
    </div>
    <div class="card chat-box">
      <div id="chatMessages" class="chat-messages" aria-live="polite"></div>
      <div class="tag-chips">
        <button class="chip-btn quick-chat-prompt" data-prompt="Suggest a 5-course royal Indian vegetarian menu for 250 guests.">🍛 Veg Menu Ideas</button>
        <button class="chip-btn quick-chat-prompt" data-prompt="What are essential rituals and checklist items for a Haldi ceremony?">🌼 Haldi Checklist</button>
        <button class="chip-btn quick-chat-prompt" data-prompt="How do I negotiate photography and mandap vendor packages?">📸 Vendor Tips</button>
      </div>
      <form id="chatForm" class="chat-input-row">
        <input type="text" id="chatInput" class="form-control" placeholder="Ask CelebMate AI anything about your event..." autocomplete="off">
        <button type="submit" class="btn btn-primary" id="sendChatBtn">Send</button>
      </form>
    </div>
  `;

  const form = qs('#chatForm');
  if (form) form.addEventListener('submit', handleSendMessage);

  const chips = container.querySelectorAll('.quick-chat-prompt');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const input = qs('#chatInput');
      if (input && chip.dataset.prompt) {
        input.value = chip.dataset.prompt;
        handleSendMessage(new Event('submit'));
      }
    });
  });

  renderChatHistory();
}

/**
 * Handles sending a chat message to the AI assistant.
 * @param {Event} e - Submit event
 */
async function handleSendMessage(e) {
  if (e) e.preventDefault();
  const input = qs('#chatInput');
  const rawMsg = input ? input.value : '';
  const validation = sanitizeChatMessage(rawMsg);

  if (!validation.safe) {
    if (validation.reason) showToast(validation.reason, 'warning');
    return;
  }

  if (input) input.value = '';
  appendMessage(validation.sanitized, 'user');

  const history = getSession(STORAGE_KEYS.CHAT_HISTORY, []);
  history.push({ text: validation.sanitized, sender: 'user' });
  setSession(STORAGE_KEYS.CHAT_HISTORY, history);

  const eventData = getLocal(STORAGE_KEYS.EVENT_DATA, { eventId: 'wedding', city: 'Mumbai' });
  const prompt = `Context: User is planning an Indian ${eventData.eventId} in ${eventData.city}.\nQuestion: ${validation.sanitized}\nProvide helpful, culturally accurate, concise event planning advice:`;

  const sendBtn = qs('#sendChatBtn');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const aiResponse = await generateContent(prompt);
    appendMessage(aiResponse, 'ai');
    history.push({ text: aiResponse, sender: 'ai' });
    setSession(STORAGE_KEYS.CHAT_HISTORY, history);
  } catch (err) {
    console.error(err);
    appendMessage('Sorry, I encountered an issue generating a response. Please try again.', 'ai');
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/**
 * Appends a message bubble safely to the chat window.
 * @param {string} text - Message text
 * @param {'user'|'ai'} sender - Sender type
 */
function appendMessage(text, sender) {
  const container = qs('#chatMessages');
  if (!container) return;

  const bubble = createElement('div', {
    className: `message-bubble ${sender === 'user' ? 'message-user' : 'message-ai'}`
  }, text);

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

/**
 * Restores session chat history or adds default welcome message.
 */
function renderChatHistory() {
  const history = getSession(STORAGE_KEYS.CHAT_HISTORY, []);
  if (history.length > 0) {
    history.forEach((msg) => appendMessage(msg.text, msg.sender));
  } else {
    appendMessage('Namaste! I am your CelebMate AI planner. How can I assist with your celebration preparations today?', 'ai');
  }
}
