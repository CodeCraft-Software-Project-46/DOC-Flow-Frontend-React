// Renders a bar chart for a custom chart config
// Color of each bar depends on value vs thresholds

import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ResponsiveContainer
} from "recharts";
import type { CustomChart } from "../../types";

interface BarChartWidgetProps {
  chart: CustomChart;
  data: { label: string; value: number }[];
}

export default function BarChartWidget({ chart, data }: BarChartWidgetProps) {

  // Get bar color based on value and thresholds
  function getColor(value: number): string {
    const { good, warning } = chart.thresholds;
    const { higherBetter } = getMetricDirection();

    if (higherBetter) {
      // Higher is better (e.g. compliance %)
      if (value >= good)    return chart.colors.good;
      if (value >= warning) return chart.colors.warning;
      return chart.colors.critical;
    } else {
      // Lower is better (e.g. avg time, breach count)
      if (value <= good)    return chart.colors.good;
      if (value <= warning) return chart.colors.warning;
      return chart.colors.critical;
    }
  }

  // Check if higher value = better for this metric
  function getMetricDirection() {
    const higherBetterMetrics = ["sla_compliance", "completion_rate"];
    return {
      higherBetter: higherBetterMetrics.includes(chart.metric)
    };
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}