/**
 * ------------------------------------------------------------
 * Analytics Dummy Data & Helper Functions
 * ------------------------------------------------------------
 * This file contains mock workflow data used for frontend
 * analytics dashboards, chart rendering, KPI calculations,
 * workflow step-flow analysis, and PDF export previews.
 *
 * It simulates backend API responses until real Django API
 * integration is completed.
 *
 * Responsibilities:
 * - Store workflow instance summaries and details
 * - Provide KPI calculation helper functions
 * - Generate chart-ready data
 * - Provide static dashboard metrics
 */
import type {
  CustomChart, InstanceDetail, InstanceSummary,
  BottleneckStep, UserSLA, TrendPoint
} from "../types";
import type { WorkingHoursConfig } from "../services/workingHoursService";

// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION & METADATA
// ══════════════════════════════════════════════════════════════════════════════

// KPI metric options
export const METRICS = [
  { value: "sla_compliance",      label: "SLA Compliance %",   unit: "%",     higherBetter: true  }, //Higher value means better performance
  { value: "avg_time",            label: "Average Time",        unit: "hours", higherBetter: false },//User sees: Average Time But system stores: avg_time
  { value: "completion_rate",     label: "Completion Rate %",   unit: "%",     higherBetter: true  },
  { value: "breach_count",        label: "Breach Count",        unit: "count", higherBetter: false },
  { value: "status_distribution", label: "Status Distribution", unit: null,    higherBetter: null  },
];
/*[
   { label: "PO Approval", value: 76 },
   { label: "GRN", value: 82 }
]*/

// Workflow names available in dropdowns
export const WORKFLOWS = [
  "Purchase Order Approval",
  "GRN Processing",
  "SRN Workflow",
  "Direct Payment",
];

// ═══════════════════════════════════════════════════════════════════════════ 
// WORKING HOURS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
// Define company working hours: business days, hours/day, holidays
// All SLA calculations will use only these working hours

export const COMPANY_WORKING_HOURS: WorkingHoursConfig = {
  workStartTime: "09:00",
  workEndTime: "17:00",
  workDays: [1, 2, 3, 4, 5], // Monday to Friday (0=Sunday)
  holidays: [
    // 2026 Public Holidays
    "2026-01-01", // New Year's Day
    "2026-01-20", // MLK Jr. Day (US)
    "2026-02-17", // Presidents Day (US)
    "2026-03-17", // St. Patrick's Day
    "2026-05-25", // Memorial Day (US)
    "2026-07-04", // Independence Day (US)
    "2026-09-07", // Labor Day (US)
    "2026-11-26", // Thanksgiving (US)
    "2026-12-25", // Christmas
  ],
  timeZone: "UTC",
};

// Historical average times for each step per workflow
// Used for SLA Recovery Analysis
export const STEP_HISTORICAL_AVERAGES: Record<string, Record<string, number>> = {
  "Purchase Order Approval": {
    "Dept Approval": 3.5,     // Historical average: 3.5 hours
    "Manager Approval": 22,   // Historical average: 22 hours
    "CFO Approval": 36,       // Historical average: 36 hours
    "Payment Release": 8.5,   // Historical average: 8.5 hours
  },
  "GRN Processing": {
    "QC Inspection": 2,
    "Goods Receipt": 4,
    "Invoice Matching": 16,
    "Approval": 8,
  },
  "SRN Workflow": {
    "Return Request": 1,
    "Inspection": 3,
    "Approval": 6,
    "Refund Processing": 2,
  },
  "Direct Payment": {
    "Request Submission": 0.5,
    "Approval": 5,
    "Payment": 3,
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKFLOW INSTANCES & DETAILS (organized by workflow)
// ══════════════════════════════════════════════════════════════════════════════

// ─ All instances grouped by workflow ─
const allInstances = {
  "Purchase Order Approval": {
    summary: [
      { id: "PO-2024-0112", status: "At Risk" as const },
      { id: "PO-2024-0145", status: "On Track" as const },
      { id: "PO-2024-0170", status: "SLA Breach" as const },
      { id: "PO-2024-0201", status: "On Track" as const },
    ],
    details: {
      "PO-2024-0112": {
        overallSLA: 100,
        timeUsed: 48,
        department: "Finance",
        steps: [
          { name: "Dept Approval", assignee: "Alice Cooper", timeTaken: 3, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Manager Approval", assignee: "John Doe", timeTaken: 30, slaTarget: 24, status: "Breached" as const, running: false, pending: false },
          { name: "CFO Approval", assignee: "Robert Chen", timeTaken: 15, slaTarget: 48, status: "At Risk" as const, running: true, pending: false, pct: 31 },
          { name: "Payment Release", assignee: "Finance Team", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: {
          deficit: 6,
          overall: "possible" as const,
          remaining: [
            { step: "CFO Approval", originalSLA: 40, mustComplete: 34, save: 6, avgTime: 36, achievable: "tight" as const },
            { step: "Payment Release", originalSLA: 30, mustComplete: 30, save: 0, avgTime: 8, achievable: "yes" as const },
          ],
        },
      },
      "PO-2024-0145": {
        overallSLA: 100,
        timeUsed: 65,
        department: "Finance",
        steps: [
          { name: "Dept Approval", assignee: "Alice Cooper", timeTaken: 3, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Manager Approval", assignee: "John Doe", timeTaken: 20, slaTarget: 24, status: "Met" as const, running: false, pending: false },
          { name: "CFO Approval", assignee: "Robert Chen", timeTaken: 38, slaTarget: 48, status: "Met" as const, running: false, pending: false },
          { name: "Payment Release", assignee: "Finance Team", timeTaken: 4, slaTarget: 8, status: "Met" as const, running: true, pending: false, pct: 50 },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
      "PO-2024-0170": {
        overallSLA: 100,
        timeUsed: 49,
        department: "Operations",
        steps: [
          { name: "Dept Approval", assignee: "Sara Lee", timeTaken: 4, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Manager Approval", assignee: "John Doe", timeTaken: 45, slaTarget: 24, status: "Breached" as const, running: true, pending: false, pct: 188 },
          { name: "CFO Approval", assignee: "Robert Chen", timeTaken: null, slaTarget: 48, status: "Pending" as const, running: false, pending: true },
          { name: "Payment Release", assignee: "Finance Team", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: {
          deficit: 21,
          overall: "critical" as const,
          remaining: [
            { step: "CFO Approval", originalSLA: 48, mustComplete: 30, save: 18, avgTime: 36, achievable: "tight" as const },
            { step: "Payment Release", originalSLA: 8, mustComplete: 5, save: 3, avgTime: 8, achievable: "tight" as const },
          ],
        },
      },
      "PO-2024-0201": {
        overallSLA: 100,
        timeUsed: 72,
        department: "Finance",
        steps: [
          { name: "Dept Approval", assignee: "Alice Cooper", timeTaken: 3, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Manager Approval", assignee: "John Doe", timeTaken: 20, slaTarget: 24, status: "Met" as const, running: false, pending: false },
          { name: "CFO Approval", assignee: "Robert Chen", timeTaken: 40, slaTarget: 48, status: "Met" as const, running: false, pending: false },
          { name: "Payment Release", assignee: "Finance Team", timeTaken: 9, slaTarget: 8, status: "Breached" as const, running: false, pending: false },
        ],
        recovery: { deficit: 1, overall: "possible" as const, remaining: [] },
      },
    } as Record<string, InstanceDetail>,
  },
  "GRN Processing": {
    summary: [
      { id: "GRN-2024-0033", status: "On Track" as const },
      { id: "GRN-2024-0041", status: "At Risk" as const },
      { id: "GRN-2024-0050", status: "On Track" as const },
    ],
    details: {
      "GRN-2024-0033": {
        overallSLA: 48,
        timeUsed: 20,
        department: "Warehouse",
        steps: [
          { name: "Receipt Upload", assignee: "Mike R", timeTaken: 2, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Warehouse Check", assignee: "Store Team", timeTaken: 10, slaTarget: 16, status: "Met" as const, running: false, pending: false },
          { name: "Finance Approval", assignee: "Alex", timeTaken: 8, slaTarget: 20, status: "Met" as const, running: true, pending: false, pct: 40 },
          { name: "Completion", assignee: "System", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
      "GRN-2024-0041": {
        overallSLA: 48,
        timeUsed: 35,
        department: "Warehouse",
        steps: [
          { name: "Receipt Upload", assignee: "Mike R", timeTaken: 5, slaTarget: 4, status: "Breached" as const, running: false, pending: false },
          { name: "Warehouse Check", assignee: "Store Team", timeTaken: 18, slaTarget: 16, status: "Breached" as const, running: false, pending: false },
          { name: "Finance Approval", assignee: "Alex", timeTaken: 12, slaTarget: 20, status: "At Risk" as const, running: true, pending: false, pct: 60 },
          { name: "Completion", assignee: "System", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: {
          deficit: 13,
          overall: "critical" as const,
          remaining: [
            { step: "Finance Approval", originalSLA: 20, mustComplete: 10, save: 10, avgTime: 15, achievable: "tight" as const },
            { step: "Completion", originalSLA: 8, mustComplete: 0, save: 8, avgTime: 4, achievable: "tight" as const },
          ],
        },
      },
      "GRN-2024-0050": {
        overallSLA: 48,
        timeUsed: 43,
        department: "Warehouse",
        steps: [
          { name: "Receipt Upload", assignee: "Mike R", timeTaken: 2, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Warehouse Check", assignee: "Store Team", timeTaken: 15, slaTarget: 16, status: "Met" as const, running: false, pending: false },
          { name: "Finance Approval", assignee: "Alex", timeTaken: 18, slaTarget: 20, status: "Met" as const, running: false, pending: false },
          { name: "Completion", assignee: "System", timeTaken: 8, slaTarget: 8, status: "Met" as const, running: false, pending: false },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
    } as Record<string, InstanceDetail>,
  },
  "SRN Workflow": {
    summary: [
      { id: "SRN-2024-0012", status: "On Track" as const },
      { id: "SRN-2024-0020", status: "On Track" as const },
      { id: "SRN-2024-0021", status: "At Risk" as const },
    ],
    details: {
      "SRN-2024-0012": {
        overallSLA: 24,
        timeUsed: 8,
        department: "Store",
        steps: [
          { name: "Request Submit", assignee: "Tom K", timeTaken: 1, slaTarget: 2, status: "Met" as const, running: false, pending: false },
          { name: "Manager Review", assignee: "Mary", timeTaken: 7, slaTarget: 12, status: "Met" as const, running: true, pending: false, pct: 58 },
          { name: "Stock Release", assignee: "Store Team", timeTaken: null, slaTarget: 10, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
      "SRN-2024-0020": {
        overallSLA: 24,
        timeUsed: 19,
        department: "Store",
        steps: [
          { name: "Request Submit", assignee: "Tom K", timeTaken: 1, slaTarget: 2, status: "Met" as const, running: false, pending: false },
          { name: "Manager Review", assignee: "Mary", timeTaken: 10, slaTarget: 12, status: "Met" as const, running: false, pending: false },
          { name: "Stock Release", assignee: "Store Team", timeTaken: 8, slaTarget: 10, status: "Met" as const, running: false, pending: false },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
      "SRN-2024-0021": {
        overallSLA: 24,
        timeUsed: 15,
        department: "Store",
        steps: [
          { name: "Request Submit", assignee: "Tom K", timeTaken: 2, slaTarget: 2, status: "Met" as const, running: false, pending: false },
          { name: "Manager Review", assignee: "Mary", timeTaken: 13, slaTarget: 12, status: "Breached" as const, running: true, pending: false, pct: 108 },
          { name: "Stock Release", assignee: "Store Team", timeTaken: null, slaTarget: 10, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: { deficit: 1, overall: "possible" as const, remaining: [] },
      },
    } as Record<string, InstanceDetail>,
  },
  "Direct Payment": {
    summary: [
      { id: "DP-2024-0055", status: "SLA Breach" as const },
      { id: "DP-2024-0060", status: "At Risk" as const },
      { id: "DP-2024-0061", status: "On Track" as const },
    ],
    details: {
      "DP-2024-0055": {
        overallSLA: 72,
        timeUsed: 60,
        department: "Finance",
        steps: [
          { name: "Invoice Upload", assignee: "John", timeTaken: 2, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Finance Review", assignee: "Mary", timeTaken: 38, slaTarget: 24, status: "Breached" as const, running: false, pending: false },
          { name: "CFO Sign-off", assignee: "Robert Chen", timeTaken: 20, slaTarget: 36, status: "At Risk" as const, running: true, pending: false, pct: 55 },
          { name: "Payment", assignee: "Finance Team", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: {
          deficit: 16,
          overall: "critical" as const,
          remaining: [
            { step: "CFO Sign-off", originalSLA: 36, mustComplete: 20, save: 16, avgTime: 30, achievable: "tight" as const },
            { step: "Payment", originalSLA: 8, mustComplete: 0, save: 8, avgTime: 5, achievable: "tight" as const },
          ],
        },
      },
      "DP-2024-0060": {
        overallSLA: 72,
        timeUsed: 45,
        department: "Finance",
        steps: [
          { name: "Invoice Upload", assignee: "John", timeTaken: 3, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Finance Review", assignee: "Mary", timeTaken: 22, slaTarget: 24, status: "Met" as const, running: false, pending: false },
          { name: "CFO Sign-off", assignee: "Robert Chen", timeTaken: 20, slaTarget: 36, status: "Met" as const, running: true, pending: false, pct: 55 },
          { name: "Payment", assignee: "Finance Team", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
      "DP-2024-0061": {
        overallSLA: 72,
        timeUsed: 28,
        department: "Finance",
        steps: [
          { name: "Invoice Upload", assignee: "John", timeTaken: 2, slaTarget: 4, status: "Met" as const, running: false, pending: false },
          { name: "Finance Review", assignee: "Mary", timeTaken: 20, slaTarget: 24, status: "Met" as const, running: false, pending: false },
          { name: "CFO Sign-off", assignee: "Robert Chen", timeTaken: 6, slaTarget: 36, status: "Met" as const, running: true, pending: false, pct: 17 },
          { name: "Payment", assignee: "Finance Team", timeTaken: null, slaTarget: 8, status: "Pending" as const, running: false, pending: true },
        ],
        recovery: { deficit: 0, overall: "on_track" as const, remaining: [] },
      },
    } as Record<string, InstanceDetail>,
  },
};

// Export merged instances and details
export const INSTANCES: Record<string, InstanceSummary[]> = {
  "Purchase Order Approval": allInstances["Purchase Order Approval"].summary,
  "GRN Processing": allInstances["GRN Processing"].summary,
  "SRN Workflow": allInstances["SRN Workflow"].summary,
  "Direct Payment": allInstances["Direct Payment"].summary,
};

export const INSTANCE_DETAILS: Record<string, InstanceDetail> = {
  ...allInstances["Purchase Order Approval"].details,
  ...allInstances["GRN Processing"].details,
  ...allInstances["SRN Workflow"].details,
  ...allInstances["Direct Payment"].details,
};

// ── Overall Dashboard static data ─────────────────────────────────────────────
export const TREND_DATA: TrendPoint[] = [
  { day: "Mon", c: 74 }, { day: "Tue", c: 78 }, { day: "Wed", c: 80 },
  { day: "Thu", c: 82 }, { day: "Fri", c: 84 }, { day: "Sat", c: 83 }, { day: "Sun", c: 85 },
];

export const BOTTLENECK_DATA: BottleneckStep[] = [
  { workflow: "Purchase Order Approval", avg: 59, breach: 19, tasks: 16 },
  { workflow: "Direct Payment", avg: 44, breach: 8, tasks: 12 },
  { workflow: "GRN Processing", avg: 33, breach: 17, tasks: 12 },
  { workflow: "SRN Workflow", avg: 14, breach: 11, tasks: 9 },
];

export const USER_SLA: UserSLA[] = [
  { name: "Alex", compliance: 96, avg: 8, breaches: 1, tasks: 25 },
  { name: "John", compliance: 92, avg: 10, breaches: 2, tasks: 28 },
  { name: "Mary", compliance: 70, avg: 25, breaches: 8, tasks: 20 },
];

// ── Default pre-loaded custom charts ─────────────────────────────────────────
export const DEFAULT_CHARTS: CustomChart[] = [
  {
    id: 1,
    name: "PO Approval Trend",
    source: "workflow",
    workflow: "Purchase Order Approval",
    type: "bar",
    metric: "sla_compliance",
    groupBy: "step_name",
    status: "active",
    timeRange: "30d",
    colors: { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" },
    thresholds: { good: 90, warning: 75 },
  },
  {
    id: 2,
    name: "Department Overview",
    source: "overall",
    workflow: "",
    type: "bar",
    metric: "avg_time",
    groupBy: "workflow_name",
    status: "active",
    timeRange: "30d",
    colors: { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" },
    thresholds: { good: 100, warning: 150 },
  },
  {
    id: 3,
    name: "Breach Distribution",
    source: "workflow",
    workflow: "GRN Processing",
    type: "pie",
    metric: "status_distribution",
    groupBy: "step_name",
    status: "draft",
    timeRange: "30d",
    colors: { good: "#22c55e", warning: "#f59e0b", critical: "#ef4444" },
    thresholds: { good: 90, warning: 75 },
  },
];

// ── Chart data generators (dummy, based on metric type) ───────────────────────

// Data for step-level bar/line charts (workflow source)
export const STEP_CHART_DATA: Record<string, Record<string, number[]>> = {
  "Purchase Order Approval": {
    sla_compliance:  [95, 72, 68, 90],
    avg_time:        [3, 30, 15, 4],
    completion_rate: [100, 85, 60, 90],
    breach_count:    [2, 15, 25, 5],
  },
  "GRN Processing": {
    sla_compliance:  [80, 75, 85, 90],
    avg_time:        [5, 18, 12, 4],
    completion_rate: [90, 80, 85, 95],
    breach_count:    [3, 8, 5, 2],
  },
  "SRN Workflow": {
    sla_compliance:  [95, 88, 92],
    avg_time:        [1, 7, 3],
    completion_rate: [100, 90, 95],
    breach_count:    [0, 2, 1],
  },
  "Direct Payment": {
    sla_compliance:  [92, 60, 70, 88],
    avg_time:        [2, 38, 20, 5],
    completion_rate: [95, 65, 75, 90],
    breach_count:    [1, 18, 10, 3],
  },
};

// Step names per workflow
export const STEP_NAMES: Record<string, string[]> = {
  "Purchase Order Approval": ["Dept", "Manager", "CFO", "Payment"],
  "GRN Processing": ["Receipt", "Warehouse", "Finance", "Complete"],
  "SRN Workflow": ["Submit", "Review", "Release"],
  "Direct Payment": ["Invoice", "Finance", "CFO", "Payment"],
};

// Data for workflow-level bar/line charts (overall source)
export const WORKFLOW_CHART_DATA = {
  labels: ["PO Approval", "GRN Process", "SRN Workflow", "Direct Pay"],
  sla_compliance:  [76, 82, 91, 68],
  avg_time:        [42, 28, 14, 55],
  completion_rate: [80, 85, 95, 70],
  breach_count:    [18, 10, 3, 22],
};

function getRangeFactor(timeRange: string | null, fromDate?: string, toDate?: string): number {
  if (timeRange === "7d") return 0.25;
  if (timeRange === "30d") return 0.6;
  if (timeRange === "90d") return 0.9;
  if (timeRange === "all") return 1;
  if (timeRange === "custom" && fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return 0.5;
    const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    return Math.min(1, days / 365);
  }
  return 0.6;
}

function getCompletedMetBreachedCounts(workflow?: string): { completed: number; breached: number } {
  const selected = workflow
    ? (INSTANCES[workflow] ?? []).map((instance) => instance.id)
    : Object.values(INSTANCES).flat().map((instance) => instance.id);

  const details = selected
    .map((id) => INSTANCE_DETAILS[id])
    .filter((detail): detail is InstanceDetail => Boolean(detail));

  const completedDetails = details.filter((detail) =>
    detail.steps.every((step) => !step.pending && !step.running && step.timeTaken !== null)
  );

  const breached = completedDetails.filter((detail) =>
    detail.steps.some((step) => step.status === "Breached")
  ).length;

  return {
    completed: completedDetails.length,
    breached,
  };
}

// ── Chart data helper ───────────────────────────────────────────────────────────
// Returns chart data array based on chart config
// In real app — this comes from Django API
export function getChartData(
  chart: CustomChart
): { label: string; value: number }[] {

  // Status distribution — selected time range, completed tasks only (Met vs Breached)
  if (chart.metric === "status_distribution") {
    const scopeWorkflow = chart.source === "workflow" ? chart.workflow : undefined;
    const base = getCompletedMetBreachedCounts(scopeWorkflow);
    const factor = getRangeFactor(chart.timeRange, chart.fromDate, chart.toDate);

    const completedInRange = Math.max(1, Math.round(base.completed * factor));
    const breachRate = base.completed > 0 ? base.breached / base.completed : 0.1;
    const breachedInRange = Math.min(completedInRange, Math.round(completedInRange * breachRate));
    const metInRange = Math.max(0, completedInRange - breachedInRange);

    return [
      { label: "Met", value: metInRange },
      { label: "Breached", value: breachedInRange },
    ];
  }

  // Workflow source — group by step name
  if (chart.source === "workflow" && chart.workflow) {
    const stepData = STEP_CHART_DATA[chart.workflow];
    const stepNames = STEP_NAMES[chart.workflow] || [];
    if (!stepData) return [];
    const values = stepData[chart.metric] || [];
    return stepNames.map((name, i) => ({
      label: name,
      value: values[i] ?? 0,
    }));
  }

  // Overall source — group by workflow name
  const wfData = WORKFLOW_CHART_DATA;
  const values = wfData[chart.metric as keyof typeof wfData] as number[];
  if (!values) return [];
  return wfData.labels.map((label, i) => ({
    label,
    value: values[i] ?? 0,
  }));
}

// ── Workflow KPI helper ───────────────────────────────────────────────────────
// Returns workflow stat-card values from dummy instance + step data
export function getWorkflowKPI(workflow: string): {
  totalInstances: number;
  avgCompletionTime: string;
  slaCompliance: number;
} {
  const workflowInstances = INSTANCES[workflow] ?? [];
  const details = workflowInstances
    .map((instance) => INSTANCE_DETAILS[instance.id])
    .filter((detail): detail is InstanceDetail => Boolean(detail));

  const allSteps = details.flatMap((detail) => detail.steps);
  const metSteps = allSteps.filter((step) => step.status === "Met").length;
  const slaCompliance = allSteps.length
    ? Math.round((metSteps / allSteps.length) * 100)
    : 0;

  const completedInstances = details.filter((detail) =>
    detail.steps.every((step) => step.timeTaken !== null && !step.pending)
  );

  const avgCompletionHours = completedInstances.length
    ? Math.round(
        completedInstances.reduce((sum, detail) => sum + detail.timeUsed, 0) /
          completedInstances.length
      )
    : 0;

  return {
    totalInstances: workflowInstances.length,
    avgCompletionTime: `${avgCompletionHours}h`,
    slaCompliance,
  };
}

// ── Overall live KPI helper ───────────────────────────────────────────────────
// runningDocuments: currently active instances (has a running step)
// activeOverdueTasks: currently running tasks that have already breached SLA
export function getOverallLiveKPI(): {
  runningDocuments: number;
  activeOverdueTasks: number;
} {
  const allInstanceIds = Object.values(INSTANCES)
    .flat()
    .map((instance) => instance.id);

  const allDetails = allInstanceIds
    .map((id) => INSTANCE_DETAILS[id])
    .filter((detail): detail is InstanceDetail => Boolean(detail));

  const runningDocuments = allDetails.filter((detail) =>
    detail.steps.some((step) => step.running)
  ).length;

  const activeOverdueTasks = allDetails
    .flatMap((detail) => detail.steps)
    .filter((step) => step.running && step.status === "Breached").length;

  return {
    runningDocuments,
    activeOverdueTasks,
  };
}

// ── Workflow step flow helper ──────────────────────────────────────────────────
// Returns step-by-step document flow metrics
export interface StepFlowMetrics {
  stepName: string;
  received: number;      // instances that reached this step
  passed: number;        // instances that completed this step
  processing: number;    // instances currently at this step
  slaMet: number;        // instances that met SLA at this step
  slaBreached: number;   // instances that breached SLA at this step
  slaMetRate: number;    // percentage (0-100)
}

export function getWorkflowStepFlow(workflow: string): {
  totalInstances: number;
  completedInstances: number;
  steps: StepFlowMetrics[];
} {
  const workflowInstances = INSTANCES[workflow] ?? [];
  const details = workflowInstances
    .map((instance) => INSTANCE_DETAILS[instance.id])
    .filter((detail): detail is InstanceDetail => Boolean(detail));

  const totalInstances = details.length;

  // Get unique step names in order (from first instance)
  const stepNames = details[0]?.steps.map((s) => s.name) ?? [];

  const stepMetrics: StepFlowMetrics[] = stepNames.map((stepName, stepIndex) => {
    // Collect all step data for this step name across all instances
    const stepsAtThisStage = details
      .map((detail) => detail.steps[stepIndex])
      .filter((step) => step && step.name === stepName);

    const received = stepsAtThisStage.filter(
      (step) => !step.pending
    ).length;

    const passed = stepsAtThisStage.filter(
      (step) => step.timeTaken !== null && !step.running && !step.pending
    ).length;

    const processing = stepsAtThisStage.filter((step) => step.running).length;

    const slaMet = stepsAtThisStage.filter((step) => step.status === "Met").length;

    const slaBreached = stepsAtThisStage.filter(
      (step) => step.status === "Breached"
    ).length;

    const slaMetRate = received > 0 ? Math.round((slaMet / received) * 100) : 0;

    return {
      stepName,
      received,
      passed,
      processing,
      slaMet,
      slaBreached,
      slaMetRate,
    };
  });

  const completedInstances = details.filter((detail) =>
    detail.steps.every((step) => step.timeTaken !== null && !step.pending && !step.running)
  ).length;

  return {
    totalInstances,
    completedInstances,
    steps: stepMetrics,
  };
}

// ── Dashboard KPI data ──────────────────────────────────────────────────────────
// Live metrics for dashboard stat cards
export const DASHBOARD_KPI = {
  overall: {
    runningDocuments: 48,
    activeOverdueTasks: 7,
    completedTasks: 32,
    slaCompliance: 80,
    completedTasksChange: 8,      // % vs previous period
    slaComplianceChange: -1,       // % vs previous period
  },
  workflow: {
    // Per-workflow metrics (example for first workflow)
    totalInstances: 120,
    avgCompletionTime: "42h",
    slaCompliance: 76,
  },
};