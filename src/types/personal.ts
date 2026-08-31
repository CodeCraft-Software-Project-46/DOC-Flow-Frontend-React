/* =========================
   INDIVIDUAL USER PERFORMANCE (single-user widget) - Used in MyPerformanceWidget.tsx
========================= */

// Minimal user record for the widget's user picker
export interface UserListItem {
  user_id: number;
  user_name: string;
}

export type UserListResponse = UserListItem[];

// A single completed task performed by the selected user
export interface MyPerformanceTask {
  task_name: string | null;
  workflow_name: string | null;
  instance_name: string | null;
  sla_hours: number | null;
  time_taken_hours: number | null;
  sla_status: "met" | "breached" | string | null;
  completed_at: string | null;
}

// Aggregate stats across the tasks in the selected time range
export interface MyPerformanceSummary {
  total_tasks: number;
  met_tasks: number;
  breached_tasks: number;
  met_percentage: number;
  breach_percentage: number;
  avg_time_taken_hours: number;
}

// One day's breach rate, used to build the day-by-day trend
export interface MyPerformanceTrendPoint {
  date: string;
  total_tasks: number;
  breached_tasks: number;
  breach_percentage: number;
}

// Full response for a single user's performance widget
export interface MyPerformanceResponse {
  user_id: number;
  user_name: string;
  summary: MyPerformanceSummary;
  tasks: MyPerformanceTask[];
  trend: MyPerformanceTrendPoint[];
}
