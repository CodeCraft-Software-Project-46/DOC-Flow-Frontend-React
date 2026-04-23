// SLA Calculation Engine
// Calculates SLA breach/meet considering only working hours
// Provides recovery analysis for ongoing documents

import type { WorkingHoursConfig } from "../types/index";
import { calculateWorkingHours, addWorkingHours, DEFAULT_WORKING_HOURS, getWorkingHoursPerDay } from "./workingHoursService";

export interface SLACalculationResult {
  slaTarget: number; // SLA target in working hours
  actualTime: number; // Actual time taken (working hours only)
  status: "Met" | "Breached" | "Critical";
  hoursOver: number; // If breached, how many hours over
  percentageUsed: number; // How much of SLA has been used (0-100%)
  slaDeadline: Date; // When SLA expires
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SLA BREACH/MEET CALCULATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Calculate if an SLA was met or breached
 *
 * Logic:
 * 1. Calculate actual time (ignoring holidays, non-working hours only)
 * 2. Compare with SLA target
 * 3. Classify as Met, Breached, or Critical
 *
 * @param createdTime - When task was created
 * @param completedTime - When task was completed (or now if ongoing)
 * @param slaTargetHours - SLA target in working hours
 * @param config - Working hours configuration
 * @returns SLA calculation result
 *
 * Example:
 * - Created: Monday 9am, Completed: Wednesday 5pm, SLA: 16 hours (8hr/day)
 * - Actual: Mon(7h) + Tue(8h) + Wed(5h) = 20 hours
 * - Status: "Breached" (20 > 16), OverBy: 4 hours
 */
export function calculateSLA(
  createdTime: Date,
  completedTime: Date,
  slaTargetHours: number,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS
): SLACalculationResult {
  // Calculate actual working hours spent
  const actualWorkingHours = calculateWorkingHours(createdTime, completedTime, config);

  // Determine status
  const hoursOver = actualWorkingHours - slaTargetHours;
  let status: "Met" | "Breached" | "Critical";

  if (actualWorkingHours <= slaTargetHours) {
    status = "Met";
  } else if (hoursOver <= 2) {
    status = "Breached";
  } else {
    status = "Critical";
  }

  // Calculate SLA deadline (when SLA was supposed to expire)
  const slaDeadline = addWorkingHours(createdTime, slaTargetHours, config);

  // Percentage used
  const percentageUsed = (actualWorkingHours / slaTargetHours) * 100;

  return {
    slaTarget: slaTargetHours,
    actualTime: actualWorkingHours,
    status,
    hoursOver: Math.max(0, hoursOver),
    percentageUsed: Math.round(percentageUsed),
    slaDeadline,
  };
}

/**
 * Calculate current SLA status for an ongoing step
 * (not yet completed)
 */
export function calculateCurrentSLAStatus(
  createdTime: Date,
  slaTargetHours: number,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS,
  currentTime: Date = new Date()
): SLACalculationResult {
  // Reuse the main calculation with current time as "completion"
  return calculateSLA(createdTime, currentTime, slaTargetHours, config);
}

/**
 * Get time remaining before SLA breach
 */
export function getTimeRemaining(
  createdTime: Date,
  slaTargetHours: number,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS,
  currentTime: Date = new Date()
): { remainingHours: number; remainingDays: number; atRisk: boolean } {
  const actual = calculateWorkingHours(createdTime, currentTime, config);
  const remaining = Math.max(0, slaTargetHours - actual);
  const hoursPerDay = getWorkingHoursPerDay(config);

  // Estimate remaining working days (rough)
  const remainingDays = hoursPerDay > 0 ? Math.ceil(remaining / hoursPerDay) : 0;

  return {
    remainingHours: remaining,
    remainingDays,
    atRisk: remaining < hoursPerDay, // Less than 1 working day left
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SLA RECOVERY ANALYSIS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface WorkflowStepSLA {
  stepName: string;
  slaTarget: number; // working hours
  completedTime?: Date; // null if not completed yet
  createdTime: Date;
  actualTime?: number; // null if not completed
}

export interface RecoverySegment {
  stepName: string;
  stage: "completed" | "current" | "remaining";
  slaTarget: number;
  actualTime: number; // 0 for future steps
  averageTime: number; // Historical average from previous instances
  recommendation?: {
    requiredReduction: number; // Hours to save
    feasible: boolean; // Can it be done?
    actionable: boolean; // Is it realistically achievable?
  };
}

export interface RecoveryAnalysis {
  totalSLA: number; // Sum of all steps' SLA
  completedTime: number; // Actual time spent so far
  remainingSteps: string[];
  overallRecovery: "CRITICAL" | "AT_RISK" | "SAFE" | "RECOVERED";
  deficit: number; // Total hours over SLA so far
  recoveryPlan: RecoverySegment[];
  canBeRecovered: boolean; // Is overall SLA still achievable?
}

/**
 * Analyze SLA recovery possibility for ongoing workflow
 *
 * Logic:
 * 1. Sum all step SLAs to get total SLA
 * 2. Calculate time spent on completed steps
 * 3. For each remaining step, use historical average to estimate time needed
 * 4. Compare estimated total with available SLA
 * 5. If shortage, recommend which step needs reduction
 *
 * @param steps - All steps in the workflow
 * @param historicalAverages - Map of step name → average time from previous instances
 * @param config - Working hours configuration
 * @returns Recovery analysis with recommendations
 *
 * Example:
 * - Workflow total SLA: 100 hours
 * - Completed steps: 60 hours (actual)
 * - Remaining 2 steps: avg 25h each = 50h estimated
 * - Projected total: 110 hours (10 hours over!)
 * - Recommendation: Reduce one step by 5 hours OR skip approvals
 */
export function analyzeRecovery(
  steps: WorkflowStepSLA[],
  historicalAverages: Record<string, number>,
  config: WorkingHoursConfig = DEFAULT_WORKING_HOURS
): RecoveryAnalysis {
  const totalSLA = steps.reduce((sum, step) => sum + step.slaTarget, 0);

  // Calculate time spent
  const completedSteps = steps.filter((s) => s.completedTime);
  const completedTime = completedSteps.reduce((sum, step) => {
    const actual =
      step.actualTime ||
      calculateWorkingHours(step.createdTime, step.completedTime!, config);
    return sum + actual;
  }, 0);

  // Get remaining steps
  const remainingSteps = steps.filter((s) => !s.completedTime).map((s) => s.stepName);

  // Estimate time for remaining steps using historical averages
  let projectedRemainingTime = 0;
  const recoveryPlan: RecoverySegment[] = [];

  // Add completed steps to recovery plan
  completedSteps.forEach((step) => {
    recoveryPlan.push({
      stepName: step.stepName,
      stage: "completed",
      slaTarget: step.slaTarget,
      actualTime: step.actualTime || calculateWorkingHours(step.createdTime, step.completedTime!, config),
      averageTime: historicalAverages[step.stepName] || 0,
    });
  });

  // Add analysis for remaining steps
  steps
    .filter((s) => !s.completedTime)
    .forEach((step) => {
      const avgTime = historicalAverages[step.stepName] || step.slaTarget;
      projectedRemainingTime += avgTime;

      const stage = step === steps[steps.length - 1] ? "current" : "remaining";

      recoveryPlan.push({
        stepName: step.stepName,
        stage,
        slaTarget: step.slaTarget,
        actualTime: 0,
        averageTime: avgTime,
        recommendation: {
          requiredReduction: Math.max(0, avgTime - step.slaTarget),
          feasible: avgTime <= step.slaTarget * 1.5, // Within 50% margin
          actionable: avgTime <= step.slaTarget * 1.2, // Within 20% is actionable
        },
      });
    });

  const projectedTotalTime = completedTime + projectedRemainingTime;
  const deficit = Math.max(0, projectedTotalTime - totalSLA);
  const canBeRecovered = deficit === 0 || projectedRemainingTime <= steps.filter((s) => !s.completedTime).reduce((sum, s) => sum + s.slaTarget, 0);

  // Determine overall recovery status
  let overallRecovery: "CRITICAL" | "AT_RISK" | "SAFE" | "RECOVERED";
  if (projectedTotalTime <= totalSLA) {
    overallRecovery = "RECOVERED";
  } else if (deficit > projectedRemainingTime * 0.5) {
    overallRecovery = "CRITICAL";
  } else if (deficit > 0) {
    overallRecovery = "AT_RISK";
  } else {
    overallRecovery = "SAFE";
  }

  return {
    totalSLA,
    completedTime,
    remainingSteps,
    overallRecovery,
    deficit,
    recoveryPlan,
    canBeRecovered,
  };
}

/**
 * Human-readable recovery recommendation
 */
export function getRecoveryRecommendation(analysis: RecoveryAnalysis): string {
  if (analysis.overallRecovery === "RECOVERED") {
    return "✅ Workflow is on track. No action needed.";
  }

  if (analysis.overallRecovery === "SAFE") {
    return `⚠️ Caution: ${analysis.deficit.toFixed(1)} hours over budget. Monitor remaining steps.`;
  }

  if (analysis.overallRecovery === "AT_RISK") {
    // Find which steps need reduction
    const atRiskSteps = analysis.recoveryPlan.filter(
      (s) => s.stage === "remaining" && (s.recommendation?.requiredReduction ?? 0) > 0
    );

    if (atRiskSteps.length === 0) {
      return `⚠️ At Risk: ${analysis.deficit.toFixed(1)} hours deficit. Review workflow efficiency.`;
    }

    const reductions = atRiskSteps
      .map((s) => `${s.stepName} by ${(s.recommendation?.requiredReduction ?? 0).toFixed(1)}h`)
      .join(", ");
    return `🔴 CRITICAL: Reduce ${reductions} to recover SLA.`;
  }

  return `🔴 CRITICAL: ${analysis.deficit.toFixed(1)} hours over SLA. Urgent action needed!`;
}
