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
/*

import { useState, useEffect, useCallback } from "react";
import { WidgetLibrary } from "./WidgetLibrary";
import { Canvas } from "./Canvas";
import { ConfigPanel } from "./ConfigPanel";
import { DashboardPreviewPage } from "./DashBoardPreviewPage.tsx";

export function DashboardCanvasPage({ dashboard, onBack, onSave }) {

    const [canvasItems, setCanvasItems] = useState<any[]>([]);
    const [selectedUid, setSelectedUid] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [saved, setSaved] = useState(false);

    const selected = canvasItems.find(c => c.uid === selectedUid) ?? null;

    // Load saved dashboard widgets
    useEffect(() => {
        setCanvasItems(dashboard.widgets || []);
    }, [dashboard]);

    const handleAdd = useCallback((widget: any) => {
        if (canvasItems.find(c => c.id === widget.id)) return;

        const uid = Date.now() + Math.random();

        setCanvasItems(prev => [
            ...prev,
            { ...widget, uid }
        ]);

        setSaved(false);
    }, [canvasItems]);

    const handleRemove = (uid: any) => {
        setCanvasItems(p => p.filter(c => c.uid !== uid));
        setSaved(false);
    };

    const handleSave = () => {
        onSave({ ...dashboard, widgets: canvasItems });
        setSaved(true);
        setTimeout(() => onBack(), 500);
    };

    if (isPreview) {
        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() => setIsPreview(false)}
                onSave={}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-screen">

            {/!* Widget Library → ONLY ROLE PASSED *!/}
            <WidgetLibrary
                role_id={dashboard.role_id}
                onAdd={handleAdd}
            />

            {/!* Canvas *!/}
            <Canvas
                items={canvasItems}
                selectedUid={selectedUid}
                onSelect={(item) => setSelectedUid(item.uid)}
                onRemove={handleRemove}
                onMoveUp={}
                onMoveDown={}
            />

            {/!* Config *!/}
            <ConfigPanel selected={selected} />

            <button onClick={handleSave}>
                {saved ? "Saved" : "Save"}
            </button>

        </div>
    );
}*/
/*

import { useState, useEffect, useCallback } from "react";
import { WidgetLibrary } from "./WidgetLibrary";
import { Canvas } from "./Canvas";
import { DashboardPreviewPage } from "./DashBoardPreviewPage.tsx";
import type { Dashboard } from "../../model/Dashboard.ts";
import {dashboardService} from "../../service/DashbaordService.ts";


interface Props {
    dashboard: Dashboard;
    onBack: () => void;
    onSave: (d: Dashboard) => void;
}

export function DashboardCanvasPage({ dashboard, onBack, onSave }: Props) {

    const [canvasItems, setCanvasItems] = useState<any[]>([]);
    const [selectedUid, setSelectedUid] = useState<any>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [saved, setSaved] = useState(false);
    const [addedWidgetCodes, setAddedWidgetCodes] = useState<string[]>([]);



    // Load saved dashboard widgets on mount
  /!*  useEffect(() => {

        // try local saved dashboard first
        const savedDashboard = localStorage.getItem(
            `dashboard-${dashboard.id}`
        );

        if (savedDashboard) {

            const parsed = JSON.parse(savedDashboard);

            setCanvasItems(parsed.widgets || []);

        } else {

            setCanvasItems(dashboard.widgets || []);
        }

    }, [dashboard]);*!/

    useEffect(() => {
        loadDashboards();
    }, []);

    const loadDashboards = async () => {
        const res = await dashboardService.getDashboards();
        setDashboards(res);
    };

    const handleAdd = useCallback((widget: any) => {

        // ❌ block duplicate widget_code
        if (addedWidgetCodes.includes(widget.widget_code)) {
            return;
        }

        const uid = Date.now() + Math.random();

        setCanvasItems(prev => [
            ...prev,
            { ...widget, uid }
        ]);

        // ✅ store widget_code in temp list
        setAddedWidgetCodes(prev => [
            ...prev,
            widget.widget_code
        ]);

    }, [addedWidgetCodes]);
 /!*   const handleUpdate = (updatedItem) => {
        setCanvasItems((prev) =>
            prev.map((item) =>
                item.uid === updatedItem.uid ? updatedItem : item
            )
        );

        setSaved(false);
    };*!/

    const handleRemove = (uid: any) => {

        const removed = canvasItems.find(c => c.uid === uid);

        if (removed?.widget_code) {
            setAddedWidgetCodes(prev =>
                prev.filter(code => code !== removed.widget_code)
            );
        }

        setCanvasItems(prev => prev.filter(c => c.uid !== uid));

        if (selectedUid === uid) setSelectedUid(null);
    };

    // implemented move up handler
    const handleMoveUp = (uid: any) => {
        setCanvasItems((prev) => {
            const idx = prev.findIndex((c) => c.uid === uid);
            if (idx <= 0) return prev;
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
        setSaved(false);
    };

    // implemented move down handler
    const handleMoveDown = (uid: any) => {
        setCanvasItems((prev) => {
            const idx = prev.findIndex((c) => c.uid === uid);
            if (idx === -1 || idx >= prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
        setSaved(false);
    };

    const handleSave = async () => {

        const payload = {
            dashboard_id: dashboard.id, // null if new

            name: dashboard.name,
            description: dashboard.description,
            role_id: dashboard.role_id,

            widgets: canvasItems.map(w => ({
                widget_code: w.widget_code,
                pos_x: w.pos_x,
                pos_y: w.pos_y,
                width: w.width,
                height: w.height,
            }))
        };

        const res = await dashboardService.saveDashboard(payload);

        // IMPORTANT: assign backend ID if new dashboard
        if (!dashboard.id && res.dashboard_id) {
            dashboard.id = res.dashboard_id;
        }

        console.log("Saved dashboard:", res);
    };

    if (isPreview) {

        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}

                onBack={() => setIsPreview(false)}

                onSave={(updatedWidgets) => {

                    setCanvasItems(updatedWidgets);

                    setIsPreview(false);
                }}
            />
        );
    }

    return (
        <div className="h-screen flex bg-slate-100">

            {/!* LEFT — Widget Library *!/}
            <div className="w-2/5 bg-white border-r">
                <WidgetLibrary
                    role_id={dashboard.role_id}
                    onAdd={handleAdd}
                    canvasItems={canvasItems}
                />
            </div>

            {/!* CENTER — Canvas *!/}
            <div className="flex-1 flex flex-col w-3/5">

                {/!* TOP BAR *!/}
                <div className="flex justify-end gap-3 p-4 bg-white border-b">

                    <button
                        onClick={() => setIsPreview(true)}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        Preview
                    </button>

                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded-lg text-sm text-white ${
                            saved ? "bg-green-500" : "bg-blue-600"
                        }`}
                    >
                        {saved ? "✓ Saved" : "Save"}
                    </button>

                </div>

                {/!* CANVAS *!/}
                <div className="flex-1 p-6 overflow-auto ">
                    <Canvas
                        items={canvasItems}
                        selectedUid={selectedUid}
                        onSelect={(item) => setSelectedUid(item.uid)}
                        onRemove={handleRemove}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                    />
                </div>

            </div>

            {/!* RIGHT — Config Panel *!/}
           {/!* <div className="w-80 bg-white border-l">
                <ConfigPanel selected={selected}
                             onUpdate={handleUpdate}/>
            </div>*!/}

        </div>
    );
}*/

import { useState, useEffect, useCallback } from "react";
import { WidgetLibrary } from "./WidgetLibrary";
import { Canvas } from "./Canvas";
import { DashboardPreviewPage } from "./DashBoardPreviewPage.tsx";
import type { Dashboard } from "../../model/Dashboard.ts";
import { dashboardService } from "../../service/DashbaordService.ts";

interface Props {
    dashboard: Dashboard;
    onBack: () => void;
    onSave: (d: Dashboard) => void;
}

export function DashboardCanvasPage({
                                        dashboard,
                                        onBack,
                                        onSave,
                                    }: Props) {

    const [canvasItems, setCanvasItems] =
        useState<any[]>([]);

    const [selectedWidgetCode, setSelectedWidgetCode] =
        useState<string | null>(null);

    const [isPreview, setIsPreview] =
        useState(false);

    const [saved, setSaved] =
        useState(false);

    const [addedWidgetCodes, setAddedWidgetCodes] =
        useState<string[]>([]);

    // LOAD DASHBOARD
    useEffect(() => {

        const loadDashboard = async () => {

            try {

                // EXISTING DASHBOARD
                if (dashboard.id) {

                    const fullDashboard =
                        await dashboardService
                            .getDashboard(
                                dashboard.id
                            );

                    console.log(
                        "✅ Loaded dashboard:"
                    );

                    console.log(fullDashboard);

                    const widgets =
                        fullDashboard.widgets || [];

                    setCanvasItems(widgets);

                    setAddedWidgetCodes(
                        widgets.map(
                            (w: any) =>
                                w.widget_code
                        )
                    );

                } else {

                    // NEW DASHBOARD
                    setCanvasItems([]);

                    setAddedWidgetCodes([]);
                }

            } catch (err) {

                console.error(
                    "❌ Failed loading dashboard:",
                    err
                );
            }
        };

        loadDashboard();

    }, [dashboard.id]);

    // ADD WIDGET
    const handleAdd = useCallback(

        (widget: any) => {

            // BLOCK DUPLICATES
            if (
                addedWidgetCodes.includes(
                    widget.widget_code
                )
            ) {

                console.log(
                    "⚠️ Widget already added"
                );

                return;
            }

            const newWidget = {

                ...widget,

                pos_x: 0,
                pos_y: 0,

                width:
                    widget.min_width || 3,

                height:
                    widget.min_height || 2,
            };

            setCanvasItems((prev) => [
                ...prev,
                newWidget,
            ]);

            setAddedWidgetCodes((prev) => [
                ...prev,
                widget.widget_code,
            ]);

            setSaved(false);

        },

        [addedWidgetCodes]
    );

    // REMOVE
    const handleRemove = (
        widget_code: string
    ) => {

        setCanvasItems((prev) =>
            prev.filter(
                (c) =>
                    c.widget_code !==
                    widget_code
            )
        );

        setAddedWidgetCodes((prev) =>
            prev.filter(
                (code) =>
                    code !== widget_code
            )
        );

        if (
            selectedWidgetCode ===
            widget_code
        ) {
            setSelectedWidgetCode(null);
        }

        setSaved(false);
    };

    // MOVE UP
    const handleMoveUp = (
        widget_code: string
    ) => {

        setCanvasItems((prev) => {

            const idx =
                prev.findIndex(
                    (c) =>
                        c.widget_code ===
                        widget_code
                );

            if (idx <= 0) return prev;

            const next = [...prev];

            [next[idx - 1], next[idx]] = [
                next[idx],
                next[idx - 1],
            ];

            return next;
        });

        setSaved(false);
    };

    // MOVE DOWN
    const handleMoveDown = (
        widget_code: string
    ) => {

        setCanvasItems((prev) => {

            const idx =
                prev.findIndex(
                    (c) =>
                        c.widget_code ===
                        widget_code
                );

            if (
                idx === -1
                || idx >= prev.length - 1
            ) {
                return prev;
            }

            const next = [...prev];

            [next[idx], next[idx + 1]] = [
                next[idx + 1],
                next[idx],
            ];

            return next;
        });

        setSaved(false);
    };

    // SAVE
    const handleSave = async () => {

        const payload = {
            name: dashboard.name,
            description: dashboard.description,
            role_id: dashboard.role_id,
            status: dashboard.status,

            widgets: canvasItems.map(w => ({
                widget_code: w.widget_code,

                pos_x: w.pos_x,
                pos_y: w.pos_y,

                width: w.width,
                height: w.height,
            }))
        };

        try {

            let res;

            // UPDATE
            if (dashboard.id) {

                res = await dashboardService.updateDashboard(
                    dashboard.id,
                    payload
                );

            }

            // CREATE
            else {

                res = await dashboardService.saveDashboard(
                    payload
                );

                // assign backend id
                dashboard.id = res.dashboard_id;
            }

            console.log("Saved:", res);

            setSaved(true);

            setTimeout(() => {
                onBack();
            }, 500);

        } catch (err) {

            console.error(err);
        }
    };

    // PREVIEW
    if (isPreview) {

        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() =>
                    setIsPreview(false)
                }
                onSave={(
                    updatedWidgets
                ) => {

                    setCanvasItems(
                        updatedWidgets
                    );

                    setIsPreview(false);
                }}
            />
        );
    }

    return (
        <div className="h-screen flex bg-slate-100">

            {/* LEFT */}
            <div className="w-2/5 bg-white border-r">

                <WidgetLibrary
                    role_id={dashboard.role_id}
                    onAdd={handleAdd}
                    canvasItems={canvasItems}
                />
            </div>

            {/* CENTER */}
            <div className="flex-1 flex flex-col w-3/5">

                {/* TOP BAR */}
                <div className="flex justify-between items-center p-4 bg-white border-b">

                    {/* BACK BUTTON */}
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border rounded-lg text-sm bg-white hover:bg-slate-50"
                    >
                        ← Back
                    </button>

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                setIsPreview(true)
                            }
                            className="px-4 py-2 border rounded-lg text-sm"
                        >
                            Preview
                        </button>

                        <button
                            onClick={handleSave}
                            className={`
                                px-4 py-2 rounded-lg
                                text-sm text-white
                                ${
                                saved
                                    ? "bg-green-500"
                                    : "bg-blue-600"
                            }
                            `}
                        >
                            {saved
                                ? "✓ Saved"
                                : "Save"}
                        </button>
                    </div>
                </div>

                {/* CANVAS */}
                <div className="flex-1 p-6 overflow-auto">

                    <Canvas
                        items={canvasItems}
                        selectedWidgetCode={
                            selectedWidgetCode
                        }
                        onSelect={(item) =>
                            setSelectedWidgetCode(
                                item.widget_code
                            )
                        }
                        onRemove={handleRemove}
                        onMoveUp={handleMoveUp}
                        onMoveDown={
                            handleMoveDown
                        }
                    />
                </div>
            </div>
        </div>
    );
}