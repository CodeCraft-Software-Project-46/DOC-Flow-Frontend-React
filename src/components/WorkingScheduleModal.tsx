import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { WorkingHoursConfig } from "../types";
import {
  getWorkingHoursPerDay,
  validateWorkingHoursConfig,
} from "../services/workingHoursService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Rejects when the backend refuses the save, so this modal can stay open
  // and show why instead of closing over a change that never landed.
  onSave: (config: WorkingHoursConfig) => Promise<void>;
  initialConfig: WorkingHoursConfig | null;
  saving: boolean;
}

/* UI editable empty state (first-time setup: no holidays yet either) */
const EMPTY_CONFIG: WorkingHoursConfig = {
  workStartTime: "",
  workEndTime: "",
  workDays: [],
  holidays: [],
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Start time, end time, and working days feed directly into SLA due-date
// math for every task created afterward. Existing tasks are unaffected (a
// task's due date is calculated once and frozen), but changing these mid-
// operation means new and old tasks are silently governed by different
// calendars — worth a deliberate confirmation. This is deliberately its own
// modal, separate from Holidays: this schedule is expected to be set once
// at rollout and rarely touched again, while holidays are routine.
const sameWorkDays = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort().every((d, i) => d === [...b].sort()[i]);

const hasScheduleChanged = (
  next: WorkingHoursConfig,
  previous: WorkingHoursConfig | null,
) =>
  previous !== null &&
  (next.workStartTime !== previous.workStartTime ||
    next.workEndTime !== previous.workEndTime ||
    !sameWorkDays(next.workDays, previous.workDays));

export function WorkingScheduleModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  saving,
}: Props) {
  const [config, setConfig] = useState<WorkingHoursConfig>(
    initialConfig ?? EMPTY_CONFIG,
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);

  // The modal never unmounts (isOpen just toggles whether it renders), so
  // without this its local state would leak between opens: a stale edited-
  // but-never-saved draft would reappear, and — worse — `confirming` would
  // stay true after a confirmed save, permanently hiding the editable form
  // behind the "you're changing the schedule" warning on every future open.
  useEffect(() => {
    if (isOpen) {
      setConfig(initialConfig ?? EMPTY_CONFIG);
      setErrors([]);
      setConfirming(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const commitSave = async () => {
    try {
      // Holidays live in their own modal — carry them through untouched.
      await onSave({
        ...config,
        holidays: initialConfig?.holidays ?? [],
      });
      onClose();
    } catch (error) {
      // Drop back to the form (not the confirmation screen) so the entered
      // values are still on screen next to the reason they were rejected.
      setConfirming(false);
      setErrors([
        error instanceof Error
          ? error.message
          : "Something went wrong while saving. Please try again.",
      ]);
    }
  };

  const handleSave = () => {
    const result = validateWorkingHoursConfig({ ...config, holidays: [] });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    if (hasScheduleChanged(config, initialConfig)) {
      setConfirming(true);
      return;
    }

    commitSave();
  };

  const toggleWorkDay = (day: number) => {
    setConfig((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day].sort(),
    }));
  };

  const hours =
    config.workStartTime && config.workEndTime
      ? getWorkingHoursPerDay(config)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Working Schedule</h2>
            <p className="text-xs text-slate-500 mt-1">
              Start time, end time, and working days — set once, rarely
              changed.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            title="Close"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONFIRMATION */}
        {confirming && (
          <div className="p-6 space-y-4">
            <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 rounded">
              <AlertTriangle
                size={20}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <div className="text-sm text-amber-900 space-y-2">
                <p className="font-semibold">
                  You're changing the working schedule.
                </p>
                <p>
                  This does <span className="font-semibold">not</span> affect
                  tasks that already have a due date — their deadline was
                  calculated once and stays exactly as it was.
                </p>
                <p>
                  It <span className="font-semibold">will</span> apply to any
                  task created from now on, so tasks created just before and
                  just after this change may be governed by different
                  calendars.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 rounded border"
              >
                Go back
              </button>

              <button
                onClick={commitSave}
                disabled={saving}
                className="bg-amber-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Yes, update working schedule"}
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className={`p-6 space-y-6 ${confirming ? "hidden" : ""}`}>
          {errors.length > 0 && (
            <div className="bg-red-50 border p-3 rounded">
              {errors.map((e, i) => (
                <p key={i} className="text-red-600 text-sm">
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* TIME */}
          <div>
            <p className="font-semibold text-sm mb-2">Working Time</p>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="start-time" className="text-xs block mb-1">
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={config.workStartTime}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      workStartTime: e.target.value,
                    }))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label htmlFor="end-time" className="text-xs block mb-1">
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={config.workEndTime}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      workEndTime: e.target.value,
                    }))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <p className="text-xs mt-2">
              Hours/day: {hours.toFixed(2)}
            </p>
          </div>

          {/* DAYS */}
          <div>
            <p className="font-semibold text-sm mb-2">Working Days</p>

            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleWorkDay(i)}
                  aria-label={`Toggle ${d}`}
                  title={`Toggle ${d}`}
                  className={`p-2 rounded ${
                    config.workDays.includes(i)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        {!confirming && (
          <div className="flex justify-end gap-2 p-4 border-t">
            <button onClick={onClose}>Cancel</button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
