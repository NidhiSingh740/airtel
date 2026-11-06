import os
from pathlib import Path

# Paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent
WORKSPACE_DIR = PROJECT_DIR.parent

# Check for data directory candidates
potential_data_dirs = [
    WORKSPACE_DIR / "YTL_TrackA_Udyam_Digital_Data",
    PROJECT_DIR / "YTL_TrackA_Udyam_Digital_Data",
    PROJECT_DIR / "data",
    BACKEND_DIR / "data"
]

DATA_DIR = next((d for d in potential_data_dirs if d.exists()), WORKSPACE_DIR / "YTL_TrackA_Udyam_Digital_Data")
UPLOAD_DIR = BACKEND_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
STATIC_DIR = BACKEND_DIR / "static"
STATIC_DIR.mkdir(exist_ok=True)
