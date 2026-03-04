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
};