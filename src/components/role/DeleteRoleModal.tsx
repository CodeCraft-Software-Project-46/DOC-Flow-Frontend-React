import React from "react";
import { type Role } from "../../sampleData/RolesData";

interface DeleteRoleModalProps {
    role: Role;
    onConfirm: () => void;
    onClose: () => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({ role, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-red-500 text-xl">🗑</span>
                </div>
                <h2 className="text-base font-bold text-slate-800 mb-1">Delete "{role.name}"?</h2>
                <p className="text-sm text-slate-500">
                    This role is assigned to <strong>{role.userCount} user{role.userCount !== 1 ? "s" : ""}</strong>. Deleting it cannot be undone.
                </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border rounded-lg text-slate-600 hover:bg-white">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
        </div>
    </div>
);