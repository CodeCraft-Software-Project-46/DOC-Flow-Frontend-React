import { useCallback } from "react";
import StatCard from "../../StatCard";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";
import { fetchWorkflowRunningInstances } from "../../../api/analyticsApi";

export default function RunningInstancesWidget({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const isReady = workflowId !== null;

  const queryFn = useCallback(
    () =>
      workflowId === null
        ? Promise.resolve(null)
        : fetchWorkflowRunningInstances(workflowId),
    [workflowId],
  );

  const { data, loading, error } = useAnalyticsQuery(queryFn, [workflowId]);

  return (
    <StatCard
      icon="📁"
      value={error || !isReady ? "-" : (data?.value ?? "-")}
      label="Running Instances"
      description={error || !isReady ? "Unavailable" : "Selected workflow"}
      color="blue"
      loading={loading || !isReady}
    />
  );
}
