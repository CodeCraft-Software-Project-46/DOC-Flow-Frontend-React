import { describe, expect, it, vi } from "vitest";

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock("../api/axios", () => ({
  default: { get: mockGet },
}));

import {
  fetchActiveOverdueTasks,
  fetchBottlenecks,
  fetchCompletedTasks,
  fetchInstanceDrilldown,
  fetchRunningDocuments,
  fetchSLACompliance,
  fetchSLADistribution,
  fetchUserPerformance,
  fetchWorkflowAvgTime,
  fetchWorkflowInstances,
  fetchWorkflowRunningInstances,
  fetchWorkflowSLACompliance,
  fetchWorkflowSteps,
  fetchWorkflows,
} from "../api/analyticsApi";

describe("analyticsApi", () => {
  it.each([
    ["overall SLA compliance", fetchSLACompliance, "/api/analytics/widgets/sla-compliance/"],
    ["SLA distribution", fetchSLADistribution, "/api/analytics/widgets/sla-distribution/"],
    ["running documents", fetchRunningDocuments, "/api/analytics/widgets/running-documents/"],
    ["active and overdue tasks", fetchActiveOverdueTasks, "/api/analytics/widgets/active-overdue-tasks/"],
    ["completed tasks", fetchCompletedTasks, "/api/analytics/widgets/completed-tasks/"],
    ["bottleneck workflows", fetchBottlenecks, "/api/analytics/widgets/bottleneck-workflows/"],
    ["user performance", fetchUserPerformance, "/api/analytics/widgets/user-performance/"],
    ["workflow list", fetchWorkflows, "/api/analytics/widgets/workflows/"],
  ])("requests %s from its endpoint", async (_name, request, endpoint) => {
    const payload = { success: true };
    mockGet.mockResolvedValueOnce({ data: payload });

    await expect(request()).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith(endpoint);
  });

  it.each([
    ["running instances", fetchWorkflowRunningInstances, "/api/analytics/widgets/workflow/7/running-instances/"],
    ["average completion time", fetchWorkflowAvgTime, "/api/analytics/widgets/workflow/7/avg-completion-time/"],
    ["workflow SLA compliance", fetchWorkflowSLACompliance, "/api/analytics/widgets/workflow/7/sla-compliance/"],
    ["step flow", fetchWorkflowSteps, "/api/analytics/widgets/workflow/7/step-flow/"],
    ["workflow instances", fetchWorkflowInstances, "/api/analytics/widgets/workflow/7/instances/"],
    ["instance drilldown", fetchInstanceDrilldown, "/api/analytics/widgets/instance/7/drilldown/"],
  ])("requests %s using the selected id", async (_name, request, endpoint) => {
    const payload = { success: true };
    mockGet.mockResolvedValueOnce({ data: payload });

    await expect(request(7)).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith(endpoint);
  });
});
