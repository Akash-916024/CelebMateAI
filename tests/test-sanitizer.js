/**
 * CelebMate AI — Sanitizer & XSS Prevention Tests
 * @module tests/test-sanitizer
 */

import { describe, it, assert, assertEqual } from './test-runner.js';
import { escapeHtml, stripHtml, sanitizeText, sanitizeChatMessage } from '../js/utils/sanitizer.js';

describe('Sanitizer Security Tests', () => {
  it('escapeHtml should convert dangerous tags and quotes', () => {
    const raw = '<script>alert("xss")</script>';
    const escaped = escapeHtml(raw);
    assert(!escaped.includes('<script>'), 'Script tag should be escaped');
    assert(escaped.includes('&lt;script&gt;'), 'Angle brackets should be escaped');
  });

  it('stripHtml should remove HTML tags completely', () => {
    const raw = '<p>Hello <b>World</b></p>';
    assertEqual(stripHtml(raw), 'Hello World');
  });

  it('sanitizeText should trim and truncate text', () => {
    const raw = '   <span>Clean Content</span>   ';
    assertEqual(sanitizeText(raw, 50), 'Clean Content');
  });

  it('sanitizeChatMessage rejects empty or malicious-only messages', () => {
    const emptyCheck = sanitizeChatMessage('   ');
    assertEqual(emptyCheck.safe, false);

    const scriptOnly = sanitizeChatMessage('<script></script>');
    assertEqual(scriptOnly.safe, false);

    const validMsg = sanitizeChatMessage('What is the venue cost?');
    assertEqual(validMsg.safe, true);
    assertEqual(validMsg.sanitized, 'What is the venue cost?');
  });
});
