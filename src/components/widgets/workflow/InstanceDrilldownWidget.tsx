import { useState, useMemo, useCallback } from "react";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";
import {
  fetchWorkflowInstances,
  fetchInstanceDrilldown,
} from "../../../services/analyticsApi";

import type {
  InstanceDrilldownResponse,
  WorkflowInstancesApiResponse,
} from "../../../types";

export default function InstanceDrilldownWidget({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const [selectedInstance, setSelectedInstance] = useState<number | null>(null);

  // ===============================
  // LOAD INSTANCES
  // ===============================
  const instancesQuery = useCallback(() => {
    if (workflowId === null) return Promise.resolve([]);
    return fetchWorkflowInstances(workflowId);
  }, [workflowId]);

  const {
    data: instancesData,
    loading: instancesLoading,
  } = useAnalyticsQuery<WorkflowInstancesApiResponse>(instancesQuery, [workflowId]);

  const instanceList = useMemo(() => instancesData ?? [], [instancesData]);
  const effectiveSelectedInstance =
    selectedInstance ?? instanceList[0]?.instance_id ?? null;

  // ===============================
  // DRILLDOWN DATA
  // ===============================
  const drilldownQuery = useCallback(() => {
    if (!effectiveSelectedInstance) return Promise.resolve(null);

    return fetchInstanceDrilldown(effectiveSelectedInstance);
  }, [effectiveSelectedInstance]);

  const {
    data: drilldownData,
    loading: drilldownLoading,
    error: drilldownError,
  } = useAnalyticsQuery<InstanceDrilldownResponse | null>(drilldownQuery, [
    effectiveSelectedInstance,
  ]);

  if (workflowId === null || instancesLoading || drilldownLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 min-h-[260px]">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-8 w-44 rounded-lg bg-slate-100" />
          <div className="h-40 rounded-xl bg-slate-50 border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="font-semibold text-slate-900">Instance Drill-down (Task Flow)</div>
          <div className="text-xs text-slate-400 mt-1">Step-by-step SLA analysis for a specific document instance</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Select Instance:</span>
          <select
            value={effectiveSelectedInstance ?? ""}
            onChange={(e) =>
              setSelectedInstance(e.target.value ? Number(e.target.value) : null)
            }
            aria-label="Select workflow instance"
            className="w-40 border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white text-slate-700 outline-none"
          >
            {instanceList.map((inst) => (
              <option key={inst.instance_id} value={inst.instance_id}>
                {inst.instance_name}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* ===============================
          LOADING / ERROR
        =============================== */}
      {Boolean(drilldownError) && (
        <p className="text-red-500">Failed to load instance details</p>
      )}

      {/* ===============================
          TABLE VIEW (CORE PART)
      =============================== */}
      {drilldownData && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-lg">

            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-2 text-left">Step</th>
                <th className="p-2 text-left">Signee</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Time Taken (hrs)</th>
                <th className="p-2 text-left">SLA Target</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {drilldownData.map((task, index) => {

                const isRunning =
                  task.status === "running" || task.status === "pending";

                return (
                  <tr
                    key={index}
                    className={`border-t ${
                      isRunning ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="p-2 font-medium">
                      {task.task_name}
                    </td>

                    <td className="p-2">
                      {task.assigned_user ?? "Unassigned"}
                    </td>

                    <td className="p-2">
                      {task.assigned_role ?? "-"}
                    </td>

                    <td className="p-2">
                      {task.time_taken_hours !== null
                        ? `${task.time_taken_hours}h`
                        : "Running / Pending"}
                    </td>

                    <td className="p-2">
                      {task.sla_hours}h
                    </td>

                    <td className="p-2">
                      <span
                        className={
                          task.sla_status === "breached"
                            ? "text-red-600 font-semibold"
                            : task.sla_status === "met"
                            ? "text-green-600 font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {task.sla_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}

      {!drilldownLoading && !drilldownError && !drilldownData && (
        <p className="text-slate-400">Failed to load instance details</p>
      )}
    </div>
  );
}