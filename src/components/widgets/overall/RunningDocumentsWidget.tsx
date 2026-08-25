import { useState } from "react";
import StatCard from "../../StatCard.tsx";
import { fetchRunningDocuments } from "../../../api/analyticsApi.ts";
import type {
  RunningDocumentsApiResponse,
} from "../../../types";
import RunningDocumentsDetails from "./RunningDocumentsDetails";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery.ts";

export default function RunningDocumentsWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<RunningDocumentsApiResponse>(fetchRunningDocuments); //Fetch running documents from API

  const [open, setOpen] = useState(false);

  const value = error ? "-" : (data?.count ?? "-"); //If error → show "-"

  return (
    <>
      <StatCard
        icon="📄"
        value={value}
        loading={loading}
        label="Running Documents"
        description={error ? "Unavailable" : "Currently Active"}
        color="blue"
        onClick={() => !loading && !error && setOpen(true)} //Open details modal on click if not loading or error
      />

      {open && (
        <RunningDocumentsDetails
          onClose={() => setOpen(false)}
          items={data?.documents || []} //If no documents → show empty array
        />
      )}
    </>
  );
}
