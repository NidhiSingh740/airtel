// src/pages/Advisor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Bot,
  Send,
  RotateCcw,
  CheckCircle2,
  User,
  Sparkles
} from 'lucide-react';

export default function Advisor() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const STORAGE_KEY = 'accel_saathi_advisor_chat';

  const defaultGreeting = {
    id: 1,
    sender: 'bot',
    text: i18n.language === 'hi'
      ? 'नमस्ते! 🙏 मैं आपका Accel साथी हूँ। आपके बिज़नेस के लिए सही इंटरनेट, फ़ोन, सिम और बिलिंग प्लान ढूँढने में मदद करूँगा।\n\nशुरू करने के लिए, बताइए आपका बिज़नेस किस प्रकार का है?'
      : 'Hello! 🙏 I am your Accel Saathi. I will help you set up reliable broadband, SIMs, and billing tailored to your business.\n\nTo get started, what type of business do you run?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    recommendation: null,
    options: [
      { label: '🏪 Retail / Kirana Shop', value: 'Retail / Kirana Store' },
      { label: '🩺 Clinic / Healthcare', value: 'Dental / Diagnostic Clinic' },
      { label: '💼 Professional Office (CA/Legal)', value: 'Professional Office / CA Firm' },
      { label: '🍽️ Restaurant / Cafe', value: 'Restaurant / Food Outlet' },
      { label: '🏭 Manufacturing / Workshop', value: 'Small Manufacturing Unit' }
    ]
  };

  const getSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load advisor state from localStorage', e);
    }
    return null;
  };

  const savedData = getSavedData();

  // Business Context State
  const [businessType, setBusinessType] = useState(savedData?.businessType || null);
  const [employeeCount, setEmployeeCount] = useState(savedData?.employeeCount || null);
  const [numSites, setNumSites] = useState(savedData?.numSites || 1);
  const [cityTier, setCityTier] = useState(savedData?.cityTier || null);
  const [step, setStep] = useState(savedData?.step || 1);
  const [advisorState, setAdvisorState] = useState(savedData?.advisorState || { step: 1, city_tier: 2 });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Chat History with built-in interactive choices
  const [messages, setMessages] = useState(savedData?.messages?.length ? savedData.messages : [defaultGreeting]);

  // Persist chat state and messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          businessType,
          employeeCount,
          numSites,
          cityTier,
          step,
          advisorState
        })
      );
    } catch (e) {
      console.warn('Failed to persist advisor state to localStorage', e);
    }
  }, [messages, businessType, employeeCount, numSites, cityTier, step, advisorState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Option Click Directly In Chat
  const handleSelectOption = (optionLabel, optionValue) => {
    handleSendMessage(optionValue, optionLabel);
  };

  const handleSendMessage = async (customText = null, displayLabel = null, overrideContext = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: displayLabel || textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    const activeContext = overrideContext || {
      businessType,
      employeeCount,
      numSites,
      cityTier,
      step,
      language: i18n.language
    };

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: textToSend,
        context: activeContext,
        state: advisorState
      }, { timeout: 15000 });

      const botReply = response.data.reply || response.data.message;
      const recData = response.data.recommendation || response.data.recommended_bundle;
      const nextOptions = response.data.options || [];

      if (response.data.state?.step) {
        setStep(response.data.state.step);
      }
      if (response.data.state) {
        setAdvisorState(response.data.state);
      }
      if (response.data.state?.business_type) {
        setBusinessType(response.data.state.business_type);
      }
      if (response.data.state?.employee_count) {
        setEmployeeCount(String(response.data.state.employee_count));
      }
      if (response.data.state?.num_sites) {
        setNumSites(response.data.state.num_sites);
      }
      if (response.data.state?.city_tier) {
        setCityTier(String(response.data.state.city_tier));
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendation: recData ? {
            name: recData.title || recData.product_name,
            price: `₹${(recData.quote?.monthly_total_min || recData.price_min || 2500).toLocaleString()}`,
            period: '/month',
            savings: recData.quote?.estimated_monthly_savings ? `Save ₹${recData.quote.estimated_monthly_savings.toLocaleString()}/mo vs current` : 'Inclusive of all SLAs',
            items: recData.quote?.items || []
          } : null,
          bundles: response.data.all_bundles || [],
          options: nextOptions
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Accel Saathi plan engine is ready. Please choose from the options below or ask your question:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendation: null,
          options: [
            { label: '🏪 Retail / Kirana Store', value: 'Retail Store' },
            { label: '🩺 Clinic / Healthcare', value: 'Clinic' },
            { label: '💼 Professional Office', value: 'Office' }
          ]
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear advisor state from localStorage', e);
    }

    setBusinessType(null);
    setEmployeeCount(null);
    setNumSites(1);
    setCityTier(null);
    setStep(1);
    setAdvisorState({ step: 1, city_tier: 2 });
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: i18n.language === 'hi'
          ? 'नमस्ते! 🙏 मैं आपका Accel साथी हूँ। आपके बिज़नेस के लिए सही इंटरनेट, फ़ोन, सिम और बिलिंग प्लान ढूँढने में मदद करूँगा।\n\nशुरू करने के लिए, बताइए आपका बिज़नेस किस प्रकार का है?'
          : 'Hello! 🙏 I am your Accel Saathi. I will help you set up reliable broadband, SIMs, and billing tailored to your business.\n\nTo get started, what type of business do you run?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendation: null,
        options: [
          { label: '🏪 Retail / Kirana Shop', value: 'Retail / Kirana Store' },
          { label: '🩺 Clinic / Healthcare', value: 'Dental / Diagnostic Clinic' },
          { label: '💼 Professional Office (CA/Legal)', value: 'Professional Office / CA Firm' },
          { label: '🍽️ Restaurant / Cafe', value: 'Restaurant / Food Outlet' },
          { label: '🏭 Manufacturing / Workshop', value: 'Small Manufacturing Unit' }
        ]
      }
    ]);
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-4">

      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white border border-airtel-border rounded-xl p-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-airtel-red flex items-center justify-center text-white font-bold text-lg">
            a
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-airtel-charcoal">Accel Saathi AI Advisor</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                Online
              </span>
            </div>
            <p className="text-xs text-airtel-slate">Interactive Plan & Connectivity Guidance for MSMEs</p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-airtel-surface hover:bg-airtel-border text-airtel-slate text-xs font-semibold transition-colors border border-airtel-border"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Chat
        </button>
      </div>

      {/* Chat Window */}
      <div className="w-full flex-1 bg-white border border-airtel-border rounded-xl flex flex-col min-h-0 shadow-sm overflow-hidden">

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-airtel-surface">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-airtel-charcoal text-white' : 'bg-airtel-red text-white'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="space-y-3 max-w-[85%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-airtel-charcoal text-white rounded-br-sm'
                      : 'bg-white text-airtel-charcoal border border-airtel-border rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[10px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-white/50 text-right' : 'text-airtel-muted'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Interactive Option Chips inside Chat */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (opt.value === 'VIEW_QUOTE') navigate('/quote');
                            else if (opt.value === 'START_KYC') navigate('/kyc');
                            else if (opt.value === 'START_OVER') handleResetChat();
                            else if (opt.value === 'TOO_EXPENSIVE') handleSendMessage('This looks expensive', opt.label);
                            else handleSelectOption(opt.label, opt.value);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-airtel-red hover:text-white border border-airtel-border hover:border-airtel-red text-airtel-charcoal text-xs font-semibold shadow-sm transition-all text-left flex items-center gap-1.5"
                        >
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recommended Bundle Card */}
                  {msg.recommendation && (
                    <div className="bg-white border-2 border-airtel-red/20 rounded-xl p-4 shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-airtel-border pb-2.5">
                        <span className="text-xs font-bold text-airtel-red uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Recommended Solution
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {msg.recommendation.savings}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-airtel-charcoal">{msg.recommendation.name}</h4>
                        <div className="mt-2 space-y-1.5">
                          {msg.recommendation.items && msg.recommendation.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-airtel-slate">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                {item.product_name} ({item.quantity}x)
                              </span>
                              <span className="font-semibold text-airtel-charcoal">₹{item.price_min_total.toLocaleString()}/mo</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-airtel-border flex items-center justify-between">
                        <div>
                          <span className="text-xl font-extrabold text-airtel-charcoal">{msg.recommendation.price}</span>
                          <span className="text-xs text-airtel-slate ml-1">{msg.recommendation.period}</span>
                        </div>
                        <button
                          onClick={() => navigate('/quote')}
                          className="px-4 py-2 bg-airtel-red hover:bg-airtel-red-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Plan Customize Karein
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.bundles && msg.bundles.length > 1 && (
                    <div className="grid gap-2">
                      <p className="text-xs font-bold text-airtel-charcoal">Compare eligible plans</p>
                      {msg.bundles.map((bundle) => (
                        <div key={bundle.tier} className={`rounded-xl border p-3 ${bundle.is_recommended ? 'border-airtel-red bg-airtel-red-light/30' : 'border-airtel-border bg-white'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold text-airtel-charcoal">{bundle.title}</p>
                              <p className="mt-1 text-[11px] text-airtel-slate">
                                Setup: ₹{bundle.quote.one_time_setup_total.toLocaleString()} once · ~{bundle.quote.typical_activation_days} days
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-extrabold text-airtel-charcoal">₹{bundle.quote.monthly_total_min.toLocaleString()}/mo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-airtel-red flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-airtel-border px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-airtel-muted animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-airtel-muted animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-airtel-muted animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-airtel-border">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type in Hindi, Hinglish or English..."
                className="flex-1 bg-airtel-surface border border-airtel-border rounded-xl px-4 py-2.5 text-xs text-airtel-charcoal placeholder-airtel-muted focus:outline-none focus:border-airtel-red transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2.5 bg-airtel-red hover:bg-airtel-red-hover disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

    </div>
  );
}
