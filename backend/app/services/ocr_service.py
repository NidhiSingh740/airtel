import csv
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
import easyocr

class DocumentOCRService:
    def __init__(self, use_gpu: bool = False):
        self.reader = easyocr.Reader(['en'], gpu=use_gpu)

    def extract_text(self, image_path: Path) -> List[str]:
        if not Path(image_path).exists():
            return []
        return self.reader.readtext(str(image_path), detail=0)

    def parse_gst_certificate(self, lines: List[str]) -> Dict[str, Any]:
        """
        Extracts GSTIN, Legal Name, and Trade Name from GST certificate text lines.
        """
        joined = " \n ".join(lines)
        gstin = None
        # Heuristic 1: regex search for 15 char pattern
        m = re.search(r"\b([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z])\b", joined.replace(" ", ""))
        if m:
            gstin = m.group(1)
        else:
            # Look line by line after 'GSTIN' keyword
            for i, line in enumerate(lines):
                if "gstin" in line.lower() and i + 1 < len(lines):
                    cand = lines[i+1].replace(" ", "").replace("O", "0").replace("I", "1").upper()
                    # Check if candidate looks like a GSTIN
                    if len(cand) >= 14:
                        gstin = cand[:15]
                        break

        legal_name = None
        trade_name = None
        for i, line in enumerate(lines):
            l_lower = line.lower()
            if "legal name" in l_lower and i + 1 < len(lines):
                legal_name = lines[i+1].strip()
            elif "trade name" in l_lower and i + 1 < len(lines):
                trade_name = lines[i+1].strip()

        return {
            "document_type": "GST_CERTIFICATE",
            "gstin": gstin,
            "legal_name": legal_name,
            "trade_name": trade_name,
            "raw_lines": lines[:12]
        }

    def parse_udyam_certificate(self, lines: List[str]) -> Dict[str, Any]:
        joined = " ".join(lines)
        udyam_number = None
        m = re.search(r"UDYAM-[A-Z]{2}-\s*00-\s*[0-9]{7}", joined)
        if m:
            udyam_number = m.group(0).replace(" ", "")
        else:
            for i, line in enumerate(lines):
                if "udyam" in line.lower() and ("number" in line.lower() or "no" in line.lower()):
                    if i + 1 < len(lines):
                        cand = lines[i+1].replace(" ", "").upper()
                        if "UDYAM" in cand:
                            udyam_number = cand
                            break

        enterprise_name = None
        for i, line in enumerate(lines):
            if "enterprise name" in line.lower() and i + 1 < len(lines):
                enterprise_name = lines[i+1].strip()

        return {
            "document_type": "UDYAM_CERTIFICATE",
            "udyam_number": udyam_number,
            "enterprise_name": enterprise_name,
            "raw_lines": lines[:10]
        }

    def parse_signatory_id(self, lines: List[str]) -> Dict[str, Any]:
        name = None
        designation = None
        for i, line in enumerate(lines):
            l_lower = line.lower().strip()
            if l_lower == "name" or l_lower.startswith("name:"):
                if i + 1 < len(lines):
                    name = lines[i+1].strip()
            elif "designation" in l_lower:
                if i + 1 < len(lines):
                    designation = lines[i+1].strip()

        return {
            "document_type": "SIGNATORY_ID",
            "name": name,
            "designation": designation,
            "raw_lines": lines[:8]
        }

    def parse_address_proof(self, lines: List[str]) -> Dict[str, Any]:
        bill_date = None
        billed_to = None
        for i, line in enumerate(lines):
            l_lower = line.lower()
            if "bill date" in l_lower and i + 1 < len(lines):
                cand = lines[i+1].strip()
                # Find YYYY-MM-DD pattern
                m = re.search(r"\b20[0-9]{2}-[0-9]{2}-[0-9]{2}\b", cand)
                if m:
                    bill_date = m.group(0)
                else:
                    bill_date = cand
            elif "billed to" in l_lower and i + 1 < len(lines):
                billed_to = lines[i+1].strip()

        return {
            "document_type": "ADDRESS_PROOF",
            "bill_date": bill_date,
            "billed_to": billed_to,
            "raw_lines": lines[:10]
        }
