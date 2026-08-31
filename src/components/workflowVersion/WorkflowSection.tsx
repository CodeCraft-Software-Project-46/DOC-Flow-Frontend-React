import React, { useState } from "react";
import { VersionRow } from "./VersionRow";
import type { Workflow} from "../../../sampleData/WorkFlowVersionData";

interface Props {
    workflow: Workflow;
    selectedIds: number[];
    onToggleVersion: (id: number) => void;
    onDeleteVersion: (id: number) => void;
    onRollbackVersion: (id: number) => void;
    onViewVersion: (id: number) => void;
}

export const WorkflowSection: React.FC<Props> = ({
                                                     workflow,
                                                     selectedIds,
                                                     onToggleVersion,
                                                     onDeleteVersion,
                                                     onRollbackVersion,
                                                     onViewVersion,
                                                 }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 text-left"
            >
                <span>{expanded ? "▼" : "▶"}</span>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-800">{workflow.name}</h3>
                    <p className="text-xs text-slate-400">{workflow.department}</p>
                </div>
                <span className="text-xs text-slate-400">{workflow.totalVersions} versions</span>
            </button>

            {expanded && (
                <div className="border-t border-slate-100">
                    {workflow.versions.map((version) => (
                        <VersionRow
                            key={version.id}
                            version={version}
                            isSelected={selectedIds.includes(version.id)}
                            onToggle={() => onToggleVersion(version.id)}
                            onView={() => onViewVersion(version.id)}
                            onDelete={() => onDeleteVersion(version.id)}
                            onRollback={() => onRollbackVersion(version.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};