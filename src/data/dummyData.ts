import type {
  CustomChart, InstanceDetail, InstanceSummary,
  BottleneckStep, UserSLA, TrendPoint
} from "../types";

// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION & METADATA
// ══════════════════════════════════════════════════════════════════════════════

// KPI metric options — used in config form and chart table
export const METRICS = [
  { value: "sla_compliance",      label: "SLA Compliance %",   unit: "%",     higherBetter: true  },
  { value: "avg_time",            label: "Average Time",        unit: "hours", higherBetter: false },
  { value: "completion_rate",     label: "Completion Rate %",   unit: "%",     higherBetter: true  },
  { value: "breach_count",        label: "Breach Count",        unit: "count", higherBetter: false },
  { value: "status_distribution", label: "Status Distribution", unit: null,    higherBetter: null  },
];

// Workflow names available in dropdowns
export const WORKFLOWS = [
  "Purchase Order Approval",
  "GRN Processing",
  "SRN Workflow",
  "Direct Payment",
];

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
  { step: "Purchase Order Approval", avg: 59, breach: 19, tasks: 16 },
  { step: "Direct Payment", avg: 44, breach: 8, tasks: 12 },
  { step: "GRN Processing", avg: 33, breach: 17, tasks: 12 },
  { step: "SRN Workflow", avg: 14, breach: 11, tasks: 9 },
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
    timeRange: null,
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

// Status distribution data (pie/donut) — always live snapshot
export const STATUS_DISTRIBUTION = {
  overall: [
    { name: "On Time", value: 77, color: "#22c55e" },
    { name: "At Risk", value: 13, color: "#f59e0b" },
    { name: "Breached", value: 10, color: "#ef4444" },
  ],
  "Purchase Order Approval": [
    { name: "On Time", value: 65, color: "#22c55e" },
    { name: "At Risk", value: 20, color: "#f59e0b" },
    { name: "Breached", value: 15, color: "#ef4444" },
  ],
  "GRN Processing": [
    { name: "On Time", value: 80, color: "#22c55e" },
    { name: "At Risk", value: 12, color: "#f59e0b" },
    { name: "Breached", value: 8, color: "#ef4444" },
  ],
  "SRN Workflow": [
    { name: "On Time", value: 90, color: "#22c55e" },
    { name: "At Risk", value: 7, color: "#f59e0b" },
    { name: "Breached", value: 3, color: "#ef4444" },
  ],
  "Direct Payment": [
    { name: "On Time", value: 60, color: "#22c55e" },
    { name: "At Risk", value: 20, color: "#f59e0b" },
    { name: "Breached", value: 20, color: "#ef4444" },
  ],
};

// ── Chart data helper ───────────────────────────────────────────────────────────
// Returns chart data array based on chart config
// In real app — this comes from Django API
export function getChartData(
  chart: CustomChart
): { label: string; value: number }[] {

  // Status distribution — fixed 3 slices
  if (chart.metric === "status_distribution") {
    const key = chart.source === "overall" ? "overall" : chart.workflow;
    const dist = STATUS_DISTRIBUTION[key as keyof typeof STATUS_DISTRIBUTION]
      || STATUS_DISTRIBUTION["overall"];
    return dist.map((d) => ({ label: d.name, value: d.value }));
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
// Returns step-by-step document flow metrics for bottleneck analysis
export interface StepFlowMetrics {
  stepName: string;
  received: number;      // instances that reached this step
  passed: number;        // instances that completed this step
  processing: number;    // instances currently at this step
  slaMet: number;        // instances that met SLA at this step
  slaBreached: number;   // instances that breached SLA at this step
  slaMetRate: number;    // percentage (0-100)
  slaBreachRate: number; // percentage (0-100)
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
    const slaBreachRate = received > 0 ? Math.round((slaBreached / received) * 100) : 0;

    return {
      stepName,
      received,
      passed,
      processing,
      slaMet,
      slaBreached,
      slaMetRate,
      slaBreachRate,
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