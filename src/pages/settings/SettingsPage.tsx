import  { useState } from "react";
import {DepartmentSection} from "../../components/department/DepartmentSection.tsx";


export const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("department");

    return (
        <div className="p-6">


            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab("department")}
                    className={`pb-2 ${
                        activeTab === "department"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                    }`}
                >
                    Departments
                </button>
            </div>

            {/* Content */}
            {activeTab === "department" && <DepartmentSection />}
        </div>
    );
};