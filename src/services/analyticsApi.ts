import API from "./api";
import type {
  ActiveOverdueTasksResponse,
  BottleneckWorkflowsResponse,
  CompletedTasksResponse,
  InstanceDrilldownResponse,
  RunningDocumentsApiResponse,
  SLAComplianceResponse,
  SLADistributionResponse,
  UserPerformanceResponse,
  WorkflowAvgCompletionTimeApiResponse,
  WorkflowInstancesApiResponse,
  WorkflowListResponse,
  WorkflowSLAComplianceApiResponse,
  WorkflowStepFlowDetailResponse,
  WorkflowTotalInstancesValueResponse,
} from "../types";

// 🔹 Running Documents
export const fetchRunningDocuments = async (): Promise<RunningDocumentsApiResponse> => {
  const res = await API.get("/api/analytics/widgets/running-documents/");
  return res.data;
};

// 🔹 Active Overdue Tasks
export const fetchActiveOverdueTasks = async (): Promise<ActiveOverdueTasksResponse> => {
  const res = await API.get("/api/analytics/widgets/active-overdue-tasks/");
  return res.data;
};

// 🔹 Completed Tasks
export const fetchCompletedTasks = async (): Promise<CompletedTasksResponse> => {
  const res = await API.get("/api/analytics/widgets/completed-tasks/");
  return res.data;
};

// 🔹 SLA Compliance
export const fetchSLACompliance = async (): Promise<SLAComplianceResponse> => {
  const res = await API.get("/api/analytics/widgets/sla-compliance/");
  return res.data;
};

// 🔹 SLA Distribution
export const fetchSLADistribution = async (): Promise<SLADistributionResponse> => {
  const res = await API.get("/api/analytics/widgets/sla-distribution/");
  return res.data;
};

// 🔹 Bottleneck Workflows
export const fetchBottlenecks = async (): Promise<BottleneckWorkflowsResponse> => {
  const res = await API.get("/api/analytics/widgets/bottleneck-workflows/");
  return res.data;
};

// 🔹 User Performance
export const fetchUserPerformance = async (): Promise<UserPerformanceResponse> => {
  const res = await API.get("/api/analytics/widgets/user-performance/");
  return res.data;
};
// =====================================================
// WORKFLOW APIs
// =====================================================

// Available workflows
export const fetchWorkflows = async (): Promise<WorkflowListResponse> => {
  const res = await API.get("/api/analytics/widgets/workflows/");
  return res.data;
};

// Total instances
export const fetchWorkflowTotalInstances = async (
  workflowId: number
): Promise<WorkflowTotalInstancesValueResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/total-instances/`
  );
  return res.data;
};

// Avg completion time
export const fetchWorkflowAvgTime = async (
  workflowId: number
): Promise<WorkflowAvgCompletionTimeApiResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/avg-completion-time/`
  );
  return res.data;
};

// SLA compliance
export const fetchWorkflowSLACompliance = async (
  workflowId: number
): Promise<WorkflowSLAComplianceApiResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/sla-compliance/`
  );
  return res.data;
};

// Step flow
export const fetchWorkflowSteps = async (
  workflowId: number
): Promise<WorkflowStepFlowDetailResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/step-flow/`
  );
  return res.data;
};

// Workflow instances
export const fetchWorkflowInstances = async (
  workflowId: number
): Promise<WorkflowInstancesApiResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/instances/`
  );
  return res.data;
};

// Instance drilldown
export const fetchInstanceDrilldown = async (
  instanceId: number
): Promise<InstanceDrilldownResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/instance/${instanceId}/drilldown/`
  );
  return res.data;
};