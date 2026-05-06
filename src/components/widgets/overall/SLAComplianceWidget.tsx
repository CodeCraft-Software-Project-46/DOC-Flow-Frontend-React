import { useEffect, useState } from "react";
import StatCard from "../../chartAnalytics/StatCard";
import { fetchSLACompliance } from "../../../services/analyticsApi";
import type { SLAComplianceResponse } from "../../../types";

export default function SLAComplianceWidget() {
  const [data, setData] = useState<SLAComplianceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res: SLAComplianceResponse = await fetchSLACompliance();
        setData(res);
      } catch (e) {
        console.error("SLA compliance error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // defensive mapping (backend may change shape)
  const percent =
    data?.percentage ??
    data?.data?.percentage ??
    data?.value ??
    null;

  const value = error ? "-" : percent ?? "-";

  return (
    <StatCard
      icon="✅"
      value={value}
      loading={loading}
      label="SLA Compliance %"
      description={error ? "Unavailable" : "Overall compliance rate"}
      color="green"
    />
  );
}