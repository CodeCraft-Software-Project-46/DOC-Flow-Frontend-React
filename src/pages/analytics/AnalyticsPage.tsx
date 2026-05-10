import {useState,useEffect} from "react";
import RunningDocumentsWidget from "../../components/widgets/overall/RunningDocumentsWidget";
import ActiveOverdueTasksWidget from "../../components/widgets/overall/ActiveOverdueTasksWidget";
import CompletedTasksWidget from "../../components/widgets/overall/CompletedTasksWidget";
import SLAComplianceWidget from "../../components/widgets/overall/SLAComplianceWidget";
import SlaDistributionWidget from "../../components/widgets/overall/SlaDistributionWidget";
import BottleneckWorkflowsWidget from "../../components/widgets/overall/BottleneckWorkflowsWidget";
import UserPerformanceWidget from "../../components/widgets/overall/UserPerformanceWidget";
import TotalInstancesWidget from "../../components/widgets/workflow/TotalInstancesWidget";
import AvgCompletionTimeWidget from "../../components/widgets/workflow/AvgCompletionTimeWidget";
import SLAComplianceWidgetWorkflow from "../../components/widgets/workflow/SLAComplianceWidget";
import { fetchWorkflows,fetchWorkflowSteps } from "../../services/analyticsApi";
import InstanceDrilldownWidget from "../../components/widgets/workflow/InstanceDrilldownWidget";
import type { WorkflowListItem, WorkflowStepFlowDetailResponse } from "../../types";
import { useAnalyticsQuery } from "../../hooks/useAnalyticsQuery";
import WorkflowStepFlowWidget from "../../components/widgets/workflow/WorkflowStepFlowWidget";

type Tab = "overall" | "workflow";
type TimeRange = "7d" | "30d" | "90d" | "custom" | "all";

export const AnalyticsPage = () => {
  ////only allow values that match the Tab type.setTab("hello") are prevented by TypeScript 
  const [tab, setTab] = useState<Tab>("overall"); 

  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [dateError, setDateError] = useState(""); //validation error for custom date range
  
  // Get shared charts from context — updates when charts are created/edited/deleted
  // const { charts } = useCharts();
  
  // Workflow tab — selected workflow
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);

  const handleTabChange = (selectedTab: Tab) => {
    setTab(selectedTab);
  };
const handleWorkflowSelect = (workflowName: string) => {
  const workflow = workflows.find((w) => w.name === workflowName);
  if (workflow) {
    setSelectedWorkflowId(workflow.workflow_id);
  }
  setTab("workflow");
};

useEffect(() => {
  const loadWorkflows = async () => {
    try {
      const data = await fetchWorkflows();

      setWorkflows(data);

      if (data.length > 0) {
        setSelectedWorkflowId(data[0].workflow_id);
      }
    } catch (error) {
      console.error("Failed to load workflows", error);
    }
  };

  loadWorkflows();
}, []);

  // const overallSlaStatusCounts = useMemo(() => {
  //   let met = 0;
  //   let breached = 0;
  //   Object.values(INSTANCE_DETAILS).forEach((instance) => { //Object.values converts your data into a list of instances
  //     instance.steps.forEach((step) => {
  //       if (step.status === "Met") met += 1;
  //       else if (step.status === "Breached") breached += 1;
  //     });
  //   });
  //   return {
  //     met,
  //     breached,
  //     completedTasks: met + breached, //return completed tasks as 
  //   };
  // }, []);

  // 🔥 Fetch backend data
// useEffect(() => {
//   const loadData = async () => {
//     setLoading(true); // a ?? bif a is null or undefined → use b otherwise → use a 
//     try {
//       const running = await fetchRunningDocuments();
//       setRunningDocs(running.value);

//       const overdue = await fetchActiveOverdueTasks();
//       setOverdueTasks(overdue.count);

//       const completed = await fetchCompletedTasks();
//       setCompletedTasks(completed.count);

//       const sla = await fetchSLACompliance();
//       setSlaCompliance(sla.percentage);
//     } catch (error) {
//       console.error("Error fetching analytics data", error);

//       // IMPORTANT: keep UI clean (NOT zeros)
//       setRunningDocs(null);
//       setOverdueTasks(null);
//       setCompletedTasks(null);
//       setSlaCompliance(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadData();
// }, []);
  
  // Navigate to chart configuration page to create/edit charts
  // function handleCreateChart() {
  //   window.location.href = "/analytics/chart-configuration";
  // }

  // function handleExportOverallMain() {
  //   if (!overallMainExportRef.current) return;//If the element is NOT available, stop Because sometimes: component not loaded yet DOM not ready
  //   void exportElementAsPdf(overallMainExportRef.current, "Overall Analytics");
  // }

  // function handleExportWorkflowMain() {
  //   if (!workflowMainExportRef.current) return;
  //   void exportElementAsPdf(
  //     workflowMainExportRef.current,
  //     `Workflow Analytics - ${selectedWorkflow}`
  //   );
  // }

  // function handleExportOverallCustomCharts() {
  //   if (!overallCustomChartsRef.current) return;
  //   void exportElementAsPdf(overallCustomChartsRef.current, "Overall Dashboard - Custom Charts");
  // }

  // function handleExportWorkflowCustomCharts() {
  //   if (!workflowCustomChartsRef.current) return;
  //   void exportElementAsPdf(
  //     workflowCustomChartsRef.current,
  //     `Workflow Analytics - ${selectedWorkflow} - Custom Charts`
  //   );
  // }

  const validateDates = (from: string, to: string) => { //receives start and end date as strings in "YYYY-MM-DD" format
  if (!from || !to) {
    setDateError("Please select both dates");
    return false;
  }

  if (new Date(to) < new Date(from)) {
    setDateError("End date cannot be before start date");
    return false;
  }

  setDateError("");
  return true;
};


function WorkflowStepFlowWrapper({
  workflowId,
}: {
  workflowId: number | null;
}) {
  const { data, loading, error } = useAnalyticsQuery<WorkflowStepFlowDetailResponse | null>(
    () => (workflowId === null ? Promise.resolve(null) : fetchWorkflowSteps(workflowId)),
    [workflowId]
  );

  if (workflowId === null || loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[260px]">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-50 border border-slate-100" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[260px] text-slate-400">
        Failed to load step flow
      </div>
    );
  }

  return (
    <WorkflowStepFlowWidget
      steps={data.steps ?? []}
      totalInstances={data.total_instances ?? 0}
      completedInstances={data.completed_instances ?? 0}
    />
  );
}

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* ── Tab Bar overall or workflow ── */}
      <div className="bg-white border-b border-slate-200 px-8 flex -mt-2">
        {(["overall", "workflow"] as Tab[]).map((t) => (////map loops through the array and creates UI for each item. So it runs twice create 2 buttons
          <button
            key={t} //React needs a unique ID for each element in a list.
            onClick={() => handleTabChange(t)}//handleTabChange("workflow") if that button is clicked
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-700" //highlight the  relevant button 
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "overall" ? "Overall Analytics" : "Workflow Analytics"}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-2">

        {/* ══ OVERALL DASHBOARD TAB ══ */}
        {tab === "overall" && (
          <div className="space-y-5">

            <div className="flex items-center justify-between"> {/* Page heading */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">Overall Analytics</h2>
                <p className="text-sm text-slate-500 mt-1">
                  System-wide KPI monitoring across all workflows
                </p>
              </div>
              {/* Export/custom chart controls are intentionally disabled for now.
              <button
                onClick={handleExportOverallMain}
                className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Export PDF
              </button> */}
            </div>

            {/* <div ref={overallMainExportRef} className="space-y-5">  */}
            <div className="space-y-5">
              {/* Top stat cards — always live, not affected by time range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">  {/* stat cards */}

      <RunningDocumentsWidget />
      <ActiveOverdueTasksWidget />
              </div>

              <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3 flex-wrap">{/* Time range filter bar */}
              <span className="text-sm text-slate-500 font-medium">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => {
                  const value = e.target.value as TimeRange;
                  setTimeRange(value);

                  if (value !== "custom") { //If user selects ANY option except custom: after the custom option is selected Then we clear previous error message
                    setDateError("");
                  }
                }}
                aria-label="Select analytics time range"
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
                <option value="all">All Time</option>
              </select>

              {timeRange === "custom" && (
                <>
                  <span className="text-sm text-slate-500">From</span>
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomFromDate(value); //stores "start date"
                      validateDates(value, customToDate);
                    }}
                    aria-label="Custom range start date" //Screen readers (for visually impaired users) NOT visibleOnly for screen readers
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
                  />
                  <span className="text-sm text-slate-500">To</span>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomToDate(value);//stores "end date"
                      validateDates(customFromDate, value);//whatever(start,end) date changes, that changed one should again send and get validated
                    }}
                    min={customFromDate || undefined} //customFromDate = "" → min=undefined empty can cause error. Once user selects a from date, that becomes the minimum allowed to prevent invalid range
                    aria-label="Custom range end date"
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 outline-none"
                  />
                </>
              )}
              <span className="text-xs text-slate-400">— Filters all sections below</span>
              {dateError && (
                <span className="text-xs text-red-500">{dateError}</span>
              )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

     <CompletedTasksWidget />
      <SLAComplianceWidget />

              </div>

              {/* SLA Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <SlaDistributionWidget />
                {/* keep trend chart for later */}
              </div>

              {/* bottleneck + user sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <BottleneckWorkflowsWidget
        onWorkflowSelect={handleWorkflowSelect}
      /> {/* I am passing a function called handleWorkflowSelect into BottleneckSteps not run just hand over... component Pass the handler to BottleneckSteps */}
              <UserPerformanceWidget />
 {/* onWorkflowSelect is a prop*/}
              </div>
            </div>
          </div>

        )}

        {/* ══ WORKFLOW ANALYTICS TAB ══ */}
        {tab === "workflow" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Workflow Analytics</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Per-workflow performance and instance drill-down
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Select Workflow:</span>
                <select
                  value={selectedWorkflowId ?? ""}
                  onChange={(e) =>
                    setSelectedWorkflowId(e.target.value ? Number(e.target.value) : null)
                  }
                  aria-label="Select workflow for analytics"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 outline-none"
                >
                  {workflows.map((workflow) => (
                    <option key={workflow.workflow_id} value={workflow.workflow_id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                <TotalInstancesWidget workflowId={selectedWorkflowId} />
                <AvgCompletionTimeWidget workflowId={selectedWorkflowId} />
                <SLAComplianceWidgetWorkflow workflowId={selectedWorkflowId} />
              </div>

              <WorkflowStepFlowWrapper workflowId={selectedWorkflowId} />

              <InstanceDrilldownWidget workflowId={selectedWorkflowId} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};