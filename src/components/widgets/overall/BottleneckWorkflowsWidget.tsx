// Shows workflows with highest average processing time + breach rate

import { useEffect, useState } from "react";
import { fetchBottlenecks } from "../../../api/analyticsApi";
import type { BottleneckWorkflow, BottleneckItem } from "../../../types";

export default function BottleneckWorkflows() {

  const [data, setData] = useState<BottleneckItem[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const res = await fetchBottlenecks(); //API call 

        const raw = Array.isArray(res) //check if response is already an array 
          ? res
          : (res.data ?? []);

        if (!Array.isArray(raw)) { //If data is broken → show empty state.
          setData([]);
          return;
        }

        const formatted: BottleneckItem[] = ( //converts backend data → UI format 
          raw as BottleneckWorkflow[]
        )
          .map((item) => ({
            workflow: item.workflow_name || "Unknown",
            avg: item.avg_completion_time_hours ?? 0,
            breach: item.breach_percentage ?? 0,
            tasks: item.total_tasks ?? 0,
            score: item.bottleneck_score ?? 0,
          }));

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

  function getScoreStyle(score: number) {  // Determines bar color based on bottleneck score
    if (score >= 0.7) {
      return {
        bar: "bg-red-500",
        text: "text-red-500",
      };
    }

    if (score >= 0.4) {
      return {
        bar: "bg-amber-400",
        text: "text-amber-400",
      };
    }

    return {
      bar: "bg-green-500",
      text: "text-green-500",
    };
  }

  function getScoreWidthClass(score: number) { //Determines bar width based on bottleneck score
    const percentage = Math.max(
      0,
      Math.min(100, Math.round(score * 100)), //convert score to percentage
    );

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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        📊 System Bottleneck Workflows
      </div>

      <div className="text-xs text-slate-400 mt-1 mb-5">
        Workflows with Highest Bottleneck Scores (based on avg time, breach
        rate, and task volume)
      </div>

      <div className="flex flex-col gap-3 min-h-[160px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            Loading workflows...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            No data available
          </div>
        ) : (
          data.map((item) => {
            /*.map() means: item=  go through each item in the array one by one*/
            const style = getScoreStyle(item.score);
            const widthClass = getScoreWidthClass(item.score);

            return (
              <div key={item.workflow} className="p-2 rounded-lg transition-colors">
                {/* Workflow name */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.workflow}
                  </span>

                  <span className={`text-xs font-bold ${style.text}`}>
                    {(item.score * 100).toFixed(0)}%  {/* show bottleneck score as percentage */}
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
          })
        )}
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

