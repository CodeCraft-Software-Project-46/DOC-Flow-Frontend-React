import type {
  StepStatus,
  InstanceStatus,
  RecoveryOutcome,
} from "./common";

/* =========================
   WORKFLOW STEPS
========================= */

export interface WorkflowStep {
  name: string;
  assignee: string;
  timeTaken: number | null;
  slaTarget: number;
  status: StepStatus;
  running: boolean;
  pending: boolean;
  pct?: number;
}

/* =========================
   RECOVERY
========================= */

export interface RecoveryStep {
  step: string;
  originalSLA: number;
  mustComplete: number;
  save: number;
  avgTime: number;
  achievable: "yes" | "tight";
}

export interface InstanceDetail {
  overallSLA: number;
  timeUsed: number;
  department: string;
  steps: WorkflowStep[];
  recovery: {
    deficit: number;
    overall: RecoveryOutcome;
    remaining: RecoveryStep[];
  };
}

export interface InstanceSummary {
  id: string;
  status: InstanceStatus;
}

/* =========================
   WORKFLOW METRICS
========================= */

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

/* =========================
   STEP FLOW
========================= */

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

/* =========================
   WORKFLOW LIST
========================= */

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

/* =========================
   SIMPLE API RESPONSES
========================= */

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

/* =========================
   DRILLDOWN
========================= */

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

/* =========================
   STEP FLOW DETAIL
========================= */

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

export interface WorkflowStepFlowDetailResponse {
  total_instances?: number;
  completed_instances?: number;
  completion_rate?: number;
  steps?: WorkflowStepDetail[];
}