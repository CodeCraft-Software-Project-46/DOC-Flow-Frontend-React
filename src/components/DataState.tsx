import type { ReactNode } from "react";

interface WidgetStateProps {
  loading: boolean;
  isEmpty: boolean;
  loadingText?: string;
  emptyText?: string;
  children: ReactNode;
}

export default function WidgetState({
  loading,
  isEmpty,
  loadingText = "Loading...",
  emptyText = "No data available",
  children,
}: WidgetStateProps) {
  const baseClass =
    "flex items-center justify-center min-h-[160px] text-xs text-slate-400";

  if (loading) {
    return (
      <div className={baseClass}>
        {loadingText}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={baseClass}>
        {emptyText}
      </div>
    );
  }

  return <>{children}</>;
}