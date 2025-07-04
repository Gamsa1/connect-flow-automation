import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ConnectNode from './nodes/ConnectNode';
import MessageNode from './nodes/MessageNode';
import DelayNode from './nodes/DelayNode';
import { CampaignNode, CampaignEdge } from '@/types/campaign';

interface FlowBuilderProps {
  nodes: CampaignNode[];
  edges: CampaignEdge[];
  onNodesChange: (nodes: CampaignNode[]) => void;
  onEdgesChange: (edges: CampaignEdge[]) => void;
  isReadOnly?: boolean;
}

export const FlowBuilder = ({ 
  nodes: initialNodes, 
  edges: initialEdges, 
  onNodesChange, 
  onEdgesChange,
  isReadOnly = false 
}: FlowBuilderProps) => {
  const [nodes, setNodes, onReactFlowNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onReactFlowEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes: NodeTypes = useMemo(() => ({
    connect: ConnectNode,
    message: MessageNode,
    delay: DelayNode,
  }), []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
      } as Edge;
      
      const updatedEdges = addEdge(newEdge, edges);
      setEdges(updatedEdges);
      onEdgesChange(updatedEdges);
    },
    [edges, setEdges, onEdgesChange]
  );

  const handleNodesChange = useCallback((changes: any) => {
    onReactFlowNodesChange(changes);
    // Update parent component with current nodes
    setNodes((currentNodes) => {
      onNodesChange(currentNodes);
      return currentNodes;
    });
  }, [onReactFlowNodesChange, setNodes, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    onReactFlowEdgesChange(changes);
    // Update parent component with current edges
    setEdges((currentEdges) => {
      onEdgesChange(currentEdges);
      return currentEdges;
    });
  }, [onReactFlowEdgesChange, setEdges, onEdgesChange]);

  const handleDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  // Add data change handler to all nodes
  const enhancedNodes = useMemo(() => 
    nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDataChange: handleDataChange,
      },
    })),
    [nodes, handleDataChange]
  );

  return (
    <div className="w-full h-[600px] border rounded-lg bg-background">
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        nodesDraggable={!isReadOnly}
        nodesConnectable={!isReadOnly}
        elementsSelectable={!isReadOnly}
      >
        <Background />
        <Controls />
        <MiniMap 
          className="bg-card border"
          nodeColor={(node) => {
            switch (node.type) {
              case 'connect': return 'hsl(var(--flow-connect))';
              case 'message': return 'hsl(var(--flow-message))';
              case 'delay': return 'hsl(var(--flow-delay))';
              default: return 'hsl(var(--muted))';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};