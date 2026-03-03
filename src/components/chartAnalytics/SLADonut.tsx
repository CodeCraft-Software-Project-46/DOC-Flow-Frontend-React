// Donut chart showing SLA distribution across ALL workflows & instances

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { INSTANCE_DETAILS } from "../../data/dummyData";

export default function SLADonut() {

  // Aggregate COMPLETED step statuses (Met or Breached only) across all instances
  let met = 0;
  let breached = 0;

  Object.values(INSTANCE_DETAILS).forEach((instance) => {
    instance.steps.forEach((step) => {
      // Only count completed steps (Met or Breached), ignore At Risk and Pending
      if (step.status === "Met") {
        met++;
      } else if (step.status === "Breached") {
        breached++;
      }
    });
  });

  const data = [
    { name: "On Time", value: met, color: "#22c55e" },
    { name: "Breached", value: breached, color: "#ef4444" },
  ].filter(item => item.value > 0); // Remove empty categories

  const getLegendDotClass = (name: string): string => {
    if (name === "On Time") return "bg-green-500";
    if (name === "Breached") return "bg-red-500";
    return "bg-slate-400";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        SLA Compliance Distribution
      </div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        All workflows — step-level status snapshot
      </div>

      <div className="flex items-center gap-8">

        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx={75}
              cy={75}
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div key={item.name}>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block ${getLegendDotClass(item.name)}`} />
                <span className="text-sm font-semibold text-slate-700">
                  {item.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {item.value}
              </div>
              <div className="text-xs text-slate-400">steps</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}