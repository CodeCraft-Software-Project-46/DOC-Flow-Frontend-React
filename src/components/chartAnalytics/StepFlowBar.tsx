// Shows the visual step flow bar at the top of instance drilldown
// Each step shows its status with icon and color

import type { WorkflowStep } from "../../types";

interface StepFlowBarProps {
  steps: WorkflowStep[];
}

export default function StepFlowBar({ steps }: StepFlowBarProps) {
  // Get border + background color per step status
  function getStepStyle(step: WorkflowStep): string {
    if (step.running) return "bg-blue-50 border-blue-400";
    if (step.pending) return "bg-slate-100 border-slate-200";
    if (step.status === "Breached") return "bg-red-50 border-red-400";
    return "bg-green-50 border-green-400";
  }

  // Get text color per step status
  function getTextColor(step: WorkflowStep): string {
    if (step.running) return "text-blue-700";
    if (step.pending) return "text-slate-400";
    if (step.status === "Breached") return "text-red-600";
    return "text-green-700";
  }

  return (
    <div className="flex items-center flex-wrap gap-1 bg-slate-50 rounded-xl px-5 py-4">
      {steps.map((step, index) => (
        <div key={step.name} className="flex items-center">
          {/* Step pill */}
          <div
            className={`flex items-center gap-1.5 border-2 rounded-full px-3 py-1.5 ${getStepStyle(step)}`}
          >
            <span className={`text-xs font-semibold ${getTextColor(step)}`}>
              {step.name}
            </span>
            {/* Current badge */}
            {step.running && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded ml-1">
                Current
              </span>
            )}
          </div>

          {/* Arrow between steps */}
          {index < steps.length - 1 && (
            <span className="text-slate-300 text-lg mx-1">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
