# backend/app/services/gemini_service.py
import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import google.generativeai as genai
from backend.app.config import BACKEND_DIR

# Load API key
load_dotenv(BACKEND_DIR / ".env")
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class GeminiAdvisorService:
    def __init__(self, catalog_service, registry_service):
        self.catalog = catalog_service
        self.registry = registry_service
        self.model_name = "gemini-flash-latest"
        self.model = genai.GenerativeModel(self.model_name) if api_key else None

    def _build_system_context(self, context: Optional[Dict[str, Any]], lang: str) -> str:
        products = self.catalog.get_all_products()
        prod_summary = "\n".join([
            f"- {p['product_id']}: {p['product_name']} ({p['category']}) - ₹{p['price_min']}-{p['price_max']}/{p['unit']}, Setup ₹{p['setup_fee']}, Requires GST: {p['requires_gstin']}, Depends on: {p['requires_one_of']}"
            for p in products
        ])

        lang_instructions = {
            "hi": "Reply in warm, friendly Hindi (Devanagari script with natural business terms).",
            "en": "Reply in clear, professional English tailored to Indian business owners.",
            "mr": "Reply in polite Marathi.",
            "ta": "Reply in polite Tamil.",
            "te": "Reply in polite Telugu."
        }.get(lang, "Reply in Hinglish (Hindi + English mix).")

        return f"""You are 'Accel Saathi' (एक्सेल साथी), an expert AI digital advisor for Indian MSMEs and shopkeepers created for Accel Business (Track A: Project Udyam Digital).

YOUR MISSION:
Empower Indian small business owners to discover and activate broadband, enterprise SIMs, CCTV, cloud apps, and billing bundles in ONE digital sitting without salesperson delays.

LANGUAGE INSTRUCTION:
{lang_instructions}

GUIDELINES:
1. Speak like a trusted digital companion ('साथी'), NOT an aggressive salesman.
2. Zero jargon: explain technical features in simple business benefits.
3. Use ₹ formatting (e.g. ₹2,500/महीना).
4. Mention that activation takes ~3 to 5 days with zero hidden costs.
5. If the user mentions their business type, staff count, or spend, provide tailored advice.

ACCEL BUSINESS PRODUCT CATALOG (Ground Truth):
{prod_summary}

CURRENT USER CONTEXT:
{json.dumps(context or {}, ensure_ascii=False)}
"""

    def generate_chat_response(
        self,
        user_message: str,
        context: Optional[Dict[str, Any]] = None,
        language: str = "hi"
    ) -> Dict[str, Any]:
        if not self.model or not api_key:
            return {"error": "Gemini API key not configured"}

        system_instruction = self._build_system_context(context, language)

        b_type = (context or {}).get("businessType", "retail")
        emp_count = 3
        try:
            emp_str = str((context or {}).get("employeeCount", "3"))
            if "-" in emp_str:
                emp_count = int(emp_str.split("-")[0])
            elif emp_str.isdigit():
                emp_count = int(emp_str)
        except Exception:
            emp_count = 3

        tier = 2 if "2" in str((context or {}).get("cityTier", "1")) else 1

        # Live GSTIN check if user pasted a 15-char code
        gst_match = None
        for word in user_message.split():
            clean = word.strip().upper()
            if len(clean) == 15 and clean[0].isdigit():
                lookup = self.registry.lookup_gstin(clean)
                if lookup.get("found"):
                    gst_match = lookup
                    break

        prompt = f"""{system_instruction}

User Query:
{user_message}

{f"Live Registry lookup result for GSTIN: {json.dumps(gst_match, ensure_ascii=False)}" if gst_match else ""}
"""
        try:
            response = self.model.generate_content(prompt)
            reply_text = response.text

            # Compute bundle recommendation
            rec = self.catalog.recommend_bundles(
                business_type=b_type,
                employee_count=emp_count,
                num_sites=1,
                city_tier=tier,
                has_gstin=True,
                current_spend=3000
            )

            rec_bundle = next((b for b in rec["bundles"] if b.get("is_recommended")), rec["bundles"][0])

            return {
                "reply": reply_text,
                "message": reply_text,
                "recommended_bundle": rec_bundle,
                "recommendation": rec_bundle,
                "gstin_lookup": gst_match
            }
        except Exception as e:
            return {"error": str(e)}
