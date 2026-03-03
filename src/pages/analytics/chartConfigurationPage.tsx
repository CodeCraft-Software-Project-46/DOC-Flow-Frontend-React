// Configuration page — full create + edit + delete functionality

import { useState } from "react";
import ChartTable from "../../components/chartAnalytics/ChartTable";
import ChartFormModal from "../../components/chartAnalytics/ChartFormModal";
import { DEFAULT_CHARTS } from "../../data/dummyData";
import type { CustomChart } from "../../types";

export const ChartConfigurationPage = () => {
  // All charts in state
  const [charts, setCharts] = useState<CustomChart[]>(DEFAULT_CHARTS);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editChart, setEditChart]     = useState<CustomChart | null>(null);

  // Open modal in CREATE mode
  function handleCreate() {
    setEditChart(null);
    setIsModalOpen(true);
  }

  // Open modal in EDIT mode
  function handleEdit(chart: CustomChart) {
    setEditChart(chart);
    setIsModalOpen(true);
  }

  // Delete chart by id
  function handleDelete(id: number) {
    setCharts((prev) => prev.filter((c) => c.id !== id));
  }

  // Save — handles both create and edit
  function handleSave(formData: Omit<CustomChart, "id">, id?: number) {
    if (id) {
      // Edit mode — update existing chart
      setCharts((prev) =>
        prev.map((c) => (c.id === id ? { ...formData, id } : c))
      );
    } else {
      // Create mode — add new chart with unique id
      const newChart: CustomChart = {
        ...formData,
        id: Date.now(), // temporary id — backend will assign real id later
      };
      setCharts((prev) => [...prev, newChart]);
    }
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

        {/* Table card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Top bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <span className="font-semibold text-slate-900">Configured Charts</span>
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Create Chart
            </button>
          </div>

          {/* Chart list table */}
          <ChartTable
            charts={charts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Create / Edit modal */}
        <ChartFormModal
          isOpen={isModalOpen}
          editChart={editChart}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />

      </div>
    </div>
  );
};
