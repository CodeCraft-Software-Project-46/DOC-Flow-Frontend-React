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

                {/* Header */}
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

                {/* name */}
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

                {/* description */}
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

                {/* roles */}
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

                {/* footer */}
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
};