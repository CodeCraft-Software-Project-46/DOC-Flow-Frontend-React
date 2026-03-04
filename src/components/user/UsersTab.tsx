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

import React, { useState } from "react";
import type { Role } from "../../../sampleData/RolesData.ts";
import { UserModal } from "./UserModal.tsx";
import type {User} from "./User.ts";


interface Props {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const UsersTab: React.FC<Props> = ({ roles, setRoles }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");

    const handleSave = (data: Omit<User, "id">) => {
        if (editingUser) {
            setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...data } : u)));
            setEditingUser(null);
        } else {
            const newUser: User = { id: Date.now(), ...data };
            setUsers(prev => [...prev, newUser]);
            setRoles(prev =>
                prev.map(r => (r.id === data.role?.id ? { ...r, userCount: r.userCount + 1 } : r))
            );
        }
        setShowModal(false);
    };

    const handleDelete = (id: number) => {
        const userToDelete = users.find(u => u.id === id);
        if (!userToDelete) return;
        if (!window.confirm(`Are you sure you want to delete user "${userToDelete.username}"?`)) return;
        setUsers(prev => prev.filter(u => u.id !== id));
        setRoles(prev =>
            prev.map(r => (r.id === userToDelete.role?.id ? { ...r, userCount: r.userCount - 1 } : r))
        );
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const filteredUsers = users.filter(
        u => u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between mb-4 items-center">
                <h2 className="font-bold">Users ({users.length})</h2>
                <button
                    onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + Add User
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by username or email"
                className="w-full mb-4 px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />

            <table className="w-full bg-white rounded shadow">
                <thead>
                <tr>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan={4} className="p-2 text-center text-slate-400">No users found</td>
                    </tr>
                )}
                {filteredUsers.map(u => (
                    <tr key={u.id}>
                        <td className="p-2">{u.username}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role?.name}</td>
                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => handleEdit(u)}
                                className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(u.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <UserModal
                    roles={roles}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSave}
                    initial={editingUser || undefined}
                />
            )}
        </div>
    );
};