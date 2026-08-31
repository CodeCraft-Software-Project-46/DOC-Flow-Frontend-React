export interface Document {
    doc: string;
    type: string;
    step: string;
    status: "In Workflow" | "Draft" | "Completed" | "Rejected";
}

export const MY_DOCUMENTS: Document[] = [
    { doc: "PO-2024-0125.pdf",      type: "Purchase Order",  step: "Manager Approval",   status: "In Workflow" },
    { doc: "INV-ACME-2024-002.pdf", type: "Invoice",         step: "Finance Review",     status: "In Workflow" },
    { doc: "CONTRACT-2024-008.pdf", type: "Contract",        step: "Legal Review",       status: "In Workflow" },
    { doc: "EXP-2024-045.pdf",      type: "Expense Report",  step: "Initial Submission", status: "Draft"       },
];

export const REVISION_DOCUMENTS: Document[] = [
    { doc: "PO-2024-0125.pdf",      type: "Purchase Order", step: "Manager Approval", status: "Rejected" },
    { doc: "INV-ACME-2024-002.pdf", type: "Invoice",        step: "Finance Review",   status: "Rejected" },
];