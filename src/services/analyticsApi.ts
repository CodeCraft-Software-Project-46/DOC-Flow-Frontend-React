import API from "./api";
import type {
  ActiveOverdueTasksResponse,
  BottleneckWorkflowsResponse,
  CompletedTasksResponse,
  RunningDocumentsApiResponse,
  SLAComplianceResponse,
  SLADistributionResponse,
  UserPerformanceResponse,
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