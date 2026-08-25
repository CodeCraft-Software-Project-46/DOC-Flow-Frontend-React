import { useCallback } from "react";
import StatCard from "../../StatCard";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";
import { fetchWorkflowAvgTime } from "../../../api/analyticsApi";

export default function AvgCompletionTimeWidget({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const isReady = workflowId !== null; //check if workflow is selected

  const queryFn = useCallback( //Create a function that fetches data for the current workflowId
    () =>
      workflowId === null
        ? Promise.resolve(null) //If no workflow is selected, return a resolved promise with null to avoid api calls
        : fetchWorkflowAvgTime(workflowId),
    [workflowId], //Only recreate this function when workflowId changes
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
