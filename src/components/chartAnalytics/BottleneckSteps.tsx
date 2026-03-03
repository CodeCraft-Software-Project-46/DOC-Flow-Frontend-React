// Shows steps with highest average processing time + breach rate

import { BOTTLENECK_DATA } from "../../data/dummyData";

// Returns color based on breach percentage
function getBreachColorClass(breach: number): string {
  if (breach <= 5) return "bg-green-500 text-green-500";
  if (breach <= 15) return "bg-amber-500 text-amber-500";
  return "bg-red-500 text-red-500";
}

function getProgressWidthClass(avg: number): string {
  if (avg <= 8) return "w-1/4";
  if (avg <= 16) return "w-2/4";
  if (avg <= 24) return "w-3/4";
  return "w-full";
}

export default function BottleneckSteps() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">📊 System Bottleneck Steps</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Steps with Highest Average Processing Time
      </div>

      <div className="flex flex-col gap-5">
        {BOTTLENECK_DATA.map((step) => (
          <div key={step.step}>
            {/* Step name */}
            <div className="text-sm font-semibold text-slate-800 mb-2">
              {step.step}
            </div>

            {/* Progress bar */}
            <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${getProgressWidthClass(step.avg)} ${getBreachColorClass(step.breach).split(" ")[0]}`}
              />
            </div>

            {/* Stats row */}
            <div className="flex gap-3 text-xs text-slate-500">
              <span>{step.avg}h avg</span>
              <span className={`font-semibold ${getBreachColorClass(step.breach).split(" ")[1]}`}>
                · {step.breach}% breach
              </span>
              <span>· {step.tasks} tasks</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 0–5% Excellent
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 6–15% Good
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> +15% At Risk
        </span>
      </div>
    </div>
  );
}