import { createContext } from "react";
import type { CustomChart } from "../types";

export interface ChartsContextType {
  charts: CustomChart[];
  addChart: (chart: Omit<CustomChart, "id">) => void;
  updateChart: (id: number, chart: Omit<CustomChart, "id">) => void;
  deleteChart: (id: number) => void;
}

export const ChartsContext = createContext<ChartsContextType | null>(null);
