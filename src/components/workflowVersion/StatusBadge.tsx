import React from "react";

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
    Active:     { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    Draft:      { badge: "bg-amber-100 text-amber-600 border border-amber-200",       dot: "bg-amber-400"   },
    Archived:   { badge: "bg-slate-100 text-slate-500 border border-slate-200",       dot: "bg-slate-400"   },
    Deprecated: { badge: "bg-red-100 text-red-500 border border-red-200",             dot: "bg-red-400"     },
};

interface Props {
    status: string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.Archived;

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
};