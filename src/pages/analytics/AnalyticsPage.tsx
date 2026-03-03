// Main dashboard page — has two tabs: Overall Dashboard and Workflow Analytics
// Step 2: Only Overall Dashboard skeleton with StatCards and time range filter

import { useState } from "react";
import StatCard from "../../components/chartAnalytics/StatCard";

type Tab = "overall" | "workflow";
type TimeRange = "7d" | "30d" | "90d" | "custom";

export const AnalyticsPage = () => {
  const [tab, setTab] = useState<Tab>("overall");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ── Tab Bar ── */}
      <div className="bg-white border-b border-slate-200 px-8 flex">
        {(["overall", "workflow"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "overall" ? "Overall Dashboard" : "Workflow Analytics"}
          </button>
        ))}
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ══ OVERALL DASHBOARD TAB ══ */}
        {tab === "overall" && (
          <div className="space-y-5">

            {/* Page heading */}
            <div>
              <h2 className="text-xl font-bold text-slate-900">Overall Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">
                System-wide KPI monitoring across all workflows
              </p>
            </div>

            {/* Top stat cards — always live, not affected by time range */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon="📄"
                value="48"
                label="Running Documents"
                sub="Currently Active"
                color="blue"
              />
              <StatCard
                icon="⚠️"
                value="7"
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
                    <div className="text-4xl font-bold text-slate-900">32</div>
                    <div className="text-sm text-slate-500 mt-1">Completed Tasks (Selected Period)</div>
                    <div className="text-xs text-slate-400">vs previous period</div>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">▲ +8%</span>
                </div>
              </div>

              {/* SLA Compliance */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl font-bold text-slate-900">80%</div>
                    <div className="text-sm text-slate-500 mt-1">SLA Compliance (Selected Period)</div>
                    <div className="text-xs text-slate-400">vs previous period</div>
                  </div>
                  <span className="text-red-500 text-sm font-semibold">▼ -1%</span>
                </div>
              </div>
            </div>

            {/* Placeholder for charts — added in Step 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-52 text-slate-300 text-sm">
                SLA Distribution Chart 
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-52 text-slate-300 text-sm">
                SLA Trend Chart 
              </div>
            </div>

            {/* Placeholder for bottleneck + user sections — Step 4 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-52 text-slate-300 text-sm">
                Bottleneck Steps
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-52 text-slate-300 text-sm">
                User SLA List 
              </div>
            </div>

          </div>
        )}

        {/* ══ WORKFLOW ANALYTICS TAB ══ */}
        {tab === "workflow" && (
          <div className="text-slate-400 text-sm text-center py-20">
            Workflow Analytics 
          </div>
        )}

      </div>
    </div>
  );
};