# backend/app/controllers/registry_controller.py
from fastapi import APIRouter
from backend.app.services import registry_service

router = APIRouter(prefix="/api/registry", tags=["Registry"])

@router.get("/gstin/{gstin}")
def lookup_gstin(gstin: str):
    return registry_service.lookup_gstin(gstin)

@router.get("/udyam/{udyam_number}")
def lookup_udyam(udyam_number: str):
    return registry_service.lookup_udyam(udyam_number)
