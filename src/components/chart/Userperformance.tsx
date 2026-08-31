// Shows SLA compliance per user sorted by compliance rate



// Returns color based on compliance percentage
import {USER_SLA} from "../../../sampleData/dummyData.ts";

function getComplianceColorClass(compliance: number): string {
  if (compliance >= 90) return "bg-green-500 text-green-500";
  if (compliance >= 75) return "bg-amber-500 text-amber-500";
  return "bg-red-500 text-red-500";
}

function getComplianceWidthClass(compliance: number): string {
  if (compliance < 25) return "w-1/4";
  if (compliance < 50) return "w-2/4";
  if (compliance < 75) return "w-3/4";
  return "w-full";
}

export default function UserSLAList() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="font-semibold text-slate-900 text-base">👤 SLA Compliance by User</div>
      <div className="text-xs text-slate-400 mt-1 mb-5">Sorted by Compliance Rate</div>

      <div className="flex flex-col gap-5">
        {USER_SLA.map((user:any) => (
          <div key={user.name}>

            {/* Name row + compliance % */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Avatar circle */}
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {user.name[0]}
                </div>
                <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              </div>
              <span className={`text-sm font-bold ${getComplianceColorClass(user.compliance).split(" ")[1]}`}>
                {user.compliance}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${getComplianceWidthClass(user.compliance)} ${getComplianceColorClass(user.compliance).split(" ")[0]}`}
              />
            </div>

            {/* Stats row */}
            <div className="text-xs text-slate-400">
              {user.avg}h avg · {user.breaches} breaches · {user.tasks} tasks
            </div>

          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> ≥90% Excellent
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 75–89% Good
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt;75% At Risk
        </span>
      </div>
    </div>
  );
}