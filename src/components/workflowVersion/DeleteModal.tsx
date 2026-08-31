import type {WorkflowVersion} from "../../../sampleData/WorkFlowVersionData.ts";
import {StatusBadge} from "./StatusBadge.tsx";

export function DeleteModal({ selected, onConfirm, onClose }: {
    selected: WorkflowVersion[];
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-red-500 text-xl">🗑</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Delete {selected.length > 1 ? `${selected.length} Versions` : "Version"}</h2>
                    <p className="text-sm text-slate-500 mb-4">
                        You are about to permanently delete the following version{selected.length > 1 ? "s" : ""}. This action cannot be undone.
                    </p>
                    <ul className="space-y-2">
                        {selected.map((v) => (
                            <li key={v.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <span className="text-sm font-bold text-red-600">{v.version}</span>
                                <StatusBadge status={v.status} />
                                <span className="text-xs text-slate-400 ml-auto">{v.updatedAt}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg hover:bg-white transition text-slate-600">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}