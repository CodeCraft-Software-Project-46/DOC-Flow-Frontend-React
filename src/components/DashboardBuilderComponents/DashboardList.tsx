import React from "react";
import {type Dashboard} from "../../pages/dashboard/DashboardBuilder.tsx";

interface Props {
    dashboards: Dashboard[];
    onEdit: (id: number) => void;
    onView: (id: number) => void;
    onDuplicate: (dashboard: Dashboard) => void;
    onDelete: (id: number) => void;
    onDownload: (id: number) => void;
}



export const DashboardList: React.FC<Props> = ({
                                                   dashboards,
                                                   onEdit,
                                                   onView,
                                                   onDuplicate,
                                                   onDelete,
                                                   onDownload,

                                               }) => {
    return (
        <div className="space-y-4">
            {dashboards.map((dashboard) => (
                <div
                    key={dashboard.id}
                    className="bg-white shadow rounded-xl p-5 flex justify-between items-center"
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">{dashboard.name}</h2>

                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    dashboard.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : dashboard.status === "Draft"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-200 text-gray-600"
                                }`}
                            >
                {dashboard.status}
              </span>

                            {dashboard.isDefault && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  Default
                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            {dashboard.description}
                        </p>

                        <div className="text-sm text-gray-400 mt-2">
                            {dashboard.widgets} widgets • Updated {dashboard.updatedAt}
                        </div>
                    </div>

                    {/* actions */}
                    <div className="flex gap-3 text-gray-500">
                        <button onClick={() => onEdit(dashboard.id)}>✏️</button>
                        <button onClick={() => onView(dashboard.id)}>👁</button>
                        <button onClick={() => onDuplicate(dashboard)}>📄</button>
                        <button onClick={() => onDownload(dashboard.id)}>⬇️</button>
                        <button
                            onClick={() => onDelete(dashboard.id)}
                            className="text-red-500"
                        >
                            🗑
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

