interface Props {
    items: any[];
    selectedUid: string | null;
    onSelect: (item: any) => void;
    onRemove: (uid: string) => void;
}

export function Canvas({ items, selectedUid, onSelect,onRemove }: Props) {
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
            {items.map((item) => (
                <div
                    key={item.widget_code}
                    onClick={() => onSelect(item)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedUid === item.uid
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}
                >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">
                                {item.width}col × {item.height}row
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                {item.name}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onRemove(item.uid)}
                            className="p-1 text-red-300 hover:text-red-500 ml-1"
                            title="Remove"
                        >🗑</button>
                    </div>
                </div>
            ))}
        </div>
    );
}