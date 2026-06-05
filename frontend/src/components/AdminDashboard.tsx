import React, { useEffect, useState } from 'react';
import { claimAPI } from '../services/api';
import { PolicyConfig, Claim } from '../types';
import { Settings, Shield, Clock, Ban, Gavel, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [policy, setPolicy] = useState<PolicyConfig | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Adjudication form state
  const [adjudicatingId, setAdjudicatingId] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([claimAPI.getPolicy(), claimAPI.getAllClaims()])
      .then(([policyData, claimsData]) => {
        setPolicy(policyData);
        setClaims(claimsData);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartAdjudicate = (claim: Claim, type: 'APPROVED' | 'REJECTED') => {
    setAdjudicatingId(claim.id);
    setDecisionType(type);
    setApprovedAmount(type === 'APPROVED' ? claim.claim_amount.toString() : '');
    setAdminNotes('');
  };

  const handleCancelAdjudicate = () => {
    setAdjudicatingId(null);
    setDecisionType(null);
    setApprovedAmount('');
    setAdminNotes('');
  };

  const handleAdjudicateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjudicatingId || !decisionType) return;
    
    setActionLoading(true);
    try {
      const amt = decisionType === 'APPROVED' ? parseFloat(approvedAmount || '0') : 0;
      await claimAPI.manualAdjudicateClaim(adjudicatingId, decisionType, amt, adminNotes);
      
      // Refresh claims list
      const updatedClaims = await claimAPI.getAllClaims();
      setClaims(updatedClaims);
      
      // Clear adjudication state
      handleCancelAdjudicate();
    } catch (err) {
      alert('Failed to submit manual adjudication decision.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
    </div>
  );

  if (error) return <div className="text-center py-16 text-red-400 text-lg">{error}</div>;
  if (!policy) return null;

  // Filter claims awaiting manual review or appealed by members
  const pendingClaims = claims.filter(c => c.decision === 'MANUAL_REVIEW' || c.decision === 'APPEALED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-white/60 text-sm">Policy: {policy.policy_name} ({policy.policy_id})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Claims Awaiting Adjudication (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Gavel className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Claims Awaiting Manual Review & Appeals</h3>
              <span className="ml-auto text-xs bg-purple-900 text-purple-200 px-3 py-1 rounded-full border border-purple-700">
                {pendingClaims.length} Pending Action
              </span>
            </div>

            {pendingClaims.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <CheckCircle className="h-10 w-10 text-green-400/60 mx-auto mb-3" />
                <p>All clear! No claims are currently awaiting manual review or appeal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map(claim => {
                  const isAppealed = claim.decision === 'APPEALED';
                  const isFormActive = adjudicatingId === claim.id;

                  return (
                    <div 
                      key={claim.id} 
                      className={`rounded-xl p-5 border transition-all duration-300 ${
                        isAppealed 
                          ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50' 
                          : 'bg-yellow-950/10 border-yellow-500/20 hover:border-yellow-500/40'
                      }`}
                    >
                      {/* Top Row: Claim ID, Status Badge, Amount */}
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{claim.id}</span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isAppealed 
                                ? 'bg-purple-900/60 text-purple-200 border border-purple-600/40' 
                                : 'bg-yellow-900/50 text-yellow-200 border border-yellow-600/40'
                            }`}>
                              {isAppealed ? 'Appealed' : 'Manual Review'}
                            </span>
                          </div>
                          <p className="text-white/70 text-xs mt-1">
                            Member: <span className="font-semibold text-white">{claim.member_name}</span> ({claim.member_id})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-white">₹{claim.claim_amount}</span>
                          <p className="text-white/50 text-[10px]">Treatment: {claim.treatment_date}</p>
                        </div>
                      </div>

                      {/* Notes / Reason for Review */}
                      <div className="mt-3 bg-black/20 rounded-lg p-3 text-xs border border-white/5">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-300 flex-shrink-0 mt-0.5" />
                          <div className="text-white/80 space-y-1">
                            <span className="font-bold text-white/90">Trigger/Reason:</span>
                            <p className="italic">{claim.notes || 'Awaiting adjudication decision.'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Forms / Buttons */}
                      {!isFormActive ? (
                        <div className="mt-4 flex gap-2 justify-end">
                          <button
                            onClick={() => handleStartAdjudicate(claim, 'REJECTED')}
                            className="flex items-center gap-1.5 bg-red-950/40 text-red-200 border border-red-800/40 hover:bg-red-900/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleStartAdjudicate(claim, 'APPROVED')}
                            className="flex items-center gap-1.5 bg-green-950/40 text-green-200 border border-green-800/40 hover:bg-green-900/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleAdjudicateSubmit} className="mt-4 border-t border-white/10 pt-4 space-y-3">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1">
                            {decisionType === 'APPROVED' ? (
                              <span className="text-green-400 flex items-center gap-1"><CheckCircle className="h-4.5 w-4.5" /> Confirm Claim Approval</span>
                            ) : (
                              <span className="text-red-400 flex items-center gap-1"><XCircle className="h-4.5 w-4.5" /> Confirm Claim Rejection</span>
                            )}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {decisionType === 'APPROVED' && (
                              <div>
                                <label className="block text-[10px] text-white/60 font-semibold mb-1">Approved Amount (₹)</label>
                                <input
                                  type="number"
                                  value={approvedAmount}
                                  onChange={(e) => setApprovedAmount(e.target.value)}
                                  max={claim.claim_amount}
                                  required
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                                />
                              </div>
                            )}
                            <div className={decisionType === 'APPROVED' ? 'col-span-1' : 'col-span-2'}>
                              <label className="block text-[10px] text-white/60 font-semibold mb-1">Adjudication Notes / Rationale</label>
                              <input
                                type="text"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Enter administrative notes for the member..."
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              type="button"
                              onClick={handleCancelAdjudicate}
                              className="bg-white/10 text-white/80 hover:bg-white/15 px-3 py-1.5 rounded-lg text-xs transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className={`text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                decisionType === 'APPROVED'
                                  ? 'bg-green-600 hover:bg-green-500 shadow-md shadow-green-900/30'
                                  : 'bg-red-600 hover:bg-red-500 shadow-md shadow-red-900/30'
                              }`}
                            >
                              {actionLoading ? 'Saving...' : 'Submit Decision'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Policy Reference Panel (Takes 1/3 width) */}
        <div className="space-y-6">
          {/* Coverage Limits */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" /> Coverage Rules
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Annual Limit', value: `₹${policy.coverage.annual_limit.toLocaleString('en-IN')}` },
                { label: 'Per-Claim Limit', value: `₹${policy.coverage.per_claim_limit.toLocaleString('en-IN')}` },
                { label: 'Consultation Fee Copay', value: `${policy.coverage.consultation_fees.copay_percentage}%` },
                { label: 'Network Hospital Discount', value: `${policy.coverage.consultation_fees.network_discount}%` },
                { label: 'Submission Timeline', value: `${policy.claim_requirements.submission_timeline_days} Days` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-white/70 text-xs">{label}</span>
                  <span className="font-bold text-white text-xs bg-white/15 px-2 py-0.5 rounded-md">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Periods */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" /> Ailment waiting periods
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/70">Initial Period</span>
                <span className="font-semibold text-yellow-300">{policy.waiting_periods.initial_waiting} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/70">Diabetes</span>
                <span className="font-semibold text-yellow-300">{policy.waiting_periods.specific_ailments.diabetes} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/70">Hypertension</span>
                <span className="font-semibold text-yellow-300">{policy.waiting_periods.specific_ailments.hypertension} Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Exclusions row */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Ban className="h-5 w-5 text-red-400" /> Exclusions Reference List
        </h3>
        <div className="flex flex-wrap gap-2">
          {policy.exclusions.map(ex => (
            <span key={ex} className="text-xs bg-red-950/50 text-red-300 border border-red-800/40 px-2.5 py-1 rounded-md">{ex}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
