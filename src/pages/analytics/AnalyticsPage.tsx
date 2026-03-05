// Main dashboard page — has two tabs: Overall Dashboard and Workflow Analytics
// Displays system-wide and per-workflow KPIs with custom chart support

import { useMemo, useRef, useState } from "react";
import StatCard from "../../components/chartAnalytics/StatCard";
import SLADonut from "../../components/chartAnalytics/SLADonut";
import SLATrend from "../../components/chartAnalytics/SLATrend";
import BottleneckSteps from "../../components/chartAnalytics/BottleneckSteps";
import UserSLAList from "../../components/chartAnalytics/Userperformance";
import CustomChartsSection from "../../components/chartAnalytics/CustomChartsSection";
import InstanceDrilldown from "../../components/chartAnalytics/InstanceDrilldown";
import WorkflowStepFlow from "../../components/chartAnalytics/WorkflowStepFlow";
import { useCharts } from "../../context/ChartsContext";
import { exportElementAsPdf } from "../../services/pdfExportService";
import {
  WORKFLOWS,
  DASHBOARD_KPI,
  INSTANCE_DETAILS,
  getWorkflowKPI,
  getOverallLiveKPI,
} from "../../data/dummyData";

type Tab = "overall" | "workflow";
type TimeRange = "7d" | "30d" | "90d" | "custom";

export const AnalyticsPage = () => {
  const [tab, setTab] = useState<Tab>("overall");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  
  // Get shared charts from context — updates when charts are created/edited/deleted
  const { charts } = useCharts();
  
  // Workflow tab — selected workflow
  const [selectedWorkflow, setSelectedWorkflow] = useState(WORKFLOWS[0]);

  const overallMainExportRef = useRef<HTMLDivElement>(null);
  const workflowMainExportRef = useRef<HTMLDivElement>(null);
  const overallCustomChartsRef = useRef<HTMLDivElement>(null);
  const workflowCustomChartsRef = useRef<HTMLDivElement>(null);

  const workflowKPI = useMemo(
    () => getWorkflowKPI(selectedWorkflow),
    [selectedWorkflow]
  );

  const overallLiveKPI = useMemo(() => getOverallLiveKPI(), []);

  const overallSlaStatusCounts = useMemo(() => {
    let met = 0;
    let breached = 0;

    Object.values(INSTANCE_DETAILS).forEach((instance) => {
      instance.steps.forEach((step) => {
        if (step.status === "Met") met += 1;
        else if (step.status === "Breached") breached += 1;
      });
    });

    return {
      met,
      breached,
      completedTasks: met + breached,
    };
  }, []);

  // Navigate to chart configuration page to create/edit charts
  function handleCreateChart() {
    window.location.href = "/analytics/chart-configuration";
  }

  function handleExportOverallMain() {
    if (!overallMainExportRef.current) return;
    void exportElementAsPdf(overallMainExportRef.current, "Overall Dashboard");
  }

  function handleExportWorkflowMain() {
    if (!workflowMainExportRef.current) return;
    void exportElementAsPdf(
      workflowMainExportRef.current,
      `Workflow Analytics - ${selectedWorkflow}`
    );
  }

  function handleExportOverallCustomCharts() {
    if (!overallCustomChartsRef.current) return;
    void exportElementAsPdf(overallCustomChartsRef.current, "Overall Dashboard - Custom Charts");
  }

  function handleExportWorkflowCustomCharts() {
    if (!workflowCustomChartsRef.current) return;
    void exportElementAsPdf(
      workflowCustomChartsRef.current,
      `Workflow Analytics - ${selectedWorkflow} - Custom Charts`
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ── Tab Bar ── */}
      <div className="bg-white border-b border-slate-200 px-8 flex -mt-2">
        {(["overall", "workflow"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "overall" ? "Overall Dashboard" : "Workflow Analytics"}
          </button>
        ))}
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-2">

        {/* ══ OVERALL DASHBOARD TAB ══ */}
        {tab === "overall" && (
          <div className="space-y-5">

            {/* Page heading */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Overall Dashboard</h2>
                <p className="text-sm text-slate-500 mt-1">
                  System-wide KPI monitoring across all workflows
                </p>
              </div>
              <button
                onClick={handleExportOverallMain}
                className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Export PDF
              </button>
            </div>

            <div ref={overallMainExportRef} className="space-y-5">
              {/* Top stat cards — always live, not affected by time range */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon="📄"
                  value={overallLiveKPI.runningDocuments.toString()}
                  label="Running Documents"
                  sub="Currently Active"
                  color="blue"
                />
                <StatCard
                  icon="⚠️"
                  value={overallLiveKPI.activeOverdueTasks.toString()}
                  label="Active Overdue Tasks"
                  sub="Requires Immediate Attention"
                  color="red"
                />
              </div>

              {/* Time range filter bar */}
              <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500 font-medium">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                aria-label="Select analytics time range"
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              {timeRange === "custom" && (
                <>
                  <span className="text-sm text-slate-500">From</span>
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    aria-label="Custom range start date"
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
                  />
                  <span className="text-sm text-slate-500">To</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    min={customFromDate || undefined}
                    aria-label="Custom range end date"
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
                  />
                </>
              )}
              <span className="text-xs text-slate-400">— Filters all sections below</span>
            </div>

            {/* Period metric cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Completed tasks*/}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl font-bold text-slate-900">{overallSlaStatusCounts.completedTasks}</div>
                    <div className="text-sm text-slate-500 mt-1">Completed Tasks</div>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">▲ +{DASHBOARD_KPI.overall.completedTasksChange}%</span>
                </div>
              </div>

              {/* SLA Compliance */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl font-bold text-slate-900">{DASHBOARD_KPI.overall.slaCompliance}%</div>
                    <div className="text-sm text-slate-500 mt-1">SLA Compliance</div>
                  </div>
                  <span className="text-red-500 text-sm font-semibold">▼ {DASHBOARD_KPI.overall.slaComplianceChange}%</span>
                </div>
              </div>
            </div>

            {/* SLA Charts */}
            <div className="grid grid-cols-2 gap-4">
              <SLADonut />
              <SLATrend />
            </div>

            {/* bottleneck + user sections */}
            <div className="grid grid-cols-2 gap-4">
              <BottleneckSteps 
                onWorkflowSelect={(workflow) => {
                  setSelectedWorkflow(workflow);
                  setTab("workflow");
                }}
              />
              <UserSLAList />
            </div>
          </div>

            {/* ── Custom Charts — Overall source only ── */}
            <div ref={overallCustomChartsRef}>
              <CustomChartsSection
                charts={charts}
                source="overall"
                onCreateClick={handleCreateChart}
                onExportClick={handleExportOverallCustomCharts}
              />
            </div>

          </div>
        )}

        {/* ══ WORKFLOW ANALYTICS TAB ══ */}
        {tab === "workflow" && (
          <div className="space-y-5">

            {/* Page heading with workflow selector */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Workflow Analytics</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Per-workflow performance and instance drill-down
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportWorkflowMain}
                  className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Export PDF
                </button>
                <select
                  value={selectedWorkflow}
                  onChange={(e) => setSelectedWorkflow(e.target.value)}
                  aria-label="Select workflow for analytics"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 outline-none"
                >
                  {WORKFLOWS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div ref={workflowMainExportRef} className="space-y-5">
              {/* Workflow stat cards */}
              <div className="grid grid-cols-3 gap-4">
              <StatCard
                icon="📁"
                value={workflowKPI.totalInstances.toString()}
                label="Total Instances"
                sub="Selected period"
                color="blue"
              />
              <StatCard
                icon="⏱"
                value={workflowKPI.avgCompletionTime}
                label="Avg Completion Time"
                sub="Per instance"
                color="blue"
              />
              <StatCard
                icon="✅"
                value={`${workflowKPI.slaCompliance}%`}
                label="SLA Compliance"
                sub="Overall rate"
                color="red"
              />
            </div>

              {/* ── Workflow Step Flow Analysis ── */}
              <WorkflowStepFlow workflow={selectedWorkflow} />

              {/* ── Instance Drill-down for selected workflow ── */}
              <InstanceDrilldown workflow={selectedWorkflow} />
            </div>

            {/* ── Custom Charts — Workflow source only ── */}
            <div ref={workflowCustomChartsRef}>
              <CustomChartsSection
                charts={charts}
                source="workflow"
                workflow={selectedWorkflow}
                onCreateClick={handleCreateChart}
                onExportClick={handleExportWorkflowCustomCharts}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};