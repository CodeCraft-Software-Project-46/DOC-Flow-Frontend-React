import API from "./api";

// 🔹 Running Documents
export const fetchRunningDocuments = async () => {
  const res = await API.get("/api/analytics/widgets/running-documents/");
  return res.data;
};

// 🔹 Active Overdue Tasks
export const fetchActiveOverdueTasks = async () => {
  const res = await API.get("/api/analytics/widgets/active-overdue-tasks/");
  return res.data;
};

// 🔹 Completed Tasks
export const fetchCompletedTasks = async () => {
  const res = await API.get("/api/analytics/widgets/completed-tasks/");
  return res.data;
};

// 🔹 SLA Compliance
export const fetchSLACompliance = async () => {
  const res = await API.get("/api/analytics/widgets/sla-compliance/");
  return res.data;
};

// 🔹 SLA Distribution
export const fetchSLADistribution = async () => {
  const res = await API.get("/api/analytics/widgets/sla-distribution/");
  return res.data;
};

// 🔹 Bottleneck Workflows
export const fetchBottlenecks = async () => {
  const res = await API.get("/api/analytics/widgets/bottleneck-workflows/");
  return res.data;
};

// 🔹 User Performance
export const fetchUserPerformance = async () => {
  const res = await API.get("/api/analytics/widgets/user-performance/");
  return res.data;
};