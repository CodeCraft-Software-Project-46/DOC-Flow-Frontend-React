// Workflow step-by-step flow visualization
// Shows document progression through workflow steps with SLA metrics

import { getWorkflowStepFlow } from "../../data/dummyData";

interface Props {
  workflow: string;
}

export default function WorkflowStepFlow({ workflow }: Props) {
  const flowData = getWorkflowStepFlow(workflow);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Workflow Step Flow
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Document progression through workflow steps
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {flowData.totalInstances}
          </div>
          <div className="text-xs text-slate-500">Total Instances</div>
        </div>
      </div>

      {/* Step Flow Visualization */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4">
        {flowData.steps.map((step, index) => (
          <div key={step.stepName} className="flex items-center gap-3">
            {/* Step Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-w-[240px] flex-shrink-0">
              {/* Step Header */}
              <div className="font-semibold text-slate-900 mb-3 text-sm border-b border-slate-200 pb-2">
                Step {index + 1}: {step.stepName}
              </div>

              {/* Document Counts */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Received:</span>
                  <span className="font-semibold text-blue-600">
                    {step.received}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Processing:</span>
                  <span className="font-semibold text-orange-600">
                    {step.processing}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Passed:</span>
                  <span className="font-semibold text-green-600">
                    {step.passed}
                  </span>
                </div>
              </div>

              {/* SLA Metrics */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">SLA Met:</span>
                  <span className="font-semibold text-green-600">
                    {step.slaMet} ({step.slaMetRate}%)
                  </span>
                </div>
              </div>

              {/* Visual Indicator for Bottleneck */}
              {step.processing > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="text-xs text-orange-600 font-medium">
                    ⚠️ {step.processing} document{step.processing > 1 ? "s" : ""} waiting
                  </div>
                </div>
              )}
            </div>

            {/* Arrow between steps */}
            {index < flowData.steps.length - 1 && (
              <div className="text-slate-400 text-2xl flex-shrink-0">→</div>
            )}
          </div>
        ))}

        {/* Completed Box */}
        <div className="flex items-center gap-3">
          <div className="text-slate-400 text-2xl flex-shrink-0">→</div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-w-[180px] flex-shrink-0">
            <div className="font-semibold text-green-900 mb-2 text-sm">
              ✅ Completed
            </div>
            <div className="text-3xl font-bold text-green-600">
              {flowData.completedInstances}
            </div>
            <div className="text-xs text-green-700 mt-1">
              {flowData.totalInstances > 0
                ? Math.round(
                    (flowData.completedInstances / flowData.totalInstances) * 100
                  )
                : 0}
              % completion rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
