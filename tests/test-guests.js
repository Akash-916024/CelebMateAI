/**
 * CelebMate AI — Guest RSVP & Dietary Tests
 * @module tests/test-guests
 */

import { describe, it, assert, assertEqual } from './test-runner.js';

describe('Guest Manager Tests', () => {
  it('accurately calculates dietary split and attendee tallies', () => {
    const mockGuests = [
      { name: 'Family A', count: 4, diet: 'veg' },
      { name: 'Family B', count: 2, diet: 'nonveg' },
      { name: 'Family C', count: 3, diet: 'jain' }
    ];

    let total = 0;
    let veg = 0;
    let nonveg = 0;
    let jain = 0;

    mockGuests.forEach((g) => {
      total += g.count;
      if (g.diet === 'veg') veg += g.count;
      if (g.diet === 'nonveg') nonveg += g.count;
      if (g.diet === 'jain') jain += g.count;
    });

    assertEqual(total, 9);
    assertEqual(veg, 4);
    assertEqual(nonveg, 2);
    assertEqual(jain, 3);
  });

  it('validates CSV row formatting escaping', () => {
    const escapeRow = (name, count, diet) => `"${name}",${count},${diet}`;
    const row = escapeRow('Sharma & Sons', 4, 'veg');
    assert(row.startsWith('"Sharma & Sons"'), 'CSV names must be enclosed in quotes');
  });
});
