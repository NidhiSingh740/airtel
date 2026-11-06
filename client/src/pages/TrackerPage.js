// src/pages/TrackerPage.js — Order Status Timeline
import React, { useState } from 'react';
import {
  Package, CheckCircle2, Clock, Phone, MessageSquare, Download,
  Zap, Calendar
} from 'lucide-react';

// Mock tracker data (in real app: GET /api/tracker/:id)
const MOCK_ORDERS = [
  {
    id: 'ORD-20260715-001',
    customer: 'Balaji Dental Care LLP',
    lead_id: 'L00001',
    bundle: 'Office Power Pack',
    monthly_value: 6796,
    setup_fee: 2500,
    stages: [
      { label: 'Plan Selected',          date: '2026-07-15', done: true,    icon: Package },
      { label: 'KYC Verified',           date: '2026-07-15', done: true,    icon: CheckCircle2 },
      { label: 'Payment Received',       date: '2026-07-16', done: true,    icon: CheckCircle2 },
      { label: 'Installation Scheduled', date: '2026-07-18', done: true,    icon: Calendar, engineer: 'Rajesh Kumar', phone: '98xxx-xxxxx' },
      { label: 'Activation',             date: '2026-07-22', done: false,   icon: Zap, daysLeft: 4 },
    ]
  },
  {
    id: 'ORD-20260516-002',
    customer: 'Saffron Bakers',
    lead_id: 'L00002',
    bundle: 'Dukaan Starter Pack',
    monthly_value: 2620,
    setup_fee: 2500,
    stages: [
      { label: 'Plan Selected',          date: '2026-05-24', done: true,  icon: Package },
      { label: 'KYC Verified',           date: '2026-05-26', done: true,  icon: CheckCircle2 },
      { label: 'Payment Received',       date: '2026-05-27', done: true,  icon: CheckCircle2 },
      { label: 'Installation Scheduled', date: '2026-05-29', done: true,  icon: Calendar, engineer: 'Amit Verma', phone: '97xxx-xxxxx' },
      { label: 'Activated',              date: '2026-05-31', done: true,  icon: Zap },
    ]
  }
];

function TimelineStep({ step, isLast }) {
  const Icon = step.icon;
  const statusColor = step.done ? 'text-green-600' : step.daysLeft != null ? 'text-amber-500' : 'text-airtel-muted';
  const lineColor   = step.done ? 'bg-green-500' : 'bg-airtel-border';

  return (
    <div className="flex gap-4">
      {/* Icon + vertical line */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 ${
          step.done
            ? 'bg-green-50 border-green-500'
            : step.daysLeft != null
            ? 'bg-amber-50 border-amber-400'
            : 'bg-gray-50 border-gray-300'
        }`}>
          <Icon className={`w-4 h-4 ${statusColor}`} />
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-1 mb-1 ${lineColor}`} style={{ minHeight: 28 }} />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm font-bold ${step.done ? 'text-airtel-charcoal' : 'text-airtel-slate'}`}>
              {step.label}
            </p>
            <p className="text-xs text-airtel-muted mt-0.5">{step.date}</p>
            {step.engineer && (
              <div className="mt-2 flex items-center gap-3 text-xs text-airtel-slate">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {step.engineer}</span>
                <span className="font-mono">{step.phone}</span>
              </div>
            )}
          </div>
          {step.daysLeft != null && !step.done && (
            <span className="shrink-0 px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              {step.daysLeft} days left
            </span>
          )}
          {step.done && (
            <span className="shrink-0 text-green-600 text-[10px] font-bold">✓ Done</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackerPage() {
  const [selectedId, setSelectedId] = useState(MOCK_ORDERS[0].id);
  const order = MOCK_ORDERS.find(o => o.id === selectedId);
  const isActivated = order.stages.every(s => s.done);
  const currentStage = order.stages.find(s => !s.done);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto pb-6">
      <div className="shrink-0">
        <h1 className="text-lg font-extrabold text-airtel-charcoal">Order Tracker</h1>
        <p className="text-xs text-airtel-slate">Real-time installation status · eliminates follow-up calls</p>
      </div>

      {/* Order selector */}
      <div className="flex gap-2 flex-wrap shrink-0">
        {MOCK_ORDERS.map(o => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              selectedId === o.id ? 'bg-airtel-red text-white border-airtel-red' : 'bg-white text-airtel-slate border-airtel-border hover:border-airtel-red'
            }`}
          >
            {o.id}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── Timeline Panel ── */}
        <div className="xl:col-span-2 bg-white border border-airtel-border rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className={`p-5 border-b border-airtel-border ${isActivated ? 'bg-green-50' : 'bg-white'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-airtel-muted font-mono">{order.id}</p>
                <h2 className="text-base font-extrabold text-airtel-charcoal mt-1">{order.customer}</h2>
                <p className="text-xs text-airtel-slate">{order.bundle}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-airtel-charcoal">₹{order.monthly_value.toLocaleString()}</p>
                <p className="text-xs text-airtel-muted">/month</p>
                {isActivated && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-200 text-green-900 text-[10px] font-bold rounded-full">🟢 ACTIVE</span>
                )}
              </div>
            </div>

            {currentStage && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Current stage: <strong>{currentStage.label}</strong></span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="p-5">
            {order.stages.map((step, i) => (
              <TimelineStep
                key={i}
                step={step}
                isLast={i === order.stages.length - 1}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-airtel-border p-4 flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-airtel-charcoal text-white text-xs font-semibold rounded-xl hover:bg-black transition">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat with Saathi
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-airtel-border text-airtel-slate text-xs font-semibold rounded-xl hover:bg-airtel-surface transition">
              <Download className="w-3.5 h-3.5" />
              Download Invoice
            </button>
          </div>
        </div>

        {/* ── Right: Order Details Card ── */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="bg-white border border-airtel-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide">Order Summary</h3>
            {[
              { label: 'Lead ID',          value: order.lead_id },
              { label: 'Monthly Value',    value: `₹${order.monthly_value.toLocaleString()}` },
              { label: 'One-time Setup',   value: `₹${order.setup_fee.toLocaleString()}` },
              { label: 'Bundle',           value: order.bundle },
              { label: 'Status',           value: isActivated ? '🟢 Active' : '🔄 In Progress' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-xs">
                <span className="text-airtel-muted">{r.label}</span>
                <span className="font-semibold text-airtel-charcoal">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-airtel-red-light border border-airtel-red/20 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-airtel-red text-[11px] uppercase tracking-wide">Why this tracker?</h4>
            <p className="text-airtel-slate leading-relaxed">
              Activated customers made <strong>3 follow-up calls</strong> on average just to ask about status.
              This tracker eliminates all of them — customer knows exactly where their order stands.
            </p>
          </div>

          <div className="bg-white border border-airtel-border rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-airtel-charcoal text-[11px] uppercase tracking-wide">Need Help?</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-airtel-slate">
                <Phone className="w-3.5 h-3.5 text-airtel-muted" />
                <span>1800-103-ACCEL (Toll-free)</span>
              </div>
              <div className="flex items-center gap-2 text-airtel-slate">
                <MessageSquare className="w-3.5 h-3.5 text-airtel-muted" />
                <span>WhatsApp: +91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
