import { useState, useEffect } from "react";
import { WorkingHoursModal } from "../../components/WorkingHoursModal";
import type { WorkingHoursConfig } from "../../types";

import {
  getWorkingHours,
  saveWorkingHours,
} from "../../api/WorkingHoursAPI";

import { getWorkingHoursPerDay } from "../../services/workingHoursService";

/* UI helper */
const formatWorkDays = (days: number[]) => {
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((d) => map[d]).join(", ");
};

export const SettingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState<WorkingHoursConfig | null>(null); //initially no data
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /* Load config */
  useEffect(() => {             //Runs AFTER component loads  Without it → API runs on every render ❌
    const fetchData = async () => {  //creates the function
      try {
        const data = await getWorkingHours();    
        setConfig(data); // null if no record
      } catch (error) {
        console.error("Error loading working hours:", error);
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();        //calls the function we just created
  }, []);

  /* Save handler */
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

  if (loading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  /* EMPTY STATE */
  if (!config) {                 //No data in DB
    return (
      <div className="p-4 text-gray-600">
        No working hours configured yet.
        <button
          onClick={() => setIsModalOpen(true)} //State change
          className="ml-3 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Configure
        </button>

        <WorkingHoursModal
          isOpen={isModalOpen} //isModalOpen=true            isOpen=true is sent to modal as prop
          onClose={() => setIsModalOpen(false)}// passing function refence but here if child wants to run he can run....  onClose={setIsModalOpen(false)} // ❌ executes immediately 
          onSave={handleSave}
          initialConfig={null}
          saving={saving} //saving =false 
        />
      </div>
    );
  }

  const hoursPerDay = getWorkingHoursPerDay(config);

  return (
    <div className="max-w-4xl space-y-5">

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Settings
        </h2>
        <p className="text-gray-600">
          Configure company working hours and holidays used for SLA calculations.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Working Hours Configuration
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              These values are used in SLA calculations.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
          >
            Edit Working Hours
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

          <Stat
            label="Hours / Day"
            value={`${Math.floor(hoursPerDay)}h ${Math.round((hoursPerDay % 1) * 60)}m`}  //convert decimal hours to hours and minutes format (e.g. 8.5 → "8h 30m")
          />

          <Stat
            label="Daily Time Window"
            value={`${config.workStartTime} - ${config.workEndTime}`}
          />

          <Stat
            label="Special Holidays"
            value={config.holidays.length}
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

      <WorkingHoursModal  //SettingsPage is parent and modal is child
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialConfig={config}
        saving={saving}
      />
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-slate-50 rounded border border-slate-200 p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-lg font-bold text-slate-900">{value}</p>
  </div>
);