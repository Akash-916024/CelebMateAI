/**
 * CelebMate AI — AI Engine Integration Tests
 * @module tests/test-ai-engine
 */

import { describe, it, assert } from './test-runner.js';
import { generateSmartFallback, getApiKey } from '../js/ai-engine.js';

describe('AI Engine Integration Tests', () => {
  it('getApiKey retrieves a string', () => {
    const key = getApiKey();
    assert(typeof key === 'string');
  });

  it('generateSmartFallback handles timeline queries correctly', () => {
    const res = generateSmartFallback('generate timeline for wedding');
    const items = JSON.parse(res);
    assert(Array.isArray(items), 'Timeline fallback must return an array');
    assert(items.length > 0, 'Timeline items should not be empty');
    assert(items[0].period && items[0].task, 'Timeline items must have period and task');
  });

  it('generateSmartFallback handles invitation queries', () => {
    const res = generateSmartFallback('write an invitation');
    assert(typeof res === 'string');
    assert(res.length > 20, 'Invitation should be non-trivial');
  });

  it('generateSmartFallback handles theme queries', () => {
    const res = generateSmartFallback('recommend wedding themes and decor');
    const themes = JSON.parse(res);
    assert(Array.isArray(themes), 'Themes must be an array');
    assert(themes[0].colors && Array.isArray(themes[0].colors), 'Theme must have color swatches');
  });
});
