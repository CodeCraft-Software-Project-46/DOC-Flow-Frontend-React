import type { ActiveTasksDetailsProps } from "../../../types";

type Props = ActiveTasksDetailsProps;

export default function ActiveTasksDetails({ items, onClose }: Props) {
  const formatOverdue = (days?: number, hours?: number): string => {
    if (days === null || days === undefined) {
      return "-";
    }
    if (days >= 1) {
      const remainingHours = hours ? Math.round(hours % 24) : 0;
      return `${Math.floor(days)}d ${remainingHours}h`;
    }
    return `${Math.round(hours || 0)}h`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Premium Header */}
        <div className="bg-red-600 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Overdue Tasks</h2>
              <p className="text-red-100 text-sm mt-1">
                {items.length} task{items.length !== 1 ? "s" : ""} need
                {items.length !== 1 ? "" : "s"} attention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-110 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-auto flex-1 bg-slate-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="text-5xl mb-3 opacity-30">✅</span>
              <p className="text-lg font-medium">No Overdue Tasks</p>
              <p className="text-sm mt-1">
                All tasks are on track and within SLA
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-300 sticky top-0">
                <tr>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    ✓ Task
                  </th>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    ⏱️ Overdue
                  </th>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    👤 Role
                  </th>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    🏢 Department
                  </th>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    ⚙️ Workflow
                  </th>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    📌 Instance
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <td className="px-8 py-5 text-sm">
                      <div className="font-semibold text-slate-900">
                        {item.task_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {item.task_id}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {formatOverdue(item.overdue_days, item.overdue_hours)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.role || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.department || "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.workflow_name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.instance_name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-t-2 border-red-200 px-8 py-4 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Total:{" "}
              <span className="font-bold text-red-600">{items.length}</span>{" "}
              task{items.length !== 1 ? "s" : ""} overdue
            </p>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
