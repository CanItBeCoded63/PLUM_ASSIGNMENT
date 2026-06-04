import React from 'react';

const steps = [
  { id: 1, title: 'Basic Eligibility', icon: '🪪', color: 'from-blue-600 to-blue-800', checks: ['Member verified', 'Policy active', 'Initial 30-day wait', 'Late submission check (30d)'], fail: 'MEMBER_NOT_COVERED / POLICY_INACTIVE / WAITING_PERIOD / LATE_SUBMISSION' },
  { id: 2, title: 'Document Validation', icon: '📄', color: 'from-indigo-600 to-indigo-800', checks: ['Prescription present', 'Doctor reg# valid', 'Bill has amounts', 'Prescription date matches (±7d)'], fail: 'MISSING_DOCUMENTS / DOCTOR_REG_INVALID / DATE_MISMATCH' },
  { id: 3, title: 'Coverage Check', icon: '🛡️', color: 'from-violet-600 to-violet-800', checks: ['Not in exclusions list', 'Pre-auth for MRI/CT >₹10k', 'Dental: split cosmetic items'], fail: 'SERVICE_NOT_COVERED / PRE_AUTH_MISSING / PARTIAL approval' },
  { id: 4, title: 'Limit Validation', icon: '💰', color: 'from-purple-600 to-purple-800', checks: ['Claim > ₹500 minimum', 'Per-claim ≤ ₹5,000', 'Annual YTD check', 'Sub-limits (dental, alt-med)'], fail: 'BELOW_MIN_AMOUNT / PER_CLAIM_EXCEEDED / ANNUAL_LIMIT_EXCEEDED' },
  { id: 5, title: 'AI Medical Necessity', icon: '🧠', color: 'from-fuchsia-600 to-fuchsia-800', checks: ['Diagnosis justifies treatment', 'Medicines align with diagnosis', 'Tests clinically appropriate', 'Confidence < 70% → review'], fail: 'NOT_MEDICALLY_NECESSARY → MANUAL_REVIEW' },
  { id: 6, title: 'Fraud Detection', icon: '🔍', color: 'from-rose-600 to-rose-800', checks: ['Same-day claim frequency', 'High-value claim (>₹25k)', 'Provider pattern check', 'Duplicate detection'], fail: 'MANUAL_REVIEW with fraud flags' },
  { id: 7, title: 'Final Decision', icon: '✅', color: 'from-green-600 to-green-800', checks: ['Apply co-pay (10%) or network discount (20%)', 'Calculate approved amount', 'Set confidence score', 'Flag cashless if network hospital'], fail: null },
];

const outcomes = [
  { label: 'APPROVED', color: 'bg-green-600', desc: 'All checks pass, amount credited' },
  { label: 'PARTIAL', color: 'bg-yellow-500', desc: 'Some items excluded (e.g. cosmetic dental)' },
  { label: 'REJECTED', color: 'bg-red-600', desc: 'One or more hard rules violated' },
  { label: 'MANUAL REVIEW', color: 'bg-orange-500', desc: 'Fraud flag, low confidence, or >₹25k' },
  { label: 'APPEALED', color: 'bg-purple-600', desc: 'Member contested decision' },
];

export const AdjudicationFlowchart: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <span className="text-3xl">🗺️</span>
      <div>
        <h2 className="text-2xl font-bold text-white">Adjudication Decision Flowchart</h2>
        <p className="text-white/60 text-sm">7-step sequential pipeline — any step can exit early with a rejection</p>
      </div>
    </div>

    {/* Steps */}
    <div className="relative">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-4 mb-2">
          {/* Left connector */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 h-6 bg-white/20 mt-1"></div>
            )}
          </div>

          {/* Content */}
          <div className={`flex-1 bg-gradient-to-r ${step.color} bg-opacity-20 rounded-xl p-4 border border-white/10 mb-2`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-white font-bold text-base mb-2">Step {step.id}: {step.title}</p>
                <div className="grid grid-cols-2 gap-1">
                  {step.checks.map(c => (
                    <div key={c} className="flex items-center gap-1.5">
                      <span className="text-green-400 text-xs">✓</span>
                      <span className="text-white/75 text-xs">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              {step.fail && (
                <div className="flex-shrink-0 max-w-[220px]">
                  <p className="text-red-300 text-xs font-mono bg-red-900/40 border border-red-800/50 px-2 py-1.5 rounded-lg leading-relaxed">
                    ❌ {step.fail}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Outcomes */}
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
      <p className="text-white font-semibold mb-3">Possible Outcomes</p>
      <div className="flex flex-wrap gap-3">
        {outcomes.map(({ label, color, desc }) => (
          <div key={label} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>{label}</span>
            <span className="text-white/60 text-xs">{desc}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Priority Rules */}
    <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-5">
      <p className="text-indigo-200 font-semibold mb-2">⚡ Priority Rules (when conflicts occur)</p>
      <ol className="space-y-1">
        {['Safety first — reject suspicious/fraudulent claims', 'Policy exclusions override everything', 'Hard limits cannot be exceeded', 'Medical necessity is mandatory', 'When in doubt, refer for manual review'].map((r, i) => (
          <li key={i} className="text-indigo-300 text-sm flex items-start gap-2">
            <span className="text-indigo-400 font-bold">{i + 1}.</span> {r}
          </li>
        ))}
      </ol>
    </div>
  </div>
);
