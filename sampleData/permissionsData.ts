export interface PermissionCategory {
    category: string;
    permissions: string[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
    {
        category: "Workflow Management",
        permissions: [
            "create_workflow",
            "update_workflow",
            "delete_workflow",
            "view_workflow",
            "rollback_versions",
            "start_workflow",
        ],
    },
    {
        category: "Document Management",
        permissions: [
            "upload_document",
            "view_document",
            "approve_document",
            "reject_document",
            "comment_document",
        ],
    },
    {
        category: "User Management",
        permissions: [
            "add_user",
            "assign_role",
            "edit_user",
            "remove_user",
            "view_users",
        ],
    },
    {
        category: "Dashboard Configuration",
        permissions: ["configure_dashboard"],
    },
    {
        category: "Document Type Configuration",
        permissions: ["configure_document_types"],
    },
    {
        category: "OneDrive Integration",
        permissions: ["onedrive_integration"],
    },
    {
        category: "Charts",
        permissions: [
            "view_user_performance",
            "view_workflow_bottlenecks",
            "view_workflow_performance",
            "view_bottleneck_steps",

        ],
    },
    {
        category:"Role",
        permissions: ["Lead"]
    }

];