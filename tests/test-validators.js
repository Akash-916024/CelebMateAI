/**
 * CelebMate AI — Validator Tests
 * @module tests/test-validators
 */

import { describe, it, assert, assertEqual } from './test-runner.js';
import {
  isNonEmpty,
  isValidNumber,
  validateGuestCount,
  validateBudget,
  validateApiKey
} from '../js/utils/validators.js';

describe('Validators Unit Tests', () => {
  it('isNonEmpty should validate string presence', () => {
    assert(isNonEmpty('Hello'));
    assert(!isNonEmpty('   '));
    assert(!isNonEmpty(''));
    assert(!isNonEmpty(null));
  });

  it('isValidNumber should validate ranges', () => {
    assert(isValidNumber(50, 10, 100));
    assert(!isValidNumber(5, 10, 100));
    assert(!isValidNumber(150, 10, 100));
    assert(!isValidNumber('not-a-number'));
  });

  it('validateGuestCount handles min and max bounds', () => {
    assertEqual(validateGuestCount(100).valid, true);
    assertEqual(validateGuestCount(0).valid, false);
    assertEqual(validateGuestCount(-5).valid, false);
    assertEqual(validateGuestCount(20000).valid, false);
    assertEqual(validateGuestCount(10.5).valid, false);
  });

  it('validateBudget checks minimum INR and upper limits', () => {
    assertEqual(validateBudget(50000).valid, true);
    assertEqual(validateBudget(500).valid, false); // < 1000
    assertEqual(validateBudget(0).valid, false);
    assertEqual(validateBudget(-1000).valid, false);
  });

  it('validateApiKey ensures reasonable key length', () => {
    assertEqual(validateApiKey('AIzaSyExampleKey123456789').valid, true);
    assertEqual(validateApiKey('').valid, false);
    assertEqual(validateApiKey('short').valid, false);
  });
});
