#!/bin/bash

# Start script for Attack Depth Simulator
# This script starts both backend and frontend in separate terminal tabs/windows

echo "🔒 Starting Attack Depth Simulator..."
echo ""

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to start backend
start_backend() {
    echo "🚀 Starting Backend Server..."
    cd "$PROJECT_DIR/backend"
    
    # Activate conda environment
    ENV_NAME="attack_simulator"
    source "$(conda info --base)/etc/profile.d/conda.sh"
    
    if conda env list | grep -q "^${ENV_NAME} "; then
        conda activate ${ENV_NAME}
    else
        echo "⚠️  Conda environment '${ENV_NAME}' not found. Run ./setup.sh first!"
        exit 1
    fi
    
    # Start the backend
    python run.py
}

# Function to start frontend
start_frontend() {
    echo "🚀 Starting Frontend..."
    cd "$PROJECT_DIR/frontend"
    npm run dev
}

# Check if we should run in background
if [ "$1" == "bg" ] || [ "$1" == "background" ]; then
    echo "Starting in background mode..."
    
    # Start backend in background
    (cd "$PROJECT_DIR/backend" && source "$(conda info --base)/etc/profile.d/conda.sh" && conda activate attack_simulator && python run.py > ../backend.log 2>&1) &
    BACKEND_PID=$!
    echo "Backend started (PID: $BACKEND_PID)"
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start frontend in background
    (cd "$PROJECT_DIR/frontend" && npm run dev > ../frontend.log 2>&1) &
    FRONTEND_PID=$!
    echo "Frontend started (PID: $FRONTEND_PID)"
    
    echo ""
    echo "✅ Both servers are running in background!"
    echo "   Backend:  http://localhost:8000 (PID: $BACKEND_PID)"
    echo "   Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
    echo ""
    echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
    echo "Logs: backend.log and frontend.log"
    
else
    # Interactive mode - ask which to start
    echo "Which component do you want to start?"
    echo "  1) Backend only"
    echo "  2) Frontend only"
    echo "  3) Both (you'll need two terminals)"
    read -p "Enter choice (1-3): " choice
    
    case $choice in
        1)
            start_backend
            ;;
        2)
            start_frontend
            ;;
        3)
            echo ""
            echo "Opening Backend in new terminal..."
            # Try to open in new terminal window (works on most Linux systems)
            if command -v gnome-terminal &> /dev/null; then
                gnome-terminal -- bash -c "cd $PROJECT_DIR && ./start.sh backend; exec bash"
                sleep 2
                gnome-terminal -- bash -c "cd $PROJECT_DIR && ./start.sh frontend; exec bash"
            elif command -v xterm &> /dev/null; then
                xterm -e "cd $PROJECT_DIR && ./start.sh backend" &
                sleep 2
                xterm -e "cd $PROJECT_DIR && ./start.sh frontend" &
            else
                echo "Could not detect terminal. Please run in two separate terminals:"
                echo "  Terminal 1: cd backend && conda activate attack_simulator && python run.py"
                echo "  Terminal 2: cd frontend && npm run dev"
            fi
            ;;
        backend)
            start_backend
            ;;
        frontend)
            start_frontend
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
fi
