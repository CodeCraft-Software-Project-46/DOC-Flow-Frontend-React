import { useState, useEffect } from "react";
import { WorkingScheduleModal } from "../../components/WorkingScheduleModal";
import { HolidaysModal } from "../../components/HolidaysModal";
import { BottleneckWeightsModal } from "../../components/BottleneckWeightsModal";
import type { WorkingHoursConfig, BottleneckScoreWeights } from "../../types";
import { getWorkingHours, saveWorkingHours } from "../../api/WorkingHoursAPI";
import { fetchBottleneckWeights, saveBottleneckWeights } from "../../api/analyticsApi";
import { getWorkingHoursPerDay } from "../../services/workingHoursService";

// Same 0.45 / 0.45 / 0.10 split the backend falls back to when nothing has
// been configured yet, shown here so the panel has something to display
// before the admin ever saves a custom split.
const DEFAULT_BOTTLENECK_WEIGHTS: BottleneckScoreWeights = {
  timeWeight: 0.45,
  breachWeight: 0.45,
  volumeWeight: 0.1,
};

/* UI helper */
const formatWorkDays = (days: number[]) => {
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((d) => map[d]).join(", ");
};

export const SettingsPage = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isHolidaysModalOpen, setIsHolidaysModalOpen] = useState(false);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [config, setConfig] = useState<WorkingHoursConfig | null>(null); //initially no data
  const [weights, setWeights] = useState<BottleneckScoreWeights | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Load config */
  useEffect(() => {
    //Runs AFTER component loads  Without it → API runs on every render ❌
    const fetchData = async () => {
      //creates the function
      try {
        const [hoursData, weightsData] = await Promise.all([
          getWorkingHours(),
          fetchBottleneckWeights(),
        ]);
        setConfig(hoursData); // null if no record
        setWeights(weightsData); // null until an admin saves a custom split
      } catch (error) {
        console.error("Error loading settings:", error);
        setConfig(null);
        setWeights(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData(); //calls the function we just created
  }, []);

  /* Save handler — shared by both modals; each one only edits its own
     fields and carries the rest of the config through unchanged. */
  const handleSave = async (updated: WorkingHoursConfig) => {
    setSaving(true);
    try {
      const result = await saveWorkingHours(updated);
      setConfig(result);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWeights = async (updated: BottleneckScoreWeights) => {
    setSavingWeights(true);
    try {
      const result = await saveBottleneckWeights(updated);
      setWeights(result);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSavingWeights(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  const activeWeights = weights ?? DEFAULT_BOTTLENECK_WEIGHTS;
  const weightsTotal =
    activeWeights.timeWeight + activeWeights.breachWeight + activeWeights.volumeWeight;
  const weightsSplit =
    weightsTotal > 0
      ? `${Math.round((activeWeights.timeWeight / weightsTotal) * 100)}% time · ${Math.round((activeWeights.breachWeight / weightsTotal) * 100)}% breach · ${Math.round((activeWeights.volumeWeight / weightsTotal) * 100)}% volume`
      : "Not set";

  /* Bottleneck score weights card, reused by both the empty state (working
     schedule not configured yet) and the main return below — it doesn't
     depend on the working-hours config existing. */
  const bottleneckWeightsCard = (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Bottleneck Score Weights
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            How much average completion time, breach %, and task volume each
            contribute to a workflow's bottleneck score.
          </p>
        </div>

        <button
          onClick={() => setIsWeightsModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
        >
          Edit Weights
        </button>
      </div>

      <div className="mt-4">
        <Stat label="Applied Split" value={weightsSplit} valueClassName="text-[15px]" />
      </div>
    </div>
  );

  const bottleneckWeightsModal = (
    <BottleneckWeightsModal
      isOpen={isWeightsModalOpen}
      onClose={() => setIsWeightsModalOpen(false)}
      onSave={handleSaveWeights}
      initialConfig={weights}
      saving={savingWeights}
    />
  );

  /* EMPTY STATE — nothing configured yet. Schedule must exist before
     holidays can be added (HolidaysModal requires a baseConfig). */
  if (!config) {
    return (
      <div className="max-w-4xl space-y-5">
        <div className="p-4 text-gray-600">
          No working schedule configured yet.
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="ml-3 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Configure
          </button>
        </div>

        {bottleneckWeightsCard}

        <WorkingScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSave={handleSave}
          initialConfig={null}
          saving={saving}
        />

        {bottleneckWeightsModal}
      </div>
    );
  }

  const hoursPerDay = getWorkingHoursPerDay(config);

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">
          Configure company working hours and holidays used for SLA
          calculations.
        </p>
      </div>

      {/* WORKING SCHEDULE — set once, rarely changed */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Working Schedule
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Start time, end time, and working days — used in SLA
              calculations. Set once at rollout; not expected to change
              often.
            </p>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            Edit Schedule
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Stat
            label="Hours / Day"
            value={`${Math.floor(hoursPerDay)}h ${Math.round((hoursPerDay % 1) * 60)}m`} //convert decimal hours to hours and minutes format (e.g. 8.5 → "8h 30m")
          />

          <Stat
            label="Daily Time Window"
            value={`${config.workStartTime} - ${config.workEndTime}`}
          />
        </div>

        {/* WORKING DAYS */}
        <div className="bg-slate-50 rounded border border-slate-200 p-3 mt-3">
          <p className="text-xs text-slate-500">Working Days</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {formatWorkDays(config.workDays)}
          </p>
        </div>
      </div>

      {/* HOLIDAYS — expected to change routinely (e.g. once a year) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Holidays
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Dates excluded from SLA calculations. Add or remove anytime.
            </p>
          </div>

          <button
            onClick={() => setIsHolidaysModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            Manage Holidays
          </button>
        </div>

        <div className="mt-4">
          <Stat label="Configured Holidays" value={config.holidays.length} />
        </div>
      </div>

      {/* BOTTLENECK SCORE WEIGHTS — feeds the Overall Analytics bottleneck
          workflows widget; independent of the working-hours schedule above */}
      {bottleneckWeightsCard}

      <WorkingScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSave}
        initialConfig={config}
        saving={saving}
      />

      <HolidaysModal
        isOpen={isHolidaysModalOpen}
        onClose={() => setIsHolidaysModalOpen(false)}
        onSave={handleSave}
        baseConfig={config}
        saving={saving}
      />

      {bottleneckWeightsModal}
    </div>
  );
};

const Stat = ({
  label,
  value,
  valueClassName = "text-lg",
}: {
  label: string;
  value: string | number;
  valueClassName?: string;
}) => (
  <div className="bg-slate-50 rounded border border-slate-200 p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`font-bold text-slate-900 ${valueClassName}`}>{value}</p>
  </div>
);
