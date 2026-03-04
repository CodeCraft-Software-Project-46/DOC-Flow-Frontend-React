export interface Role {
    id: number;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
}

export const ALL_PERMISSIONS = [
    "manage users",
    "manage workflows",
    "manage settings",
    "approve",
    "review",
    "upload",
    "assign",
    "create po",
    "comment",
    "view",
];

export const SAMPLE_ROLES: Role[] = [
    {
        id: 1,
        name: "Admin",
        description: "Full system access including configuration and user management",
        userCount: 2,
        permissions: ["manage users", "manage workflows", "manage settings", "approve", "review"],
    },
    {
        id: 2,
        name: "Department Manager",
        description: "Can approve documents and manage department workflows",
        userCount: 3,
        permissions: ["approve", "review", "upload", "assign"],
    },
    {
        id: 3,
        name: "Finance Approver",
        description: "Financial document approval authority",
        userCount: 2,
        permissions: ["approve", "review", "upload"],
    },
    {
        id: 4,
        name: "Procurement Officer",
        description: "Manages procurement documents and workflows",
        userCount: 4,
        permissions: ["upload", "review", "create po"],
    },
    {
        id: 5,
        name: "Legal Reviewer",
        description: "Reviews and approves legal documents",
        userCount: 2,
        permissions: ["review", "approve", "comment"],
    },
    {
        id: 6,
        name: "Viewer",
        description: "Read-only access to documents and workflow status",
        userCount: 8,
        permissions: ["view"],
    },
    {
        id: 7,
        name: "Staff / Initiator",
        description: "Can initiate and submit documents for approval",
        userCount: 15,
        permissions: ["upload", "view", "comment"],
    },
];