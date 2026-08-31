import {useEffect, useState} from "react";
import {userService} from "../../service/UserService";
import {dashboardService} from "../../service/DashbaordService";
import {departmentService} from "../../service/DepartmentService";

const STATUS_COLOR: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Inactive: "bg-red-100 text-red-600",
    Draft: "bg-amber-100 text-amber-700",
};

const initials = (name: string) =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const normalizeStatus = (s: string) =>
    s?.charAt(0).toUpperCase() + s?.slice(1).toLowerCase();

export const DashboardSuperAdmin = () => {

    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentDashboards, setRecentDashboards] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [usersRes, dashboardsRes, deptRes] = await Promise.all([
                userService.getUsers(),
                dashboardService.getDashboards(),
                departmentService.getAll()
            ]);

            setRecentUsers(usersRes || []);
            setRecentDashboards(dashboardsRes || []);
            setDepartments(deptRes || []);

        } catch (err) {
            console.error("Failed to load admin dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-slate-500">
                Loading Super Admin Dashboard...
            </div>
        );
    }
    const stats = [
        {
            label: "Total Users",
            value: recentUsers.length,
            icon: "👥",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Total Dashboards",
            value: recentDashboards.length,
            icon: "📊",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Departments",
            value: departments.length,
            icon: "🏢",
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <p className="text-blue-200 text-sm">System Overview</p>
                <h2 className="text-2xl font-bold mt-1">
                    Super Admin Dashboard
                </h2>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className={`bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4`}
                    >
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center text-xl`}>
                            {s.icon}
                        </div>

                        <div>
                            <p className={`text-2xl font-bold ${s.color}`}>
                                {s.value}
                            </p>
                            <p className="text-xs text-slate-500">
                                {s.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* TWO PANELS */}
            <div className="grid grid-cols-3 gap-4">

                {/* USERS */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b">
                        <h3 className="text-sm font-bold">
                            Recent Users
                        </h3>
                    </div>

                    {recentUsers.map((u, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0"
                        >
                            <div
                                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                {initials(u.name)}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold">
                                    {u.name}
                                </p>

                            </div>

                        </div>
                    ))}
                </div>

                {/* DASHBOARDS */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b">
                        <h3 className="text-sm font-bold">
                            Recent Dashboards
                        </h3>
                    </div>

                    {recentDashboards.map((d, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0"
                        >
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                📊
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold">
                                    {d.name}
                                </p>
                            </div>

                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[normalizeStatus(d.status)]}`}>
                                {normalizeStatus(d.status)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* DEPARTMENTS */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b">
                        <h3 className="text-sm font-bold">
                            Departments
                        </h3>
                    </div>

                    {departments.length === 0 ? (
                        <div className="p-5 text-slate-400 text-sm">
                            No departments found
                        </div>
                    ) : (
                        departments.map((d, i) => (
                            <div
                                key={i}
                                className="px-5 py-3 flex justify-between border-b last:border-b-0"
                            >
                                <p className="text-sm font-semibold">
                                    {d.name}
                                </p>
                            </div>
                        ))
                    )}
                </div>

            </div>


        </div>
    );
};