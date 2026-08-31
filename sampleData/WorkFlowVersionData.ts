export type VersionStatus = "Active" | "Draft" | "Archived" | "Deprecated";

export interface WorkflowStep {
    id: number;
    name: string;
    role: string;
    action: "Approve" | "Review" | "Sign" | "Notify" | "Reject";
    sla: string;
}

export interface WorkflowVersion {
    id: number;
    version: string;
    status: VersionStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    steps: WorkflowStep[];
    changes: string[];
}

export interface Workflow {
    id: number;
    name: string;
    category: string;
    department: string;
    totalVersions: number;
    versions: WorkflowVersion[];
}

export const WORKFLOWS: Workflow[] = [
    {
        id: 1,
        name: "Purchase Order Approval",
        category: "Finance",
        department: "Finance & Procurement",
        totalVersions: 4,
        versions: [
            {
                id: 101,
                version: "v4.0",
                status: "Active",
                createdBy: "Sarah Johnson",
                createdAt: "2026-02-10",
                updatedAt: "2026-02-15",
                description: "Current production version with dual approval for orders above $50k.",
                steps: [
                    { id: 1, name: "Initial Submission",    role: "Staff / Initiator",   action: "Review",  sla: "24h" },
                    { id: 2, name: "Department Review",     role: "Department Manager",  action: "Approve", sla: "48h" },
                    { id: 3, name: "Finance Verification",  role: "Finance Officer",     action: "Review",  sla: "24h" },
                    { id: 4, name: "CFO Approval",          role: "CFO",                 action: "Approve", sla: "72h" },
                    { id: 5, name: "Notification",          role: "System",              action: "Notify",  sla: "1h"  },
                ],
                changes: [
                    "Added CFO approval step for orders above $50k",
                    "Updated SLA for Department Review from 24h to 48h",
                    "Added Finance Verification step",
                ],
            },
            {
                id: 102,
                version: "v3.2",
                status: "Archived",
                createdBy: "Michael Chen",
                createdAt: "2025-11-05",
                updatedAt: "2025-12-01",
                description: "Added finance verification layer before final approval.",
                steps: [
                    { id: 1, name: "Initial Submission",   role: "Staff / Initiator",  action: "Review",  sla: "24h" },
                    { id: 2, name: "Department Review",    role: "Department Manager", action: "Approve", sla: "24h" },
                    { id: 3, name: "Finance Verification", role: "Finance Officer",    action: "Review",  sla: "24h" },
                    { id: 4, name: "Final Approval",       role: "Director",           action: "Approve", sla: "48h" },
                ],
                changes: [
                    "Added Finance Verification step",
                    "Changed final approver from Manager to Director",
                ],
            },
            {
                id: 103,
                version: "v3.0",
                status: "Archived",
                createdBy: "Michael Chen",
                createdAt: "2025-08-20",
                updatedAt: "2025-10-30",
                description: "Simplified 3-step approval process.",
                steps: [
                    { id: 1, name: "Submission",        role: "Staff / Initiator",  action: "Review",  sla: "24h" },
                    { id: 2, name: "Manager Approval",  role: "Department Manager", action: "Approve", sla: "24h" },
                    { id: 3, name: "Final Sign-Off",    role: "Director",           action: "Sign",    sla: "48h" },
                ],
                changes: [
                    "Simplified workflow from 5 steps to 3 steps",
                    "Removed redundant review stages",
                ],
            },
            {
                id: 104,
                version: "v2.1",
                status: "Deprecated",
                createdBy: "Lisa Park",
                createdAt: "2025-03-10",
                updatedAt: "2025-08-19",
                description: "Legacy version with manual notifications.",
                steps: [
                    { id: 1, name: "Submission",        role: "Staff / Initiator",  action: "Review",  sla: "48h" },
                    { id: 2, name: "Manager Approval",  role: "Department Manager", action: "Approve", sla: "48h" },
                ],
                changes: [
                    "Initial versioned workflow",
                    "Manual email notifications",
                ],
            },
        ],
    },

    {
        id: 2,
        name: "Invoice Processing",
        category: "Finance",
        department: "Accounts Payable",
        totalVersions: 3,
        versions: [
            {
                id: 201,
                version: "v2.0",
                status: "Active",
                createdBy: "Tom Richards",
                createdAt: "2026-01-15",
                updatedAt: "2026-02-01",
                description: "Automated invoice matching with 3-way reconciliation.",
                steps: [
                    { id: 1, name: "Invoice Upload",      role: "Staff / Initiator", action: "Review",  sla: "4h"  },
                    { id: 2, name: "Auto Matching",       role: "System",            action: "Review",  sla: "1h"  },
                    { id: 3, name: "AP Review",           role: "AP Officer",        action: "Approve", sla: "24h" },
                    { id: 4, name: "Payment Approval",    role: "Finance Manager",   action: "Approve", sla: "48h" },
                ],
                changes: [
                    "Added automated 3-way matching step",
                    "Reduced manual review time by 60%",
                    "Added SLA alerts",
                ],
            },
            {
                id: 202,
                version: "v1.5",
                status: "Archived",
                createdBy: "Anna Williams",
                createdAt: "2025-09-01",
                updatedAt: "2026-01-14",
                description: "Semi-automated invoice review.",
                steps: [
                    { id: 1, name: "Invoice Upload", role: "Staff / Initiator", action: "Review",  sla: "8h"  },
                    { id: 2, name: "AP Review",      role: "AP Officer",        action: "Approve", sla: "48h" },
                    { id: 3, name: "Final Approval", role: "Finance Manager",   action: "Approve", sla: "48h" },
                ],
                changes: [
                    "Added SLA tracking",
                    "Improved notification emails",
                ],
            },
            {
                id: 203,
                version: "v1.0",
                status: "Deprecated",
                createdBy: "Anna Williams",
                createdAt: "2025-04-15",
                updatedAt: "2025-08-31",
                description: "Manual invoice processing.",
                steps: [
                    { id: 1, name: "Invoice Upload", role: "Staff / Initiator", action: "Review",  sla: "24h" },
                    { id: 2, name: "Manual Review",  role: "AP Officer",        action: "Approve", sla: "72h" },
                ],
                changes: ["Initial version — fully manual process"],
            },
        ],
    },

    {
        id: 3,
        name: "Contract Review & Sign-Off",
        category: "Legal",
        department: "Legal & Compliance",
        totalVersions: 2,
        versions: [
            {
                id: 301,
                version: "v1.2",
                status: "Active",
                createdBy: "Rachel Green",
                createdAt: "2026-01-20",
                updatedAt: "2026-02-10",
                description: "Legal review with external party e-signature.",
                steps: [
                    { id: 1, name: "Draft Submission",  role: "Legal Initiator",   action: "Review",  sla: "24h" },
                    { id: 2, name: "Legal Review",      role: "Legal Counsel",     action: "Review",  sla: "72h" },
                    { id: 3, name: "Compliance Check",  role: "Compliance Officer",action: "Approve", sla: "48h" },
                    { id: 4, name: "Director Sign-Off", role: "Director",          action: "Sign",    sla: "24h" },
                    { id: 5, name: "External Sign",     role: "External Party",    action: "Sign",    sla: "96h" },
                ],
                changes: [
                    "Added Compliance Check before sign-off",
                    "Added external party e-signature step",
                ],
            },
            {
                id: 302,
                version: "v1.0",
                status: "Archived",
                createdBy: "David Moore",
                createdAt: "2025-10-01",
                updatedAt: "2026-01-19",
                description: "Basic contract review without compliance layer.",
                steps: [
                    { id: 1, name: "Draft Submission", role: "Legal Initiator", action: "Review",  sla: "48h" },
                    { id: 2, name: "Legal Review",     role: "Legal Counsel",   action: "Review",  sla: "96h" },
                    { id: 3, name: "Sign-Off",         role: "Director",        action: "Sign",    sla: "24h" },
                ],
                changes: ["Initial version"],
            },
        ],
    },

    {
        id: 4,
        name: "Employee Onboarding",
        category: "HR",
        department: "Human Resources",
        totalVersions: 2,
        versions: [
            {
                id: 401,
                version: "v3.0",
                status: "Draft",
                createdBy: "Jenny Adams",
                createdAt: "2026-02-20",
                updatedAt: "2026-02-22",
                description: "New draft — includes IT provisioning automation.",
                steps: [
                    { id: 1, name: "HR Initiation",      role: "HR Manager",   action: "Review",  sla: "24h" },
                    { id: 2, name: "IT Provisioning",    role: "IT Team",      action: "Review",  sla: "48h" },
                    { id: 3, name: "Manager Onboarding", role: "Line Manager", action: "Approve", sla: "24h" },
                    { id: 4, name: "Completion Sign-Off",role: "HR Manager",   action: "Sign",    sla: "4h"  },
                ],
                changes: [
                    "Added IT Provisioning automation step",
                    "Reduced overall onboarding time target to 3 days",
                ],
            },
            {
                id: 402,
                version: "v2.1",
                status: "Active",
                createdBy: "Jenny Adams",
                createdAt: "2025-07-01",
                updatedAt: "2026-02-19",
                description: "Standard onboarding with manager sign-off.",
                steps: [
                    { id: 1, name: "HR Initiation",      role: "HR Manager",   action: "Review",  sla: "24h" },
                    { id: 2, name: "Manager Onboarding", role: "Line Manager", action: "Approve", sla: "48h" },
                    { id: 3, name: "Completion Sign-Off",role: "HR Manager",   action: "Sign",    sla: "8h"  },
                ],
                changes: [
                    "Merged IT and manager steps",
                    "Added completion sign-off",
                ],
            },
        ],
    },
];