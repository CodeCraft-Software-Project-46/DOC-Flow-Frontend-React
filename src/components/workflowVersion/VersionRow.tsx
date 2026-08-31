import React from "react";
import { StatusBadge } from "./StatusBadge";
import type { WorkflowVersion } from "../../../sampleData/WorkFlowVersionData";

interface Props {
    version: WorkflowVersion;
    isSelected: boolean;
    onToggle: () => void;
    onView: () => void;
    onDelete: () => void;
    onRollback: () => void;
}

export const VersionRow: React.FC<Props> = ({
                                                version,
                                                isSelected,
                                                onToggle,
                                                onView,
                                                onDelete,
                                                onRollback,
                                            }) => {
    return (
        <div
            className={`flex items-center gap-4 px-6 py-3.5 border-b border-slate-100 ${
                isSelected ? "bg-blue-50" : "hover:bg-slate-50"
            }`}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggle}
                className="w-4 h-4 rounded accent-blue-600"
            />
            <span className="w-14 text-sm font-bold text-slate-700">{version.version}</span>
            <div className="w-28">
                <StatusBadge status={version.status} />
            </div>
            <p className="flex-1 text-sm text-slate-500 truncate">{version.description}</p>
            <span className="text-xs text-slate-400 w-16 text-center">{version.steps.length} steps</span>
            <div className="text-right w-36">
                <p className="text-xs text-slate-600 font-medium">{version.updatedAt}</p>
                <p className="text-[10px] text-slate-400">{version.createdBy}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button onClick={onView} className="text-xs text-blue-600 hover:underline">
                    View
                </button>
                <button onClick={onRollback} className="text-xs text-green-600 hover:underline">
                    Rollback
                </button>
                <button
                    onClick={onDelete}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};