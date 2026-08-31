import StatCard from "../../StatCard.tsx";
import { fetchActiveOverdueTasks } from "../../../api/analyticsApi.ts";
import type { ActiveOverdueTasksResponse } from "../../../types";
import ActiveTasksDetails from "./ActiveTasksDetails";
import { useState } from "react";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function ActiveOverdueTasksWidget() {
  const { data, loading, error } =          //Fetching Data from custom hook
    useAnalyticsQuery<ActiveOverdueTasksResponse>(fetchActiveOverdueTasks); //This API returns ActiveOverdueTasksResponse

  const [open, setOpen] = useState(false);

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
        onClick={() => !loading && !error && setOpen(true)} //Open details modal on click if not loading or error
      />

      {open && (
        <ActiveTasksDetails //send 2 props to details component: onClose function and tasks array
          onClose={() => setOpen(false)} 
          items={data?.tasks || []}//send tasks array to details component. If no tasks → show empty array
        />
      )}
    </>
  );
}
