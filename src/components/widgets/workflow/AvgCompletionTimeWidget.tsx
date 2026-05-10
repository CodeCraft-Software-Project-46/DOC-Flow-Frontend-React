import { useCallback } from "react";

import StatCard from "../../chartAnalytics/StatCard";

import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

import { fetchWorkflowAvgTime } from "../../../services/analyticsApi";

export default function AvgCompletionTimeWidget({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const isReady = workflowId !== null;

  const queryFn = useCallback(
    () =>
      workflowId === null
        ? Promise.resolve(null)
        : fetchWorkflowAvgTime(workflowId),
    [workflowId],
  );

  const { data, loading, error } = useAnalyticsQuery(queryFn, [workflowId]);

  return (
    <StatCard
      icon="⏱"
      value={
        error || !isReady ? "-" : `${data?.avg_completion_time_hours ?? "-"}h`
      }
      label="Avg Completion Time"
      description={error || !isReady ? "Unavailable" : "Per instance"}
      color="blue"
      loading={loading || !isReady}
    />
  );
}
