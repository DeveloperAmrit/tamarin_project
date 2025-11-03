'use client';

import React, { useState } from 'react';
import { Edge } from '@/types/api';
import { apiClient } from '@/lib/api';

interface EdgeFormProps {
  onSuccess: () => void;
  existingNodeIds: string[];
}

export default function EdgeForm({ onSuccess, existingNodeIds }: EdgeFormProps) {
  const [formData, setFormData] = useState({
    source: '',
    target: '',
    bidirectional: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const edge: Edge = {
        source: formData.source.trim(),
        target: formData.target.trim(),
        bidirectional: formData.bidirectional,
      };

      await apiClient.addEdge(edge);
      setFormData({ source: '', target: '', bidirectional: true });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add edge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Add Edge</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Node *
        </label>
        {existingNodeIds.length > 0 ? (
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select source node</option>
            {existingNodeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Source node ID"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Node *
        </label>
        {existingNodeIds.length > 0 ? (
          <select
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select target node</option>
            {existingNodeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Target node ID"
            required
          />
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="bidirectional"
          checked={formData.bidirectional}
          onChange={(e) => setFormData({ ...formData, bidirectional: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="bidirectional" className="ml-2 text-sm text-gray-700">
          Bidirectional connection
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Edge'}
      </button>
    </form>
  );
}
