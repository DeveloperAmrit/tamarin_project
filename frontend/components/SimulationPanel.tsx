'use client';

import React, { useState } from 'react';
import { HackerProfile, SimulationResult } from '@/types/api';
import { apiClient } from '@/lib/api';

interface SimulationPanelProps {
  existingCredentialIds: string[];
  onSimulationComplete: (result: SimulationResult) => void;
}

export default function SimulationPanel({ existingCredentialIds, onSimulationComplete }: SimulationPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    starting_credentials: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const hacker: HackerProfile = {
        name: formData.name.trim() || 'Anonymous Hacker',
        starting_credentials: formData.starting_credentials,
      };

      if (hacker.starting_credentials.length === 0) {
        setError('Please select at least one starting credential');
        setLoading(false);
        return;
      }

      const result = await apiClient.simulate(hacker);
      onSimulationComplete(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const toggleCredential = (credId: string) => {
    setFormData((prev) => ({
      ...prev,
      starting_credentials: prev.starting_credentials.includes(credId)
        ? prev.starting_credentials.filter((id) => id !== credId)
        : [...prev.starting_credentials, credId],
    }));
  };

  return (
    <form onSubmit={handleSimulate} className="space-y-4 bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg shadow-md border-2 border-red-300">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        Attack Simulation
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hacker Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          placeholder="e.g., BlackHat001"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Starting Credentials * (select at least one)
        </label>
        {existingCredentialIds.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
            {existingCredentialIds.map((credId) => (
              <div key={credId} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cred-${credId}`}
                  checked={formData.starting_credentials.includes(credId)}
                  onChange={() => toggleCredential(credId)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor={`cred-${credId}`} className="ml-2 text-sm text-gray-700">
                  {credId}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No credentials available. Please add credentials first.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || existingCredentialIds.length === 0}
        className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold text-lg"
      >
        {loading ? '🔄 Simulating Attack...' : '🚀 Launch Attack Simulation'}
      </button>
    </form>
  );
}
