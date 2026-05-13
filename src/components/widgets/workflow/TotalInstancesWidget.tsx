import { useCallback } from "react";

import StatCard from "../../StatCard";

import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

import { fetchWorkflowTotalInstances } from "../../../services/api/analyticsApi";

export default function TotalInstancesWidget({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const isReady = workflowId !== null;

  const queryFn = useCallback(
    () =>
      workflowId === null
        ? Promise.resolve(null)
        : fetchWorkflowTotalInstances(workflowId),
    [workflowId],
  );

  const { data, loading, error } = useAnalyticsQuery(queryFn, [workflowId]);

  return (
    <StatCard
      icon="📁"
      value={error || !isReady ? "-" : (data?.value ?? "-")}
      label="Total Instances"
      description={error || !isReady ? "Unavailable" : "Selected workflow"}
      color="blue"
      loading={loading || !isReady}
    />
  );
}
