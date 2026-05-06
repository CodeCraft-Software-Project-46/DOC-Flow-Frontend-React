import { useEffect, useState } from "react";
import SLADonut from "../../chartAnalytics/SLADonut";
import { fetchSLADistribution } from "../../../services/analyticsApi";
import type { SLADistributionResponse } from "../../../types";

export default function SlaDistributionWidget() {
  const [data, setData] = useState<SLADistributionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchSLADistribution();
        setData(res);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-center min-h-[200px] text-sm text-slate-400">
        Loading SLA chart...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center gap-2 min-h-[200px]">
        <div className="font-semibold text-slate-900 text-base">
          SLA Compliance Distribution
        </div>
        <div className="text-sm text-slate-900">
          Failed to load chart
        </div>
      </div>
    );
  }

  return <SLADonut />;
}