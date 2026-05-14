import type { ActiveTasksDetailsProps } from "../../../types";

type Props = ActiveTasksDetailsProps;

export default function ActiveTasksDetails({ items, onClose }: Props) {
  const formatOverdue = (days?: number, hours?: number): string => {
    if (days === null || days === undefined) {
      return "-";
    }
    if (days >= 1) { //If overdue is 1 day or more, show in "Xd Yh" format
      const remainingHours = hours ? Math.round(hours % 24) : 0;
      return `${Math.floor(days)}d ${remainingHours}h`;
    }
    return `${Math.round(hours || 0)}h`;
  };

return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Overdue Tasks</h2>
            <p className="text-sm text-red-100 mt-1">
              {items.length} task{items.length !== 1 ? "s" : ""} need attention
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-xl px-3 py-1 hover:bg-red-700 rounded"
          >
            ✕
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 bg-gray-50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <span className="text-4xl mb-2">✔</span>
              <p className="text-base font-medium">No Overdue Tasks</p>
              <p className="text-sm">All tasks are on track</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr className="text-left text-sm text-gray-700">
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Document</th>
                  <th className="px-6 py-3">Overdue</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Workflow</th>
                  <th className="px-6 py-3">Instance</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{item.task_name}</div>
                      <div className="text-xs text-gray-500">
                        ID: {item.task_id}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.document_name || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      {formatOverdue(item.overdue_days, item.overdue_hours)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.status || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.username || item.user_name || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.role || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.department || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.workflow_name}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.instance_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-100 px-6 py-3 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Total: <span className="font-semibold">{items.length}</span> overdue tasks
            </p>

            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
