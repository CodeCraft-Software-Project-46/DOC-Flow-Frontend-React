import { useState, useRef, useCallback } from 'react';
import { Play, Square, CheckCircle, GitBranch, Layers, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowNode, NodeType } from '@/types/workflow';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onNodeSelect: (node: WorkflowNode | null) => void;
  selectedNodeId: string | null;
}

const nodeIcons: Record<NodeType, React.ElementType> = {
  start: Play,
  end: Square,
  task: CheckCircle,
  decision: GitBranch,
  parallel: Layers,
};

const nodeColors: Record<NodeType, string> = {
  start: 'border-node-start bg-node-start/5',
  end: 'border-node-end bg-node-end/5',
  task: 'border-node-task bg-node-task/5',
  decision: 'border-node-decision bg-node-decision/5',
  parallel: 'border-node-parallel bg-node-parallel/5',
};

const nodeIconColors: Record<NodeType, string> = {
  start: 'text-node-start',
  end: 'text-node-end',
  task: 'text-node-task',
  decision: 'text-node-decision',
  parallel: 'text-node-parallel',
};

export function WorkflowCanvas({ 
  nodes, 
  onNodesChange, 
  onNodeSelect,
  selectedNodeId 
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
      if (!nodeType || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 75;
      const y = e.clientY - rect.top - 40;

      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: nodeType,
        name: getDefaultName(nodeType),
        position: { x: Math.max(0, x), y: Math.max(0, y) },
        config: {},
        connections: [],
      };

      onNodesChange([...nodes, newNode]);
      onNodeSelect(newNode);
    },
    [nodes, onNodesChange, onNodeSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    });
    onNodeSelect(node);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNode || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      onNodesChange(
        nodes.map((node) =>
          node.id === draggingNode
            ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } }
            : node
        )
      );
    },
    [draggingNode, dragOffset, nodes, onNodesChange]
  );

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleCanvasClick = () => {
    onNodeSelect(null);
  };

  const getDefaultName = (type: NodeType): string => {
    switch (type) {
      case 'start':
        return 'Start';
      case 'end':
        return 'End';
      case 'task':
        return 'New Task';
      case 'decision':
        return 'Decision';
      case 'parallel':
        return 'Parallel';
      default:
        return 'Node';
    }
  };

  // Draw connections
  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = nodes.find((n) => n.id === targetId);
        if (!targetNode) return;

        const startX = node.position.x + 75;
        const startY = node.position.y + 40;
        const endX = targetNode.position.x + 75;
        const endY = targetNode.position.y + 40;

        const midX = (startX + endX) / 2;

        connections.push(
          <svg
            key={`${node.id}-${targetId}`}
            className="absolute inset-0 pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <path
              d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="hsl(var(--canvas-connector))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="hsl(var(--canvas-connector))"
                />
              </marker>
            </defs>
          </svg>
        );
      });
    });

    return connections;
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 canvas-grid relative overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Connection Lines */}
      {renderConnections()}

      {/* Nodes */}
      {nodes.map((node) => {
        const Icon = nodeIcons[node.type];
        const isSelected = selectedNodeId === node.id;

        return (
          <div
            key={node.id}
            className={cn(
              "absolute w-[150px] rounded-lg border-2 bg-card shadow-node cursor-move transition-all",
              nodeColors[node.type],
              isSelected && "ring-2 ring-primary ring-offset-2",
              draggingNode === node.id && "opacity-80 scale-105"
            )}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Node Header */}
            <div className="flex items-center gap-2 p-3 border-b border-border/50">
              <Icon className={cn("w-5 h-5", nodeIconColors[node.type])} />
              <span className="text-sm font-medium text-foreground flex-1 truncate">
                {node.name}
              </span>
              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            {/* Node Body */}
            <div className="p-3">
              <span className="text-xs text-muted-foreground capitalize">
                {node.type} {node.config.taskType && `• ${node.config.taskType}`}
              </span>
              {node.config.assignTo && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Assign: {node.config.assignTo}
                </div>
              )}
            </div>

            {/* Connection Points */}
            {node.type !== 'start' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-border" />
            )}
            {node.type !== 'end' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-primary" />
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              Start Building
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag components from the left panel to create your workflow
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
