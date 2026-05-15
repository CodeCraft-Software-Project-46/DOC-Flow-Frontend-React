import {StatusBadge} from "./StatusBadge.tsx";

export function DashboardList({
                                  dashboards,
                                  onEdit,
                                  onDelete,
                                  onChangeStatus
                              }) {


    if (dashboards.length === 0) {

        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">

                <div className="text-4xl mb-3">
                    📊
                </div>

                <p className="text-slate-500 font-semibold">
                    No dashboards yet
                </p>

                <p className="text-slate-400 text-sm mt-1">
                    Click "+ Create Dashboard" to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">

            {dashboards.map((d) => (

                <div
                    key={d.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >

                    {/* LEFT INFO */}
                    <div className="flex items-center gap-4">

                        <div
                            className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                            📊
                        </div>

                        <div>

                            <div className="flex items-center gap-2">

                                <h3 className="text-sm font-bold text-slate-800">
                                    {d.name}
                                </h3>

                                <StatusBadge status={d.status}/>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">
                                {d.description}
                            </p>
                        </div>
                    </div>

                    {/* for wrap action buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">

                        {/* for editing */}
                        <button
                            onClick={() => onEdit(d)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                            ✏️ Edit
                        </button>

                        {/* for activating  */}
                        <button
                            onClick={() =>
                                onChangeStatus(d.id, "active")
                            }

                            disabled={d.status === "active"}

                            className={`
        px-3 py-1.5 text-xs font-semibold rounded-lg border transition

        ${
                                d.status === "active"
                                    ? "bg-green-100 text-green-400 border-green-200 cursor-not-allowed opacity-60"
                                    : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            }
    `}
                        >
                            ✅ Activate
                        </button>

                        {/* for disable */}
                        <button
                            onClick={() =>
                                onChangeStatus(d.id, "disabled")
                            }

                            disabled={d.status !== "active"}

                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition${
                                d.status !== "active"
                                    ? "bg-amber-100 text-amber-400 border-amber-200 cursor-not-allowed opacity-60"
                                    : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"}`}>
                            🚫 Disable
                        </button>

                        {/* DELETE */}
                        <button
                            onClick={() => onDelete(d.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                        >
                            🗑 Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}