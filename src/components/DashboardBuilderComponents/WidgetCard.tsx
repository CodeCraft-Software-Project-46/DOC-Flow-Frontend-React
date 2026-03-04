type WidgetCardProps = {
    icon: string;
    title: string;
    description: string;
    category: string;
    stats: string;
    onAdd: () => void;
    isAdded?: boolean;
};

export function WidgetCard({ widget, isAdded, onAdd }: { widget: Widget; isAdded: boolean; onAdd: (w: Widget) => void }) {
    return (
        <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 hover:bg-blue-50 transition-colors">
            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                {widget.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{widget.title}</p>
                <p className="text-xs text-slate-400 truncate">{widget.description}</p>
            </div>
            <button
                onClick={() => onAdd(widget)}
                disabled={isAdded}
                className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200 ${
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