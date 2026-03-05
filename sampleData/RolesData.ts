/*
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

];*/


// ─── ROLES ────────────────────────────────────────────────────────────────────
export const SAMPLE_ROLES = [
    { id: 1, name: "Admin", description: "Full system access", permissions: ["create workflow","update workflow","delete workflow","view workflow","rollback versions","start workflow","upload document","view document","approve document","reject document","comment document","add user","assign role","edit user data","remove user","view users","dashboard configuration","document type configuration","one drive integration","view user performance","view workflow bottlenecks","view workflow performance"] },
    { id: 2, name: "Department Manager", description: "Approve documents and manage workflows", permissions: ["approve document","reject document","comment document","view workflow","start workflow","view document","upload document","view workflow performance"] },
    { id: 3, name: "Finance Approver", description: "Approve financial documents", permissions: ["approve document","reject document","view document","upload document","comment document"] },
    { id: 4, name: "Procurement Officer", description: "Manages procurement workflows", permissions: ["create workflow","start workflow","upload document","view document","approve document","comment document"] },
    { id: 5, name: "Legal Reviewer", description: "Reviews and approves legal documents", permissions: ["review document","approve document","comment document","view document"] },
    { id: 6, name: "Viewer", description: "Read-only access", permissions: ["view document","view workflow","view user performance","view workflow bottlenecks","view workflow performance"] },
    { id: 7, name: "Staff / Initiator", description: "Initiate and submit documents", permissions: ["upload document","view document","comment document","start workflow"] },
];

// ─── WIDGETS ─────────────────────────────────────────────────────────────────
export const ALL_WIDGETS = [
    { id: 1,  icon: "📋", title: "My Pending Tasks",     description: "Tasks awaiting your action",        category: "Task",         cols: 6, rows: 2, dataSource: "current user", requiredPermissions: ["start workflow","view workflow"] },
    { id: 2,  icon: "✅", title: "Approvals Waiting",    description: "Approvals assigned to you",         category: "Task",         cols: 6, rows: 2, dataSource: "current user", requiredPermissions: ["approve document"] },
    { id: 3,  icon: "⚠️", title: "Overdue Tasks",        description: "Tasks past their SLA deadline",     category: "SLA",          cols: 6, rows: 2, dataSource: "all users",    requiredPermissions: ["view workflow","view workflow performance"] },
    { id: 4,  icon: "🔁", title: "Revision Required",    description: "Documents sent back for revision",  category: "Document",     cols: 6, rows: 2, dataSource: "current user", requiredPermissions: ["view document","upload document"] },
    { id: 5,  icon: "🕐", title: "Completed Today",      description: "Tasks completed today",             category: "Task",         cols: 6, rows: 2, dataSource: "current user", requiredPermissions: ["start workflow","view workflow"] },
    { id: 6,  icon: "📈", title: "Trend Analysis",       description: "Workflow trends over time",         category: "Analytics",    cols: 8, rows: 3, dataSource: "all users",    requiredPermissions: ["view workflow performance"] },
    { id: 7,  icon: "🔔", title: "Recent Notifications", description: "Latest notifications for you",      category: "Notification", cols: 4, rows: 2, dataSource: "current user", requiredPermissions: ["view document","view workflow"] },
    { id: 8,  icon: "🏢", title: "Dept Performance",     description: "Performance metrics by department", category: "Analytics",    cols: 6, rows: 3, dataSource: "all depts",    requiredPermissions: ["view user performance"] },
    { id: 9,  icon: "📊", title: "SLA Breach Summary",   description: "Overview of breached SLAs",        category: "SLA",          cols: 8, rows: 3, dataSource: "all depts",    requiredPermissions: ["view workflow bottlenecks"] },
    { id: 10, icon: "📄", title: "Recent Documents",     description: "Latest documents accessed",        category: "Document",     cols: 6, rows: 2, dataSource: "current user", requiredPermissions: ["view document"] },
    { id: 11, icon: "📢", title: "Alert Summary",        description: "Grouped view of system alerts",    category: "Notification", cols: 4, rows: 2, dataSource: "all users",    requiredPermissions: ["view workflow bottlenecks","dashboard configuration"] },
    { id: 12, icon: "🎛️", title: "Custom Dashboard",    description: "Build your own widget layout",     category: "Custom",       cols: 6, rows: 3, dataSource: "custom",       requiredPermissions: ["dashboard configuration"] },
];

export const WIDGET_CATEGORIES = ["All", "Task", "Document", "SLA", "Analytics", "Notification", "Custom"];

// Returns widget IDs accessible to a given role name
export function getAccessibleWidgetIds(roleName) {
    const role = SAMPLE_ROLES.find(r => r.name === roleName);
    if (!role) return [];
    return ALL_WIDGETS
        .filter(w => w.requiredPermissions.some(p => role.permissions.includes(p)))
        .map(w => w.id);
}