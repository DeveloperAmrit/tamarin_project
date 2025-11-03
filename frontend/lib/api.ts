/**
 * API client for communicating with the FastAPI backend
 */
import axios from 'axios';
import {
  Node,
  Edge,
  Credential,
  HackerProfile,
  SimulationResult,
  GraphData,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // Node operations
  addNode: async (node: Node): Promise<{ status: string; message: string }> => {
    const response = await api.post('/node', node);
    return response.data;
  },

  // Edge operations
  addEdge: async (edge: Edge): Promise<{ status: string; message: string }> => {
    const response = await api.post('/edge', edge);
    return response.data;
  },

  // Credential operations
  addCredential: async (credential: Credential): Promise<{ status: string; message: string }> => {
    const response = await api.post('/cred', credential);
    return response.data;
  },

  // Simulation
  simulate: async (hacker: HackerProfile): Promise<SimulationResult> => {
    const response = await api.post('/simulate', hacker);
    return response.data;
  },

  // Graph data
  getGraph: async (): Promise<GraphData> => {
    const response = await api.get('/graph');
    return response.data;
  },

  // Clear all data
  clearData: async (): Promise<{ status: string; message: string }> => {
    const response = await api.delete('/clear');
    return response.data;
  },
};
