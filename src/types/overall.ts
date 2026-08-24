/* =========================
   RUNNING DOCUMENTS - Used in RunningDocumentsWidget.tsx
========================= */

// Individual running document/workflow instance
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

// API response containing running documents list
export interface RunningDocumentsResponse {
  count: number;
  documents: RunningDocument[];
}

// API response type used in RunningDocumentsWidget.tsx
export type RunningDocumentsApiResponse = RunningDocumentsResponse;

/* =========================
   OVERDUE TASKS - Used in ActiveOverdueTasksWidget.tsx
========================= */

// Individual task that is overdue or at risk
export interface ActiveOverdueTask {
  task_id: number | string;
  task_name: string;
  document_name?: string;
  due_at: string;
  status: string;
  username?: string;
  user_name?: string;
  role?: string;
  department?: string;
  workflow_name?: string;
  instance_name?: string;
  overdue_hours?: number;
  overdue_days?: number;
}

// API response containing overdue tasks - Used in ActiveOverdueTasksWidget.tsx via analyticsApi.ts
export interface ActiveOverdueTasksResponse {
  count: number;
  tasks: ActiveOverdueTask[];
}

/* =========================
   USER PERFORMANCE - Used in UserPerformanceWidget.tsx
========================= */

// Performance metrics for a single user
export interface UserPerformanceItem {
  user_name?: string;
  sla_compliance?: number;
  avg_completion_time_hours?: number;
  breached_tasks?: number;
  total_tasks?: number;
}

// Normalized user row used by UserPerformanceWidget.tsx
export type User = {
  name: string;
  compliance: number;
  avg: number;
  breaches: number;
  tasks: number;
};

// API response for user performance (flexible format) - Used in UserPerformanceWidget.tsx via analyticsApi.ts
export type UserPerformanceResponse =
  | UserPerformanceItem[]
  | { data?: UserPerformanceItem[] };

/* =========================
   SLA DISTRIBUTION - Used in SlaDistributionWidget.tsx
========================= */

// Single data point in SLA distribution (met/breached count)
export interface SLADistributionPoint {
  name: "met" | "breached";
  value: number;
}

// API response for SLA distribution data - Used in SlaDistributionWidget.tsx via analyticsApi.ts
export type SLADistributionResponse = SLADistributionPoint[];

/* =========================
   BOTTLENECK ANALYSIS - Used in BottleneckWorkflowsWidget.tsx
========================= */

// Workflow metrics for bottleneck identification
export interface BottleneckWorkflow {
  workflow_name?: string;
  avg_completion_time_hours?: number;
  breach_percentage?: number;
  total_tasks?: number;
  bottleneck_score?: number;
}

// API response for bottleneck workflows - Used in BottleneckWorkflowsWidget.tsx via analyticsApi.ts
export type BottleneckWorkflowsResponse =
  | BottleneckWorkflow[]
  | { data?: BottleneckWorkflow[] };

// Frontend-normalized bottleneck item for UI display - Used in BottleneckWorkflowsWidget.tsx
export type BottleneckItem = {
  workflow: string;  // workflow name for display
  avg: number;       // average completion time (hours)
  breach: number;    // SLA breach percentage (0-100)
  tasks: number;     // total tasks in workflow
  score: number;     // computed bottleneck score (0–1)
};


/* =========================
   UI COMPONENT PROPS
========================= */

// Props for RunningDocumentsDetails component - Used in RunningDocumentsDetails.tsx
export interface RunningDocumentsDetailsProps {
  items: RunningDocument[];
  onClose: () => void;
}

// Props for ActiveTasksDetails component - Used in ActiveTasksDetails.tsx
export interface ActiveTasksDetailsProps {
  items: ActiveOverdueTask[];
  onClose: () => void;
}

/* =========================
   SIMPLE API RESPONSES
========================= */

// Completed tasks count response - Used in CompletedTasksWidget.tsx via analyticsApi.ts
export interface CompletedTasksResponse {
  count?: number;
}

// SLA compliance percentage response - Used in SLAComplianceWidget.tsx via analyticsApi.ts
export interface SLAComplianceResponse {
  percentage: number;
}

/* =========================
   TASK INSTANCES TABLE - Used in TaskInstancesTableWidget.tsx
========================= */

// Raw analytics_task_instance row, filtered by the shared time-range bar
// (created_at-based, unlike the completed_at-based filter most other
// Overall widgets use — this table needs to show not-yet-completed tasks
// too, so status/sla_status show real variety).
export interface TaskInstanceRow {
  task_id: number;
  task_name: string | null;
  created_at: string;
  status: string;
  due_at: string | null;
  sla_hours: number;
  completed_at: string | null;
  sla_status: string | null;
}

// API response for the task instances table - Used in TaskInstancesTableWidget.tsx via analyticsApi.ts
export type TaskInstancesResponse = TaskInstanceRow[];