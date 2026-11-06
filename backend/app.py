"""
Main entry point for running the Accel Saathi backend application.
Exposes the modular MVC FastAPI application.
"""
import sys
from pathlib import Path

# Ensure project root is in sys.path so 'backend.app...' imports succeed from any working directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
