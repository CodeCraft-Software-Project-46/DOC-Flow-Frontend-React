// Donut chart showing SLA distribution across ALL workflows & instances

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { fetchSLADistribution } from "../../../api/analyticsApi";
import type { SLADistributionPoint } from "../../../types";

type SLAItem = {
  name: string;
  value: number;
  color: string;
};

export default function SlaDistributionWidget() {
  const [data, setData] = useState<SLAItem[]>([]);
  const [loading, setLoading] = useState(true);

  function getLegendDotClass(color: string) {
    return color === "#22c55e"
      ? "bg-green-500"
      : color === "#ef4444"
        ? "bg-red-500"
        : "bg-slate-400";
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSLADistribution();

        const raw = Array.isArray(res) ? res : (res.data ?? []);

        if (!Array.isArray(raw)) {
          console.error("Invalid SLA API response:", raw);
          setData([]);
          return;
        }

        const formatted: SLAItem[] = (raw as SLADistributionPoint[]).map(
          (item) => ({
            name: item.name === "met" ? "On Time" : "Breached",
            value: item.value ?? 0,
            color: item.name === "met" ? "#22c55e" : "#ef4444",
          }),
        );

        setData(formatted);
      } catch (err) {
        console.error("Failed to load SLA distribution", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // // Aggregate COMPLETED step statuses (Met or Breached only) across all instances
  // let met = 0;
  // let breached = 0;

  // Object.values(INSTANCE_DETAILS).forEach((instance) => {//metika kre complteted tasks wltth
  //   instance.steps.forEach((step) => {
  //     // Only count completed steps (Met or Breached), ignore At Risk and Pending
  //     if (step.status === "Met") {
  //       met++;
  //     } else if (step.status === "Breached") {//meka hdnna dummmy eke met breached witrk tynn
  //       breached++;
  //     }
  //   });
  // });

  // const data = [ //Recharts expects data like this
  //   { name: "On Time", value: met, color: "#22c55e" },
  //   { name: "Breached", value: breached, color: "#ef4444" },
  // ].filter(item => item.value > 0); // Remove empty categories met = 10 breached = 0 => only show met

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        SLA Compliance Distribution
      </div>

      <div className="text-xs text-slate-400 mt-1 mb-5">
        All workflows — step-level status snapshot (counts shown)
      </div>

      <div className="min-h-[160px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            No data available
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie //data = [
                  data={data} // { name: "On Time", value: 10, color: "green" },
                  cx={75} //{ name: "Breached", value: 5, color: "red" }]
                  cy={75}
                  innerRadius={50} //makes it donut inner radius > 0
                  outerRadius={70}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270} //clockwise full circle because default is anti-clockwise and we want to start from top (90) and go full circle back to top (-270)
                >
                  {" "}
                  {/*Recharts does NOT care about: color: "#22c55e" you must explicitly say <Cell fill={entry.color} /> */}
                  {data.map(
                    (
                      item,
                      index, //item means one item in the array item = { name: "On Time", value: 10, color: "#22c55e" }     //<Cell fill="green" /> first slice green, second slice red
                    ) => (
                      <Cell key={index} fill={item.color} /> //Each slice gets its own color from the data array          //<Cell fill="red" />
                    ),
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-col gap-4">
              {data.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${getLegendDotClass(item.color)}`}
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {item.name} {/* "On Time" / "Breached" */}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {item.value} {/*count*/}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// | Recharts Component    | Meaning                   |
// | --------------------- | ------------------------- |
// | `ResponsiveContainer` | wrapper that handles size |
// | `PieChart`            | chart container           |
// | `Pie`                 | actual chart             |
// | `Cell`                | each slice                |