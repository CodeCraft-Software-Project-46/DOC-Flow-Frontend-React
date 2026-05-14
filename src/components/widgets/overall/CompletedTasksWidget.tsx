import StatCard from "../../StatCard.tsx";
import { fetchCompletedTasks } from "../../../api/analyticsApi.ts";
import type { CompletedTasksResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function CompletedTasksWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<CompletedTasksResponse>(fetchCompletedTasks);

  // keeps UI stable even if backend fails
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
