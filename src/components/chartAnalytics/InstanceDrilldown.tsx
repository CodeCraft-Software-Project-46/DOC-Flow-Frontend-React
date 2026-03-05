// Full instance drilldown section
// Shows step flow, step table and summary

import { useState, useEffect } from "react";
import type { InstanceSummary } from "../../types";
import { INSTANCES, INSTANCE_DETAILS } from "../../data/dummyData";
import StepFlowBar from "./StepFlowBar";

interface InstanceDrilldownProps {
  workflow: string; // currently selected workflow name
}

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

        {/* Instance selector */}
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
                      Pending
                    </span>
                  ) : step.running ? (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      Current
                    </span>
                  ) : step.status === "Met" ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      Met
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">
                      Breached
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
      </div>

    </div>
  );
}