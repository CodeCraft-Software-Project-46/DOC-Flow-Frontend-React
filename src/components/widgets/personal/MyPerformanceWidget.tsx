// Self-contained "widget" — drop it anywhere to show one user's own task
// history & SLA performance. Unlike the other overall/workflow widgets it
// owns its own user picker and time-range filter instead of receiving them
// as props, so it can be exported/embedded on its own (e.g. a personal
// dashboard) without a parent page wiring those controls in.

import { useEffect, useMemo, useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";
import { fetchUsers, fetchMyPerformance } from "../../../api/analyticsApi";
import type { MyPerformanceResponse, UserListResponse } from "../../../types";
import StatCard from "../../StatCard";

type TimeRange = "7d" | "30d" | "90d" | "custom" | "all";

const toDateInputString = (d: Date) => d.toISOString().slice(0, 10);

function getMotivationCopy(data: MyPerformanceResponse) {
  const { motivation, summary } = data;

  if (motivation.trend_direction === "insufficient_data") {
    return {
      tone: "neutral" as const,
      text:
        "Not enough completed tasks yet in this range to show a day-by-day trend — complete a few more tasks to start tracking your progress.",
    };
  }

  const from = motivation.first_half_avg ?? summary.breach_percentage;
  const to = motivation.second_half_avg ?? summary.breach_percentage;

  if (motivation.trend_direction === "improving") {
    return {
      tone: "good" as const,
      text: `Great progress! Your SLA breach rate dropped from ${from}% to ${to}% across this period — keep it up and aim for zero breaches.`,
    };
  }

  if (motivation.trend_direction === "worsening") {
    return {
      tone: "bad" as const,
      text: `Your SLA breach rate rose from ${from}% to ${to}% across this period. Try to prioritize upcoming tasks earlier to bring it back down.`,
    };
  }

  return {
    tone: "neutral" as const,
    text: `You're holding steady at around ${to}% breaches. Small, consistent improvements each day will help push that down further.`,
  };
}

const TONE_STYLES = {
  good: "bg-green-50 border-green-200 text-green-700",
  bad: "bg-red-50 border-red-200 text-red-700",
  neutral: "bg-blue-50 border-blue-200 text-blue-700",
};

export default function MyPerformanceWidget() {
  // ── user picker ──
  const usersQuery = useCallback(() => fetchUsers(), []);
  const { data: usersData, loading: usersLoading } =
    useAnalyticsQuery<UserListResponse>(usersQuery, []);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedUserId === null && usersData && usersData.length > 0) {
      setSelectedUserId(usersData[0].user_id);
    }
  }, [usersData, selectedUserId]);

  // ── time range filter ──
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [dateError, setDateError] = useState("");

  const validateDates = (from: string, to: string) => {
    if (!from || !to) {
      setDateError("Please select both dates");
      return false;
    }
    if (new Date(to) < new Date(from)) {
      setDateError("End date cannot be before start date");
      return false;
    }
    setDateError("");
    return true;
  };

  const { dateFrom, dateTo } = useMemo(() => {
    if (timeRange === "all") return { dateFrom: undefined, dateTo: undefined };

    if (timeRange === "custom") {
      const isValidRange =
        !!customFromDate &&
        !!customToDate &&
        new Date(customToDate) >= new Date(customFromDate);
      if (!isValidRange) return { dateFrom: undefined, dateTo: undefined };
      return { dateFrom: customFromDate, dateTo: customToDate };
    }

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return { dateFrom: toDateInputString(from), dateTo: toDateInputString(to) };
  }, [timeRange, customFromDate, customToDate]);

  // ── performance data ──
  const perfQuery = useCallback(() => {
    if (selectedUserId === null) return Promise.resolve(null);
    return fetchMyPerformance(selectedUserId, { from: dateFrom, to: dateTo });
  }, [selectedUserId, dateFrom, dateTo]);

  const { data, loading, error } = useAnalyticsQuery<MyPerformanceResponse | null>(
    perfQuery,
    [selectedUserId, dateFrom, dateTo],
  );

  const donutData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Met", value: data.summary.met_tasks, color: "#22c55e" },
      { name: "Breached", value: data.summary.breached_tasks, color: "#ef4444" },
    ];
  }, [data]);

  const motivation = data ? getMotivationCopy(data) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="font-semibold text-slate-900 text-base">
            My Performance
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Your task history and SLA performance over time
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedUserId ?? ""}
            onChange={(e) =>
              setSelectedUserId(e.target.value ? Number(e.target.value) : null)
            }
            aria-label="Select user"
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
          >
            {usersLoading && <option>Loading users...</option>}
            {(usersData ?? []).map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.user_name}
              </option>
            ))}
          </select>

          <select
            value={timeRange}
            onChange={(e) => {
              const value = e.target.value as TimeRange;
              setTimeRange(value);
              if (value !== "custom") setDateError("");
            }}
            aria-label="Select time range"
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="custom">Custom Range</option>
            <option value="all">All Time</option>
          </select>

          {timeRange === "custom" && (
            <>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => {
                  setCustomFromDate(e.target.value);
                  validateDates(e.target.value, customToDate);
                }}
                aria-label="Custom range start date"
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white text-slate-700 outline-none"
              />
              <input
                type="date"
                value={customToDate}
                onChange={(e) => {
                  setCustomToDate(e.target.value);
                  validateDates(customFromDate, e.target.value);
                }}
                min={customFromDate || undefined}
                aria-label="Custom range end date"
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white text-slate-700 outline-none"
              />
            </>
          )}
        </div>
      </div>

      {dateError && (
        <div className="text-xs text-red-500 mb-3">{dateError}</div>
      )}

      {Boolean(error) && (
        <p className="text-red-500 text-sm">Failed to load performance data</p>
      )}

      {loading || selectedUserId === null ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-50 border border-slate-100" />
          <div className="h-40 rounded-xl bg-slate-50 border border-slate-100" />
        </div>
      ) : !data ? (
        <p className="text-slate-400 text-sm">No performance data available</p>
      ) : (
        <div className="space-y-5">
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon="📋"
              value={data.summary.total_tasks}
              label="Total Tasks"
              color="blue"
              small
            />
            <StatCard
              icon="✅"
              value={`${data.summary.met_percentage}%`}
              label="SLA Met"
              description={`${data.summary.met_tasks} tasks`}
              color="green"
              small
            />
            <StatCard
              icon="⏰"
              value={`${data.summary.breach_percentage}%`}
              label="SLA Breached"
              description={`${data.summary.breached_tasks} tasks`}
              color="red"
              small
            />
            <StatCard
              icon="⏱️"
              value={`${data.summary.avg_time_taken_hours}h`}
              label="Avg Completion Time"
              color="blue"
              small
            />
          </div>

          {/* Donut chart */}
          {data.summary.total_tasks > 0 && (
            <div className="flex items-center gap-8 border-t border-slate-100 pt-5">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx={65}
                    cy={65}
                    innerRadius={42}
                    outerRadius={60}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {donutData.map((item, index) => (
                      <Cell key={index} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-3">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full inline-block ${
                        item.color === "#22c55e" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-slate-600">
                      {item.name}: <span className="font-semibold">{item.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task table */}
          <div className="overflow-x-auto border-t border-slate-100 pt-5">
            <table className="w-full text-sm border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-2 text-left">Task</th>
                  <th className="p-2 text-left">Workflow</th>
                  <th className="p-2 text-left">Instance</th>
                  <th className="p-2 text-left">SLA Target</th>
                  <th className="p-2 text-left">Time Taken</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">
                      No completed tasks in this range
                    </td>
                  </tr>
                ) : (
                  data.tasks.map((task, index) => (
                    <tr key={index} className="border-t border-slate-100">
                      <td className="p-2 font-medium">{task.task_name}</td>
                      <td className="p-2">{task.workflow_name ?? "-"}</td>
                      <td className="p-2">{task.instance_name ?? "-"}</td>
                      <td className="p-2">
                        {task.sla_hours !== null ? `${task.sla_hours}h` : "-"}
                      </td>
                      <td className="p-2">
                        {task.time_taken_hours !== null
                          ? `${task.time_taken_hours}h`
                          : "-"}
                      </td>
                      <td className="p-2">
                        <span
                          className={
                            task.sla_status === "breached"
                              ? "text-red-600 font-semibold"
                              : task.sla_status === "met"
                                ? "text-green-600 font-semibold"
                                : "text-slate-500"
                          }
                        >
                          {task.sla_status ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Motivational message */}
          {motivation && (
            <div
              className={`border rounded-xl px-4 py-3 text-sm font-medium ${TONE_STYLES[motivation.tone]}`}
            >
              {motivation.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
