import { useEffect, useState } from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { completeTask, createTask, fetchPendingTasks } from "../api/analyticsApi";
import type { OpenTask } from "../types";

// Floating "New Task" button for the analytics dashboard — a quick way to
// spin up a TaskInstance (task name + SLA), watch the SLA engine compute
// due_at, and mark it completed, all without hand-writing SQL. created_at
// and completed_at are always stamped server-side with the backend's
// current time, so neither is a field the user fills in here.
export const CreateTaskFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [slaMinutes, setSlaMinutes] = useState("2");
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [openTasks, setOpenTasks] = useState<OpenTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<number | null>(null);

  const refreshOpenTasks = async () => {
    setLoadingTasks(true);
    setListError(null);
    try {
      const tasks = await fetchPendingTasks();
      setOpenTasks(tasks);
    } catch (err) {
      console.error("Failed to load open tasks", err);
      setListError("Failed to load open tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshOpenTasks();
    }
  }, [isOpen]);

  const resetAndClose = () => {
    setIsOpen(false);
    setTaskName("");
    setSlaMinutes("2");
    setCreateError(null);
    setListError(null);
  };

  const handleCreate = async () => {
    const trimmedName = taskName.trim();
    const minutes = Number(slaMinutes);

    if (!trimmedName) {
      setCreateError("Task name is required.");
      return;
    }
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setCreateError("SLA must be a number greater than 0.");
      return;
    }

    setSubmitting(true);
    setCreateError(null);

    try {
      await createTask({ taskName: trimmedName, slaHours: minutes / 60 });
      setTaskName("");
      await refreshOpenTasks();
    } catch (err) {
      console.error("Failed to create task", err);
      setCreateError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (taskId: number) => {
    setCompletingTaskId(taskId);
    setListError(null);
    try {
      await completeTask(taskId);
      setOpenTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    } catch (err) {
      console.error("Failed to complete task", err);
      setListError("Failed to mark that task completed. Please try again.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  const slaBadgeClasses = (slaStatus: string | null) => {
    if (slaStatus === "met") return "bg-green-100 text-green-700";
    if (slaStatus === "breached") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-500";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open task tester"
        title="Task Tester"
        className="fixed bottom-6 right-24 z-40 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        <Plus size={20} />
        <span className="text-sm font-medium pr-1">New Task</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">Task Tester</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Times are always your computer's current time — never
                  something typed in here.
                </p>
              </div>

              <button
                onClick={resetAndClose}
                aria-label="Close modal"
                title="Close"
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* CREATE FORM */}
            <div className="p-6 space-y-4 border-b">
              <h3 className="text-sm font-semibold text-slate-700">
                Create New Task
              </h3>

              {createError && (
                <div className="bg-red-50 border p-3 rounded">
                  <p className="text-red-600 text-sm">{createError}</p>
                </div>
              )}

              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <label htmlFor="new-task-name" className="text-xs block mb-1">
                    Task Name
                  </label>
                  <input
                    id="new-task-name"
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g. Manager Approval"
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="w-28">
                  <label htmlFor="new-task-sla" className="text-xs block mb-1">
                    SLA (minutes)
                  </label>
                  <input
                    id="new-task-sla"
                    type="number"
                    min="1"
                    step="1"
                    value={slaMinutes}
                    onChange={(e) => setSlaMinutes(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded h-[42px]"
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            {/* OPEN TASKS */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">
                  Open Tasks
                </h3>
                <button
                  onClick={refreshOpenTasks}
                  disabled={loadingTasks}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {loadingTasks ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {listError && (
                <div className="bg-red-50 border p-3 rounded">
                  <p className="text-red-600 text-sm">{listError}</p>
                </div>
              )}

              {!loadingTasks && openTasks.length === 0 && !listError && (
                <p className="text-xs text-slate-400">
                  No open (not-yet-completed) tasks.
                </p>
              )}

              <div className="space-y-2">
                {openTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        #{task.taskId} {task.taskName ?? "(unnamed)"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        due_at: {task.dueAt ?? "pending calculation"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full ${slaBadgeClasses(
                          task.slaStatus,
                        )}`}
                      >
                        {task.slaStatus ?? "not evaluated"}
                      </span>

                      <button
                        onClick={() => handleComplete(task.taskId)}
                        disabled={completingTaskId === task.taskId}
                        title="Mark completed at your current computer time"
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs px-3 py-1.5 rounded"
                      >
                        <CheckCircle2 size={14} />
                        {completingTaskId === task.taskId
                          ? "Completing..."
                          : "Complete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
