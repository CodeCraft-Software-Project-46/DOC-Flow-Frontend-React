import {ActionBadge} from "./ActionBadge.tsx";
import {StatusBadge} from "./StatusBadge.tsx";
import type {WorkflowVersion} from "../../../sampleData/WorkFlowVersionData.ts";

export function ViewModal({ version, workflowName, onClose }: {
    version: WorkflowVersion;
    workflowName: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">{workflowName}</p>
                        <h2 className="text-lg font-bold text-slate-800">Version {version.version}</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <StatusBadge status={version.status} />
                            <span className="text-xs text-slate-400">Updated {version.updatedAt}</span>
                            <span className="text-xs text-slate-400">by {version.createdBy}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none mt-1">✕</button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h3>
                        <p className="text-sm text-slate-700">{version.description}</p>
                    </div>

                    {/* Steps */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Workflow Steps ({version.steps.length})
                        </h3>
                        <div className="space-y-2">
                            {version.steps.map((step, i) => (
                                <div key={step.id} className="flex items-center gap-3">
                                    {/* Step number */}
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    {/* Connector */}
                                    <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{step.name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{step.role}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ActionBadge action={step.action} />
                                            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                                SLA: {step.sla}
                                            </span>
                                        </div>
                                    </div>
                                    {i < version.steps.length - 1 && (
                                        <div className="absolute" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-white transition text-slate-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}