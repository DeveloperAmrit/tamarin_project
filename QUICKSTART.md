# 🚀 Quick Start Guide

## Installation & Setup

### 1. Run the setup script
```bash
./setup.sh
```

This will:
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies

### 2. Start the application

**Option A: Manual (Recommended for first time)**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python run.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option B: Using the start script**
```bash
./start.sh
```

### 3. Load demo data (optional)
```bash
# Make sure backend is running first!
python3 load_demo_data.py
```

### 4. Open the application
Visit **http://localhost:3000** in your browser

---

## 🎮 How to Use

### Building Your Network

1. **Switch to "Build Network" tab**
2. **Add Nodes:**
   - Enter unique ID (e.g., "web-server-1")
   - Specify role (e.g., "webserver")
   - Add services (comma-separated: "http, ssh")
   - Optional: List credential IDs stored on this node

3. **Add Edges:**
   - Select source and target nodes
   - Choose if bidirectional (default: yes)

4. **Add Credentials:**
   - Create credential ID (e.g., "admin-key")
   - Set privilege level (none/user/admin/root)
   - Select which nodes this credential can access

### Running Attack Simulation

1. **Switch to "Simulate Attack" tab**
2. **Create hacker profile:**
   - Enter hacker name
   - Select starting credentials (what the hacker already has)

3. **Launch simulation**
   - Click "Launch Attack Simulation"
   - The system will calculate how deep they can go

### Viewing Results

1. **Switch to "Results" tab**
2. **See:**
   - Total attack depth (how many hops from start)
   - Number of compromised nodes
   - All credentials obtained
   - Detailed attack paths with privileges
   - Red highlighted nodes on the graph = compromised

---

## 📊 Example Scenario (Demo Data)

The demo data creates this scenario:

### Network Topology
```
web-server-1 ←→ database ←→ admin-workstation
     ↓              ↑              ↓
web-server-2    (stores         backup-server
                admin-key)           ↓
                                mail-server
```

### Credentials
- **leaked-password**: User access to web-server-1
- **db-creds**: Admin access to database (stored on web-server-1)
- **admin-key**: Admin access to admin-workstation & web-server-2 (stored on database)
- **root-access**: Root access to multiple systems (stored on admin-workstation)

### Attack Simulation
Starting with only `leaked-password`, the hacker:

1. **Compromises web-server-1** (using leaked-password)
   - Harvests: db-creds, backup-key

2. **Compromises database** (using db-creds)
   - Harvests: admin-key

3. **Compromises admin-workstation** (using admin-key)
   - Harvests: root-access

4. **Compromises backup-server** (using root-access or backup-key)

5. **Compromises mail-server** (via backup-server connection)

**Result**: 5/6 nodes compromised with attack depth of 4!

---

## 🔧 Troubleshooting

### Backend won't start
- Make sure you activated the virtual environment
- Check if port 8000 is available: `lsof -i :8000`
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available

### "Failed to fetch graph data"
- Make sure backend is running on port 8000
- Check `.env.local` in frontend folder has correct API URL

### Graph not showing nodes
- Make sure you've added nodes via the form
- Check browser console for errors (F12)

---

## 💡 Tips

1. **Start small**: Add 3-4 nodes first to understand the system
2. **Strategic credentials**: Store important credentials on less-protected nodes to see lateral movement
3. **Experiment with privileges**: Try different privilege levels to see the impact
4. **Clear and restart**: Use "Clear All" button to start fresh
5. **Watch the graph**: Compromised nodes turn RED in real-time

---

## 📝 API Endpoints

If you want to interact programmatically:

```bash
# Add a node
curl -X POST http://localhost:8000/node \
  -H "Content-Type: application/json" \
  -d '{"id":"test","role":"server","services":[],"credentials_stored":[]}'

# Get all data
curl http://localhost:8000/graph

# Run simulation
curl -X POST http://localhost:8000/simulate \
  -H "Content-Type: application/json" \
  -d '{"name":"Hacker","starting_credentials":["leaked-password"]}'
```

Full API docs: **http://localhost:8000/docs**

---

## 🎓 Learning Objectives

This tool teaches:
- **Lateral movement**: How attackers move through networks
- **Credential harvesting**: Finding and using stored credentials
- **Attack surface analysis**: Understanding network vulnerabilities
- **Privilege escalation**: Path from user to root access
- **Network segmentation**: Why isolating systems matters

---

**Have fun and hack responsibly (in the simulator)! 🔒**
