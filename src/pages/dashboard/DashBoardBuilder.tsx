import React, { useState } from "react";
import DashboardStats from "../../components/DashboardBuilderComponents/DashboardStats";
import { DashboardList } from "../../components/DashboardBuilderComponents/DashboardList";
import { DashboardFilters } from "../../components/DashboardBuilderComponents/DashboardFilter";
import { CreateDashboardModal } from "../../components/DashboardBuilderComponents/CreateDashboardModal";
import DashboardCanvasPage from "../../components/DashboardBuilderComponents/DashboardCanvasPage.tsx";


export interface Dashboard {
    id: number;
    name: string;
    description: string;
    role: string;
    widgets: number;
    status: "Active" | "Draft" | "Disabled";
    updatedAt: string;
}

export const DashBoardBuilder: React.FC = () => {
    const [dashboards, setDashboards] = useState<Dashboard[]>([
        {
            id: 1,
            name: "Staff Dashboard",
            description: "Default dashboard for staff",
            role: "Staff / Initiator",
            widgets: 6,
            status: "Active",
            updatedAt: "2/19/2026",
        },
    ]);

    const [search, setSearch]               = useState("");
    const [status, setStatus]               = useState("All");
    const [isModalOpen, setIsModalOpen]     = useState(false);
    const [canvasDashboard, setCanvasDashboard] = useState<Dashboard | null>(null);

    const filteredDashboards = dashboards.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "All" || d.status === status;
        return matchesSearch && matchesStatus;
    });

    const handleCreateDashboard = (data: {
        name: string;
        description: string;
        roles: string[];
    }) => {
        const newDashboard: Dashboard = {
            id: Date.now(),
            name: data.name,
            description: data.description,
            role: data.roles.join(", "),
            widgets: 0,
            status: "Draft",
            updatedAt: new Date().toLocaleDateString(),
        };

        setDashboards((prev) => [...prev, newDashboard]);
        setIsModalOpen(false);
        setCanvasDashboard(newDashboard);
    };


    const handleEdit = (dashboard:any) => {
        setCanvasDashboard(dashboard);
    };
    const handleBack = () => {
        setCanvasDashboard(null);
    };

    if (canvasDashboard) {

        return (
            <DashboardCanvasPage
                dashboard={canvasDashboard}
                onBack={handleBack}
                onSave={(savedDashboard) => {
                    console.log("Dashboard saved in parent:", savedDashboard);
                }}
            />
        );
    }


    return (
        <div className=" bg-gray-50 min-h-screen space-y-6">
            <div className="flex justify-between items-center">
                <DashboardFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Dashboard
                </button>
            </div>

            <DashboardStats dashboards={filteredDashboards} />

            <DashboardList
                dashboards={filteredDashboards}
                onEdit={handleEdit}
                onView={() => {}}
                onDuplicate={() => {}}
                onDelete={() => {}}
                onDownload={() => {}}
            />

            <CreateDashboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateDashboard}
            />
        </div>
    );
};