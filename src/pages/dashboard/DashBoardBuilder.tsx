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

import { useEffect, useState } from "react";



import type { Dashboard } from "../../model/Dashboard.ts";

import { dashboardService } from "../../service/DashbaordService.ts";
import {DashboardCanvasPage} from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";
import {StatsBar} from "../../components/DashboardBuilderComponents/StatsBar.tsx";
import {DashboardList} from "../../components/DashboardBuilderComponents/DashboardList.tsx";
import {CreateDashboardModal} from "../../components/DashboardBuilderComponents/CreateDashboardModal.tsx";

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

    // LOAD ON PAGE OPEN
    useEffect(() => {

        loadDashboards();

    }, []);

    // FILTER
    const filtered = dashboards.filter((d) => {

        const matchSearch =
            d.name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "All"
            || d.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // CREATE NEW DASHBOARD
    const handleCreate = async (data: any) => {

        try {

            const payload = {

                name: data.name,
                description: data.description,
                role_id: data.role_id,

                status: "draft",

                widgets: [],
            };

            console.log("🚀 Creating dashboard:");
            console.log(payload);

            const savedDashboard =
                await dashboardService.saveDashboard(
                    payload
                );

            console.log("✅ Created dashboard:");
            console.log(savedDashboard);

            // reload from backend
            await loadDashboards();

            setIsModalOpen(false);

            // open editor with backend id
            setCanvasDashboard(savedDashboard);

        } catch (err) {

            console.error(
                "❌ Create dashboard failed:",
                err
            );
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

        try {

           // await dashboardService.deleteDashboard(id);

            await loadDashboards();

        } catch (err) {

            console.error(
                "❌ Delete failed:",
                err
            );
        }
    };

    // DUPLICATE
    const handleDuplicate = async (
        d: Dashboard
    ) => {

        try {

            const copyPayload = {

                name: `${d.name} (Copy)`,

                description: d.description,

                role_id: d.role_id,

                status: "draft",

                widgets: d.widgets || [],
            };

            await dashboardService.saveDashboard(
                copyPayload
            );

            await loadDashboards();

        } catch (err) {

            console.error(
                "❌ Duplicate failed:",
                err
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
            <StatsBar dashboards={dashboards} />

            {/* FILTERS */}
            <div className="flex gap-3">

                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="border p-2 rounded"
                />

                {[
                    "All",
                    "active",
                    "draft",
                    "disabled",
                ].map((s) => (

                    <button
                        key={s}
                        onClick={() =>
                            setStatusFilter(s)
                        }
                        className={`
                            px-3 py-1 border rounded
                            ${
                            statusFilter === s
                                ? "bg-blue-600 text-white"
                                : "bg-white"
                        }
                        `}
                    >
                        {s}
                    </button>
                ))}
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
                    onDuplicate={handleDuplicate}
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