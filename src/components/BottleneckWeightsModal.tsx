import { useState } from "react";
import { X } from "lucide-react";
import type { BottleneckScoreWeights } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: BottleneckScoreWeights) => void;
  initialConfig: BottleneckScoreWeights | null;
  saving: boolean;
}

type Field = keyof BottleneckScoreWeights;

const FIELDS: { field: Field; id: string; label: string }[] = [
  { field: "timeWeight", id: "time-weight", label: "Average Completion Time Weight" },
  { field: "breachWeight", id: "breach-weight", label: "Breach Percentage Weight" },
  { field: "volumeWeight", id: "volume-weight", label: "Task Volume Weight" },
];

// Same 0.45 / 0.45 / 0.10 split the backend falls back to when nothing has
// been configured yet (analytics.models.BottleneckScoreWeights defaults).
const DEFAULT_WEIGHTS: BottleneckScoreWeights = {
  timeWeight: 0.45,
  breachWeight: 0.45,
  volumeWeight: 0.1,
};

const toStrings = (config: BottleneckScoreWeights): Record<Field, string> => ({
  timeWeight: String(config.timeWeight),
  breachWeight: String(config.breachWeight),
  volumeWeight: String(config.volumeWeight),
});

// Weights are entered as a 0–1 fraction of the total (matching the
// 0.45 / 0.45 / 0.10 convention already used in the model and its default),
// not a raw/unbounded number — bounding each field to that range catches
// fat-finger typos (e.g. "45" instead of "0.45") before they're saved.
const validateField = (rawValue: string): string | undefined => {
  const trimmed = rawValue.trim();

  if (trimmed === "") return "Required.";

  const value = Number(trimmed);

  if (Number.isNaN(value)) return "Enter a valid number.";
  if (value < 0) return "Must be 0 or greater.";
  if (value > 1) return "Must be 1 or less.";

  return undefined;
};

const toNumber = (rawValue: string): number => {
  const value = Number(rawValue.trim());
  return Number.isNaN(value) ? 0 : value;
};

const normalize = (values: Record<Field, string>) => {
  const time = toNumber(values.timeWeight);
  const breach = toNumber(values.breachWeight);
  const volume = toNumber(values.volumeWeight);
  const total = time + breach + volume;

  if (total <= 0) return { time: 0, breach: 0, volume: 0 };

  return {
    time: (time / total) * 100,
    breach: (breach / total) * 100,
    volume: (volume / total) * 100,
  };
};

export function BottleneckWeightsModal({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  saving,
}: Props) {
  const [values, setValues] = useState<Record<Field, string>>(
    toStrings(initialConfig ?? DEFAULT_WEIGHTS),
  );
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: Field) => (rawValue: string) => {
    setValues((prev) => ({ ...prev, [field]: rawValue }));
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(rawValue) }));
    setFormError(null);
  };

  const handleSave = () => {
    const nextFieldErrors: Partial<Record<Field, string>> = {};
    for (const { field } of FIELDS) {
      const error = validateField(values[field]);
      if (error) nextFieldErrors[field] = error;
    }
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFormError(null);
      return;
    }

    const config: BottleneckScoreWeights = {
      timeWeight: toNumber(values.timeWeight),
      breachWeight: toNumber(values.breachWeight),
      volumeWeight: toNumber(values.volumeWeight),
    };

    if (config.timeWeight + config.breachWeight + config.volumeWeight <= 0) {
      setFormError("At least one weight must be greater than zero.");
      return;
    }

    setFormError(null);
    onSave(config);
    onClose();
  };

  const preview = normalize(values);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Bottleneck Score Weights</h2>
            <p className="text-xs text-slate-500 mt-1">
              How much each metric contributes to a workflow's bottleneck
              score. Enter each as a 0–1 fraction — values are automatically
              normalized to add up to 100%.
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
        <div className="p-6 space-y-5">
          {formError && (
            <div className="bg-red-50 border p-3 rounded">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}

          {FIELDS.map(({ field, id, label }) => {
            const error = fieldErrors[field];

            return (
              <div key={field}>
                <label htmlFor={id} className="text-xs block mb-1">
                  {label}
                </label>
                <input
                  id={id}
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={values[field]}
                  onChange={(e) => handleChange(field)(e.target.value)}
                  aria-invalid={Boolean(error)}
                  className={`border p-2 rounded w-full ${
                    error ? "border-red-400" : ""
                  }`}
                />
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
              </div>
            );
          })}

          <div className="bg-slate-50 rounded border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Applied Split</p>
            <p className="text-[10px] font-semibold text-slate-900 mt-1">
              {preview.time.toFixed(0)}% time · {preview.breach.toFixed(0)}%
              breach · {preview.volume.toFixed(0)}% volume
            </p>
          </div>
        </div>

        {/* FOOTER */}
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
      </div>
    </div>
  );
}
