from typing import Dict, Any, List

class ConversationalAdvisor:
    """
    Intelligent conversational advisor engine supporting Hindi, Hinglish, Marathi, Tamil, Telugu,
    and English. Recommends targeted packs and calculates transparent bundle quotes.
    """

    GREETINGS = {
        "hi": "नमस्ते! 🙏 मैं आपका **Accel साथी** हूँ।\n\nआपकी दुकान, क्लिनिक या बिज़नेस के लिए सबसे किफ़ायती और तेज़ इंटरनेट, फ़्रेश मोबाइल लाइन्स और डिजिटल बिलिंग प्लान चुनने में आपकी सहायता करूँगा।\n\nबताइए, आपका **बिज़नेस किस प्रकार का है**?",
        "en": "Namaste! 🙏 I am your **Accel Saathi**.\n\nI will help you set up reliable broadband, business SIMs, CCTV, and billing suited specifically to your business size.\n\nTo get started, **what type of business do you run**? (e.g. Retail shop, Clinic, Office, Restaurant)",
        "mr": "नमस्कार! 🙏 मी आपला **Accel साथी** आहे.\n\nतुमच्या दुकानासाठी, क्लिनिकसाठी किंवा कार्यालयासाठी योग्य इंटरनेट आणि बिलिंग प्लॅन निवडण्यात मी मदत करेन.\n\nतुमचा **व्यवसाय कोणत्या प्रकारचा आहे**?",
        "ta": "வணக்கம்! 🙏 நான் உங்கள் **Accel சாத்தி**.\n\nஉங்கள் கடை அல்லது வணிகத்திற்கு சிறந்த பிராட்பேண்ட் மற்றும் டிஜிட்டல் திட்டத்தை தேர்ந்தெடுக்க உதவுகிறேன்.\n\nஉங்கள் **வணிகம் எவ்வகையானது**?",
        "te": "నమస్కారం! 🙏 నేను మీ **Accel సాథి**.\n\nమీ దుకాణం లేదా వ్యాపారానికి తగిన ఇంటర్నెట్ మరియు బిజినెస్ ప్లాన్‌ను ఎంచుకోవడంలో సహాయం చేస్తాను.\n\nమీది **ఏ రకమైన వ్యాపారం**?"
    }

    QUICK_REPLIES = {
        "hi": ["दुकान / किराना (Retail Shop)", "क्लिनिक / डॉक्टर (Clinic / Health)", "ऑफ़िस / CA (Professional Office)", "रेस्टोरेंट / होटल (Restaurant)", "फ़ैक्ट्री / गोदाम (Manufacturing)"],
        "en": ["Retail / Kirana Shop", "Clinic / Healthcare", "Office / Professional", "Restaurant / Hotel Chain", "Factory / Warehouse"],
        "mr": ["दुकान / किराणा", "क्लिनिक / दवाखाना", "कार्यालय / फर्म", "हॉटेल / कॅफे", "कारखाना"],
        "ta": ["சில்லறை கடை", "மருத்துவமனை / கிளினிக்", "அலுவலகம்", "உணவகம்", "தொழிற்சாலை"],
        "te": ["రిటైల్ / కిరాణా", "క్లినిక్", "ఆఫీస్", "రెస్టారెంట్", "ఫ్యాక్టరీ"]
    }

    def __init__(self, catalog_service, registry_service):
        self.catalog = catalog_service
        self.registry = registry_service

    def handle_message(self, message: str, state: Dict[str, Any], lang: str = "hi") -> Dict[str, Any]:
        """
        State machine flow:
        STEP 0: Greeting -> Ask business type
        STEP 1: Business type received -> Ask employee count & sites
        STEP 2: Size received -> Ask GSTIN presence & current telecom spend
        STEP 3: Generate and display tailored bundle recommendation card
        """
        step = state.get("step", 0)
        msg_clean = message.strip().lower()

        # Step 0: Initial prompt
        if step == 0:
            state["step"] = 1
            return {
                "reply": self.GREETINGS.get(lang, self.GREETINGS["hi"]),
                "quick_replies": self.QUICK_REPLIES.get(lang, self.QUICK_REPLIES["hi"]),
                "state": state
            }

        # Step 1: Business type detection
        if step == 1:
            state["business_type"] = message
            state["step"] = 2
            
            if lang == "en":
                reply = "Got it! How many **team members/employees** work with you, and how many **locations/shops** do you have?"
                qrs = ["1-2 staff, 1 shop", "3-5 staff, 1 shop", "6-15 staff, 1 shop", "Multi-branch (2+ locations)"]
            elif lang == "mr":
                reply = "छान! तुमच्याकडे साधारण किती **कर्मचारी** काम करतात आणि किती **शाखा/दुकान** आहेत?"
                qrs = ["१-२ कर्मचारी, १ दुकान", "३-५ कर्मचारी, १ दुकान", "६-१५ कर्मचारी, १ ऑफिस", "एकापेक्षा जास्त शाखा"]
            elif lang == "ta":
                reply = "சிறப்பு! உங்களிடம் எத்தனை **பணியாளர்கள்** உள்ளனர் மற்றும் எத்தனை **கிளைகள்** உள்ளன?"
                qrs = ["1-2 ஊழியர்கள், 1 கடை", "3-5 ஊழியர்கள், 1 கடை", "பல கிளைகள் (Multi-site)"]
            elif lang == "te":
                reply = "మంచిది! మీ వద్ద ఎంతమంది **ఉద్యోగులు** పనిచేస్తున్నారు మరియు ఎన్ని **బ్రాంచీలు** ఉన్నాయి?"
                qrs = ["1-2 సిబ్బంది, 1 షాప్", "3-5 సిబ్బంది", "బహుళ బ్రాంచీలు"]
            else: # Hindi / Hinglish
                reply = "बहुत बढ़िया! 👍\n\nआपकी दुकान या ऑफ़िस में लगभग **कितने लोग काम करते हैं** और कुल **कितनी शाखाएँ/लोकेशन** हैं?"
                qrs = ["1-2 लोग, 1 दुकान", "3-5 कर्मचारी, 1 दुकान", "6-15 स्टाफ़, 1 ऑफ़िस", "2 या अधिक शाखाएँ (Multi-site)"]

            return {
                "reply": reply,
                "quick_replies": qrs,
                "state": state
            }

        # Step 2: Scale and GSTIN inquiry
        if step == 2:
            state["scale_info"] = message
            state["step"] = 3
            
            # Extract numbers if present
            emp = 2
            sites = 1
            if "multi" in msg_clean or "शाखा" in msg_clean or "branch" in msg_clean or "2+" in msg_clean:
                sites = 3
                emp = 12
            elif "6-15" in msg_clean:
                emp = 8
            elif "3-5" in msg_clean:
                emp = 4

            state["employee_count"] = emp
            state["num_sites"] = sites

            if lang == "en":
                reply = "Almost there! Do you have a **GSTIN registered** for your firm, and approximately how much do you currently spend on internet + phone monthly?"
                qrs = ["Yes, GST Registered (Spend ~₹1500)", "Yes, GST Registered (Spend ~₹3500)", "No GSTIN currently (Spend ~₹800)", "GST Active (Spend ~₹7000+)"]
            elif lang == "mr":
                reply = "शेवटचा प्रश्न! आपल्याकडे **GST नोंदणी** आहे का, आणि सध्या साधारण दरमहा इंटरनेट व फोनचा खर्च किती होतो?"
                qrs = ["होय, GST आहे (खर्च ~₹1500)", "होय, GST आहे (खर्च ~₹3500)", "नाही, GST नाही (खर्च ~₹800)"]
            elif lang == "ta":
                reply = "கடைசி கேள்வி! உங்களிடம் **GST பதிவு** உள்ளதா? தற்போதைய மாதச் செலவு தோராயமாக எவ்வளவு?"
                qrs = ["ஆம், GST உள்ளது (~₹1500)", "ஆம், GST உள்ளது (~₹3500)", "இல்லை, GST இல்லை"]
            elif lang == "te":
                reply = "చివరి ప్రశ్న! మీకు **GST నంబర్** ఉందా? ప్రస్తుతం నెలకు ఎంత ఖర్చు అవుతోంది?"
                qrs = ["అవును, GST ఉంది (~₹1500)", "అవును, GST ఉంది (~₹3500)", "లేదు, GST లేదు"]
            else: # Hindi
                reply = "बस एक आखिरी सवाल! क्या आपके पास **GST नंबर** है, और अभी आप इंटरनेट + फ़ोन पर हर महीने **लगभग कितना खर्च** करते हैं?"
                qrs = ["हाँ, GST है (खर्च ~₹1500/माह)", "हाँ, GST है (खर्च ~₹3500/माह)", "GST नहीं है (खर्च ~₹800/माह)", "हाँ, GST रजिस्टर्ड (खर्च ~₹7000+)"]

            return {
                "reply": reply,
                "quick_replies": qrs,
                "state": state
            }

        # Step 3: Bundle recommendation
        if step == 3:
            has_gstin = "हाँ" in message or "yes" in msg_clean or "होय" in message or "ஆம்" in message or "అవును" in message
            current_spend = 2500
            if "1500" in message:
                current_spend = 1500
            elif "3500" in message:
                current_spend = 3500
            elif "800" in message:
                current_spend = 800
            elif "7000" in message:
                current_spend = 7000

            state["has_gstin"] = has_gstin
            state["current_spend"] = current_spend
            state["step"] = 4

            # Generate bundles from Catalog Service
            rec = self.catalog.recommend_bundles(
                business_type=state.get("business_type", "retail"),
                employee_count=state.get("employee_count", 2),
                num_sites=state.get("num_sites", 1),
                city_tier=1,
                has_gstin=has_gstin,
                current_spend=current_spend
            )

            rec_bundle = next((b for b in rec["bundles"] if b.get("is_recommended")), rec["bundles"][0])
            monthly_price = rec_bundle["quote"]["monthly_total_min"]
            savings = rec_bundle["quote"]["estimated_monthly_savings"]
            install_days = rec_bundle["quote"]["typical_activation_days"]

            if lang == "en":
                reply = (
                    f"🎉 **Your Customized Accel Saathi Plan is Ready!**\n\n"
                    f"📦 **Plan:** {rec_bundle['title']}\n"
                    f"💰 **Transparent Monthly Price:** ₹{monthly_price:,}/month\n"
                    f"📉 **Estimated Monthly Savings:** ₹{savings:,}/month\n"
                    f"⏱️ **Fast Installation:** Within ~{install_days} business days\n"
                    f"🔒 **Zero Hidden Fees:** All taxes and SLA terms clearly stated."
                )
            elif lang == "mr":
                reply = (
                    f"🎉 **आपल्या व्यवसायासाठी खास Accel साथी प्लॅन तयार आहे!**\n\n"
                    f"📦 **प्लॅन:** {rec_bundle['title']}\n"
                    f"💰 **एकूण मासिक शुल्क:** ₹{monthly_price:,}/महिना\n"
                    f"📉 **मासिक बचत:** ₹{savings:,}/महिना\n"
                    f"⏱️ **कमीत कमी वेळात चालू:** ~{install_days} कामकाजाच्या दिवसांत\n"
                    f"🔒 **कोणताही लपवलेला खर्च नाही!**"
                )
            else: # Hindi
                reply = (
                    f"🎉 **आपके बिज़नेस के लिए बेस्ट Accel साथी प्लान तैयार है!**\n\n"
                    f"📦 **सुझाया गया प्लान:** {rec_bundle['title']}\n"
                    f"💰 **पारदर्शी मासिक शुल्क:** ₹{monthly_price:,}/महीना (सब मिलाकर)\n"
                    f"📉 **आपकी अनुमानित बचत:** ₹{savings:,}/महीना\n"
                    f"⏱️ **सुपरफास्ट इंस्टॉलेशन:** मात्र ~{install_days} कार्यदिवसों में\n"
                    f"🔒 **कोई छुपा चार्ज नहीं!** GST इनवॉइस व 24x7 बिज़नेस सपोर्ट शामिल है।"
                )

            return {
                "reply": reply,
                "recommended_bundle": rec_bundle,
                "all_bundles": rec["bundles"],
                "quick_replies": [
                    "आगे बढ़ें व KYC करें (Proceed to KYC)",
                    "अन्य विकल्प देखें (View Other Tiers)",
                    "नया प्लान कस्टमाइज़ करें (Customize)"
                ],
                "state": state
            }

        # Step 4: Follow up
        return {
            "reply": "आप सीधे नीचे दिए गए 'दस्तावेज़ वेरिफ़िकेशन (Smart KYC)' या 'प्लान कस्टमाइज़' टैब पर क्लिक करके आगे बढ़ सकते हैं!",
            "quick_replies": ["दस्तावेज़ जाँचें (Smart KYC)", "नया कोटेशन बनाएँ"],
            "state": state
        }
