/*
import React, { useState } from "react";
import { PERMISSION_CATEGORIES } from "../../../sampleData/permissionsData.ts";
import type { Role } from "../../../sampleData/RolesData.ts";
import {useDispatch, useSelector,} from "react-redux";
import type {AppDispatch, RootState} from "../../store/store.ts";


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

    const dispatch=useDispatch<AppDispatch>();

    const {permissions:permissionList,loading}=useSelector((state:RootState)=>state.permissions);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-auto">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/!* Header *!/}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-start flex-shrink-0">
                    <h2 className="text-lg font-bold text-slate-800">{initial ? "Edit Role" : "Create Role"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
                </div>

                {/!* Body *!/}
                <div className="px-6 py-5 space-y-5 overflow-y-auto">
                    {/!* Role Name *!/}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                            className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition ${
                                errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-400"
                            }`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/!* Description *!/}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 resize-none"
                        />
                    </div>

                    {/!* Permissions *!/}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${errors.permissions ? "text-red-500" : "text-slate-700"}`}>
                            Permissions <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-4 border rounded-xl p-4 bg-slate-50 max-h-[50vh] overflow-y-auto">
                            {PERMISSION_CATEGORIES.map(({ category, permissions: permsInCategory }) => (
                                <div key={category}>
                                    <p className="font-semibold text-slate-700 mb-1">{category}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {permsInCategory.map((perm) => (
                                            <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions.includes(perm)}
                                                    onChange={() => { togglePermission(perm); setErrors(p => ({ ...p, permissions: "" })); }}
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                                <span className="text-sm text-slate-700 capitalize">{perm.replace(/_/g, " ")}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <p className="text-xs text-red-500 mt-1">{errors.permissions}</p>}
                    </div>
                </div>

                {/!* Footer *!/}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {initial ? "Save Changes" : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
};*/


import React, { useEffect, useMemo, useState } from "react";
import { permissionService } from "../../service/PermissionService";


interface RoleModalProps {
    initial?: any;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => Promise<void> | void;
}

export const RoleModal: React.FC<RoleModalProps> = ({
                                                        initial,
                                                        onClose,
                                                        onSubmit,
                                                    }) => {

    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [permissions, setPermissions] = useState<string[]>(
        initial?.permissions ?? []
    );

    const [permissionList, setPermissionList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // ✅ LOAD PERMISSIONS
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await permissionService.getAll();
            setPermissionList(data);
            setLoading(false);
        };
        load();
    }, []);

    // ✅ GROUP BY CATEGORY (FIX 1)
    const groupedPermissions = useMemo(() => {
        return permissionList.reduce((acc: Record<string, any[]>, perm) => {
            const cat = perm.category || "Other";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(perm);
            return acc;
        }, {});
    }, [permissionList]);

    const togglePermission = (perm: string) => {
        setPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            setError("");

            if (!name.trim()) {
                setError("Role name required");
                return;
            }

            const payload = {
                name: name.trim(),
                description: description.trim(),
                permissions,
            };

            await onSubmit(payload);

            onClose();
        } catch (e) {
            setError("Failed to save role");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-5">

                <h2 className="text-lg font-bold mb-4">
                    {initial ? "Edit Role" : "Create Role"}
                </h2>

                <input
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Role name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="w-full border p-2 rounded mb-3"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* PERMISSIONS */}
                <div className="border p-3 rounded bg-gray-50 max-h-60 overflow-y-auto">

                    {loading && <p>Loading permissions...</p>}

                    {Object.entries(groupedPermissions).map(
                        ([category, perms]: any) => (
                            <div key={category} className="mb-4">

                                <p className="font-semibold text-gray-700 mb-1">
                                    {category}
                                </p>

                                {perms.map((perm: any) => (
                                    <label
                                        key={perm.permission_id}
                                        className="flex items-center gap-2 py-1 pl-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={permissions.includes(
                                                perm.permission_name
                                            )}
                                            onChange={() =>
                                                togglePermission(
                                                    perm.permission_name
                                                )
                                            }
                                        />
                                        <span className="text-sm">
                                            {perm.permission_name.replace(/_/g, " ")}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose}>Cancel</button>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {saving ? "Saving..." : initial ? "Update" : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
};