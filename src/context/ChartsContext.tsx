// Shared charts state across Config page and Dashboard Analytics page
// When admin creates/edits/deletes a chart in Config — dashboard updates too

import { createContext, useContext, useState } from "react";
import type { CustomChart } from "../types";
import { DEFAULT_CHARTS } from "../data/dummyData";

interface ChartsContextType {
  charts: CustomChart[];
  addChart:    (chart: Omit<CustomChart, "id">) => void;
  updateChart: (id: number, chart: Omit<CustomChart, "id">) => void;
  deleteChart: (id: number) => void;
}

// Create context
const ChartsContext = createContext<ChartsContextType | null>(null);

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

// Custom hook — use this in any page/component
export function useCharts() {
  const ctx = useContext(ChartsContext);
  if (!ctx) throw new Error("useCharts must be used inside ChartsProvider");
  return ctx;
}
