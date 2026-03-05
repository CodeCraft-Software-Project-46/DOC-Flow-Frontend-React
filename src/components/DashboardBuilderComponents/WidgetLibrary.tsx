import  { useState } from "react";
import { WidgetCard } from "./WidgetCard";
import {ALL_WIDGETS, getAccessibleWidgetIds, WIDGET_CATEGORIES} from "../../../sampleData/RolesData.ts";



export function WidgetLibrary({ canvasItems, onAdd, role }) {
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch]       = useState("");

    const accessibleIds = getAccessibleWidgetIds(role);
    const addedIds      = canvasItems.map(w => w.id);

    const visibleWidgets = ALL_WIDGETS.filter(w => {
        const hasAccess  = accessibleIds.includes(w.id);
        const matchTab   = activeTab === "All" || w.category === activeTab;
        const matchSearch =
            w.title.toLowerCase().includes(search.toLowerCase()) ||
            w.description.toLowerCase().includes(search.toLowerCase());
        return hasAccess && matchTab && matchSearch;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <input
                type="text"
                placeholder="Search widgets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400 mb-2"
            />

            {/* Category tabs */}
            <div className="flex gap-1 flex-wrap mb-2">
                {WIDGET_CATEGORIES.map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSearch(""); }}
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
                {visibleWidgets.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No widgets found.</p>
                ) : (
                    visibleWidgets.map(w => (
                        <WidgetCard
                            key={w.id}
                            widget={w}
                            isAdded={addedIds.includes(w.id)}
                            onAdd={onAdd}
                        />
                    ))
                )}
            </div>

            <p className="text-xs text-slate-400 text-center mt-2">
                <span className="font-semibold text-blue-600">{accessibleIds.length}</span> widgets available for <strong>{role}</strong>
            </p>
        </div>
    );
}