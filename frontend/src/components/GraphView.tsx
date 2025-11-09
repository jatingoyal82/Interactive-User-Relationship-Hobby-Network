import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import HighScoreNode from './nodes/HighScoreNode';
import LowScoreNode from './nodes/LowScoreNode';
import { GraphNode, GraphEdge } from '../api/api';

const nodeTypes: NodeTypes = {
  highScoreNode: HighScoreNode,
  lowScoreNode: LowScoreNode,
};

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeDrop?: (targetNodeId: string, sourceNodeId: string) => void;
  onHobbyDrop?: (nodeId: string, hobby: string) => void;
  onNodeClick?: (nodeId: string) => void;
}

const GraphViewInner: React.FC<GraphViewProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodeDrop,
  onHobbyDrop,
  onNodeClick,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[]);
  const draggedNodeRef = useRef<string | null>(null);
  const draggedHobbyRef = useRef<string | null>(null);

  // Update nodes and edges when props change
  useEffect(() => {
    setNodes(initialNodes as Node[]);
    setEdges(initialEdges as Edge[]);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && onNodeDrop) {
        onNodeDrop(params.target, params.source);
      }
    },
    [onNodeDrop]
  );

  const onNodeDragStart = useCallback((_: React.MouseEvent, node: Node) => {
    draggedNodeRef.current = node.id;
  }, []);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (draggedNodeRef.current && draggedNodeRef.current !== node.id && onNodeDrop) {
        // Check if dropped on another node by finding element at drop point
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const targetNodeElement = element?.closest('.react-flow__node');
        
        if (targetNodeElement) {
          // Get the node ID from data-id attribute
          const targetId = targetNodeElement.getAttribute('data-id');
          if (targetId && targetId !== draggedNodeRef.current) {
            onNodeDrop(targetId, draggedNodeRef.current);
          }
        }
      }
      draggedNodeRef.current = null;
    },
    [onNodeDrop]
  );

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    if (draggedHobbyRef.current) {
      // Visual feedback when hovering with hobby
      node.style = { ...node.style, opacity: 0.8 };
      setNodes((nds) => nds.map((n) => (n.id === node.id ? node : n)));
    }
  }, [setNodes]);

  const onNodeMouseLeave = useCallback((event: React.MouseEvent, node: Node) => {
    if (draggedHobbyRef.current) {
      node.style = { ...node.style, opacity: 1 };
      setNodes((nds) => nds.map((n) => (n.id === node.id ? node : n)));
    }
  }, [setNodes]);

  const onNodeMouseUp = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (draggedHobbyRef.current && onHobbyDrop) {
        onHobbyDrop(node.id, draggedHobbyRef.current);
        draggedHobbyRef.current = null;
      }
    },
    [onHobbyDrop]
  );

  const onPaneClick = useCallback(() => {
    draggedHobbyRef.current = null;
  }, []);

  // Expose drag handlers to parent
  useEffect(() => {
    const handleHobbyDragStart = (hobby: string) => {
      draggedHobbyRef.current = hobby;
    };

    window.addEventListener('hobby-drag-start', ((e: CustomEvent) => {
      handleHobbyDragStart(e.detail.hobby);
    }) as EventListener);

    return () => {
      window.removeEventListener('hobby-drag-start', ((e: CustomEvent) => {
        handleHobbyDragStart(e.detail.hobby);
      }) as EventListener);
    };
  }, []);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeMouseUp={onNodeMouseUp}
        onPaneClick={onPaneClick}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

const GraphView: React.FC<GraphViewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphViewInner {...props} />
    </ReactFlowProvider>
  );
};

export default GraphView;

