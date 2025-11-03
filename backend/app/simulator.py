"""
Attack simulation engine using network traversal
"""
from typing import Set, List, Dict, Tuple
import networkx as nx
from collections import deque

from app.models import (
    HackerProfile, 
    SimulationResult, 
    AttackPath, 
    PrivilegeLevel,
    Node,
    Credential
)
from app.storage import storage


class AttackSimulator:
    """Simulates how deep a hacker can penetrate a network"""
    
    def __init__(self):
        self.graph = nx.DiGraph()
    
    def build_graph(self) -> None:
        """Build the network graph from storage"""
        self.graph.clear()
        
        # Add nodes
        for node in storage.get_all_nodes():
            self.graph.add_node(node.id, data=node)
        
        # Add edges
        for edge in storage.get_all_edges():
            self.graph.add_edge(edge.source, edge.target)
            if edge.bidirectional:
                self.graph.add_edge(edge.target, edge.source)
    
    def simulate(self, hacker: HackerProfile) -> SimulationResult:
        """
        Simulate the attack starting from the hacker's initial credentials.
        
        Algorithm:
        1. Start with initial credentials
        2. Find all nodes accessible with current credentials
        3. For each newly accessed node:
           - Harvest credentials stored on that node
           - Add to available credentials
        4. Repeat until no new nodes can be reached
        """
        self.build_graph()
        
        # Track state
        available_credentials: Set[str] = set(hacker.starting_credentials)
        compromised_nodes: Set[str] = set()
        attack_paths: List[AttackPath] = []
        
        # BFS queue: (node_id, depth, path_to_node)
        queue = deque()
        visited_with_creds: Dict[str, Set[str]] = {}  # node_id -> set of cred_ids used to access it
        
        # Initialize: find nodes accessible with starting credentials
        for cred_id in hacker.starting_credentials:
            cred = storage.get_credential(cred_id)
            if cred:
                for node_id in cred.valid_on_nodes:
                    if node_id in self.graph:
                        queue.append((node_id, 0, [cred_id]))
        
        max_depth = 0
        
        while queue:
            current_node_id, depth, creds_used = queue.popleft()
            
            # Skip if already visited with these credentials
            if current_node_id in visited_with_creds:
                if all(c in visited_with_creds[current_node_id] for c in creds_used):
                    continue
            
            # Check if we can actually access this node with available credentials
            can_access = False
            best_privilege = PrivilegeLevel.NONE
            actual_creds_used = []
            
            for cred_id in available_credentials:
                cred = storage.get_credential(cred_id)
                if cred and current_node_id in cred.valid_on_nodes:
                    can_access = True
                    actual_creds_used.append(cred_id)
                    # Track the highest privilege level
                    if self._privilege_rank(cred.privilege_level) > self._privilege_rank(best_privilege):
                        best_privilege = cred.privilege_level
            
            if not can_access:
                continue
            
            # Mark as visited
            if current_node_id not in visited_with_creds:
                visited_with_creds[current_node_id] = set()
            visited_with_creds[current_node_id].update(actual_creds_used)
            
            # Compromise this node
            if current_node_id not in compromised_nodes:
                compromised_nodes.add(current_node_id)
                max_depth = max(max_depth, depth)
                
                # Harvest credentials from this node
                node = storage.get_node(current_node_id)
                harvested_creds = []
                if node:
                    for cred_id in node.credentials_stored:
                        if cred_id not in available_credentials:
                            available_credentials.add(cred_id)
                            harvested_creds.append(cred_id)
                
                # Record attack path
                attack_path = AttackPath(
                    node_id=current_node_id,
                    privilege=best_privilege,
                    credentials_used=actual_creds_used,
                    credentials_harvested=harvested_creds
                )
                attack_paths.append(attack_path)
                
                # Explore neighbors
                if current_node_id in self.graph:
                    for neighbor in self.graph.neighbors(current_node_id):
                        if neighbor not in compromised_nodes:
                            queue.append((neighbor, depth + 1, actual_creds_used))
        
        return SimulationResult(
            reachable_nodes=list(compromised_nodes),
            attack_paths=attack_paths,
            total_depth=max_depth,
            credentials_obtained=list(available_credentials)
        )
    
    def _privilege_rank(self, privilege: PrivilegeLevel) -> int:
        """Return numeric rank for privilege level"""
        ranks = {
            PrivilegeLevel.NONE: 0,
            PrivilegeLevel.USER: 1,
            PrivilegeLevel.ADMIN: 2,
            PrivilegeLevel.ROOT: 3
        }
        return ranks.get(privilege, 0)


# Global simulator instance
simulator = AttackSimulator()
