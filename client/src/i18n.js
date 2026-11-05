// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        howItWorks: "How It Works",
        features: "Features",
        advisor: "Saathi Advisor",
        quote: "Quote Builder",
        kyc: "KYC Upload",
        tracker: "Order Tracker",
        dashboard: "Sales Dashboard",
        getStarted: "Get Started",
      },
      hero: {
        badge: "AI-Powered Digital Enablement for MSMEs",
        titlePrefix: "Instant Business Setup & Verification with",
        subtitle: "Transforming telecom & connectivity onboarding for micro-enterprises. Powered by automated Udyam/GST verification, instant lead propensity scoring, and Saathi AI assistant.",
        primaryCta: "Talk to Saathi AI Advisor",
        secondaryCta: "Find Your Business Plan",
        trust1: "Instant Udyam & GST Validation",
        trust2: "Paperless Digital KYC",
        trust3: "Automated Lead Scoring",
      },
      how: {
        title: "How Udyam Digital Works",
        step1Title: "AI Advisor",
        step1Desc: "Chat with multi-lingual Saathi AI to describe your business scale, location, and connectivity needs.",
        step2Title: "Smart Bundle",
        step2Desc: "Get dynamically tailored fiber, voice, and fleet SIM packages matching your propensity score.",
        step3Title: "Digital KYC",
        step3Desc: "Upload Udyam & GST certificates for instant OCR parsing and official registry validation.",
        step4Title: "Live Activation",
        step4Desc: "Track installation stages in real-time and launch enterprise connectivity in minutes."
      },
      features: {
        title: "Engineered for Modern Enterprise Growth",
        recTitle: "Smart Recommendations",
        recDesc: "Algorithmic bundle selection based on business type, city tier, employee count, and propensity scoring.",
        pricingTitle: "Transparent Pricing",
        pricingDesc: "Dynamic quote engine presenting upfront setup costs, monthly plans, and verified savings comparisons.",
        kycTitle: "Digital KYC Validation",
        kycDesc: "Automated OCR document parsing that cross-verifies URN & GSTIN records against official registries.",
        trackerTitle: "Real-Time Order Tracking",
        trackerDesc: "End-to-end timeline visibility tracking approval stages down to final service activation."
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "मुख्य पृष्ठ",
        howItWorks: "यह कैसे काम करता है",
        features: "विशेषताएं",
        advisor: "साथी सलाहकार",
        quote: "कोट बिल्डर",
        kyc: "केवाईसी अपलोड",
        tracker: "ऑर्डर ट्रैकर",
        dashboard: "बिक्री डैशबोर्ड",
        getStarted: "शुरू करें",
      },
      hero: {
        badge: "MSME के लिए AI-संचालित डिजिटल सशक्तिकरण",
        titlePrefix: "इसके साथ त्वरित व्यवसाय सेटअप और सत्यापन",
        subtitle: "सूक्ष्म उद्यमों के लिए दूरसंचार और कनेक्टिविटी ऑनबोर्डिंग को सुगम बनाना। स्वचालित उद्यम/जीएसटी सत्यापन, त्वरित लीड स्कोरिंग और साथी एआई सहायक द्वारा संचालित।",
        primaryCta: "साथी AI सलाहकार से बात करें",
        secondaryCta: "अपनी व्यवसाय योजना खोजें",
        trust1: "त्वरित उद्यम और जीएसटी सत्यापन",
        trust2: "कागज रहित डिजिटल केवाईसी",
        trust3: "स्वचालित लीड स्कोरिंग",
      },
      how: {
        title: "उद्यम डिजिटल कैसे काम करता है",
        step1Title: "AI सलाहकार",
        step1Desc: "अपने व्यवसाय के आकार, स्थान और कनेक्टिविटी आवश्यकताओं का वर्णन करने के लिए बहुभाषी साथी AI से चैट करें।",
        step2Title: "स्मार्ट बंडल",
        step2Desc: "अपने प्रवृत्ति स्कोर से मेल खाते गतिशील रूप से तैयार फाइबर, वॉयस और सिम पैकेज प्राप्त करें।",
        step3Title: "डिजिटल केवाईसी",
        step3Desc: "त्वरित OCR पार्सिंग और आधिकारिक रजिस्ट्री सत्यापन के लिए उद्यम और जीएसटी प्रमाण पत्र अपलोड करें।",
        step4Title: "लाइव सक्रियण",
        step4Desc: "वास्तविक समय में इंस्टॉलेशन चरणों को ट्रैक करें और मिनटों में उद्यम कनेक्टिविटी शुरू करें।"
      },
      features: {
        title: "आधुनिक उद्यम विकास के लिए निर्मित",
        recTitle: "स्मार्ट सिफारिशें",
        recDesc: "व्यवसाय के प्रकार, शहर के स्तर, कर्मचारी संख्या और स्कोरिंग के आधार पर एल्गोरिथम बंडल चयन।",
        pricingTitle: "पारदर्शी मूल्य निर्धारण",
        pricingDesc: "अपफ्रंट सेटअप लागत, मासिक योजनाओं और सत्यापित बचत तुलनाओं को प्रस्तुत करने वाला डायनामिक कोट इंजन।",
        kycTitle: "डिजिटल केवाईसी सत्यापन",
        kycDesc: "स्वचालित OCR दस्तावेज़ पार्सिंग जो आधिकारिक रजिस्ट्रियों के खिलाफ URN और GSTIN रिकॉर्ड का मिलान करता है।",
        trackerTitle: "वास्तविक समय ऑर्डर ट्रैकिंग",
        trackerDesc: "अंतिम सेवा सक्रियण तक स्वीकृति चरणों को ट्रैक करने वाली एंड-टू-एंड टाइमलाइन दृश्यता।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;