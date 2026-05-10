/*import { useState } from "react";
import type { Dashboard } from "../../model/Dashboard.ts";

import { DashboardCanvasPage } from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";
import { StatsBar } from "../../components/DashboardBuilderComponents/StatsBar.tsx";
import { DashboardList } from "../../components/DashboardBuilderComponents/DashboardList.tsx";
import { CreateDashboardModal } from "../../components/DashboardBuilderComponents/CreateDashboardModal.tsx";


export function DashBoardBuilder() {

    // ✅ typed state
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [canvasDashboard, setCanvasDashboard] = useState<Dashboard | null>(null);

    // ✅ safe filter
    const filtered = dashboards.filter(d => {
        const matchSearch =
            d.name.toLowerCase().includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "All" || d.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // ✅ create dashboard
    const handleCreate = (data: any) => {
        const newDashboard: Dashboard = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            role_id: data.role_id,
            status: "Draft",
            updatedAt: new Date().toLocaleDateString(),
            widgets: [],
        };

        setDashboards(prev => [...prev, newDashboard]);
        setIsModalOpen(false);
        setCanvasDashboard(newDashboard);
    };

    // ✅ save dashboard from canvas
    const handleSave = (savedDashboard: Dashboard) => {
        setDashboards(prev =>
            prev.map(d =>
                d.id === savedDashboard.id
                    ? {
                        ...savedDashboard,
                        updatedAt: new Date().toLocaleDateString(),
                    }
                    : d
            )
        );

        setCanvasDashboard(null);
    };

    // ✅ delete
    const handleDelete = (id: number) =>
        setDashboards(prev => prev.filter(d => d.id !== id));

    // ✅ duplicate
    const handleDuplicate = (d: Dashboard) =>
        setDashboards(prev => [
            ...prev,
            {
                ...d,
                id: Date.now(),
                name: `${d.name} (Copy)`,
                status: "Draft",
                updatedAt: new Date().toLocaleDateString(),
            },
        ]);

    // ✅ open canvas editor
    if (canvasDashboard) {
        return (
            <DashboardCanvasPage
                dashboard={canvasDashboard}
                onBack={() => setCanvasDashboard(null)}
                onSave={handleSave}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-5">

            {/!* Header *!/}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">
                        Dashboard Builder
                    </h1>
                    <p className="text-sm text-slate-500">
                        Create and manage role-based dashboards
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                    + Create Dashboard
                </button>
            </div>

            {/!* stats *!/}
            <StatsBar dashboards={dashboards} />

            {/!* filters *!/}
            <div className="flex gap-3">
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded"
                />

                {["All", "Active", "Draft", "Disabled"].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="px-3 py-1 border rounded"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/!* list *!/}
            <DashboardList
                dashboards={filtered}
                onEdit={setCanvasDashboard}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            />

            {/!* modal *!/}
            <CreateDashboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}*/

import {useEffect, useState} from "react";


import type {Dashboard} from "../../model/Dashboard.ts";

import {dashboardService} from "../../service/DashbaordService.ts";
import {DashboardCanvasPage} from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";
import {StatsBar} from "../../components/DashboardBuilderComponents/StatsBar.tsx";
import {DashboardList} from "../../components/DashboardBuilderComponents/DashboardList.tsx";
import {CreateDashboardModal} from "../../components/DashboardBuilderComponents/CreateDashboardModal.tsx";
import {roleService} from "../../service/RoleService.ts";

export function DashBoardBuilder() {

    const [dashboards, setDashboards] = useState<Dashboard[]>([]);

    const [search, setSearch] = useState<string>("");

    const [statusFilter, setStatusFilter] =
        useState<string>("All");

    const [isModalOpen, setIsModalOpen] =
        useState<boolean>(false);

    const [canvasDashboard, setCanvasDashboard] =
        useState<Dashboard | null>(null);

    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [roles, setRoles] = useState<any[]>([]);
    // LOAD ALL DASHBOARDS FROM BACKEND
    const loadDashboards = async () => {

        try {

            setLoading(true);

            const data =
                await dashboardService.getDashboards();

            console.log("✅ Loaded dashboards:");
            console.log(data);

            setDashboards(data);

        } catch (err) {

            console.error(
                "❌ Failed to load dashboards:",
                err
            );

        } finally {

            setLoading(false);
        }
    };
    const loadRoles = async () => {

        try {

            const data =
                await roleService.getAll();

            setRoles(data);

        } catch (err) {

            console.error(
                "❌ Failed to load roles",
                err
            );
        }
    };

    // LOAD ON PAGE OPEN
    useEffect(() => {

        loadDashboards();
        loadRoles();
    }, []);

    // FILTER
    // FILTER
    const filtered = dashboards.filter((d) => {

        const matchSearch =
            d.name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "All"
            || d.status === statusFilter;

        const matchRole =
            roleFilter === "All"
            || d.role_id === roleFilter;

        return (
            matchSearch &&
            matchStatus &&
            matchRole
        );
    });

    const handleCreate = async (data: any) => {

        try {

            const payload = {
                name: data.name,
                description: data.description,
                role_id: data.role_id,
                status: "draft"
            };

            const res = await dashboardService.saveDashboard(payload);

            console.log("✅ Dashboard created:", res);

            // create local dashboard object for editor
            const newDashboard = {
                id: res.dashboard_id,
                ...payload,
                widgets: []
            };

            // open canvas editor
            setCanvasDashboard(newDashboard);

            await loadDashboards();

        } catch (err) {
            console.error("❌ Create failed:", err);
        }
    };

    // SAVE DASHBOARD
    const handleSave = async (
        savedDashboard: Dashboard
    ) => {

        try {

            console.log(
                "🚀 Updating dashboard:"
            );

            console.log(savedDashboard);

            await dashboardService.saveDashboard(
                savedDashboard
            );

            console.log("✅ Dashboard updated");

            // reload latest dashboards
            await loadDashboards();

            setCanvasDashboard(null);

        } catch (err) {

            console.error(
                "❌ Update failed:",
                err
            );
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {



    };

    const handleChangeStatus = async (
        id: number,
        status: string
    ) => {

        try {

            const res =
                await dashboardService.changeDashboardStatus(
                    id,
                    status
                );

            setDashboards(prev =>
                prev.map(d =>
                    d.id === id
                        ? {...d, status}
                        : d
                )
            );

            alert(res.message);
            loadDashboards()

        } catch (err: any) {

            // ✅ backend error message
            alert(
                err?.error ||
                "Failed to change status"
            );
        }

    };

    // OPEN CANVAS
    if (canvasDashboard) {

        return (
            <DashboardCanvasPage
                dashboard={canvasDashboard}
                onBack={() =>
                    setCanvasDashboard(null)
                }
                onSave={handleSave}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-xl font-bold text-slate-800">
                        Dashboard Builder
                    </h1>

                    <p className="text-sm text-slate-500">
                        Create and manage role-based dashboards
                    </p>
                </div>

                <button
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                >
                    + Create Dashboard
                </button>
            </div>

            {/* STATS */}
            <StatsBar dashboards={dashboards}/>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 items-center">

                {/* SEARCH */}
                <input
                    placeholder="Search dashboards..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
            border
            px-3 py-2
            rounded-lg
            bg-white
            text-sm
            shadow-sm
            w-60
        "
                />

                {/* STATUS FILTER */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="
            border
            px-3 py-2
            rounded-lg
            bg-white
            text-sm
            shadow-sm
            min-w-[140px]
        "
                >
                    <option value="All">
                        All Status
                    </option>
                    <option value="active">
                        Active
                    </option>
                    <option value="draft">
                        Draft
                    </option>
                    <option value="disabled">
                        Disabled
                    </option>
                </select>

                {/* ROLE FILTER */}
                <select
                    value={roleFilter}
                    onChange={(e) =>
                        setRoleFilter(e.target.value)
                    }
                    className="
              border
        px-3 py-2
        rounded-lg
        bg-white
        text-sm
        text-slate-800
        shadow-sm
        min-w-[160px]
        "
                >
                    <option value="All">
                        All Roles
                    </option>

                    {roles.map((role) => (
                        <option
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </option>
                    ))}
                </select>

            </div>

            {/* LOADING */}
            {loading ? (

                <div className="text-center py-10 text-slate-500">
                    Loading dashboards...
                </div>

            ) : (

                <DashboardList
                    dashboards={filtered}
                    onEdit={setCanvasDashboard}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                />
            )}

            {/* MODAL */}
            <CreateDashboardModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
                onSubmit={handleCreate}
            />
        </div>
    );
}