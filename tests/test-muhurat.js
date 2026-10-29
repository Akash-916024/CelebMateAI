/**
 * CelebMate AI — Muhurat & Auspicious Date Tests
 * @module tests/test-muhurat
 */

import { describe, it, assert, assertEqual } from './test-runner.js';
import { generateSmartFallback } from '../js/ai-engine.js';

describe('Muhurat Date Logic Tests', () => {
  it('generateSmartFallback returns valid Muhurat date records', () => {
    const raw = generateSmartFallback('find auspicious muhurat for wedding');
    const parsed = JSON.parse(raw);

    assert(Array.isArray(parsed), 'Muhurat records must be an array');
    assert(parsed.length >= 3, 'Must return at least 3 auspicious windows');

    parsed.forEach((item) => {
      assert(typeof item.date === 'string', 'Date must be a string');
      assert(typeof item.tithi === 'string', 'Tithi must be present');
      assert(typeof item.nakshatra === 'string', 'Nakshatra must be present');
      assert(typeof item.time === 'string', 'Auspicious time window must be defined');
    });
  });

  it('validates Muhurat attributes contain expected keys', () => {
    const raw = generateSmartFallback('muhurat panchang');
    const parsed = JSON.parse(raw);
    const first = parsed[0];
    assertEqual(typeof first.day, 'string');
    assert(first.significance.length > 5, 'Significance note must be descriptive');
  });
});
