import { useCallback } from "react";

import StatCard from "../../StatCard";

import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

import { fetchWorkflowSLACompliance } from "../../../api/analyticsApi";

interface Props {
  workflowId: number | null;
}

export default function SLAComplianceWidget({ workflowId }: Props) {
  const isReady = workflowId !== null;

  const queryFn = useCallback(
    () =>
      workflowId === null
        ? Promise.resolve(null)
        : fetchWorkflowSLACompliance(workflowId),
    [workflowId],
  );

  const { data, loading, error } = useAnalyticsQuery(queryFn, [workflowId]);

  return (
    <StatCard
      icon="✅"
      value={error || !isReady ? "-" : `${data?.percentage ?? "-"}%`}
      label="SLA Compliance"
      description={error || !isReady ? "Unavailable" : "Overall rate"}
      color="green"
      loading={loading || !isReady}
    />
  );
}
