// Shows workflows with highest average processing time + breach rate
import { getBreachStyle, getProgressPercentage } from "../../utils/bottleneckUtils";
import { BOTTLENECK_DATA } from "../../data/dummyData";

interface BottleneckWorkflowsProps {
  onWorkflowSelect?: (workflow: string) => void;//onWorkflowSelect is just a prop name ?. just safely checks if the function exists before calling it
} //If this prop is provided, it must be a function that takes a string and returns nothing

export default function BottleneckWorkflows({ onWorkflowSelect }: BottleneckWorkflowsProps) { //BottleneckWorkflows is a function component it receives one prop called onWorkflowSelect
  const maxAvg = Math.max(...BOTTLENECK_DATA.map(i => i.avg));//calculate maxAvg
  return (////now the child can use the parent’s function. handleWorkflowSelect 
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">📊 System Bottleneck Workflows</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Workflows with Highest Average Processing Time
      </div>

      <div className="flex flex-col gap-3"> {/*BOTTLENECK_DATA is your dummy data array*/}
        {BOTTLENECK_DATA.map((item) => { /*.map() means: item=  go through each item in the array one by one*/
          const breachStyle = getBreachStyle(item.breach); //getBreachStyle(19)
          return (
            <div
              key={item.workflow} /*this component receives props and those props must follow BottleneckWorkflowsProps*/
              onClick={() => onWorkflowSelect?.(item.workflow)}     /*run this function when user clicks this div onWorkflowSelect("GRN Processing")  handleWorkflowSelect("GRN Processing")  */
              className="cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
            >
              {/* Workflow name */}
              <div className="text-sm font-semibold text-slate-800 mb-1">
                {item.workflow  }
              </div>

              {/* Progress bar */}
              <div className="bg-slate-100 rounded-full h-3 overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all ${breachStyle.barClass}`}
                  style={{ width: getProgressPercentage(item.avg, maxAvg) }}
                />
              </div>

              {/* Stats row */}
              <div className="flex gap-3 text-xs text-slate-500">
                <span>{item.avg}h avg</span>
                <span className={`font-semibold ${breachStyle.textClass}`}>
                  · {item.breach}% breach
                </span>
                <span>· {item.tasks} tasks</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 0–5% Excellent
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 6–15% Good
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 15–100% At Risk
        </span>
      </div>
    </div>
  );
}