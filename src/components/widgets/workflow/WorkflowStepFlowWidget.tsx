import type { WorkflowStepDetail } from "../../../types";

interface WorkflowStepFlowProps {
  steps: WorkflowStepDetail[];
  totalInstances?: number;
  completedInstances?: number;
}

export default function WorkflowStepFlowWidget({
  steps,
  totalInstances = 0,
  completedInstances = 0,
}: WorkflowStepFlowProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900">
          Workflow Step Flow
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Document progression through workflow tasks
        </p>
      </div>

      {/* Step Flow */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Task Box */}
            <div className="min-w-[240px] bg-slate-50 border border-slate-200 rounded-xl p-4">
              {/* Task Name */}
              <div className="font-semibold text-slate-800 mb-3">
                {step.task_name || "Unnamed Task"}
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Documents Received</span>

                  <span className="font-medium text-slate-800">
                    {step.received ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Documents Passed</span>

                  <span className="font-medium text-green-600">
                    {step.passed ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Processing</span>

                  <span className="font-medium text-amber-600">
                    {step.processing ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">SLA Breach %</span>

                  <span className="font-medium text-red-600">
                    {step.breach_percentage ?? 0}%
                  </span>
                </div>
              </div>

              {/* Processing Documents */}
              <div className="mt-4">
                <div className="text-xs font-medium text-slate-500 mb-2">
                  Processing Documents
                </div>

                <div className="flex flex-wrap gap-2">
                  {step.processing_documents &&
                  step.processing_documents.length > 0 ? (
                    step.processing_documents.map((doc, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                      >
                        {doc}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      No active documents
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow */}
            {index !== steps.length - 1 && (
              <div className="text-slate-400 text-xl">→</div>
            )}
          </div>
        ))}

        {/* Final Completion Box */}
        <div className="min-w-[220px] bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="font-semibold text-green-700 mb-3">
            Workflow Completion
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Instances</span>

              <span className="font-semibold">{totalInstances}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">Completed</span>

              <span className="font-semibold text-green-700">
                {completedInstances}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
