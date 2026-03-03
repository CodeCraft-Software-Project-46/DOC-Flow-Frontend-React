// Full instance drilldown section
// Shows step flow, step table, summary and SLA recovery

import { useState, useEffect } from "react";
import type { InstanceSummary } from "../../types";
import { INSTANCES, INSTANCE_DETAILS } from "../../data/dummyData";
import StepFlowBar from "./StepFlowBar";
import SLARecovery from "./SLARecovery";

interface InstanceDrilldownProps {
  workflow: string; // currently selected workflow name
}

// Badge styles per instance status
const STATUS_BG: Record<string, string> = {
  "On Track":  "bg-green-100 text-green-700",
  "At Risk":   "bg-amber-100 text-amber-700",
  "SLA Breach":"bg-red-100 text-red-600",
};

// Status label colors for summary row
const STATUS_COLOR: Record<string, string> = {
  "On Track":  "text-green-600",
  "At Risk":   "text-amber-600",
  "SLA Breach":"text-red-600",
};

export default function InstanceDrilldown({ workflow }: InstanceDrilldownProps) {

  // Get instances for selected workflow
  const instanceList: InstanceSummary[] = INSTANCES[workflow] || [];

  // Selected instance id
  const [selId, setSelId] = useState<string>(instanceList[0]?.id || "");

  // Reset selection when workflow changes
  useEffect(() => {
    const list = INSTANCES[workflow] || [];
    setSelId(list[0]?.id || "");
  }, [workflow]);

  // Get full detail of selected instance
  const detail     = INSTANCE_DETAILS[selId];
  const instanceMeta = instanceList.find((i) => i.id === selId);

  if (!detail || !instanceMeta) return null;

  // Count breached steps
  const breachCount = detail.steps.filter((s) => s.status === "Breached").length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header row */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-bold text-slate-900 text-base">Instance Drill-down</div>
          <div className="text-xs text-slate-400 mt-1">
            Step-by-step SLA analysis for a specific document instance
          </div>
        </div>

        {/* Instance selector + status badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Instance:</span>
          <select
            value={selId}
            onChange={(e) => setSelId(e.target.value)}
            aria-label="Select workflow instance"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none"
          >
            {instanceList.map((i) => (
              <option key={i.id} value={i.id}>{i.id}</option>
            ))}
          </select>

          {/* Status badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BG[instanceMeta.status]}`}>
            {instanceMeta.status}
          </span>
        </div>
      </div>

      {/* Step flow visual bar */}
      <StepFlowBar steps={detail.steps} />

      {/* Steps table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Step", "Assignee", "Time Taken", "SLA Target", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.steps.map((step) => (
              <tr key={step.name} className="border-t border-slate-100">

                {/* Step name */}
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                  {step.name}
                </td>

                {/* Assignee */}
                <td className="px-4 py-3 text-sm text-slate-500">
                  {step.assignee}
                </td>

                {/* Time taken */}
                <td className="px-4 py-3 text-sm text-slate-500">
                  {step.pending
                    ? "Pending"
                    : step.running
                    ? `${step.timeTaken}h (running)`
                    : `${step.timeTaken}h`}
                </td>

                {/* SLA target */}
                <td className="px-4 py-3 text-sm text-slate-500">
                  {step.slaTarget}h
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  {step.pending ? (
                    <span className="bg-slate-100 text-slate-400 text-xs px-2.5 py-1 rounded-full font-medium">
                      ⭕ Not Started
                    </span>
                  ) : step.running ? (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      step.status === "At Risk"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      ⏳ {step.status} ({step.pct}% used)
                    </span>
                  ) : step.status === "Met" ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      ✅ Met
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">
                      ❌ Breached
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div className="flex gap-6 mt-4 px-4 py-3 bg-slate-50 rounded-xl text-sm">
        <span className="text-slate-500">
          Total Breaches:{" "}
          <strong className="text-red-500">{breachCount}</strong>
        </span>
        <span className="text-slate-500">
          Overall Status:{" "}
          <strong className={STATUS_COLOR[instanceMeta.status]}>
            {instanceMeta.status}
          </strong>
        </span>
        <span className="text-slate-500">
          Department:{" "}
          <strong className="text-slate-700">{detail.department}</strong>
        </span>
      </div>

      {/* SLA Recovery collapsible */}
      <div className="mt-4">
        <SLARecovery data={detail} />
      </div>

    </div>
  );
}