
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WIDGET_COMPONENTS } from "../../WIDGET_COMPONENTS.ts";

export function DashboardRenderer({ widgets }) {

    //to converts widget data into the format required by react-grid-layout
    const layout = widgets.map(w => ({
        i: String(w.id),
        x: w.pos_x,
        y: w.pos_y,
        w: w.width,
        h: w.height,
    }));

    return (
        <div className="p-4">
            <GridLayout
               /* to tell where widgets should appear*/
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                isDraggable={false}
                isResizable={false}
            >
                {/*this writes for loading actual widgets by check mapping file*/}
                {widgets.map(widget => {

                    const Component = WIDGET_COMPONENTS[widget.widget_code];

                    return (
                        <div
                            key={String(widget.id)}
                            className="bg-white rounded-xl shadow border overflow-hidden"
                        >
                            {Component ? (
                                <Component />
                            ) : (
                                <div className="p-4 text-red-500 text-sm">
                                    Unknown widget: {widget.widget_code}
                                </div>
                            )}
                        </div>
                    );
                })}
            </GridLayout>
        </div>
    );
}