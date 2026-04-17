// Line chart showing daily SLA compliance % for the last 7 days

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { TREND_DATA } from "../../data/dummyData"; //{ day: "Mon", compliance: 74 }, { day: "Tue", compliance: 78 }, { day: "Wed", compliance: 80 },{ day: "Thu", compliance: 82 }, { day: "Fri", compliance: 84 }, { day: "Sat", compliance: 83 }, { day: "Sun", compliance: 85 }

export default function SLATrend() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">SLA Compliance Trend</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">Daily compliance % (time)</div>

      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={TREND_DATA}> {/*main container of the <chart></chart>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /> {/*background grid lines with light color and dashed style*/}
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
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <Line    //actual line you see on the graph
            type="monotone"
            dataKey="compliance"
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