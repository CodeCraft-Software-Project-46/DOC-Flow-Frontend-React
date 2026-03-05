/*
/!*
import React, { useState } from "react";
import WidgetItemList, {ALL_WIDGETS, type Widget} from "./WidgetItemList";
import ConfigPanel from "./ConfigPanel";
import Canvas, {type CanvasItem} from "./Canvas.tsx";
import {DashboardPreviewPage} from "./DashBoardPreviewPage.tsx";


interface Props {
    dashboard: {
        name: string;
        description: string;
        role: string;
    };
    onBack: () => void;
}

const DashboardCanvasPage: React.FC<Props> = ({ dashboard, onBack }) => {
    const [canvasItems, setCanvasItems]   = useState<CanvasItem[]>([]);
    const [selectedUid, setSelectedUid]   = useState<number | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    const selected = canvasItems.find((c) => c.uid === selectedUid) ?? null;


    const handleAdd = (widget: Widget) => {
        if (canvasItems.find((c) => c.id === widget.id)) return;

        const uid = Date.now();

        setCanvasItems((prev) => [
            ...prev,
            {
                ...widget,
                uid,
                cols: 4,      // default width
                rows: 2,      // default height
                dataSource: "current user",
            },
        ]);

        setSelectedUid(uid);
    };

    //remove
    const handleRemove = (uid: number) => {
        setCanvasItems((prev) => prev.filter((c) => c.uid !== uid));
        if (selectedUid === uid) setSelectedUid(null);
    };

    // up
    const handleMoveUp = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i <= 0) return prev;
            const next = [...prev];
            [next[i - 1], next[i]] = [next[i], next[i - 1]];
            return next;
        });
    };

    //down
    const handleMoveDown = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i >= prev.length - 1) return prev;
            const next = [...prev];
            [next[i], next[i + 1]] = [next[i + 1], next[i]];
            return next;
        });
    };

    // update widget config from right panel
    const handleUpdate = (updated: CanvasItem) => {
        setCanvasItems((prev) =>
            prev.map((c) => (c.uid === updated.uid ? updated : c))
        );
    };
    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">

            <div className="bg-white border-b border-slate-200 px-1 py-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-800 text-lg font-medium transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                Draft
              </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{dashboard.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        👁 Preview
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        💾 Save
                    </button>
                </div>
            </div>

            {/!* panel layout*!/}
            <div className="flex flex-1 overflow-hidden">

                {/!*   1*!/}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Library</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <WidgetItemList
                            widgets={ALL_WIDGETS}
                            canvasWidgets={canvasItems}
                            onAdd={handleAdd}
                        />
                    </div>
                </div>

               {/!*2*!/}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/!* Canvas header *!/}
                    <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700">
                            Canvas —{" "}
                            <span className="text-blue-600">{canvasItems.length}</span>{" "}
                            widget{canvasItems.length !== 1 ? "s" : ""}
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
              12-column grid
            </span>
                    </div>

                    {/!* canvas body *!/}
                    <div className="flex-1 overflow-y-auto p-6">
                        <Canvas
                            widgets={canvasItems}
                            selectedUid={selectedUid}
                            onSelect={(item) => setSelectedUid(item.uid)}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onRemove={handleRemove}
                        />
                    </div>
                </div>

         {/!*3*!/}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Configuration</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ConfigPanel selected={selected} onUpdate={handleUpdate} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardCanvasPage;*!/

import React, { useState, useEffect } from "react";
import WidgetItemList, { ALL_WIDGETS, type Widget } from "./WidgetItemList";
import ConfigPanel from "./ConfigPanel";
import Canvas, { type CanvasItem } from "./Canvas";
import { DashboardPreviewPage } from "./DashBoardPreviewPage";
import {APPROVALS_WAITING, PENDING_TASKS} from "../../../sampleData/PendingTask.ts";
import {MY_DOCUMENTS, REVISION_DOCUMENTS} from "../../../sampleData/Documents.ts";
import {DEPT_PERFORMANCE, KPI} from "../../../sampleData/Analytics.ts";
import {ALERT_NOTIFICATIONS, NOTIFICATIONS} from "../../../sampleData/Notifications.ts";
import {SLA_BREACH} from "../../../sampleData/Sla.ts";



// Sample data imports


interface Props {
    dashboard: {
        name: string;
        description: string;
        role: string;
    };
    onBack: () => void;
}

// Helper function to map sample data to CanvasItem
const mapSampleDataToStats = (widget: Widget): CanvasItem => {
    const uid = Date.now() + Math.random(); // unique uid

    let stats = "";

    switch (widget.title) {
        case "My Pending Tasks":
            stats = PENDING_TASKS.length + " tasks";
            break;
        case "Approvals Waiting":
            stats = APPROVALS_WAITING.length + " approvals";
            break;
        case "Overdue Tasks":
            stats = PENDING_TASKS.filter((t) => t.overdue).length + " overdue";
            break;
        case "Revision Required":
            stats = REVISION_DOCUMENTS.length + " docs";
            break;
        case "Completed Today":
            stats = KPI.completedToday + " tasks";
            break;
        case "Trend Analysis":
            stats = "Weekly trend";
            break;
        case "Recent Notifications":
            stats = NOTIFICATIONS.length + " notifications";
            break;
        case "Dept Performance":
            stats = DEPT_PERFORMANCE.length + " departments";
            break;
        case "SLA Breach Summary":
            stats =
                SLA_BREACH.reduce((sum, d) => sum.breached + sum.atRisk, 0) + " issues";
            break;
        case "Recent Documents":
            stats = MY_DOCUMENTS.length + " docs";
            break;
        case "Alert Summary":
            stats = ALERT_NOTIFICATIONS.length + " alerts";
            break;
        default:
            stats = "";
    }

    return {
        ...widget,
        uid,
        cols: widget.cols,
        rows: widget.rows,
        dataSource: widget.dataSource,
        title: widget.title,
    };
};

const DashboardCanvasPage: React.FC<Props> = ({ dashboard, onBack }) => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedUid, setSelectedUid] = useState<number | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    const selected = canvasItems.find((c) => c.uid === selectedUid) ?? null;

    useEffect(() => {
        const initialWidgets = ALL_WIDGETS.map((w) => mapSampleDataToStats(w));
        setCanvasItems(initialWidgets);
    }, []);

    const handleAdd = (widget: Widget) => {
        if (canvasItems.find((c) => c.id === widget.id)) return;

        const uid = Date.now();
        setCanvasItems((prev) => [
            ...prev,
            {
                ...widget,
                uid,
                cols: widget.cols,
                rows: widget.rows,
                dataSource: "current user",
            },
        ]);

        setSelectedUid(uid);
    };

    const handleRemove = (uid: number) => {
        setCanvasItems((prev) => prev.filter((c) => c.uid !== uid));
        if (selectedUid === uid) setSelectedUid(null);
    };

    const handleMoveUp = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i <= 0) return prev;
            const next = [...prev];
            [next[i - 1], next[i]] = [next[i], next[i - 1]];
            return next;
        });
    };

    const handleMoveDown = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i >= prev.length - 1) return prev;
            const next = [...prev];
            [next[i], next[i + 1]] = [next[i + 1], next[i]];
            return next;
        });
    };

    const handleUpdate = (updated: CanvasItem) => {
        setCanvasItems((prev) =>
            prev.map((c) => (c.uid === updated.uid ? updated : c))
        );
    };

    // Preview mode
    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            {/!* Header *!/}
            <div className="bg-white border-b border-slate-200 px-1 py-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-800 text-lg font-medium transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-800">
                                {dashboard.name}
                            </h1>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                Draft
              </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {dashboard.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        👁 Preview
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        💾 Save
                    </button>
                </div>
            </div>

            {/!* Panels *!/}
            <div className="flex flex-1 overflow-hidden">
                {/!* Left: Widget Library *!/}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Library</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <WidgetItemList
                            widgets={ALL_WIDGETS}
                            canvasWidgets={canvasItems}
                            onAdd={handleAdd}
                        />
                    </div>
                </div>

                {/!* Center: Canvas *!/}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700">
                            Canvas — <span className="text-blue-600">{canvasItems.length}</span>{" "}
                            widget{canvasItems.length !== 1 ? "s" : ""}
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
              12-column grid
            </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <Canvas
                            widgets={canvasItems}
                            selectedUid={selectedUid}
                            onSelect={(item) => setSelectedUid(item.uid)}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onRemove={handleRemove}
                        />
                    </div>
                </div>

                {/!* Right: Configuration Panel *!/}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">
                            Widget Configuration
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ConfigPanel selected={selected} onUpdate={handleUpdate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCanvasPage;*/
/*

import React, { useState, useEffect } from "react";
import {ALL_WIDGETS, type Widget, WidgetItemList} from "./WidgetItemList";
import ConfigPanel from "./ConfigPanel";
import Canvas, { type CanvasItem } from "./Canvas";
import { DashboardPreviewPage } from "./DashBoardPreviewPage";

// Default widgets for roles
const ROLE_DEFAULT_WIDGETS: Record<string, number[]> = {
    "Department Manager": [6, 8],
    "Admin": ALL_WIDGETS.map((w) => w.id),
};

interface Props {
    dashboard: {
        name: string;
        description: string;
        role: string;
    };
    onBack: () => void;
    onSave: (dashboard: any) => void; // <--- parent save handler
}


const mapSampleDataToStats = (widget: Widget): CanvasItem => {
    const uid = Date.now() + Math.random(); // unique uid
    return {
        ...widget,
        uid,
        cols: widget.cols,
        rows: widget.rows,
        dataSource: widget.dataSource,
        title: widget.title,
    };
};

const DashboardCanvasPage: React.FC<Props> = ({ dashboard, onBack,onSave }) => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedUid, setSelectedUid] = useState<number | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    const selected = canvasItems.find((c) => c.uid === selectedUid) ?? null;

    // Initialize canvas with role-based default widgets
    useEffect(() => {
        let initialWidgets: Widget[] = [];
        if (ROLE_DEFAULT_WIDGETS[dashboard.role]) {
            initialWidgets = ALL_WIDGETS.filter((w) =>
                ROLE_DEFAULT_WIDGETS[dashboard.role].includes(w.id)
            );
        }
        const canvasInit = initialWidgets.map((w) => mapSampleDataToStats(w));
        setCanvasItems(canvasInit);
    }, [dashboard.role]);

    // Add widget
    const handleAdd = (widget: Widget) => {
        if (canvasItems.find((c) => c.id === widget.id)) return;
        const uid = Date.now();
        setCanvasItems((prev) => [
            ...prev,
            {
                ...widget,
                uid,
                cols: widget.cols,
                rows: widget.rows,
                dataSource: "current user",
                title: widget.title,
            },
        ]);
        setSelectedUid(uid);
    };

    // Remove widget
    const handleRemove = (uid: number) => {
        setCanvasItems((prev) => prev.filter((c) => c.uid !== uid));
        if (selectedUid === uid) setSelectedUid(null);
    };

    // Move widget up
    const handleMoveUp = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i <= 0) return prev;
            const next = [...prev];
            [next[i - 1], next[i]] = [next[i], next[i - 1]];
            return next;
        });
    };

    // Move widget down
    const handleMoveDown = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i >= prev.length - 1) return prev;
            const next = [...prev];
            [next[i], next[i + 1]] = [next[i + 1], next[i]];
            return next;
        });
    };

    // Update widget configuration
    const handleUpdate = (updated: CanvasItem) => {
        setCanvasItems((prev) =>
            prev.map((c) => (c.uid === updated.uid ? updated : c))
        );
    };

    // Save dashboard including widgets
    const handleSaveDashboard = () => {
        const payload = {
            name: dashboard.name,
            description: dashboard.description,
            role: dashboard.role,
            widgets: canvasItems.map((w) => ({
                id: w.id,
                title: w.title,
                cols: w.cols,
                rows: w.rows,
                dataSource: w.dataSource,
                uid: w.uid,
            })),
        };

        // Call parent save handler or API
        onSave(payload);

        // Navigate back to builder
        onBack();
    };

    // Preview mode
    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            {/!* Header *!/}
            <div className="bg-white border-b border-slate-200 px-1 py-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-800 text-lg font-medium transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                Draft
              </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{dashboard.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        👁 Preview
                    </button>
                    <button
                        onClick={handleSaveDashboard}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        💾 Save
                    </button>
                </div>
            </div>

            {/!* Panels *!/}
            <div className="flex flex-1 overflow-hidden">
                {/!* Left: Widget Library *!/}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Library</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <WidgetItemList
                            widgets={ALL_WIDGETS}
                            canvasWidgets={canvasItems}
                            onAdd={handleAdd}
                            role={dashboard.role}
                        />
                    </div>
                </div>

                {/!* Center: Canvas *!/}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700">
                            Canvas — <span className="text-blue-600">{canvasItems.length}</span> widget
                            {canvasItems.length !== 1 ? "s" : ""}
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
              12-column grid
            </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <Canvas
                            widgets={canvasItems}
                            selectedUid={selectedUid}
                            onSelect={(item) => setSelectedUid(item.uid)}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onRemove={handleRemove}
                        />
                    </div>
                </div>

                {/!* Right: Configuration Panel *!/}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Configuration</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ConfigPanel selected={selected} onUpdate={handleUpdate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCanvasPage;*/
/*


import React, { useState, useEffect } from "react";
import { ALL_WIDGETS, type Widget, WidgetItemList } from "./WidgetItemList";
import ConfigPanel from "./ConfigPanel";
import Canvas, { type CanvasItem } from "./Canvas";
import { DashboardPreviewPage } from "./DashBoardPreviewPage";

// Default widgets per role
const ROLE_DEFAULT_WIDGETS: Record<string, number[]> = {
    "Department Manager": [6, 8],
    "Admin": ALL_WIDGETS.map((w) => w.id),
};

interface Dashboard {
    name: string;
    description: string;
    role: string;
    widgets?: CanvasItem[];
}

interface Props {
    dashboard: Dashboard;
    onBack: () => void;
    onSave: (dashboard: Dashboard) => void;
}


const mapSampleDataToStats = (widget: Widget, existingUid?: number): CanvasItem => {
    const uid = existingUid ?? Date.now() + Math.random();
    return {
        ...widget,
        uid,
        cols: widget.cols,
        rows: widget.rows,
        dataSource: widget.dataSource,
        title: widget.title,
    };
};

const DashboardCanvasPage: React.FC<Props> = ({ dashboard, onBack, onSave }) => {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedUid, setSelectedUid] = useState<number | null>(null);
    const [isPreview, setIsPreview] = useState(false);

    const selected = canvasItems.find((c) => c.uid === selectedUid) ?? null;


    useEffect(() => {
        if (dashboard.widgets && dashboard.widgets.length > 0) {
            // Load saved widgets
            setCanvasItems(dashboard.widgets);
        } else if (ROLE_DEFAULT_WIDGETS[dashboard.role]) {
            // Otherwise, use role defaults
            const initialWidgets = ALL_WIDGETS.filter((w) =>
                ROLE_DEFAULT_WIDGETS[dashboard.role].includes(w.id)
            ).map((w) => mapSampleDataToStats(w));
            setCanvasItems(initialWidgets);
        }
    }, [dashboard]);

    // Add widget
    const handleAdd = (widget: Widget) => {
        if (canvasItems.find((c) => c.id === widget.id)) return;
        const uid = Date.now();
        setCanvasItems((prev) => [
            ...prev,
            {
                ...widget,
                uid,
                cols: widget.cols,
                rows: widget.rows,
                dataSource: "current user",
                title: widget.title,
            },
        ]);
        setSelectedUid(uid);
    };

    // Remove widget
    const handleRemove = (uid: number) => {
        setCanvasItems((prev) => prev.filter((c) => c.uid !== uid));
        if (selectedUid === uid) setSelectedUid(null);
    };

    // Move widget up
    const handleMoveUp = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i <= 0) return prev;
            const next = [...prev];
            [next[i - 1], next[i]] = [next[i], next[i - 1]];
            return next;
        });
    };

    // Move widget down
    const handleMoveDown = (uid: number) => {
        setCanvasItems((prev) => {
            const i = prev.findIndex((c) => c.uid === uid);
            if (i >= prev.length - 1) return prev;
            const next = [...prev];
            [next[i], next[i + 1]] = [next[i + 1], next[i]];
            return next;
        });
    };

    // Update widget configuration
    const handleUpdate = (updated: CanvasItem) => {
        setCanvasItems((prev) =>
            prev.map((c) => (c.uid === updated.uid ? updated : c))
        );
    };

    // Save dashboard including current widgets
    const handleSaveDashboard = () => {
        const payload: Dashboard = {
            ...dashboard,
            widgets: canvasItems.map((w) => ({
                ...w,
                uid: w.uid, // preserve UID
            })),
        };

        onSave(payload);
        onBack();
    };

    // Preview mode
    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            {/!* Header *!/}
            <div className="bg-white border-b border-slate-200 px-1 py-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-slate-500 hover:text-slate-800 text-lg font-medium transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                                Draft
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{dashboard.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        👁 Preview
                    </button>
                    <button
                        onClick={handleSaveDashboard}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        💾 Save
                    </button>
                </div>
            </div>

            {/!* Panels *!/}
            <div className="flex flex-1 overflow-hidden">
                {/!* Left: Widget Library *!/}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Library</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <WidgetItemList
                            widgets={ALL_WIDGETS}
                            canvasWidgets={canvasItems}
                            onAdd={handleAdd}
                            role={dashboard.role}
                        />
                    </div>
                </div>

                {/!* Center: Canvas *!/}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-700">
                            Canvas — <span className="text-blue-600">{canvasItems.length}</span>{" "}
                            widget{canvasItems.length !== 1 ? "s" : ""}
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
                            12-column grid
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <Canvas
                            widgets={canvasItems}
                            selectedUid={selectedUid}
                            onSelect={(item) => setSelectedUid(item.uid)}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onRemove={handleRemove}
                        />
                    </div>
                </div>

                {/!* Right: Configuration Panel *!/}
                <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Widget Configuration</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ConfigPanel selected={selected} onUpdate={handleUpdate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCanvasPage;*/


import { useState, useEffect, useCallback } from "react";
import { WidgetLibrary }         from "./WidgetLibrary";
import { Canvas }                from "./Canvas";
import { ConfigPanel }           from "./ConfigPanel";
import {DashboardPreviewPage} from "./DashBoardPreviewPage.tsx";


export function DashboardCanvasPage({ dashboard, onBack, onSave }) {
    const [canvasItems, setCanvasItems] = useState([]);
    const [selectedUid, setSelectedUid] = useState(null);
    const [isPreview,   setIsPreview]   = useState(false);
    const [saved,       setSaved]       = useState(false);

    const selected = canvasItems.find(c => c.uid === selectedUid) ?? null;

    // Load saved widgets when opening the editor
    useEffect(() => {
        if (dashboard.widgets && dashboard.widgets.length > 0) {
            setCanvasItems(dashboard.widgets);
        } else {
            setCanvasItems([]);
        }
    }, [dashboard]);

    // Add widget from library
    const handleAdd = useCallback((widget) => {
        if (canvasItems.find(c => c.id === widget.id)) return;
        const uid = Date.now() + Math.random();
        setCanvasItems(prev => [...prev, { ...widget, uid }]);
        setSelectedUid(uid);
        setSaved(false);
    }, [canvasItems]);

    const handleRemove = (uid) => {
        setCanvasItems(p => p.filter(c => c.uid !== uid));
        if (selectedUid === uid) setSelectedUid(null);
        setSaved(false);
    };

    const handleMoveUp = (uid) => {
        setCanvasItems(p => {
            const i = p.findIndex(c => c.uid === uid);
            if (i <= 0) return p;
            const n = [...p]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n;
        });
        setSaved(false);
    };

    const handleMoveDown = (uid) => {
        setCanvasItems(p => {
            const i = p.findIndex(c => c.uid === uid);
            if (i >= p.length - 1) return p;
            const n = [...p]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; return n;
        });
        setSaved(false);
    };

    const handleUpdate = (updated) => {
        setCanvasItems(p => p.map(c => c.uid === updated.uid ? updated : c));
        setSaved(false);
    };

    // Called from preview page when user hits "Save Layout"
    // Receives widgets with updated gridX/gridY/cols/rows
    const handlePreviewSave = (updatedWidgets) => {
        setCanvasItems(updatedWidgets);
        setSaved(false); // layout changed — mark main canvas as needing a save too
    };

    // Save all to parent (canvas widget list + any grid positions)
    const handleSave = () => {
        onSave({ ...dashboard, widgets: canvasItems });
        setSaved(true);
        setTimeout(() => onBack(), 600);
    };

    // Preview mode
    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
                onSave={handlePreviewSave}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">

            {/* Header*/}
            <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-700 text-lg transition">←</button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold text-slate-800">{dashboard.name}</h1>
                            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Draft</span>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{dashboard.role}</span>
                        </div>
                        <p className="text-xs text-slate-400">{dashboard.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPreview(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        👁 Preview
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition shadow-sm ${
                            saved ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {saved ? "✓ Saved!" : "💾 Save"}
                    </button>
                </div>
            </div>


            <div className="flex flex-1 overflow-hidden">

                {/* Widget Library */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Widget Library</h2>
                    </div>
                    <div className="flex-1 overflow-hidden p-3">
                        <WidgetLibrary canvasItems={canvasItems} onAdd={handleAdd} role={dashboard.role} />
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Canvas — <span className="text-blue-600">{canvasItems.length}</span> widget{canvasItems.length !== 1 ? "s" : ""}
                        </h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">12-column grid</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5">
                        <Canvas
                            items={canvasItems}
                            selectedUid={selectedUid}
                            onSelect={item => setSelectedUid(item.uid)}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onRemove={handleRemove}
                        />
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="w-60 bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configuration</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ConfigPanel selected={selected} onUpdate={handleUpdate} />
                    </div>
                </div>

            </div>
        </div>
    );
}