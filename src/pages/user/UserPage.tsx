
import React, { useState } from "react";
import {RolesTab} from "../../components/role/RolesTab.tsx";
import {UsersTab} from "../../components/role/UsersTab.tsx";

type TabType = "users" | "roles";

export const UserPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("roles");

    return (
        <div className="min-h-screen bg-slate-100" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
            {/* Tab switcher */}
            <div className="bg-white border-b border-slate-200 px-6 pt-4">
                <div className="flex gap-1">
                    {(["users", "roles"] as TabType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-all duration-200 ${
                                activeTab === key
                                    ? "bg-white border-slate-200 text-slate-800 shadow-sm -mb-px z-10"
                                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {key === "users" ? "👤 Users" : "🛡 Roles"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">{activeTab === "roles" ? <RolesTab /> : <UsersTab />}</div>
        </div>
    );
};


