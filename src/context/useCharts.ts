import { useContext } from "react";
import { ChartsContext } from "./chartsContextStore";

export function useCharts() {
  const ctx = useContext(ChartsContext);
  if (!ctx) throw new Error("useCharts must be used inside ChartsProvider");
  return ctx;
}
