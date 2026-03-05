/*
import React from "react";
import type {CanvasItem} from "./Canvas.tsx";


interface Props {
    selected: CanvasItem | null;
    onUpdate: (updated: CanvasItem) => void;
}

const SIZE_PRESETS: Record<string, { cols: number; rows: number }> = {
    Small:  { cols: 4, rows: 2 },
    Medium: { cols: 6, rows: 2 },
    Large:  { cols: 8, rows: 3 },
};

const ConfigPanel: React.FC<Props> = ({ selected, onUpdate }) => {
    if (!selected) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <div className="text-3xl mb-2">🎛️</div>
                <p className="text-sm font-semibold text-slate-600">No widget selected</p>
                <p className="text-xs text-slate-400 mt-1">
                    Click a widget on the canvas to configure it
                </p>
            </div>
        );
    }

    const currentSize =
        Object.entries(SIZE_PRESETS).find(
            ([, v]) => v.cols === selected.cols && v.rows === selected.rows
        )?.[0] || "Custom";

    return (
        <div className="flex flex-col gap-5">
            {/!* Title *!/}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Title
                </label>
                <input
                    value={selected.title}
                    onChange={(e) => onUpdate({ ...selected, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 text-slate-800"
                />
            </div>

            {/!* Size presets *!/}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Size
                </label>
                <div className="flex gap-2">
                    {["Small", "Medium", "Large"].map((s) => (
                        <button
                            key={s}
                            onClick={() => onUpdate({ ...selected, ...SIZE_PRESETS[s] })}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                                currentSize === s
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-slate-200 text-slate-500 hover:border-blue-300"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/!* Width / Height *!/}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Width (cols)
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={12}
                        value={selected.cols}
                        onChange={(e) => onUpdate({ ...selected, cols: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 text-slate-800"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Height (rows)
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={6}
                        value={selected.rows}
                        onChange={(e) => onUpdate({ ...selected, rows: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 text-slate-800"
                    />
                </div>
            </div>

            {/!* Data Source *!/}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Data Source
                </label>
                <select
                    value={selected.dataSource}
                    onChange={(e) => onUpdate({ ...selected, dataSource: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 text-slate-700 bg-white"
                >
                    <option value="current user">Current User</option>
                    <option value="all users">All Users</option>
                    <option value="all depts">All Departments</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

            {/!* Category *!/}
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Category
                </label>
                <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
          {selected.category}
        </span>
            </div>
        </div>
    );
};

export default ConfigPanel;*/


export function ConfigPanel({ selected, onUpdate }) {
    if (!selected) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="text-2xl mb-2">🖱️</div>
                <p className="text-xs text-slate-400">Click a widget on the canvas to configure it</p>
            </div>
        );
    }

    const update = (key, value) => onUpdate({ ...selected, [key]: value });

    return (
        <div className="space-y-4">
            {/* Widget identity */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">{selected.icon}</span>
                <div>
                    <p className="text-sm font-bold text-slate-800">{selected.title}</p>
                    <p className="text-xs text-slate-500">{selected.category}</p>
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Widget Title</label>
                <input
                    type="text"
                    value={selected.title}
                    onChange={e => update("title", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                />
            </div>

            {/* Cols slider */}
            <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Width (cols) — <span className="text-blue-600">{selected.cols}</span> / 12
                </label>
                <input
                    type="range" min={2} max={12} step={2} value={selected.cols}
                    onChange={e => update("cols", Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>2</span><span>12</span></div>
            </div>

            {/* Rows slider */}
            <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Height (rows) — <span className="text-blue-600">{selected.rows}</span>
                </label>
                <input
                    type="range" min={1} max={6} step={1} value={selected.rows}
                    onChange={e => update("rows", Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>1</span><span>6</span></div>
            </div>

           {/*  Data Source
            <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Data Source</label>
                <select
                    value={selected.dataSource}
                    onChange={e => update("dataSource", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                >
                    <option value="current user">Current User</option>
                    <option value="all users">All Users</option>
                    <option value="all depts">All Departments</option>
                    <option value="custom">Custom</option>
                </select>
            </div>*/}

            {/* Size preview bar */}
            <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                    Size: <span className="font-semibold text-blue-600">{selected.cols}/12 cols</span> × <span className="font-semibold text-blue-600">{selected.rows} rows</span>
                </p>
                <div className="mt-2 bg-slate-100 rounded-lg h-3 overflow-hidden">
                    <div
                        className="h-full bg-blue-400 rounded-lg transition-all duration-300"
                        style={{ width: `${(selected.cols / 12) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}