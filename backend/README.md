# Backend - Attack Depth Simulator

FastAPI backend for the Attack Depth Simulator application.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

Server will start at: http://localhost:8000

API Documentation: http://localhost:8000/docs

## API Endpoints

- `POST /node` - Add a network node
- `POST /edge` - Add connection between nodes
- `POST /cred` - Add credential
- `POST /simulate` - Run attack simulation
- `GET /graph` - Get complete graph data
- `DELETE /clear` - Clear all data

## Development

Run with auto-reload:
```bash
uvicorn app.main:app --reload
```

## Architecture

- `app/main.py` - FastAPI application and routes
- `app/models.py` - Pydantic data models
- `app/storage.py` - In-memory data storage
- `app/simulator.py` - Attack simulation engine using NetworkX
