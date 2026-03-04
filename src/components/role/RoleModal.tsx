import React, { useState } from "react";
import { ALL_PERMISSIONS, type Role } from "../../sampleData/RolesData";

interface RoleModalProps {
    initial?: Role;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string; permissions: string[] }) => void;
}

export const RoleModal: React.FC<RoleModalProps> = ({ initial, onClose, onSubmit }) => {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);
    const [errors, setErrors] = useState<{ name?: string; permissions?: string }>({});

    const togglePermission = (perm: string) =>
        setPermissions((prev) =>
            prev.includes(perm) ? prev.filter((x) => x !== perm) : [...prev, perm]
        );

    const handleSubmit = () => {
        const e: typeof errors = {};
        if (!name.trim() || name.trim().length < 2) e.name = "Role name must be at least 2 characters.";
        if (permissions.length === 0) e.permissions = "Select at least one permission.";
        if (Object.keys(e).length) return setErrors(e);
        onSubmit({ name: name.trim(), description: description.trim(), permissions });
        onClose();
    };

    const isEdit = !!initial;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit Role" : "Create Role"}</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Define role name, description, and permissions</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Approver"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                            className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none ${
                                errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-400"
                            }`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea
                            placeholder="What this role can do"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors.permissions ? "text-red-500" : "text-slate-700"}`}>
                            Permissions <span className="text-red-500">*</span>
                        </label>
                        <div className={`grid grid-cols-2 gap-3 p-4 border rounded-xl ${errors.permissions ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
                            {ALL_PERMISSIONS.map((perm) => (
                                <label key={perm} className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={permissions.includes(perm)}
                                        onChange={() => { togglePermission(perm); setErrors((p) => ({ ...p, permissions: "" })); }}
                                        className="w-4 h-4 rounded accent-blue-600"
                                    />
                                    <span className="text-sm capitalize">{perm.replace(/_/g, " ")}</span>
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-xs text-red-500 mt-1">{errors.permissions}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold border rounded-lg text-slate-600 hover:bg-white">Cancel</button>
                    <button onClick={handleSubmit} className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        {isEdit ? "Save Changes" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};