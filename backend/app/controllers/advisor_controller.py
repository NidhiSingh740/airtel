# backend/app/controllers/advisor_controller.py
from fastapi import APIRouter
from backend.app.models.schemas import ChatRequest
from backend.app.services import advisor_service, gemini_service, catalog_service

router = APIRouter(prefix="/api", tags=["Advisor Chat"])

@router.post("/chat")
def chat_with_advisor(req: ChatRequest):
    curr_state = req.state or {}
    ctx = req.context or {}

    # Extract context passed from client
    b_type = ctx.get("businessType") or curr_state.get("business_type")
    emp_str = ctx.get("employeeCount") or curr_state.get("employee_count")
    c_tier = ctx.get("cityTier") or curr_state.get("city_tier")
    step = ctx.get("step") or curr_state.get("step")

    lang = ctx.get("language") or req.language or "en"
    msg = req.message.strip()
    msg_lower = msg.lower()

    # 1. First attempt Gemini if configured and working
    if gemini_service.model:
        gemini_res = gemini_service.generate_chat_response(
            user_message=req.message,
            context=ctx or curr_state,
            language=lang
        )
        if not gemini_res.get("error"):
            gemini_res["state"] = curr_state
            return gemini_res

    # 2. Sequential Conversational Flow
    # Check for restart or explore alternative starter pack request
    is_restart_or_alt = any(k in msg_lower for k in ["alternative", "starter", "restart", "start over", "beginning", "low-cost starter", "नया प्लान", "शुरू"])
    if is_restart_or_alt:
        reply = (
            "ज़रूर! आइए आपके लिए एकदम सही और किफ़ायती स्टार्टर प्लान ढूँढते हैं। 👍\n\nशुरू करने के लिए बताइए, आपका **बिज़नेस किस प्रकार का है**?"
            if lang == "hi" else
            "Sure! Let's explore alternative starter packs from the beginning. 👍\n\nTo get started, **what type of business do you run**?"
        )
        options = [
            {"label": "🏪 Retail / Kirana Shop", "value": "Retail / Kirana Store"},
            {"label": "🩺 Clinic / Healthcare", "value": "Dental / Diagnostic Clinic"},
            {"label": "💼 Professional Office (CA/Legal)", "value": "Professional Office / CA Firm"},
            {"label": "🍽️ Restaurant / Cafe", "value": "Restaurant / Food Outlet"},
            {"label": "🏭 Manufacturing / Workshop", "value": "Small Manufacturing Unit"}
        ]
        return {
            "reply": reply,
            "message": reply,
            "quick_replies": [o["label"] for o in options],
            "options": options,
            "state": {"step": 1, "business_type": None, "employee_count": None, "city_tier": None}
        }

    # Check for greeting or start
    is_greeting = any(g == msg_lower or msg_lower.startswith(g + " ") for g in ["hi", "hello", "hey", "namaste", "नमस्ते", "start"])

    if is_greeting and not b_type:
        reply = (
            "नमस्ते! 🙏 मैं आपका **Accel साथी** हूँ। आपके बिज़नेस के लिए सही इंटरनेट, फ़ोन, सिम और बिलिंग प्लान ढूँढने में मदद करूँगा।\n\nशुरू करने के लिए, बताइए आपका बिज़नेस किस प्रकार का है?"
            if lang == "hi" else
            "Hello! 🙏 I am your **Accel Saathi**. I will help you set up reliable broadband, SIMs, and billing tailored to your business.\n\nTo get started, what type of business do you run?"
        )
        options = [
            {"label": "🏪 Retail / Kirana Shop", "value": "Retail / Kirana Store"},
            {"label": "🩺 Clinic / Healthcare", "value": "Dental / Diagnostic Clinic"},
            {"label": "💼 Professional Office (CA/Legal)", "value": "Professional Office / CA Firm"},
            {"label": "🍽️ Restaurant / Cafe", "value": "Restaurant / Food Outlet"},
            {"label": "🏭 Manufacturing / Workshop", "value": "Small Manufacturing Unit"}
        ]
        return {
            "reply": reply,
            "message": reply,
            "quick_replies": [o["label"] for o in options],
            "options": options,
            "state": {"step": 1}
        }

    # Step 1: Detect business type (or transition from step 1)
    is_biz_type = any(k in msg_lower for k in [
        "retail", "kirana", "shop", "store", "clinic", "health", "doctor",
        "office", "ca firm", "restaurant", "cafe", "food", "manufacturing", "factory", "workshop"
    ])

    if (step == 1 or is_biz_type) and not emp_str:
        if is_biz_type:
            b_type = msg
        reply = (
            f"बहुत बढ़िया! 👍\n\nआपके **{b_type or 'बिज़नेस'}** में लगभग **कितने लोग काम करते हैं**?"
            if lang == "hi" else
            f"Great! How many **team members / employees** work at your **{b_type or 'business'}**?"
        )
        options = [
            {"label": "👥 1 – 5 team members", "value": "1 - 5 staff"},
            {"label": "👥 5 – 15 team members", "value": "5 - 15 staff"},
            {"label": "🏢 15 – 50 staff", "value": "15 - 50 staff"},
            {"label": "🏬 Multi-branch (2+ locations)", "value": "Multi-branch chain"}
        ]
        return {
            "reply": reply,
            "message": reply,
            "quick_replies": [o["label"] for o in options],
            "options": options,
            "state": {"step": 2, "business_type": b_type}
        }

    # Step 2: Detect staff / scale (or transition from step 2)
    is_staff = any(k in msg_lower for k in ["staff", "employee", "team", "member", "branch", "people", "लोग", "स्टाफ़"]) or (step == 2 and any(d in msg_lower for d in ["1", "5", "15", "50"]))

    if (step == 2 or is_staff) and not c_tier:
        if is_staff:
            emp_str = msg
        reply = (
            "समझ गया! आपका बिज़नेस **किस शहर/स्थान** में स्थित है?"
            if lang == "hi" else
            "Got it! Where is your **business located**?"
        )
        options = [
            {"label": "📍 Tier-1 Metro City", "value": "Tier-1 Metro City"},
            {"label": "📍 Tier-2 Growing City", "value": "Tier-2 City"},
            {"label": "📍 Tier-3 Town / Rural", "value": "Tier-3 Town"}
        ]
        return {
            "reply": reply,
            "message": reply,
            "quick_replies": [o["label"] for o in options],
            "options": options,
            "state": {"step": 3, "business_type": b_type, "employee_count": emp_str}
        }

    # Step 3: Detect location / city tier (or transition from step 3)
    is_city = any(k in msg_lower for k in ["tier", "metro", "city", "town", "rural", "शहर", "स्थान"])

    if (step == 3 or is_city) and not (step == 4 or any(k in msg_lower for k in ["broadband", "sim", "pos", "cctv", "wifi", "wi-fi"])):
        if is_city:
            c_tier = msg
        reply = (
            "बस एक आखिरी कदम! आपके बिज़नेस को सबसे ज़्यादा **किस कनेक्टिविटी या डिजिटल सर्विस** की ज़रूरत है?"
            if lang == "hi" else
            "Almost there! What **connectivity and digital services** do you need most?"
        )
        options = [
            {"label": "⚡ Ultra-fast Wi-Fi + 2 Business SIMs", "value": "High-speed broadband and SIMs"},
            {"label": "💳 Reliable UPI & POS billing bundle", "value": "POS billing and payment backup"},
            {"label": "📹 CCTV security + Cloud storage", "value": "Cloud CCTV and surveillance"}
        ]
        return {
            "reply": reply,
            "message": reply,
            "quick_replies": [o["label"] for o in options],
            "options": options,
            "state": {"step": 4, "business_type": b_type, "employee_count": emp_str, "city_tier": c_tier}
        }

    # Step 4: Requirement chosen -> Generate Customized Recommendation Bundle!
    resolved_biz = b_type or "Retail Store"
    emp_num = 3
    if emp_str:
        clean_str = str(emp_str).replace("–", "-")
        if "-" in clean_str:
            parts = clean_str.split("-")
            p1_digits = "".join([c for c in parts[0] if c.isdigit()])
            emp_num = int(p1_digits) if p1_digits else 3
        else:
            digits = "".join([c for c in clean_str if c.isdigit()])
            emp_num = int(digits) if digits else 3
    
    tier_num = 2 if "2" in str(c_tier) else (1 if "1" in str(c_tier) else 2)

    rec = catalog_service.recommend_bundles(
        business_type=resolved_biz,
        employee_count=emp_num,
        num_sites=1,
        city_tier=tier_num,
        has_gstin=True,
        current_spend=2500
    )

    bundles = rec.get("bundles", [])
    rec_bundle = next((b for b in bundles if b.get("is_recommended")), bundles[0] if bundles else None)

    if rec_bundle:
        monthly_price = rec_bundle["quote"]["monthly_total_min"]
        savings = rec_bundle["quote"]["estimated_monthly_savings"]
        install_days = rec_bundle["quote"]["typical_activation_days"]

        if lang == "en":
            reply = (
                f"🎉 **Your Customized Accel Saathi Plan is Ready!**\n\n"
                f"Based on your **{resolved_biz}** with **{emp_num} staff** in **Tier-{tier_num}**, we recommend the **{rec_bundle['title']}**.\n\n"
                f"• **Monthly Total:** ₹{monthly_price:,}/month (all inclusive)\n"
                f"• **Estimated Savings:** ₹{savings:,}/month\n"
                f"• **Activation SLA:** ~{install_days} business days with dedicated priority support."
            )
        else:
            reply = (
                f"🎉 **आपके बिज़नेस के लिए बेस्ट Accel साथी प्लान तैयार है!**\n\n"
                f"आपके **{resolved_biz}** बिज़नेस ({emp_num} स्टाफ़, Tier-{tier_num}) के लिए **{rec_bundle['title']}** सबसे उपयुक्त है।\n\n"
                f"• **पारदर्शी मासिक शुल्क:** ₹{monthly_price:,}/महीना (सब मिलाकर)\n"
                f"• **आपकी अनुमानित बचत:** ₹{savings:,}/महीना\n"
                f"• **इंस्टॉलेशन समय:** मात्र ~{install_days} कार्यदिवसों में"
            )

        return {
            "reply": reply,
            "message": reply,
            "recommended_bundle": rec_bundle,
            "recommendation": rec_bundle,
            "all_bundles": bundles,
            "options": [
                {"label": "📋 View Full Plan & Price Details", "value": "VIEW_QUOTE"},
                {"label": "🛡️ Start Smart KYC Verification", "value": "START_KYC"},
                {"label": "🔄 Explore Alternative Starter Pack", "value": "Show me low-cost starter plans"}
            ],
            "quick_replies": [
                "📋 View Full Plan & Price Details",
                "🛡️ Start Smart KYC Verification",
                "🔄 Explore Alternative Starter Pack"
            ],
            "state": {"step": 5, "business_type": resolved_biz, "employee_count": emp_num, "city_tier": tier_num}
        }

    return {
        "reply": "Please choose from the options below or ask your question:",
        "message": "Please choose from the options below or ask your question:",
        "options": [
            {"label": "🏪 Retail / Kirana Store", "value": "Retail Store"},
            {"label": "🩺 Clinic / Healthcare", "value": "Clinic"},
            {"label": "💼 Professional Office", "value": "Office"}
        ],
        "state": {"step": 1}
    }
