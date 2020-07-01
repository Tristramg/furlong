import Worker, { rotations, workersNeeded } from './worker';

test('Rotation that can do a single person', () => {
  expect(rotations(5)).toBe(Math.floor(1600 / 7 / 2));
  expect(rotations(12)).toBe(76);
});

test('How many people needed to run a train', () => {
  expect(workersNeeded(1, 5, 342)).toBe(3);
  expect(workersNeeded(6, 5, 342)).toBe(18);
  expect(workersNeeded(1, 5 + 7, 342)).toBe(6 * 1.5);
  expect(workersNeeded(1, 5 + 6.9, 342)).toBe(6 * 1.5);
  expect(workersNeeded(1, 5 + 7.1, 342)).toBe(6 * 1.5 + 1);
});

test('Generate salaries', () => {
  const worker = new Worker('bob', 40_000, 6);
  const salaries = worker.generate(2010, 2011, 5);
  const perDiem = rotations(5) * 60;
  expect(salaries[2009]).toBeCloseTo((40_000 * 1.42) / 2 + 10_000);
  expect(salaries[2010]).toBeCloseTo(40_000 * 1.42 + perDiem);
  expect(salaries[2011]).toBeCloseTo(40_000 * 1.42 * 1.015 + perDiem);
});
