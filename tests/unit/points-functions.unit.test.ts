import { describe, expect, it, test } from 'vitest';

import { calculateMintedPointsHourly } from '../../src/app/functions/points-functions';

// Ensure this function is exported in your module

describe('Points Calculation for Token Transactions', function () {
  it('Should accurately calculate points for minting and burning within the same hour', async function () {
    const events = [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0x123',
        amount: 100,
        timestamp: 1650000000,
      },
      {
        from: '0x123',
        to: '0x0000000000000000000000000000000000000000',
        amount: 50,
        timestamp: 1650000200,
      },
    ];

    const expectedResults = {
      '0x123': {
        1650000000: 50, // Points are 100 minted - 50 burned
      },
    };

    const results = {};
    calculateMintedPointsHourly(events, results); // Assume this function now modifies `results`
    expect(results).to.deep.equal(expectedResults);
  });

  it('Should handle multiple hours and addresses correctly', async function () {
    const events = [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0x123',
        amount: 200,
        timestamp: 1650003600,
      },
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0x456',
        amount: 300,
        timestamp: 1650007200,
      },
    ];

    const expectedResults = {
      '0x123': {
        1650003600: 200,
      },
      '0x456': {
        1650007200: 300,
      },
    };

    const results = {};
    await calculateMintedPointsHourly(events, results);
    expect(results).to.deep.equal(expectedResults);
  });
});

const fixtureData = [
  {
    description: 'Single hour minting and burning',
    events: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xABC',
        amount: 100,
        timestamp: 1609459200,
      }, // Jan 1, 2021, 00:00:00 UTC
      {
        from: '0xABC',
        to: '0x0000000000000000000000000000000000000000',
        amount: 50,
        timestamp: 1609461000,
      }, // Jan 1, 2021, 00:30:00 UTC
    ],
    expected: {
      '0xABC': { 1609459200: 50 },
    },
  },
  {
    description: 'Transactions across different hours',
    events: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xABC',
        amount: 200,
        timestamp: 1609455600,
      }, // Dec 31, 2020, 23:00:00 UTC
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xDEF',
        amount: 300,
        timestamp: 1609462800,
      }, // Jan 1, 2021, 01:00:00 UTC
    ],
    expected: {
      '0xABC': { 1609455600: 200 },
      '0xDEF': { 1609462800: 300 },
    },
  },
  {
    description: 'Boundary condition handling',
    events: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xABC',
        amount: 150,
        timestamp: 1609459199,
      }, // Just before the hour
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xDEF',
        amount: 150,
        timestamp: 1609459200,
      }, // Exactly at the hour
    ],
    expected: {
      '0xABC': { 1609455600: 150 },
      '0xDEF': { 1609459200: 150 },
    },
  },
  {
    description: 'High volume transactions',
    events: [
      {
        from: '0x0000000000000000000000000000000000000000',
        to: '0xABC',
        amount: 1000000,
        timestamp: 1609459200,
      },
      {
        from: '0xABC',
        to: '0x0000000000000000000000000000000000000000',
        amount: 500000,
        timestamp: 1609459300,
      },
    ],
    expected: {
      '0xABC': { 1609459200: 500000 },
    },
  },
];
