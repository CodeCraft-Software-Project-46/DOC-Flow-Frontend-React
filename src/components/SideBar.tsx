import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    LayoutDashboard,
    FileText,
    Activity,
    Workflow,
    BarChart3,
    Folder,
    Users,
    Bell,
    Settings,
    HelpCircle,
    GitBranch,
    History,

} from "lucide-react";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedKey: string;
    onMenuClick: (key: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    selectedKey,
    onMenuClick,
}) => {
    // 2. Tap into the Vault to get the user[cite: 7]
    const authContext = useContext(AuthContext);
    const user = authContext?.user;


    // 3. Add 'permission' tags to your menus. 
    // If a menu doesn't have a permission tag, EVERYONE can see it.
    const mainMenu = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }, // Public to logged-in users
        { name: "Documents", path: "/document", icon: FileText },
        { name: "Instances", path: "/instances", icon: Activity },
        { name: "Workflows", path: "/workflow", icon: Workflow },
    ];

    const configMenu = [
        { 
            name: "Dashboard Builder", 
            path: "/dashboard-builder", 
            icon: LayoutDashboard, 
            permission: "configure_dashboard" // Updated from can_build_dashboard
        },
        { 
            name: "Analytics & Charts", 
            path: "/analytics", 
            icon: BarChart3, 
            permission: "view_workflow_performance" // Updated from can_view_analytics
        },
        { 
            name: "Document Types", 
            path: "/document-types", 
            icon: Folder, 
            permission: "configure_document_types" // Updated from can_manage_docs
        },
        { 
            name: "Workflows-Versions", 
            path: "/workflow-version", 
            icon: GitBranch, 
            permission: "view_workflow" // Updated from can_manage_workflows
        },
        { 
            name: "Roles & Users", 
            path: "/user", 
            icon: Users, 
            permission: "view_users" // Updated from can_manage_users
        },
        { 
            name: "Notifications", 
            path: "/notifications", 
            icon: Bell, 
            permission: "can_manage_notifications" // Added the actual permission
        },
        { 
            name: "Settings", 
            path: "/settings", 
            icon: Settings, 
            permission: "configure_dashboard" // Using dashboard config as a proxy for settings
        },
        {
            name: "Audit Logs",
            path: "/audit-logs",
            icon: History,
            permission: "view_users"
        }
    ];

    // 4. The Magic Filter! 
    // This removes items if the user doesn't have the required permission string in their JWT
    const filteredConfigMenu = configMenu.filter(item => {
        if (!item.permission) return true; // If no rule, let it through
        return user?.permissions.includes(item.permission); // Otherwise, check the vault!
    });

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed md:static z-50
                    w-72 h-screen
                    bg-[#0F1E2E]
                    border-r border-white/5
                    transform transition-transform duration-300 flex flex-col
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white">
                            DocFlow
                        </span>
                    </div>

                    {/* Main Menu (Unfiltered) */}
                    <nav className="flex flex-col gap-1">
                        {mainMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => onMenuClick(item.path)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                        ${selectedKey === item.path
                                            ? "bg-blue-500/20 text-white"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Configuration Section (Filtered!) */}
                    {/* Only show the "CONFIGURATION" header if there is actually something to show */}
                    {filteredConfigMenu.length > 0 && (
                        <div className="mt-5">
                            <p className="text-xs text-blue-400/60 tracking-widest mb-3 px-3">
                                CONFIGURATION
                            </p>

                            <nav className="flex flex-col gap-1">
                                {filteredConfigMenu.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => onMenuClick(item.path)}
                                            className={`
                                                flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                                                ${selectedKey === item.path
                                                    ? "bg-blue-500/20 text-white"
                                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} />
                                                {item.name}
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Spacer to push the bottom section down */}
                    <div className="flex-grow"></div>

                    {/* Bottom Section (Help & Logout) */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-1">
                        {/* Display who is logged in */}
                        <div className="px-4 py-2 mb-2">
                            <p className="text-xs text-white/40">Logged in as:</p>
                            <p className="text-sm text-white font-semibold">{user?.username}</p>
                        </div>

                        <button
                            onClick={() => onMenuClick("/help")}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white w-full transition"
                        >
                            <HelpCircle size={18} />
                            Help & Support
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;