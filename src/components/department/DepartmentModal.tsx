import React, {useState} from "react";
import Swal from "sweetalert2";
import type {Department} from "../../model/Department.ts";


interface Props {
    initial?: Department | null;
    onClose: () => void;
    onSubmit: (data: Department) => Promise<void>;
}

export const DepartmentModal: React.FC<Props> = ({
                                                     initial,
                                                     onClose,
                                                     onSubmit,
                                                 }) => {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");

    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
    }>({});

    const [saving, setSaving] = useState(false);

    const validate = () => {
        const err: typeof errors = {};

        if (!name.trim()) {
            err.name = "Department name is required";
        } else if (name.trim().length < 2) {
            err.name = "Must be at least 2 characters";
        }

        if (!description.trim()) {
            err.description = "Description is required";
        } else if (description.trim().length < 3) {
            err.description = "Must be at least 3 characters";
        }

        setErrors(err);
        //to check is error object is not null
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setSaving(true);

            const payload: Department = {
                id: initial?.id,
                name: name.trim(),
                description: description.trim(),
            };

            await onSubmit(payload);

            await Swal.fire({
                icon: "success",
                title: initial ? "Updated!" : "Created!",
                text: `Department ${initial ? "updated" : "created"} successfully`,
                timer: 1500,
                showConfirmButton: false,
            });

            onClose();
        } catch (e: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    e?.response?.data?.name ||
                    e?.response?.data?.description ||
                    "Failed to save department",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5">

                {/* Title */}
                <h2 className="text-lg font-bold mb-4">
                    {initial ? "Edit Department" : "Create Department"}
                </h2>

                {/* Name */}
                <div className="mb-3">
                    <input
                        className={`w-full border p-2 rounded outline-none transition
                        ${
                            errors.name
                                ? "border-red-500 ring-1 ring-red-300 bg-red-50"
                                : "border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        }`}
                        placeholder="Department name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors((p) => ({...p, name: ""}));
                        }}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="mb-3">
                    <textarea
                        className={`w-full border p-2 rounded outline-none transition
                        ${
                            errors.description
                                ? "border-red-500 ring-1 ring-red-300 bg-red-50"
                                : "border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                        }`}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setErrors((p) => ({...p, description: ""}));
                        }}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {saving ? "Saving..." : initial ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};