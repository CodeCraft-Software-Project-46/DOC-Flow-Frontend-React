import StatCard from "../../StatCard";
import { fetchSLACompliance } from "../../../api/analyticsApi";
import type { SLAComplianceResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

export default function SLAComplianceWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<SLAComplianceResponse>(fetchSLACompliance);

  const value = error ? "-" : (data?.percentage ?? "-");

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
