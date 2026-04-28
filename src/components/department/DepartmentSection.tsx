import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { DepartmentModal } from "./DepartmentModal";
import { departmentService } from "../../service/DepartmentService";

export const DepartmentSection = () => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const load = async () => {
        const data = await departmentService.getAll();
        setDepartments(data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async (data: any) => {
        if (selected) {
            await departmentService.update(selected.id, data);
        } else {
            await departmentService.create(data);
        }
        await load();
    };

    const handleDelete = async (id: string) => {
        const res = await Swal.fire({
            title: "Delete Department?",
            icon: "warning",
            showCancelButton: true,
        });

        if (res.isConfirmed) {
            await departmentService.delete(id);
            await load();
            Swal.fire("Deleted!", "", "success");
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Department Management</h3>

                <button
                    onClick={() => {
                        setSelected(null);
                        setOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add Department
                </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {departments.map((d) => (
                        <tr key={d.id} className="border-t">
                            <td className="p-2">{d.name}</td>
                            <td className="p-2">{d.description}</td>

                            <td className="p-2 text-center space-x-2">
                                <button
                                    onClick={() => {
                                        setSelected(d);
                                        setOpen(true);
                                    }}
                                    className="text-blue-600"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(d.id)
                                    }
                                    className="text-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {open && (
                <DepartmentModal
                    initial={selected}
                    onClose={() => setOpen(false)}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
};