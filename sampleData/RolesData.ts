export interface Role {
    id: number;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
}


export const SAMPLE_ROLES: Role[] = [
    {
        id: 1,
        name: "Admin",
        description: "Full system access including all configurations and user management",
        userCount: 2,
        permissions: [
            "create workflow",
            "update workflow",
            "delete workflow",
            "view workflow",
            "rollback versions",
            "start workflow",
            "upload document",
            "view document",
            "approve document",
            "reject document",
            "comment document",
            "add user",
            "assign role",
            "edit user data",
            "remove user",
            "view users",
            "dashboard configuration",
            "document type configuration",
            "one drive integration",
            "view user performance",
            "view workflow bottlenecks",
            "view workflow performance"
        ],
    },
    {
        id: 2,
        name: "Department Manager",
        description: "Can approve documents and manage workflows in their department",
        userCount: 3,
        permissions: [
            "approve document",
            "reject document",
            "comment document",
            "view workflow",
            "start workflow",
            "view document",
            "upload document",
            "view workflow performance"
        ],
    },
    {
        id: 3,
        name: "Finance Approver",
        description: "Authority to approve financial documents",
        userCount: 2,
        permissions: [
            "approve document",
            "reject document",
            "view document",
            "upload document",
            "comment document"
        ],
    },
    {
        id: 4,
        name: "Procurement Officer",
        description: "Manages procurement workflows and documents",
        userCount: 4,
        permissions: [
            "create workflow",
            "start workflow",
            "upload document",
            "view document",
            "approve document",
            "comment document"
        ],
    },
    {
        id: 5,
        name: "Legal Reviewer",
        description: "Reviews and approves legal documents",
        userCount: 2,
        permissions: [
            "review document",
            "approve document",
            "comment document",
            "view document"
        ],
    },
    {
        id: 6,
        name: "Viewer",
        description: "Read-only access to documents and workflow status",
        userCount: 8,
        permissions: [
            "view document",
            "view workflow",
            "view user performance",
            "view workflow bottlenecks",
            "view workflow performance"
        ],
    },
    {
        id: 7,
        name: "Staff / Initiator",
        description: "Can initiate and submit documents for approval",
        userCount: 15,
        permissions: [
            "upload document",
            "view document",
            "comment document",
            "start workflow"
        ],
    },

];