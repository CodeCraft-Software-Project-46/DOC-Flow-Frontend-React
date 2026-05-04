// Shows workflows with highest average processing time + breach rate
// import { getBreachStyle, getProgressPercentage } from "../../utils/bottleneckUtils";
import { useEffect, useState } from "react";
import { fetchBottlenecks } from "../../services/analyticsApi";


interface BottleneckWorkflowsProps {
  onWorkflowSelect?: (workflow: string) => void;//onWorkflowSelect is just a prop name ?. just safely checks if the function exists before calling it
} //If this prop is provided, it must be a function that takes a string and returns nothing

type BottleneckItem = {
  workflow: string;
  avg: number;
  breach: number;
  tasks: number;
  score: number; // ✅ ADD BOTTLENECK SCORE
};

type BottleneckApiItem = {
  workflow_name?: string;
  avg_completion_time_hours?: number;
  breach_percentage?: number;
  total_tasks?: number;
  bottleneck_score?: number;
};

export default function BottleneckWorkflows({ onWorkflowSelect }: BottleneckWorkflowsProps) { //BottleneckWorkflows is a function component it receives one prop called onWorkflowSelect
  const [data, setData] = useState<BottleneckItem[]>([]); // ✅ MOVE HERE
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBottlenecks();
        const raw = res?.data ?? res ?? [];

        if (!Array.isArray(raw)) {
          setData([]);
          return;
        }

        const formatted: BottleneckItem[] = (raw as BottleneckApiItem[])
          .map((item) => ({
            workflow: item.workflow_name || "Unknown",
            avg: item.avg_completion_time_hours ?? 0,
            breach: item.breach_percentage ?? 0,
            tasks: item.total_tasks ?? 0,
            score: item.bottleneck_score ?? 0,
          }))
          .sort((a, b) => b.score - a.score);

        setData(formatted);
      } catch (err) {
        console.error("Failed to load bottlenecks", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  function getScoreStyle(score: number) {
    if (score >= 0.7) return { bar: "bg-red-500", text: "text-red-500" };
    if (score >= 0.4) return { bar: "bg-amber-400", text: "text-amber-400" };
    return { bar: "bg-green-500", text: "text-green-500" };
  }

  function getScoreWidthClass(score: number) {
    const percentage = Math.max(0, Math.min(100, Math.round(score * 100)));
    if (percentage >= 100) return "w-full";
    if (percentage >= 90) return "w-[90%]";
    if (percentage >= 80) return "w-[80%]";
    if (percentage >= 70) return "w-[70%]";
    if (percentage >= 60) return "w-[60%]";
    if (percentage >= 50) return "w-1/2";
    if (percentage >= 40) return "w-[40%]";
    if (percentage >= 30) return "w-[30%]";
    if (percentage >= 20) return "w-1/5";
    if (percentage >= 10) return "w-[10%]";
    return "w-0";
  }

  return (////now the child can use the parent’s function. handleWorkflowSelect 
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">📊 System Bottleneck Workflows</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Workflows with Highest Bottleneck Scores (based on avg time, breach rate, and task volume)
      </div>

      <div className="flex flex-col gap-3 min-h-[160px]"> {/*BOTTLENECK_DATA is your dummy data array*/}
        {loading ? (
        <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
          Loading workflows...
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
          No data available
        </div>
      ) : (
        data.map((item) => { /*.map() means: item=  go through each item in the array one by one*/
          const style = getScoreStyle(item.score);
          const widthClass = getScoreWidthClass(item.score);
        
          return (
            <div
              key={item.workflow} /*this component receives props and those props must follow BottleneckWorkflowsProps*/
              onClick={() => onWorkflowSelect?.(item.workflow)}     /*run this function when user clicks this div onWorkflowSelect("GRN Processing")  handleWorkflowSelect("GRN Processing")  */
              className="cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
            >
              {/* Workflow name */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-800">
                  {item.workflow}
                </span>
                <span className={`text-xs font-bold ${style.text}`}>
                  {(item.score * 100).toFixed(0)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${style.bar} ${widthClass}`}
                />
              </div>

              {/* Stats row */}
              <div className="text-xs text-slate-500 flex gap-3">
                <span>{item.avg}h avg</span>
                <span>· {item.breach}% breach</span>
                <span>· {item.tasks} tasks</span>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          0–40% Low
        </span>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          40–70% Medium
        </span>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          70–100% High
        </span>
      </div>
    </div>
  );
}