// ============================================================================
// DOC-FLOW ANALYTICS TYPE DEFINITIONS
// ============================================================================
// All types are properly mapped to backend analytics_* tables
// - analytics_workflow, analytics_workflow_instance, analytics_task_instance
// - Updates in DB are reflected live via API calls (no caching)
// - Frontend widgets query API endpoints that fetch current DB values
// ============================================================================

// this object MUST have these fields
//data structure definitions
//interfaces are used to type checking

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
  timeRange: string | null; // "7d" | "30d" | "90d" | "all" | "custom"
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
  workflow: string;
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

export interface WorkingHoursConfig {
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  holidays: string[];
  timeZone?: string;
}

export interface RunningDocument {
  instance_id: number | string;
  instance_name: string;
  workflow_id: number | string;
  workflow_name: string;
  document_id: number | string;
  document_name: string;
  status: string;
  created_at: string;
  running_hours: number;
}

export interface RunningDocumentsResponse {
  count?: number;
  documents?: RunningDocument[];
}

export type RunningDocumentsApiResponse =
  | RunningDocumentsResponse
  | { value: RunningDocumentsResponse };

export interface ActiveOverdueTask {
  task_id: number | string;
  task_name: string;
  due_at: string;
  status: string;
  role?: string;
  department?: string;
  workflow_name?: string;
  instance_name?: string;
  overdue_hours?: number;
  overdue_days?: number;
}

export interface ActiveOverdueTasksResponse {
  count?: number;
  tasks?: ActiveOverdueTask[];
}

export interface UserPerformanceItem {
  user_name?: string;
  sla_compliance?: number;
  avg_completion_time_hours?: number;
  breached_tasks?: number;
  total_tasks?: number;
}

export type UserPerformanceResponse =
  | UserPerformanceItem[]
  | { data?: UserPerformanceItem[] };

export interface SLADistributionPoint {
  name: "met" | "breached";
  value: number;
}

export type SLADistributionResponse =
  | SLADistributionPoint[]
  | { data?: SLADistributionPoint[] };

export interface BottleneckWorkflow {
  workflow_name?: string;
  avg_completion_time_hours?: number;
  breach_percentage?: number;
  total_tasks?: number;
  bottleneck_score?: number;
}

export type BottleneckWorkflowsResponse =
  | BottleneckWorkflow[]
  | { data?: BottleneckWorkflow[] };

// Component prop interfaces
export type StatCardColor = "blue" | "red" | "green";

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number | null;
  label: string;
  description?: string;
  color: StatCardColor;
  small?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface RunningDocumentsDetailsProps {
  items: RunningDocument[];
  onClose: () => void;
}

export interface ActiveTasksDetailsProps {
  items: ActiveOverdueTask[];
  onClose: () => void;
}

export interface CompletedTasksResponse {
  count?: number;
}

export interface SLAComplianceResponse {
  percentage?: number;
  data?: {
    percentage?: number;
  };
  value?: number;
}

// Workflow-specific responses
export interface TotalInstancesResponse {
  total?: number;
  count?: number;
  value?: number;
}

export interface AvgCompletionTimeResponse {
  avg_hours?: number;
  hours?: number;
  value?: number;
  average?: number;
}

export interface WorkflowStepFlowResponse {
  totalInstances?: number;
  steps?: Array<{
    stepName?: string;
    step_name?: string;
    received?: number;
    completed?: number;
    completedOnTime?: number;
    breached?: number;
  }>;
}

export interface WorkflowInstanceItem {
  id?: string | number;
  name?: string;
  instance_name?: string;
  status?: string;
  created_at?: string;
}

export interface WorkflowInstancesResponse {
  instances?: WorkflowInstanceItem[];
  count?: number;
}

export interface WorkflowListItem {
  workflow_id: number;
  name: string;
}

export type WorkflowListResponse = WorkflowListItem[];

export interface WorkflowTotalInstancesValueResponse {
  value: number;
}

export interface WorkflowAvgCompletionTimeApiResponse {
  avg_completion_time_hours: number;
}

export interface WorkflowSLAComplianceApiResponse {
  total_tasks: number;
  met_tasks: number;
  percentage: number;
}

export interface WorkflowInstance {
  instance_id: number;
  instance_name: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  document_id: number | null;
}

export type WorkflowInstancesApiResponse = WorkflowInstance[];

export interface InstanceDrilldownTask {
  task_name: string;
  assigned_user: string | null;
  assigned_role: string | null;
  status: string;
  sla_status: string;
  sla_hours: number | null;
  time_taken_hours: number | null;
}

export type InstanceDrilldownResponse = InstanceDrilldownTask[];

// Workflow step details from step-flow endpoint
export interface WorkflowStepDetail {
  task_name?: string;

  received?: number;

  processing?: number;

  passed?: number;

  sla_met?: number;

  breached?: number;

  breach_percentage?: number;

  processing_documents?: string[];
}
// Enhanced step flow response with all fields
export interface WorkflowStepFlowDetailResponse {
  total_instances?: number;
  totalInstances?: number;
  completed_instances?: number;
  completedInstances?: number;
  completion_rate?: number;
  completionRate?: number;
  steps?: WorkflowStepDetail[];
}