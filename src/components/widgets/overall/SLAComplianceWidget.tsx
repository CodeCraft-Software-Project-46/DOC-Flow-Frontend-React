import StatCard from "../../StatCard";
import { fetchSLACompliance } from "../../../api/analyticsApi";
import type { SLAComplianceResponse } from "../../../types";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

type Props = {
  dateFrom?: string;
  dateTo?: string;
};

export default function SLAComplianceWidget({ dateFrom, dateTo }: Props) {
  const { data, loading, error } = useAnalyticsQuery<SLAComplianceResponse>(
    () => fetchSLACompliance({ from: dateFrom, to: dateTo }),
    [dateFrom, dateTo],
  );

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
