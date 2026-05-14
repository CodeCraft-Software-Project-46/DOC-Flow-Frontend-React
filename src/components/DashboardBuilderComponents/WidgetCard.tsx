export function WidgetCard({ widget, isAdded, onAdd }) {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{widget.name}</p>
                <p className="text-xs text-slate-400 truncate">{widget.category}</p>
            </div>
            <button
                onClick={() => onAdd(widget)}
                disabled={isAdded}
                className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-lg border transition-all ${
                    isAdded
                        ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white"
                }`}
            >
                {isAdded ? "✓" : "+"}
            </button>
        </div>
    );
}