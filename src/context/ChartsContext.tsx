// Shared charts state across Config page and Dashboard Analytics page
// When admin creates/edits/deletes a chart in Config — dashboard updates too

import { useState } from "react";
import type { CustomChart } from "../types";
import { DEFAULT_CHARTS } from "../data/dummyData";
import { ChartsContext } from "./chartsContextStore";

// Provider — wrap around app so all pages share same charts
export function ChartsProvider({ children }: { children: React.ReactNode }) {
  const [charts, setCharts] = useState<CustomChart[]>(DEFAULT_CHARTS);

  // Add new chart
  function addChart(formData: Omit<CustomChart, "id">) {
    const newChart: CustomChart = {
      ...formData,
      id: Date.now(), // temp id — backend assigns real id later
    };
    setCharts((prev) => [...prev, newChart]);
  }

  // Update existing chart
  function updateChart(id: number, formData: Omit<CustomChart, "id">) {
    setCharts((prev) =>
      prev.map((c) => (c.id === id ? { ...formData, id } : c))
    );
  }

  // Delete chart
  function deleteChart(id: number) {
    setCharts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <ChartsContext.Provider value={{ charts, addChart, updateChart, deleteChart }}>
      {children}
    </ChartsContext.Provider>
  );
}
