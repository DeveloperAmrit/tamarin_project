"""
Pydantic models for the Attack Depth Simulator
"""
from typing import List, Optional, Dict, Set
from pydantic import BaseModel, Field
from enum import Enum


class PrivilegeLevel(str, Enum):
    """Privilege levels for credentials"""
    NONE = "none"
    USER = "user"
    ADMIN = "admin"
    ROOT = "root"


class Node(BaseModel):
    """Represents a system node in the network"""
    id: str = Field(..., description="Unique identifier for the node")
    role: str = Field(..., description="Role of the node (e.g., webserver, database)")
    services: List[str] = Field(default_factory=list, description="List of services running on the node")
    credentials_stored: List[str] = Field(default_factory=list, description="IDs of credentials stored on this node")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "web-server-1",
                "role": "webserver",
                "services": ["http", "ssh"],
                "credentials_stored": ["cred-1", "cred-2"]
            }
        }


class Edge(BaseModel):
    """Represents a connection between two nodes"""
    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")
    bidirectional: bool = Field(default=True, description="Whether the connection is bidirectional")
    
    class Config:
        json_schema_extra = {
            "example": {
                "source": "web-server-1",
                "target": "database-1",
                "bidirectional": True
            }
        }


class Credential(BaseModel):
    """Represents a credential that can be used to access nodes"""
    id: str = Field(..., description="Unique identifier for the credential")
    privilege_level: PrivilegeLevel = Field(..., description="Privilege level this credential grants")
    valid_on_nodes: List[str] = Field(..., description="List of node IDs where this credential is valid")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "admin-ssh-key",
                "privilege_level": "admin",
                "valid_on_nodes": ["web-server-1", "web-server-2"]
            }
        }


class HackerProfile(BaseModel):
    """Represents a hacker attempting to penetrate the system"""
    name: str = Field(..., description="Name or identifier for the hacker")
    starting_credentials: List[str] = Field(..., description="List of credential IDs the hacker starts with")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "BlackHat001",
                "starting_credentials": ["leaked-password"]
            }
        }


class AttackPath(BaseModel):
    """Represents a path taken during the attack"""
    node_id: str
    privilege: PrivilegeLevel
    credentials_used: List[str]
    credentials_harvested: List[str]


class SimulationResult(BaseModel):
    """Results from running an attack simulation"""
    reachable_nodes: List[str] = Field(..., description="List of all nodes the hacker could reach")
    attack_paths: List[AttackPath] = Field(..., description="Detailed paths and privileges obtained")
    total_depth: int = Field(..., description="Maximum depth reached in the attack")
    credentials_obtained: List[str] = Field(..., description="All credentials obtained during the attack")
    
    class Config:
        json_schema_extra = {
            "example": {
                "reachable_nodes": ["web-server-1", "database-1"],
                "attack_paths": [],
                "total_depth": 2,
                "credentials_obtained": ["cred-1", "cred-2"]
            }
        }


class GraphData(BaseModel):
    """Complete graph data structure"""
    nodes: List[Node]
    edges: List[Edge]
    credentials: List[Credential]
