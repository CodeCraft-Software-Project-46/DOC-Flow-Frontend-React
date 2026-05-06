import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchCompletedTasks } from "../../../services/analyticsApi";
import type { CompletedTasksResponse } from "../../../types";

export default function CompletedTasksWidget() {
  const [data, setData] = useState<CompletedTasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res: CompletedTasksResponse = await fetchCompletedTasks();
        setData(res);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const value = error ? "-" : data?.count ?? "-";

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