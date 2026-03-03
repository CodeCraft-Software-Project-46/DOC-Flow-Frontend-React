// Table showing all configured custom charts with edit and delete actions

import type { CustomChart } from "../../types";
import { METRICS } from "../../data/dummyData";

interface ChartTableProps {
  charts: CustomChart[];
  onEdit: (chart: CustomChart) => void;
  onDelete: (id: number) => void;
}

export default function ChartTable({ charts, onEdit, onDelete }: ChartTableProps) {

  // Get readable label for time range value
  function getTimeRangeLabel(chart: CustomChart): string {
    const { timeRange, fromDate, toDate } = chart;
    if (!timeRange) return "Live snapshot";
    const map: Record<string, string> = {
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      "all": "All Time",
      "custom": fromDate && toDate ? `${fromDate} to ${toDate}` : "Custom (incomplete)",
    };
    return map[timeRange] || timeRange;
  }

  // Get readable metric label from metric value
  function getMetricLabel(metricValue: string): string {
    const found = METRICS.find((m) => m.value === metricValue);
    return found ? found.label : metricValue;
  }

  return (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          {/* Column headers */}
          <thead>
            <tr className="bg-slate-50">
              {[
                "Chart Name", "Source", "Chart Type",
                "KPI Metric", "Time Range", "Group By", "Status", "Actions"
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table rows */}
          <tbody>
            {charts.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-slate-400 text-sm">
                  No charts yet. Click "+ Create Chart" to add one.
                </td>
              </tr>
            ) : (
              charts.map((chart, index) => (
                <tr
                  key={chart.id}
                  className={`border-t border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                >
                  {/* Chart Name */}
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {chart.name}
                  </td>

                  {/* Source badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      chart.source === "workflow"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {chart.source === "workflow" ? "Workflow" : "Overall"}
                    </span>
                  </td>

                  {/* Chart type */}
                  <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                    {chart.type}
                  </td>

                  {/* KPI Metric */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getMetricLabel(chart.metric)}
                  </td>

                  {/* Time Range */}
                  <td className={`px-4 py-3 text-sm ${
                    chart.timeRange ? "text-slate-600" : "text-slate-400 italic"
                  }`}>
                    {getTimeRangeLabel(chart)}
                  </td>

                  {/* Group By */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {chart.groupBy === "step_name" ? "Step Name" : "Workflow Name"}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      chart.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {chart.status}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(chart)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(chart.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );
}