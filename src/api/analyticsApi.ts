import API from "./axios";
import type {
  ActiveOverdueTasksResponse,
  BottleneckScoreWeights,
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
  WorkflowRunningInstancesValueResponse,
  UserListResponse,
  MyPerformanceResponse,
} from "../types";

// Overall APIs

// Shared time-range filter params sent to the "Overall Analytics" widgets, applied to task completion date on the backend
export type DateRangeParams = {
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
};

//Running Documents
export const fetchRunningDocuments = async (): Promise<RunningDocumentsApiResponse> => {
  const res = await API.get("/api/analytics/widgets/running-documents/"); //sends get request to backend endpoint to fetch running documents data
  return res.data;
};

//Active Overdue Tasks
export const fetchActiveOverdueTasks = async (): Promise<ActiveOverdueTasksResponse> => {
  const res = await API.get("/api/analytics/widgets/active-overdue-tasks/");
  return res.data;
};

//Completed Tasks
export const fetchCompletedTasks = async (params: DateRangeParams = {}): Promise<CompletedTasksResponse> => {
  const res = await API.get("/api/analytics/widgets/completed-tasks/", { params });
  return res.data;
};

//SLA Compliance
export const fetchSLACompliance = async (params: DateRangeParams = {}): Promise<SLAComplianceResponse> => {
  const res = await API.get("/api/analytics/widgets/sla-compliance/", { params });
  return res.data;
};

//SLA Distribution
export const fetchSLADistribution = async (params: DateRangeParams = {}): Promise<SLADistributionResponse> => {
  const res = await API.get("/api/analytics/widgets/sla-distribution/", { params });
  return res.data;
};

//Bottleneck Workflows
export const fetchBottlenecks = async (params: DateRangeParams = {}): Promise<BottleneckWorkflowsResponse> => {
  const res = await API.get("/api/analytics/widgets/bottleneck-workflows/", { params });
  return res.data;
};

//User Performance
export const fetchUserPerformance = async (params: DateRangeParams = {}): Promise<UserPerformanceResponse> => {
  const res = await API.get("/api/analytics/widgets/user-performance/", { params });
  return res.data;
};

//Available users (for the My Performance widget's user picker)
export const fetchUsers = async (): Promise<UserListResponse> => {
  const res = await API.get("/api/analytics/widgets/users/");
  return res.data;
};

//My Performance — single user's task history, SLA trend & motivational summary
export const fetchMyPerformance = async (
  userId: number,
  params: DateRangeParams = {}
): Promise<MyPerformanceResponse> => {
  const res = await API.get("/api/analytics/widgets/my-performance/", {
    params: { user_id: userId, ...params },
  });
  return res.data;
};

// =====================================================
// CONFIG APIs

/* Backend type */
interface BackendBottleneckScoreWeights {
  time_weight: number;
  breach_weight: number;
  volume_weight: number;
}

const toFrontendWeights = (data: BackendBottleneckScoreWeights): BottleneckScoreWeights => ({
  timeWeight: data.time_weight,
  breachWeight: data.breach_weight,
  volumeWeight: data.volume_weight,
});

const toBackendWeights = (data: BottleneckScoreWeights) => ({
  time_weight: data.timeWeight,
  breach_weight: data.breachWeight,
  volume_weight: data.volumeWeight,
});

// Bottleneck score weights — null when nothing has been configured yet
// (the backend still scores workflows using its 0.45/0.45/0.10 default).
export const fetchBottleneckWeights = async (): Promise<BottleneckScoreWeights | null> => {
  const res = await API.get("/api/analytics/config/bottleneck-weights/");
  return res.data.exists ? toFrontendWeights(res.data.data) : null;
};

export const saveBottleneckWeights = async (
  data: BottleneckScoreWeights
): Promise<BottleneckScoreWeights> => {
  const res = await API.post("/api/analytics/config/bottleneck-weights/", toBackendWeights(data));
  return toFrontendWeights(res.data.data);
};

// =====================================================
// WORKFLOW APIs

// Available workflows
export const fetchWorkflows = async (): Promise<WorkflowListResponse> => {
  const res = await API.get("/api/analytics/widgets/workflows/");
  return res.data;
};

// Running instances
export const fetchWorkflowRunningInstances = async (
  workflowId: number
): Promise<WorkflowRunningInstancesValueResponse> => {
  const res = await API.get(
    `/api/analytics/widgets/workflow/${workflowId}/running-instances/`
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
