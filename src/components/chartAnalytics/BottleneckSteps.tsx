// Shows workflows with highest average processing time + breach rate

import { BOTTLENECK_DATA } from "../../data/dummyData";

interface BottleneckStepsProps {
  onWorkflowSelect?: (workflow: string) => void;
}

// Returns color based on breach percentage
function getBreachColorClass(breach: number): string {
  if (breach <= 5) return "bg-green-500 text-green-500";
  if (breach <= 15) return "bg-amber-500 text-amber-500";
  return "bg-red-500 text-red-500";
}

function getProgressWidthClass(avg: number): string {
  if (avg <= 14) return "w-1/4";
  if (avg <= 33) return "w-2/4";
  if (avg <= 50) return "w-3/4";
  return "w-full";
}

export default function BottleneckSteps({ onWorkflowSelect }: BottleneckStepsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">📊 System Bottleneck Workflows</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Workflows with Highest Average Processing Time
      </div>

      <div className="flex flex-col gap-3">
        {BOTTLENECK_DATA.map((item) => (
          <div 
            key={item.step}
            onClick={() => onWorkflowSelect?.(item.step)}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
          >
            {/* Workflow name */}
            <div className="text-sm font-semibold text-slate-800 mb-1">
              {item.step}
            </div>

            {/* Progress bar */}
            <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${getProgressWidthClass(item.avg)} ${getBreachColorClass(item.breach).split(" ")[0]}`}
              />
            </div>

            {/* Stats row */}
            <div className="flex gap-3 text-xs text-slate-500">
              <span>{item.avg}h avg</span>
              <span className={`font-semibold ${getBreachColorClass(item.breach).split(" ")[1]}`}>
                · {item.breach}% breach
              </span>
              <span>· {item.tasks} tasks</span>
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