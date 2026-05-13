import StatCard from "../../StatCard";
import { fetchSLACompliance } from "../../../services/api/analyticsApi";
import type { SLAComplianceResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

export default function SLAComplianceWidget() {
  const { data, loading, error } =
    useAnalyticsQuery<SLAComplianceResponse>(fetchSLACompliance);

  /**
   * WHY: backend response may come in multiple shapes,
   * so we safely normalize using only known types (no any needed)
   */
  const percent =
    data?.percentage ?? data?.data?.percentage ?? data?.value ?? undefined;

  const value = error ? "-" : (percent ?? "-");

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
