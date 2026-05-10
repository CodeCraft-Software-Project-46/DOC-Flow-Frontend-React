import SLADonut from "../../chartAnalytics/SLADonut";
import { fetchSLADistribution } from "../../../services/analyticsApi";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

export default function SlaDistributionWidget() {
  const { data, loading, error } = useAnalyticsQuery(fetchSLADistribution);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading SLA chart...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-500">
        Failed to load SLA chart
      </div>
    );
  }

  return <SLADonut />;
}
