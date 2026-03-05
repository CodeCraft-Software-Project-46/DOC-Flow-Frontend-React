// Working Hours Configuration
// Defines business hours (working days, hours per day), holidays, special days

export interface WorkingHoursConfig {
  workStartTime: string; // HH:mm, e.g. "09:00"
  workEndTime: string; // HH:mm, e.g. "17:00"
  workDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday. e.g., [1,2,3,4,5] = Mon-Fri
  holidays: string[]; // ISO dates of holidays: "2026-03-15", "2026-12-25"
  timeZone?: string; // e.g., "UTC", "America/New_York"
}

export interface WorkingHourStats {
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  estimatedHoursPerWeek: number;
  totalHolidaysPerYear: number;
}

/**
 * Default company working hours configuration
 * Customize per organization
 */
export const DEFAULT_WORKING_HOURS: WorkingHoursConfig = {
  workStartTime: "09:00",
  workEndTime: "17:00",
  workDays: [1, 2, 3, 4, 5], // Monday to Friday
  holidays: [
    // 2026 Public Holidays (customize per country)
    "2026-01-01", // New Year
    "2026-03-17", // St. Patrick's Day (US/Ireland)
    "2026-07-04", // Independence Day (US)
    "2026-12-25", // Christmas
    "2026-12-26", // Boxing Day
  ],
  timeZone: "UTC",
};

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getWorkingHoursPerDay(config: WorkingHoursConfig): number {
  const startMinutes = parseTimeToMinutes(config.workStartTime);
  const endMinutes = parseTimeToMinutes(config.workEndTime);
  const minutes = Math.max(0, endMinutes - startMinutes);
  return Math.round((minutes / 60) * 100) / 100;
}

function getWorkWindowForDay(day: Date, config: WorkingHoursConfig): { start: Date; end: Date } {
  const start = new Date(day);
  const end = new Date(day);

  const startMinutes = parseTimeToMinutes(config.workStartTime);
  const endMinutes = parseTimeToMinutes(config.workEndTime);

  start.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
  end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

  return { start, end };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WORKING HOURS CALCULATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate working hours between two dates, excluding holidays and non-working days
 *
 * @param startDate - Task creation/start time
 * @param endDate - Task completion time
 * @param config - Working hours configuration
 * @returns Number of working hours elapsed
 *
 * Example:
 * - startDate: Mon 9am, endDate: Wed 5pm (8hr/day, Mon-Fri)
 * - Return: (4 hours Mon) + (8 hours Tue) + (9 hours Wed) = 21 hours
 */
export function calculateWorkingHours(
  startDate: Date,
  endDate: Date,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS
): number {
  if (endDate <= startDate) return 0;

  let workingHours = 0;
  const currentDay = new Date(startDate);
  currentDay.setHours(0, 0, 0, 0);

  while (currentDay <= endDate) {
    const dayOfWeek = currentDay.getDay();
    const dateString = currentDay.toISOString().split("T")[0];

    // Check if this is a working day (not weekend) and not a holiday
    const isWorkingDay = config.workDays.includes(dayOfWeek);
    const isHoliday = config.holidays.includes(dateString);

    if (isWorkingDay && !isHoliday) {
      const { start: workStart, end: workEnd } = getWorkWindowForDay(currentDay, config);

      const overlapStart = new Date(Math.max(startDate.getTime(), workStart.getTime()));
      const overlapEnd = new Date(Math.min(endDate.getTime(), workEnd.getTime()));

      if (overlapEnd > overlapStart) {
        const hoursDifference = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);
        workingHours += hoursDifference;
      }
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return Math.round(workingHours * 100) / 100; // Round to 2 decimals
}

/**
 * Check if a specific date is a working day
 */
export function isWorkingDay(date: Date, config: WorkingHoursConfig = DEFAULT_WORKING_HOURS): boolean {
  const dayOfWeek = date.getDay();
  const dateString = date.toISOString().split("T")[0];

  const isWorkingDayOfWeek = config.workDays.includes(dayOfWeek);
  const isNotHoliday = !config.holidays.includes(dateString);

  return isWorkingDayOfWeek && isNotHoliday;
}

/**
 * Add working hours to a date
 * Useful for calculating SLA target deadline
 *
 * @param startDate - Starting date
 * @param hoursToAdd - Number of working hours to add
 * @param config - Working hours configuration
 * @returns New date after adding working hours
 *
 * Example: Add 8 hours to Monday 9am → Returns Tuesday 5pm
 */
export function addWorkingHours(
  startDate: Date,
  hoursToAdd: number,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS
): Date {
  let remaining = hoursToAdd;
  const current = new Date(startDate);

  while (remaining > 0) {
    const dayOfWeek = current.getDay();
    const dateString = current.toISOString().split("T")[0];

    const isWorkingDay = config.workDays.includes(dayOfWeek);
    const isHoliday = config.holidays.includes(dateString);

    if (isWorkingDay && !isHoliday) {
      const { start: workStart, end: workEnd } = getWorkWindowForDay(current, config);

      if (current < workStart) {
        current.setTime(workStart.getTime());
      }

      if (current < workEnd) {
        const availableHours = (workEnd.getTime() - current.getTime()) / (1000 * 60 * 60);
        const consumed = Math.min(remaining, availableHours);
        current.setTime(current.getTime() + consumed * 60 * 60 * 1000);
        remaining -= consumed;
      }

      if (remaining > 0) {
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
    } else {
      // Skip non-working day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }
  }

  return current;
}

/**
 * Get working hours statistics for capacity planning
 */
export function getWorkingHourStats(config: WorkingHoursConfig = DEFAULT_WORKING_HOURS): WorkingHourStats {
  const hoursPerDay = getWorkingHoursPerDay(config);
  const workingDaysPerWeek = config.workDays.length;
  const estimatedHoursPerWeek = workingDaysPerWeek * hoursPerDay;
  const estimatedHolidaysPerYear = config.holidays.length;

  return {
    workingHoursPerDay: hoursPerDay,
    workingDaysPerWeek,
    estimatedHoursPerWeek,
    totalHolidaysPerYear: estimatedHolidaysPerYear,
  };
}

/**
 * Validate working hours configuration
 */
export function validateWorkingHoursConfig(config: WorkingHoursConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!/^\d{2}:\d{2}$/.test(config.workStartTime) || !/^\d{2}:\d{2}$/.test(config.workEndTime)) {
    errors.push("Working start/end time must be in HH:mm format");
  } else {
    const startMinutes = parseTimeToMinutes(config.workStartTime);
    const endMinutes = parseTimeToMinutes(config.workEndTime);
    if (endMinutes <= startMinutes) {
      errors.push("Working end time must be later than start time");
    }
  }

  const derivedHoursPerDay = getWorkingHoursPerDay(config);
  if (derivedHoursPerDay <= 0 || derivedHoursPerDay > 24) {
    errors.push("Derived working hours per day must be between 1 and 24");
  }

  if (config.workDays.length === 0) {
    errors.push("At least one working day must be configured");
  }

  if (config.workDays.some((d) => d < 0 || d > 6)) {
    errors.push("Working day numbers must be 0-6 (Sunday=0, Saturday=6)");
  }

  if (!config.holidays.every((h) => /^\d{4}-\d{2}-\d{2}$/.test(h))) {
    errors.push("Holiday dates must be in ISO format (YYYY-MM-DD)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
