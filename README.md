# Attack Depth Simulator

## 🎯 Overview

The **Attack Depth Simulator** is a full-stack web application that visualizes and simulates how deep a hacker can penetrate into a computer/network system. It allows users to design network topologies as directed graphs, define credentials with various privilege levels, and simulate attack scenarios to understand potential security vulnerabilities.

## 🚀 Features

- **Interactive Network Graph Builder**: Create nodes representing systems (webservers, databases, workstations, etc.)
- **Credential Management**: Define credentials with different privilege levels (none, user, admin, root)
- **Attack Simulation**: Simulate lateral movement and credential harvesting
- **Visual Results**: Interactive graph visualization showing compromised nodes
- **Real-time Analysis**: See attack paths, privileges obtained, and network depth reached

## 🏗️ Architecture

### Backend (FastAPI + Python)
- RESTful API for managing nodes, edges, and credentials
- Network graph traversal using NetworkX
- Attack simulation with BFS algorithm
- Credential harvesting and privilege escalation logic

### Frontend (Next.js + TypeScript)
- Modern, responsive UI built with Tailwind CSS
- Interactive graph visualization using ReactFlow
- Real-time state management
- Form validation and error handling

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | Next.js 15+ (TypeScript, TSX) |
| **UI Library** | Tailwind CSS |
| **Graph Visualization** | ReactFlow (@xyflow/react) |
| **HTTP Client** | Axios |
| **Backend Framework** | FastAPI (Python 3.11+) |
| **Graph Processing** | NetworkX |
| **Data Validation** | Pydantic |
| **Web Server** | Uvicorn |

## 📁 Project Structure

```
tamarin_project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app & endpoints
│   │   ├── models.py         # Pydantic models
│   │   ├── storage.py        # In-memory storage
│   │   └── simulator.py      # Attack simulation engine
│   ├── requirements.txt
│   └── run.py
│
└── frontend/
    ├── app/
    │   ├── page.tsx          # Main application page
    │   └── layout.tsx
    ├── components/
    │   ├── NodeForm.tsx
    │   ├── EdgeForm.tsx
    │   ├── CredentialForm.tsx
    │   ├── SimulationPanel.tsx
    │   ├── ResultsDisplay.tsx
    │   └── NetworkGraph.tsx
    ├── lib/
    │   └── api.ts            # API client
    ├── types/
    │   └── api.ts            # TypeScript interfaces
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Python** 3.11 or higher
- **Node.js** 18+ and npm
- **Git** (optional)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (already exists):**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### 1. Build Your Network

**Add Nodes:**
- Click on the "🏗️ Build Network" tab
- Fill in the node form:
  - **ID**: Unique identifier (e.g., `web-server-1`)
  - **Role**: Type of system (e.g., `webserver`, `database`)
  - **Services**: Comma-separated list (e.g., `http, ssh`)
  - **Credentials Stored**: IDs of credentials on this node

**Add Edges:**
- Define connections between nodes
- Select source and target nodes
- Choose bidirectional or unidirectional

**Add Credentials:**
- Create credentials with specific privilege levels
- Assign to one or more nodes
- Store credentials on nodes for harvesting

### 2. Simulate an Attack

1. Switch to the "🎯 Simulate Attack" tab
2. Enter a hacker name (optional)
3. Select starting credentials (what the hacker initially has)
4. Click "🚀 Launch Attack Simulation"

### 3. View Results

- The "📊 Results" tab shows:
  - **Attack depth**: How many hops the attacker reached
  - **Compromised nodes**: All systems accessed
  - **Attack paths**: Detailed progression with privileges
  - **Credentials obtained**: Harvested during the attack

- The network graph highlights compromised nodes in red

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/node` | Add a node |
| POST | `/edge` | Add an edge |
| POST | `/cred` | Add a credential |
| POST | `/simulate` | Run attack simulation |
| GET | `/graph` | Get complete graph data |
| DELETE | `/clear` | Clear all data |

## 🧪 Example Scenario

1. **Create nodes:**
   - `web-server` (role: webserver, services: http, ssh)
   - `database` (role: database, services: mysql)
   - `admin-workstation` (role: workstation, services: rdp)

2. **Create edges:**
   - `web-server` → `database`
   - `database` → `admin-workstation`

3. **Create credentials:**
   - `leaked-password` (user level, valid on web-server)
   - `db-admin-key` (admin level, valid on database) - stored on web-server
   - `root-access` (root level, valid on admin-workstation) - stored on database

4. **Simulate attack:**
   - Hacker starts with `leaked-password`
   - Compromises web-server
   - Harvests `db-admin-key`
   - Uses it to access database
   - Harvests `root-access`
   - Compromises admin-workstation

**Result**: Attack depth of 2, all 3 nodes compromised!

## 🛡️ Security Concepts Demonstrated

- **Lateral Movement**: Moving between connected systems
- **Credential Harvesting**: Obtaining stored credentials from compromised systems
- **Privilege Escalation**: Using higher-privilege credentials
- **Attack Surface Analysis**: Visualizing potential attack paths
- **Defense in Depth**: Understanding network segmentation importance

## 🔍 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill the process
lsof -i :8000
kill -9 <PID>
```

**Import errors:**
```bash
# Ensure virtual environment is activated
pip install -r requirements.txt --upgrade
```

### Frontend Issues

**API connection errors:**
- Verify backend is running on port 8000
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎓 Educational Purpose

This tool is designed for **educational purposes** to:
- Understand network security concepts
- Visualize attack propagation
- Analyze system vulnerabilities
- Learn about credential management
- Practice secure network design

**⚠️ Warning**: This is a simulation tool. Do not use for actual penetration testing without proper authorization.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Database persistence (PostgreSQL/MongoDB)
- More complex privilege models
- Time-based attack progression
- Network defense mechanisms
- Export/import scenarios
- Advanced graph algorithms

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as a network security visualization and simulation tool.

## 🙏 Acknowledgments

- NetworkX for graph algorithms
- ReactFlow for interactive visualization
- FastAPI for the excellent API framework
- Next.js and Tailwind CSS for the modern frontend

---

**Happy Hacking (Ethically)! 🔐**
