// Displays all active custom charts for a given source/workflow
// Used in both Overall Dashboard and Workflow Analytics tabs

import type { CustomChart } from "../../types";
import { getChartData } from "../../data/dummyData";
import BarChartWidget from "./BarChartWidget";
import LineChartWidget from "./LineChartWidget";
import PieChartWidget from "./PieChartWidget";

interface CustomChartsSectionProps {
  charts: CustomChart[];          // all charts from config
  source: "overall" | "workflow"; // which tab we are on
  workflow?: string;              // selected workflow (workflow tab only)
  onCreateClick: () => void;      // opens create chart modal
  onExportClick?: () => void;     // exports this custom charts section as PDF
}

export default function CustomChartsSection({
  charts,
  source,
  workflow,
  onCreateClick,
  onExportClick,
}: CustomChartsSectionProps) {

  // Filter charts:
  // — active status only
  // — matching source (overall or workflow)
  // — custom charts are independent of selected workflow
  const visibleCharts = charts.filter((c) => {
    if (c.status !== "active") return false;
    if (c.source !== source)   return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Section header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-bold text-slate-900 text-base">Custom Charts</div>
          <div className="text-xs text-slate-400 mt-1">
            {source === "overall"
              ? "Admin-configured charts for all workflows"
              : `Admin-configured charts for ${workflow}`}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 export-hide">
          {onExportClick && (
            <button
              onClick={onExportClick}
              className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Export PDF
            </button>
          )}
          <button
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Create Chart
          </button>
        </div>
      </div>

      {/* No active charts message */}
      {visibleCharts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-sm font-medium text-slate-400">No active charts yet</div>
          <div className="text-xs text-slate-300 mt-1">
            Click "+ Create Chart" to add one
          </div>
        </div>
      ) : (
        // Charts grid — 2 columns
        <div className="grid grid-cols-2 gap-5">
          {visibleCharts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} />
          ))}
        </div>
      )}

    </div>
  );
}

// ── Individual chart card ─────────────────────────────────────────────────────
function ChartCard({ chart }: { chart: CustomChart }) {

  // Get data for this chart from dummy data helper
  const data = getChartData(chart);

  // Time range label for display
  function getTimeLabel(): string {
    if (!chart.timeRange) return "All Time";
    if (chart.timeRange === "custom" && chart.fromDate && chart.toDate) {
      return `${chart.fromDate} to ${chart.toDate}`;
    }
    const map: Record<string, string> = {
      "7d":  "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
      "all": "All Time",
    };
    return map[chart.timeRange] || chart.timeRange;
  }

  return (
    <div className="border border-slate-100 rounded-xl p-5">

      {/* Card header */}
      <div className="flex justify-between items-start mb-4">
        <div className="font-semibold text-slate-800 text-sm">{chart.name}</div>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
          {getTimeLabel()}
        </span>
      </div>

      {/* Render correct chart type */}
      {(chart.type === "bar") && (
        <BarChartWidget chart={chart} data={data} />
      )}
      {(chart.type === "line") && (
        <LineChartWidget chart={chart} data={data} />
      )}
      {(chart.type === "pie" || chart.type === "donut") && (
        <PieChartWidget chart={chart} data={data} />
      )}

    </div>
  );
}