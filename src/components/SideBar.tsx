import React from "react";
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
} from "lucide-react";



type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedKey: string;
    onMenuClick: (key: string) => void;
    onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
                                             isOpen,
                                             onClose,
                                             selectedKey,
                                             onMenuClick,
                                         }) => {
    const mainMenu = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Documents", path: "/document", icon: FileText },
        { name: "Instances", path: "/instances", icon: Activity },
        { name: "Workflows", path: "/workflow", icon: Workflow },

    ];

    const configMenu = [
        { name: "Dashboard Builder", path: "/dashboard-builder", icon: LayoutDashboard },
        { name: "Analytics & Charts", path: "/analytics", icon: BarChart3 },
        { name: "Document Types", path: "/document-types", icon: Folder },
        { name: "Workflows-Versions", path: "/workflow-version", icon:GitBranch},
        { name: "Roles & Users", path: "/user", icon: Users },
        { name: "Notifications", path: "/notifications", icon: Bell, badge: 3 },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

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
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full px-5 py-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white">
                            DocFlow
                        </span>
                    </div>

                    {/* Main Menu */}
                    <nav className="flex flex-col gap-1">
                        {mainMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => onMenuClick(item.path)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                        ${
                                        selectedKey === item.path
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

                    {/* Configuration Section */}
                    <div className="mt-5">
                        <p className="text-xs text-blue-400/60 tracking-widest mb-3 px-3">
                            CONFIGURATION
                        </p>

                        <nav className="flex flex-col gap-1">
                            {configMenu.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => onMenuClick(item.path)}
                                        className={`
                                            flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                                            ${
                                            selectedKey === item.path
                                                ? "bg-blue-500/20 text-white"
                                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            {item.name}
                                        </div>

                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-3 pt-2 border-t border-white/5">
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