import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import { WIDGET_COMPONENTS } from "../../WIDGET_COMPONENTS.ts";

interface Props {
    dashboard: {
        id: number;
        name: string;
        description?: string;
        role_id?: number;
        status?: string;
    };

    widgets: any[];

    onBack: () => void;

    onSave: (widgets: any[]) => void;
}

function buildInitialLayout(widgets:any) {

    return widgets.map((widget:any) => ({
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
                                     }:Props) {

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
    const handleLayoutChange = (newLayout:any) => {

        setLayout(newLayout);
        setIsDirty(true);
    };

    // save only widget layout
    const handleSaveLayout = () => {

        const updatedWidgets = widgets.map((widget) => {

            const layoutItem:any = layout.find(
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
                            //for defines resize directions
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
                        compactType="vertical" //for removes empty gaps
                        draggableHandle=".drag-handle"
                    >

                        {widgets.map((widget) => {

                            const colors= CATEGORY_COLORS[widget.category] || CATEGORY_COLORS.Custom;

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
                                        `} >

                                        {/* header */}
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

                                        {/* actual component */}
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

                                        {/*for resizing widgets*/}
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