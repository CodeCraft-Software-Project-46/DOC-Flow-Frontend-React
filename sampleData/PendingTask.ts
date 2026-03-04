export interface PendingTask {
    doc: string;
    step: string;
    priority: "Critical" | "High" | "Medium" | "Low";
    hours: number;
    overdue: boolean;
}

export const PENDING_TASKS: PendingTask[] = [
    { doc: "PO-2024-0125.pdf",      step: "Manager Approval",   priority: "High",     hours: 7,  overdue: true  },
    { doc: "INV-ACME-2024-002.pdf", step: "Finance Review",     priority: "Critical", hours: 10, overdue: true  },
    { doc: "CONTRACT-2024-008.pdf", step: "Legal Review",       priority: "Medium",   hours: 0,  overdue: false },
    { doc: "EXP-2024-045.pdf",      step: "Initial Submission", priority: "Low",      hours: 36, overdue: false },
    { doc: "PO-2024-0130.pdf",      step: "Dept. Approval",     priority: "High",     hours: 9,  overdue: true  },
];

export const APPROVALS_WAITING: PendingTask[] = [
    { doc: "CONTRACT-2024-008.pdf", step: "Legal Review",   priority: "Medium",   hours: 0,  overdue: false },
    { doc: "INV-ACME-2024-002.pdf", step: "Finance Review", priority: "Critical", hours: 10, overdue: true  },
];