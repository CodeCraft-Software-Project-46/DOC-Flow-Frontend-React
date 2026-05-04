import { useEffect, useState } from "react";
import SLADonut from "../../chartAnalytics/SLADonut";
import { fetchSLADistribution } from "../../../services/analyticsApi";

export default function SlaDistributionWidget() {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center min-h-[200px] text-sm text-slate-400">
        Loading SLA chart...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center min-h-[200px] text-sm text-red-400">
        Failed to load chart
      </div>
    );
  }

  return <SLADonut />;
}