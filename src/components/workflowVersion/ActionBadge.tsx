import React from "react";

const ACTION_STYLE: Record<string, string> = {
    Approve: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Review:  "bg-blue-50 text-blue-700 border border-blue-200",
    Sign:    "bg-violet-50 text-violet-700 border border-violet-200",
    Notify:  "bg-slate-50 text-slate-500 border border-slate-200",
    Reject:  "bg-red-50 text-red-600 border border-red-200",
};

interface Props {
    action: string;
}

export const ActionBadge: React.FC<Props> = ({ action }) => {
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${ACTION_STYLE[action] ?? "bg-slate-100 text-slate-500"}`}>
            {action}
        </span>
    );
};