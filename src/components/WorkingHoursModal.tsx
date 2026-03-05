// Working Hours Configuration Modal
// Allows users to customize company working hours, days, and holidays

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { WorkingHoursConfig } from "../services/workingHoursService";
import { DEFAULT_WORKING_HOURS, getWorkingHoursPerDay, validateWorkingHoursConfig } from "../services/workingHoursService";

interface WorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: WorkingHoursConfig) => void;
  initialConfig?: WorkingHoursConfig;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function WorkingHoursModal({ isOpen, onClose, onSave, initialConfig }: WorkingHoursModalProps) {
  const [config, setConfig] = useState<WorkingHoursConfig>(initialConfig || DEFAULT_WORKING_HOURS);
  const [newHoliday, setNewHoliday] = useState("");
  const [holidayError, setHolidayError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const derivedHoursPerDay = getWorkingHoursPerDay(config);

  const handleSave = () => {
    const validation = validateWorkingHoursConfig(config);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onSave(config);
    onClose();
  };

  const toggleWorkDay = (dayNum: number) => {
    setConfig((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(dayNum)
        ? prev.workDays.filter((d) => d !== dayNum)
        : [...prev.workDays, dayNum].sort(),
    }));
  };

  const addHoliday = () => {
    if (!newHoliday) {
      setHolidayError("Please select a holiday date.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newHoliday)) {
      setHolidayError("Holiday date must be in YYYY-MM-DD format.");
      return;
    }

    if (config.holidays.includes(newHoliday)) {
      setHolidayError("This date is already added.");
      return;
    }

    setConfig((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday].sort(),
    }));
    setNewHoliday("");
    setHolidayError("");
  };

  const removeHoliday = (holiday: string) => {
    setConfig((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((h) => h !== holiday),
    }));
    setHolidayError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Working Hours Configuration</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded" title="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">Validation Errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-red-700 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Working Time Window */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              🕒 Working Time Window
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Start Time</label>
                <input
                  type="time"
                  value={config.workStartTime}
                  onChange={(e) => setConfig((prev) => ({ ...prev, workStartTime: e.target.value }))}
                  className="border border-slate-300 rounded px-3 py-2 w-full"
                  aria-label="Working day start time"
                  title="Working day start time"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">End Time</label>
                <input
                  type="time"
                  value={config.workEndTime}
                  onChange={(e) => setConfig((prev) => ({ ...prev, workEndTime: e.target.value }))}
                  className="border border-slate-300 rounded px-3 py-2 w-full"
                  aria-label="Working day end time"
                  title="Working day end time"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Derived working hours/day: {derivedHoursPerDay.toFixed(2)}h</p>
          </div>

          {/* Working Days */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              📅 Working Days
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleWorkDay(idx)}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    config.workDays.includes(idx)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Selected: {config.workDays.map((d) => DAYS[d]).join(", ")}
            </p>
          </div>

          {/* Holidays */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              🎉 Holidays & Special Days
            </label>

            {/* Add Holiday */}
            <div className="flex gap-2 mb-3">
              <label className="sr-only">Holiday date</label>
              <input
                type="date"
                value={newHoliday}
                onChange={(e) => {
                  setNewHoliday(e.target.value);
                  setHolidayError("");
                }}
                className="border border-slate-300 rounded px-3 py-2 flex-1"
                aria-label="Holiday date"
              />
              <button
                onClick={addHoliday}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            {holidayError && (
              <p className="text-sm text-red-600 mb-3">{holidayError}</p>
            )}

            {/* Holiday List */}
            {config.holidays.length > 0 ? (
              <div className="space-y-2">
                {config.holidays.map((holiday) => (
                  <div key={holiday} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-slate-700 font-mono">{holiday}</span>
                    <button
                      onClick={() => removeHoliday(holiday)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title={`Remove ${holiday}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No holidays configured</p>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Total holidays: {config.holidays.length} days/year
            </p>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">📊 Working Hours Summary</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-mono">{derivedHoursPerDay.toFixed(2)}</p>
                <p className="text-blue-600 text-xs">hours/day</p>
              </div>
              <div>
                <p className="text-blue-700 font-mono">{config.workStartTime} - {config.workEndTime}</p>
                <p className="text-blue-600 text-xs">daily window</p>
              </div>
              <div>
                <p className="text-blue-700 font-mono">{config.workDays.length}</p>
                <p className="text-blue-600 text-xs">days/week</p>
              </div>
              <div>
                <p className="text-blue-700 font-mono">{(config.workDays.length * derivedHoursPerDay).toFixed(1)}</p>
                <p className="text-blue-600 text-xs">hours/week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
