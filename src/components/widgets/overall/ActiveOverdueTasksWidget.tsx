import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchActiveOverdueTasks } from "../../../services/analyticsApi";
import type { ActiveOverdueTasksResponse } from "../../../types";
import ActiveTasksDetails from "./ActiveTasksDetails";

export default function ActiveOverdueTasksWidget() {
  const [data, setData] = useState<ActiveOverdueTasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchActiveOverdueTasks();
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
    <>
      <StatCard
        icon="⚠️"
        value={value}
        loading={loading}
        label="Active Overdue Tasks"
        description={error ? "Unavailable" : "Needs Attention"}
        color="red"
        onClick={() => !loading && !error && setOpen(true)}
      />

      {open && (
        <ActiveTasksDetails
          onClose={() => setOpen(false)}
          items={data?.tasks || []}
        />
      )}
    </>
  );
}