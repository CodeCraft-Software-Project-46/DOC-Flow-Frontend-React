// SLA Recovery Analysis Display Component
// Shows workflow recovery plan, recommendations, and feasibility

import { AlertCircle, TrendingDown, CheckCircle, Clock } from "lucide-react";
import type { RecoveryAnalysis } from "../services/slaCalculationService";
import { getRecoveryRecommendation } from "../services/slaCalculationService";

interface SLARecoveryDisplayProps {
  analysis: RecoveryAnalysis;
  workflowName?: string;
}

export function SLARecoveryDisplay({ analysis, workflowName }: SLARecoveryDisplayProps) {
  const recommendation = getRecoveryRecommendation(analysis);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECOVERED":
        return "bg-green-50 border-green-200";
      case "SAFE":
        return "bg-blue-50 border-blue-200";
      case "AT_RISK":
        return "bg-amber-50 border-amber-200";
      case "CRITICAL":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECOVERED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "SAFE":
        return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case "AT_RISK":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "CRITICAL":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "RECOVERED":
        return "✅ On Track";
      case "SAFE":
        return "⚠️ Caution";
      case "AT_RISK":
        return "⚠️ At Risk";
      case "CRITICAL":
        return "🔴 Critical";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className={`border rounded-lg p-4 ${getStatusColor(analysis.overallRecovery)}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getStatusIcon(analysis.overallRecovery)}
            <div>
              <h3 className="font-bold text-slate-900">SLA Recovery Analysis</h3>
              {workflowName && (
                <p className="text-sm text-slate-600">{workflowName}</p>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            analysis.overallRecovery === "RECOVERED" ? "bg-green-200 text-green-900" :
            analysis.overallRecovery === "SAFE" ? "bg-blue-200 text-blue-900" :
            analysis.overallRecovery === "AT_RISK" ? "bg-amber-200 text-amber-900" :
            "bg-red-200 text-red-900"
          }`}>
            {getStatusText(analysis.overallRecovery)}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-slate-600">Total SLA</p>
            <p className="font-bold text-lg">{analysis.totalSLA.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-slate-600">Used Time</p>
            <p className="font-bold text-lg">{analysis.completedTime.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-slate-600">Deficit</p>
            <p className={`font-bold text-lg ${analysis.deficit > 0 ? "text-red-600" : "text-green-600"}`}>
              {analysis.deficit > 0 ? "+" : ""}{analysis.deficit.toFixed(1)}h
            </p>
          </div>
          <div>
            <p className="text-slate-600">Remaining Steps</p>
            <p className="font-bold text-lg">{analysis.remainingSteps.length}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-4 p-3 bg-white/60 rounded border border-white/80">
          <p className="text-sm font-semibold text-slate-800">{recommendation}</p>
        </div>
      </div>

      {/* Recovery Plan Details */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
          <h4 className="font-bold text-slate-900">Recovery Plan</h4>
        </div>

        <div className="divide-y divide-slate-200">
          {analysis.recoveryPlan.map((segment, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-900">{segment.stepName}</p>
                  <p className="text-xs text-slate-500 capitalize">{segment.stage} Step</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  segment.stage === "completed"
                    ? "bg-green-100 text-green-700"
                    : segment.stage === "current"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {segment.stage === "completed" ? "✓ Done" : segment.stage === "current" ? "⏱ Current" : "⏳ Pending"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-600 text-xs">SLA Target</p>
                  <p className="font-mono font-bold">{segment.slaTarget.toFixed(1)}h</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-600 text-xs">
                    {segment.stage === "completed" ? "Actual Time" : "Historical Avg"}
                  </p>
                  <p className="font-mono font-bold">{segment.stage === "completed" ? segment.actualTime.toFixed(1) : segment.averageTime.toFixed(1)}h</p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-600 text-xs">Variance</p>
                  <p className={`font-mono font-bold ${
                    segment.stage === "completed"
                      ? segment.actualTime > segment.slaTarget ? "text-red-600" : "text-green-600"
                      : segment.averageTime > segment.slaTarget ? "text-red-600" : "text-green-600"
                  }`}>
                    {segment.stage === "completed"
                      ? segment.actualTime > segment.slaTarget
                        ? `+${(segment.actualTime - segment.slaTarget).toFixed(1)}h`
                        : `-${(segment.slaTarget - segment.actualTime).toFixed(1)}h`
                      : segment.averageTime > segment.slaTarget
                      ? `+${(segment.averageTime - segment.slaTarget).toFixed(1)}h`
                      : `-${(segment.slaTarget - segment.averageTime).toFixed(1)}h`}
                  </p>
                </div>
              </div>

              {/* Recovery Recommendation for Future Steps */}
              {segment.recommendation && segment.stage !== "completed" && (
                <div className={`border-l-4 pl-3 py-2 ${
                  segment.recommendation.requiredReduction > 0
                    ? "border-amber-500 bg-amber-50"
                    : "border-green-500 bg-green-50"
                }`}>
                  {segment.recommendation.requiredReduction > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-amber-900">⚠️ Action Required</p>
                      <p className="text-sm text-amber-800 mt-1">
                        Reduce time by <span className="font-bold">{segment.recommendation.requiredReduction.toFixed(1)} hours</span> to stay on track.
                      </p>
                      {!segment.recommendation.actionable && (
                        <p className="text-xs text-red-700 mt-1 font-semibold">
                          ⚠️ This reduction may not be realistically achievable.
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-green-900">✓ Within Target</p>
                      <p className="text-sm text-green-800 mt-1">
                        Historical average is within SLA target. No reduction needed.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feasibility Notice */}
      <div className={`border rounded-lg p-4 ${
        analysis.canBeRecovered
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}>
        <p className="text-sm font-semibold mb-2">
          {analysis.canBeRecovered ? "✓ Recovery Feasible" : "✗ Recovery Challenging"}
        </p>
        <p className="text-sm text-slate-700">
          {analysis.canBeRecovered
            ? "Current trajectory shows SLA can be recovered with recommended reductions in remaining steps."
            : "Current projections suggest SLA cannot be recovered under normal conditions. Escalation may be required."}
        </p>
      </div>
    </div>
  );
}
