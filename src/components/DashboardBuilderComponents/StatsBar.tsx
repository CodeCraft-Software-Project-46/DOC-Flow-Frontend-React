

export function StatsBar({ dashboards }) {
    const total        = dashboards.length;
    const active       = dashboards.filter(d => d.status === "Active").length;
    const draft        = dashboards.filter(d => d.status === "Draft").length;
    const totalWidgets = dashboards.reduce((sum, d) => sum + (d.widgets?.length ?? 0), 0);

    const stats = [
        { label: "Total Dashboards", value: total,        color: "blue"   },
        { label: "Active",           value: active,       color: "emerald"},
        { label: "Draft",            value: draft,        color: "amber"  },
        { label: "Total Widgets",    value: totalWidgets, color: "purple" },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {stats.map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 text-${stat.color}-600`}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
