import type { ReactNode } from "react";

/* =========================
   UI / COMPONENT TYPES
========================= */

// Color variants for StatCard component - Used in StatCard.tsx
export type StatCardColor = "blue" | "red" | "green";

// Props for the StatCard component - Used in StatCard.tsx
export interface StatCardProps {
  icon: ReactNode;
  value: string | number | null;
  label: string;
  description?: string;
  color: StatCardColor;
  small?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

/* =========================
   STATUS TYPES
========================= */

// Step status in a workflow task - Used in WorkflowStep interface
export type StepStatus = "Met" | "Breached" | "At Risk" | "Pending";

/* =========================
   BUSINESS LOGIC TYPES
========================= */

// Working hours configuration for SLA calculations
// Used in: WorkingScheduleModal.tsx, HolidaysModal.tsx, SettingsPage.tsx
export interface WorkingHoursConfig {
  workStartTime: string;      // HH:MM format
  workEndTime: string;        // HH:MM format
  workDays: number[];         // 0=Sunday, 1=Monday, etc.
  holidays: string[];         // YYYY-MM-DD format
}

// Weights blended into a workflow's bottleneck score (avg completion time,
// SLA breach %, task volume). Need not sum to 1 — the backend normalizes
// them — but the UI shows the normalized split so admins can see what will
// actually be applied.
// Used in: BottleneckWeightsModal.tsx, SettingsPage.tsx
export interface BottleneckScoreWeights {
  timeWeight: number;
  breachWeight: number;
  volumeWeight: number;
}