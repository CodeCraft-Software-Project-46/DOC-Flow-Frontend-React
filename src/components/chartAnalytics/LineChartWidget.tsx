// Renders a line chart for a custom chart config

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import type { CustomChart } from "../../types";

interface LineChartWidgetProps {
  chart: CustomChart;
  data: { label: string; value: number }[];
}

export default function LineChartWidget({ chart, data }: LineChartWidgetProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e2e8f0"
          }}
        />
        {/* Use "good" color as line color */}
        <Line
          type="monotone"
          dataKey="value"
          stroke={chart.colors.good}
          strokeWidth={2}
          dot={{ r: 3, fill: chart.colors.good }}
          name={chart.name}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}