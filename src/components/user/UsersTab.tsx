/*
import React, { useState } from "react";


import type {Role} from "../../../sampleData/RolesData.ts";
import {type User, UserModal} from "./UserModal.tsx";

interface Props {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const UsersTab: React.FC<Props> = ({ roles, setRoles }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);

    const handleAdd = (data: Omit<User, "id">) => {
        setUsers(prev => [...prev, { id: Date.now(), ...data }]);

        // increase role userCount
        setRoles(prev =>
            prev.map(r =>
                r.id === data.role.id
                    ? { ...r, userCount: r.userCount + 1 }
                    : r
            )
        );

        setShowModal(false);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="font-bold">Users ({users.length})</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + Add User
                </button>
            </div>

            <table className="w-full bg-white rounded shadow">
                <thead>
                <tr>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td className="p-2">{u.username}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <UserModal
                    roles={roles}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAdd}
                />
            )}
        </div>
    );
};*/
/*

import React, { useState } from "react";

import { UserModal } from "./UserModal";

import type {Role} from "../../../sampleData/RolesData.ts";
import type {User} from "../../model/User.ts";

interface Props {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const UsersTab: React.FC<Props> = ({ roles, setRoles }) => {
    const [users,       setUsers]       = useState<User[]>([]);
    const [showModal,   setShowModal]   = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [search,      setSearch]      = useState("");
    const [roleFilter,  setRoleFilter]  = useState("All");


    const handleSave = (data: Omit<User, "id">) => {
        if (editingUser) {
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
            setEditingUser(null);
        } else {
            setUsers(prev => [...prev, { id: Date.now(), ...data }]);
            setRoles(prev =>
                prev.map(r => r.id === data.role?.id ? { ...r, userCount: r.userCount + 1 } : r)
            );
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        const u = users.find(u => u.id === id);
        if (!u || !window.confirm(`Delete user "${u.username}"?`)) return;
        setUsers(prev => prev.filter(u => u.id !== id));
        setRoles(prev =>
            prev.map(r => r.id === u.role?.id ? { ...r, userCount: r.userCount - 1 } : r)
        );
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    // Filter
    const filtered = users.filter(u => {
        const matchSearch =
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "All" || u.role?.name === roleFilter;
        return matchSearch && matchRole;
    });

    // Status badge colour
    const roleBadge = (roleName?: string) => {
        const colors: Record<string, string> = {
            "Admin":               "bg-purple-100 text-purple-700",
            "Department Manager":  "bg-blue-100 text-blue-700",
            "Finance Approver":    "bg-emerald-100 text-emerald-700",
            "Procurement Officer": "bg-amber-100 text-amber-700",
            "Legal Reviewer":      "bg-rose-100 text-rose-700",
            "Viewer":              "bg-slate-100 text-slate-600",
            "Staff / Initiator":   "bg-cyan-100 text-cyan-700",
        };
        return colors[roleName ?? ""] ?? "bg-slate-100 text-slate-600";
    };

    // avatar initials
    const initials = (name: string) =>
        name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    const avatarBg = [
        "bg-blue-500", "bg-emerald-500", "bg-violet-500",
        "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-pink-500",
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-800">
                        Users
                        <span className="ml-2 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {users.length}
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {filtered.length !== users.length
                            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} shown`
                            : "Manage system users and their roles"}
                    </p>
                </div>

                {/!* search filter add *!/}
                <div className="flex items-center gap-2 flex-wrap">

                    {/!* search*!/}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name or email..."
                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white w-52 transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/!* dropdown *!/}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
                            👤
                        </span>
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white appearance-none cursor-pointer transition"
                        >
                            <option value="All">All Roles</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▾</span>
                    </div>

                    {/!* add btn *!/}
                    <button
                        onClick={() => { setEditingUser(null); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm flex-shrink-0"
                    >
                        <span className="text-base leading-none">+</span> Add User
                    </button>
                </div>
            </div>

            {/!* stats cards*!/}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
                {[
                    { label: "Total",  value: users.length,                              color: "bg-slate-100 text-slate-700" },
                    { label: "Active", value: users.length,                              color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
                    { label: "Roles",  value: [...new Set(users.map(u => u.role?.name))].filter(Boolean).length, color: "bg-blue-50 text-blue-700 border border-blue-200" },
                ].map(s => (
                    <span key={s.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.color}`}>
                        {s.value} {s.label}
                    </span>
                ))}
            </div>

            {/!* table*!/}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <p className="text-3xl mb-3">👥</p>
                    <p className="text-sm font-semibold text-slate-500">
                        {users.length === 0 ? "No users yet" : "No users match your filters"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        {users.length === 0
                            ? "Click \"+ Add User\" to get started"
                            : "Try adjusting your search or role filter"}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/!* table header *!/}
                    <div className="grid grid-cols-[2fr_2.5fr_1.5fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>User</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span className="text-right pr-1">Actions</span>
                    </div>

                    {/!* row *!/}
                    {filtered.map((u, idx) => (
                        <div
                            key={u.id}
                            className={`grid grid-cols-[2fr_2.5fr_1.5fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-blue-50/40 transition-colors ${
                                idx !== filtered.length - 1 ? "border-b border-slate-100" : ""
                            }`}
                        >
                            {/!* pp *!/}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-full ${avatarBg[idx % avatarBg.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                    {initials(u.username)}
                                </div>
                                <span className="text-sm font-semibold text-slate-800 truncate">{u.username}</span>
                            </div>

                            {/!* email *!/}
                            <span className="text-sm text-slate-500 truncate">{u.email}</span>

                            {/!* role *!/}
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${roleBadge(u.role?.name)}`}>
                                {u.role?.name ?? "—"}
                            </span>

                            {/!* actions *!/}
                            <div className="flex items-center gap-1.5 justify-end">
                                <button
                                    onClick={() => handleEdit(u)}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/!* add modal *!/}
            {showModal && (
                <UserModal
                    roles={roles}
                    initial={editingUser ?? undefined}
                    onClose={() => { setShowModal(false); setEditingUser(null); }}
                    onSubmit={handleSave}
                />
            )}
        </>
    );
};*/

import React, { useState } from "react";
import type { User } from "../../model/User";
import type { Role } from "../../model/Role";
import { UserModal } from "./UserModal";
import {userService} from "../../service/UserService.ts";

interface Props {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    reloadUsers: () => Promise<void>;
}

export const UsersTab: React.FC<Props> = ({
                                              users,
                                              roles,
                                              reloadUsers
                                          }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const getRoleName = (roleId: string | null) =>
        roles.find(r => r.id === roleId)?.name ?? "—";

    const getRoleBadge = (name: string) => {
        const colors: Record<string, string> = {
            Admin: "bg-purple-100 text-purple-700",
            Viewer: "bg-slate-100 text-slate-600",
            Default: "bg-blue-100 text-blue-700"
        };
        return colors[name] || colors.Default;
    };

    const handleSave = async (data: any) => {
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, data);
            } else {
                await userService.createUser(data);
            }

            setShowModal(false);
            setEditingUser(null);

            //refresh from parent
            await reloadUsers();

        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Delete this user?");
        if (!ok) return;

        try {
            await userService.deleteUser(id);
            await reloadUsers();

        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="space-y-4">


            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Users
                        <span className="ml-2 text-sm text-slate-500">
                            ({users.length})
                        </span>
                    </h2>
                    <p className="text-sm text-slate-400">
                        Manage system users and their roles
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
                >
                    + Add User
                </button>
            </div>


            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-slate-50 transition"
                                >

                                    <td className="p-4 font-medium text-slate-800">
                                        {user.username}
                                    </td>

                                    <td className="p-4 text-slate-600">
                                        {user.name}
                                    </td>

                                    <td className="p-4 text-slate-600">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(getRoleName(user.role))}`}>
                                            {getRoleName(user.role)}
                                        </span>
                                    </td>

                                    <td className="p-4 flex gap-2">

                                        <button
                                            onClick={() => {
                                                setEditingUser(user);
                                                setShowModal(true);
                                            }}
                                            className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}

                        </tbody>

                    </table>
                </div>
            </div>


            {showModal && (
                <UserModal
                    initial={editingUser ?? undefined}
                    onClose={() => {
                        setShowModal(false);
                        setEditingUser(null);
                    }}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
};