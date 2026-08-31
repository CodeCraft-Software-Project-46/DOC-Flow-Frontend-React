import { useState, useEffect } from "react";
import { WidgetCard } from "./WidgetCard";
import { dashboardService } from "../../service/DashbaordService.ts";
import {WIDGET_CATEGORIES} from "../../model/WidgetCategories.ts";


interface WidgetLibraryProps {
    role_id: string;
    onAdd: (widget: any) => void;
    canvasItems: any[]; // needed to compute isAdded per widget
}

export function WidgetLibrary({ onAdd, role_id, canvasItems }: WidgetLibraryProps) {

    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [widgets, setWidgets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    //  load widgets asynchronously when role_id changes
    useEffect(() => {
        if (!role_id) return;

        setLoading(true);
        dashboardService.getAccessibleWidgetIds(role_id)
            .then((data) => setWidgets(data))
            .catch((err) => console.error("Failed to load widgets:", err))
            .finally(() => setLoading(false));
    }, [role_id]);


    const visibleWidgets = widgets.filter((w) => {
        console.log(w.name);
        const matchTab = activeTab === "All" || w.category === activeTab;
        const matchSearch =
            w.name.toLowerCase().includes(search.toLowerCase())

       return matchTab && matchSearch;
    });

    return (
        <div className="flex flex-col h-full">

            {/* Search */}
            <input
                type="text"
                placeholder="Search widgets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400 mb-2"
            />

            {/* Category tabs */}
            <div className="flex gap-1 flex-wrap mb-2">
                {WIDGET_CATEGORIES.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setSearch("");
                        }}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
                            activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Widget list */}
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
                {loading ? (
                    <p className="text-xs text-slate-400 text-center py-8">Loading widgets...</p>
                ) : visibleWidgets.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No widgets found.</p>
                ) : (
                    visibleWidgets.map((w) => (
                        <WidgetCard
                            key={w.id}
                            widget={w}
                            isAdded={canvasItems.some((c) => c.id === w.id)} //to check already added to the canvas
                            onAdd={onAdd}
                        />
                    ))
                )}
            </div>


        </div>
    );
}
