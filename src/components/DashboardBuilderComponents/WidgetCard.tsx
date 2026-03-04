type WidgetCardProps = {
    icon: string;
    title: string;
    description: string;
    category: string;
    stats: string;
    onAdd: () => void;
    isAdded?: boolean;
};

export default function WidgetCard({
                                       icon,
                                       title,
                                       description,
                                       category,
                                       stats,
                                       onAdd,
                                       isAdded = false,
                                   }: WidgetCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200">

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-lg">
                    {icon}
                </div>

                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                        {title}
                    </p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
            {category}
          </span>
                </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
                {description}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
          {stats}
        </span>

                <button
                    onClick={onAdd}
                    disabled={isAdded}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all duration-200 ${
                        isAdded
                            ? "bg-blue-600 text-white border-blue-600 cursor-not-allowed"
                            : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                >
                    {isAdded ? "✓ Added" : "+ Add"}
                </button>
            </div>
        </div>
    );
}