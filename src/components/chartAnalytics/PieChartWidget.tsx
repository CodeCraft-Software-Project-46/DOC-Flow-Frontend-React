// Renders a pie or donut chart for status distribution metric

import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import type { CustomChart } from "../../types";

interface PieChartWidgetProps {
  chart: CustomChart;
  data: { label: string; value: number }[];
}

export default function PieChartWidget({ chart, data }: PieChartWidgetProps) {

  // Map slice colors in order: good → warning → critical
  const sliceColors = [
    chart.colors.good,
    chart.colors.warning,
    chart.colors.critical,
  ];

  // Donut has inner radius, pie does not
  const isDonut = chart.type === "donut";

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={isDonut ? 45 : 0}
          outerRadius={70}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={sliceColors[index % sliceColors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e2e8f0"
          }}
          formatter={(value?: number | string) => [value ?? 0, "Value"]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}