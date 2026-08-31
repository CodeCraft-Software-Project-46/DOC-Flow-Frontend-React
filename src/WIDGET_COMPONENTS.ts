// src/widgets/WIDGET_COMPONENTS.ts


import BottleneckSteps from "./components/chart/BottleneckSteps.tsx";
import WorkflowPerformance from "./components/chart/WorkflowPerformance.tsx";
import TaskSummary from "./components/chart/TaskSummary.tsx";
import DocumentOverview from "./components/chart/DocumentOverview.tsx";
import SystemAlerts from "./components/chart/SystemAlerts.tsx";
import UserSLAList from "./components/chart/Userperformance.tsx";

export const WIDGET_COMPONENTS: Record<string, any> = {
    //map keys with components
    W001: BottleneckSteps,
    W002: WorkflowPerformance,
    W003: UserSLAList,
    W004: TaskSummary,
    W005: DocumentOverview,
    W006: SystemAlerts,
};