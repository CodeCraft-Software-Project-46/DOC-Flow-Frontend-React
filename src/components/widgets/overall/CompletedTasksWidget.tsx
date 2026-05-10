import StatCard from "../../chartAnalytics/StatCard";
import { fetchCompletedTasks } from "../../../services/analyticsApi";
import type { CompletedTasksResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function CompletedTasksWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<CompletedTasksResponse>(fetchCompletedTasks);

  // WHY: keeps UI stable even if backend fails
  const value = error ? "-" : (data?.count ?? "-");

  return (
    <StatCard
      icon="📊"
      value={value}
      loading={loading}
      label="Completed Tasks"
      description={error ? "Unavailable" : "Tasks Successfully Completed"}
      color="blue"
    />
  );
}
