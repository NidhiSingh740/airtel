// src/pages/KYCPage.js — Smart KYC with OCR Panel
import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Upload, FileCheck, AlertCircle, CheckCircle2, XCircle,
  Search, FileText, RefreshCw, ChevronDown, ChevronUp,
  Shield, Eye
} from 'lucide-react';

const API = 'http://127.0.0.1:8000';

// --- Specimen list ---
const SPECIMENS = [
  { id: 'K01', label: 'K01 — Vindhya Tours (Expected: Cancelled GSTIN)' },
  { id: 'K02', label: 'K02 — Harmony Dental (Expected: Valid)' },
  { id: 'K03', label: 'K03 — Ganesh Woodcraft (Expected: Valid)' },
  { id: 'K04', label: 'K04 — Test Case' },
  { id: 'K05', label: 'K05 — Test Case' },
  { id: 'K06', label: 'K06 — Test Case' },
  { id: 'K07', label: 'K07 — Test Case' },
  { id: 'K08', label: 'K08 — Test Case' },
  { id: 'K09', label: 'K09 — Test Case' },
  { id: 'K10', label: 'K10 — Test Case' },
  { id: 'K11', label: 'K11 — Expired Utility Bill (>250d)' },
  { id: 'K12', label: 'K12 — Test Case' },
];

const DOC_TYPES = [
  { value: 'GST_CERTIFICATE',   label: '📋 GST Registration Certificate', icon: FileText },
  { value: 'UDYAM_CERTIFICATE', label: '🏭 Udyam / MSME Certificate',      icon: FileText },
  { value: 'SIGNATORY_ID',      label: '🪪 Authorised Signatory ID',       icon: FileText },
  { value: 'ADDRESS_PROOF',     label: '🏠 Address Proof (Utility Bill)',   icon: FileText },
];

// --- Check Row ---
function CheckRow({ check }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border text-xs overflow-hidden ${check.passed ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50/40'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 font-semibold text-airtel-charcoal">
          {check.passed
            ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
          {check.check}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
            {check.passed ? 'PASSED ✓' : 'FAILED ✗'}
          </span>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-airtel-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-airtel-muted" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <pre className="text-[10px] text-airtel-slate overflow-x-auto whitespace-pre-wrap break-all bg-gray-50 p-2 rounded mt-2">
            {JSON.stringify(check, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// --- OCR Extracted Card ---
function OCRCard({ title, data }) {
  if (!data) return (
    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-xs text-airtel-muted text-center">
      Not scanned
    </div>
  );
  const entries = Object.entries(data).filter(([k]) => !['raw_lines', 'document_type'].includes(k));
  return (
    <div className="bg-white border border-airtel-border rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-airtel-charcoal border-b border-airtel-border pb-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        {title} — Scanned ✓
      </div>
      {entries.map(([k, v]) => (
        <div key={k} className="flex justify-between text-xs">
          <span className="text-airtel-muted capitalize">{k.replace(/_/g, ' ')}</span>
          <span className="font-semibold text-airtel-charcoal max-w-[55%] text-right truncate" title={v}>{v || '—'}</span>
        </div>
      ))}
    </div>
  );
}

export default function KYCPage() {
  const [mode, setMode]             = useState('specimen'); // 'specimen' | 'upload'
  const [specimen, setSpecimen]     = useState('K01');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);

  // Upload mode state
  const [uploadDocType, setUploadDocType] = useState('GST_CERTIFICATE');
  const [uploadFile, setUploadFile]       = useState(null);
  const [uploadResult, setUploadResult]   = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileRef = useRef();

  // GSTIN quick-lookup
  const [gstinInput, setGstinInput]   = useState('');
  const [gstinResult, setGstinResult] = useState(null);
  const [gstinLoading, setGstinLoading] = useState(false);

  const runSpecimen = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await axios.get(`${API}/api/kyc/test-applicant/${specimen}`);
      setResult(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runUpload = async () => {
    if (!uploadFile) return;
    setUploadLoading(true);
    setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      fd.append('doc_type', uploadDocType);
      const r = await axios.post(`${API}/api/kyc/ocr-upload`, fd);
      setUploadResult(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setUploadLoading(false);
    }
  };

  const lookupGSTIN = async () => {
    if (!gstinInput.trim()) return;
    setGstinLoading(true);
    setGstinResult(null);
    try {
      const r = await axios.get(`${API}/api/registry/gstin/${gstinInput.trim().toUpperCase()}`);
      setGstinResult(r.data);
    } catch (e) {
      setGstinResult({ error: 'Lookup failed' });
    } finally {
      setGstinLoading(false);
    }
  };

  const val = result?.validation_result;
  const docs = result?.extracted_docs;

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto pb-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-extrabold text-airtel-charcoal">Smart KYC & OCR Panel</h1>
          <p className="text-xs text-airtel-slate">Automated document extraction · Registry cross-check · Defect detection</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700">
          <Shield className="w-3.5 h-3.5" />
          DPDP 2023 Compliant
        </div>
      </div>

      {/* ── Privacy Consent Banner ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex gap-3 items-start shrink-0">
        <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800">
          <strong>Privacy Notice (DPDP Act 2023):</strong> Documents are used for verification only.
          Identifiers are masked in logs. Raw images auto-deleted after 30 days. No data is shared with third parties.
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* ── LEFT PANEL: Mode selector + controls ── */}
        <div className="xl:col-span-1 flex flex-col gap-4">

          {/* Mode Toggle */}
          <div className="bg-white border border-airtel-border rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode('specimen')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'specimen' ? 'bg-airtel-red text-white' : 'text-airtel-slate hover:bg-airtel-surface'}`}
            >
              Test Specimen (K01–K12)
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'upload' ? 'bg-airtel-red text-white' : 'text-airtel-slate hover:bg-airtel-surface'}`}
            >
              Upload Document
            </button>
          </div>

          {/* ─ SPECIMEN MODE ─ */}
          {mode === 'specimen' && (
            <div className="bg-white border border-airtel-border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide">Select Specimen</h3>
              <select
                value={specimen}
                onChange={e => setSpecimen(e.target.value)}
                className="w-full text-xs border border-airtel-border rounded-xl px-3 py-2.5 bg-airtel-surface text-airtel-charcoal"
              >
                {SPECIMENS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <div className="text-[10px] text-airtel-slate space-y-1">
                <p>• Runs OCR on all 4 documents from the specimen set</p>
                <p>• Cross-checks GSTIN + Udyam registries</p>
                <p>• Flags name mismatches, expired address proofs, cancelled GSTIN</p>
              </div>
              <button
                onClick={runSpecimen}
                disabled={loading}
                className="w-full py-2.5 bg-airtel-red hover:bg-airtel-red-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning OCR...</> : <><FileCheck className="w-3.5 h-3.5" /> Run Full KYC Verification</>}
              </button>
            </div>
          )}

          {/* ─ UPLOAD MODE ─ */}
          {mode === 'upload' && (
            <div className="bg-white border border-airtel-border rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide">Upload & OCR</h3>
              <select
                value={uploadDocType}
                onChange={e => setUploadDocType(e.target.value)}
                className="w-full text-xs border border-airtel-border rounded-xl px-3 py-2.5 bg-airtel-surface"
              >
                {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>

              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-airtel-border rounded-xl p-6 text-center cursor-pointer hover:border-airtel-red hover:bg-airtel-red-light/30 transition"
              >
                <Upload className="w-6 h-6 text-airtel-muted mx-auto mb-2" />
                <p className="text-xs font-semibold text-airtel-charcoal">
                  {uploadFile ? uploadFile.name : 'Click to upload document'}
                </p>
                <p className="text-[10px] text-airtel-muted mt-1">PNG, JPG — max 5 MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setUploadFile(e.target.files[0])}
                />
              </div>

              {uploadFile && (
                <button
                  onClick={runUpload}
                  disabled={uploadLoading}
                  className="w-full py-2.5 bg-airtel-red hover:bg-airtel-red-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {uploadLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting...</> : <><Eye className="w-3.5 h-3.5" /> Extract with OCR</>}
                </button>
              )}

              {uploadResult && (
                <div className="bg-airtel-surface border border-airtel-border rounded-xl p-3 text-xs space-y-1">
                  <p className="font-bold text-airtel-charcoal mb-2">OCR Result</p>
                  {Object.entries(uploadResult.parsed || {})
                    .filter(([k]) => !['raw_lines', 'document_type'].includes(k))
                    .map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-airtel-muted capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="font-semibold text-airtel-charcoal">{v || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ GSTIN Quick Lookup ─ */}
          <div className="bg-white border border-airtel-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide">GSTIN Live Lookup</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 32TTNXB7384T1ZW"
                value={gstinInput}
                onChange={e => setGstinInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && lookupGSTIN()}
                className="flex-1 text-xs font-mono border border-airtel-border rounded-xl px-3 py-2 bg-airtel-surface outline-none focus:border-airtel-red"
              />
              <button
                onClick={lookupGSTIN}
                disabled={gstinLoading}
                className="px-3 py-2 bg-airtel-charcoal text-white text-xs font-bold rounded-xl hover:bg-black disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
            {gstinResult && (
              <div className={`text-xs rounded-xl p-3 space-y-1 ${gstinResult.error ? 'bg-red-50 border border-red-200' : gstinResult.is_active ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                {gstinResult.error
                  ? <p className="text-red-700 font-semibold">{gstinResult.error}</p>
                  : (
                    <>
                      <p className="font-bold text-airtel-charcoal">{gstinResult.legal_name || gstinResult.trade_name}</p>
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${gstinResult.is_active ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                          {gstinResult.status}
                        </span>
                        <span className="text-airtel-muted">{gstinResult.state}</span>
                      </div>
                    </>
                  )
                }
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Results ── */}
        <div className="xl:col-span-2 flex flex-col gap-4 min-h-0">
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-white border border-dashed border-airtel-border rounded-xl p-10">
              <FileCheck className="w-12 h-12 text-airtel-muted mb-3" />
              <p className="text-sm font-semibold text-airtel-charcoal">Select a specimen or upload a document</p>
              <p className="text-xs text-airtel-muted mt-1">OCR results and validation checks will appear here</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border border-airtel-border rounded-xl p-10 gap-4">
              <RefreshCw className="w-8 h-8 text-airtel-red animate-spin" />
              <p className="text-xs font-semibold text-airtel-charcoal">Running Gemini OCR extraction...</p>
              <p className="text-[11px] text-airtel-slate">Reading GSTIN, Udyam, signatory name, bill date</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Overall KYC Status Banner */}
              <div className={`rounded-xl px-5 py-4 border flex items-center justify-between ${val?.approved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  {val?.approved
                    ? <CheckCircle2 className="w-6 h-6 text-green-600" />
                    : <XCircle className="w-6 h-6 text-red-500" />}
                  <div>
                    <p className={`text-sm font-extrabold ${val?.approved ? 'text-green-800' : 'text-red-800'}`}>
                      {val?.approved ? 'KYC APPROVED ✓' : 'ACTION REQUIRED ✗'}
                    </p>
                    <p className="text-[11px] text-airtel-slate">
                      Applicant: <strong>{result.applicant_id}</strong> · {val?.checks?.length} checks run
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-airtel-slate">{val?.errors?.length || 0} error(s)</p>
                  <p className="text-xs text-airtel-slate">{val?.warnings?.length || 0} warning(s)</p>
                </div>
              </div>

              {/* Errors */}
              {val?.errors?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Defects Found ({val.errors.length})
                  </h4>
                  {val.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-700">• {e}</p>
                  ))}
                </div>
              )}

              {/* OCR Extracted Docs Grid */}
              <div>
                <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide mb-2">OCR Extracted Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <OCRCard title="GST Certificate"      data={docs?.gst}       />
                  <OCRCard title="Udyam Certificate"    data={docs?.udyam}     />
                  <OCRCard title="Signatory ID"         data={docs?.signatory} />
                  <OCRCard title="Address Proof"        data={docs?.address}   />
                </div>
              </div>

              {/* Validation Checks */}
              <div>
                <h3 className="text-xs font-bold text-airtel-charcoal uppercase tracking-wide mb-2">
                  Compliance Checks ({val?.checks?.length})
                </h3>
                <div className="space-y-2">
                  {val?.checks?.map((check, i) => <CheckRow key={i} check={check} />)}
                </div>
              </div>

              {/* Remediation */}
              {val?.remediation_guidance?.length > 0 && (
                <div className={`rounded-xl p-4 text-xs space-y-1 ${val.approved ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                  <h4 className="font-bold text-airtel-charcoal mb-2">
                    {val.approved ? '✅ Next Steps' : '⚠️ Customer Actions Required'}
                  </h4>
                  {val.remediation_guidance.map((g, i) => (
                    <p key={i} className={val.approved ? 'text-green-800' : 'text-amber-800'}>• {g}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
