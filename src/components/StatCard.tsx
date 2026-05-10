// Reusable stat card used in both Overall Dashboard and Workflow Analytics
import type { StatCardProps } from "../types";

export default function StatCard({
  icon,
  value,
  label,
  description,
  color,
  small = false,
  loading = false,
  onClick,
}: StatCardProps) {
  const iconBg =
    color === "blue"
      ? "bg-blue-100"
      : color === "red"
        ? "bg-red-100"
        : "bg-green-100";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 ${
        small ? "p-4" : "p-6"
      } ${onClick ? "cursor-pointer hover:bg-slate-50" : ""}`}
    >
      <div
        className={`flex items-center justify-center ${
          small ? "w-10 h-10 text-lg" : "w-12 h-12 text-2xl"
        } rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <div>
        <div className="text-3xl font-bold text-slate-900">
          {loading ? (
            <span className="text-3xl font-bold text-slate-400 animate-pulse">
              …
            </span>
          ) : (
            (value ?? "—")
          )}
        </div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        {description && (
          <div className="text-xs text-slate-400">{description}</div>
        )}
      </div>
    </div>
  );
}
