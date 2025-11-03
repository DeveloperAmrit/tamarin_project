"""
In-memory storage for the application
"""
from typing import Dict, List
from app.models import Node, Edge, Credential


class Storage:
    """Simple in-memory storage for nodes, edges, and credentials"""
    
    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.edges: List[Edge] = []
        self.credentials: Dict[str, Credential] = {}
    
    def add_node(self, node: Node) -> None:
        """Add a node to storage"""
        self.nodes[node.id] = node
    
    def add_edge(self, edge: Edge) -> None:
        """Add an edge to storage"""
        self.edges.append(edge)
    
    def add_credential(self, credential: Credential) -> None:
        """Add a credential to storage"""
        self.credentials[credential.id] = credential
    
    def get_node(self, node_id: str) -> Node | None:
        """Get a node by ID"""
        return self.nodes.get(node_id)
    
    def get_credential(self, cred_id: str) -> Credential | None:
        """Get a credential by ID"""
        return self.credentials.get(cred_id)
    
    def get_all_nodes(self) -> List[Node]:
        """Get all nodes"""
        return list(self.nodes.values())
    
    def get_all_edges(self) -> List[Edge]:
        """Get all edges"""
        return self.edges
    
    def get_all_credentials(self) -> List[Credential]:
        """Get all credentials"""
        return list(self.credentials.values())
    
    def clear(self) -> None:
        """Clear all data"""
        self.nodes.clear()
        self.edges.clear()
        self.credentials.clear()


# Global storage instance
storage = Storage()
