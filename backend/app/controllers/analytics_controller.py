# backend/app/controllers/analytics_controller.py
from fastapi import APIRouter, Query
from typing import Optional
from backend.app.services import scoring_service, registry_service, catalog_service

router = APIRouter(prefix="/api/analytics", tags=["Funnel Analytics & Propensity"])

@router.get("/funnel")
def get_funnel_analytics():
    return scoring_service.get_funnel_summary()

@router.get("/hot-leads")
def get_hot_leads(limit: int = Query(30)):
    return scoring_service.get_top_recoverable_leads(limit)

@router.get("/leads")
def get_leads_dataset(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    search: Optional[str] = Query(None),
    segment: Optional[str] = Query(None),
    stage: Optional[str] = Query(None),
    drop_reason: Optional[str] = Query(None),
    has_gstin: Optional[str] = Query(None),
    city: Optional[str] = Query(None)
):
    return scoring_service.get_leads_paginated(
        page=page,
        limit=limit,
        search=search,
        segment=segment,
        stage=stage,
        drop_reason=drop_reason,
        has_gstin=has_gstin,
        city=city
    )

@router.get("/admin-stats")
def get_admin_stats():
    summary = scoring_service.get_admin_summary()
    summary["registry_stats"] = {
        "gstin_total": len(registry_service.gstin_records),
        "udyam_total": len(registry_service.udyam_records),
        "products_total": len(catalog_service.products)
    }
    return summary

