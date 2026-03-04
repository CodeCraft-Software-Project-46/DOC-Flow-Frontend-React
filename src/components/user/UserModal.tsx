/*
import React, { useState } from "react";
import type {Role} from "../../sampleData/RolesData.ts";


export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role | null;
}

interface UserModalProps {
    initial?: User;
    onClose: () => void;
    onSubmit: (user: Omit<User, "id">) => void;
    roles: Role[];
}

export const UserModal: React.FC<UserModalProps> = ({ initial, onClose, onSubmit, roles }) => {
    const [username, setUsername] = useState(initial?.username ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [password, setPassword] = useState(initial?.password ?? "");
    const [role, setRole] = useState<Role | null>(initial?.role ?? null);
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

    const handleSubmit = () => {
        const e: typeof errors = {};
        if (!username.trim()) e.username = "Username is required";
        if (!email.trim()) e.email = "Email is required";
        if (!password.trim() && !initial) e.password = "Password is required";
        if (Object.keys(e).length) return setErrors(e);

        onSubmit({ username, email, password, role });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/!* Header *!/}
                <div className="px-6 pt-6 pb-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">{initial ? "Edit User" : "Add User"}</h2>
                    <button onClick={onClose} className="text-xl text-slate-400 hover:text-slate-700">✕</button>
                </div>

                {/!* Body *!/}
                <div className="px-6 py-5 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Username *</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                            className={`w-full px-3 py-2.5 border rounded-lg ${errors.username ? "border-red-400" : "border-slate-200"} outline-none`}
                        />
                        {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                            className={`w-full px-3 py-2.5 border rounded-lg ${errors.email ? "border-red-400" : "border-slate-200"} outline-none`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">{initial ? "Password (leave blank to keep)" : "Password *"}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg ${errors.password ? "border-red-400" : "border-slate-200"} outline-none`}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Role</label>
                        <select
                            value={role?.id ?? ""}
                            onChange={(e) => setRole(roles.find(r => r.id === Number(e.target.value)) ?? null)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none"
                        >
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                {/!* Footer *!/}
                <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 border rounded-lg text-slate-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        {initial ? "Save Changes" : "Add User"}
                    </button>
                </div>
            </div>
        </div>
    );
};*/

import React, { useState } from "react";
import type { Role } from "../../../sampleData/RolesData.ts";
import type {User} from "./User.ts";


interface UserModalProps {
    initial?: User;
    onClose: () => void;
    onSubmit: (user: Omit<User, "id">) => void;
    roles: Role[];
}

export const UserModal: React.FC<UserModalProps> = ({ initial, onClose, onSubmit, roles }) => {
    const [username, setUsername] = useState(initial?.username ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [password, setPassword] = useState(initial?.password ?? "");
    const [role, setRole] = useState<Role | null>(initial?.role ?? null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

    const handleSubmit = () => {
        const e: typeof errors = {};
        if (!username.trim()) e.username = "Username is required";
        if (!email.trim()) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email address";

        if (!initial && !password.trim()) e.password = "Password is required";
        else if (password && password.length < 6)
            e.password = "Password must be at least 6 characters";

        if (Object.keys(e).length) return setErrors(e);

        onSubmit({ username, email, password, role });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 pt-6 pb-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">{initial ? "Edit User" : "Add User"}</h2>
                    <button onClick={onClose} className="text-xl text-slate-400 hover:text-slate-700">✕</button>
                </div>

                <div className="px-6 py-5 space-y-4 overflow-y-auto">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Username *</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                            className={`w-full px-3 py-2 border rounded-lg ${errors.username ? "border-red-400" : "border-slate-200"} outline-none`}
                        />
                        {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? "border-red-400" : "border-slate-200"} outline-none`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password with toggle */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            {initial ? "Password (leave blank to keep)" : "Password *"}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.password ? "border-red-400" : "border-slate-200"} outline-none`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-sm"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Role</label>
                        <select
                            value={role?.id ?? ""}
                            onChange={(e) => setRole(roles.find(r => r.id === Number(e.target.value)) ?? null)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                        >
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 border rounded-lg text-slate-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        {initial ? "Save Changes" : "Add User"}
                    </button>
                </div>
            </div>
        </div>
    );
};