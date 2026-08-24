import { describe, it, expect } from 'vitest';
import { getWorkingHours, saveWorkingHours } from '../api/WorkingHoursAPI';

describe('WorkingHoursAPI (basic)', () => {
  it('exports the API functions', () => {
    expect(typeof getWorkingHours).toBe('function');
    expect(typeof saveWorkingHours).toBe('function');
  });
});
