import React, { useState } from "react";
import type { User } from "../../model/User";
import type { Role } from "../../model/Role";
import { UserModal } from "./UserModal";
import {userService} from "../../service/UserService.ts";
import Swal from "sweetalert2";

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

        const roleAlreadyUsed = users.some(
            u => u.role === data.role && (!editingUser || u.id !== editingUser.id)
        );

        if (roleAlreadyUsed) {
            Swal.fire("Error", "This role is already assigned to another user", "error");
            return;
        }

        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, data);

                Swal.fire("Updated!", "User updated successfully", "success");
            } else {
                await userService.createUser(data);

                Swal.fire("Created!", "User created successfully", "success");
            }

            setShowModal(false);
            setEditingUser(null);
            await reloadUsers();

        } catch (err: any) {
            console.error(err);

            Swal.fire(
                "Error",
                err?.response?.data?.error || "Server error",
                "error"
            );

        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This user will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            await userService.deleteUser(id);

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "User has been deleted successfully.",
                timer: 1500,
                showConfirmButton: false
            });

            await reloadUsers();

        } catch (err) {
            console.error("Delete failed", err);

            Swal.fire(
                "Error",
                "Failed to delete user. Please try again.",
                "error"
            );
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
                            {/*<th className="p-4 text-left">User</th>*/}
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Contact</th>
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
                                    {/*
                                    <td className="p-4 font-medium text-slate-800">
                                        {user.username}
                                    </td>*/}

                                    <td className="p-4 text-slate-600">
                                        {user.name}
                                    </td>

                                    <td className="p-4 text-slate-600">
                                        {user.email}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {user.contact_number}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(getRoleName(user.role))}`}>
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