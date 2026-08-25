import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { WorkingHoursConfig } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: WorkingHoursConfig) => void;
  // The working schedule (start/end time, working days) that this modal
  // never touches — required because holidays live on the same backend
  // record. If null (no schedule configured yet), holiday editing is
  // disabled until the schedule exists.
  baseConfig: WorkingHoursConfig | null;
  saving: boolean;
}

// Holidays are expected to change routinely (e.g. once a year), unlike the
// working schedule, so this modal saves immediately with no confirmation.
export function HolidaysModal({
  isOpen,
  onClose,
  onSave,
  baseConfig,
  saving,
}: Props) {
  const [holidays, setHolidays] = useState<string[]>(
    baseConfig?.holidays ?? [],
  );
  const [newHoliday, setNewHoliday] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addHoliday = () => {
    if (!newHoliday) {
      setError("Please select a holiday date.");
      return;
    }

    if (holidays.includes(newHoliday)) {
      setError("Holiday already exists.");
      return;
    }

    setHolidays((prev) => [...prev, newHoliday].sort());
    setNewHoliday("");
    setError(null);
  };

  const removeHoliday = (holiday: string) => {
    setHolidays((prev) => prev.filter((h) => h !== holiday));
  };

  const handleSave = () => {
    if (!baseConfig) return;

    onSave({ ...baseConfig, holidays });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Holidays</h2>
            <p className="text-xs text-slate-500 mt-1">
              Dates excluded from SLA calculations — add or remove anytime.
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

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          {!baseConfig && (
            <p className="text-sm text-slate-600">
              Configure the working schedule first before adding holidays.
            </p>
          )}

          {error && (
            <div className="bg-red-50 border p-3 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <input
              id="holiday-input"
              type="date"
              value={newHoliday}
              onChange={(e) => setNewHoliday(e.target.value)}
              disabled={!baseConfig}
              className="border p-2 flex-1 rounded"
            />

            <button
              type="button"
              onClick={addHoliday}
              disabled={!baseConfig}
              aria-label="Add holiday"
              title="Add holiday"
              className="bg-blue-600 text-white px-3 rounded flex items-center disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {holidays.map((h) => (
              <div
                key={h}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span>{h}</span>

                <button
                  type="button"
                  onClick={() => removeHoliday(h)}
                  aria-label={`Remove holiday ${h}`}
                  title="Remove holiday"
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {holidays.length === 0 && (
              <p className="text-sm text-slate-500">No holidays added yet.</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSave}
            disabled={saving || !baseConfig}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
