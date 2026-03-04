import React, { useState } from "react";
import WidgetCard from "./WidgetCard.tsx";

// Types
export interface Widget {
    id: number;
    icon: string;
    title: string;
    description: string;
    category: string;
    cols: number;
    rows: number;
    dataSource: string;
}

interface Props {
    widgets: Widget[];
    canvasWidgets: Widget[];
    onAdd: (widget: Widget) => void;
}

// Data
export const ALL_WIDGETS: Widget[] = [
    { id: 1,  icon: "📋", title: "My Pending Tasks",     description: "Tasks awaiting action from the current user", category: "Task",         cols: 6, rows: 2, dataSource: "current user" },
    { id: 2,  icon: "✅", title: "Approvals Waiting",    description: "Approvals assigned to the user",             category: "Task",         cols: 6, rows: 2, dataSource: "current user" },
    { id: 3,  icon: "⚠️", title: "Overdue Tasks",        description: "Tasks past their SLA deadline",              category: "SLA",          cols: 6, rows: 2, dataSource: "all users"    },
    { id: 4,  icon: "🔁", title: "Revision Required",    description: "Documents sent back for revision",           category: "Document",     cols: 6, rows: 2, dataSource: "current user" },
    { id: 5,  icon: "🕐", title: "Completed Today",      description: "Tasks completed today",                      category: "Task",         cols: 6, rows: 2, dataSource: "current user" },
    { id: 6,  icon: "📈", title: "Trend Analysis",       description: "Visualize trends over time periods",         category: "Analytics",    cols: 8, rows: 3, dataSource: "all users"    },
    { id: 7,  icon: "🔔", title: "Recent Notifications", description: "Latest notifications for the user",          category: "Notification", cols: 4, rows: 2, dataSource: "current user" },
    { id: 8,  icon: "🏢", title: "Dept Performance",     description: "Performance metrics by department",          category: "Analytics",    cols: 6, rows: 3, dataSource: "all depts"    },
    { id: 9,  icon: "📊", title: "SLA Breach Summary",   description: "Overview of breached SLAs by department",   category: "SLA",          cols: 8, rows: 3, dataSource: "all depts"    },
    { id: 10, icon: "📄", title: "Recent Documents",     description: "Latest documents accessed or modified",      category: "Document",     cols: 6, rows: 2, dataSource: "current user" },
    { id: 11, icon: "📢", title: "Alert Summary",        description: "Grouped view of all system alerts",          category: "Notification", cols: 4, rows: 2, dataSource: "all users"    },
    { id: 12, icon: "🎛️", title: "Custom Dashboard",    description: "Build your own layout with chosen widgets",  category: "Custom",       cols: 6, rows: 3, dataSource: "custom"       },
];

const TABS = ["All", "Task", "Document", "SLA", "Analytics", "Notification", "Custom"];

/*
// Card
function WidgetCard({ widget, isAdded, onAdd }: { widget: Widget; isAdded: boolean; onAdd: (w: Widget) => void }) {
    return (
        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 hover:bg-blue-50 transition-colors">
            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {widget.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{widget.title}</p>
                <p className="text-xs text-slate-400 truncate">{widget.description}</p>
            </div>
            <button
                onClick={() => onAdd(widget)}
                disabled={isAdded}
                className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200 ${
                    isAdded
                        ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white"
                }`}
            >
                {isAdded ? "✓" : "+"}
            </button>
        </div>
    );
}*/

export const WidgetItemList: React.FC<Props> = ({ widgets, canvasWidgets, onAdd }) => {
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");

    const addedIds = canvasWidgets.map((w) => w.id);

    const filtered = widgets.filter((w) => {
        const matchTab = activeTab === "All" || w.category === activeTab;
        const matchSearch =
            w.title.toLowerCase().includes(search.toLowerCase()) ||
            w.description.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    return (
        <div className="flex flex-col h-full">
            {/* search */}
            <input
                type="text"
                placeholder="Search widgets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 placeholder-slate-400 text-slate-700 mb-3"
            />

            {/* tabs */}
            <div className="flex gap-1.5 flex-wrap mb-3">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearch(""); }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 ${
                            activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
                {filtered.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No widgets found.</p>
                ) : (
                    filtered.map((w) => (
                        <WidgetCard key={w.id} widget={w} isAdded={addedIds.includes(w.id)} onAdd={onAdd} />
                    ))
                )}
            </div>
        </div>
    );
};

export default WidgetItemList;