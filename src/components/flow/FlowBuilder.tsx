import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
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
  const [nodes, setNodes, onReactFlowNodesChange] = useNodesState([]);
  const [edges, setEdges, onReactFlowEdgesChange] = useEdgesState([]);

  // Sync external nodes/edges with internal state
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

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
  }, [onReactFlowNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    onReactFlowEdgesChange(changes);
  }, [onReactFlowEdgesChange]);

  // Update parent when internal state changes
  useEffect(() => {
    onNodesChange(nodes);
  }, [nodes, onNodesChange]);

  useEffect(() => {
    onEdgesChange(edges);
  }, [edges, onEdgesChange]);

  const handleDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  // Calculate ordered positioning for nodes
  const getOrderedNodes = useCallback((nodeList: CampaignNode[]) => {
    return nodeList.map((node, index) => ({
      ...node,
      position: {
        x: 100,
        y: index * 200 + 100
      },
      data: {
        ...node.data,
        order: index + 1,
        onDataChange: handleDataChange,
        onDelete: handleDeleteNode,
      },
    }));
  }, [handleDataChange, handleDeleteNode]);

  // Auto-generate ordered edges between consecutive nodes
  const getOrderedEdges = useCallback((nodeList: CampaignNode[]) => {
    const orderedEdges: CampaignEdge[] = [];
    for (let i = 0; i < nodeList.length - 1; i++) {
      orderedEdges.push({
        id: `edge-${nodeList[i].id}-${nodeList[i + 1].id}`,
        source: nodeList[i].id,
        target: nodeList[i + 1].id,
        type: 'smoothstep',
      });
    }
    return orderedEdges;
  }, []);

  // Get enhanced nodes with proper ordering and callbacks
  const enhancedNodes = useMemo(() => getOrderedNodes(nodes), [nodes, getOrderedNodes]);
  
  // Get auto-generated edges for sequential flow
  const autoEdges = useMemo(() => getOrderedEdges(nodes), [nodes, getOrderedEdges]);

  return (
    <div className="w-full h-[600px] border rounded-lg bg-background">
      <ReactFlow
        nodes={enhancedNodes}
        edges={autoEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={!isReadOnly}
        panOnDrag={true}
        zoomOnScroll={true}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};