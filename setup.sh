#!/bin/bash

# Attack Depth Simulator - Quick Start Script

echo "🔒 Attack Depth Simulator - Quick Start"
echo "========================================"
echo ""

# Check if conda is installed
if ! command -v conda &> /dev/null; then
    echo "❌ Conda is not installed. Please install Anaconda or Miniconda."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Check if conda environment exists
ENV_NAME="attack_simulator"
if conda env list | grep -q "^${ENV_NAME} "; then
    echo "✅ Conda environment '${ENV_NAME}' already exists"
else
    echo "Creating conda environment '${ENV_NAME}'..."
    conda create -n ${ENV_NAME} python=3.11 -y
fi

echo "Activating conda environment..."
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate ${ENV_NAME}

echo "Installing Python dependencies..."
pip install -r requirements.txt -q

echo "✅ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "✅ Node modules already installed"
fi

echo "✅ Frontend setup complete"
echo ""

# Instructions
echo "🚀 Setup Complete! To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  conda activate attack_simulator"
echo "  python run.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "💡 To deactivate conda environment: conda deactivate"
echo ""
echo "Happy hacking! 🎯"
