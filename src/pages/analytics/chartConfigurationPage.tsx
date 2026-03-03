// Configuration page — manage custom charts

import { useState } from "react";
import ChartTable from "../../components/chartAnalytics/ChartTable";
import { DEFAULT_CHARTS } from "../../data/dummyData";
import type { CustomChart } from "../../types";

export const ChartConfigurationPage = () => {
  // All charts stored in state
  const [charts, setCharts] = useState<CustomChart[]>(DEFAULT_CHARTS);

  // Delete a chart by id
  function handleDelete(id: number) {
    setCharts((prev) => prev.filter((c) => c.id !== id));
  }

  // Edit placeholder — modal added in Step 6
  function handleEdit(chart: CustomChart) {
    console.log("Edit chart:", chart); // wired up in Step 6
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans -mt-2">
      <div className="max-w-7xl mx-auto px-6 py-2">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Chart Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage custom charts for Overall Dashboard and Workflow Analytics
          </p>
        </div>

        {/* Create button + table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Top bar with create button */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <span className="font-semibold text-slate-900">Configured Charts</span>
            <button
              onClick={() => console.log("Open modal — wired in Step 6")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Create Chart
            </button>
          </div>

          {/* Chart table */}
          <ChartTable
            charts={charts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </div>
    </div>
  );
};
