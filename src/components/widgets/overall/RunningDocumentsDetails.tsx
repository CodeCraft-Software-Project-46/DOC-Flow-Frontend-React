import type { RunningDocumentsDetailsProps } from "../../../types";

type Props = RunningDocumentsDetailsProps;

export default function RunningDocumentsDetails({ items, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Premium Header */}
        <div className="bg-blue-600 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Running Documents
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {items.length} active document{items.length !== 1 ? "s" : ""}
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
              <span className="text-5xl mb-3 opacity-30">📭</span>
              <p className="text-lg font-medium">No Running Documents</p>
              <p className="text-sm mt-1">
                All documents are in their final stages
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-300 sticky top-0">
                <tr>
                  <th className="text-left px-8 py-4 font-bold text-slate-700 text-sm uppercase tracking-wider">
                    📋 Document
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
                        {item.document_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {item.document_id}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.workflow_name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
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
          <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Total:{" "}
              <span className="font-bold text-blue-600">{items.length}</span>{" "}
              documents in process
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
