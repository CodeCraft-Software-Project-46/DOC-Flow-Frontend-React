import BottleneckSteps from "../../chartAnalytics/BottleneckWorkflows";
import { fetchBottlenecks } from "../../../services/analyticsApi";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

type Props = {
  onWorkflowSelect?: (workflow: string) => void;
};

export default function BottleneckWorkflowsWidget({ onWorkflowSelect }: Props) {
  const { data, loading, error } = useAnalyticsQuery(fetchBottlenecks);

  // WHY: avoid rendering broken chart UI
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading bottlenecks...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-500">
        Failed to load bottlenecks
      </div>
    );
  }

  return <BottleneckSteps onWorkflowSelect={onWorkflowSelect} />;
}
