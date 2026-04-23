import type { WorkingHoursConfig } from "../types";

/* Helpers */
const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const normalizeDiff = (diff: number): number =>
  diff < 0 ? diff + 24 * 60 : diff;

/* Core */
export const getWorkingHoursPerDay = (
  config: WorkingHoursConfig
): number => {
  const start = toMinutes(config.workStartTime);
  const end = toMinutes(config.workEndTime);

  let diff = end - start;
  if (diff < 0) diff += 24 * 60;   //24 hours in minutes handle overnight shifts

  return Number(diff / 60);
};

/* Validation */
export const validateWorkingHoursConfig = (
  config: WorkingHoursConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const start = toMinutes(config.workStartTime);
  const end = toMinutes(config.workEndTime);

  const hours = normalizeDiff(end - start) / 60;

  if (hours <= 0 || hours > 24) {
    errors.push("Working hours must be between 1 and 24 hours");
  }

  if (config.workDays.length === 0) {
    errors.push("At least one working day required");
  }

  if (!config.holidays.every((h) => /^\d{4}-\d{2}-\d{2}$/.test(h))) {
    errors.push("Invalid holiday format (YYYY-MM-DD required)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};