// Re-export grouped type modules for clearer organization

export type {
	// UI Components
	StatCardColor,
	StatCardProps,
	// Status types
	StepStatus,
	// Business logic
	WorkingHoursConfig,
} from "./common";

export type {
	// Running Documents Widget
	RunningDocument,
	RunningDocumentsResponse,
	RunningDocumentsApiResponse,
	RunningDocumentsDetailsProps,
	// Overdue Tasks Widget
	ActiveOverdueTask,
	ActiveOverdueTasksResponse,
	ActiveTasksDetailsProps,
	// User Performance Widget
	UserPerformanceItem,
	User,
	UserPerformanceResponse,
	// SLA Distribution Widget
	SLADistributionPoint,
	SLADistributionResponse,
	// Bottleneck Analysis Widget
	BottleneckWorkflow,
	BottleneckWorkflowsResponse,
	BottleneckItem,
	// Completed Tasks & SLA Compliance
	CompletedTasksResponse,
	SLAComplianceResponse,
} from "./overall";

export type {
	// UI Components
	WorkflowStep,
	// Workflow List
	WorkflowListItem,
	WorkflowListResponse,
	// API Response Types
	WorkflowRunningInstancesValueResponse,
	WorkflowAvgCompletionTimeApiResponse,
	WorkflowSLAComplianceApiResponse,
	// Drilldown/Instance Data
	WorkflowInstance,
	WorkflowInstancesApiResponse,
	InstanceDrilldownTask,
	InstanceDrilldownResponse,
	// Step Flow Details
	WorkflowStepDetail,
	WorkflowStepFlowDetailResponse,
} from "./workflow";

export type { ChatMessage } from "./chatTypes";