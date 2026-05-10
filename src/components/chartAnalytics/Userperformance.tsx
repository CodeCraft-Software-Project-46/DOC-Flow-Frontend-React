import { useEffect, useState } from "react";
import { fetchUserPerformance } from "../../services/analyticsApi";
import type { UserPerformanceItem } from "../../types";

type User = {
  name: string;
  compliance: number;
  avg: number;
  breaches: number;
  tasks: number;
};

function getComplianceStyles(compliance: number) {
  if (compliance >= 90) return { bar: "bg-green-500", text: "text-green-500" };
  if (compliance >= 75) return { bar: "bg-amber-500", text: "text-amber-500" };
  return { bar: "bg-red-500", text: "text-red-500" };
}

function getComplianceWidthClass(compliance: number) {
  const percentage = Math.max(0, Math.min(100, Math.round(compliance)));
  if (percentage >= 100) return "w-full";
  if (percentage >= 90) return "w-[90%]";
  if (percentage >= 80) return "w-[80%]";
  if (percentage >= 70) return "w-[70%]";
  if (percentage >= 60) return "w-[60%]";
  if (percentage >= 50) return "w-1/2";
  if (percentage >= 40) return "w-[40%]";
  if (percentage >= 30) return "w-[30%]";
  if (percentage >= 20) return "w-1/5";
  if (percentage >= 10) return "w-[10%]";
  return "w-0";
}

export default function UserPerformance() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchUserPerformance();
        const raw = Array.isArray(res) ? res : (res.data ?? []);

        if (!Array.isArray(raw)) {
          setUsers([]);
          return;
        }

        const formatted: User[] = (raw as UserPerformanceItem[])
          .map((item) => ({
            name: item.user_name || "Unknown",
            compliance: item.sla_compliance ?? 0,
            avg: item.avg_completion_time_hours ?? 0,
            breaches: item.breached_tasks ?? 0,
            tasks: item.total_tasks ?? 0,
          }))
          .sort((a, b) => b.compliance - a.compliance);

        setUsers(formatted);
      } catch (err) {
        console.error("Failed to load user performance", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">
        👤 SLA Compliance by User
      </div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Sorted by Compliance Rate
      </div>

      <div className="flex flex-col gap-5 min-h-[160px]">
        {loading ? (
          <div className="flex items-center min-h-[160px] text-xs text-slate-400">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center min-h-[160px] text-xs text-slate-400">
            No user data available
          </div>
        ) : (
          users.map((user, index) => {
            const styles = getComplianceStyles(user.compliance);
            const widthClass = getComplianceWidthClass(user.compliance);

            return (
              <div key={user.name} className="bg-white">
                {/* Top Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-5">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </span>
                  </div>

                  <span className={`text-sm font-bold ${styles.text}`}>
                    {user.compliance}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all ${styles.bar} ${widthClass}`}
                  />
                </div>

                {/* Stats */}
                <div className="text-xs text-slate-400">
                  {user.avg}h avg · {user.breaches} breaches · {user.tasks}{" "}
                  tasks
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          ≥90% Excellent
        </span>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          75–89% Good
        </span>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          &lt;75% At Risk
        </span>
      </div>
    </div>
  );
}
