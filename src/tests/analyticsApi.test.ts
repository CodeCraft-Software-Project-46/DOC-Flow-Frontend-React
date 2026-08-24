import { beforeEach, describe, expect, it, vi } from "vitest";

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
  beforeEach(() => {
    mockGet.mockReset();
  });

  it.each([
    ["running documents", fetchRunningDocuments, "/api/analytics/widgets/running-documents/"],
    ["active and overdue tasks", fetchActiveOverdueTasks, "/api/analytics/widgets/active-overdue-tasks/"],
    ["workflow list", fetchWorkflows, "/api/analytics/widgets/workflows/"],
  ])("requests %s from its endpoint", async (_name, request, endpoint) => {
    const payload = { success: true };
    mockGet.mockResolvedValueOnce({ data: payload });

    await expect(request()).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith(endpoint);
  });

  // These widgets share the "Overall Analytics" ?from=&to= date-range filter
  // (see DateRangeParams in analyticsApi.ts), so they always pass a params
  // object -- empty when the caller doesn't filter by date.
  it.each([
    ["overall SLA compliance", fetchSLACompliance, "/api/analytics/widgets/sla-compliance/"],
    ["SLA distribution", fetchSLADistribution, "/api/analytics/widgets/sla-distribution/"],
    ["completed tasks", fetchCompletedTasks, "/api/analytics/widgets/completed-tasks/"],
    ["bottleneck workflows", fetchBottlenecks, "/api/analytics/widgets/bottleneck-workflows/"],
    ["user performance", fetchUserPerformance, "/api/analytics/widgets/user-performance/"],
  ])("requests %s from its endpoint with no date filter by default", async (_name, request, endpoint) => {
    const payload = { success: true };
    mockGet.mockResolvedValueOnce({ data: payload });

    await expect(request()).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith(endpoint, { params: {} });
  });

  it.each([
    ["overall SLA compliance", fetchSLACompliance, "/api/analytics/widgets/sla-compliance/"],
    ["SLA distribution", fetchSLADistribution, "/api/analytics/widgets/sla-distribution/"],
    ["completed tasks", fetchCompletedTasks, "/api/analytics/widgets/completed-tasks/"],
    ["bottleneck workflows", fetchBottlenecks, "/api/analytics/widgets/bottleneck-workflows/"],
    ["user performance", fetchUserPerformance, "/api/analytics/widgets/user-performance/"],
  ])("forwards the selected date range to %s's endpoint", async (_name, request, endpoint) => {
    const payload = { success: true };
    const range = { from: "2024-01-01", to: "2024-01-31" };
    mockGet.mockResolvedValueOnce({ data: payload });

    await expect(request(range)).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith(endpoint, { params: range });
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
