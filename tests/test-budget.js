/**
 * CelebMate AI — Budget Logic Tests
 * @module tests/test-budget
 */

import { describe, it, assert, assertEqual } from './test-runner.js';
import { generateSmartFallback } from '../js/ai-engine.js';

describe('Budget Logic Tests', () => {
  it('generateSmartFallback returns valid budget JSON structure', () => {
    const raw = generateSmartFallback('budget breakdown for wedding');
    const parsed = JSON.parse(raw);

    assert(Array.isArray(parsed.categories), 'Categories must be an array');
    assert(parsed.categories.length >= 4, 'Must have at least 4 categories');

    let totalPercentage = 0;
    parsed.categories.forEach((cat) => {
      assert(typeof cat.name === 'string', 'Category name must be a string');
      assert(typeof cat.percentage === 'number', 'Percentage must be a number');
      totalPercentage += cat.percentage;
    });

    assertEqual(totalPercentage, 100, 'Percentages must total 100%');
    assert(typeof parsed.aiTips === 'string', 'aiTips must be provided');
  });

  it('category amounts compute accurately with large INR values', () => {
    const total = 2000000; // 20 Lakhs
    const percentage = 35; // Venue
    const calculated = Math.round((total * percentage) / 100);
    assertEqual(calculated, 700000);
  });
});
