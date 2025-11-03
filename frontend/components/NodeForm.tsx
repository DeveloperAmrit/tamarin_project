'use client';

import React, { useState } from 'react';
import { Node, PrivilegeLevel } from '@/types/api';
import { apiClient } from '@/lib/api';

interface NodeFormProps {
  onSuccess: () => void;
  existingNodes: Node[];
}

export default function NodeForm({ onSuccess, existingNodes }: NodeFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    role: '',
    services: '',
    credentials_stored: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const node: Node = {
        id: formData.id.trim(),
        role: formData.role.trim(),
        services: formData.services
          ? formData.services.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        credentials_stored: formData.credentials_stored
          ? formData.credentials_stored.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      await apiClient.addNode(node);
      setFormData({ id: '', role: '', services: '', credentials_stored: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Add Node</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Node ID *
        </label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., web-server-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., webserver, database"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Services (comma-separated)
        </label>
        <input
          type="text"
          value={formData.services}
          onChange={(e) => setFormData({ ...formData, services: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., http, ssh, ftp"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credentials Stored (comma-separated IDs)
        </label>
        <input
          type="text"
          value={formData.credentials_stored}
          onChange={(e) => setFormData({ ...formData, credentials_stored: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="e.g., cred-1, cred-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Node'}
      </button>
    </form>
  );
}
