import { 
  Play, 
  Square, 
  CheckCircle, 
  GitBranch, 
  Layers,
  Clock,
  FileText,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeType } from '@/types/workflow';

interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const paletteItems: NodePaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: Play,
    color: 'bg-node-start',
  },
  {
    type: 'task',
    label: 'Task Step',
    description: 'Approval, review, or data entry',
    icon: CheckCircle,
    color: 'bg-node-task',
  },
  {
    type: 'decision',
    label: 'Decision Gateway',
    description: 'Route based on conditions',
    icon: GitBranch,
    color: 'bg-node-decision',
  },
  {
    type: 'parallel',
    label: 'Parallel Block',
    description: 'Execute branches simultaneously',
    icon: Layers,
    color: 'bg-node-parallel',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    icon: Square,
    color: 'bg-node-end',
  },
];

const taskTypes = [
  { label: 'Approval', icon: CheckCircle },
  { label: 'Review', icon: FileText },
  { label: 'Upload', icon: Upload },
  { label: 'SLA Timer', icon: Clock },
];

interface NodePaletteProps {
  onDragStart: (type: NodeType) => void;
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag and drop to canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {paletteItems.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('nodeType', item.type);
                onDragStart(item.type);
              }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border border-border cursor-grab",
                "hover:border-primary/50 hover:bg-muted/50 transition-all",
                "active:cursor-grabbing"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color)}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Task Types
          </div>
          <div className="grid grid-cols-2 gap-2">
            {taskTypes.map((task) => (
              <div
                key={task.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50 border border-transparent hover:border-border transition-colors cursor-pointer"
              >
                <task.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{task.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Connect nodes by dragging from output ports to input ports.
        </div>
      </div>
    </div>
  );
}
