// src/pages/Dashboard.js — Admin Sales Dashboard (full dataset view)
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Users, AlertCircle, IndianRupee, FileCheck,
  Search, RefreshCw,
  Building2, Zap
} from 'lucide-react';

const API = 'http://127.0.0.1:8000';

// --- Metric Card ---
function MetricCard({ icon: Icon, label, value, sub, color = 'red' }) {
  const colorMap = {
    red:   'bg-airtel-red-light text-airtel-red',
    green: 'bg-green-50 text-green-700',
    blue:  'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  return (
    <div className="bg-white rounded-xl border border-airtel-border p-4 shadow-sm flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-airtel-muted font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-airtel-charcoal mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[11px] text-airtel-slate mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// --- Funnel Bar ---
function FunnelBar({ label, count, maxCount, color }) {
  const pct = ((count / maxCount) * 100).toFixed(1);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-airtel-charcoal">
        <span>{label}</span>
        <span>{count.toLocaleString()} <span className="text-airtel-muted font-normal">({pct}%)</span></span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// --- Stage Badge ---
function StageBadge({ stage }) {
  const map = {
    'Activated':     'bg-green-100 text-green-800',
    'KYC complete':  'bg-blue-100 text-blue-800',
    'Quote accepted':'bg-purple-100 text-purple-800',
    'Needs assessed':'bg-amber-100 text-amber-800',
    'Contacted':     'bg-slate-100 text-slate-700',
    'Lead':          'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${map[stage] || 'bg-gray-100 text-gray-600'}`}>
      {stage}
    </span>
  );
}

// --- Outcome Badge ---
function OutcomeBadge({ outcome }) {
  return outcome === 'Activated'
    ? <span className="text-green-700 font-semibold text-[11px]">✅ Activated</span>
    : <span className="text-red-600 font-semibold text-[11px]">❌ Dropped</span>;
}

export default function Dashboard() {
  const [stats, setStats]           = useState(null);
  const [leadsData, setLeadsData]   = useState({ total: 0, page: 1, total_pages: 1, leads: [] });
  const [loading, setLoading]       = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segmentFilter, setSegmentFilter]   = useState('');
  const [stageFilter, setStageFilter]       = useState('');
  const [gstinFilter, setGstinFilter]       = useState('');
  const [activeTab, setActiveTab]   = useState('leads'); // 'leads' | 'funnel' | 'segments' | 'hotleads'
  const [hotLeads, setHotLeads]     = useState([]);
  const [hotLoading, setHotLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load admin stats once
  useEffect(() => {
    setStatsLoading(true);
    axios.get(`${API}/api/analytics/admin-stats`)
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  // Load leads whenever filters change
  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 25 });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (segmentFilter)   params.set('segment', segmentFilter);
    if (stageFilter)     params.set('stage', stageFilter);
    if (gstinFilter)     params.set('has_gstin', gstinFilter);

    axios.get(`${API}/api/analytics/leads?${params}`)
      .then(r => setLeadsData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, segmentFilter, stageFilter, gstinFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, segmentFilter, stageFilter, gstinFilter]);

  // Load hot leads when that tab becomes active (lazy, one-time)
  useEffect(() => {
    if (activeTab !== 'hotleads' || hotLeads.length > 0) return;
    setHotLoading(true);
    axios.get(`${API}/api/analytics/hot-leads?limit=50`)
      .then(r => setHotLeads(r.data.value || r.data))
      .catch(console.error)
      .finally(() => setHotLoading(false));
  }, [activeTab, hotLeads.length]);

  const funnelStages = stats ? [
    { label: '1. Leads Generated',      count: 5000,  color: 'bg-blue-500' },
    { label: '2. Contacted',            count: 3406,  color: 'bg-indigo-500' },
    { label: '3. Needs Assessed',       count: 1974,  color: 'bg-purple-500' },
    { label: '4. Quote Accepted',       count: 861,   color: 'bg-amber-500' },
    { label: '5. KYC Complete',         count: 588,   color: 'bg-teal-500' },
    { label: '6. Activated Customers',  count: 368,   color: 'bg-airtel-red' },
  ] : [];

  const segmentColors = {
    'Professional offices':       'bg-blue-100 text-blue-800',
    'Micro retail & services':    'bg-orange-100 text-orange-800',
    'Small multi-site businesses':'bg-purple-100 text-purple-800',
    'Small manufacturers':        'bg-green-100 text-green-800',
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto pb-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-extrabold text-airtel-charcoal">Sales Admin Dashboard</h1>
          <p className="text-xs text-airtel-slate">5,000 live SMB leads · Apr–Jun 2026 · Accel Saathi Dataset</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLeads}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-airtel-border text-xs font-semibold text-airtel-slate hover:text-airtel-charcoal hover:bg-airtel-surface transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-airtel-border h-20 animate-pulse" />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 shrink-0">
          <MetricCard icon={Users}       label="Total Leads"       value="5,000"              sub="Apr–Jun 2026 quarter"           color="blue"  />
          <MetricCard icon={Zap}         label="Activated"         value={`${stats.activated_count} (${stats.activation_rate}%)`}  sub="End-to-end conversion"         color="green" />
          <MetricCard icon={AlertCircle} label="Dropped"           value={stats.dropped_count.toLocaleString()} sub="Needs re-engagement"           color="red"   />
          <MetricCard icon={FileCheck}   label="With GSTIN"        value={stats.with_gstin_count.toLocaleString()} sub="9.6% activate vs 2% without" color="amber" />
          <MetricCard icon={Building2}   label="MSME Registered"   value={stats.with_udyam_count.toLocaleString()} sub="Udyam verified"               color="slate" />
          <MetricCard icon={IndianRupee} label="Blended CAC"       value="₹15,000"            sub="Target: ₹3,000 with Saathi"    color="slate" />
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div className="flex gap-2 border-b border-airtel-border shrink-0">
        {[
          { id: 'leads',    label: `All Leads (${leadsData.total.toLocaleString()})` },
          { id: 'funnel',   label: 'Sales Funnel' },
          { id: 'segments', label: 'Segment Performance' },
          { id: 'hotleads', label: '🔥 Hot Leads' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-airtel-red text-airtel-red'
                : 'border-transparent text-airtel-slate hover:text-airtel-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB: ALL LEADS TABLE
      ══════════════════════════════════════════ */}
      {activeTab === 'leads' && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 bg-white border border-airtel-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search className="w-3.5 h-3.5 text-airtel-muted shrink-0" />
              <input
                type="text"
                placeholder="Search business, lead ID, city, GSTIN..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent outline-none text-airtel-charcoal placeholder-airtel-muted"
              />
            </div>

            <select
              value={segmentFilter}
              onChange={e => setSegmentFilter(e.target.value)}
              className="text-xs bg-white border border-airtel-border rounded-xl px-3 py-2 text-airtel-charcoal"
            >
              <option value="">All Segments</option>
              <option value="Professional offices">Professional Offices</option>
              <option value="Micro retail & services">Micro Retail</option>
              <option value="Small multi-site businesses">Multi-site</option>
              <option value="Small manufacturers">Manufacturers</option>
            </select>

            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="text-xs bg-white border border-airtel-border rounded-xl px-3 py-2 text-airtel-charcoal"
            >
              <option value="">All Stages</option>
              <option value="Activated">Activated</option>
              <option value="KYC complete">KYC Complete</option>
              <option value="Quote accepted">Quote Accepted</option>
              <option value="Needs assessed">Needs Assessed</option>
              <option value="Contacted">Contacted</option>
              <option value="Lead">Lead</option>
            </select>

            <select
              value={gstinFilter}
              onChange={e => setGstinFilter(e.target.value)}
              className="text-xs bg-white border border-airtel-border rounded-xl px-3 py-2 text-airtel-charcoal"
            >
              <option value="">GSTIN: All</option>
              <option value="Y">Has GSTIN ✓</option>
              <option value="N">No GSTIN</option>
            </select>

            {(search || segmentFilter || stageFilter || gstinFilter) && (
              <button
                onClick={() => { setSearch(''); setSegmentFilter(''); setStageFilter(''); setGstinFilter(''); }}
                className="text-xs text-airtel-red font-semibold px-3 py-2 rounded-xl hover:bg-airtel-red-light"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-airtel-border shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-airtel-surface border-b border-airtel-border sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Lead ID</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Business</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Segment</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">City</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">GSTIN</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Stage</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Outcome</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Monthly Spend</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Drop Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(9)].map((_, j) => (
                          <td key={j} className="py-3 px-3">
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : leadsData.leads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-airtel-muted">
                        No leads match your filters.
                      </td>
                    </tr>
                  ) : leadsData.leads.map(lead => (
                    <tr key={lead.lead_id} className="hover:bg-airtel-surface/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-airtel-slate">{lead.lead_id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-airtel-charcoal max-w-[160px] truncate">{lead.business_name}</div>
                        <div className="text-airtel-muted text-[10px]">{lead.business_type}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${segmentColors[lead.segment] || 'bg-gray-100 text-gray-600'}`}>
                          {lead.segment?.split(' ')[0]}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-airtel-slate">
                        {lead.city}<br/>
                        <span className="text-[10px] text-airtel-muted">{lead.state}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        {lead.has_gstin === 'Y'
                          ? <span className="text-green-700 font-mono text-[10px] bg-green-50 px-1.5 py-0.5 rounded">✓ {lead.gstin?.slice(0,8)}…</span>
                          : <span className="text-red-500 text-[10px]">— None</span>}
                      </td>
                      <td className="py-2.5 px-3"><StageBadge stage={lead.stage_reached} /></td>
                      <td className="py-2.5 px-3"><OutcomeBadge outcome={lead.outcome} /></td>
                      <td className="py-2.5 px-3 font-semibold text-airtel-charcoal">
                        {lead.monthly_telecom_spend_inr ? `₹${Number(lead.monthly_telecom_spend_inr).toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-airtel-slate max-w-[160px] truncate" title={lead.drop_reason}>
                        {lead.drop_reason || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-airtel-border px-4 py-3 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs text-airtel-slate">
                Showing <strong>{((page - 1) * 25) + 1}–{Math.min(page * 25, leadsData.total)}</strong> of <strong>{leadsData.total.toLocaleString()}</strong> leads
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-airtel-border text-airtel-slate disabled:opacity-30 hover:bg-airtel-surface"
                >
                  Prev
                </button>
                <span className="px-3 text-xs font-semibold text-airtel-charcoal">
                  {page} / {leadsData.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(leadsData.total_pages, p + 1))}
                  disabled={page === leadsData.total_pages}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-airtel-border text-airtel-slate disabled:opacity-30 hover:bg-airtel-surface"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: FUNNEL
      ══════════════════════════════════════════ */}
      {activeTab === 'funnel' && (
        <div className="bg-white rounded-xl border border-airtel-border shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-airtel-charcoal">Sales Funnel Waterfall</h2>
            <p className="text-xs text-airtel-slate mt-0.5">From 5,000 leads → 368 activated customers (7.4% end-to-end)</p>
          </div>
          <div className="space-y-4">
            {funnelStages.map(s => (
              <FunnelBar key={s.label} {...s} maxCount={5000} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-airtel-border">
            <h3 className="text-xs font-bold text-airtel-charcoal mb-3">Top Drop Reasons</h3>
            {stats?.top_drop_reasons?.map(d => (
              <div key={d.reason} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-airtel-slate w-56 truncate">{d.reason}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-airtel-red h-2 rounded-full"
                    style={{ width: `${(d.count / 805) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-airtel-charcoal w-10 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: SEGMENTS
      ══════════════════════════════════════════ */}
      {activeTab === 'segments' && (
        <div className="bg-white rounded-xl border border-airtel-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-airtel-border">
            <h2 className="text-sm font-bold text-airtel-charcoal">Segment Performance</h2>
            <p className="text-xs text-airtel-slate mt-0.5">Conversion, ARPU and churn by business segment</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-airtel-surface border-b border-airtel-border">
                <tr>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Segment</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Total Leads</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Activated</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Conversion %</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Avg ARPU</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Churn %</th>
                  <th className="py-3 px-4 font-bold text-airtel-charcoal">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats && Object.entries(stats.segment_performance)
                  .sort((a, b) => b[1].conversion_rate - a[1].conversion_rate)
                  .map(([seg, data]) => (
                  <tr key={seg} className="hover:bg-airtel-surface/50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${segmentColors[seg] || 'bg-gray-100 text-gray-700'}`}>
                        {seg}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-airtel-charcoal">{data.total.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-green-700">{data.activated}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${data.conversion_rate >= 10 ? 'text-green-700' : data.conversion_rate >= 5 ? 'text-amber-700' : 'text-red-600'}`}>
                        {data.conversion_rate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-airtel-charcoal">
                      {data.avg_arpu ? `₹${data.avg_arpu.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${data.churn_rate > 20 ? 'text-red-600' : data.churn_rate > 12 ? 'text-amber-600' : 'text-green-700'}`}>
                        {data.churn_rate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {data.conversion_rate >= 10
                        ? <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">P1 🥇</span>
                        : data.conversion_rate >= 5
                        ? <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">P2</span>
                        : <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">P3</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-airtel-red-light border-t border-airtel-red/20">
            <p className="text-xs font-semibold text-airtel-red">
              💡 Key Insight: Leads with GSTIN activate at <strong>9.6%</strong> vs only <strong>2.0%</strong> without — a 5× delta. GSTIN verification is the #1 conversion lever.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB: HOT LEADS (Propensity-Scored Re-engagement)
      ══════════════════════════════════════════ */}
      {activeTab === 'hotleads' && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="bg-airtel-red-light border border-airtel-red/20 rounded-xl px-5 py-3 shrink-0">
            <p className="text-xs font-semibold text-airtel-red">
              🔥 <strong>Top 50 dropped leads</strong> ranked by AI propensity score (0–100).
              These are the highest-value re-engagement targets — act fast before competitors do.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-airtel-border shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-airtel-surface border-b border-airtel-border sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Score</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Lead ID</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Business</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Segment</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">City</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Stage Reached</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Drop Reason</th>
                    <th className="py-3 px-3 font-bold text-airtel-charcoal">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {hotLoading ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(8)].map((_, j) => (
                          <td key={j} className="py-3 px-3">
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : hotLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-airtel-muted">
                        No hot leads found.
                      </td>
                    </tr>
                  ) : hotLeads.map((lead, idx) => {
                    const scoreColor =
                      lead.score >= 90 ? 'bg-red-100 text-red-700' :
                      lead.score >= 70 ? 'bg-amber-100 text-amber-700' :
                                         'bg-blue-100 text-blue-700';
                    return (
                      <tr key={lead.lead_id} className="hover:bg-airtel-surface/60 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-airtel-muted font-mono w-5 text-right">{idx + 1}.</span>
                            <span className={`px-2 py-0.5 rounded-full font-extrabold text-xs ${scoreColor}`}>
                              {lead.score}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-airtel-slate">{lead.lead_id}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-airtel-charcoal max-w-[160px] truncate">{lead.business_name}</div>
                          <div className="text-airtel-muted text-[10px]">{lead.contact_name}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${segmentColors[lead.segment] || 'bg-gray-100 text-gray-600'}`}>
                            {lead.segment?.split(' ')[0]}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-airtel-slate">{lead.city}</td>
                        <td className="py-2.5 px-3"><StageBadge stage={lead.stage_reached} /></td>
                        <td className="py-2.5 px-3 text-airtel-slate max-w-[150px] truncate" title={lead.drop_reason}>
                          {lead.drop_reason || '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-semibold text-airtel-red bg-airtel-red-light px-2 py-1 rounded-lg">
                            {lead.recommended_action}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-airtel-border px-4 py-2 bg-airtel-surface shrink-0">
              <p className="text-[11px] text-airtel-slate">
                Showing top <strong>{hotLeads.length}</strong> propensity-scored leads ·
                Score factors: GSTIN (+40), Udyam (+15), Segment (+8–20), Accel customer (+15), Multi-product (+10), Re-engagement potential (+12)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
