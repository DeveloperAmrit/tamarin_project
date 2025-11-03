'use client';

import React from 'react';
import { SimulationResult } from '@/types/api';

interface ResultsDisplayProps {
  result: SimulationResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>No simulation results yet. Run a simulation to see the attack depth.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-600">Total Depth</h4>
          <p className="text-3xl font-bold text-blue-600">{result.total_depth}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <h4 className="text-sm font-medium text-gray-600">Compromised Nodes</h4>
          <p className="text-3xl font-bold text-red-600">{result.reachable_nodes.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-600">Credentials Obtained</h4>
          <p className="text-3xl font-bold text-purple-600">{result.credentials_obtained.length}</p>
        </div>
      </div>

      {/* Reachable Nodes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Compromised Nodes</h3>
        <div className="flex flex-wrap gap-2">
          {result.reachable_nodes.map((nodeId) => (
            <span
              key={nodeId}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
            >
              {nodeId}
            </span>
          ))}
        </div>
      </div>

      {/* Attack Paths */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Attack Paths</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {result.attack_paths.map((path, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{path.node_id}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    path.privilege === 'root'
                      ? 'bg-red-100 text-red-800'
                      : path.privilege === 'admin'
                      ? 'bg-orange-100 text-orange-800'
                      : path.privilege === 'user'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {path.privilege.toUpperCase()}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <strong>Used:</strong>{' '}
                  {path.credentials_used.length > 0 ? (
                    path.credentials_used.join(', ')
                  ) : (
                    <span className="italic">none</span>
                  )}
                </div>
                {path.credentials_harvested.length > 0 && (
                  <div>
                    <strong>Harvested:</strong>{' '}
                    <span className="text-green-600 font-medium">
                      {path.credentials_harvested.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Credentials Obtained */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-3">All Credentials Obtained</h3>
        <div className="flex flex-wrap gap-2">
          {result.credentials_obtained.map((credId) => (
            <span
              key={credId}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {credId}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
