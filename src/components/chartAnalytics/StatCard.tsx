// Reusable stat card used in both Overall Dashboard and Workflow Analytics

interface StatCardProps { //prop means Data or functions passed from parent → child
  icon: string;
  value: string;
  label: string;
  description: string;
  color: "blue" | "red";
  small?: boolean; // smaller size for workflow tab
}

export default function StatCard({ icon, value, label, description, color, small = false }: StatCardProps) {
  const iconBgClass = color === "blue" ? "bg-blue-100" : "bg-red-100"; //background color of the icon circle based on the color prop

  return (
    <div className={`bg-white rounded-2xl shadow-sm flex items-center gap-4 ${small ? "p-4" : "p-6"}`}>
      {/* Icon circle */}
      <div
        className={`rounded-xl flex items-center justify-center flex-shrink-0 ${small ? "w-10 h-10 text-lg" : "w-12 h-12 text-2xl"} ${iconBgClass}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <div className={`font-bold text-slate-900 ${small ? "text-2xl" : "text-3xl"}`}>
          {value}
        </div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  );
}