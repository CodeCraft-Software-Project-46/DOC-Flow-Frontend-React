import {useState, useEffect, useCallback} from "react";
import {WidgetLibrary} from "./WidgetLibrary";
import {Canvas} from "./Canvas";
import {DashboardPreviewPage} from "./DashBoardPreviewPage.tsx";
import type {Dashboard} from "../../model/Dashboard.ts";
import {dashboardService} from "../../service/DashbaordService.ts";

interface Props {
    dashboard: Dashboard;
    onBack: () => void;
}

export function DashboardCanvasPage({
                                        dashboard,
                                        onBack,
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

    //for loading initial data
    useEffect(() => {

        const loadDashboard = async () => {

            try {
                // for load dashboard for update
                if (dashboard.id) {
                    const fullDashboard = await dashboardService.getDashboard(dashboard.id);

                    console.log("Loaded dashboard:");
                    console.log(fullDashboard);

                    const widgets = fullDashboard.widgets || [];

                    setCanvasItems(widgets);

                    setAddedWidgetCodes(
                        widgets.map(
                            (w: any) => w.widget_code)
                    );

                } else {
                    // for a new dashboard
                    setCanvasItems([]);
                    setAddedWidgetCodes([]);
                }

            } catch (err) {

                console.error(
                    " Failed loading dashboard:",
                    err
                );
            }
        };

        loadDashboard();

    }, [dashboard.id]);

    // to add widget
    const handleAdd = useCallback(
        (widget: any) => {

            // to block duplicates
            if (
                addedWidgetCodes.includes(
                    widget.widget_code
                )
            ) {

                console.log(
                    "Widget already added"
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

    //to remove widget
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
            selectedWidgetCode === widget_code
        ) {
            setSelectedWidgetCode(null);
        }

        setSaved(false);
    };


    //to update dashboard with widgets and their layout
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
            // to update a dashboard
            if (dashboard.id) {
                res = await dashboardService.updateDashboard(
                    dashboard.id,
                    payload
                );

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

    //to preview layout
    if (isPreview) {

        return (
            <DashboardPreviewPage
                dashboard={dashboard}
                widgets={canvasItems}
                onBack={() =>
                    setIsPreview(false)
                }
                onSave={(updatedWidgets: any) => {
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

            {/* left side-widget library*/}
            <div className="w-2/5 bg-white border-r">

                <WidgetLibrary
                    role_id={dashboard.role_id}
                    onAdd={handleAdd}
                    canvasItems={canvasItems}
                />
            </div>

            {/* right -canvas*/}
            <div className="flex-1 flex flex-col w-3/5">

                {/* to add buttons -back,preview */}
                <div className="flex justify-between items-center p-4 bg-white border-b">

                    {/* to back to builder page */}
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

                {/* canvas */}
                <div className="flex-1 p-6 overflow-auto">

                    <Canvas
                        items={canvasItems}
                        selectedUid={
                            selectedWidgetCode
                        }
                        onSelect={(item: any) =>
                            setSelectedWidgetCode(
                                item.widget_code
                            )
                        }
                        onRemove={handleRemove}
                    />
                </div>
            </div>
        </div>
    );
}