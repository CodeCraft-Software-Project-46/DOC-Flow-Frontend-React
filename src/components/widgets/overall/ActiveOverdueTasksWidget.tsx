import StatCard from "../../StatCard.tsx";
import { fetchActiveOverdueTasks } from "../../../api/analyticsApi.ts";
import type { ActiveOverdueTasksResponse } from "../../../types";
import ActiveTasksDetails from "./ActiveTasksDetails";
import { useState } from "react";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function ActiveOverdueTasksWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<ActiveOverdueTasksResponse>(fetchActiveOverdueTasks);

  const [open, setOpen] = useState(false);

  // WHY: safe fallback so UI never breaks
  const value = error ? "-" : (data?.count ?? "-");

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
