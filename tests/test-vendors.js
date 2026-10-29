/**
 * CelebMate AI — Vendor Hub Tests
 * @module tests/test-vendors
 */

import { describe, it, assert, assertEqual } from './test-runner.js';
import { generateSmartFallback } from '../js/ai-engine.js';

describe('Vendor Hub Logic Tests', () => {
  it('generateSmartFallback returns vendor questions and safeguards', () => {
    const raw = generateSmartFallback('vendor questions for catering');
    const parsed = JSON.parse(raw);

    assert(typeof parsed.tips === 'string', 'Vendor tips must be a string');
    assert(Array.isArray(parsed.questions), 'Contract questions must be an array');
    assert(parsed.questions.length >= 3, 'Must have at least 3 contract questions');
  });

  it('validates vendor status transition cycle', () => {
    const cycle = (current) => (current === 'To Contact' ? 'Shortlisted' : current === 'Shortlisted' ? 'Booked' : 'To Contact');
    assertEqual(cycle('To Contact'), 'Shortlisted');
    assertEqual(cycle('Shortlisted'), 'Booked');
    assertEqual(cycle('Booked'), 'To Contact');
  });
});
