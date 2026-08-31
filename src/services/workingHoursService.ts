import type { WorkingHoursConfig } from "../types";

/* Helpers */
const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/* Core */
export const getWorkingHoursPerDay = (
  config: WorkingHoursConfig
): number => {
  const start = toMinutes(config.workStartTime);
  const end = toMinutes(config.workEndTime);

  let diff = end - start;
  if (diff < 0) diff += 24 * 60;   //24 hours in minutes handle overnight shifts        22:00 → 02:00           diff = 120 - 1320 = -1200 ❌ => diff = -1200 + 1440 = 240 ✅ (4 hours)

  return Number(diff / 60);
};

/* Validation */
export const validateWorkingHoursConfig = (
  config: WorkingHoursConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const { workStartTime, workEndTime, workDays } = config;

  if (!workStartTime) errors.push("Start time is required");
  if (!workEndTime) errors.push("End time is required");
  if (workDays.length === 0) errors.push("At least one working day required");

  // ⛔ Stop further calculations if missing
  if (!config.workStartTime || !config.workEndTime || config.workDays.length === 0) {
    return {
      valid: false,
      errors,
    };
  }

  if (workStartTime === workEndTime) {
    errors.push("Start and end time cannot be the same"); //09:00 → 09:00 (0 hours ❌) = invalid configuration no working hours
  } else if (toMinutes(workStartTime) > toMinutes(workEndTime)) {
    // The backend refuses start >= end outright (a window that wraps past
    // midnight would give the SLA engine zero-or-negative hours per day).
    // Catch it here too — otherwise the save round-trips only to come back
    // as a 400 the admin has to decode.
    errors.push("Start time must be earlier than end time");
  }

  if (!config.holidays.every((h) => /^\d{4}-\d{2}-\d{2}$/.test(h))) {
    errors.push("Invalid holiday format (YYYY-MM-DD required)"); //Users can bypass frontend: API tools (Postman), manual DB inserts,
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
 
//<input type="time"> react always returns hours in 24-hour format console.log(e.target.value);
//<select>:
// 2 PM → logs "14:00"
// 11 AM → logs "11:00"
