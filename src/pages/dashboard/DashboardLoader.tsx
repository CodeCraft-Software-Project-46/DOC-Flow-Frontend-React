import { useEffect, useState } from "react";
import { dashboardService } from "../../service/DashbaordService";
import { DashboardRenderer } from "../../components/dashbaord/DashboardRenderer";
import {DashboardSuperAdmin} from "./Dashboard-SuperAdmin.tsx";


export function DashboardLoader() {

    const role_id = localStorage.getItem("role_id");
    const role_name = localStorage.getItem("role_name");

    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        setLoading(true);

        try {

            if (role_name === "Super Admin") {
                setDashboard("SUPER_ADMIN");
                return;
            }

            const res =
                await dashboardService.getActiveDashboard(role_id);

            setDashboard(res);

        } catch (err) {
            console.error("No dashboard found", err);
            setDashboard(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10">Loading dashboard...</div>;

    if (!dashboard) {
        return (
            <div className="p-10 text-red-500">
                No active dashboard for this role
            </div>
        );
    }

    //  SUPER ADMIN DASHBOARD
    if (dashboard === "SUPER_ADMIN") {
        return <DashboardSuperAdmin />;
    }

    // NORMAL ROLE DASHBOARD
    return <DashboardRenderer widgets={dashboard.widgets} />;
}