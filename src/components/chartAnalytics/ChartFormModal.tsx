// Modal form for creating and editing custom charts
// Handles all conditions: chart type options, time range, color thresholds

import { useState, useEffect } from "react";
import type { CustomChart, ChartType, KPIMetric, ChartSource } from "../../types";
import { WORKFLOWS, METRICS } from "../../data/dummyData";

// Chart type options allowed per KPI metric
const CHART_TYPES_FOR_METRIC: Record<KPIMetric, ChartType[]> = {
  sla_compliance:      ["bar", "line"],
  avg_time:            ["bar"],
  completion_rate:     ["bar", "line"],
  breach_count:        ["bar"],
  status_distribution: ["pie", "donut"],
};

// Default empty form values
const BLANK_FORM: Omit<CustomChart, "id"> = {
  name:       "",
  source:     "workflow",
  workflow:   "",
  type:       "bar",
  metric:     "sla_compliance",
  groupBy:    "step_name",
  status:     "active",
  timeRange:  "30d",
  fromDate:   "",
  toDate:     "",
  colors:     { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" },
  thresholds: { good: 90, warning: 75 },
};

interface ChartFormModalProps {
  isOpen:      boolean;
  editChart:   CustomChart | null; // null = create mode, chart = edit mode
  onClose:     () => void;
  onSave:      (chart: Omit<CustomChart, "id">, id?: number) => void;
}

export default function ChartFormModal({
  isOpen, editChart, onClose, onSave
}: ChartFormModalProps) {

  const [form, setForm] = useState<Omit<CustomChart, "id">>(BLANK_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When modal opens — load edit data or reset to blank
  useEffect(() => {
    if (editChart) {
      // Edit mode — populate form with existing chart data
      const { id, ...rest } = editChart;
      setForm(rest);
    } else {
      // Create mode — reset to blank
      setForm(BLANK_FORM);
    }
    setErrors({}); // Clear errors when modal opens
  }, [editChart, isOpen]);

  // Is current metric "status_distribution"?
  const isDistribution = form.metric === "status_distribution";

  // Allowed chart types for selected metric
  const allowedTypes = CHART_TYPES_FOR_METRIC[form.metric];

  // Get unit label for threshold inputs
  function getUnit(): string {
    const found = METRICS.find((m) => m.value === form.metric);
    if (form.metric === "sla_compliance") {
      return "% of SLA";
    }
    return found?.unit || "%";
  }

  // Is higher value better for this metric?
  function isHigherBetter(): boolean {
    const found = METRICS.find((m) => m.value === form.metric);
    return found?.higherBetter !== false;
  }

  // Update a single form field
  function update<K extends keyof Omit<CustomChart, "id">>(
    key: K,
    value: Omit<CustomChart, "id">[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      // When source changes — fix groupBy automatically
      if (key === "source") {
        next.groupBy = value === "workflow" ? "step_name" : "workflow_name";
        next.workflow = ""; // reset workflow selection
      }

      // When metric changes — update chart type + thresholds + colors + timeRange
      if (key === "metric") {
        const types = CHART_TYPES_FOR_METRIC[value as KPIMetric];
        // If current type not allowed, switch to first allowed
        if (!types.includes(prev.type)) {
          next.type = types[0];
        }
        
        // Update default thresholds and colors per metric type
        switch (value as KPIMetric) {
          case "sla_compliance":
            next.thresholds = { good: 100, warning: 90 };
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
            break;
          case "avg_time":
            next.thresholds = { good: 8, warning: 24 };
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
            break;
          case "completion_rate":
            next.thresholds = { good: 95, warning: 80 };
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
            break;
          case "breach_count":
            next.thresholds = { good: 2, warning: 5 };
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
            break;
          case "status_distribution":
            // For pie/donut — use slice colors instead of thresholds
            next.thresholds = { good: 0, warning: 0 }; // not used
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
            break;
          default:
            next.thresholds = { good: 90, warning: 75 };
            next.colors = { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };
        }
        
        // Status distribution has no time range
        next.timeRange = prev.timeRange || "30d";
      }

      return next;
    });
  }

  // Validate form before saving
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    // Chart Title validation
    if (!form.name.trim()) {
      newErrors.name = "Chart title is required";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Chart title must be 100 characters or less";
    }

    // Workflow validation (only if workflow source)
    if (form.source === "workflow" && !form.workflow) {
      newErrors.workflow = "Please select a workflow";
    }

    // Threshold validation (only for non-distribution charts)
    if (!isDistribution) {
      const goodVal = form.thresholds.good;
      const warningVal = form.thresholds.warning;

      // Check if values are valid numbers
      if (typeof goodVal !== "number" || isNaN(goodVal)) {
        newErrors.goodThreshold = "Good threshold must be a number";
      } else if (goodVal < 0 || goodVal > 100) {
        newErrors.goodThreshold = "Good threshold must be between 0 and 100";
      }

      if (typeof warningVal !== "number" || isNaN(warningVal)) {
        newErrors.warningThreshold = "Warning threshold must be a number";
      } else if (warningVal < 0 || warningVal > 100) {
        newErrors.warningThreshold = "Warning threshold must be between 0 and 100";
      }

      // Check threshold ordering
      if (!isNaN(goodVal) && !isNaN(warningVal)) {
        if (warningVal >= goodVal) {
          newErrors.thresholdOrder = "Warning threshold must be less than Good threshold";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Save button clicked
  function handleSave() {
    if (!validateForm()) {
      return; // Validation failed, errors displayed
    }
    onSave(form, editChart?.id);
    onClose();
  }

  // Don't render if closed
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">

      {/* Modal box */}
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white px-7 py-5 border-b border-slate-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editChart ? "Edit Chart" : "Create Chart"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure chart settings, time range, and color rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* ── Source Toggle ── */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Chart Source
            </label>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {(["workflow", "overall"] as ChartSource[]).map((src) => (
                <button
                  key={src}
                  onClick={() => update("source", src)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm transition-all ${
                    form.source === src
                      ? "bg-white shadow text-slate-900 font-semibold"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <div className="font-medium">
                    {src === "workflow" ? "📈 Workflow Chart" : "🌐 Overall Chart"}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {src === "workflow" ? "Groups by step name" : "Groups by workflow name"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Chart Title + Type ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Chart Title
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  update("name", e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="e.g. Approval Trend"
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 ${
                  errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200"
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Chart Type
              </label>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value as ChartType)}
                aria-label="Chart type selection"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
              >
                {allowedTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Chart
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Workflow selector (only if source = workflow) ── */}
          {form.source === "workflow" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Workflow
              </label>
              <select
                value={form.workflow}
                onChange={(e) => {
                  update("workflow", e.target.value);
                  if (errors.workflow) setErrors((prev) => ({ ...prev, workflow: "" }));
                }}
                aria-label="Workflow selection"
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white ${
                  errors.workflow ? "border-red-500 focus:border-red-500" : "border-slate-200"
                }`}
              >
                <option value="">— Select Workflow —</option>
                {WORKFLOWS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              {errors.workflow && <p className="text-xs text-red-600 mt-1">{errors.workflow}</p>}
            </div>
          )}

          {/* ── KPI Metric + Group By ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                KPI Metric
              </label>
              <select
                value={form.metric}
                onChange={(e) => update("metric", e.target.value as KPIMetric)}
                aria-label="KPI metric selection"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
              >
                {METRICS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Group By
              </label>
              {/* Read-only — auto set based on source */}
              <input
                readOnly
                value={form.groupBy === "step_name" ? "Step Name" : "Workflow Name"}
                aria-label="Group by field (auto-set)"
                className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Auto-set based on chart source</p>
            </div>
          </div>

          {/* ── Time Range ── */}
          {
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Time Range
              </label>
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mb-3">
                {[
                  { value: "7d",  label: "Last 7 Days"  },
                  { value: "30d", label: "Last 30 Days" },
                  { value: "90d", label: "Last 90 Days" },
                  { value: "all", label: "All Time"     },
                  { value: "custom", label: "Custom"    },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("timeRange", opt.value)}
                    className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                      form.timeRange === opt.value
                        ? "bg-white shadow font-semibold text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Custom date range inputs */}
              {form.timeRange === "custom" && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={form.fromDate || ""}
                      onChange={(e) => update("fromDate", e.target.value)}
                      aria-label="Custom date range start"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={form.toDate || ""}
                      onChange={(e) => update("toDate", e.target.value)}
                      aria-label="Custom date range end"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Defines the data window this chart queries when rendered
              </p>
            </div>
          }

          {/* ── Status ── */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as "active" | "draft")}
              aria-label="Chart status"
              className="w-1/2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* ── Color Thresholds ── */}
          {isDistribution ? (
            // Pie/donut — color pickers for status slices
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Chart Colors (slice colors)
              </label>
              <div className="flex gap-5 flex-wrap">
                {[
                  { key: "good",     label: "Met"  },
                  { key: "critical", label: "Breached" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.colors[key as keyof typeof form.colors]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          colors: { ...p.colors, [key]: e.target.value },
                        }))
                      }
                      aria-label={`${label} color picker`}
                      className="w-9 h-9 border-none cursor-pointer rounded-lg"
                    />
                    <span className="text-sm text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Status distribution uses only completed tasks: Met vs Breached.
              </p>
            </div>
          ) : (
            // Bar/line — threshold values + color pickers
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Color Thresholds
              </label>
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-4">

                {/* Good threshold */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-48">
                      🟢 Good — value {isHigherBetter() ? "≥" : "≤"}
                    </span>
                    <input
                      type="number"
                      value={form.thresholds.good}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          thresholds: { ...p.thresholds, good: Number(e.target.value) },
                        }));
                        if (errors.goodThreshold || errors.thresholdOrder) {
                          setErrors((prev) => ({
                            ...prev,
                            goodThreshold: "",
                            thresholdOrder: "",
                          }));
                        }
                      }}
                      aria-label="Good threshold value"
                      className={`w-20 border rounded-lg px-2 py-1.5 text-sm outline-none ${
                        errors.goodThreshold ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    <span className="text-xs text-slate-400">{getUnit()}</span>
                    <input
                      type="color"
                      value={form.colors.good}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          colors: { ...p.colors, good: e.target.value },
                        }))
                      }
                      aria-label="Good threshold color"
                      className="w-8 h-8 border-none cursor-pointer rounded-lg ml-2"
                    />
                  </div>
                  {errors.goodThreshold && (
                    <p className="text-xs text-red-600 mt-1 ml-48">{errors.goodThreshold}</p>
                  )}
                </div>

                {/* Warning threshold */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-48">
                      🟡 Warning — value {isHigherBetter() ? "≥" : "≤"}
                    </span>
                    <input
                      type="number"
                      value={form.thresholds.warning}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          thresholds: { ...p.thresholds, warning: Number(e.target.value) },
                        }));
                        if (errors.warningThreshold || errors.thresholdOrder) {
                          setErrors((prev) => ({
                            ...prev,
                            warningThreshold: "",
                            thresholdOrder: "",
                          }));
                        }
                      }}
                      aria-label="Warning threshold value"
                      className={`w-20 border rounded-lg px-2 py-1.5 text-sm outline-none ${
                        errors.warningThreshold ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    <span className="text-xs text-slate-400">{getUnit()}</span>
                    <input
                      type="color"
                      value={form.colors.warning}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          colors: { ...p.colors, warning: e.target.value },
                        }))
                      }
                      aria-label="Warning threshold color"
                      className="w-8 h-8 border-none cursor-pointer rounded-lg ml-2"
                    />
                  </div>
                  {errors.warningThreshold && (
                    <p className="text-xs text-red-600 mt-1 ml-48">{errors.warningThreshold}</p>
                  )}
                  {errors.thresholdOrder && (
                    <p className="text-xs text-red-600 mt-1 ml-48">{errors.thresholdOrder}</p>
                  )}
                </div>

                {/* Critical — automatic */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-48">
                    🔴 Critical — otherwise
                  </span>
                  <span className="text-xs text-slate-400">automatic</span>
                  <input
                    type="color"
                    value={form.colors.critical}
                    aria-label="Critical threshold color"
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        colors: { ...p.colors, critical: e.target.value },
                      }))
                    }
                    className="w-8 h-8 border-none cursor-pointer rounded-lg ml-2"
                  />
                </div>

              </div>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              💾 Save Chart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}