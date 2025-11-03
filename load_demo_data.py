#!/usr/bin/env python3
"""
Demo script to populate the Attack Depth Simulator with sample data
Run this after starting the backend server
"""

import requests
import json

API_URL = "http://localhost:8000"

def clear_data():
    """Clear all existing data"""
    print("🗑️  Clearing existing data...")
    response = requests.delete(f"{API_URL}/clear")
    if response.status_code == 200:
        print("✅ Data cleared")
    else:
        print(f"❌ Failed to clear data: {response.text}")

def add_nodes():
    """Add sample nodes"""
    print("\n📦 Adding nodes...")
    nodes = [
        {
            "id": "web-server-1",
            "role": "webserver",
            "services": ["http", "ssh"],
            "credentials_stored": ["db-creds", "backup-key"]
        },
        {
            "id": "web-server-2",
            "role": "webserver",
            "services": ["http", "ssh"],
            "credentials_stored": []
        },
        {
            "id": "database",
            "role": "database",
            "services": ["mysql", "ssh"],
            "credentials_stored": ["admin-key"]
        },
        {
            "id": "admin-workstation",
            "role": "workstation",
            "services": ["rdp", "ssh"],
            "credentials_stored": ["root-access"]
        },
        {
            "id": "backup-server",
            "role": "backup",
            "services": ["ftp", "ssh"],
            "credentials_stored": []
        },
        {
            "id": "mail-server",
            "role": "mail",
            "services": ["smtp", "imap", "ssh"],
            "credentials_stored": []
        }
    ]
    
    for node in nodes:
        response = requests.post(f"{API_URL}/node", json=node)
        if response.status_code == 200:
            print(f"  ✅ Added node: {node['id']}")
        else:
            print(f"  ❌ Failed to add {node['id']}: {response.text}")

def add_edges():
    """Add sample edges"""
    print("\n🔗 Adding edges...")
    edges = [
        {"source": "web-server-1", "target": "database", "bidirectional": True},
        {"source": "web-server-2", "target": "database", "bidirectional": True},
        {"source": "database", "target": "admin-workstation", "bidirectional": True},
        {"source": "admin-workstation", "target": "backup-server", "bidirectional": True},
        {"source": "backup-server", "target": "mail-server", "bidirectional": True},
        {"source": "web-server-1", "target": "web-server-2", "bidirectional": True},
    ]
    
    for edge in edges:
        response = requests.post(f"{API_URL}/edge", json=edge)
        if response.status_code == 200:
            print(f"  ✅ Added edge: {edge['source']} → {edge['target']}")
        else:
            print(f"  ❌ Failed to add edge: {response.text}")

def add_credentials():
    """Add sample credentials"""
    print("\n🔑 Adding credentials...")
    credentials = [
        {
            "id": "leaked-password",
            "privilege_level": "user",
            "valid_on_nodes": ["web-server-1"]
        },
        {
            "id": "db-creds",
            "privilege_level": "admin",
            "valid_on_nodes": ["database"]
        },
        {
            "id": "backup-key",
            "privilege_level": "user",
            "valid_on_nodes": ["backup-server"]
        },
        {
            "id": "admin-key",
            "privilege_level": "admin",
            "valid_on_nodes": ["admin-workstation", "web-server-2"]
        },
        {
            "id": "root-access",
            "privilege_level": "root",
            "valid_on_nodes": ["admin-workstation", "database", "backup-server"]
        }
    ]
    
    for cred in credentials:
        response = requests.post(f"{API_URL}/cred", json=cred)
        if response.status_code == 200:
            print(f"  ✅ Added credential: {cred['id']} ({cred['privilege_level']})")
        else:
            print(f"  ❌ Failed to add {cred['id']}: {response.text}")

def run_simulation():
    """Run a sample attack simulation"""
    print("\n🎯 Running attack simulation...")
    hacker = {
        "name": "BlackHat001",
        "starting_credentials": ["leaked-password"]
    }
    
    response = requests.post(f"{API_URL}/simulate", json=hacker)
    if response.status_code == 200:
        result = response.json()
        print(f"  ✅ Simulation complete!")
        print(f"     📊 Attack Depth: {result['total_depth']}")
        print(f"     🔴 Compromised Nodes: {len(result['reachable_nodes'])}")
        print(f"     🔑 Credentials Obtained: {len(result['credentials_obtained'])}")
        print(f"     📍 Reachable: {', '.join(result['reachable_nodes'])}")
    else:
        print(f"  ❌ Simulation failed: {response.text}")

def main():
    print("🔒 Attack Depth Simulator - Demo Data Loader")
    print("=" * 50)
    
    try:
        # Test connection
        response = requests.get(f"{API_URL}/health")
        if response.status_code != 200:
            print("❌ Backend server is not responding. Please start it first.")
            print("   Run: cd backend && python run.py")
            return
        
        print("✅ Backend server is running")
        
        # Load demo data
        clear_data()
        add_nodes()
        add_edges()
        add_credentials()
        run_simulation()
        
        print("\n🎉 Demo data loaded successfully!")
        print("\n📝 Next steps:")
        print("   1. Open http://localhost:3000 in your browser")
        print("   2. Click on 'Results' tab to see the simulation")
        print("   3. Or run a new simulation with different credentials")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server.")
        print("   Please make sure the backend is running on http://localhost:8000")
        print("   Run: cd backend && python run.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
