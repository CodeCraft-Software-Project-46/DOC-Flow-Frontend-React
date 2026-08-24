// Raw analytics_task_instance table — every SLA-relevant column, filtered
// by the same time-range bar as the rest of the Overall tab (by created_at,
// so not-yet-completed tasks still show up here).

import { useState } from "react";
import { fetchTaskInstances } from "../../../api/analyticsApi";
import type { TaskInstanceRow } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

type Props = {
  dateFrom?: string;
  dateTo?: string;
};

// Values are already Sri Lanka local time (naive, no timezone suffix) —
// just trim to "YYYY-MM-DD HH:MM:SS" instead of parsing through Date(),
// which would silently re-interpret it through the browser's own timezone.
const formatDateTime = (value: string | null): string => {
  if (!value) return "—";
  return value.replace("T", " ").slice(0, 19);
};

const statusBadgeClasses = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "bg-blue-100 text-blue-700";
  if (normalized === "running") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

const slaBadgeClasses = (slaStatus: string | null) => {
  if (slaStatus === "met") return "bg-green-100 text-green-700";
  if (slaStatus === "breached") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-400";
};

export default function TaskInstancesTableWidget({ dateFrom, dateTo }: Props) {
  // New tasks can appear from elsewhere (a raw INSERT, the "New Task"
  // button) without this component re-rendering, so it only fetches once on
  // mount / when the date filter changes — this key lets "Refresh" force
  // another fetch on demand rather than requiring a full page reload.
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useAnalyticsQuery<TaskInstanceRow[]>(
    () => fetchTaskInstances({ from: dateFrom, to: dateTo }),
    [dateFrom, dateTo, refreshKey],
  );

  const tasks = data ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900 text-base">
          Task Instances
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
          className="text-xs text-blue-600 hover:underline"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="text-xs text-slate-400 mt-1 mb-4">
        Every task in the selected time range (up to 500 most recent)
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
          Loading tasks...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
          Failed to load tasks
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
          No tasks in this time range
        </div>
      ) : (
        <div className="overflow-auto max-h-[340px] border border-slate-200 rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-slate-100 text-slate-600 sticky top-0">
              <tr>
                <th className="p-2 text-left">Task Name</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Due At</th>
                <th className="p-2 text-left">SLA (hrs)</th>
                <th className="p-2 text-left">Completed At</th>
                <th className="p-2 text-left">SLA Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.task_id} className="border-t border-slate-100">
                  <td className="p-2 font-medium text-slate-800 whitespace-nowrap">
                    {task.task_name ?? "(unnamed)"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDateTime(task.created_at)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusBadgeClasses(
                        task.status,
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDateTime(task.due_at)}
                  </td>
                  <td className="p-2 whitespace-nowrap">{task.sla_hours}</td>
                  <td className="p-2 whitespace-nowrap">
                    {formatDateTime(task.completed_at)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${slaBadgeClasses(
                        task.sla_status,
                      )}`}
                    >
                      {task.sla_status ?? "not evaluated"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
