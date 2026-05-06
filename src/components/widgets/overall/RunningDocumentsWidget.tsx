import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchRunningDocuments } from "../../../services/analyticsApi";
import type {
  RunningDocumentsApiResponse,
  RunningDocumentsResponse,
} from "../../../types";
import RunningDocumentsDetails from "./RunningDocumentsDetails";

export default function RunningDocumentsWidget() {
  const [data, setData] = useState<RunningDocumentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res: RunningDocumentsApiResponse =
          await fetchRunningDocuments();
        const payload = "value" in res ? res.value : res;
        setData(payload);
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
          items={data?.documents || []}
        />
      )}
    </>
  );
}