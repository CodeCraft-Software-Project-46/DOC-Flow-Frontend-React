export default function WorkflowPerformance() {
    const stats = [
        { label: "Completed", value: 120 },
        { label: "In Progress", value: 45 },
        { label: "Failed", value: 12 },
    ];

    return (
        <div className="h-full bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold">⚙ Workflow Performance</h3>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-slate-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold">{s.value}</div>
                        <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}