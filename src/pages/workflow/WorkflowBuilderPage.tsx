import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  Rocket, 
  History, 
  AlertTriangle,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NodePalette } from '@/components/builder/NodePalette';
import { WorkflowCanvas } from '@/components/builder/WorkflowCanvas';
import { NodeProperties } from '@/components/builder/NodeProperties';
import { WorkflowNode, NodeType } from '@/types/workflow';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNodesChange = useCallback((newNodes: WorkflowNode[]) => {
    setNodes(newNodes);
    setHasChanges(true);
  }, []);

  const handleNodeSelect = useCallback((node: WorkflowNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback((updatedNode: WorkflowNode) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setSelectedNode(updatedNode);
    setHasChanges(true);
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setSelectedNode(null);
    setHasChanges(true);
    toast.success('Node deleted');
  }, []);

  const handleDragStart = (type: NodeType) => {
    // Visual feedback on drag start
  };

  const handleSave = () => {
    toast.success('Workflow saved as draft');
    setHasChanges(false);
  };

  const handleValidate = () => {
    const errors: string[] = [];
    const hasStart = nodes.some((n) => n.type === 'start');
    const hasEnd = nodes.some((n) => n.type === 'end');

    if (!hasStart) errors.push('Missing Start node');
    if (!hasEnd) errors.push('Missing End node');

    nodes.forEach((node) => {
      if (node.type === 'task' && !node.config.assigneeId) {
        errors.push(`${node.name}: No assignee configured`);
      }
    });

    if (errors.length > 0) {
      toast.error(
        <div>
          <div className="font-medium mb-1">Validation Errors</div>
          <ul className="text-sm space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      toast.success('Workflow is valid');
    }
  };

  const handlePublish = () => {
    toast.success('Workflow published successfully');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/workflows')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="h-6 w-px bg-border" />

          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {isNew ? 'New Workflow' : 'Edit Workflow'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {hasChanges ? 'Unsaved changes' : 'All changes saved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Redo className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">100%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          <Button variant="outline" size="sm" onClick={handleValidate}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate
          </Button>

          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>

          <Button size="sm" onClick={handlePublish}>
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Node Palette */}
        <NodePalette onDragStart={handleDragStart} />

        {/* Center - Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          onNodesChange={handleNodesChange}
          onNodeSelect={handleNodeSelect}
          selectedNodeId={selectedNode?.id || null}
        />

        {/* Right Panel - Node Properties */}
        <NodeProperties
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 border-t border-border bg-card flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{nodes.length} nodes</span>
          <span>•</span>
          <span>{nodes.filter((n) => n.connections.length > 0).length} connections</span>
        </div>

        <div className="flex items-center gap-2">
          {!nodes.some((n) => n.type === 'start') && (
            <span className="flex items-center gap-1 text-warning">
              <AlertTriangle className="w-3 h-3" />
              Missing start node
            </span>
          )}
          {!nodes.some((n) => n.type === 'end') && (
            <span className="flex items-center gap-1 text-warning">
              <AlertTriangle className="w-3 h-3" />
              Missing end node
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
