// Line chart showing daily SLA compliance % for the last 7 days

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { TREND_DATA } from "../../data/dummyData"; //{ day: "Mon", compliance: 74 }, { day: "Tue", compliance: 78 }, { day: "Wed", compliance: 80 },{ day: "Thu", compliance: 82 }, { day: "Fri", compliance: 84 }, { day: "Sat", compliance: 83 }, { day: "Sun", compliance: 85 }

export default function SLATrend() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small UI-friendly loading state so the trend card behavior matches other widgets.
    // This gives the page a moment to render placeholders consistently when real API data is not used.
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Consider the trend to have data only when at least one non-zero numeric compliance exists.
  const hasData =
    Array.isArray(TREND_DATA) &&
    (TREND_DATA as Array<{ compliance?: number | null }>).some(
      (d) => typeof d.compliance === "number" && d.compliance > 0,
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        SLA Compliance Trend
      </div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Daily compliance % (time)
      </div>

      <div className="min-h-[160px]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            Loading chart...
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center min-h-[160px] text-xs text-slate-400">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={TREND_DATA}>
              {" "}
              {/*main container of the chart*/}
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />{" "}
              {/*background grid lines with light color and dashed style*/}
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]} // fixed y-axis range from 60% to 100%
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Line //actual line you see on the graph
                type="monotone"
                dataKey="compliance"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3, fill: "#1d4ed8" }}
                name="Compliance %"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
