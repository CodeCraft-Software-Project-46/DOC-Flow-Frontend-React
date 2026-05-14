/* =========================
   RUNNING DOCUMENTS
========================= */

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
  count: number;
  documents: RunningDocument[];
}

/* supports API variations */
export type RunningDocumentsApiResponse =
  | RunningDocumentsResponse
  | { value: RunningDocumentsResponse };

/* =========================
   OVERDUE TASKS
========================= */

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
  count: number;
  tasks: ActiveOverdueTask[];
}

/* =========================
   USER PERFORMANCE
========================= */

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

/* =========================
   SLA DISTRIBUTION
========================= */

export interface SLADistributionPoint {
  name: "met" | "breached";
  value: number;
}

export type SLADistributionResponse =
  | SLADistributionPoint[]
  | { data?: SLADistributionPoint[] };

/* =========================
   BOTTLENECK
========================= */

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

/* reused in UI */
export interface BottleneckStep {
  workflow: string;
  avg: number;
  breach: number;
  tasks: number;
}

// A normalized bottleneck item used by the frontend UI
export type BottleneckItem = {
  workflow: string; // workflow name shown in UI
  avg: number; // average completion time (hours)
  breach: number; // SLA breach percentage
  tasks: number; // total tasks in workflow
  score: number; // computed bottleneck score (0–1)
};

export interface UserSLA {
  name: string;
  compliance: number;
  avg: number;
  breaches: number;
  tasks: number;
}

/* =========================
   UI PROPS
========================= */

export interface RunningDocumentsDetailsProps {
  items: RunningDocument[];
  onClose: () => void;
}

export interface ActiveTasksDetailsProps {
  items: ActiveOverdueTask[];
  onClose: () => void;
}

/* =========================
   SIMPLE RESPONSES
========================= */

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