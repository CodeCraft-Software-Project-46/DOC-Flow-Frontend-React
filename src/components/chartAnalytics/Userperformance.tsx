// Shows SLA compliance per user sorted by compliance rate

import { USER_SLA } from "../../data/dummyData";

// Better: return structured styles instead of splitting strings
function getComplianceStyles(compliance: number) {
  if (compliance >= 90) {
    return {
      bar: "bg-green-500",
      text: "text-green-500",
    };
  }

  if (compliance >= 75) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-500",
    };
  }

  return {
    bar: "bg-red-500",
    text: "text-red-500",
  };
}

export default function UserPerformance() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Title */}
      <div className="font-semibold text-slate-900 text-base">
        👤 SLA Compliance by User
      </div>
      <div className="text-xs text-slate-400 mt-1 mb-5">
        Sorted by Compliance Rate
      </div>

      {/* User List */}
      <div className="flex flex-col gap-5">
        {USER_SLA.map((user) => {
          const styles = getComplianceStyles(user.compliance);

          return (
            <div key={user.name}> {/*key is NOT visible in UI Identify each row/*/}
              {/* Top Row: Name + % */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
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
                  className={`h-full rounded-full transition-all ${styles.bar}`}
                  style={{ width: `${user.compliance}%` }} // ✅ dynamic width (professional)
                />
              </div>

              {/* Stats */}
              <div className="text-xs text-slate-400">
                {user.avg}h avg · {user.breaches} breaches · {user.tasks} tasks
              </div>
            </div>
          );
        })}
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