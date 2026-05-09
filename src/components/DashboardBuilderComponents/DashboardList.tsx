/*
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

                    {/!* actions *!/}
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

*/

import {StatusBadge} from "./StatusBadge.tsx";


export function DashboardList({ dashboards, onEdit, onDelete, onDuplicate }) {
    if (dashboards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-slate-500 font-semibold">No dashboards yet</p>
                <p className="text-slate-400 text-sm mt-1">Click "+ Create Dashboard" to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {dashboards.map(d => (
                <div
                    key={d.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                    {/* Left info */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                            📊
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-800">{d.name}</h3>
                                <StatusBadge status={d.status} />
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{d.description}</p>
                        {/*    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span>👤 {d.role}</span>
                                <span>•</span>
                                <span>🧩 {d.widgets?.length ?? 0} widgets</span>
                                <span>•</span>
                                <span>🕒 {d.updatedAt}</span>
                            </div>*/}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                            onClick={() => onEdit(d)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={() => onDuplicate(d)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                        >
                            📄 Dupe
                        </button>
                        <button
                            onClick={() => onDelete(d.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                        >
                            🗑 Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}