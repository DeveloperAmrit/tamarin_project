'use client';

import React, { useState } from 'react';
import { Credential, PrivilegeLevel } from '@/types/api';
import { apiClient } from '@/lib/api';

interface CredentialFormProps {
  onSuccess: () => void;
  existingNodeIds: string[];
}

const PRIVILEGE_LEVELS: PrivilegeLevel[] = ['none', 'user', 'admin', 'root'];

export default function CredentialForm({ onSuccess, existingNodeIds }: CredentialFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    privilege_level: 'user' as PrivilegeLevel,
    valid_on_nodes: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential: Credential = {
        id: formData.id.trim(),
        privilege_level: formData.privilege_level,
        valid_on_nodes: formData.valid_on_nodes,
      };

      if (credential.valid_on_nodes.length === 0) {
        setError('Please select at least one node');
        setLoading(false);
        return;
      }

      await apiClient.addCredential(credential);
      setFormData({ id: '', privilege_level: 'user', valid_on_nodes: [] });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add credential');
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    setFormData((prev) => ({
      ...prev,
      valid_on_nodes: prev.valid_on_nodes.includes(nodeId)
        ? prev.valid_on_nodes.filter((id) => id !== nodeId)
        : [...prev.valid_on_nodes, nodeId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Add Credential</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credential ID *
        </label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., admin-ssh-key, leaked-password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Privilege Level *
        </label>
        <select
          value={formData.privilege_level}
          onChange={(e) => setFormData({ ...formData, privilege_level: e.target.value as PrivilegeLevel })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          required
        >
          {PRIVILEGE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valid on Nodes * (select at least one)
        </label>
        {existingNodeIds.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
            {existingNodeIds.map((nodeId) => (
              <div key={nodeId} className="flex items-center">
                <input
                  type="checkbox"
                  id={`node-${nodeId}`}
                  checked={formData.valid_on_nodes.includes(nodeId)}
                  onChange={() => toggleNode(nodeId)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`node-${nodeId}`} className="ml-2 text-sm text-gray-700">
                  {nodeId}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No nodes available. Please add nodes first.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || existingNodeIds.length === 0}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Credential'}
      </button>
    </form>
  );
}
