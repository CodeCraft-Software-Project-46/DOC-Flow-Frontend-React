// All TypeScript types used across the app

export type ChartSource = "workflow" | "overall";
export type ChartType = "bar" | "line" | "pie" | "donut";
export type KPIMetric = "sla_compliance" | "avg_time" | "completion_rate" | "breach_count" | "status_distribution";
export type ChartStatus = "active" | "draft";
export type StepStatus = "Met" | "Breached" | "At Risk" | "Pending";
export type InstanceStatus = "On Track" | "At Risk" | "SLA Breach";
export type RecoveryOutcome = "on_track" | "possible" | "critical";

export interface ChartColors {
  good: string;
  warning: string;
  critical: string;
}

export interface ChartThresholds {
  good: number;
  warning: number;
}

// A custom chart created by admin in Config page
export interface CustomChart {
  id: number;
  name: string;
  source: ChartSource;
  workflow: string;       // empty string if source = "overall"
  type: ChartType;
  metric: KPIMetric;
  groupBy: "step_name" | "workflow_name";
  status: ChartStatus;
  timeRange: string | null; // null for status_distribution, or "7d" | "30d" | "90d" | "all" | "custom"
  fromDate?: string;        // ISO date for custom range
  toDate?: string;          // ISO date for custom range
  colors: ChartColors;
  thresholds: ChartThresholds;
}

// One step inside a workflow instance
export interface WorkflowStep {
  name: string;
  assignee: string;
  timeTaken: number | null;  // null if pending
  slaTarget: number;
  status: StepStatus;
  running: boolean;
  pending: boolean;
  pct?: number;  // % of SLA used (if running)
}

// Recovery analysis for one remaining step
export interface RecoveryStep {
  step: string;
  originalSLA: number;
  mustComplete: number;
  save: number;
  avgTime: number;
  achievable: "yes" | "tight";
}

// Full details for a workflow instance
export interface InstanceDetail {
  overallSLA: number;
  timeUsed: number;
  department: string;
  steps: WorkflowStep[]; //workflowStep is defined above
  recovery: {
    deficit: number;
    overall: RecoveryOutcome;
    remaining: RecoveryStep[]; //recoveryStep is defined above
  };
}

// Summary item in instance list
export interface InstanceSummary { //for listing instances
  id: string;
  status: InstanceStatus;
}

// Bottleneck step data
export interface BottleneckStep { //for dashboard bottleneck chart
  step: string;
  avg: number;
  breach: number;
  tasks: number;
}

// User SLA data
export interface UserSLA {
  name: string;
  compliance: number;
  avg: number;
  breaches: number;
  tasks: number;
}

// Trend data point
export interface TrendPoint {  //for trend charts
  day: string;
  c: number;
}