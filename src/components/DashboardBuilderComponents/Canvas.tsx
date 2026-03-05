/*
import React from "react";
import type {Widget} from "./WidgetItemList.tsx";


interface CanvasItem extends Widget {
    uid: number;
    id: number;
    title: string;
    cols: number;
    rows: number;
    dataSource: string;
    category: string;
}

interface Props {
    widgets: CanvasItem[];
    selectedUid: number | null;
    onSelect: (item: CanvasItem) => void;
    onMoveUp: (uid: number) => void;
    onMoveDown: (uid: number) => void;
    onRemove: (uid: number) => void;
}

// ── Canvas Row ────────────────────────────────
function CanvasRow({
                       item,
                       isSelected,
                       onSelect,
                       onMoveUp,
                       onMoveDown,
                       onRemove,
                   }: {
    item: CanvasItem;
    isSelected: boolean;
    onSelect: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
}) {
    return (
        <div
            onClick={onSelect}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
        >
            {/!* Drag handle *!/}
            <span className="text-slate-300 text-base select-none">⠿</span>

            {/!* Icon *!/}
            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {item.icon}
            </div>

            {/!* Info *!/}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-400">
            {item.cols}col × {item.rows}row
          </span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {item.dataSource}
          </span>
                </div>
            </div>

            {/!* Actions *!/}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onMoveUp}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors text-xs"
                    title="Move up"
                >
                    ▲
                </button>
                <button
                    onClick={onMoveDown}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors text-xs"
                    title="Move down"
                >
                    ▼
                </button>
                <button
                    onClick={onRemove}
                    className="p-1 text-red-300 hover:text-red-500 transition-colors ml-1"
                    title="Remove"
                >
                    🗑
                </button>
            </div>
        </div>
    );
}

// ── Canvas ────────────────────────────────────
const Canvas: React.FC<Props> = ({
                                     widgets,
                                     selectedUid,
                                     onSelect,
                                     onMoveUp,
                                     onMoveDown,
                                     onRemove,
                                 }) => {
    if (widgets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl">
                <div className="text-3xl mb-2">📐</div>
                <p className="text-sm font-semibold text-slate-500">Canvas is empty</p>
                <p className="text-xs mt-1">Add widgets from the library</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {widgets.map((item) => (
                <CanvasRow
                    key={item.uid}
                    item={item}
                    isSelected={selectedUid === item.uid}
                    onSelect={() => onSelect(item)}
                    onMoveUp={() => onMoveUp(item.uid)}
                    onMoveDown={() => onMoveDown(item.uid)}
                    onRemove={() => onRemove(item.uid)}
                />
            ))}
        </div>
    );
};

export default Canvas;
export type { CanvasItem };*/


export function Canvas({ items, selectedUid, onSelect, onMoveUp, onMoveDown, onRemove }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-slate-300 rounded-xl">
                <div className="text-3xl mb-2">📐</div>
                <p className="text-sm font-semibold text-slate-500">Canvas is empty</p>
                <p className="text-xs text-slate-400 mt-1">Add widgets from the library on the left</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {items.map(item => (
                <div
                    key={item.uid}
                    onClick={() => onSelect(item)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedUid === item.uid
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}
                >
                    {/* Drag handle */}
                    <span className="text-slate-300 text-sm select-none">⠿</span>

                    {/* Icon */}
                    <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                        {item.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{item.cols}col × {item.rows}row</span>
                            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{item.dataSource}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => onMoveUp(item.uid)}   className="p-1 text-slate-400 hover:text-blue-600 text-xs" title="Move up">▲</button>
                        <button onClick={() => onMoveDown(item.uid)} className="p-1 text-slate-400 hover:text-blue-600 text-xs" title="Move down">▼</button>
                        <button onClick={() => onRemove(item.uid)}   className="p-1 text-red-300 hover:text-red-500 ml-1"      title="Remove">🗑</button>
                    </div>
                </div>
            ))}
        </div>
    );
}