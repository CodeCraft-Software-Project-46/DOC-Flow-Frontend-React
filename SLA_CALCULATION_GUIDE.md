# SLA Calculation & Recovery Analysis System

## Overview

This document explains the complete SLA (Service Level Agreement) system including:
1. **Working Hours Configuration** — Define business days, hours/day, holidays
2. **SLA Breach/Meet Calculation** — Calculate actual vs. target time using only working hours
3. **SLA Recovery Analysis** — Predict if remaining steps can recover from SLA breach

---

## 1. Working Hours Configuration

### Why It Matters
- **SLAs are defined in working hours only** — not calendar hours
- Saturday/Sunday don't count toward SLA  
- Holidays don't count toward SLA
- Different companies have different working hours (8h, 10h, 12h per day)

### Configuration Structure
Located in [src/data/dummyData.ts](src/data/dummyData.ts):

```typescript
export const COMPANY_WORKING_HOURS: WorkingHoursConfig = {
  hoursPerDay: 8,              // e.g., 8-hour workday
  workDays: [1, 2, 3, 4, 5],   // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  holidays: [                  // ISO dates to skip
    "2026-01-01",  // New Year
    "2026-12-25",  // Christmas
  ],
  timeZone: "UTC",
};
```

### How to Customize

**Change working hours per day:**
```typescript
hoursPerDay: 12  // For 12-hour shifts (some manufacturing/support centers)
```

**Change working days:**
```typescript
workDays: [0, 1, 2, 3, 4, 5]  // Include Sunday (0-6 = Sun-Sat)
// OR for 4-day week:
workDays: [1, 2, 3, 4]        // Mon-Thu only
```

**Add special holidays:**
```typescript
holidays: [
  "2026-03-15",  // Company anniversary
  "2026-08-10",  // Regional festival
]
```

### UI Configuration
Users can customize working hours via [WorkingHoursModal.tsx](src/components/WorkingHoursModal.tsx):
- Interactive day selector
- Holiday date picker
- Real-time summary (hours/week, days/year)
- Validation & error messages

---

## 2. SLA Breach/Meet Calculation

### The Problem
A document created **Monday 2pm**, completed **Friday 5pm** with **8-hour SLA**:
- ❌ Calendar hours: 75.5 hours (spans 4 days)
- ✅ **Working hours**: 23 hours (Mon 6h + Tue 8h + Wed 8h + Thu 8h + Fri 1h = 31h, but only 23h counting from 2pm-5pm on those days)

### Logic Flow

```
Task Created        Task Completed
    ↓                    ↓
Monday 2pm          Friday 5pm
    │
    Ignore:         Count ONLY:
    ├─ Sat/Sun       ├─ Mon 2pm → 5pm = 3 hours
    ├─ Holidays      ├─ Tue 9am → 5pm = 8 hours
    └─ After hours   ├─ Wed 9am → 5pm = 8 hours
                     ├─ Thu 9am → 5pm = 8 hours
                     └─ Fri 9am → 1pm = 4 hours
                     ────────────────────────
                     Total: 31 hours (working hours only)

Actual: 31 hours
SLA Target: 8 hours
Status: BREACHED by 23 hours
```

### Calculation Example (Code)

```typescript
import { calculateSLA } from "../services/slaCalculationService";
import { COMPANY_WORKING_HOURS } from "../data/dummyData";

const result = calculateSLA(
  new Date("2026-03-02T14:00"), // Monday 2pm
  new Date("2026-03-06T17:00"), // Friday 5pm
  8,                            // SLA target: 8 hours
  COMPANY_WORKING_HOURS
);

console.log(result);
// {
//   slaTarget: 8,
//   actualTime: 31,
//   status: "Breached",
//   hoursOver: 23,
//   percentageUsed: 387.5,
//   slaDeadline: Date (2026-03-02T17:00 - when 8 hours after start)
// }
```

### Status Classification

| Status | Condition | Color | Action |
|--------|-----------|-------|--------|
| **Met** | Actual ≤ SLA | 🟢 Green | On track |
| **Breached** | Actual > SLA (≤2h over) | 🟡 Yellow | Monitor |
| **Critical** | Actual > SLA (+2h) | 🔴 Red | Escalate |

---

## 3. SLA Recovery Analysis

### The Scenario
You're at **hour 90 out of 100 total SLA** with **2 steps remaining**:

```
Workflow: Purchase Order Approval (100 hours total)
├─ Dept Approval          ✓ 3h (SLA: 4h)
├─ Manager Approval       ✓ 30h (SLA: 24h) ← BREACHED
├─ CFO Approval          ⏱ 30h done (SLA: 48h, 15h remaining)
└─ Payment Release       ⏳ Not started (SLA: 8h)

Used: 90 hours | Remaining SLA: 10 hours | Danger: ⚠️
```

### Recovery Plan Calculation

**Step 1: Analyze completed steps**
```
Manager Approval: Spent 30h (SLA 24h) → +6h deficit
```

**Step 2: Project remaining steps using historical averages**
```
From STEP_HISTORICAL_AVERAGES:
- CFO Approval:    Avg 36h, Target 48h, Remaining 15h → Likely ok (15 < 36)
- Payment Release: Avg 8.5h, Target 8h, Remaining 0h → NOT STARTED
```

**Step 3: Calculate what needs to change**
```
Current deficit: -6h
Projected remaining: +36h (CFO) + 8.5h (Payment) = 44.5h
Total projected: 90 + 44.5 = 134.5h (vs 100h target)
Shortfall: 34.5h

RECOMMENDATION:
- Reduce CFO Approval by 30h (from 36h avg to 6h) ← UNREALISTIC
- OR: Reduce Payment by 8.5h (impossible, only 8h SLA)
- OR: Escalate/waive approvals → CRITICAL STATE
```

### Recovery Analysis Data Structure

```typescript
interface RecoveryAnalysis {
  totalSLA: number;           // 100 (sum of all steps)
  completedTime: number;      // 90 (actual time spent so far)
  remainingSteps: string[];   // ["CFO Approval", "Payment Release"]
  overallRecovery: "CRITICAL" | "AT_RISK" | "SAFE" | "RECOVERED";
  deficit: number;            // 34.5 (projected hours over)
  recoveryPlan: RecoverySegment[];  // Step-by-step breakdown
  canBeRecovered: boolean;    // false (deficit too large)
}

interface RecoverySegment {
  stepName: string;
  stage: "completed" | "current" | "remaining";
  slaTarget: number;          // 48
  actualTime: number;         // 30 (if completed) or 0 (if future)
  averageTime: number;        // 36 (historical)
  recommendation?: {
    requiredReduction: number; // 30 hours to save (unrealistic)
    feasible: boolean;         // false
    actionable: boolean;       // false (>20% reduction needed)
  };
}
```

### Recovery Status Legend

| Status | Meaning | Example |
|--------|---------|---------|
| **RECOVERED** | On track, no issues | Used 50h of 100h, avg remaining ≤ 50h |
| **SAFE** | Small deficit, manageable | Used 95h, remaining steps avg 6h (total fit in 100h with small buffer) |
| **AT_RISK** | Risk of breach, action needed | Used 95h, remaining steps avg 12h (total 107h — 7h shortfall) |
| **CRITICAL** | High probability of breach | Used 95h, remaining steps avg 30h (total 125h — 25h shortfall) |

### Feasibility Indicators

```
actionable: true
├─ Reduction needed < 20% of current SLA
└─ Example: Reduce 36h step by 7h (19%) → POSSIBLE

actionable: false
├─ Reduction needed > 20% of current SLA
└─ Example: Reduce 36h step by 30h (83%) → UNREALISTIC
```

---

## 4. Example Usage in Components

### Display Current SLA Status

```tsx
import { calculateCurrentSLAStatus } from "../services/slaCalculationService";

function StepStatus({ step, createdAt }: Props) {
  const status = calculateCurrentSLAStatus(
    new Date(createdAt),
    step.slaTarget,
    COMPANY_WORKING_HOURS
  );

  return (
    <div>
      <p>{status.status === "Met" ? "✅" : "❌"} {status.status}</p>
      <p>{status.percentageUsed}% of SLA used</p>
      {status.status === "Breached" && (
        <p>⚠️ {status.hoursOver.toFixed(1)} hours over</p>
      )}
    </div>
  );
}
```

### Show Recovery Analysis

```tsx
import { analyzeRecovery } from "../services/slaCalculationService";
import { SLARecoveryDisplay } from "../components/SLARecoveryDisplay";
import { STEP_HISTORICAL_AVERAGES } from "../data/dummyData";

function WorkflowDetail({ workflow }: Props) {
  const analysis = analyzeRecovery(
    workflow.steps,                           // All steps with times
    STEP_HISTORICAL_AVERAGES[workflow.name], // Historical avg per step
    COMPANY_WORKING_HOURS
  );

  return <SLARecoveryDisplay analysis={analysis} workflowName={workflow.name} />;
}
```

### Configure Working Hours

```tsx
import { WorkingHoursModal } from "../components/WorkingHoursModal";

function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Configure Working Hours
      </button>
      <WorkingHoursModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(config) => {
          // Save to context/state
          localStorage.setItem("workingHours", JSON.stringify(config));
        }}
      />
    </>
  );
}
```

---

## 5. Key Formulas & Algorithms

### Working Hours Calculation
```
actualWorkingHours = 0
for each day from start to end:
  if day is workingDay and not holiday:
    actualWorkingHours += min(hoursInDay, hoursPerDay)
return actualWorkingHours
```

### SLA Status
```
actualTime = calculateWorkingHours(createdTime, completedTime, config)

if actualTime ≤ slaTarget:
  status = "Met"
else if actualTime - slaTarget ≤ 2:
  status = "Breached"
else:
  status = "Critical"

percentageUsed = (actualTime / slaTarget) × 100
```

### Recovery Analysis
```
for each completed step:
  actual = calculateWorkingHours(created, completed, config)
  completedTime += actual

projectedRemaining = 0
for each remaining step:
  projectedRemaining += historicalAverages[stepName]

projectedTotal = completedTime + projectedRemaining
deficit = max(0, projectedTotal - totalSLA)

for each remaining step:
  requiredReduction = projectedTotal - totalSLA
  feasible = requiredReduction ≤ unprojectedTime × 1.5
  actionable = requiredReduction ≤ unprojectedTime × 1.2
```

---

## 6. Integration Checklist

- [ ] Display SLA status (Met/Breached/Critical) in step cards
- [ ] Show recovery analysis in workflow detail view  
- [ ] Add working hours config modal to settings page
- [ ] Update analytics dashboard to use working hour calculations
- [ ] Use `STEP_HISTORICAL_AVERAGES` for recovery projections
- [ ] Store custom `COMPANY_WORKING_HOURS` in localStorage/database
- [ ] Show "at risk" indicators in bottleneck widget
- [ ] Include recovery recommendations in alerts/emails

---

## Files Modified/Created

| File | Purpose |
|------|---------|
| [src/services/workingHoursService.ts](src/services/workingHoursService.ts) | Working hours calculation engine |
| [src/services/slaCalculationService.ts](src/services/slaCalculationService.ts) | SLA breach/meet & recovery analysis |
| [src/components/WorkingHoursModal.tsx](src/components/WorkingHoursModal.tsx) | UI for configuring working hours |
| [src/components/SLARecoveryDisplay.tsx](src/components/SLARecoveryDisplay.tsx) | Display recovery plan & recommendations |
| [src/data/dummyData.ts](src/data/dummyData.ts) | Working hours config + historical averages |

---

## FAQ

**Q: Why does my SLA calculation show more than 24 hours for 1 day?**
A: If task created at 2pm Mon and completed 5pm Tue, that's actually 31 hours (Mon 6h + Tue 9h across a 24-hour period, but working only 8h/day = 17 working hours). Check if your date conversion is correct.

**Q: How do I add a company-wide holiday?**
A: Add to `COMPANY_WORKING_HOURS.holidays` in [src/data/dummyData.ts](src/data/dummyData.ts) as ISO date string: "2026-03-17"

**Q: Can I have different working hours for different departments?**
A: Yes! Create separate configs per department and pass the right one to `calculateSLA()`. Future: Store in database with departmentId.

**Q: What if a step should be 24/7 or on-call?**
A: Pass `hoursPerDay: 24, workDays: [0,1,2,3,4,5,6]` for that step's calculation.

**Q: How accurate are the historical averages?**
A: They're mock data. Replace with actual averages calculated from your database of completed instances.
