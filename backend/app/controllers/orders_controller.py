# backend/app/controllers/orders_controller.py
"""
Orders Controller — Smart KYC submission + Order Tracking API
Accepts 4 KYC document uploads, runs OCR + validation, saves to MongoDB,
returns order record with tracking stages.
"""
import shutil
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from backend.app.config import UPLOAD_DIR
from backend.app.services import get_ocr_service
from backend.app.services import kyc_validator
from backend.app.services.mongo_service import (
    insert_order, get_order_by_id, get_order_by_ref, get_all_orders, is_connected
)

router = APIRouter(prefix="/api/orders", tags=["Orders & KYC Submission"])

ENGINEERS = [
    {"name": "Rajesh Kumar",   "phone": "98765-43210"},
    {"name": "Amit Verma",     "phone": "97654-32109"},
    {"name": "Priya Sharma",   "phone": "96543-21098"},
    {"name": "Suresh Nair",    "phone": "95432-10987"},
]

def _make_order_ref() -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    short = uuid.uuid4().hex[:5].upper()
    return f"ORD-{today}-{short}"

def _build_tracker_stages(kyc_date: datetime, install_days: int) -> list:
    """Build the WhatsApp-style timeline stages for the order."""
    import random
    engineer = random.choice(ENGINEERS)

    d0 = kyc_date.strftime("%Y-%m-%d")
    payment_date  = (kyc_date + timedelta(days=1)).strftime("%Y-%m-%d")
    install_date  = (kyc_date + timedelta(days=3)).strftime("%Y-%m-%d")
    activate_date = (kyc_date + timedelta(days=install_days)).strftime("%Y-%m-%d")
    days_left     = max(0, (kyc_date + timedelta(days=install_days) - datetime.utcnow()).days)

    return [
        {"label": "Plan Selected",          "date": d0,            "done": True,  "icon": "Package"},
        {"label": "KYC Verified",           "date": d0,            "done": True,  "icon": "CheckCircle2"},
        {"label": "Payment Received",       "date": payment_date,  "done": False, "icon": "CheckCircle2"},
        {"label": "Installation Scheduled", "date": install_date,  "done": False, "icon": "Calendar",
         "engineer": engineer["name"], "phone": engineer["phone"]},
        {"label": "Expected Activation",    "date": activate_date, "done": False, "icon": "Zap",
         "daysLeft": days_left},
    ]


@router.post("/submit-kyc")
async def submit_kyc_and_create_order(
    # 4 KYC documents
    gst_cert:      Optional[UploadFile] = File(None),
    udyam_cert:    Optional[UploadFile] = File(None),
    signatory_id:  Optional[UploadFile] = File(None),
    address_proof: Optional[UploadFile] = File(None),
    # Quote / customer metadata (sent as form fields)
    customer_name:    str = Form(""),
    bundle_name:      str = Form("Custom Bundle"),
    monthly_value:    int = Form(0),
    setup_fee:        int = Form(0),
    install_days:     int = Form(5),
    quote_items:      str = Form("[]"),   # JSON string
    consent_given:    str = Form("false"),
):
    """
    Submit all 4 KYC documents + quote info.
    1. OCR-extracts each document.
    2. Runs full cross-validation (GSTIN, Udyam, name match, expiry).
    3. Saves the order record to MongoDB.
    4. Returns order_id + tracking stages.
    """
    if consent_given.lower() != "true":
        raise HTTPException(status_code=400, detail="Consent is required before uploading documents.")

    ocr = get_ocr_service()

    async def _save_and_parse(upload: Optional[UploadFile], doc_type: str):
        if upload is None:
            return None
        dest = UPLOAD_DIR / f"{uuid.uuid4().hex}_{upload.filename}"
        with open(dest, "wb") as f:
            shutil.copyfileobj(upload.file, f)
        lines = ocr.extract_text(dest)
        if doc_type == "gst":
            return ocr.parse_gst_certificate(lines)
        elif doc_type == "udyam":
            return ocr.parse_udyam_certificate(lines)
        elif doc_type == "signatory":
            return ocr.parse_signatory_id(lines)
        else:
            return ocr.parse_address_proof(lines)

    gst_parsed      = await _save_and_parse(gst_cert,      "gst")
    udyam_parsed    = await _save_and_parse(udyam_cert,    "udyam")
    sig_parsed      = await _save_and_parse(signatory_id,  "signatory")
    address_parsed  = await _save_and_parse(address_proof, "address")

    # Run full KYC validation
    val_result = kyc_validator.validate_application(
        gst_doc=gst_parsed,
        udyam_doc=udyam_parsed,
        signatory_doc=sig_parsed,
        address_doc=address_parsed,
        lead_profile={"customer_name": customer_name}
    )

    now         = datetime.utcnow()
    order_ref   = _make_order_ref()
    stages      = _build_tracker_stages(now, install_days or 5)

    import json
    try:
        items_list = json.loads(quote_items)
    except Exception:
        items_list = []

    order_doc = {
        "order_ref":     order_ref,
        "customer_name": customer_name or (gst_parsed or {}).get("legal_name") or "Customer",
        "bundle_name":   bundle_name,
        "monthly_value": monthly_value,
        "setup_fee":     setup_fee,
        "install_days":  install_days,
        "quote_items":   items_list,
        "kyc": {
            "approved":    val_result.get("approved", False),
            "checks":      val_result.get("checks", []),
            "errors":      val_result.get("errors", []),
            "warnings":    val_result.get("warnings", []),
            "remediation": val_result.get("remediation_guidance", []),
        },
        "extracted_docs": {
            "gst":       gst_parsed,
            "udyam":     udyam_parsed,
            "signatory": sig_parsed,
            "address":   address_parsed,
        },
        "stages":      stages,
        "status":      "kyc_submitted",
        "created_at":  now,
        "updated_at":  now,
    }

    # Save to MongoDB
    mongo_ok = is_connected()
    order_id = None
    if mongo_ok:
        order_id = insert_order(order_doc)
    else:
        # Fallback: use the order_ref as the ID when MongoDB is unavailable
        order_id = order_ref

    return {
        "success":   True,
        "order_id":  order_id,
        "order_ref": order_ref,
        "kyc_approved": val_result.get("approved", False),
        "kyc_errors":   val_result.get("errors", []),
        "kyc_warnings": val_result.get("warnings", []),
        "customer_name": order_doc["customer_name"],
        "bundle_name":   bundle_name,
        "monthly_value": monthly_value,
        "setup_fee":     setup_fee,
        "stages":        stages,
        "mongo_persisted": mongo_ok,
    }


@router.get("/track/{order_id}")
def track_order(order_id: str):
    """Fetch a live order from MongoDB by its _id or order_ref."""
    # Try by order_ref first (for fallback IDs)
    doc = get_order_by_ref(order_id)
    if not doc:
        doc = get_order_by_id(order_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")
    return doc


@router.get("/all")
def list_all_orders():
    """List all orders (for admin / dashboard view)."""
    return get_all_orders(limit=100)


@router.get("/health")
def orders_health():
    return {"mongo_connected": is_connected()}
