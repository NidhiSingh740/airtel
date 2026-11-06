import csv
from pathlib import Path
from typing import List, Dict, Any, Optional

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "YTL_TrackA_Udyam_Digital_Data"

# Segment mapping for Indian business categories
SEGMENT_MAP = {
    "retail": "micro",
    "kirana": "micro",
    "kirana store": "micro",
    "shop": "micro",
    "store": "micro",
    "salon": "micro",
    "unisex salon": "micro",
    "pharmacy": "micro",
    "bakery": "micro",
    "stationery": "micro",
    "sweet shop": "micro",
    "hardware store": "micro",
    "boutique": "micro",
    "mobile repair": "micro",
    "optician": "micro",
    
    "clinic": "clinic",
    "dental": "clinic",
    "dental clinic": "clinic",
    "diagnostic lab": "clinic",
    "doctor": "clinic",
    "hospital": "clinic",
    "healthcare": "clinic",
    "physiotherapy clinic": "clinic",
    
    "office": "prof",
    "law office": "prof",
    "legal": "prof",
    "ca firm": "prof",
    "ca": "prof",
    "chartered accountant": "prof",
    "architecture studio": "prof",
    "coaching centre": "prof",
    "real estate agency": "prof",
    "insurance agency": "prof",
    "travel agency": "prof",
    "consultant": "prof",
    "software": "prof",
    
    "restaurant": "multi",
    "cafe": "multi",
    "food": "multi",
    "restaurant chain": "multi",
    "retail chain": "multi",
    "bakery chain": "multi",
    "budget hotel": "multi",
    "hotel": "multi",
    "chain": "multi",
    "budget hotel group": "multi",
    "pre-school chain": "multi",
    "pharmacy chain": "multi",
    "multi-branch": "multi",
    "multi-site": "multi",
    
    "manufacturing": "mfg",
    "factory": "mfg",
    "workshop": "mfg",
    "auto-parts": "mfg",
    "plastic moulding": "mfg",
    "textile unit": "mfg",
    "packaging unit": "mfg",
    "food processing": "mfg",
    "industrial": "mfg",
    "plant": "mfg",
    "fabrication": "mfg"
}

def detect_business_segment(business_type: str) -> str:
    b = (business_type or "").lower()
    if any(k in b for k in ["manufactur", "factory", "workshop", "plant", "industrial", "auto-parts", "textile", "packaging", "moulding", "fabrication", "warehouse"]):
        return "mfg"
    if any(k in b for k in ["restaurant", "cafe", "food", "hotel", "chain", "multi-branch", "multi-site", "branch", "outlet", "franchise"]):
        return "multi"
    if any(k in b for k in ["clinic", "dental", "doctor", "health", "diagnostic", "hospital", "physio", "pathology", "medical", "lab"]):
        return "clinic"
    if any(k in b for k in ["ca firm", "ca/legal", "chartered", "law", "legal", "advocate", "consultan", "architect", "office", "firm", "coaching", "agency", "it services", "software"]):
        return "prof"
    if any(k in b for k in ["retail", "kirana", "shop", "store", "salon", "pharmacy", "bakery", "boutique", "repair", "hardware"]):
        return "micro"
    return "micro"

class CatalogService:
    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DATA_DIR
        self.products: Dict[str, Dict[str, Any]] = {}
        self._load_catalog()

    def _load_catalog(self):
        cat_file = self.data_dir / "product_catalogue.csv"
        if not cat_file.exists():
            return

        with open(cat_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                pid = r.get("product_id", "").strip()
                if not pid:
                    continue
                
                # Parse available city tiers
                tiers = [int(t.strip()) for t in r.get("available_city_tiers", "1;2").split(";") if t.strip()]
                # Parse dependencies (requires_one_of)
                req_one_of = [d.strip() for d in r.get("requires_one_of", "").split("|") if d.strip()]
                # Parse target segments
                segments = [s.strip() for s in r.get("target_segments", "").split(";") if s.strip()]

                self.products[pid] = {
                    "product_id": pid,
                    "category": r.get("category"),
                    "product_name": r.get("product_name"),
                    "description": r.get("description"),
                    "unit": r.get("unit"),
                    "price_min": int(r.get("price_min_inr_per_month") or 0),
                    "price_max": int(r.get("price_max_inr_per_month") or 0),
                    "setup_fee": int(r.get("one_time_setup_inr") or 0),
                    "min_contract_months": int(r.get("min_contract_months") or 12),
                    "available_city_tiers": tiers,
                    "min_employees": int(r.get("min_employees") or 1),
                    "min_sites": int(r.get("min_sites") or 1),
                    "requires_gstin": r.get("requires_gstin", "N").strip().upper() == "Y",
                    "requires_one_of": req_one_of,
                    "typical_install_days": int(r.get("typical_install_days") or 3),
                    "target_segments": segments
                }

    def get_all_products(self) -> List[Dict[str, Any]]:
        return list(self.products.values())

    def get_product(self, pid: str) -> Optional[Dict[str, Any]]:
        return self.products.get(pid)

    def filter_eligible_products(
        self,
        city_tier: int = 1,
        employee_count: int = 1,
        num_sites: int = 1,
        has_gstin: bool = False,
        segment: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        eligible = []
        for p in self.products.values():
            # City Tier Check
            if city_tier not in p["available_city_tiers"]:
                continue
            # Min Employees Check
            if employee_count < p["min_employees"]:
                continue
            # Min Sites Check
            if num_sites < p["min_sites"]:
                continue
            # GSTIN Requirement Check
            if p["requires_gstin"] and not has_gstin:
                continue
            # Segment Check (if provided)
            if segment and segment in p["target_segments"]:
                p_copy = dict(p)
                p_copy["is_recommended_for_segment"] = True
                eligible.append(p_copy)
            else:
                p_copy = dict(p)
                p_copy["is_recommended_for_segment"] = False
                eligible.append(p_copy)

        return eligible

    def calculate_quote(self, items: List[Dict[str, Any]], current_spend: int = 0) -> Dict[str, Any]:
        """
        items: List of {"product_id": "P01", "quantity": 1}
        Validates dependency constraints (requires_one_of) and returns itemized + total pricing.
        """
        selected_pids = set()
        for item in items:
            if item.get("quantity", 0) > 0:
                selected_pids.add(item.get("product_id"))

        itemized = []
        missing_dependencies = []
        monthly_total_min = 0
        monthly_total_max = 0
        one_time_setup_total = 0
        max_install_days = 0

        for item in items:
            pid = item.get("product_id")
            qty = max(1, item.get("quantity", 1))
            prod = self.products.get(pid)
            if not prod:
                continue

            # Dependency verification
            if prod["requires_one_of"]:
                met = any(dep in selected_pids for dep in prod["requires_one_of"])
                if not met:
                    req_names = [self.products.get(d, {}).get("product_name", d) for d in prod["requires_one_of"]]
                    missing_dependencies.append({
                        "product_id": pid,
                        "product_name": prod["product_name"],
                        "requires_one_of": req_names
                    })

            cost_min = prod["price_min"] * qty
            cost_max = prod["price_max"] * qty
            setup = prod["setup_fee"] * (qty if prod["unit"] in ["per site", "per counter", "per camera"] else 1)

            monthly_total_min += cost_min
            monthly_total_max += cost_max
            one_time_setup_total += setup
            if prod["typical_install_days"] > max_install_days:
                max_install_days = prod["typical_install_days"]

            itemized.append({
                "product_id": pid,
                "product_name": prod["product_name"],
                "category": prod["category"],
                "unit": prod["unit"],
                "quantity": qty,
                "price_min_total": cost_min,
                "price_max_total": cost_max,
                "setup_fee": setup,
                "typical_install_days": prod["typical_install_days"]
            })

        # Calculate estimated savings against current spend
        savings = 0
        if current_spend > 0 and monthly_total_min < current_spend:
            savings = current_spend - monthly_total_min

        return {
            "valid_bundle": len(missing_dependencies) == 0,
            "missing_dependencies": missing_dependencies,
            "monthly_total_min": monthly_total_min,
            "monthly_total_max": monthly_total_max,
            "one_time_setup_total": one_time_setup_total,
            "typical_activation_days": max_install_days,
            "current_spend": current_spend,
            "estimated_monthly_savings": savings,
            "items": itemized
        }

    def recommend_bundles(
        self,
        business_type: str,
        employee_count: int = 2,
        num_sites: int = 1,
        city_tier: int = 1,
        has_gstin: bool = True,
        current_spend: int = 2500
    ) -> Dict[str, Any]:
        """
        Recommends 3 tiers:
        1. Starter / Shuruwaat Pack (low commitment, high value)
        2. Popular / Dukaan Power Pack (matches typical activated businesses)
        3. Pro / Growth Pack (comprehensive connectivity + cloud + security)
        """
        btype_lower = business_type.lower()
        seg_code = "micro"
        for k, v in SEGMENT_MAP.items():
            if k in btype_lower:
                seg_code = v
                break

        # Define curated, proven bundles mapped by segment
        if seg_code == "micro":
            starter_items = [{"product_id": "P04", "quantity": 1}, {"product_id": "P07", "quantity": 1}] # 5G AirFiber + Mobile
            popular_items = [{"product_id": "P01", "quantity": 1}, {"product_id": "P07", "quantity": 2}, {"product_id": "P19", "quantity": 1}] # Fibre 100 + 2 Mobiles + POS
            pro_items = [{"product_id": "P01", "quantity": 1}, {"product_id": "P07", "quantity": 2}, {"product_id": "P15", "quantity": 1}, {"product_id": "P23", "quantity": 1}, {"product_id": "P22", "quantity": 1}]
            starter_name = "किराना / दुकान स्टार्टर पैक (Dukaan Starter)"
            popular_name = "सुपर बिज़नेस पैक (Super Business Pack - Most Popular)"
            pro_name = "स्मार्ट रिटेल डिजिटल प्रो (Smart Retail Pro)"

        elif seg_code == "prof":
            starter_items = [{"product_id": "P01", "quantity": 1}, {"product_id": "P16", "quantity": max(employee_count, 3)}] # Fibre 100 + Office Suite
            popular_items = [{"product_id": "P02", "quantity": 1}, {"product_id": "P08", "quantity": 1}, {"product_id": "P16", "quantity": max(employee_count, 5)}, {"product_id": "P20", "quantity": max(employee_count, 5)}]
            pro_items = [{"product_id": "P02", "quantity": 1}, {"product_id": "P08", "quantity": 2}, {"product_id": "P09", "quantity": 1}, {"product_id": "P12", "quantity": 2}, {"product_id": "P17", "quantity": 1}, {"product_id": "P20", "quantity": max(employee_count, 5)}]
            starter_name = "क्लिनिक / प्रोफ़ेशनल बेसिक (Clinic & Office Basic)"
            popular_name = "प्रोफ़ेशनल पावर पैक (Professional Power Pack)"
            pro_name = "कंसल्टेंसी कम्प्लीट सूट (Consultancy Complete Suite)"

        elif seg_code == "multi":
            starter_items = [{"product_id": "P01", "quantity": num_sites}, {"product_id": "P09", "quantity": num_sites}]
            popular_items = [{"product_id": "P02", "quantity": num_sites}, {"product_id": "P09", "quantity": num_sites}, {"product_id": "P23", "quantity": num_sites * 2}, {"product_id": "P22", "quantity": num_sites}]
            pro_items = [{"product_id": "P02", "quantity": num_sites}, {"product_id": "P10", "quantity": num_sites}, {"product_id": "P09", "quantity": num_sites}, {"product_id": "P23", "quantity": num_sites * 2}, {"product_id": "P21", "quantity": 1}]
            starter_name = "मल्टी-साइट कनेक्ट (Multi-Site Connect)"
            popular_name = "चेन स्टोर कंट्रोल पैक (Chain Store Control Pack)"
            pro_name = "एंटरप्राइज़ SD-WAN व सुरक्षा पैक (Enterprise SD-WAN Pro)"

        else: # mfg
            starter_items = [{"product_id": "P03", "quantity": 1}, {"product_id": "P20", "quantity": 10}]
            popular_items = [{"product_id": "P05", "quantity": 1}, {"product_id": "P17", "quantity": 2}, {"product_id": "P21", "quantity": 1}]
            pro_items = [{"product_id": "P06", "quantity": 1}, {"product_id": "P24", "quantity": 5}, {"product_id": "P21", "quantity": 1}]
            starter_name = "मैन्युफैक्चरिंग स्पीड पैक (Factory Speed Pack)"
            popular_name = "इंडस्ट्रियल लीज्ड लाइन व सिक्यूरिटी (Industrial Leased Line & Security)"
            pro_name = "स्मार्ट फ़ैक्ट्री IoT ऑटोमेशन (Smart Factory IoT Suite)"

        return {
            "detected_segment": seg_code,
            "bundles": [
                {
                    "tier": "starter",
                    "title": starter_name,
                    "quote": self.calculate_quote(starter_items, current_spend)
                },
                {
                    "tier": "popular",
                    "is_recommended": True,
                    "title": popular_name,
                    "quote": self.calculate_quote(popular_items, current_spend)
                },
                {
                    "tier": "pro",
                    "title": pro_name,
                    "quote": self.calculate_quote(pro_items, current_spend)
                }
            ]
        }
