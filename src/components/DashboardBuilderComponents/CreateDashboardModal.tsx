import { useState, useEffect } from "react";
import { roleService } from "../../service/RoleService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description: string;
        role_id: string;
    }) => void;
}

export function CreateDashboardModal({
                                         isOpen,
                                         onClose,
                                         onSubmit,
                                     }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
        role?: string;
    }>({});

    useEffect(() => {
        if (isOpen) {
            loadRoles();
        } else {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setSelectedRole("");
        setErrors({});
    };

    const loadRoles = async () => {
        try {
            const data = await roleService.getAll();
            setRoles(data);
        } catch (err) {
            console.error(err);
        }
    };

    const validate = () => {
        const newErrors : typeof errors = {};

        // Name Validation
        if (!name.trim()) {
            newErrors.name = "Dashboard name is required";
        } else if (name.trim().length < 3) {
            newErrors.name =
                "Name must be at least 3 characters";
        } else if (name.trim().length > 50) {
            newErrors.name =
                "Name cannot exceed 50 characters";
        }

        // Description Validation
        if (description.trim().length > 200) {
            newErrors.description =
                "Description cannot exceed 200 characters";
        }

        // Role Validation
        if (!selectedRole) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        onSubmit({
            name: name.trim(),
            description: description.trim(),
            role_id: selectedRole,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-lg">
                <h2 className="text-xl font-bold">
                    Create Dashboard
                </h2>

                {/* Dashboard Name */}
                <div>
                    <input
                        type="text"
                        placeholder="Dashboard Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className={`w-full border p-2 rounded outline-none transition ${
                            errors.name
                                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                        }`}
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        rows={4}
                        className={`w-full border p-2 rounded outline-none transition ${
                            errors.description
                                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                        }`}
                    />

                    <div className="flex justify-between items-center mt-1">
                        {errors.description ? (
                            <p className="text-red-500 text-sm">
                                {errors.description}
                            </p>
                        ) : (
                            <span />
                        )}

                        <p className="text-xs text-gray-400">
                            {description.length}/200
                        </p>
                    </div>
                </div>

                {/* Role Select */}
                <div>
                    <select
                        value={selectedRole}
                        onChange={(e) =>
                            setSelectedRole(e.target.value)
                        }
                        className={`w-full border p-2 rounded outline-none transition ${
                            errors.role
                                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                        }`}
                    >
                        <option value="">
                            Select Role
                        </option>

                        {roles.map((r:any) => (
                            <option
                                key={r.id}
                                value={r.id}
                            >
                                {r.name}
                            </option>
                        ))}
                    </select>

                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
