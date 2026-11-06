# backend/app/views/html_views.py
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from backend.app.config import STATIC_DIR

router = APIRouter(tags=["Views"])

@router.get("/", response_class=HTMLResponse)
def serve_test_ui():
    test_html_path = STATIC_DIR / "index.html"
    if test_html_path.exists():
        with open(test_html_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>Accel Saathi Backend is running (MVC Architecture). Test UI index.html not found.</h1>"
