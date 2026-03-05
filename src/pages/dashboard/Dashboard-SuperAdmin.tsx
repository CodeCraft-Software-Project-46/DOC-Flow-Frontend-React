import React from "react";

const STATS = [
    { label: "Total Users",       value: 30,  icon: "👥", bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-600"    },
    { label: "Active Dashboards", value: 8,   icon: "📊", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
    { label: "Roles Configured",  value: 7,   icon: "🛡️", bg: "bg-purple-50",  border: "border-purple-200",  text: "text-purple-600"  },
    { label: "Pending Approvals", value: 12,  icon: "⏳", bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-600"   },
];

const RECENT_USERS = [
    { name: "John Smith",   role: "Admin",              status: "Active",   avatar: "bg-blue-500"    },
    { name: "Sarah Lee",    role: "Department Manager", status: "Active",   avatar: "bg-violet-500"  },
    { name: "Mike Johnson", role: "Finance Approver",   status: "Inactive", avatar: "bg-emerald-500" },
    { name: "Emily Chen",   role: "Staff / Initiator",  status: "Active",   avatar: "bg-amber-500"   },
];

const RECENT_DASHBOARDS = [
    { name: "Staff Dashboard", role: "Staff / Initiator", widgets: 5, status: "Active"  },
    { name: "Admin Overview",  role: "Admin",             widgets: 9, status: "Active"  },
    { name: "Finance View",    role: "Finance Approver",  widgets: 3, status: "Draft"   },
];

const QUICK_ACTIONS = [
    { icon: "📊", label: "Dashboard Builder", sub: "Create role-based dashboards", color: "bg-blue-600   hover:bg-blue-700"   },
    { icon: "🛡️", label: "Manage Roles",      sub: "Configure permissions",         color: "bg-purple-600 hover:bg-purple-700" },
    { icon: "👥", label: "Manage Users",      sub: "Add or edit system users",      color: "bg-emerald-600 hover:bg-emerald-700" },
];

const STATUS_COLOR: Record<string, string> = {
    Active:   "bg-emerald-100 text-emerald-700",
    Inactive: "bg-red-100     text-red-600",
    Draft:    "bg-amber-100   text-amber-700",
};

const initials = (name: string) =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

export const DashboardSuperAdmin = () => (
    <div className="space-y-6 p-0 bg-slate-50 min-h-screen">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-sm font-medium">Good morning 👋</p>
            <h2 className="text-2xl font-bold mt-1">Welcome back, Super Admin</h2>
            <p className="text-blue-200 text-sm mt-1">Here's an overview of your system today.</p>
            <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition">
                    Open Builder →
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-400 transition">
                    View Reports
                </button>
            </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map(s => (
                <div key={s.label} className={`bg-white border-2 ${s.border} rounded-2xl p-4 flex flex-col gap-3`}>
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl`}>
                        {s.icon}
                    </div>
                    <div>
                        <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
                    </div>
                    <button className={`text-xs font-semibold ${s.text} hover:underline text-left`}>
                        View all →
                    </button>
                </div>
            ))}
        </div>

        {/* Quick actions */}
        <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
                {QUICK_ACTIONS.map(q => (
                    <button key={q.label} className={`${q.color} text-white rounded-2xl p-5 text-left transition shadow-sm hover:shadow-md`}>
                        <span className="text-2xl">{q.icon}</span>
                        <p className="font-bold mt-3 text-sm">{q.label}</p>
                        <p className="text-xs opacity-75 mt-0.5">{q.sub}</p>
                    </button>
                ))}
            </div>
        </div>

        {/*Bottom panels */}
        <div className="grid grid-cols-2 gap-4">

            {/* Recent users */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Recent Users</h3>
                    <button className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                </div>
                {RECENT_USERS.map((u, i) => (
                    <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < RECENT_USERS.length - 1 ? "border-b border-slate-100" : ""}`}>
                        <div className={`w-8 h-8 rounded-full ${u.avatar} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {initials(u.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                            <p className="text-xs text-slate-400 truncate">{u.role}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[u.status]}`}>
                            {u.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Recent dashboards */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Recent Dashboards</h3>
                    <button className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                </div>
                {RECENT_DASHBOARDS.map((d, i) => (
                    <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < RECENT_DASHBOARDS.length - 1 ? "border-b border-slate-100" : ""}`}>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-base flex-shrink-0">
                            📊
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{d.name}</p>
                            <p className="text-xs text-slate-400">{d.widgets} widgets · {d.role}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[d.status]}`}>
                            {d.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);