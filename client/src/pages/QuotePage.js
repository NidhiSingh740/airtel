// src/pages/QuotePage.js — Interactive Bundle Builder
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Lock, ChevronDown, ChevronUp, Zap, Check } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

const CATEGORY_ICONS = {
  'Connectivity':       '📡',
  'Communication':      '📞',
  'Cloud & Productivity': '☁️',
  'Security':           '🛡️',
  'IoT & Physical':     '📷',
};

function ProductCard({ product, qty, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const inCart = qty > 0;
  return (
    <div className={`bg-white border rounded-xl transition-all ${inCart ? 'border-airtel-red shadow-sm shadow-airtel-red/10' : 'border-airtel-border hover:border-airtel-red/40'}`}>
      <div className="p-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm">{CATEGORY_ICONS[product.category] || '📦'}</span>
            <span className="text-xs font-bold text-airtel-charcoal">{product.product_name}</span>
            {product.requires_gstin === 'Y' && (
              <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">GST Req.</span>
            )}
            {inCart && (
              <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-semibold">✓ In Bundle</span>
            )}
          </div>
          <p className="text-[10px] text-airtel-muted mt-0.5 leading-relaxed">{product.description}</p>
          <p className="text-[11px] font-semibold text-airtel-charcoal mt-1">
            ₹{product.price_min_inr_per_month?.toLocaleString()}–₹{product.price_max_inr_per_month?.toLocaleString()}/{product.unit}
            <span className="text-airtel-muted font-normal ml-2">Setup: ₹{product.one_time_setup_inr?.toLocaleString()}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-2">
            {inCart && (
              <button onClick={onRemove} className="w-7 h-7 rounded-lg border border-airtel-border text-airtel-slate hover:bg-gray-100 flex items-center justify-center font-bold text-sm">−</button>
            )}
            {inCart && (
              <span className="w-5 text-center text-sm font-extrabold text-airtel-charcoal">{qty}</span>
            )}
            <button
              onClick={onAdd}
              className="w-7 h-7 rounded-lg bg-airtel-red hover:bg-airtel-red-hover text-white flex items-center justify-center font-bold text-sm"
            >+</button>
          </div>
          <button onClick={() => setExpanded(e => !e)} className="text-[9px] text-airtel-muted hover:text-airtel-slate flex items-center gap-0.5">
            Details {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-airtel-border px-3 pb-3 pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-airtel-slate">
          <div>Category: <strong className="text-airtel-charcoal">{product.category}</strong></div>
          <div>Install time: <strong className="text-airtel-charcoal">~{product.typical_install_days} days</strong></div>
          <div>Min contract: <strong className="text-airtel-charcoal">{product.min_contract_months} months</strong></div>
          <div>Min employees: <strong className="text-airtel-charcoal">{product.min_employees}</strong></div>
          {product.requires_one_of && (
            <div className="col-span-2">Requires: <strong className="text-airtel-charcoal">{product.requires_one_of}</strong></div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuotePage() {
  const navigate = useNavigate();
  const [products, setProducts]       = useState([]);
  const [cart, setCart]               = useState({});
  const [quote, setQuote]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [currentSpend, setCurrentSpend] = useState(3500);

  // Filters
  const [tierFilter, setTierFilter]   = useState('2');
  const [empFilter, setEmpFilter]     = useState(3);
  const [gstFilter, setGstFilter]     = useState(true);
  const [catFilter, setCatFilter]     = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    axios.get(`${API}/api/products?city_tier=${tierFilter}&employee_count=${empFilter}&num_sites=1&has_gstin=${gstFilter}`)
      .then(r => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tierFilter, empFilter, gstFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const recalcQuote = useCallback(async () => {
    const items = Object.entries(cart)
      .filter(([_, q]) => q > 0)
      .map(([pid, q]) => ({ product_id: pid, quantity: q }));

    if (items.length === 0) { setQuote(null); return; }

    const r = await axios.post(`${API}/api/quote/calculate`, { items, current_spend: currentSpend });
    setQuote(r.data);
  }, [cart, currentSpend]);

  useEffect(() => { recalcQuote(); }, [recalcQuote]);

  const adjust = (pid, delta) => {
    setCart(prev => {
      const next = { ...prev, [pid]: Math.max(0, (prev[pid] || 0) + delta) };
      if (next[pid] === 0) delete next[pid];
      return next;
    });
  };

  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = catFilter ? products.filter(p => p.category === catFilter) : products;
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto pb-6">
      <div className="shrink-0">
        <h1 className="text-lg font-extrabold text-airtel-charcoal">Business Plan Builder</h1>
        <p className="text-xs text-airtel-slate">Build your bundle · real-time pricing · dependency validation</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">

        {/* ── LEFT: Catalog ── */}
        <div className="xl:col-span-2 flex flex-col gap-3 min-h-0">

          {/* Eligibility Filters */}
          <div className="bg-white border border-airtel-border rounded-xl p-3 flex flex-wrap gap-3 items-center text-xs">
            <span className="font-bold text-airtel-charcoal uppercase tracking-wide">Filter Eligibility:</span>

            <label className="flex items-center gap-1.5 font-medium text-airtel-slate">
              City Tier:
              <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="border border-airtel-border rounded-lg px-2 py-1 ml-1">
                <option value="1">Tier 1 (Metro)</option>
                <option value="2">Tier 2 (Emerging)</option>
              </select>
            </label>

            <label className="flex items-center gap-1.5 font-medium text-airtel-slate">
              Employees:
              <input type="number" min="1" max="200" value={empFilter}
                onChange={e => setEmpFilter(Number(e.target.value))}
                className="border border-airtel-border rounded-lg px-2 py-1 w-16 ml-1"
              />
            </label>

            <label className="flex items-center gap-1.5 font-medium text-airtel-slate cursor-pointer">
              <input type="checkbox" checked={gstFilter} onChange={e => setGstFilter(e.target.checked)} className="rounded accent-airtel-red" />
              Active GSTIN
            </label>

            <div className="flex gap-1 flex-wrap ml-auto">
              {['', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${catFilter === cat ? 'bg-airtel-red text-white' : 'bg-airtel-surface text-airtel-slate hover:bg-airtel-border'}`}
                >
                  {cat || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-white border border-airtel-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1">
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-xs text-airtel-muted">No products match these filters.</div>
              )}
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.product_id}
                  product={p}
                  qty={cart[p.product_id] || 0}
                  onAdd={() => adjust(p.product_id, 1)}
                  onRemove={() => adjust(p.product_id, -1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Quote Summary ── */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-airtel-border rounded-xl shadow-sm sticky top-0">
            <div className="p-4 border-b border-airtel-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-airtel-red" />
                <span className="text-sm font-bold text-airtel-charcoal">Your Bundle</span>
                {cartCount > 0 && (
                  <span className="bg-airtel-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>
                )}
              </div>
              {quote && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quote.valid_bundle ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                  {quote.valid_bundle ? 'Valid Bundle ✓' : 'Missing Dep ⚠️'}
                </span>
              )}
            </div>

            {!quote ? (
              <div className="p-6 text-center text-xs text-airtel-muted">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-airtel-border" />
                Add products to build your bundle
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Total Price */}
                <div className="text-center py-3 bg-airtel-surface rounded-xl">
                  <p className="text-3xl font-black text-airtel-charcoal">
                    ₹{quote.monthly_total_min?.toLocaleString()}
                  </p>
                  <p className="text-xs text-airtel-muted mt-0.5">per month (all inclusive)</p>
                </div>

                {/* Line items */}
                <div className="space-y-2">
                  {quote.items?.map(item => (
                    <div key={item.product_id} className="flex justify-between text-xs">
                      <span className="text-airtel-slate flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        {item.product_name} ×{item.quantity}
                      </span>
                      <span className="font-semibold text-airtel-charcoal">₹{item.price_min_total?.toLocaleString()}/mo</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-airtel-border pt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-airtel-slate">One-time setup</span>
                    <span className="font-semibold text-airtel-charcoal">₹{quote.one_time_setup_total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-airtel-slate">Expected activation</span>
                    <span className="font-semibold text-airtel-charcoal flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      ~{quote.typical_activation_days} days
                    </span>
                  </div>
                  {quote.estimated_monthly_savings > 0 && (
                    <div className="flex justify-between bg-green-50 px-2 py-1.5 rounded-lg">
                      <span className="text-green-800 font-semibold">Monthly savings</span>
                      <span className="font-bold text-green-700">₹{quote.estimated_monthly_savings?.toLocaleString()}/mo</span>
                    </div>
                  )}
                </div>

                {/* Current spend input */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-airtel-muted whitespace-nowrap">Current spend:</span>
                  <input
                    type="number"
                    value={currentSpend}
                    onChange={e => setCurrentSpend(Number(e.target.value))}
                    className="flex-1 border border-airtel-border rounded-lg px-2 py-1 text-xs"
                  />
                </div>

                {/* Dependency warning */}
                {!quote.valid_bundle && quote.missing_dependencies?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-1">
                    <p className="font-bold">⚠️ Dependency Missing</p>
                    {quote.missing_dependencies.map((d, i) => (
                      <p key={i}>• <strong>{d.product_name}</strong> requires one of: {d.requires_one_of?.join(', ')}</p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => navigate('/kyc')}
                  className="w-full py-3 bg-airtel-red hover:bg-airtel-red-hover text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Proceed to Smart KYC
                </button>
                <p className="text-center text-[10px] text-airtel-muted">🔒 DPDP 2023 Compliant · No hidden charges</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
