export interface SLABreachRow {
    dept: string;
    breached: number;
    atRisk: number;
}

export interface SLAStatusRow {
    doc: string;
    dept: string;
    deadline: string;
    status: "On Track" | "At Risk" | "Breached";
}

export const SLA_BREACH: SLABreachRow[] = [
    { dept: "Finance",    breached: 2, atRisk: 3 },
    { dept: "Legal",      breached: 1, atRisk: 2 },
    { dept: "HR",         breached: 0, atRisk: 4 },
    { dept: "Operations", breached: 1, atRisk: 1 },
];

export const SLA_STATUS: SLAStatusRow[] = [
    { doc: "CONTRACT-2024-008.pdf", dept: "Legal",   deadline: "2/23/2026", status: "At Risk"  },
    { doc: "INV-ACME-2024-002.pdf", dept: "Finance", deadline: "2/22/2026", status: "Breached" },
    { doc: "PO-2024-0125.pdf",      dept: "Ops",     deadline: "2/25/2026", status: "On Track" },
    { doc: "EXP-2024-045.pdf",      dept: "HR",      deadline: "2/24/2026", status: "At Risk"  },
];

export const SLA_KPI = {
    totalSLAs:      24,
    met:            22,
    breached:        2,
    atRisk:          4,
    complianceRate: 98,
};