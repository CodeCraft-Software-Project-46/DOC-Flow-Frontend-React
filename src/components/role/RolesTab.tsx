/*
import React, { useState } from "react";
import { type Role } from "../../../sampleData/RolesData";
import { RoleModal } from "./RoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleCard } from "./RoleCard";

interface Props {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const RolesTab: React.FC<Props> = ({ roles, setRoles }) => {
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<Role | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

    const handleCreate = (data: Omit<Role, "id" | "userCount">) => {
        setRoles(prev => [...prev, { id: Date.now(), userCount: 0, ...data }]);
        setShowCreate(false);
    };

    const handleEdit = (data: Omit<Role, "id" | "userCount">) => {
        if (!editTarget) return;
        setRoles(prev =>
            prev.map(r => r.id === editTarget.id ? { ...r, ...data } : r)
        );
        setEditTarget(null);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setRoles(prev => prev.filter(r => r.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <>
            <div className="flex justify-between mb-4">
                <h2 className="font-bold">Roles ({roles.length})</h2>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + Create Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(role => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={setEditTarget}
                        onDelete={setDeleteTarget}
                    />
                ))}
            </div>

            {showCreate && (
                <RoleModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />
            )}

            {editTarget && (
                <RoleModal
                    initial={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSubmit={handleEdit}
                />
            )}

            {deleteTarget && (
                <DeleteRoleModal
                    role={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};*/

import React, { useEffect, useState } from "react";
import { RoleModal } from "./RoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleCard } from "./RoleCard";
import { roleService } from "../../service/RoleService";

import type { Role } from "../../model/Role";

export const RolesTab: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<Role | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

    // ✅ LOAD ALL ROLES
    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getAll();
            setRoles(data);
        } catch (err) {
            console.error("Failed to load roles", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    // ✅ CREATE ROLE
    const handleCreate = async (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => {
        try {
            await roleService.create(data);
            await loadRoles();
            setShowCreate(false);
        } catch (err) {
            console.error("Create failed", err);
        }
    };

    // ✅ UPDATE ROLE
    const handleEdit = async (data: {
        name: string;
        description: string;
        permissions: string[];
    }) => {
        if (!editTarget) return;

        try {
            await roleService.update(editTarget.id, data);
            await loadRoles();
            setEditTarget(null);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    // ✅ DELETE ROLE
    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            await roleService.delete(deleteTarget.id);
            await loadRoles();
        } catch (err) {
            console.error("Delete failed", err);
        }

        setDeleteTarget(null);
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between mb-4">
                <h2 className="font-bold">
                    Roles ({roles.length})
                </h2>

                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + Create Role
                </button>
            </div>

            {/* Loading */}
            {loading && <p>Loading roles...</p>}

            {/* Role List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={setEditTarget}
                        onDelete={setDeleteTarget}
                    />
                ))}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <RoleModal
                    onClose={() => setShowCreate(false)}
                    onSubmit={handleCreate} // ✅ FIXED
                />
            )}

            {/* Edit Modal */}
            {editTarget && (
                <RoleModal
                    initial={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSubmit={handleEdit} // ✅ FIXED
                />
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <DeleteRoleModal
                    role={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};