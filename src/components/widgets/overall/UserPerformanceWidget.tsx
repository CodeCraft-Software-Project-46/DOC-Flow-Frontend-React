import { useEffect, useState } from "react";
import UserPerformance from "../../chartAnalytics/Userperformance";
import { fetchUserPerformance } from "../../../services/analyticsApi";
import type { UserPerformanceResponse } from "../../../types";

export default function UserPerformanceWidget() {
  const [data, setData] = useState<UserPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchUserPerformance();
        setData(res);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading users...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[200px] flex flex-col justify-center gap-2">
        <div className="font-semibold text-slate-900 text-base">
          👤 SLA Compliance by User
        </div>
        <div className="text-sm text-slate-900">
          Failed to load users
        </div>
      </div>
    );
  }

  return <UserPerformance />;
}