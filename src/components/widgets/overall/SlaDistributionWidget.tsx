// Donut chart showing SLA distribution across ALL workflows & instances

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { fetchSLADistribution } from "../../../api/analyticsApi";
import type { SLADistributionPoint } from "../../../types";

type SLAItem = {
  name: "On Time" | "Breached";
  value: number;
  color: string;
};

type Props = {
  dateFrom?: string;
  dateTo?: string;
};

export default function SlaDistributionWidget({ dateFrom, dateTo }: Props) {
  const [data, setData] = useState<SLAItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchSLADistribution({ from: dateFrom, to: dateTo });

        // Transform API response to chart format
        const formatted: SLAItem[] = res.map((item: SLADistributionPoint) => {//Go through every item in the array and transform it to SLAItem format
          const isMet = item.name === "met";    //if name is "met" → true

          return {
            name: isMet ? "On Time" : "Breached",
            value: item.value ?? 0,
            color: isMet ? "#22c55e" : "#ef4444",  //color green if "met", red if "breached" for recharts
          }; 
        });

        setData(formatted);
      } catch (err) {
        console.error("Failed to load SLA distribution", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dateFrom, dateTo]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        SLA Compliance Distribution
      </div>

      <div className="text-xs text-slate-400 mt-1 mb-5">
        All workflows status snapshot (counts shown)
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
            <ResponsiveContainer width={160} height={160}> {/* wrapper that handles size */}
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
                  {data.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-col gap-4">
              {data.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${
                        item.color === "#22c55e"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
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