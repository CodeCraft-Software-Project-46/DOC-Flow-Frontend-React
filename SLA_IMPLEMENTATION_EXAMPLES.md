# SLA System - Quick Implementation Guide

## Overview
This guide provides code examples and integration steps for implementing SLA calculations in your app.

---

## 1. Basic SLA Status Display

### Example: Show SLA status in a step card

```tsx
// components/WorkflowStep.tsx
import { calculateCurrentSLAStatus } from "../services/slaCalculationService";
import { COMPANY_WORKING_HOURS } from "../data/dummyData";

export function WorkflowStep({ step, createdAt }: Props) {
  const sla = calculateCurrentSLAStatus(
    new Date(createdAt),
    step.slaTarget,
    COMPANY_WORKING_HOURS
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Met": return "text-green-600";
      case "Breached": return "text-yellow-600";
      case "Critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>{step.name}</h3>
      <div className="mt-2 font-mono text-sm">
        <p>SLA Target: {sla.slaTarget.toFixed(1)} hours</p>
        <p>Actual Time: {sla.actualTime.toFixed(1)} hours</p>
        <p className={`font-bold ${getStatusColor(sla.status)}`}>
          {sla.status} ({sla.percentageUsed}% used)
        </p>
        {sla.status === "Breached" && (
          <p className="text-red-600">⚠️ {sla.hoursOver.toFixed(1)}h over SLA</p>
        )}
      </div>
    </div>
  );
}
```

**Output Example:**
```
Dept Approval
SLA Target: 4.0 hours
Actual Time: 3.2 hours
Met (80% used)

Manager Approval  
SLA Target: 24.0 hours
Actual Time: 30.5 hours
🔴 Breached (127% used)
⚠️ 6.5h over SLA
```

---

## 2. SLA Recovery Analysis

### Example: Show recovery plan for ongoing workflow

```tsx
// pages/workflow/WorkflowDetail.tsx
import { analyzeRecovery } from "../services/slaCalculationService";
import { SLARecoveryDisplay } from "../components/SLARecoveryDisplay";
import { STEP_HISTORICAL_AVERAGES, COMPANY_WORKING_HOURS } from "../data/dummyData";

export function WorkflowDetail({ workflow, completedSteps, remainingSteps }: Props) {
  // Prepare step data for analysis
  const stepsForAnalysis = [
    ...completedSteps.map(step => ({
      stepName: step.name,
      slaTarget: step.slaTarget,
      createdTime: new Date(step.createdAt),
      completedTime: new Date(step.completedAt),
      actualTime: step.actualTime,
    })),
    ...remainingSteps.map(step => ({
      stepName: step.name,
      slaTarget: step.slaTarget,
      createdTime: new Date(step.createdAt),
      completedTime: undefined,
      actualTime: undefined,
    })),
  ];

  // Get historical averages for this workflow
  const historicalAvg = STEP_HISTORICAL_AVERAGES[workflow.name] || {};

  // Analyze recovery
  const analysis = analyzeRecovery(
    stepsForAnalysis,
    historicalAvg,
    COMPANY_WORKING_HOURS
  );

  return (
    <div className="space-y-6">
      <h1>{workflow.name}</h1>
      
      {/* Recovery Analysis Component */}
      <SLARecoveryDisplay 
        analysis={analysis} 
        workflowName={workflow.name}
      />

      {/* Additional info */}
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2">What This Means</h3>
        <p className="text-sm text-blue-900">
          {analysis.overallRecovery === "CRITICAL"
            ? "🔴 The workflow is at critical risk. Immediate action required to recover SLA."
            : analysis.overallRecovery === "AT_RISK"
            ? "⚠️ The workflow is at risk. Review remaining steps for optimization."
            : "✅ The workflow is on track to meet SLA targets."}
        </p>
      </div>
    </div>
  );
}
```

**What the user sees:**
```
Purchase Order Approval

[Recovery Analysis Card]
├─ Total SLA: 100.0h
├─ Used Time: 90.0h
├─ Deficit: +34.5h
├─ Remaining Steps: 2
├─ Status: 🔴 CRITICAL

Recovery Plan:
├─ Dept Approval [✓ Done]
│  └─ SLA: 4.0h | Actual: 3.0h | Variance: -1.0h
├─ Manager Approval [✓ Done]
│  └─ SLA: 24.0h | Actual: 30.0h | Variance: +6.0h
├─ CFO Approval [⏱ Current] 
│  └─ SLA: 48.0h | Avg: 36.0h | Need to reduce by 30.0h ⚠️
└─ Payment Release [⏳ Pending]
   └─ SLA: 8.0h | Avg: 8.5h | Need to reduce by 0.5h

💡 Recommendation: CRITICAL - Reduce CFO Approval by 30 hours...
```

---

## 3. Working Hours Configuration

### Example: Add config modal to settings

```tsx
// pages/settings/SettingsPage.tsx
import { useState } from "react";
import { WorkingHoursModal } from "../../components/WorkingHoursModal";
import { Settings, Clock } from "lucide-react";

export function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedConfig, setSavedConfig] = useState(null);

  const handleSave = (config: WorkingHoursConfig) => {
    // Save to localStorage (or API)
    localStorage.setItem("companyWorkingHours", JSON.stringify(config));
    setSavedConfig(config);
    // Optionally: update global state/context
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Working Hours Card */}
      <div className="border rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-blue-600" />
            <div>
              <h2 className="font-bold">Working Hours Configuration</h2>
              <p className="text-sm text-gray-600">
                Define company business hours for accurate SLA calculations
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Configuration
          </button>
        </div>

        {/* Current Config Summary */}
        {savedConfig && (
          <div className="bg-gray-50 p-4 rounded text-sm font-mono">
            <p>📅 Working Hours: {savedConfig.hoursPerDay}h/day</p>
            <p>📆 Working Days: {savedConfig.workDays.length} days/week</p>
            <p>🎉 Holidays: {savedConfig.holidays.length} days/year</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <WorkingHoursModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialConfig={savedConfig}
      />
    </div>
  );
}
```

---

## 4. Analytics Dashboard Integration

### Example: Update analytics to use working hours

```tsx
// pages/analytics/AnalyticsPage.tsx
import { calculateSLA } from "../../services/slaCalculationService";
import { COMPANY_WORKING_HOURS, INSTANCES, INSTANCE_DETAILS } from "../../data/dummyData";

export function AnalyticsPage() {
  // Calculate SLA metrics for all documents
  const metrics = Object.entries(INSTANCES).flatMap(([workflow, instances]) =>
    instances.map(doc => {
      const detail = INSTANCE_DETAILS[doc.id];
      if (!detail) return null;

      // Find when document was created and completed
      const createdAt = new Date(detail.createdAt);
      const completedAt = detail.completedAt ? new Date(detail.completedAt) : new Date();
      
      const result = calculateSLA(
        createdAt,
        completedAt,
        detail.overallSLA,
        COMPANY_WORKING_HOURS
      );

      return {
        id: doc.id,
        workflow,
        status: result.status,
        percentageUsed: result.percentageUsed,
        hoursOver: result.hoursOver,
      };
    })
  );

  // Calculate KPIs
  const totalDocs = metrics.length;
  const metDocs = metrics.filter(m => m.status === "Met").length;
  const breachedDocs = metrics.filter(m => m.status !== "Met").length;

  const slaCompliance = ((metDocs / totalDocs) * 100).toFixed(1);
  const avgOverage = (
    metrics.filter(m => m.hoursOver > 0)
      .reduce((sum, m) => sum + m.hoursOver, 0) / 
    metrics.filter(m => m.hoursOver > 0).length
  ).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-green-600">SLA Compliance</p>
          <p className="text-3xl font-bold">{slaCompliance}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-sm text-red-600">Breached Documents</p>
          <p className="text-3xl font-bold">{breachedDocs}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded">
          <p className="text-sm text-orange-600">Avg. Overrun</p>
          <p className="text-3xl font-bold">{avgOverage}h</p>
        </div>
      </div>

      {/* Details Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Document</th>
            <th>Status</th>
            <th>Time Used</th>
            <th>Over SLA</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => (
            <tr key={metric.id} className="border-b">
              <td className="p-2 font-mono">{metric.id}</td>
              <td className={metric.status === "Met" ? "text-green-600" : "text-red-600"}>
                {metric.status}
              </td>
              <td>{metric.percentageUsed}%</td>
              <td className="text-red-600">
                {metric.hoursOver > 0 ? `+${metric.hoursOver.toFixed(1)}h` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 5. Real-Time SLA Monitoring

### Example: Background service to monitor and alert

```typescript
// services/slaMonitoringService.ts
import { calculateCurrentSLAStatus } from "./slaCalculationService";
import { COMPANY_WORKING_HOURS } from "../data/dummyData";

interface AlertConfig {
  warningThreshold: number; // e.g., 80% of SLA used
  criticalThreshold: number; // e.g., 100% of SLA used
}

export function checkSLAAlerts(
  ongoingSteps: any[],
  config: AlertConfig = { warningThreshold: 80, criticalThreshold: 100 }
) {
  const alerts = [];

  ongoingSteps.forEach(step => {
    const status = calculateCurrentSLAStatus(
      new Date(step.createdAt),
      step.slaTarget,
      COMPANY_WORKING_HOURS
    );

    if (status.percentageUsed >= config.criticalThreshold) {
      alerts.push({
        severity: "CRITICAL",
        step: step.name,
        message: `SLA Breached by ${status.hoursOver.toFixed(1)} hours`,
        action: "escalate",
      });
    } else if (status.percentageUsed >= config.warningThreshold) {
      alerts.push({
        severity: "WARNING",
        step: step.name,
        message: `SLA at ${status.percentageUsed}%`,
        action: "monitor",
      });
    }
  });

  return alerts;
}

// Usage in a polling service
export function startSLAMonitoring(interval = 60000) {
  setInterval(() => {
    const alerts = checkSLAAlerts(getOngoingSteps());
    
    alerts.forEach(alert => {
      if (alert.severity === "CRITICAL") {
        sendNotification(alert);
        logAlert(alert);
      }
    });
  }, interval);
}
```

---

## 6. Testing SLA Logic

### Unit test examples

```typescript
// __tests__/slaCalculation.test.ts
import { calculateSLA, analyzeRecovery } from "../services/slaCalculationService";
import { COMPANY_WORKING_HOURS } from "../data/dummyData";

describe("SLA Calculation", () => {
  test("should calculate working hours excluding weekends", () => {
    // Monday 9am to Wednesday 5pm (8h/day, Mon-Fri)
    const result = calculateSLA(
      new Date("2026-03-02T09:00"), // Monday
      new Date("2026-03-04T17:00"), // Wednesday
      16, // SLA: 16 hours
      COMPANY_WORKING_HOURS
    );

    expect(result.actualTime).toBe(24); // Mon 8h + Tue 8h + Wed 8h
    expect(result.status).toBe("Breached");
    expect(result.hoursOver).toBe(8);
  });

  test("should mark as Met when within SLA", () => {
    const result = calculateSLA(
      new Date("2026-03-02T09:00"),
      new Date("2026-03-02T17:00"),
      8,
      COMPANY_WORKING_HOURS
    );

    expect(result.status).toBe("Met");
    expect(result.hoursOver).toBe(0);
  });

  test("should skip holidays in calculation", () => {
    // Assuming 2026-01-01 is New Year (holiday)
    const configWithHoliday = {
      ...COMPANY_WORKING_HOURS,
      holidays: ["2026-03-02"], // Monday is holiday
    };

    const result = calculateSLA(
      new Date("2026-03-02T09:00"), // Monday (holiday)
      new Date("2026-03-04T17:00"), // Wednesday
      16,
      configWithHoliday
    );

    expect(result.actualTime).toBe(16); // Only Tue 8h + Wed 8h
  });
});
```

---

## 7. Migration Checklist

Use this to integrate SLA calculations into your existing app:

- [ ] Import `calculateSLA`, `calculateCurrentSLAStatus` from `slaCalculationService`
- [ ] Import `COMPANY_WORKING_HOURS`, `STEP_HISTORICAL_AVERAGES` from `dummyData`
- [ ] Add SLA status badges to step cards
- [ ] Add recovery analysis to workflow detail page
- [ ] Add working hours config modal to settings
- [ ] Update analytics KPIs to use working hour calculations
- [ ] Set up alerts for at-risk documents (optional)
- [ ] Test with real workflow data
- [ ] Document custom working hours per department (if needed)
- [ ] Set up data export for audit trail

---

## Support

For detailed logic explanations, see [SLA_CALCULATION_GUIDE.md](SLA_CALCULATION_GUIDE.md)
