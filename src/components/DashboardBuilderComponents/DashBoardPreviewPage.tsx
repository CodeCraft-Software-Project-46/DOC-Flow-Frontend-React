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

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                {/* Dashboard Title */}
                <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-slate-800">{dashboard.name}</h1>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
      Draft
    </span>
                </div>

                {/* righ side btns */}
                <div className="flex items-center gap-3">
                    {/* navigates back to canvas */}
                    <button
                        onClick={onBack}  // back to Canvas page
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        ✏️ Edit
                    </button>

                    {/* disabled in preview page */}
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
};