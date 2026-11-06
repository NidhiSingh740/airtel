"""Structured, eligibility-aware onboarding for the Accel Saathi advisor."""
import re
from typing import Any, Dict


class ConversationalAdvisor:
    """Ask four business questions, then offer suitable product bundles."""

    STAFF_OPTIONS = [
        "1-2 staff", "3-5 staff", "6-15 staff", "16+ staff",
    ]
    LOCATION_OPTIONS = [
        "1 location", "2-3 locations", "4+ locations",
    ]
    CONNECTIVITY_OPTIONS = [
        "Mobile hotspot / no fixed internet (Rs 0-1,000/month)",
        "Broadband (Rs 1,001-2,500/month)",
        "Broadband + business phones (Rs 2,501-5,000/month)",
        "Multiple connections / leased line (Rs 5,000+/month)",
    ]
    GST_OPTIONS = [
        "Yes, I have an active GSTIN", "No GSTIN currently",
        "I need to verify my GSTIN first",
    ]

    def __init__(self, catalog_service, registry_service):
        self.catalog = catalog_service
        self.registry = registry_service

    @staticmethod
    def _employee_count(answer: str) -> int:
        lowered = answer.lower()
        match = re.search(r"(\d+)\s*[-–]\s*(\d+)", lowered)
        if match:
            return max(1, (int(match.group(1)) + int(match.group(2))) // 2)
        if "16+" in lowered:
            return 20
        return 2

    @staticmethod
    def _site_count(answer: str) -> int:
        lowered = answer.lower()
        if "4+" in lowered:
            return 4
        if "2-3" in lowered:
            return 3
        return 1

    @staticmethod
    def _spend(answer: str) -> int:
        range_match = re.search(r"Rs\s*(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)", answer, re.IGNORECASE)
        if range_match:
            lower = int(range_match.group(1).replace(",", ""))
            upper = int(range_match.group(2).replace(",", ""))
            return (lower + upper) // 2
        digits = re.findall(r"\d[\d,]*", answer)
        return int(digits[-1].replace(",", "")) if digits else 2_500

    @staticmethod
    def _has_gstin(answer: str) -> bool:
        lowered = answer.lower()
        return not ("no gst" in lowered or "without gst" in lowered or "verify" in lowered)

    def handle_message(self, message: str, state: Dict[str, Any], lang: str = "en") -> Dict[str, Any]:
        """Advance the fixed onboarding sequence using the user's latest answer."""
        state = dict(state or {})
        step = int(state.get("step", 1))
        english = lang == "en"

        if step == 1:
            state.update({"business_type": message, "step": 2})
            return {
                "reply": "Great. Choose the closest staff-count range; an estimate is enough." if english else "Badhiya. Staff ka sabse nazdeeki range chuniye; exact number zaroori nahi hai.",
                "quick_replies": self.STAFF_OPTIONS, "state": state,
            }
        if step == 2:
            state.update({"employee_count": self._employee_count(message), "step": 3})
            return {
                "reply": "How many business locations do you have?" if english else "Aapke business ki kitni locations hain?",
                "quick_replies": self.LOCATION_OPTIONS, "state": state,
            }
        if step == 3:
            state.update({"num_sites": self._site_count(message), "step": 4})
            return {
                "reply": "How do you use internet today? Choose the closest monthly internet-and-phone spend range." if english else "Abhi internet kaise use karte hain? Internet + phone ke liye sabse nazdeeki monthly spend range chuniye.",
                "quick_replies": self.CONNECTIVITY_OPTIONS, "state": state,
            }
        if step == 4:
            state.update({"current_connectivity": message, "current_spend": self._spend(message), "step": 5})
            return {
                "reply": "One last question: does your business have an active GSTIN?" if english else "Aakhri sawaal: kya aapke business ke paas active GSTIN hai?",
                "quick_replies": self.GST_OPTIONS, "state": state,
            }
        if step == 5:
            state.update({"has_gstin": self._has_gstin(message), "step": 6})
            recommendations = self.catalog.recommend_bundles(
                business_type=state.get("business_type", "retail"),
                employee_count=state.get("employee_count", 2),
                num_sites=state.get("num_sites", 1),
                city_tier=state.get("city_tier", 2),
                has_gstin=state["has_gstin"],
                current_spend=state.get("current_spend", 2_500),
            )
            bundles = recommendations["bundles"]
            recommended = next((bundle for bundle in bundles if bundle.get("is_recommended")), bundles[0])
            return {
                "reply": "Here are three eligible plans. Monthly price is shown first; one-time setup charges are listed separately." if english else "Yeh teen eligible plans hain. Monthly price pehle dikhaya gaya hai; one-time setup charges alag hain.",
                "recommendation": recommended, "recommended_bundle": recommended,
                "all_bundles": bundles,
                "quick_replies": ["This looks expensive", "View full quote", "Proceed to Smart KYC", "Start over"],
                "state": state,
            }

        if step == 6 and "expensive" in message.lower():
            recommendations = self.catalog.recommend_bundles(
                business_type=state.get("business_type", "retail"),
                employee_count=state.get("employee_count", 2),
                num_sites=state.get("num_sites", 1),
                city_tier=state.get("city_tier", 2),
                has_gstin=state.get("has_gstin", False),
                current_spend=state.get("current_spend", 2_500),
            )
            bundles = [dict(bundle) for bundle in recommendations["bundles"]]
            for bundle in bundles:
                bundle["is_recommended"] = bundle["tier"] == "starter"
            starter = bundles[0]
            monthly_price = starter["quote"]["monthly_total_min"]
            return {
                "reply": (
                    f"No problem. Start with the lower-commitment {starter['title']} at ₹{monthly_price:,}/month. You can add services later as the business grows."
                    if english else
                    f"Koi baat nahi. ₹{monthly_price:,}/month wale lower-commitment {starter['title']} se shuru kijiye. Business grow hone par services baad mein add kar sakte hain."
                ),
                "recommendation": starter,
                "recommended_bundle": starter,
                "all_bundles": bundles,
                "quick_replies": ["View full quote", "Proceed to Smart KYC", "Start over"],
                "state": state,
            }
        return {
            "reply": "Choose View full quote, proceed to Smart KYC, or start over.",
            "quick_replies": ["View full quote", "Proceed to Smart KYC", "Start over"],
            "state": state,
        }
