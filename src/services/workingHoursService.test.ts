import {
  getWorkingHoursPerDay,
  calculateWorkingHours,
  validateWorkingHoursConfig,
  DEFAULT_WORKING_HOURS,
} from "./workingHoursService";

describe("Working Hours Service", () => {

  test("calculates correct hours per day", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      workStartTime: "09:00",
      workEndTime: "17:00",
    };

    expect(getWorkingHoursPerDay(config)).toBe(8);
  });

  test("calculates minutes correctly (09:00 - 17:58)", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      workEndTime: "17:58",
    };

    expect(getWorkingHoursPerDay(config)).toBeCloseTo(8.97, 2);
  });

  test("returns 0 when end date before start date", () => {
    const start = new Date("2026-01-10");
    const end = new Date("2026-01-09");

    expect(calculateWorkingHours(start, end)).toBe(0);
  });

  test("excludes weekends", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      workDays: [1, 2, 3, 4, 5], // Mon–Fri
    };

    const start = new Date("2026-01-10"); // Saturday
    const end = new Date("2026-01-11");   // Sunday

    expect(calculateWorkingHours(start, end, config)).toBe(0);
  });

  test("excludes holidays", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      holidays: ["2026-01-10"],
    };

    const start = new Date("2026-01-10T09:00:00");
    const end = new Date("2026-01-10T17:00:00");

    expect(calculateWorkingHours(start, end, config)).toBe(0);
  });

  test("validates correct config", () => {
    const result = validateWorkingHoursConfig(DEFAULT_WORKING_HOURS);
    expect(result.valid).toBe(true);
  });

  test("fails when no working days", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      workDays: [],
    };

    const result = validateWorkingHoursConfig(config);
    expect(result.valid).toBe(false);
  });

  test("fails invalid holiday format", () => {
    const config = {
      ...DEFAULT_WORKING_HOURS,
      holidays: ["10-01-2026"],
    };

    const result = validateWorkingHoursConfig(config);
    expect(result.valid).toBe(false);
  });
  //    newly added tests for edge cases can be included here

  test("handles overnight shift (22:00 - 06:00)", () => {
  const config = {
    ...DEFAULT_WORKING_HOURS,
    workStartTime: "22:00",
    workEndTime: "06:00",
  };

  expect(getWorkingHoursPerDay(config)).toBeCloseTo(8, 2);
});


test("handles same start and end time (0 hours)", () => {
  const config = {
    ...DEFAULT_WORKING_HOURS,
    workStartTime: "09:00",
    workEndTime: "09:00",
  };

  expect(getWorkingHoursPerDay(config)).toBe(0);
});

test("partial day calculation", () => {
  const config = DEFAULT_WORKING_HOURS;

  const start = new Date("2026-01-12T10:00:00");
  const end = new Date("2026-01-12T12:00:00");

  expect(calculateWorkingHours(start, end, config)).toBeCloseTo(2, 2);
});

});