# Conda Setup Guide for Attack Depth Simulator

## Changes Made

The setup and start scripts have been updated to use **Conda** instead of Python's built-in venv.

## Prerequisites

- **Conda** (Anaconda or Miniconda)
- **Node.js 18+**

## Environment Details

- **Environment Name**: `attack_simulator`
- **Python Version**: 3.11

## Setup Instructions

### 1. Run Setup Script
```bash
./setup.sh
```

This will:
- Check for conda installation
- Create a conda environment named `attack_simulator` with Python 3.11
- Install all backend dependencies
- Install frontend dependencies

### 2. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
conda activate attack_simulator
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Manual Conda Commands

### Create the environment manually
```bash
conda create -n attack_simulator python=3.11 -y
```

### Activate the environment
```bash
conda activate attack_simulator
```

### Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Deactivate the environment
```bash
conda deactivate
```

### List all conda environments
```bash
conda env list
```

### Remove the environment (if needed)
```bash
conda remove -n attack_simulator --all
```

## Using the Start Script

The `start.sh` script now also uses conda:

```bash
# Interactive mode
./start.sh

# Background mode
./start.sh bg
```

## Troubleshooting

### "conda: command not found"
- Install Anaconda or Miniconda from:
  - Anaconda: https://www.anaconda.com/download
  - Miniconda: https://docs.conda.io/en/latest/miniconda.html

### Environment activation issues
If conda activate doesn't work, initialize conda:
```bash
conda init bash
# Then restart your terminal
```

### Check conda is initialized
```bash
conda info
```

## Benefits of Using Conda

✅ Better package management for scientific Python libraries (NetworkX, NumPy)
✅ Isolated environment with specific Python version
✅ Easy to share and reproduce environments
✅ Better dependency resolution
✅ Works across Windows, Linux, and macOS

## Migration from venv

If you previously used venv:

1. Remove the old venv folder:
```bash
cd backend
rm -rf venv
```

2. Run the setup script:
```bash
cd ..
./setup.sh
```

That's it! The conda environment will be created automatically.
