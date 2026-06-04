import React, { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { claimAPI } from '../services/api';
import { Claim } from '../types';

export const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [appealingId, setAppealingId] = useState<string | null>(null);
  const [appealReason, setAppealReason] = useState('');
  const [appealSuccess, setAppealSuccess] = useState<string | null>(null);

  useEffect(() => { loadClaims(); }, []);

  const loadClaims = async () => {
    try {
      const data = await claimAPI.getAllClaims();
      setClaims(data);
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppeal = async (claimId: string) => {
    try {
      await claimAPI.appealClaim(claimId, appealReason || 'Member requested re-evaluation');
      setAppealSuccess(claimId);
      setAppealingId(null);
      setAppealReason('');
      await loadClaims();
      setTimeout(() => setAppealSuccess(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to submit appeal');
    }
  };

  const getDecisionBadge = (decision: string) => {
    const styles: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      PARTIAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      MANUAL_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
      APPEALED: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return styles[decision] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canAppeal = (decision?: string) =>
    decision && ['REJECTED', 'MANUAL_REVIEW', 'PARTIAL'].includes(decision);

  if (loading) return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recent Claims</h2>
        <button onClick={loadClaims} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {appealSuccess && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 text-sm flex items-center gap-2">
          ✅ Appeal submitted successfully for claim {appealSuccess}. Our team will review within 2-3 business days.
        </div>
      )}

      {claims.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No claims submitted yet</p>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800 font-mono text-sm">{claim.id}</h3>
                    {claim.decision && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getDecisionBadge(claim.decision)}`}>
                        {claim.decision.replace('_', ' ')}
                      </span>
                    )}
                    {claim.confidence_score != null && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {Math.round(Number(claim.confidence_score) * 100)}% confidence
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Member:</span>
                      <span className="ml-2 font-medium text-gray-800">{claim.member_name} ({claim.member_id})</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-500">Treatment:</span>
                      <span className="ml-2 text-gray-800">{claim.treatment_date}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-500">Claimed:</span>
                      <span className="ml-2 font-medium text-gray-800">₹{Number(claim.claim_amount).toLocaleString('en-IN')}</span>
                    </div>
                    {claim.approved_amount != null && (
                      <div className="flex items-center">
                        <span className="text-gray-500">Approved:</span>
                        <span className="ml-2 font-medium text-green-700">₹{Number(claim.approved_amount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {claim.notes && (
                    <p className="mt-2 text-sm text-gray-500 italic">{claim.notes.substring(0, 120)}{claim.notes.length > 120 ? '…' : ''}</p>
                  )}
                </div>

                {/* Appeal Button */}
                {canAppeal(claim.decision) && (
                  <div className="ml-4 flex-shrink-0">
                    {appealingId === claim.id ? (
                      <div className="space-y-2 w-48">
                        <textarea
                          className="w-full text-xs border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                          rows={2}
                          placeholder="Reason for appeal (optional)"
                          value={appealReason}
                          onChange={e => setAppealReason(e.target.value)}
                        />
                        <div className="flex gap-1.5">
                          <button onClick={() => handleAppeal(claim.id)} className="flex-1 text-xs bg-purple-600 hover:bg-purple-700 text-white py-1 rounded-lg transition-colors font-medium">
                            Submit
                          </button>
                          <button onClick={() => { setAppealingId(null); setAppealReason(''); }} className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAppealingId(claim.id)}
                        className="flex items-center gap-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Appeal
                      </button>
                    )}
                  </div>
                )}

                {claim.decision === 'APPEALED' && (
                  <div className="ml-4 flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5" /> Under Review
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
