/*
import { useState, useEffect } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { CanvasItem } from "./Canvas";

interface Props {
    dashboard: {
        name: string;
    };
    widgets: CanvasItem[];
    onBack: () => void;
}

export const DashboardPreviewPage = ({ dashboard, widgets, onBack }: Props) => {
    const [layout, setLayout] = useState<Layout[]>([]);
    const [isEditing] = useState(false); // NEW: track edit mode

    // Generate layout for react-grid-layout
    useEffect(() => {
        const newLayout = widgets.map((widget, index) => ({
            i: widget.uid.toString(),
            x: (index * 4) % 12,
            y: Math.floor(index / 3) * 3,
            w: widget.cols,
            h: widget.rows,
        }));
        setLayout(newLayout);
    }, [widgets]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/!* Header *!/}
            <div className="flex items-center justify-between mb-6">

                {/!* Dashboard Title *!/}
                <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
      Draft
    </span>
                </div>

                {/!* righ side btns *!/}
                <div className="flex items-center gap-3">
                    {/!* navigates back to canvas *!/}
                    <button
                        onClick={onBack}  // back to Canvas page
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        ✏️ Edit
                    </button>

                    {/!* disabled in preview page *!/}
                    <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-200 border border-slate-200 rounded-lg cursor-not-allowed"
                    >
                        👁 Preview
                    </button>
                </div>
            </div>

            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
                isResizable={true}
                isDraggable={true}
            >
                {widgets.map((widget) => (
                    <div
                        key={widget.uid.toString()}
                        className={`bg-white rounded-xl shadow-md p-4 border ${
                            isEditing ? "border-blue-500 bg-blue-50" : ""
                        }`}
                    >
                        <h3 className="font-semibold">{widget.title}</h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Data: {widget.dataSource}
                        </p>
                    </div>
                ))}
            </GridLayout>
        </div>
    );
};*/
/*

import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {WIDGET_COMPONENTS} from "../../WIDGET_COMPONENTS.ts";

function buildInitialLayout(widgets) {
    const COLS = 12;
    const rowMap = {};

    return widgets.map((widget) => {
        if (widget.min_width !== undefined && widget.min_height !== undefined) {
            return {
                i: String(widget.widget_code),
                x: widget.max_width,
                y: widget.max_height,
                w: widget.min_width,
                h: widget.min_height,

            };
        }

        let placed = { x: 0, y: 0 };
        for (let startCol = 0; startCol <= COLS - widget.cols; startCol++) {
            let maxRow = 0;
            for (let c = startCol; c < startCol + widget.cols; c++) {
                maxRow = Math.max(maxRow, rowMap[c] || 0);
            }
            placed = { x: startCol, y: maxRow };
            for (let c = startCol; c < startCol + widget.cols; c++) {
                rowMap[c] = maxRow + widget.rows;
            }
            break;
        }
        return {
            i: String(widget.uid),
            x: placed.x,
            y: placed.y,
            w: widget.cols,
            h: widget.rows,
            minW: 2,
            minH: 1,
        };
    });
}

const CATEGORY_COLORS = {
    Task:         { bg: "bg-blue-50",    border: "border-blue-200",    icon: "bg-blue-100",    bar: "bg-blue-300"    },
    Document:     { bg: "bg-violet-50",  border: "border-violet-200",  icon: "bg-violet-100",  bar: "bg-violet-300"  },
    SLA:          { bg: "bg-red-50",     border: "border-red-200",     icon: "bg-red-100",     bar: "bg-red-300"     },
    Analytics:    { bg: "bg-emerald-50", border: "border-emerald-200", icon: "bg-emerald-100", bar: "bg-emerald-300" },
    Notification: { bg: "bg-amber-50",   border: "border-amber-200",   icon: "bg-amber-100",   bar: "bg-amber-300"   },
    Custom:       { bg: "bg-slate-50",   border: "border-slate-200",   icon: "bg-slate-100",   bar: "bg-slate-300"   },
};

export function DashboardPreviewPage({ dashboard, widgets, onBack, onSave }) {
    const [layout,    setLayout]    = useState([]);
    const [isDirty,   setIsDirty]   = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    useEffect(() => {
        setLayout(buildInitialLayout(widgets));
    }, []);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        setIsDirty(true);
    };


    const handleSave = () => {
        const updated = widgets.map((w) => {
            const pos = layout.find((l) => l.i === String(w.uid));
            if (!pos) return w;
            return { ...w, cols: pos.w, rows: pos.h, gridX: pos.x, gridY: pos.y };
        });
        onSave(updated);
        setIsDirty(false);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
    };

    const GRID_WIDTH = 1200;
    const ROW_HEIGHT = 100;

    return (
        <div className="min-h-screen bg-slate-100">


            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">Preview</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{dashboard.role}</span>
                    {isDirty && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium animate-pulse">
              Unsaved changes
            </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        ← Back to Editor
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition shadow-sm ${
                            justSaved
                                ? "bg-emerald-500"
                                : isDirty
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-slate-300 cursor-default"
                        }`}
                    >
                        {justSaved ? "✓ Saved!" : "💾 Save Layout"}
                    </button>
                </div>
            </div>


            <div className="bg-white border-b border-slate-100 px-6 py-1.5 flex items-center gap-6 text-xs text-slate-400">
                <span>🖱️ Drag the header bar to move a widget</span>
                <span>↔️ Drag corners / edges to resize</span>
                <span>📐 {widgets.length} widget{widgets.length !== 1 ? "s" : ""} on canvas</span>
            </div>


            <div className="p-6 overflow-x-auto">
                {widgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-center text-slate-400">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="font-semibold text-slate-500">No widgets on canvas</p>
                        <p className="text-sm mt-1">Go back to the editor and add some widgets first.</p>
                    </div>
                ) : (
                    <GridLayout
                        layout={layout}
                        cols={12}
                        rowHeight={ROW_HEIGHT}
                        width={GRID_WIDTH}
                        onLayoutChange={handleLayoutChange}
                        isDraggable
                        isResizable
                        resizeHandles={["se", "sw", "ne", "nw", "e", "w", "s", "n"]}
                        margin={[12, 12]}
                        containerPadding={[0, 0]}
                        compactType="vertical"
                        draggableHandle=".drag-handle"
                    >
                        {widgets.map((widget) => {
                            const colors = CATEGORY_COLORS[widget.category] || CATEGORY_COLORS.Custom;
                            const WidgetComponent = WIDGET_COMPONENTS[widget.widget_code]; // ← look up component

                            return (
                                <div key={String(widget.uid)}>
                                    <div className={`h-full flex flex-col rounded-xl border-2 ${colors.border} bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>

                                        {/!* Drag handle *!/}
                                        <div className={`drag-handle flex items-center gap-2 px-3 py-2 ${colors.bg} border-b ${colors.border} cursor-grab active:cursor-grabbing select-none`}>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{widget.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{widget.category} · {widget.component}</p>
                                            </div>
                                            <span className="text-slate-300 text-sm">⠿</span>
                                        </div>

                                        {/!* Body — render matched component or fallback *!/}
                                        <div className="flex-1 overflow-auto p-2">
                                            {WidgetComponent ? (
                                                <WidgetComponent />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                                                    ⚠️ Unknown widget: {widget.widget_code}
                                                </div>
                                            )}
                                        </div>

                                        {/!* Resize corner *!/}
                                        <div className="flex justify-end px-2 pb-1 select-none">
                                            <span className="text-slate-200 text-xs">↘</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </GridLayout>
                )}
            </div>
        </div>
    );
}*/
/*

import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { WIDGET_COMPONENTS } from "../../WIDGET_COMPONENTS.ts";

function buildInitialLayout(widgets) {

    return widgets.map((widget) => ({
        i: String(widget.id),

        // saved position
        x: widget.pos_x ?? 0,
        y: widget.pos_y ?? 0,

        // saved size
        w: widget.width ?? widget.min_width ?? 3,
        h: widget.height ?? widget.min_height ?? 2,

        minW: widget.min_width ?? 2,
        minH: widget.min_height ?? 1,

        maxW: widget.max_width ?? 12,
        maxH: widget.max_height ?? 12,
    }));
}

const CATEGORY_COLORS = {
    Task: {
        bg: "bg-blue-50",
        border: "border-blue-200",
    },

    Document: {
        bg: "bg-violet-50",
        border: "border-violet-200",
    },

    SLA: {
        bg: "bg-red-50",
        border: "border-red-200",
    },

    Analytics: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
    },

    Notification: {
        bg: "bg-amber-50",
        border: "border-amber-200",
    },

    Custom: {
        bg: "bg-slate-50",
        border: "border-slate-200",
    },
};

export function DashboardPreviewPage({
                                         dashboard,
                                         widgets,
                                         onBack,
                                         onSave,
                                     }) {

    const [layout, setLayout] = useState([]);

    const [isDirty, setIsDirty] = useState(false);

    const [justSaved, setJustSaved] = useState(false);

    // load saved layout
    useEffect(() => {

        const savedLayout = localStorage.getItem(
            `dashboard-layout-${dashboard.id}`
        );

        if (savedLayout) {

            setLayout(JSON.parse(savedLayout));

        } else {

            setLayout(buildInitialLayout(widgets));
        }

    }, [widgets, dashboard.id]);

    // update layout when moved/resized
    const handleLayoutChange = (newLayout) => {

        setLayout(newLayout);

        setIsDirty(true);
    };

    // save layout
    const handleSave = () => {

        // save to localStorage
        localStorage.setItem(
            `dashboard-layout-${dashboard.id}`,
            JSON.stringify(layout)
        );

        // convert for backend
        const dashboardWidgets = layout.map((item) => {

            const widget = widgets.find(
                (w) => String(w.id) === item.i
            );

            return {
                dashboard: dashboard.id,

                widget: Number(item.i),

                category: widget?.category || "Custom",

                pos_x: item.x,
                pos_y: item.y,

                width: item.w,
                height: item.h,
            };
        });

        console.log("SAVE TO BACKEND:");
        console.log(dashboardWidgets);

        // send to parent/backend
        onSave(dashboardWidgets);

        setIsDirty(false);

        setJustSaved(true);

        setTimeout(() => {
            setJustSaved(false);
        }, 2000);
    };

    const GRID_WIDTH = 1200;

    const ROW_HEIGHT = 100;

    return (
        <div className="min-h-screen bg-slate-100">

            {/!* HEADER *!/}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">

                <div className="flex items-center gap-2 flex-wrap">

                    <h1 className="text-base font-bold text-slate-800">
                        {dashboard.name}
                    </h1>

                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                        Preview
                    </span>

                    {isDirty && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium animate-pulse">
                            Unsaved changes
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        ← Back to Editor
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition shadow-sm ${
                            justSaved
                                ? "bg-emerald-500"
                                : isDirty
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-slate-300 cursor-default"
                        }`}
                    >
                        {justSaved ? "✓ Saved!" : "💾 Save Layout"}
                    </button>
                </div>
            </div>

            {/!* INFO BAR *!/}
            <div className="bg-white border-b border-slate-100 px-6 py-1.5 flex items-center gap-6 text-xs text-slate-400">

                <span>🖱️ Drag widgets</span>

                <span>↔️ Resize widgets</span>

                <span>
                    📐 {widgets.length} widget
                    {widgets.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/!* GRID *!/}
            <div className="p-6 overflow-x-auto">

                {widgets.length === 0 ? (

                    <div className="flex flex-col items-center justify-center h-60 text-center text-slate-400">

                        <div className="text-4xl mb-3">
                            📭
                        </div>

                        <p className="font-semibold text-slate-500">
                            No widgets on canvas
                        </p>

                    </div>

                ) : (

                    <GridLayout
                        layout={layout}
                        cols={12}
                        rowHeight={ROW_HEIGHT}
                        width={GRID_WIDTH}
                        onLayoutChange={handleLayoutChange}
                        isDraggable
                        isResizable
                        resizeHandles={[
                            "se",
                            "sw",
                            "ne",
                            "nw",
                            "e",
                            "w",
                            "s",
                            "n",
                        ]}
                        margin={[12, 12]}
                        containerPadding={[0, 0]}
                        compactType="vertical"
                        draggableHandle=".drag-handle"
                    >

                        {widgets.map((widget) => {

                            const colors =
                                CATEGORY_COLORS[widget.category]
                                || CATEGORY_COLORS.Custom;

                            const WidgetComponent =
                                WIDGET_COMPONENTS[
                                    widget.widget_code
                                    ];

                            return (
                                <div key={String(widget.id)}>

                                    <div
                                        className={`
                                            h-full
                                            flex
                                            flex-col
                                            rounded-xl
                                            border-2
                                            ${colors.border}
                                            bg-white
                                            overflow-hidden
                                            shadow-sm
                                            hover:shadow-md
                                            transition-shadow
                                        `}
                                    >

                                        {/!* DRAG HEADER *!/}
                                        <div
                                            className={`
                                                drag-handle
                                                flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-2
                                                ${colors.bg}
                                                border-b
                                                ${colors.border}
                                                cursor-grab
                                                active:cursor-grabbing
                                                select-none
                                            `}
                                        >

                                            <div className="flex-1 min-w-0">

                                                <p className="text-xs font-bold text-slate-800 truncate">
                                                    {widget.name}
                                                </p>

                                                <p className="text-xs text-slate-400 truncate">
                                                    {widget.category}
                                                </p>
                                            </div>

                                            <span className="text-slate-300 text-sm">
                                                ⠿
                                            </span>
                                        </div>

                                        {/!* BODY *!/}
                                        <div className="flex-1 overflow-auto p-2">

                                            {WidgetComponent ? (

                                                <WidgetComponent />

                                            ) : (

                                                <div className="flex items-center justify-center h-full text-slate-400 text-xs">

                                                    ⚠️ Unknown widget:
                                                    {" "}
                                                    {widget.widget_code}

                                                </div>
                                            )}
                                        </div>

                                        {/!* RESIZE ICON *!/}
                                        <div className="flex justify-end px-2 pb-1 select-none">

                                            <span className="text-slate-200 text-xs">
                                                ↘
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </GridLayout>
                )}
            </div>
        </div>
    );
}*/


import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { WIDGET_COMPONENTS } from "../../WIDGET_COMPONENTS.ts";

function buildInitialLayout(widgets) {

    return widgets.map((widget) => ({
        i: String(widget.id),

        x: widget.pos_x ?? 0,
        y: widget.pos_y ?? 0,

        w: widget.width ?? widget.min_width ?? 3,
        h: widget.height ?? widget.min_height ?? 2,

        minW: widget.min_width ?? 2,
        minH: widget.min_height ?? 1,

        maxW: widget.max_width ?? 12,
        maxH: widget.max_height ?? 12,
    }));
}

const CATEGORY_COLORS = {
    Task: {
        bg: "bg-blue-50",
        border: "border-blue-200",
    },

    Document: {
        bg: "bg-violet-50",
        border: "border-violet-200",
    },

    SLA: {
        bg: "bg-red-50",
        border: "border-red-200",
    },

    Analytics: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
    },

    Notification: {
        bg: "bg-amber-50",
        border: "border-amber-200",
    },

    Custom: {
        bg: "bg-slate-50",
        border: "border-slate-200",
    },
};

export function DashboardPreviewPage({
                                         dashboard,
                                         widgets,
                                         onBack,
                                         onSave,
                                     }) {

    const [layout, setLayout] = useState([]);

    const [isDirty, setIsDirty] = useState(false);

    const [justSaved, setJustSaved] = useState(false);

    // load saved layout
    useEffect(() => {

        const savedLayout = localStorage.getItem(
            `dashboard-layout-${dashboard.id}`
        );

        if (savedLayout) {

            setLayout(JSON.parse(savedLayout));

        } else {

            setLayout(buildInitialLayout(widgets));
        }

    }, [widgets, dashboard.id]);

    // layout changed
    const handleLayoutChange = (newLayout) => {

        setLayout(newLayout);

        setIsDirty(true);
    };

    // save only widget layout
    const handleSaveLayout = () => {

        const updatedWidgets = widgets.map((widget) => {

            const layoutItem = layout.find(
                (l) => l.i === String(widget.id)
            );

            if (!layoutItem) return widget;

            return {
                ...widget,

                pos_x: layoutItem.x,
                pos_y: layoutItem.y,

                width: layoutItem.w,
                height: layoutItem.h,
            };
        });

        // save layout locally
        localStorage.setItem(
            `dashboard-layout-${dashboard.id}`,
            JSON.stringify(layout)
        );

        console.log("UPDATED WIDGETS:");
        console.log(updatedWidgets);

        // send updated widgets back to canvas page
        onSave(updatedWidgets);

        setIsDirty(false);

        setJustSaved(true);

        // navigate back
        setTimeout(() => {

            onBack();

        }, 500);
    };

    const GRID_WIDTH = 1200;

    const ROW_HEIGHT = 100;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">

                <div className="flex items-center gap-2 flex-wrap">

                    <h1 className="text-base font-bold text-slate-800">
                        {dashboard.name}
                    </h1>

                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                        Preview
                    </span>

                    {isDirty && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium animate-pulse">
                            Unsaved changes
                        </span>
                    )}

                    {justSaved && (
                        <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                            Saved
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                        ← Back to Editor
                    </button>

                    <button
                        onClick={handleSaveLayout}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        Save Layout
                    </button>
                </div>
            </div>

            {/* INFO BAR */}
            <div className="bg-white border-b border-slate-100 px-6 py-1.5 flex items-center gap-6 text-xs text-slate-400">

                <span>🖱️ Drag widgets</span>

                <span>↔️ Resize widgets</span>

                <span>
                    📐 {widgets.length} widget
                    {widgets.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* GRID */}
            <div className="p-6 overflow-x-auto">

                {widgets.length === 0 ? (

                    <div className="flex flex-col items-center justify-center h-60 text-center text-slate-400">

                        <div className="text-4xl mb-3">
                            📭
                        </div>

                        <p className="font-semibold text-slate-500">
                            No widgets on canvas
                        </p>
                    </div>

                ) : (

                    <GridLayout
                        layout={layout}
                        cols={12}
                        rowHeight={ROW_HEIGHT}
                        width={GRID_WIDTH}
                        onLayoutChange={handleLayoutChange}
                        isDraggable
                        isResizable
                        resizeHandles={[
                            "se",
                            "sw",
                            "ne",
                            "nw",
                            "e",
                            "w",
                            "s",
                            "n",
                        ]}
                        margin={[12, 12]}
                        containerPadding={[0, 0]}
                        compactType="vertical"
                        draggableHandle=".drag-handle"
                    >

                        {widgets.map((widget) => {

                            const colors =
                                CATEGORY_COLORS[widget.category]
                                || CATEGORY_COLORS.Custom;

                            const WidgetComponent =
                                WIDGET_COMPONENTS[
                                    widget.widget_code
                                    ];

                            return (
                                <div key={String(widget.id)}>

                                    <div
                                        className={`
                                            h-full
                                            flex
                                            flex-col
                                            rounded-xl
                                            border-2
                                            ${colors.border}
                                            bg-white
                                            overflow-hidden
                                            shadow-sm
                                            hover:shadow-md
                                            transition-shadow
                                        `}
                                    >

                                        {/* HEADER */}
                                        <div
                                            className={`
                                                drag-handle
                                                flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-2
                                                ${colors.bg}
                                                border-b
                                                ${colors.border}
                                                cursor-grab
                                                active:cursor-grabbing
                                                select-none
                                            `}
                                        >

                                            <div className="flex-1 min-w-0">

                                                <p className="text-xs font-bold text-slate-800 truncate">
                                                    {widget.name}
                                                </p>

                                                <p className="text-xs text-slate-400 truncate">
                                                    {widget.category}
                                                </p>
                                            </div>

                                            <span className="text-slate-300 text-sm">
                                                ⠿
                                            </span>
                                        </div>

                                        {/* BODY */}
                                        <div className="flex-1 overflow-auto p-2">

                                            {WidgetComponent ? (

                                                <WidgetComponent />

                                            ) : (

                                                <div className="flex items-center justify-center h-full text-slate-400 text-xs">

                                                    ⚠️ Unknown widget:
                                                    {" "}
                                                    {widget.widget_code}

                                                </div>
                                            )}
                                        </div>

                                        {/* RESIZE ICON */}
                                        <div className="flex justify-end px-2 pb-1 select-none">

                                            <span className="text-slate-200 text-xs">
                                                ↘
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </GridLayout>
                )}
            </div>
        </div>
    );
}