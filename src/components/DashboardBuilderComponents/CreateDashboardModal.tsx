/*
import React, { useState, useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description: string;
        roles: string[];
    }) => void;
};

const rolesList = [
    "Staff / Initiator",
    "Approver",
    "Supervisor / Manager",
    "Admin",
    "External Party",
];

export const CreateDashboardModal: React.FC<Props> = ({
                                                          isOpen,
                                                          onClose,
                                                          onSubmit, // ✅ FIXED
                                                      }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string; roles?: string }>({});
    const [touched, setTouched] = useState<{ name?: boolean; roles?: boolean }>({});

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setDescription("");
            setSelectedRoles([]);
            setErrors({});
            setTouched({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleRole = (role: string) => {
        let updatedRoles;

        if (selectedRoles.includes(role)) {
            updatedRoles = selectedRoles.filter((r) => r !== role);
        } else {
            updatedRoles = [...selectedRoles, role];
        }

        setSelectedRoles(updatedRoles);
        setTouched((prev) => ({ ...prev, roles: true }));

        if (updatedRoles.length === 0) {
            setErrors((prev) => ({
                ...prev,
                roles: "Select at least one role.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, roles: "" }));
        }
    };

    const validateName = (value: string) => {
        let error = "";

        if (!value.trim()) {
            error = "Dashboard name is required.";
        } else if (value.trim().length < 3) {
            error = "Minimum 3 characters required.";
        }

        setErrors((prev) => ({ ...prev, name: error }));
    };

    const handleSubmit = () => {
        setTouched({ name: true, roles: true });
        validateName(name);

        if (selectedRoles.length === 0) {
            setErrors((prev) => ({
                ...prev,
                roles: "Select at least one role.",
            }));
        }

        if (name.trim().length >= 3 && selectedRoles.length > 0) {
            onSubmit({
                name,
                description,
                roles: selectedRoles,
            });

            onClose();
        }
    };

    const isFormValid =
        name.trim().length >= 3 && selectedRoles.length > 0;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-xl shadow-lg p-6 space-y-6">

                {/!* Header *!/}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Create New Dashboard
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Define a new dashboard template and assign it to roles.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/!* name *!/}
                <div>
                    <label
                        className={`block text-sm font-medium mb-1 ${
                            errors.name && touched.name
                                ? "text-red-600"
                                : ""
                        }`}
                    >
                        Dashboard Name *
                    </label>

                    <input
                        type="text"
                        placeholder="e.g., Finance Team Dashboard"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            validateName(e.target.value);
                        }}
                        onBlur={() =>
                            setTouched((prev) => ({
                                ...prev,
                                name: true,
                            }))
                        }
                        className={`w-full border rounded-lg px-3 py-2 outline-none transition ${
                            errors.name && touched.name
                                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                        }`}
                    />

                    {errors.name && touched.name && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/!* description *!/}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Description
                    </label>

                    <textarea
                        placeholder="Describe the dashboard purpose..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/!* roles *!/}
                <div>
                    <label
                        className={`block text-sm font-medium mb-2 ${
                            errors.roles && touched.roles
                                ? "text-red-600"
                                : ""
                        }`}
                    >
                        Assign to Roles *
                    </label>

                    <div
                        className={`flex flex-wrap gap-4 p-3 rounded-lg border transition ${
                            errors.roles && touched.roles
                                ? "border-red-500"
                                : "border-gray-200"
                        }`}
                    >
                        {rolesList.map((role) => (
                            <label
                                key={role}
                                className="flex items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role)}
                                    onChange={() => toggleRole(role)}
                                    className="accent-blue-600"
                                />
                                {role}
                            </label>
                        ))}
                    </div>

                    {errors.roles && touched.roles && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                            {errors.roles}
                        </p>
                    )}
                </div>

                {/!* footer *!/}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`px-4 py-2 rounded-lg text-white transition ${
                            isFormValid
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-300 cursor-not-allowed"
                        }`}
                    >
                        Create & Open Builder
                    </button>
                </div>
            </div>
        </div>
    );
};*/

/*

import  { useState, useEffect } from "react";

import {roleService} from "../../service/RoleService";
import {dashboardService} from "../../service/DashbaordService.ts";



export function CreateDashboardModal({ isOpen, onClose, onSubmit }) {
    const [name, setName]               = useState("");
    const [description, setDescription] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [errors, setErrors]           = useState({});
    const [touched, setTouched]         = useState({});
    const [roles, setRoles] = useState([]);

    const loadRoles = async () => {
        try {
            const data = await roleService.getAll();
            setRoles(data);
        } catch (err) {
            console.error("Failed to load roles", err);
        }
    };
    useEffect(() => {
        if (!isOpen) {
            loadRoles();
            setName(""); setDescription(""); setSelectedRole("");
            setErrors({}); setTouched({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const e = {};
        if (!name.trim() || name.trim().length < 3) e.name = "Min 3 characters required.";
        if (!selectedRole) e.role = "Please select a role.";
        return e;
    };

    const handleSubmit = () => {
        setTouched({ name: true, role: true });
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length === 0) {
            onSubmit({ name, description, role: selectedRole });
        }
    };

    const accessibleCount = selectedRole ? getAccessibleWidgetIds(selectedRole).length : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-6 space-y-5">

                {/!* Header *!/}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Create New Dashboard</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Define a dashboard template for a role.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
                </div>

                {/!* Name *!/}
                <div>
                    <label className={`block text-sm font-semibold mb-1 ${errors.name && touched.name ? "text-red-600" : "text-slate-700"}`}>
                        Dashboard Name *
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Finance Team Dashboard"
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            if (touched.name) setErrors(prev => ({ ...prev, name: e.target.value.trim().length >= 3 ? "" : "Min 3 characters required." }));
                        }}
                        onBlur={() => setTouched(p => ({ ...p, name: true }))}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition
              ${errors.name && touched.name
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"}`}
                    />
                    {errors.name && touched.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/!* Description *!/}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                        placeholder="Describe the dashboard purpose..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm h-20 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none"
                    />
                </div>

                {/!* Role Dropdown *!/}
                <div>
                    <label className={`block text-sm font-semibold mb-1 ${errors.role && touched.role ? "text-red-600" : "text-slate-700"}`}>
                        Assign to Role *
                    </label>
                    <select
                        value={selectedRole}
                        onChange={e => { setSelectedRole(e.target.value); setErrors(p => ({ ...p, role: "" })); }}
                        onBlur={() => setTouched(p => ({ ...p, role: true }))}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition
              ${errors.role && touched.role
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"}`}
                    >
                        <option value="">-- Select a role --</option>
                        {roles.map(r => (
                            <option key={r.id} value={r.name}>{r.name} — {r.description}</option>
                        ))}
                    </select>
                    {errors.role && touched.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    {selectedRole && (
                        <p className="text-xs text-slate-500 mt-1.5">
                            <span className="font-semibold text-blue-600">{accessibleCount}</span> widgets available for this role.
                        </p>
                    )}
                </div>

                {/!* Footer *!/}
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-sm">
                        Create & Open Builder →
                    </button>
                </div>
            </div>
        </div>
    );
}*/
/*

import { useState, useEffect } from "react";
import { roleService } from "../../service/RoleService";
import { dashboardService } from "../../service/DashbaordService";

export function CreateDashboardModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [widgetCount, setWidgetCount] = useState(0);

    // ✅ Load roles when modal opens
    useEffect(() => {
        if (isOpen) {
            loadRoles();
        } else {
            // reset when closed
            setName("");
            setDescription("");
            setSelectedRole("");
            setErrors({});
            setTouched({});
            setWidgetCount(0);
        }
    }, [isOpen]);

    const loadRoles = async () => {
        try {
            const data = await roleService.getAll();
            setRoles(data);
        } catch (err) {
            console.error("Failed to load roles", err);
        }
    };

    // ✅ Load widgets when role changes
    useEffect(() => {
        if (!selectedRole) return;

        const loadWidgets = async () => {
            try {
                const res = await dashboardService.getAccessibleWidgetIds(selectedRole);
                setWidgetCount(res.length);
            } catch (err) {
                console.error("Failed to load widgets", err);
            }
        };

        loadWidgets();
    }, [selectedRole]);

    if (!isOpen) return null;

    // ✅ Validation
    const validate = () => {
        const e = {};

        if (!name.trim() || name.trim().length < 3) {
            e.name = "Min 3 characters required.";
        }

        if (!selectedRole) {
            e.role = "Please select a role.";
        }

        return e;
    };

    // ✅ Submit
    const handleSubmit = () => {
        setTouched({ name: true, role: true });

        const e = validate();
        setErrors(e);

        if (Object.keys(e).length === 0) {
            onSubmit({
                name,
                description,
                role_id: selectedRole, // ✅ IMPORTANT
            });

            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-6 space-y-5">

                {/!* Header *!/}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Create New Dashboard
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Define a dashboard template for a role.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/!* Name *!/}
                <div>
                    <label className={`block text-sm font-semibold mb-1 ${errors.name && touched.name ? "text-red-600" : "text-slate-700"}`}>
                        Dashboard Name *
                    </label>

                    <input
                        type="text"
                        placeholder="e.g., Finance Team Dashboard"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (touched.name) {
                                setErrors((p) => ({
                                    ...p,
                                    name: e.target.value.trim().length >= 3 ? "" : "Min 3 characters required.",
                                }));
                            }
                        }}
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition
                        ${errors.name && touched.name
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        }`}
                    />

                    {errors.name && touched.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                </div>

                {/!* Description *!/}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Description
                    </label>

                    <textarea
                        placeholder="Describe the dashboard purpose..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm h-20 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none"
                    />
                </div>

                {/!* Role *!/}
                <div>
                    <label className={`block text-sm font-semibold mb-1 ${errors.role && touched.role ? "text-red-600" : "text-slate-700"}`}>
                        Assign to Role *
                    </label>

                    <select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e.target.value);
                            setErrors((p) => ({ ...p, role: "" }));
                        }}
                        onBlur={() => setTouched((p) => ({ ...p, role: true }))}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition
                        ${errors.role && touched.role
                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                            : "border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        }`}
                    >
                        <option value="">-- Select a role --</option>

                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name} — {r.description}
                            </option>
                        ))}
                    </select>

                    {errors.role && touched.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                    )}

                    {selectedRole && (
                        <p className="text-xs text-slate-500 mt-1.5">
                            <span className="font-semibold text-blue-600">
                                {widgetCount}
                            </span>{" "}
                            widgets available for this role.
                        </p>
                    )}
                </div>

                {/!* Footer *!/}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-sm"
                    >
                        Create & Open Builder →
                    </button>
                </div>

            </div>
        </div>
    );
}*/

import { useState, useEffect } from "react";
import { roleService } from "../../service/RoleService";

export function CreateDashboardModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (isOpen) loadRoles();
        else {
            setName("");
            setDescription("");
            setSelectedRole("");
        }
    }, [isOpen]);

    const loadRoles = async () => {
        try {
            const data = await roleService.getAll();
            setRoles(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = () => {
        if (!name || !selectedRole) return;

        onSubmit({
            name,
            description,
            role_id: selectedRole,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
                <h2 className="font-bold">Create Dashboard</h2>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-3 py-1 rounded">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}