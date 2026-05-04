import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchRunningDocuments } from "../../../services/analyticsApi";

export default function RunningDocumentsWidget() {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchRunningDocuments();
        setValue(res.value);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <StatCard
      icon="📄"
      value={
        loading ? "Loading..."
        : error ? "Error"
        : value ?? "—"
      }
      label="Running Documents"
      description="Currently Active"
      color="blue"
    />
  );
}
