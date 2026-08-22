import StatCard from "../../StatCard.tsx";
import { fetchCompletedTasks } from "../../../api/analyticsApi.ts";
import type { CompletedTasksResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

type Props = {
  dateFrom?: string;
  dateTo?: string;
};

export default function CompletedTasksWidget({ dateFrom, dateTo }: Props) {
  const { data, loading, error } = useAnalyticsQuery<CompletedTasksResponse>(
    () => fetchCompletedTasks({ from: dateFrom, to: dateTo }),
    [dateFrom, dateTo],
  );

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
