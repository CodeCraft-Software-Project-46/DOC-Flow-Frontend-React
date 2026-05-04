import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchSLACompliance } from "../../../services/analyticsApi";

export default function SLAComplianceWidget() {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchSLACompliance();
        setValue(res.value ?? res.percent ?? res.count ?? null);
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
      icon="✅"
      value={
        loading ? "Loading..."
        : error ? "Error"
        : value ?? "—"
      }
      label="SLA Compliance %"
      description="Overall compliance rate"
      color="green"
    />
  );
}