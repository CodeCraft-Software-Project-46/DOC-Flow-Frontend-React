import type { ReactNode } from "react";

/* =========================
   UI / COMPONENT TYPES
========================= */

export type StatCardColor = "blue" | "red" | "green";

export interface StatCardProps {
  icon: ReactNode;
  value: string | number | null;
  label: string;
  description?: string;
  color: StatCardColor;
  small?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

/* =========================
   CHART TYPES
========================= */

export type ChartSource = "workflow" | "overall";
export type ChartType = "bar" | "line" | "pie" | "donut";

export type KPIMetric =
  | "sla_compliance"
  | "avg_time"
  | "completion_rate"
  | "breach_count"
  | "status_distribution";

export type ChartStatus = "active" | "draft";

export interface ChartColors {
  good: string;
  warning: string;
  critical: string;
}

export interface ChartThresholds {
  good: number;
  warning: number;
}

export interface CustomChart {
  id: number;
  name: string;
  source: ChartSource;
  workflow: string;
  type: ChartType;
  metric: KPIMetric;
  groupBy: "step_name" | "workflow_name";
  status: ChartStatus;
  timeRange: string | null;
  fromDate?: string;
  toDate?: string;
  colors: ChartColors;
  thresholds: ChartThresholds;
}

/* =========================
   STATUS TYPES
========================= */

export type StepStatus = "Met" | "Breached" | "At Risk" | "Pending";
export type InstanceStatus = "On Track" | "At Risk" | "SLA Breach";
export type RecoveryOutcome = "on_track" | "possible" | "critical";

/* =========================
   ANALYTICS SUPPORT TYPES
========================= */

export interface TrendPoint {
  day: string;
  c: number;
}

export interface WorkingHoursConfig {
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  holidays: string[];
  timeZone?: string;
}