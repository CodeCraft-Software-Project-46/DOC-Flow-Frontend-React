import React from "react";
import type {Dashboard} from "../../model/Dashboard.ts";




interface Props {
    dashboards: Dashboard[];
}

const DashboardStats: React.FC<Props> = ({ dashboards }) => {
    const total = dashboards.length;
    const active = dashboards.filter((d) => d.status === "Active").length;
    const draft = dashboards.filter((d) => d.status === "Draft").length;
    const disabled = dashboards.filter((d) => d.status === "Disabled").length;

    const StatCard = ({ label, value }: any) => (
        <div className="bg-white shadow rounded-xl p-4 w-full">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );

    return (
        <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Dashboards" value={total} />
            <StatCard label="Active" value={active} />
            <StatCard label="Draft" value={draft} />
            <StatCard label="Disabled" value={disabled} />
        </div>
    );
};

export default DashboardStats;