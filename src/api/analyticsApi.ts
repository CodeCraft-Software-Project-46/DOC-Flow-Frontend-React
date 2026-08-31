import API from "./axios";
import type {
  ActiveOverdueTasksResponse,
  BottleneckScoreWeights,
  BottleneckWorkflowsResponse,
  CompletedTasksResponse,
  CreateTaskPayload,
  CreateTaskResult,
  OpenTask,
  InstanceDrilldownResponse,
  RunningDocumentsApiResponse,
  SLAComplianceResponse,
  SLADistributionResponse,
  TaskInstancesResponse,
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

//Task Instances table (raw list, shares the same time-range filter)
export const fetchTaskInstances = async (params: DateRangeParams = {}): Promise<TaskInstancesResponse> => {
  const res = await API.get("/api/analytics/widgets/task-instances/", { params });
  return res.data;
};

//Available users (for the Individual User Performance widget's user picker)
export const fetchUsers = async (): Promise<UserListResponse> => {
  const res = await API.get("/api/analytics/widgets/users/");
  return res.data;
};

//Individual User Performance — single user's task history & SLA trend
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

// =====================================================
// TASKS (manual/testing) — the analytics dashboard's "New Task" button.
// created_at is never sent: the backend always stamps it with the server's
// current time, since this system only ever runs in Sri Lanka.

interface BackendCreateTaskResult {
  task_id: number;
  task_name: string;
  workflow_instance_id: number;
  created_at: string;
  due_at: string | null;
  sla_hours: number;
}

const toFrontendCreateTaskResult = (
  data: BackendCreateTaskResult
): CreateTaskResult => ({
  taskId: data.task_id,
  taskName: data.task_name,
  workflowInstanceId: data.workflow_instance_id,
  createdAt: data.created_at,
  dueAt: data.due_at,
  slaHours: data.sla_hours,
});

export const createTask = async (
  payload: CreateTaskPayload
): Promise<CreateTaskResult> => {
  const res = await API.post("/api/analytics/tasks/create/", {
    task_name: payload.taskName,
    sla_hours: payload.slaHours,
  });
  return toFrontendCreateTaskResult(res.data);
};

interface BackendOpenTask {
  task_id: number;
  task_name: string | null;
  status: string;
  created_at: string;
  due_at: string | null;
  sla_status: string | null;
}

const toFrontendOpenTask = (data: BackendOpenTask): OpenTask => ({
  taskId: data.task_id,
  taskName: data.task_name,
  status: data.status,
  createdAt: data.created_at,
  dueAt: data.due_at,
  slaStatus: data.sla_status,
});

// Most recent not-yet-completed tasks (max 20), newest first.
export const fetchPendingTasks = async (): Promise<OpenTask[]> => {
  const res = await API.get("/api/analytics/tasks/pending/");
  return (res.data as BackendOpenTask[]).map(toFrontendOpenTask);
};

// Marks a task completed at the server's current time.
export const completeTask = async (taskId: number): Promise<OpenTask> => {
  const res = await API.post(`/api/analytics/tasks/${taskId}/complete/`);
  return toFrontendOpenTask(res.data);
};
