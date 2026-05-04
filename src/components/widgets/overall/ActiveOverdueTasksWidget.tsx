import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchActiveOverdueTasks } from "../../../services/analyticsApi";

export default function ActiveOverdueTasksWidget() {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchActiveOverdueTasks();
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
      icon="⚠️"
      value={
        loading ? "Loading..."
        : error ? "Error"
        : value ?? "—"
      }
      label="Active Overdue Tasks"
      description="Requires Immediate Attention"
      color="red"
    />
  );
}