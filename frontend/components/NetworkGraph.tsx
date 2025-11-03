'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node as FlowNode,
  Edge as FlowEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Node, Edge } from '@/types/api';

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  reachableNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
}

export default function NetworkGraph({
  nodes,
  edges,
  reachableNodes = [],
  onNodeClick,
}: NetworkGraphProps) {
  // Convert API nodes to ReactFlow nodes
  const flowNodes: FlowNode[] = useMemo(() => {
    return nodes.map((node, index) => {
      const isReachable = reachableNodes.includes(node.id);
      
      return {
        id: node.id,
        type: 'default',
        position: {
          x: (index % 5) * 250 + 100,
          y: Math.floor(index / 5) * 200 + 100,
        },
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold">{node.id}</div>
              <div className="text-xs text-gray-600">{node.role}</div>
              {node.services.length > 0 && (
                <div className="text-xs text-gray-500">
                  {node.services.join(', ')}
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: isReachable ? '#fca5a5' : '#dbeafe',
          border: isReachable ? '2px solid #dc2626' : '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '10px',
          width: 180,
        },
      };
    });
  }, [nodes, reachableNodes]);

  // Convert API edges to ReactFlow edges
  const flowEdges: FlowEdge[] = useMemo(() => {
    const edgeList: FlowEdge[] = [];
    
    edges.forEach((edge, index) => {
      edgeList.push({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          stroke: '#6b7280',
        },
      });
      
      // If bidirectional, add reverse edge (curved to avoid overlap)
      if (edge.bidirectional) {
        edgeList.push({
          id: `edge-${index}-reverse`,
          source: edge.target,
          target: edge.source,
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            stroke: '#9ca3af',
          },
        });
      }
    });
    
    return edgeList;
  }, [edges]);

  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState(flowNodes);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes when props change
  React.useEffect(() => {
    setDisplayNodes(flowNodes);
  }, [flowNodes, setDisplayNodes]);

  // Update edges when props change
  React.useEffect(() => {
    setDisplayEdges(flowEdges);
  }, [flowEdges, setDisplayEdges]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-300">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const isReachable = reachableNodes.includes(node.id);
            return isReachable ? '#dc2626' : '#3b82f6';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
      
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded"></div>
          <span className="text-sm">Safe Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 border-2 border-red-600 rounded"></div>
          <span className="text-sm">Compromised Node</span>
        </div>
      </div>
    </div>
  );
}
