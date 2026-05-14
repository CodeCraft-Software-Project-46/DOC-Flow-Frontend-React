import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";
import { fetchWorkflowSteps } from "../../../api/analyticsApi";
import type { WorkflowStepFlowDetailResponse } from "../../../types";

interface Props {
  workflowId: number | null;
}

export default function WorkflowStepFlowWidget({ workflowId }: Props) {
  const { data, loading, error } =
    useAnalyticsQuery<WorkflowStepFlowDetailResponse | null>(
      () =>
        workflowId === null
          ? Promise.resolve(null)
          : fetchWorkflowSteps(workflowId),
      [workflowId]
    );

  if (workflowId === null || loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[260px]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-50 border rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-slate-400">
        Failed to load step flow
      </div>
    );
  }

  const steps = data.steps ?? [];

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

      {/* Steps */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="min-w-[240px] bg-slate-50 border rounded-xl p-4">
              <div className="font-semibold mb-3">
                {step.task_name || "Unnamed Task"}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Received</span>
                  <span>{step.received ?? 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Passed</span>
                  <span className="text-green-600">{step.passed ?? 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Processing</span>
                  <span className="text-amber-600">
                    {step.processing ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>SLA Breach %</span>
                  <span className="text-red-600">
                    {step.breach_percentage ?? 0}%
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-500 mb-2">
                  Processing Documents
                </div>

                <div className="flex flex-wrap gap-2">
                  {step.processing_documents?.length ? (
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

            {index !== steps.length - 1 && (
              <div className="text-slate-400 text-xl">→</div>
            )}
          </div>
        ))}

        <div className="min-w-[220px] bg-green-50 border rounded-xl p-4">
          <div className="font-semibold text-green-700 mb-3">
            Workflow Completion
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Instances</span>
              <span className="font-semibold">
                {data.total_instances ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Completed</span>
              <span className="font-semibold text-green-700">
                {data.completed_instances ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}