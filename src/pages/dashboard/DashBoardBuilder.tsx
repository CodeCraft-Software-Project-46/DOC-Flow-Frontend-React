import {useEffect, useState} from "react";
import type {Dashboard} from "../../model/Dashboard.ts";
import {dashboardService} from "../../service/DashbaordService.ts";
import {DashboardCanvasPage} from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";
import {StatsBar} from "../../components/DashboardBuilderComponents/StatsBar.tsx";
import {DashboardList} from "../../components/DashboardBuilderComponents/DashboardList.tsx";
import {CreateDashboardModal} from "../../components/DashboardBuilderComponents/CreateDashboardModal.tsx";
import {roleService} from "../../service/RoleService.ts";
import Swal from "sweetalert2";

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

    // to load data from backend
    const loadDashboards = async () => {

        try {
            setLoading(true);
            const data =
                await dashboardService.getDashboards();

            console.log("Loaded dashboards:");
            console.log(data);
            setDashboards(data);

        } catch (err) {
            console.error(
                "Failed to load dashboards:",
                err
            );

        } finally {
            setLoading(false);
        }
    };

    //to load data for role selector
    const loadRoles = async () => {
        try {
            const data =
                await roleService.getAll();

            setRoles(data);

        } catch (err) {
            console.error(
                "Failed to load roles",
                err
            );
        }
    };

    // loading
    useEffect(() => {
        loadDashboards();
        loadRoles();
    }, []);

    // filter
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

            console.log("Dashboard created:", res);

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
            console.error("Create failed:", err);
        }
    };

    // DELETE
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this dashboard!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await dashboardService.deleteDashboard(id);

            await loadDashboards();

            Swal.fire({
                title: "Deleted!",
                text: "Dashboard has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err?.error || "Delete failed",
                icon: "error",
            });
        }
    };


    const handleChangeStatus = async (
        id: number,
        status: string
    ) => {

        const result = await Swal.fire({
            title: "Change Dashboard Status?",
            text: `Are you sure you want to change status to "${status}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, change it",
        });

        if (!result.isConfirmed) return;

        try {

            const res =
                await dashboardService.changeDashboardStatus(
                    id,
                    status
                );

            await loadDashboards();

            Swal.fire({
                title: "Success!",
                text: res.message,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (err: any) {

            Swal.fire({
                title: "Error!",
                text:
                    err?.error ||
                    "Failed to change status",
                icon: "error",
            });
        }

    };

    // if canvas object hv, then load dashboard canvas page
    if (canvasDashboard) {

        return (
            <DashboardCanvasPage
                dashboard={canvasDashboard}
                onBack={() =>
                    setCanvasDashboard(null)
                }
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-5">

            {/* header */}
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

            {/* to show statistics */}
            <StatsBar dashboards={dashboards}/>

            {/* filtering system */}
            <div className="flex flex-wrap gap-3 items-center">

                {/* to search dashaboard*/}
                <input
                    placeholder="Search dashboards..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg bg-white text-sm shadow-sm w-60"
                />

                {/* for selecting status */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg bg-white text-sm shadow-sm min-w-[140px]"
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

                {/* for selecting role  */}
                <select
                    value={roleFilter}
                    onChange={(e) =>
                        setRoleFilter(e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg bg-white text-sm text-slate-800 shadow-sm min-w-[160px]"

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

            {/* for show status  */}
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

            {/* for create initial dashboard object  */}
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