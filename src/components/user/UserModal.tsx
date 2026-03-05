import React, { useState } from "react";
import type {Role} from "../../../sampleData/RolesData.ts";


// ─── User type ────────────────────────────────────────────────────────────────
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role | null;
}

// ─── Role badge colour map ────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
    "Admin":               "bg-purple-100 text-purple-700 border-purple-200",
    "Department Manager":  "bg-blue-100   text-blue-700   border-blue-200",
    "Finance Approver":    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Procurement Officer": "bg-amber-100  text-amber-700  border-amber-200",
    "Legal Reviewer":      "bg-rose-100   text-rose-700   border-rose-200",
    "Viewer":              "bg-slate-100  text-slate-600  border-slate-200",
    "Staff / Initiator":   "bg-cyan-100   text-cyan-700   border-cyan-200",
};

// ─── Small field wrapper ──────────────────────────────────────────────────────
const Field: React.FC<{
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}> = ({ label, required, error, children }) => (
    <div>
        <label className={`block text-sm font-semibold mb-1.5 ${error ? "text-red-600" : "text-slate-700"}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <span>⚠</span> {error}
            </p>
        )}
    </div>
);


interface UserModalProps {
    initial?: User;
    onClose: () => void;
    onSubmit: (user: Omit<User, "id">) => void;
    roles: Role[];
}


export const UserModal: React.FC<UserModalProps> = ({ initial, onClose, onSubmit, roles }) => {
    const [username,     setUsername]     = useState(initial?.username ?? "");
    const [email,        setEmail]        = useState(initial?.email    ?? "");
    const [password,     setPassword]     = useState(initial?.password ?? "");
    const [role,         setRole]         = useState<Role | null>(initial?.role ?? null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors,       setErrors]       = useState<{ username?: string; email?: string; password?: string }>({});

    const isEdit = !!initial;

    //Validation
    const handleSubmit = () => {
        const e: typeof errors = {};
        if (!username.trim())                           e.username = "Username is required.";
        if (!email.trim())                              e.email    = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email))        e.email    = "Enter a valid email address.";
        if (!isEdit && !password.trim())                e.password = "Password is required.";
        else if (password && password.length < 6)       e.password = "Minimum 6 characters.";
        if (Object.keys(e).length) return setErrors(e);
        onSubmit({ username, email, password, role });
        onClose();
    };

    //Avatar preview
    const initials = username.trim()
        ? username.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    //Password strength
    const strength = !password ? 0
        : password.length < 6  ? 1
            : password.length < 10 ? 2
                : 3;
    const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
    const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"][strength];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {isEdit ? "Edit User" : "Add New User"}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            {isEdit ? "Update user details and role" : "Fill in user details to create an account"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Avatar preview  */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                            {username.trim() || <span className="text-slate-400 font-normal">Full name</span>}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                            {email.trim() || "email@example.com"}
                        </p>
                        {role && (
                            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[role.name] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {role.name}
                            </span>
                        )}
                    </div>
                </div>


                <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

                    {/* Username */}
                    <Field label="Username" required error={errors.username}>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">👤</span>
                            <input
                                type="text"
                                placeholder="e.g. john_doe"
                                value={username}
                                onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                                className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition ${
                                    errors.username
                                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />
                        </div>
                    </Field>

                    {/* Email */}
                    <Field label="Email" required error={errors.email}>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">✉️</span>
                            <input
                                type="email"
                                placeholder="e.g. john@company.com"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                                className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl outline-none transition ${
                                    errors.email
                                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />
                        </div>
                    </Field>

                    {/* Password */}
                    <Field
                        label={isEdit ? "Password (leave blank to keep)" : "Password"}
                        required={!isEdit}
                        error={errors.password}
                    >
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔒</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={isEdit ? "••••••••" : "Min 6 characters"}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                                className={`w-full pl-9 pr-16 py-2.5 text-sm border rounded-xl outline-none transition ${
                                    errors.password
                                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-500 hover:text-blue-700 transition"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* Strength bar */}
                        {password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all ${
                                                i <= strength ? strengthColor : "bg-slate-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs font-semibold ${
                                    strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : "text-emerald-600"
                                }`}>
                                    {strengthLabel} password
                                </p>
                            </div>
                        )}
                    </Field>

                    {/* Role */}
                    <Field label="Role">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🛡️</span>
                            <select
                                value={role?.id ?? ""}
                                onChange={e => setRole(roles.find(r => r.id === Number(e.target.value)) ?? null)}
                                className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 appearance-none bg-white transition cursor-pointer"
                            >
                                <option value="">— No role assigned —</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">▾</span>
                        </div>

                        {/* Selected role info */}
                        {role && (
                            <div className="mt-2 flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[role.name] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                    {role.name}
                                </span>
                                <p className="text-xs text-slate-500 truncate">{role.description}</p>
                                <span className="ml-auto text-xs text-slate-400 flex-shrink-0">
                                    {role.permissions.length} permissions
                                </span>
                            </div>
                        )}
                    </Field>
                </div>

                {/*  Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
                    <p className="text-xs text-slate-400">
                        {isEdit ? "Changes will take effect immediately" : "User will be added to the system"}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm"
                        >
                            {isEdit ? "Save Changes" : "Add User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};