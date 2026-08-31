export interface DeptPerformanceRow {
    dept: string;
    score: number;
    color: string;
}

export interface TrendPoint {
    label: string;
    value: number;
}

export interface KpiData {
    dueToday: number;
    overdue: number;
    completedToday: number;
    pendingApprovals: number;
}

export const DEPT_PERFORMANCE: DeptPerformanceRow[] = [
    { dept: "Finance",    score: 92, color: "bg-green-400"  },
    { dept: "Legal",      score: 78, color: "bg-blue-400"   },
    { dept: "HR",         score: 85, color: "bg-violet-400" },
    { dept: "Operations", score: 60, color: "bg-amber-400"  },
];

export const TREND_WEEKLY: TrendPoint[] = [
    { label: "Mon", value: 40 },
    { label: "Tue", value: 65 },
    { label: "Wed", value: 50 },
    { label: "Thu", value: 80 },
    { label: "Fri", value: 60 },
    { label: "Sat", value: 90 },
    { label: "Sun", value: 75 },
];

export const KPI: KpiData = {
    dueToday:        2,
    overdue:         2,
    completedToday:  8,
    pendingApprovals: 5,
};