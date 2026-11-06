# backend/app/controllers/kyc_controller.py
import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.app.config import UPLOAD_DIR, DATA_DIR
from backend.app.services import kyc_validator, get_ocr_service

router = APIRouter(prefix="/api/kyc", tags=["Smart KYC"])

@router.post("/ocr-upload")
async def ocr_document_upload(file: UploadFile = File(...), doc_type: str = Form("AUTO")):
    saved_path = UPLOAD_DIR / file.filename
    with open(saved_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    ocr = get_ocr_service()
    lines = ocr.extract_text(saved_path)
    
    fn_lower = file.filename.lower()
    if doc_type == "GST_CERTIFICATE" or ("gst" in fn_lower):
        parsed = ocr.parse_gst_certificate(lines)
    elif doc_type == "UDYAM_CERTIFICATE" or ("udyam" in fn_lower):
        parsed = ocr.parse_udyam_certificate(lines)
    elif doc_type == "SIGNATORY_ID" or ("signatory" in fn_lower):
        parsed = ocr.parse_signatory_id(lines)
    else:
        parsed = ocr.parse_address_proof(lines)

    return {
        "filename": file.filename,
        "parsed": parsed,
        "extracted_lines": lines
    }

@router.post("/validate-application")
def validate_application(
    gst_doc: Optional[Dict[str, Any]] = None,
    udyam_doc: Optional[Dict[str, Any]] = None,
    signatory_doc: Optional[Dict[str, Any]] = None,
    address_doc: Optional[Dict[str, Any]] = None,
    lead_profile: Optional[Dict[str, Any]] = None
):
    return kyc_validator.validate_application(
        gst_doc=gst_doc,
        udyam_doc=udyam_doc,
        signatory_doc=signatory_doc,
        address_doc=address_doc,
        lead_profile=lead_profile
    )

@router.get("/test-applicant/{applicant_id}")
def test_specimen_applicant(applicant_id: str):
    """
    Test K01-K12 specimens with automatic OCR extraction and rules validation.
    """
    app_id = applicant_id.upper()
    doc_dir = DATA_DIR / "kyc_documents"
    if not doc_dir.exists():
        raise HTTPException(status_code=404, detail="kyc_documents dataset not found")

    ocr = get_ocr_service()
    gst_f = doc_dir / f"{app_id}_gst_certificate.png"
    udyam_f = doc_dir / f"{app_id}_udyam_certificate.png"
    sig_f = doc_dir / f"{app_id}_signatory_id.png"
    addr_f = doc_dir / f"{app_id}_address_proof.png"

    gst_parsed = ocr.parse_gst_certificate(ocr.extract_text(gst_f)) if gst_f.exists() else None
    udyam_parsed = ocr.parse_udyam_certificate(ocr.extract_text(udyam_f)) if udyam_f.exists() else None
    sig_parsed = ocr.parse_signatory_id(ocr.extract_text(sig_f)) if sig_f.exists() else None
    addr_parsed = ocr.parse_address_proof(ocr.extract_text(addr_f)) if addr_f.exists() else None

    val_res = kyc_validator.validate_application(
        gst_doc=gst_parsed,
        udyam_doc=udyam_parsed,
        signatory_doc=sig_parsed,
        address_doc=addr_parsed,
        lead_profile={"lead_id": app_id}
    )

    return {
        "applicant_id": app_id,
        "extracted_docs": {
            "gst": gst_parsed,
            "udyam": udyam_parsed,
            "signatory": sig_parsed,
            "address": addr_parsed
        },
        "validation_result": val_res
    }
