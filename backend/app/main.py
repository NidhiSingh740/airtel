# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.controllers import (
    registry_router,
    catalog_router,
    advisor_router,
    kyc_router,
    analytics_router,
    orders_router,
)
from backend.app.views import views_router
from backend.app.services import registry_service, catalog_service

app = FastAPI(
    title="Accel Saathi - SMB Digital Onboarding API",
    description="MVC Backend API for Accel Saathi / Project Udyam Digital",
    version="2.0.0"
)

# CORS Middleware (Fully enabled for React client on localhost:3000 / localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Controllers
app.include_router(registry_router)
app.include_router(catalog_router)
app.include_router(advisor_router)
app.include_router(kyc_router)
app.include_router(analytics_router)
app.include_router(orders_router)

# Register HTML Views
app.include_router(views_router)

@app.get("/api/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "architecture": "MVC (Model-View-Controller)",
        "service": "Accel Saathi Engine",
        "gstin_records": len(registry_service.gstin_records),
        "udyam_records": len(registry_service.udyam_records),
        "products_catalog": len(catalog_service.products)
    }
