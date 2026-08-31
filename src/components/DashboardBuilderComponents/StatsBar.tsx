
export function StatsBar({ dashboards }) {

    const total = dashboards.length;

    const active = dashboards.filter(
        d => d.status === "active"
    ).length;

    const draft = dashboards.filter(
        d => d.status === "draft"
    ).length;

    const disabled = dashboards.filter(
        d => d.status === "disabled"
    ).length;


    const stats = [
        {
            label: "Total Dashboards",
            value: total,
            color: "blue"
        },
        {
            label: "Active",
            value: active,
            color: "emerald"
        },
        {
            label: "Draft",
            value: draft,
            color: "amber"
        },
        {
            label: "Disabled",
            value: disabled,
            color: "red"
        },
    ];

    const colorMap = {
        blue: "text-blue-600",
        emerald: "text-emerald-600",
        amber: "text-amber-600",
        red: "text-red-600",
        purple: "text-purple-600",
    };

    return (
        <div className="grid grid-cols-4 gap-4">
            {stats.map(stat => (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm"
                >
                    <p className="text-xs text-slate-500 font-medium">
                        {stat.label}
                    </p>

                    <p className={`text-2xl font-bold mt-1 ${colorMap[stat.color]}`}>
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}