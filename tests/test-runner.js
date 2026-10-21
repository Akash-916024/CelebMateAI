/**
 * CelebMate AI — Lightweight In-Browser Test Runner
 * Minimal assertion framework for running client-side unit & integration tests
 * @module tests/test-runner
 */

export const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  suites: []
};

let currentSuite = null;

/**
 * Declares a test suite.
 * @param {string} name - Suite name
 * @param {Function} fn - Suite definition callback
 */
export function describe(name, fn) {
  currentSuite = { name, tests: [] };
  testResults.suites.push(currentSuite);
  fn();
}

/**
 * Declares an individual test case.
 * @param {string} description - Test description
 * @param {Function} fn - Test execution callback
 */
export function it(description, fn) {
  testResults.total += 1;
  try {
    fn();
    testResults.passed += 1;
    if (currentSuite) {
      currentSuite.tests.push({ description, status: 'pass' });
    }
  } catch (error) {
    testResults.failed += 1;
    if (currentSuite) {
      currentSuite.tests.push({
        description,
        status: 'fail',
        error: error.message || String(error)
      });
    }
  }
}

/**
 * Asserts that a condition is true.
 * @param {boolean} condition
 * @param {string} [message]
 */
export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Asserts strict equality between two values.
 * @param {*} actual
 * @param {*} expected
 * @param {string} [message]
 */
export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
  }
}
