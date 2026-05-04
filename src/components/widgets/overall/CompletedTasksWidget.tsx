import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchCompletedTasks } from "../../../services/analyticsApi";

export default function CompletedTasksWidget() {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchCompletedTasks();
        setValue(res.count);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <StatCard
      icon="📊"
      value={
        loading ? "Loading..."
        : error ? "Error"
        : value ?? "—"
      }
      label="Completed Tasks"
      description="Tasks Successfully Completed"
      color="blue"
    />
  );
}