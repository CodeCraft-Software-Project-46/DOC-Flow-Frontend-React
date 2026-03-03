// Line chart showing daily SLA compliance % for the last 7 days

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { TREND_DATA } from "../../data/dummyData";

export default function SLATrend() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">SLA Compliance Trend</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">Daily compliance % (last 7 days)</div>

      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={TREND_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="c"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1d4ed8" }}
            name="Compliance %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}