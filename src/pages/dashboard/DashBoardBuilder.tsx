import { useState } from "react";
import {DashboardCanvasPage} from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";
import {StatsBar} from "../../components/DashboardBuilderComponents/StatsBar.tsx";
import {DashboardList} from "../../components/DashboardBuilderComponents/DashboardList.tsx";
import {CreateDashboardModal} from "../../components/DashboardBuilderComponents/CreateDashboardModal.tsx";


const INITIAL_DASHBOARDS = [
    {
        id: 1,
        name: "Staff Dashboard",
        description: "Default dashboard for staff members",
        role: "Staff / Initiator",
        status: "Active",
        updatedAt: "2/19/2026",
        widgets: [],
    },
    {
        id: 2,
        name: "Admin Overview",
        description: "Full system overview for administrators",
        role: "Admin",
        status: "Draft",
        updatedAt: "3/1/2026",
        widgets: [],
    },
];

export function DashBoardBuilder() {
    const [dashboards,      setDashboards]      = useState(INITIAL_DASHBOARDS);
    const [search,          setSearch]          = useState("");
    const [statusFilter,    setStatusFilter]    = useState("All");
    const [isModalOpen,     setIsModalOpen]     = useState(false);
    const [canvasDashboard, setCanvasDashboard] = useState(null);

    const filtered = dashboards.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || d.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleCreate = (data) => {
        const newD = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            role: data.role,
            status: "Draft",
            updatedAt: new Date().toLocaleDateString(),
            widgets: [],
        };
        setDashboards(prev => [...prev, newD]);
        setIsModalOpen(false);
        setCanvasDashboard(newD);
    };

    const handleSave = (savedDashboard) => {
        setDashboards(prev =>
            prev.map(d =>
                d.id === savedDashboard.id
                    ? { ...savedDashboard, updatedAt: new Date().toLocaleDateString() }
                    : d
            )
        );
        setCanvasDashboard(null);
    };

    const handleDelete = (id) => setDashboards(prev => prev.filter(d => d.id !== id));

    const handleDuplicate = (d) =>
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

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Dashboard Builder</h1>
                    <p className="text-sm text-slate-500">Create and manage role-based dashboards</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                    + Create Dashboard
                </button>
            </div>

            {/* Stats */}
            <StatsBar dashboards={dashboards} />

            {/* Filters */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search dashboards..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 max-w-xs border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
                />
                <div className="flex gap-1">
                    {["All", "Active", "Draft", "Disabled"].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                statusFilter === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <DashboardList
                dashboards={filtered}
                onEdit={setCanvasDashboard}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            />

            {/* Modal */}
            <CreateDashboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}