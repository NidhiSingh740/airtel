# backend/app/controllers/catalog_controller.py
from fastapi import APIRouter, Query
from typing import Optional
from backend.app.models.schemas import QuoteRequest, RecommendationRequest
from backend.app.services import catalog_service

router = APIRouter(prefix="/api", tags=["Catalog & Bundles"])

@router.get("/products")
def get_products(
    city_tier: int = Query(1),
    employee_count: int = Query(1),
    num_sites: int = Query(1),
    has_gstin: bool = Query(True),
    segment: Optional[str] = Query(None)
):
    return catalog_service.filter_eligible_products(
        city_tier=city_tier,
        employee_count=employee_count,
        num_sites=num_sites,
        has_gstin=has_gstin,
        segment=segment
    )

@router.post("/quote/calculate")
def calculate_quote(req: QuoteRequest):
    return catalog_service.calculate_quote(req.items, req.current_spend)

@router.post("/recommend")
def recommend_bundles(req: RecommendationRequest):
    return catalog_service.recommend_bundles(
        business_type=req.business_type,
        employee_count=req.employee_count,
        num_sites=req.num_sites,
        city_tier=req.city_tier,
        has_gstin=req.has_gstin,
        current_spend=req.current_spend
    )
