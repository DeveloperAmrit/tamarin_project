'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NodeForm from '@/components/NodeForm';
import EdgeForm from '@/components/EdgeForm';
import CredentialForm from '@/components/CredentialForm';
import SimulationPanel from '@/components/SimulationPanel';
import ResultsDisplay from '@/components/ResultsDisplay';
import NetworkGraph from '@/components/NetworkGraph';
import { GraphData, SimulationResult } from '@/types/api';
import { apiClient } from '@/lib/api';

export default function HomePage() {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
    credentials: [],
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'build' | 'simulate' | 'results'>('build');
  const [loading, setLoading] = useState(false);

  const fetchGraphData = useCallback(async () => {
    try {
      const data = await apiClient.getGraph();
      setGraphData(data);
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.clearData();
      setGraphData({ nodes: [], edges: [], credentials: [] });
      setSimulationResult(null);
      alert('All data cleared successfully');
    } catch (error) {
      alert('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    setSimulationResult(result);
    setActiveTab('results');
  };

  const nodeIds = graphData.nodes.map((n) => n.id);
  const credentialIds = graphData.credentials.map((c) => c.id);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Attack Depth Simulator</h1>
          <p className="text-blue-100 mt-2">Visualize how deep a hacker can penetrate your network</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'build'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏗️ Build Network
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'simulate'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎯 Simulate Attack
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Results
          </button>
          <button
            onClick={handleClearAll}
            disabled={loading}
            className="ml-auto px-6 py-3 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            🗑️ Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms/Controls */}
          <div className="lg:col-span-1 space-y-6">
            {activeTab === 'build' && (
              <>
                <NodeForm onSuccess={fetchGraphData} existingNodes={graphData.nodes} />
                <EdgeForm onSuccess={fetchGraphData} existingNodeIds={nodeIds} />
                <CredentialForm onSuccess={fetchGraphData} existingNodeIds={nodeIds} />
              </>
            )}

            {activeTab === 'simulate' && (
              <SimulationPanel
                existingCredentialIds={credentialIds}
                onSimulationComplete={handleSimulationComplete}
              />
            )}

            {activeTab === 'results' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Simulation Summary</h3>
                {simulationResult ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Depth:</strong> {simulationResult.total_depth}
                    </p>
                    <p>
                      <strong>Compromised:</strong> {simulationResult.reachable_nodes.length} nodes
                    </p>
                    <p>
                      <strong>Credentials:</strong> {simulationResult.credentials_obtained.length} obtained
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No results yet</p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">System Stats</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">Nodes:</span>
                  <span className="font-bold">{graphData.nodes.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Edges:</span>
                  <span className="font-bold">{graphData.edges.length}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Credentials:</span>
                  <span className="font-bold">{graphData.credentials.length}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'results' ? (
              <ResultsDisplay result={simulationResult} />
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Network Graph</h3>
                  <div className="h-[600px]">
                    <NetworkGraph
                      nodes={graphData.nodes}
                      edges={graphData.edges}
                      reachableNodes={simulationResult?.reachable_nodes || []}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Attack Depth Simulator - Educational Tool for Network Security Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
