import { useEffect, useState } from "react";
import { WorkingHoursModal } from "../../components/WorkingHoursModal";
import type { WorkingHoursConfig } from "../../services/workingHoursService";
import { DEFAULT_WORKING_HOURS, getWorkingHoursPerDay } from "../../services/workingHoursService";

const SETTINGS_STORAGE_KEY = "companyWorkingHoursConfig";

function formatWorkDays(workDays: number[]): string {
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return workDays.map((day) => dayMap[day]).join(", ");
}

export const SettingsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workingConfig, setWorkingConfig] = useState<WorkingHoursConfig>(DEFAULT_WORKING_HOURS);

    useEffect(() => {
        const storedConfig = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!storedConfig) return;

        try {
            const parsedConfig = JSON.parse(storedConfig) as WorkingHoursConfig;
            setWorkingConfig(parsedConfig);
        } catch {
            setWorkingConfig(DEFAULT_WORKING_HOURS);
        }
    }, []);

    const handleSaveConfig = (config: WorkingHoursConfig) => {
        setWorkingConfig(config);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(config));
    };

    const derivedHoursPerDay = getWorkingHoursPerDay(workingConfig);

    return (
        <div className="max-w-4xl space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">
                    Configure company working hours and holidays used for SLA calculations.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Working Hours Configuration</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            These values are used to ignore non-working days and holidays in SLA breach/meet logic.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
                    >
                        Edit Working Hours
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="bg-slate-50 rounded border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Hours / Day</p>
                        <p className="text-lg font-bold text-slate-900">{derivedHoursPerDay.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 rounded border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Daily Time Window</p>
                        <p className="text-lg font-bold text-slate-900">{workingConfig.workStartTime} - {workingConfig.workEndTime}</p>
                    </div>
                    <div className="bg-slate-50 rounded border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Special Holidays</p>
                        <p className="text-lg font-bold text-slate-900">{workingConfig.holidays.length}</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded border border-slate-200 p-3 mt-3">
                    <p className="text-xs text-slate-500">Working Days</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{formatWorkDays(workingConfig.workDays)}</p>
                </div>
            </div>

            <WorkingHoursModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveConfig}
                initialConfig={workingConfig}
            />
        </div>
    );
};