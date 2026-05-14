import { useState } from "react";
import StatCard from "../../StatCard.tsx";
import { fetchRunningDocuments } from "../../../api/analyticsApi.ts";
import type {
  RunningDocumentsApiResponse,
  RunningDocumentsResponse,
} from "../../../types";
import RunningDocumentsDetails from "./RunningDocumentsDetails";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function RunningDocumentsWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<RunningDocumentsApiResponse>(fetchRunningDocuments);

  const [open, setOpen] = useState(false);

  // WHY: normalize backend response shape safely
  const payload: RunningDocumentsResponse | null =
    data && "value" in data ? data.value : data;

  const value = error ? "-" : (payload?.count ?? "-");

  return (
    <>
      <StatCard
        icon="📄"
        value={value}
        loading={loading}
        label="Running Documents"
        description={error ? "Unavailable" : "Currently Active"}
        color="blue"
        onClick={() => !loading && !error && setOpen(true)}
      />

      {open && (
        <RunningDocumentsDetails
          onClose={() => setOpen(false)}
          items={payload?.documents || []}
        />
      )}
    </>
  );
}
