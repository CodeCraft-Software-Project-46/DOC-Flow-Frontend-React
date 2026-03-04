import React from "react";
import { Search, Filter } from "lucide-react";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
}

export const DashboardFilters: React.FC<Props> = ({
                                               search,
                                               setSearch,
                                               status,
                                               setStatus,
                                           }) => {
    return (
        <div className="flex gap-4">

            {/* Search Input */}
            <div className="relative w-80">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search dashboards..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>

            {/* Status Filter */}
            <div className="relative w-44">
                <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Disabled">Disabled</option>
                </select>
            </div>
        </div>
    );
};

