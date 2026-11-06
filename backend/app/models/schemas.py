# backend/app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str
    language: str = "hi"
    state: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None  # Compatible with client Advisor.js

class QuoteItem(BaseModel):
    product_id: str
    quantity: int = 1

class QuoteRequest(BaseModel):
    items: List[Dict[str, Any]] = []
    current_spend: int = 0

class RecommendationRequest(BaseModel):
    business_type: str = "retail"
    employee_count: int = 2
    num_sites: int = 1
    city_tier: int = 1
    has_gstin: bool = True
    current_spend: int = 2500

class GSTINLookupResponse(BaseModel):
    found: bool
    valid_format: bool
    status: Optional[str] = None
    is_active: Optional[bool] = None
    legal_name: Optional[str] = None
    trade_name: Optional[str] = None
    constitution: Optional[str] = None
    principal_place_of_business: Optional[str] = None
    state: Optional[str] = None
    registration_date: Optional[str] = None
    error: Optional[str] = None

class UdyamLookupResponse(BaseModel):
    found: bool
    valid_format: bool
    udyam_number: Optional[str] = None
    enterprise_name: Optional[str] = None
    enterprise_type: Optional[str] = None
    major_activity: Optional[str] = None
    nic_description: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    date_of_registration: Optional[str] = None
    error: Optional[str] = None
