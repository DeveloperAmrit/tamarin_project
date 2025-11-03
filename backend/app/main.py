"""
FastAPI application - Attack Depth Simulator Backend
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

from app.models import (
    Node, 
    Edge, 
    Credential, 
    HackerProfile, 
    SimulationResult,
    GraphData
)
from app.storage import storage
from app.simulator import simulator


# Initialize FastAPI app
app = FastAPI(
    title="Attack Depth Simulator API",
    description="Backend API for simulating network penetration attacks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Attack Depth Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "POST /node": "Add a node to the network",
            "POST /edge": "Add an edge between nodes",
            "POST /cred": "Add a credential",
            "POST /simulate": "Run attack simulation",
            "GET /graph": "Get complete graph data",
            "DELETE /clear": "Clear all data"
        }
    }


@app.post("/node", response_model=Dict[str, str])
async def add_node(node: Node):
    """Add a new node to the network"""
    try:
        # Check if node already exists
        if storage.get_node(node.id):
            raise HTTPException(status_code=400, detail=f"Node with ID '{node.id}' already exists")
        
        storage.add_node(node)
        return {"status": "success", "message": f"Node '{node.id}' added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/edge", response_model=Dict[str, str])
async def add_edge(edge: Edge):
    """Add a new edge between two nodes"""
    try:
        # Validate that both nodes exist
        if not storage.get_node(edge.source):
            raise HTTPException(status_code=404, detail=f"Source node '{edge.source}' not found")
        if not storage.get_node(edge.target):
            raise HTTPException(status_code=404, detail=f"Target node '{edge.target}' not found")
        
        storage.add_edge(edge)
        return {"status": "success", "message": f"Edge from '{edge.source}' to '{edge.target}' added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cred", response_model=Dict[str, str])
async def add_credential(credential: Credential):
    """Add a new credential"""
    try:
        # Check if credential already exists
        if storage.get_credential(credential.id):
            raise HTTPException(status_code=400, detail=f"Credential with ID '{credential.id}' already exists")
        
        # Validate that all referenced nodes exist
        for node_id in credential.valid_on_nodes:
            if not storage.get_node(node_id):
                raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found")
        
        storage.add_credential(credential)
        return {"status": "success", "message": f"Credential '{credential.id}' added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/simulate", response_model=SimulationResult)
async def simulate_attack(hacker: HackerProfile):
    """
    Run attack simulation
    
    Simulates how deep a hacker can penetrate the network given their starting credentials.
    Returns all reachable nodes, attack paths, and harvested credentials.
    """
    try:
        # Validate that all starting credentials exist
        for cred_id in hacker.starting_credentials:
            if not storage.get_credential(cred_id):
                raise HTTPException(status_code=404, detail=f"Credential '{cred_id}' not found")
        
        # Run simulation
        result = simulator.simulate(hacker)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/graph", response_model=GraphData)
async def get_graph():
    """Get the complete graph data (nodes, edges, credentials)"""
    try:
        return GraphData(
            nodes=storage.get_all_nodes(),
            edges=storage.get_all_edges(),
            credentials=storage.get_all_credentials()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/clear", response_model=Dict[str, str])
async def clear_data():
    """Clear all stored data"""
    try:
        storage.clear()
        return {"status": "success", "message": "All data cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
