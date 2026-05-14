import React, { useEffect, useState } from "react";
import type { User } from "../../model/User";
import type { Role } from "../../model/Role";
import { roleService } from "../../service/RoleService";

interface Props {
    initial?: User;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const UserModal: React.FC<Props> = ({
                                               initial,
                                               onClose,
                                               onSubmit,
                                           }) => {
    const isEdit = !!initial;

    const [name, setName] = useState(initial?.name ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [contact, setContact] = useState(initial?.contact_number ?? "");
    const [address, setAddress] = useState(initial?.address ?? "");
    const [roleId, setRoleId] = useState<string | null>(initial?.role ?? null);

    const [roles, setRoles] = useState<Role[]>([]);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        roleService.getAll().then(setRoles);
    }, []);

    const validate = () => {
        const e: any = {};

        if (!name.trim()) e.name = "Required";

        if (!email.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
            e.email = "Invalid email";

        if (!contact.trim()) e.contact = "Required";
        else if (!/^(?:\+94|0)?7\d{8}$/.test(contact.trim()))
            e.contact = "Invalid phone";

        if (!address.trim()) e.address = "Required";
        if (!roleId) e.role = "Select role";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        onSubmit({
            name,
            email,
            contact_number: contact,
            address,
            role: roleId,
        });
    };

    const inputClass = (field: string) =>
        `w-full px-3 py-2 rounded-lg border text-sm outline-none ${
            errors[field]
                ? "border-red-400 bg-red-50"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="px-6 py-4 border-b flex-shrink-0">
                    <h2 className="text-lg font-bold">
                        {isEdit ? "Edit User" : "Add User"}
                    </h2>
                    <p className="text-sm text-gray-400">
                        Enter user details
                    </p>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-4 overflow-y-auto">

                    {/* NAME */}
                    <div>
                        <label htmlFor="name" className="text-sm font-semibold">
                            Full Name *
                        </label>
                        <input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={inputClass("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold">
                            Email *
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={inputClass("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* CONTACT */}
                    <div>
                        <label htmlFor="contact" className="text-sm font-semibold">
                            Contact *
                        </label>
                        <input
                            id="contact"
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                            className={inputClass("contact")}
                        />
                        {errors.contact && (
                            <p className="text-xs text-red-500">{errors.contact}</p>
                        )}
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label htmlFor="address" className="text-sm font-semibold">
                            Address *
                        </label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className={inputClass("address")}
                        />
                        {errors.address && (
                            <p className="text-xs text-red-500">{errors.address}</p>
                        )}
                    </div>

                    {/* ROLE */}
                    <div>
                        <label htmlFor="role" className="text-sm font-semibold">
                            Role *
                        </label>
                        <select
                            id="role"
                            value={roleId ?? ""}
                            onChange={e => setRoleId(e.target.value || null)}
                            className={inputClass("role")}
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        {errors.role && (
                            <p className="text-xs text-red-500">{errors.role}</p>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t flex justify-end gap-2 bg-gray-50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {isEdit ? "Update" : "Create"}
                    </button>
                </div>

            </div>
        </div>
    );
};
