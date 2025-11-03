/**
 * TypeScript types matching the backend API models
 */

export type PrivilegeLevel = 'none' | 'user' | 'admin' | 'root';

export interface Node {
  id: string;
  role: string;
  services: string[];
  credentials_stored: string[];
}

export interface Edge {
  source: string;
  target: string;
  bidirectional: boolean;
}

export interface Credential {
  id: string;
  privilege_level: PrivilegeLevel;
  valid_on_nodes: string[];
}

export interface HackerProfile {
  name: string;
  starting_credentials: string[];
}

export interface AttackPath {
  node_id: string;
  privilege: PrivilegeLevel;
  credentials_used: string[];
  credentials_harvested: string[];
}

export interface SimulationResult {
  reachable_nodes: string[];
  attack_paths: AttackPath[];
  total_depth: number;
  credentials_obtained: string[];
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  credentials: Credential[];
}
