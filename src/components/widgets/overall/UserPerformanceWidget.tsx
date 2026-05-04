import { useEffect, useState } from "react";
import UserPerformance from "../../chartAnalytics/Userperformance";
import { fetchUserPerformance } from "../../../services/analyticsApi";

export default function UserPerformanceWidget() {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[200px] flex items-center justify-center text-sm text-slate-400">
        Loading users...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[200px] flex items-center justify-center text-sm text-red-400">
        Failed to load users
      </div>
    );
  }

  return <UserPerformance />;
}