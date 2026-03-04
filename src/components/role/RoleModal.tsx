import React, { useState } from "react";
import {PERMISSION_CATEGORIES} from "../../../sampleData/permissionsData.ts";


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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div
                    className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-start flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-800">{initial ? "Edit Role" : "Create Role"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 overflow-y-auto">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrors(p => ({...p, name: ""}));
                            }}
                            className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition ${
                                errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-400"
                            }`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none"
                        />
                    </div>

                    {/* Permissions */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2 ${errors.permissions ? "text-red-500" : "text-slate-700"}`}>
                            Permissions <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-4 border rounded-xl p-4 bg-slate-50 max-h-[50vh] overflow-y-auto">
                            {PERMISSION_CATEGORIES.map(({category, permissions: permsInCategory}) => (
                                <div key={category}>
                                    <p className="font-semibold text-slate-700 mb-1">{category}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {permsInCategory.map(perm => (
                                            <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions.includes(perm)}
                                                    onChange={() => {
                                                        togglePermission(perm);
                                                        setErrors(p => ({...p, permissions: ""}));
                                                    }}
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                                <span
                                                    className="text-sm text-slate-700 capitalize">{perm.replace(/_/g, " ")}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-xs text-red-500 mt-1">{errors.permissions}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose}
                            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition">
                        Cancel
                    </button>
                    <button onClick={handleSubmit}
                            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        {initial ? "Save Changes" : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
};