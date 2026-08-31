import type { StepStatus } from "./common";

/* =========================
   WORKFLOW STEPS - Used in UI display
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
   WORKFLOW LIST - Used in AnalyticsPage.tsx
========================= */
export interface WorkflowListItem {
  workflow_id: number;
  name: string;
}

export type WorkflowListResponse = WorkflowListItem[];

/* =========================
   API RESPONSE TYPES - Used in analyticsApi.ts
========================= */

// Running instances count response from workflow endpoints - Used in RunningInstancesWidget.tsx
export interface WorkflowRunningInstancesValueResponse {
  value: number;
}

// Average completion time in hours for a workflow - Used in AvgCompletionTimeWidget.tsx
export interface WorkflowAvgCompletionTimeApiResponse {
  avg_completion_time_hours: number;
}

// SLA compliance metrics for a workflow - Used in SLAComplianceWidget.tsx
export interface WorkflowSLAComplianceApiResponse {
  total_tasks: number;
  met_tasks: number;
  percentage: number;
}

// Individual workflow instance data - Used in InstanceDrilldownWidget.tsx
export interface WorkflowInstance {
  instance_id: number;
  instance_name: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  document_id: number | null;
}

// API response array of workflow instances - Used in InstanceDrilldownWidget.tsx and fetchWorkflowInstances()
export type WorkflowInstancesApiResponse = WorkflowInstance[];

/* =========================
   DRILLDOWN DATA - Used in InstanceDrilldownWidget.tsx
========================= */

// Individual task within a workflow instance
export interface InstanceDrilldownTask {
  task_name: string;
  assigned_user: string | null;
  assigned_role: string | null;
  status: string;
  sla_status: string;
  sla_hours: number | null;
  time_taken_hours: number | null;
}

// Array of tasks for instance drilldown view - Used in InstanceDrilldownWidget.tsx
export type InstanceDrilldownResponse = InstanceDrilldownTask[];

/* =========================
   STEP FLOW DETAILS - Used in WorkflowStepFlowWidget.tsx
========================= */

// Individual step metrics in a workflow
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

// Complete step flow response with aggregated metrics - Used in WorkflowStepFlowWidget.tsx
export interface WorkflowStepFlowDetailResponse {
  total_instances?: number;
  completed_instances?: number;
  completion_rate?: number;
  steps?: WorkflowStepDetail[];
}