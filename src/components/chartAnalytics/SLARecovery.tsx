// Collapsible SLA Recovery Analysis panel
// Shows deficit, remaining steps and achievability

import { useState } from "react";
import type { InstanceDetail } from "../../types";

interface SLARecoveryProps {
  data: InstanceDetail;
}

export default function SLARecovery({ data }: SLARecoveryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { recovery, overallSLA, timeUsed } = data;
  const timeRemaining = overallSLA - timeUsed;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">

      {/* Toggle header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm">
          ⏱ SLA Recovery Analysis
        </span>
        <span className="text-slate-400 text-xs">
          {isOpen ? "▲ Hide" : "▼ Show"}
        </span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="p-5">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Overall SLA",      value: `${overallSLA}h`,    color: "text-blue-600"  },
              { label: "Time Used So Far",  value: `${timeUsed}h`,      color: "text-orange-500"},
              { label: "Time Remaining",    value: `${timeRemaining}h`, color: "text-green-600" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-slate-50 rounded-xl p-3 text-center"
              >
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-slate-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* On track — no deficit */}
          {recovery.deficit === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-semibold text-green-700">
              ✅ Instance is on track. No recovery action needed.
            </div>
          ) : (
            <>
              {/* Deficit warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800">
                ⚠️ <strong>Deficit: {recovery.deficit}h over budget.</strong> Remaining
                steps must complete faster than planned.
              </div>

              {/* Recovery steps table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {["Step", "Original SLA", "Must Complete In", "Save", "Achievability"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recovery.remaining.map((r) => (
                      <tr key={r.step} className="border-t border-slate-100">
                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-800">
                          {r.step}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-500">
                          {r.originalSLA}h
                        </td>
                        <td className="px-3 py-2.5 text-sm font-semibold text-red-600">
                          {r.mustComplete}h
                        </td>
                        <td className="px-3 py-2.5 text-sm text-orange-500">
                          -{r.save}h
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs font-semibold ${
                            r.achievable === "yes"
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}>
                            {r.achievable === "yes" ? "✅ Achievable" : "⚠️ Tight"}
                            <span className="text-slate-400 font-normal ml-1">
                              (avg: {r.avgTime}h)
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overall recovery verdict */}
              <div className={`rounded-xl px-4 py-3 text-sm font-semibold border ${
                recovery.overall === "critical"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                Overall SLA Recovery:{" "}
                {recovery.overall === "critical"
                  ? "❌ Very Difficult"
                  : "⚠️ Possible but Tight"}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}