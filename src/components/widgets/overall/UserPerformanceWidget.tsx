import UserPerformance from "../../chartAnalytics/Userperformance";
import { fetchUserPerformance } from "../../../services/analyticsApi";
import { useAnalyticsQuery } from "../../../hooks/useAnalyticsQuery";

export default function UserPerformanceWidget() {
  const { data, loading, error } =
    useAnalyticsQuery(fetchUserPerformance);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading users...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-500">
        Failed to load users
      </div>
    );
  }

  return <UserPerformance />;
}