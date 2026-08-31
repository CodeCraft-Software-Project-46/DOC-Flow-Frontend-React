import type {DashboardStatus} from "../../model/Dashboard.ts";

interface Props {
    status: DashboardStatus;
}
const STATUS_STYLES = {
    Active:   "bg-emerald-50 text-emerald-700 border border-green-200",
    Draft:    "bg-amber-50 text-amber-700 border border-amber-200",
    Disabled: "bg-slate-100 text-slate-500 border border-slate-200",
};

export function StatusBadge({ status }:Props) {
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status] || STATUS_STYLES.Draft}`}>
      {status}
    </span>
    );
}