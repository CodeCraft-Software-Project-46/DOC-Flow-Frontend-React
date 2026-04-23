/*
import React, { useState } from "react";
import { RolesTab } from "../../components/role/RolesTab";
import { UsersTab } from "../../components/user/UsersTab";
import {type Role, SAMPLE_ROLES} from "../../../sampleData/RolesData.ts";



type TabType = "users" | "roles";

export const UserPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("roles");
    const [roles, setRoles] = useState<Role[]>(SAMPLE_ROLES);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="bg-white border-b px-6 pt-4">
                <div className="flex gap-2">
                    {(["users", "roles"] as TabType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-2 font-semibold rounded-t-lg ${
                                activeTab === key
                                    ? "bg-white border text-black"
                                    : "text-gray-500"
                            }`}
                        >
                            {key === "users" ? "👤 Users" : "🛡 Roles"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {activeTab === "roles" ? (
                    <RolesTab roles={roles} setRoles={setRoles} />
                ) : (
                    <UsersTab roles={roles} setRoles={setRoles} />
                )}
            </div>
        </div>
    );
};*/

import React, { useEffect, useState } from "react";
import { RolesTab } from "../../components/role/RolesTab";
import { UsersTab } from "../../components/user/UsersTab";

import type { Role } from "../../model/Role";
import type { User } from "../../model/User";

import { roleService } from "../../service/RoleService";
import { userService } from "../../service/UserService";

type TabType = "users" | "roles";

export const UserPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("users");

    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const data = await roleService.getAll();
            setRoles(data);
        } finally {
            setLoadingRoles(false);
        }
    };

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            const data = await userService.getUsers();
            setUsers(data);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadRoles();
        loadUsers();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="bg-white border-b px-6 pt-4 flex gap-2">
                <button onClick={() => setActiveTab("users")}>👤 Users</button>
                <button onClick={() => setActiveTab("roles")}>🛡 Roles</button>
            </div>

            <div className="p-6">

                {(loadingRoles || loadingUsers) && (
                    <p>Loading...</p>
                )}

                {activeTab === "roles" ? (
                    <RolesTab
                        roles={roles}
                        users={users}
                        setRoles={setRoles}
                        reloadRoles={loadRoles}
                    />
                ) : (
                    <UsersTab
                        users={users}
                        setUsers={setUsers}
                        roles={roles}
                        setRoles={setRoles}
                        reloadUsers={loadUsers}
                    />
                )}
            </div>
        </div>
    );
};