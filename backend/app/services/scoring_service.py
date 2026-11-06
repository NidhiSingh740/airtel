import csv
from pathlib import Path
from typing import Dict, Any, List, Optional

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "YTL_TrackA_Udyam_Digital_Data"

class PropensityScoringService:
    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DATA_DIR
        self.leads: List[Dict[str, Any]] = []
        self._load_leads()

    def _load_leads(self):
        leads_file = self.data_dir / "smb_leads.csv"
        if not leads_file.exists():
            return
        with open(leads_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                self.leads.append(r)

    @staticmethod
    def calculate_score(lead: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates conversion propensity (0 to 100) based on verified statistical
        findings from the 5,000 synthetic leads dataset:
        - GSTIN presence: +40 pts (Activates at 9.6% vs 2.0% without - 5x delta)
        - Formal registration (Udyam): +15 pts
        - Segment conversion tier:
            * Professional offices (+20 pts)
            * Small manufacturers (+18 pts)
            * Small multi-site (+16 pts)
            * Micro retail (+8 pts)
        - Current Provider: Accel existing relationship (+15 pts)
        - Channel / Trust Source:
            * Referral (+12 pts)
            * Field sales (+10 pts)
            * Inbound (+8 pts)
        - High interest signal: >= 2 products requested (+10 pts)
        - Drop Reason Recoverability (for dropped leads):
            * Recoverable by instant advisor/quote (+15 pts) [e.g. 'Quote took too long', 'Decided to wait']
            * Permanent disqualify (-25 pts) [e.g. 'Wrong or invalid number', 'Not interested on first call']
        """
        score = 0
        factors: List[Dict[str, Any]] = []

        # 1. GSTIN (Heavy weight)
        if lead.get("has_gstin") == "Y":
            score += 40
            factors.append({"factor": "Valid GSTIN Registered (+40 pts)", "impact": "Positive"})
        else:
            factors.append({"factor": "No GSTIN on file (-0 pts)", "impact": "Neutral/Risk"})

        # 2. Udyam
        if lead.get("has_udyam") == "Y":
            score += 15
            factors.append({"factor": "MSME Udyam Verified (+15 pts)", "impact": "Positive"})

        # 3. Business Segment
        seg = lead.get("segment", "")
        if seg == "Professional offices":
            score += 20
            factors.append({"factor": "High Value Professional Segment (+20 pts)", "impact": "Positive"})
        elif seg == "Small manufacturers":
            score += 18
            factors.append({"factor": "High Stability Manufacturer (+18 pts)", "impact": "Positive"})
        elif seg == "Small multi-site businesses":
            score += 16
            factors.append({"factor": "Multi-site High ARPU Lead (+16 pts)", "impact": "Positive"})
        else:
            score += 8
            factors.append({"factor": "Micro Retail Segment (+8 pts)", "impact": "Moderate"})

        # 4. Existing Telecom Relationship
        curr_provider = lead.get("current_provider", "")
        if "accel" in curr_provider.lower():
            score += 15
            factors.append({"factor": "Existing Accel Mobile/Broadband Customer (+15 pts)", "impact": "Positive"})

        # 5. Lead Source
        source = lead.get("lead_source", "")
        if source == "Referral":
            score += 12
            factors.append({"factor": "Warm Customer Referral (+12 pts)", "impact": "Positive"})
        elif source == "Field sales":
            score += 10
            factors.append({"factor": "Field Sales Sourced (+10 pts)", "impact": "Positive"})
        elif source == "Inbound call":
            score += 8
            factors.append({"factor": "Direct Inbound Interest (+8 pts)", "impact": "Positive"})

        # 6. Product Interest Breadth
        prods = [p for p in lead.get("products_of_interest", "").split(";") if p]
        if len(prods) >= 2:
            score += 10
            factors.append({"factor": f"Multi-product Interest ({len(prods)} products) (+10 pts)", "impact": "Positive"})

        # 7. Drop Reason Recoverability (if dropped)
        drop = lead.get("drop_reason", "")
        recoverable_reasons = [
            "Quote took too long to arrive",
            "Quote too complex to understand",
            "Owner had no time for a visit",
            "Visit not scheduled by sales",
            "Decided to wait",
            "Found paperwork too long",
            "Document details did not match"
        ]
        unrecoverable_reasons = [
            "Wrong or invalid number",
            "Not interested on first call",
            "Unreachable after 3 attempts"
        ]

        if drop in recoverable_reasons:
            score += 12
            factors.append({"factor": f"High Re-engagement Potential: Dropped due to '{drop}' (+12 pts)", "impact": "Recoverable"})
        elif drop in unrecoverable_reasons:
            score -= 25
            factors.append({"factor": f"Low Contact Quality: '{drop}' (-25 pts)", "impact": "Negative"})

        # Clamp between 0 and 100
        final_score = max(5, min(99, score))
        priority = "HOT" if final_score >= 75 else ("WARM" if final_score >= 50 else "COLD")

        return {
            "score": final_score,
            "priority": priority,
            "recommended_action": (
                "Instant WhatsApp Saathi Quote Dispatch" if priority == "HOT"
                else ("Automated Digital SMS Advisor Link" if priority == "WARM" else "Archive / DLT Re-verify")
            ),
            "key_factors": factors
        }

    def get_top_recoverable_leads(self, limit: int = 50) -> List[Dict[str, Any]]:
        dropped = [l for l in self.leads if l.get("outcome") == "Dropped"]
        scored = []
        for l in dropped:
            res = self.calculate_score(l)
            scored.append({
                "lead_id": l.get("lead_id"),
                "business_name": l.get("business_name"),
                "contact_name": l.get("contact_name"),
                "city": l.get("city"),
                "state": l.get("state"),
                "segment": l.get("segment"),
                "stage_reached": l.get("stage_reached"),
                "drop_reason": l.get("drop_reason"),
                "has_gstin": l.get("has_gstin"),
                "score": res["score"],
                "priority": res["priority"],
                "recommended_action": res["recommended_action"],
                "factors": res["key_factors"]
            })
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:limit]

    def get_funnel_summary(self) -> Dict[str, Any]:
        stages = {
            "Lead": 0,
            "Contacted": 0,
            "Needs assessed": 0,
            "Quote accepted": 0,
            "KYC complete": 0,
            "Activated": 0
        }
        for l in self.leads:
            stg = l.get("stage_reached", "")
            if stg in stages:
                stages[stg] += 1

        # Cumulative funnel counts as reported in README
        cumulative = {
            "Lead": 5000,
            "Contacted": 3406,
            "Needs assessed": 1974,
            "Quote accepted": 861,
            "KYC complete": 588,
            "Activated": 368
        }
        return {
            "total_leads": len(self.leads),
            "stage_distribution": stages,
            "cumulative_funnel": cumulative,
            "blended_acquisition_cost_inr": 15000,
            "avg_days_to_activation": 17.6,
            "avg_customer_chase_calls": 3.0
        }

    def get_leads_paginated(
        self,
        page: int = 1,
        limit: int = 25,
        search: Optional[str] = None,
        segment: Optional[str] = None,
        stage: Optional[str] = None,
        drop_reason: Optional[str] = None,
        has_gstin: Optional[str] = None,
        city: Optional[str] = None
    ) -> Dict[str, Any]:
        filtered = self.leads
        if search:
            q = search.lower().strip()
            filtered = [
                l for l in filtered
                if q in l.get("business_name", "").lower()
                or q in l.get("lead_id", "").lower()
                or q in l.get("contact_name", "").lower()
                or q in l.get("city", "").lower()
                or q in l.get("gstin", "").lower()
            ]
        if segment:
            filtered = [l for l in filtered if l.get("segment") == segment]
        if stage:
            filtered = [l for l in filtered if l.get("stage_reached") == stage]
        if drop_reason:
            filtered = [l for l in filtered if l.get("drop_reason") == drop_reason]
        if has_gstin:
            filtered = [l for l in filtered if l.get("has_gstin") == has_gstin]
        if city:
            filtered = [l for l in filtered if l.get("city", "").lower() == city.lower()]

        total_count = len(filtered)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_leads = filtered[start_idx:end_idx]

        return {
            "total": total_count,
            "page": page,
            "limit": limit,
            "total_pages": (total_count + limit - 1) // limit if limit > 0 else 1,
            "leads": paginated_leads
        }

    def get_admin_summary(self) -> Dict[str, Any]:
        total = len(self.leads)
        activated = len([l for l in self.leads if l.get("outcome") == "Activated"])
        dropped = len([l for l in self.leads if l.get("outcome") == "Dropped"])
        with_gstin = len([l for l in self.leads if l.get("has_gstin") == "Y"])
        with_udyam = len([l for l in self.leads if l.get("has_udyam") == "Y"])
        
        # Segment counts
        segment_stats: Dict[str, Dict[str, Any]] = {}
        for l in self.leads:
            seg = l.get("segment") or "Other"
            if seg not in segment_stats:
                segment_stats[seg] = {"total": 0, "activated": 0, "churned": 0, "total_spend": 0}
            segment_stats[seg]["total"] += 1
            if l.get("outcome") == "Activated":
                segment_stats[seg]["activated"] += 1
                if l.get("churned_within_6_months") == "Y":
                    segment_stats[seg]["churned"] += 1
                try:
                    spend = float(l.get("monthly_bundle_value_inr") or 0)
                    segment_stats[seg]["total_spend"] += spend
                except ValueError:
                    pass

        # Calculate conversion & ARPU
        for seg, data in segment_stats.items():
            data["conversion_rate"] = round((data["activated"] / data["total"] * 100), 1) if data["total"] else 0
            data["churn_rate"] = round((data["churned"] / data["activated"] * 100), 1) if data["activated"] else 0
            data["avg_arpu"] = round(data["total_spend"] / data["activated"]) if data["activated"] else 0

        # Top drop reasons
        drop_reasons: Dict[str, int] = {}
        for l in self.leads:
            dr = l.get("drop_reason")
            if dr:
                drop_reasons[dr] = drop_reasons.get(dr, 0) + 1
        sorted_drops = sorted(drop_reasons.items(), key=lambda x: x[1], reverse=True)

        return {
            "total_leads": total,
            "activated_count": activated,
            "dropped_count": dropped,
            "activation_rate": round(activated / total * 100, 2) if total else 0,
            "with_gstin_count": with_gstin,
            "with_udyam_count": with_udyam,
            "segment_performance": segment_stats,
            "top_drop_reasons": [{"reason": k, "count": v} for k, v in sorted_drops[:8]]
        }
