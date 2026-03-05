import type {WorkflowVersion} from "../../../sampleData/WorkFlowVersionData.ts";
import {StatusBadge} from "./StatusBadge.tsx";
import {ActionBadge} from "./ActionBadge.tsx";

export function CompareModal({ versionA, versionB, workflowName, onClose }: {
    versionA: WorkflowVersion;
    versionB: WorkflowVersion;
    workflowName: string;
    onClose: () => void;
}) {
    const maxSteps = Math.max(versionA.steps.length, versionB.steps.length);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
    <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{workflowName}</p>
        <h2 className="text-lg font-bold text-slate-800">
        Comparing {versionA.version} vs {versionB.version}
    </h2>
    </div>
    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
    </div>

    <div className="overflow-y-auto max-h-[75vh]">
        {/* Version headers */}
        <div className="grid grid-cols-2 gap-px bg-slate-200">
        {[versionA, versionB].map((v, i) => (
        <div key={i} className={`px-6 py-4 ${i === 0 ? "bg-blue-50" : "bg-violet-50"}`}>
    <div className="flex items-center gap-3">
    <span className={`text-xl font-bold ${i === 0 ? "text-blue-600" : "text-violet-600"}`}>
    {v.version}
    </span>
    <StatusBadge status={v.status} />
    </div>
    <p className="text-xs text-slate-500 mt-1">{v.updatedAt} · {v.createdBy}</p>
    <p className="text-xs text-slate-600 mt-1.5">{v.description}</p>
        </div>
))}
    </div>

    {/* Steps comparison */}
    <div className="p-6">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Steps Comparison</h3>
    <div className="space-y-2">
        {Array.from({ length: maxSteps }).map((_, i) => {
                const stepA = versionA.steps[i];
                const stepB = versionB.steps[i];
                const isDiff = !stepA || !stepB || stepA.name !== stepB.name || stepA.role !== stepB.role || stepA.action !== stepB.action;

                return (
                    <div key={i} className={`grid grid-cols-2 gap-3 p-3 rounded-xl ${isDiff ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-100"}`}>
                {/* Version A step */}
                <div>
                    {stepA ? (
                            <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{stepA.name}</p>
                            <p className="text-xs text-slate-400">{stepA.role}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                        <ActionBadge action={stepA.action} />
                <span className="text-xs text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full">{stepA.sla}</span>
                    </div>
                    </div>
            ) : (
                    <div className="flex items-center gap-2 opacity-40">
                    <span className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">{i + 1}</span>
                        <span className="text-xs text-slate-400 italic">No step</span>
                </div>
            )}
                </div>

                {/* Version B step */}
                <div>
                    {stepB ? (
                            <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{stepB.name}</p>
                            <p className="text-xs text-slate-400">{stepB.role}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                        <ActionBadge action={stepB.action} />
                <span className="text-xs text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full">{stepB.sla}</span>
                    </div>
                    </div>
            ) : (
                    <div className="flex items-center gap-2 opacity-40">
                    <span className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">{i + 1}</span>
                        <span className="text-xs text-slate-400 italic">No step</span>
                </div>
            )}
                </div>
                </div>
            );
            })}
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