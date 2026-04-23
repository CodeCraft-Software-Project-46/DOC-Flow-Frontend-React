/*
import React from "react";
import { type Role, SAMPLE_ROLES } from "../../../sampleData/RolesData.ts";

interface RoleCardProps {
    role: Role;
    onEdit: (r: Role) => void;
    onDelete: (r: Role) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-blue-200 transition-all duration-200">
        <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L4 7v5c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V7l-8-4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">{role.name}</h3>
                    <p className="text-xs text-slate-400">{role.userCount} user{role.userCount !== 1 ? "s" : ""}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => onEdit(role)} title="Edit role" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">✏️</button>
                <button onClick={() => onDelete(role)} title="Delete role" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑</button>
            </div>
        </div>
        <p className="text-sm text-slate-500 leading-snug">{role.description}</p>
        <div className="flex flex-wrap gap-1.5">
            {role.permissions.map((perm) => (
                <span key={perm} className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">{perm}</span>
            ))}
        </div>
    </div>
);*/

import React from "react";
import type { Role } from "../../model/Role";

interface RoleCardProps {
    role: Role;
    onEdit: (r: Role) => void;
    onDelete: (r: Role) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
                                                      role,
                                                      onEdit,
                                                      onDelete,
                                                  }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">

        {/* Header */}
        <div className="flex items-start justify-between">

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                    🔐
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-800">
                        {role.name}
                    </h3>

                    <p className="text-xs text-slate-400">
                        {role.userCount ?? 0} user
                        {(role.userCount ?? 0) !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
                <button
                    onClick={() => onEdit(role)}
                    className="p-1 hover:text-blue-600"
                >
                    ✏️
                </button>

                <button
                    onClick={() => onDelete(role)}
                    className="p-1 hover:text-red-500"
                >
                    🗑
                </button>
            </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500">
            {role.description || "No description"}
        </p>

        {/* Permissions */}
        <div className="flex flex-wrap gap-1">
            {role.permissions.map((perm) => (
                <span
                    key={perm}
                    className="text-xs bg-slate-100 px-2 py-0.5 rounded-full"
                >
                    {perm.replace(/_/g, " ")}
                </span>
            ))}
        </div>
    </div>
);