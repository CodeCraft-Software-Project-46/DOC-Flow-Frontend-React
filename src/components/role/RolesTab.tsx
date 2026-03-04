import React, { useState } from "react";
import { type Role, SAMPLE_ROLES } from "../../../sampleData/RolesData.ts";

import { DeleteRoleModal } from "./DeleteRoleModal";
import {RoleCard} from "./RoleCard.tsx";
import {RoleModal} from "./RoleModal.tsx";


export const RolesTab: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(SAMPLE_ROLES);
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<Role | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
    const [search, setSearch] = useState("");

    const filtered = roles.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = (data: { name: string; description: string; permissions: string[] }) => setRoles(prev => [...prev, { id: Date.now(), userCount: 0, ...data }]);
    const handleEdit = (data: { name: string; description: string; permissions: string[] }) => editTarget && setRoles(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...data } : r));
    const handleDelete = () => deleteTarget && setRoles(prev => prev.filter(r => r.id !== deleteTarget.id));

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-500 font-medium">{roles.length} role{roles.length !== 1 ? "s" : ""} configured</p>
                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 placeholder-slate-400 text-slate-700 bg-white w-56"
                    />
                </div>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">
                    + Create Role
                </button>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                    <p className="text-3xl mb-3">🛡️</p>
                    <p className="text-sm font-semibold text-slate-500">No roles found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(role => <RoleCard key={role.id} role={role} onEdit={setEditTarget} onDelete={setDeleteTarget} />)}
                </div>
            )}

            {showCreate && <RoleModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
            {editTarget && <RoleModal initial={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEdit} />}
            {deleteTarget && <DeleteRoleModal role={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
        </>
    );
};