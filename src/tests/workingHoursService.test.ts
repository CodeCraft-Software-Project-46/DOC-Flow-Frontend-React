import { describe, it, expect } from 'vitest';
import { getWorkingHoursPerDay, validateWorkingHoursConfig } from '../services/workingHoursService';
import type { WorkingHoursConfig } from '../types';

describe('workingHoursService', () => {
  const mockConfig: WorkingHoursConfig = {
    workStartTime: '09:00',
    workEndTime: '17:00',
    workDays: [1, 2, 3, 4, 5], // Monday to Friday
    holidays: [],
  };

  describe('getWorkingHoursPerDay', () => {
    it('should calculate 8 hours for 09:00 to 17:00', () => {
      const hours = getWorkingHoursPerDay(mockConfig);
      expect(hours).toBe(8);
    });

    it('should calculate 4 hours for overnight shift 22:00 to 02:00', () => {
      const overnightConfig: WorkingHoursConfig = {
        ...mockConfig,
        workStartTime: '22:00',
        workEndTime: '02:00',
      };
      const hours = getWorkingHoursPerDay(overnightConfig);
      expect(hours).toBe(4);
    });

    it('should calculate 6 hours for 08:30 to 14:30', () => {
      const config: WorkingHoursConfig = {
        ...mockConfig,
        workStartTime: '08:30',
        workEndTime: '14:30',
      };
      const hours = getWorkingHoursPerDay(config);
      expect(hours).toBe(6);
    });
  });

  describe('validateWorkingHoursConfig', () => {
    it('should validate correct config', () => {
      const result = validateWorkingHoursConfig(mockConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject config with missing start time', () => {
      const invalidConfig: WorkingHoursConfig = {
        ...mockConfig,
        workStartTime: '',
      };
      const result = validateWorkingHoursConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start time is required');
    });

    it('should reject config with missing end time', () => {
      const invalidConfig: WorkingHoursConfig = {
        ...mockConfig,
        workEndTime: '',
      };
      const result = validateWorkingHoursConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('End time is required');
    });

    it('should reject config with no working days', () => {
      const invalidConfig: WorkingHoursConfig = {
        ...mockConfig,
        workDays: [],
      };
      const result = validateWorkingHoursConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one working day required');
    });

    it('should reject config with same start and end time', () => {
      const invalidConfig: WorkingHoursConfig = {
        ...mockConfig,
        workStartTime: '09:00',
        workEndTime: '09:00',
      };
      const result = validateWorkingHoursConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start and end time cannot be the same');
    });

    it('should reject config with invalid holiday format', () => {
      const invalidConfig: WorkingHoursConfig = {
        ...mockConfig,
        holidays: ['2024-13-45', '2024/01/01'],
      };
      const result = validateWorkingHoursConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid holiday format (YYYY-MM-DD required)');
    });

    it('should accept valid holiday dates', () => {
      const configWithHolidays: WorkingHoursConfig = {
        ...mockConfig,
        holidays: ['2024-01-01', '2024-12-25'],
      };
      const result = validateWorkingHoursConfig(configWithHolidays);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
