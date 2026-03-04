import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { WorkflowNode, TaskType, AssignmentRule } from '@/types/workflow';
import { mockRoles } from '@/data/mockData';

interface NodePropertiesProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdate: (node: WorkflowNode) => void;
  onDelete: (nodeId: string) => void;
}

const taskTypes: { value: TaskType; label: string }[] = [
  { value: 'approval', label: 'Approval' },
  { value: 'review', label: 'Review' },
  { value: 'upload', label: 'Upload Document' },
  { value: 'metadata-edit', label: 'Metadata Edit' },
];

const allowedActions = [
  { id: 'approve', label: 'Approve' },
  { id: 'reject', label: 'Reject' },
  { id: 'sendback', label: 'Send Back for Revision' },
  { id: 'comment', label: 'Add Comment' },
  { id: 'upload', label: 'Upload Attachment' },
];

export function NodeProperties({ node, onClose, onUpdate, onDelete }: NodePropertiesProps) {
  if (!node) {
    return (
      <div className="w-80 bg-card border-l border-border p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Select a node to view its properties
          </p>
        </div>
      </div>
    );
  }

  const updateConfig = <K extends keyof typeof node.config>(
    key: K,
    value: typeof node.config[K]
  ) => {
    onUpdate({
      ...node,
      config: { ...node.config, [key]: value },
    });
  };

  const toggleAction = (actionId: string) => {
    const current = node.config.allowedActions || [];
    const updated = current.includes(actionId)
      ? current.filter((a) => a !== actionId)
      : [...current, actionId];
    updateConfig('allowedActions', updated);
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Node Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="nodeName">Step Name</Label>
            <Input
              id="nodeName"
              value={node.name}
              onChange={(e) => onUpdate({ ...node, name: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Node Type</span>
            <span className="text-sm font-medium capitalize">{node.type}</span>
          </div>
        </div>

        {/* Task Configuration */}
        {node.type === 'task' && (
          <Accordion type="multiple" defaultValue={['task', 'assignment', 'actions', 'sla']} className="space-y-2">
            <AccordionItem value="task" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium">
                Task Configuration
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-3">
                <div>
                  <Label>Task Type</Label>
                  <Select
                    value={node.config.taskType || 'approval'}
                    onValueChange={(v) => updateConfig('taskType', v as TaskType)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="assignment" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium">
                Assignment
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-3">
                <div>
                  <Label>Assign To</Label>
                  <Select
                    value={node.config.assignTo || 'role'}
                    onValueChange={(v) => updateConfig('assignTo', v as 'role' | 'user' | 'group')}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="user">Specific User</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select {node.config.assignTo || 'Role'}</Label>
                  <Select
                    value={node.config.assigneeId || ''}
                    onValueChange={(v) => updateConfig('assigneeId', v)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Assignment Rule</Label>
                  <Select
                    value={node.config.assignmentRule || 'any'}
                    onValueChange={(v) => updateConfig('assignmentRule', v as AssignmentRule)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any One (OR)</SelectItem>
                      <SelectItem value="all">All Must Approve (AND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium">
                Allowed Actions
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-3">
                {allowedActions.map((action) => (
                  <label
                    key={action.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={(node.config.allowedActions || []).includes(action.id)}
                      onCheckedChange={() => toggleAction(action.id)}
                    />
                    <span className="text-sm">{action.label}</span>
                  </label>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Comment Mandatory</span>
                  <Switch
                    checked={node.config.commentMandatory || false}
                    onCheckedChange={(v) => updateConfig('commentMandatory', v)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sla" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-medium">
                SLA Configuration
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-3">
                <div>
                  <Label>SLA Duration (hours)</Label>
                  <Input
                    type="number"
                    value={node.config.slaHours || ''}
                    onChange={(e) => updateConfig('slaHours', Number(e.target.value))}
                    placeholder="24"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Reminder Before (hours)</Label>
                  <Input
                    type="number"
                    value={node.config.reminderHours || ''}
                    onChange={(e) => updateConfig('reminderHours', Number(e.target.value))}
                    placeholder="4"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Escalation Target</Label>
                  <Select
                    value={node.config.escalationTarget || ''}
                    onValueChange={(v) => updateConfig('escalationTarget', v)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Decision Configuration */}
        {node.type === 'decision' && (
          <div className="space-y-3">
            <Label>Decision Rules</Label>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                Configure routing rules based on document fields
              </p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Add Rule
              </Button>
            </div>
          </div>
        )}

        {/* Parallel Configuration */}
        {node.type === 'parallel' && (
          <div className="space-y-3">
            <div>
              <Label>Parallel Type</Label>
              <Select
                value={node.config.parallelType || 'and'}
                onValueChange={(v) => updateConfig('parallelType', v as 'and' | 'or')}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">All Branches (AND)</SelectItem>
                  <SelectItem value="or">Any Branch (OR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                Configure parallel branches
              </p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Add Branch
              </Button>
            </div>
          </div>
        )}

        {/* End Configuration */}
        {node.type === 'end' && (
          <div className="space-y-3">
            <div>
              <Label>End Type</Label>
              <Select
                value={node.config.endType || 'completed'}
                onValueChange={(v) => updateConfig('endType', v as 'completed' | 'rejected' | 'cancelled')}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Final Actions</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm">Move to archive folder</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm">Lock document</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm">Send completion notification</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
