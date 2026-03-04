/*
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

export default DashboardCanvasPage;*/

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
            {/* Header */}
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

            {/* Panels */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Widget Library */}
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

                {/* Center: Canvas */}
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

                {/* Right: Configuration Panel */}
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

export default DashboardCanvasPage;