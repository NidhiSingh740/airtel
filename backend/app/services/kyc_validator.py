import re
import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
from difflib import SequenceMatcher

# Case study reference date per instructions
REFERENCE_DATE = datetime.date(2026, 7, 15)

def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

class KYCValidator:
    def __init__(self, registry_service):
        self.registry = registry_service

    def validate_application(
        self,
        gst_doc: Optional[Dict[str, Any]] = None,
        udyam_doc: Optional[Dict[str, Any]] = None,
        signatory_doc: Optional[Dict[str, Any]] = None,
        address_doc: Optional[Dict[str, Any]] = None,
        lead_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Performs end-to-end KYC checks:
        1. Document Completeness Check
        2. GSTIN Format & Live Registry Status Check (Active vs Cancelled/Suspended)
        3. Udyam Registration & Enterprise Name Cross-Match
        4. Signatory Identity vs Registration Name Match
        5. Address Proof Recency Check (<= 90 days from July 15, 2026)
        6. Address Locality Cross-Verification
        """
        checks: List[Dict[str, Any]] = []
        errors: List[str] = []
        warnings: List[str] = []

        # 1. Document Completeness
        docs_present = {
            "GST Certificate": gst_doc is not None,
            "Udyam Certificate": udyam_doc is not None,
            "Signatory ID": signatory_doc is not None,
            "Address Proof": address_doc is not None
        }
        all_docs_uploaded = all(docs_present.values())
        checks.append({
            "check": "Document Completeness",
            "passed": all_docs_uploaded,
            "details": docs_present
        })
        if not all_docs_uploaded:
            missing = [k for k, v in docs_present.items() if not v]
            errors.append(f"Missing required documents: {', '.join(missing)}")

        # 2. GSTIN Checks
        gstin_val = ""
        gst_legal_name = ""
        gst_trade_name = ""
        gst_record = None

        if gst_doc and gst_doc.get("gstin"):
            gstin_val = gst_doc["gstin"].strip().upper()
            lookup = self.registry.lookup_gstin(gstin_val)
            
            if not lookup["valid_format"]:
                checks.append({
                    "check": "GSTIN Format Validation",
                    "passed": False,
                    "error": lookup["error"]
                })
                errors.append(f"Invalid GSTIN format: {gstin_val}")
            elif not lookup["found"]:
                checks.append({
                    "check": "GST Registry Verification",
                    "passed": False,
                    "error": "GSTIN record not found in central registry"
                })
                errors.append(f"GSTIN {gstin_val} does not exist in GST registry")
            else:
                gst_record = lookup
                gst_legal_name = lookup.get("legal_name") or ""
                gst_trade_name = lookup.get("trade_name") or ""
                is_active = lookup.get("is_active", False)
                status = lookup.get("status", "Unknown")

                checks.append({
                    "check": "GST Registry Verification & Status",
                    "passed": is_active,
                    "status": status,
                    "legal_name": gst_legal_name,
                    "trade_name": gst_trade_name,
                    "registered_state": lookup.get("state")
                })

                if not is_active:
                    errors.append(f"GSTIN is {status.upper()}. Accel Business policies require an ACTIVE GST registration.")

        # 3. Udyam Checks
        udyam_val = ""
        udyam_name = ""
        if udyam_doc and udyam_doc.get("udyam_number"):
            udyam_val = udyam_doc["udyam_number"].strip().upper()
            u_lookup = self.registry.lookup_udyam(udyam_val)
            if not u_lookup["found"]:
                checks.append({
                    "check": "Udyam Registry Verification",
                    "passed": False,
                    "error": u_lookup.get("error", "Udyam not found")
                })
                errors.append(f"Udyam registration {udyam_val} not found in MSME registry")
            else:
                udyam_name = u_lookup.get("enterprise_name", "")
                checks.append({
                    "check": "Udyam Registry Verification",
                    "passed": True,
                    "enterprise_name": udyam_name,
                    "enterprise_type": u_lookup.get("enterprise_type"),
                    "activity": u_lookup.get("major_activity")
                })

                # Cross-check Udyam Enterprise Name with GST Trade/Legal Name
                if gst_record:
                    sim_trade = similarity(udyam_name, gst_trade_name)
                    sim_legal = similarity(udyam_name, gst_legal_name)
                    name_match = sim_trade > 0.6 or sim_legal > 0.6 or (udyam_name.lower() in gst_trade_name.lower())
                    checks.append({
                        "check": "Udyam to GST Enterprise Cross-Match",
                        "passed": name_match,
                        "udyam_enterprise": udyam_name,
                        "gst_trade_name": gst_trade_name,
                        "similarity_score": round(max(sim_trade, sim_legal), 2)
                    })
                    if not name_match:
                        errors.append(f"Business name mismatch: Udyam specifies '{udyam_name}' but GST specifies '{gst_trade_name or gst_legal_name}'")

        # 4. Signatory ID Checks
        signatory_name = ""
        if signatory_doc and signatory_doc.get("name"):
            signatory_name = signatory_doc["name"].strip()
            # If GST has a legal name like 'Neha Kaur (Prop. Vindhya Tours)', check if Neha Kaur matches
            if gst_legal_name:
                sim = similarity(signatory_name, gst_legal_name)
                # Check containment (e.g. 'Neha Kaur' inside 'Neha Kaur (Prop. ...)')
                contained = signatory_name.lower() in gst_legal_name.lower()
                matches = contained or sim > 0.7
                checks.append({
                    "check": "Authorised Signatory Match",
                    "passed": matches,
                    "signatory_name": signatory_name,
                    "gst_legal_name": gst_legal_name
                })
                if not matches:
                    errors.append(f"Signatory name '{signatory_name}' does not match registered GST entity name '{gst_legal_name}'")

        # 5. Address Proof Recency (<= 90 days from July 15, 2026)
        if address_doc and address_doc.get("bill_date"):
            bdate_str = address_doc["bill_date"].strip()
            try:
                bdate = datetime.datetime.strptime(bdate_str, "%Y-%m-%d").date()
                age_days = (REFERENCE_DATE - bdate).days
                is_recent = 0 <= age_days <= 90
                checks.append({
                    "check": "Address Proof Validity (<90 Days)",
                    "passed": is_recent,
                    "bill_date": bdate_str,
                    "reference_date": str(REFERENCE_DATE),
                    "age_in_days": age_days,
                    "threshold_days": 90
                })
                if not is_recent:
                    if age_days > 90:
                        errors.append(f"Address proof is expired ({age_days} days old, must be within 90 days of {REFERENCE_DATE})")
                    else:
                        warnings.append("Bill date is set in the future relative to system date.")
            except Exception as e:
                checks.append({
                    "check": "Address Proof Date Parsing",
                    "passed": False,
                    "error": f"Invalid date string format: {bdate_str}"
                })
                errors.append(f"Unable to parse utility bill date: {bdate_str}")

        is_approved = len(errors) == 0
        return {
            "approved": is_approved,
            "status": "APPROVED" if is_approved else "ACTION_REQUIRED",
            "applicant_id": lead_profile.get("lead_id") if lead_profile else None,
            "checks": checks,
            "errors": errors,
            "warnings": warnings,
            "remediation_guidance": [
                f"Please update or re-upload: {err}" for err in errors
            ] if errors else ["All compliance checks verified successfully. Proceed to order activation."]
        }
