import { useState } from "react"; //React components re-render when state changes Without useState, your inputs would be static (not editable)
import { X, Plus, Trash2 } from "lucide-react"; //reusable React icons delete btn
import type { WorkingHoursConfig } from "../types"; //Ensures your config object always has:
import {
  getWorkingHoursPerDay,
  validateWorkingHoursConfig,
} from "../services/workingHoursService";

interface Props {
  //Defines what parent sends to modal                      Parent controls data flow
  isOpen: boolean; //whether modal should show
  onClose: () => void; //what to do when closing
  onSave: (config: WorkingHoursConfig) => void;
  initialConfig: WorkingHoursConfig | null;
  saving: boolean;
}

/* UI editable empty state */
const EMPTY_CONFIG: WorkingHoursConfig = {
  //UI fallback state if no config from backend (first time setup)
  workStartTime: "",
  workEndTime: "",
  workDays: [],
  holidays: [],
  timeZone: "UTC",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WorkingHoursModal({
  isOpen, //true       //when user click close modal runs onclose() then state change prop is again sent to modal isOpen=false and modal stops renderin.. modal asks parent and then closes
  onClose,
  onSave,
  initialConfig, //null
  saving, //false
}: Props) {
  const [config, setConfig] = useState<WorkingHoursConfig>(
    initialConfig ?? EMPTY_CONFIG, //initialConfig is null config=EMPTY_CONFIG instead (first time setup)     if its not null use config=initialConfig (editing existing config)           balla
  );

  const [newHoliday, setNewHoliday] = useState("");
  const [errors, setErrors] = useState<string[]>([]); //Store validation error   This state will ALWAYS be an array of strings.   [404, true] ❌      "error" ❌

  if (!isOpen) return null; //Don't render anything if modal is closed (parent controls this via isOpen prop)                                                                  balla

  const handleSave = () => {
    const result = validateWorkingHoursConfig(config);

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSave(config); //Pass the valid config back to parent via onSave prop (parent will handle API call and state update)     balla
    onClose();
  };

  const toggleWorkDay = (day: number) => {
    //receive index
    setConfig((prev) => ({
      ...prev, //keep all fields in prev stateunchanged
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day) //already selected → REMOVE (keep only items that pass the condition)
        : [...prev.workDays, day].sort(), //add new day and sort (e.g. [1,3] + day 2 → [1,2,3])
    }));
  };

  const addHoliday = () => {
    if (!newHoliday) {
      //Prevent empty input
      setErrors(["Please select a holiday date."]);
      return;
    }

    if (config.holidays.includes(newHoliday)) {
      //Prevent duplicates
      setErrors(["Holiday already exists."]);
      return;
    }

    setConfig((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday].sort(), //add new holiday and sort
    }));

    setNewHoliday("");
    setErrors([]);
  };

  const removeHoliday = (holiday: string) => {
    setConfig((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((h) => h !== holiday),
    }));
  };

  const hours = //every render calculate these values
    config.workStartTime && config.workEndTime //if BOTH values are available go to getworkinghoursperday unless store 0
      ? getWorkingHoursPerDay(config)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Working Hours Configuration</h2>

          <button
            onClick={onClose} //close button
            aria-label="Close modal"
            title="Close"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* ERRORS */}
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
                  onChange={
                    (e) =>
                      setConfig((prev) => ({
                        ...prev, //spread operator. “Copy everything from the previous state” in config
                        workStartTime: e.target.value, //workStartTime: current value from input overwrite that and keep everything else unchanged
                      })) //update only 1 value in the config state object without affecting the others
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
              Hours/day: {hours.toFixed(2)} {/*round to 2 decimals */}
            </p>
          </div>

          {/* DAYS */}
          <div>
            <p className="font-semibold text-sm mb-2">Working Days</p>

            <div className="grid grid-cols-4 gap-2">
              {DAYS.map(
                (
                  d,
                  i, //looping through array & creates 7 buttons , sends index i (0–6)
                ) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleWorkDay(i)}
                    aria-label={`Toggle ${d}`}
                    title={`Toggle ${d}`}
                    className={`p-2 rounded ${
                      config.workDays.includes(i)
                        ? "bg-blue-600 text-white" //if workDays includes index i (0–6) means its selected so show blue background and white text
                        : "bg-gray-100"
                    }`}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* HOLIDAYS */}
          <div>
            <label
              htmlFor="holiday-input"
              className="font-semibold text-sm mb-2 block"
            >
              Holidays
            </label>

            <div className="flex gap-2">
              <input
                id="holiday-input"
                type="date"
                value={newHoliday} //whts value on newHoliday state is displayed in input
                onChange={(e) => setNewHoliday(e.target.value)}
                className="border p-2 flex-1 rounded"
              />

              <button //+ button
                type="button"
                onClick={addHoliday}
                aria-label="Add holiday"
                title="Add holiday"
                className="bg-blue-600 text-white px-3 rounded flex items-center"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {config.holidays.map((h) => (
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
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSave}
            disabled={saving} //disable button while saving to prevent multiple clicks and API calls
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}{" "}
            {/*if saving=true show "Saving..." otherwise show "Save" in the button */}
          </button>
        </div>
      </div>
    </div>
  );
}
