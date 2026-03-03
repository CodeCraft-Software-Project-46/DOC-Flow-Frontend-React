// Configuration page — full create + edit + delete functionality
// Uses shared charts context so changes appear in Analytics dashboard immediately

import { useState } from "react";
import ChartTable from "../../components/chartAnalytics/ChartTable";
import ChartFormModal from "../../components/chartAnalytics/ChartFormModal";
import { useCharts } from "../../context/ChartsContext";
import type { CustomChart } from "../../types";

export const ChartConfigurationPage = () => {
  // Use shared context instead of local state
  const { charts, addChart, updateChart, deleteChart } = useCharts();

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

  // Save — create or update using context methods
  function handleSave(formData: Omit<CustomChart, "id">, id?: number) {
    if (id) {
      updateChart(id, formData); // edit
    } else {
      addChart(formData);        // create
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
            onDelete={deleteChart}
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
