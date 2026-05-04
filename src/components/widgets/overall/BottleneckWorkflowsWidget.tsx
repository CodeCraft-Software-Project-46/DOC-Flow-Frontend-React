import { useEffect, useState } from "react";
import BottleneckSteps from "../../chartAnalytics/BottleneckWorkflows";
import { fetchBottlenecks } from "../../../services/analyticsApi";

interface BottleneckWorkflowsWidgetProps {
  onWorkflowSelect?: (workflowId: string) => void;
}

export default function BottleneckWorkflowsWidget({ onWorkflowSelect }: BottleneckWorkflowsWidgetProps) {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchBottlenecks();
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
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading bottlenecks...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[200px] flex items-center justify-center text-sm text-red-400">
        Failed to load bottlenecks
      </div>
    );
  }

  return <BottleneckSteps onWorkflowSelect={onWorkflowSelect} />;
}