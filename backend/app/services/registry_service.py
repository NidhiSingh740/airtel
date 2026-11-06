import csv
import re
from pathlib import Path
from typing import Optional, Dict, Any

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "YTL_TrackA_Udyam_Digital_Data"

class RegistryService:
    GSTIN_CHECKSUM_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DATA_DIR
        self.gstin_records: Dict[str, Dict[str, Any]] = {}
        self.udyam_records: Dict[str, Dict[str, Any]] = {}
        self._load_data()

    def _load_data(self):
        gstin_file = self.data_dir / "mock_gstin_registry.csv"
        if gstin_file.exists():
            with open(gstin_file, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    g = row.get("gstin", "").strip().upper()
                    if g:
                        self.gstin_records[g] = row

        udyam_file = self.data_dir / "mock_udyam_registry.csv"
        if udyam_file.exists():
            with open(udyam_file, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    u = row.get("udyam_number", "").strip().upper()
                    if u:
                        self.udyam_records[u] = row

    @staticmethod
    def validate_gstin_format(gstin: str) -> Dict[str, Any]:
        """
        Validate format: 15 chars.
        Format: 2 state digits + 5 chars (4th can be X as noted in problem statement)
        + 4 digits + 1 char + 1 digit/char + 'Z' + 1 checksum digit/char.
        """
        gstin = gstin.strip().upper()
        if len(gstin) != 15:
            return {"valid": False, "error": f"GSTIN must be exactly 15 characters (got {len(gstin)})"}
        
        # Indian GSTIN regex supporting 'X' as 4th PAN character for synthetic dataset
        pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$"
        if not re.match(pattern, gstin):
            return {"valid": False, "error": "Invalid GSTIN pattern format."}

        # GSTIN uses a base-36 Luhn-style check digit over its first 14 characters.
        alphabet = RegistryService.GSTIN_CHECKSUM_ALPHABET
        checksum_total = 0
        for index, char in enumerate(gstin[:14]):
            product = alphabet.index(char) * (1 if index % 2 == 0 else 2)
            checksum_total += (product // 36) + (product % 36)

        expected_check_digit = alphabet[(36 - (checksum_total % 36)) % 36]
        if gstin[-1] != expected_check_digit:
            return {
                "valid": False,
                "error": (
                    "Invalid GSTIN checksum "
                    f"(expected '{expected_check_digit}', got '{gstin[-1]}')."
                )
            }

        return {"valid": True, "gstin": gstin}

    def lookup_gstin(self, gstin: str) -> Dict[str, Any]:
        gstin = gstin.strip().upper()
        fmt_res = self.validate_gstin_format(gstin)
        if not fmt_res["valid"]:
            return {"found": False, "valid_format": False, "error": fmt_res["error"]}
        
        record = self.gstin_records.get(gstin)
        if not record:
            return {"found": False, "valid_format": True, "error": "GSTIN not found in GST registry"}
        
        status = record.get("status", "Unknown")
        is_active = status.lower() == "active"
        
        return {
            "found": True,
            "valid_format": True,
            "status": status,
            "is_active": is_active,
            "legal_name": record.get("legal_name"),
            "trade_name": record.get("trade_name"),
            "constitution": record.get("constitution"),
            "principal_place_of_business": record.get("principal_place_of_business"),
            "state": record.get("state"),
            "registration_date": record.get("registration_date")
        }

    @staticmethod
    def validate_udyam_format(udyam: str) -> Dict[str, Any]:
        """
        Format: UDYAM-XX-00-XXXXXXX (per README, district code 00 is synthetic)
        """
        udyam = udyam.strip().upper()
        pattern = r"^UDYAM-[A-Z]{2}-00-[0-9]{7}$"
        if not re.match(pattern, udyam):
            return {"valid": False, "error": "Udyam format must be UDYAM-XX-00-XXXXXXX"}
        return {"valid": True, "udyam_number": udyam}

    def lookup_udyam(self, udyam: str) -> Dict[str, Any]:
        udyam = udyam.strip().upper()
        fmt_res = self.validate_udyam_format(udyam)
        if not fmt_res["valid"]:
            return {"found": False, "valid_format": False, "error": fmt_res["error"]}
        
        record = self.udyam_records.get(udyam)
        if not record:
            return {"found": False, "valid_format": True, "error": "Udyam registration number not found"}
        
        return {
            "found": True,
            "valid_format": True,
            "udyam_number": udyam,
            "enterprise_name": record.get("enterprise_name"),
            "enterprise_type": record.get("enterprise_type"),
            "major_activity": record.get("major_activity"),
            "nic_description": record.get("nic_description"),
            "state": record.get("state"),
            "city": record.get("city"),
            "date_of_registration": record.get("date_of_registration")
        }
