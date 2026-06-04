import React, { useEffect, useState } from 'react';
import { claimAPI } from '../services/api';
import { Metrics } from '../types';
import { BarChart2, TrendingUp, DollarSign, Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await claimAPI.getMetrics();
      setMetrics(data);
    } catch {
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-16 text-red-400 text-lg">{error}</div>
  );

  if (!metrics) return null;

  const total = metrics.total_claims || 1;
  const statCards = [
    { label: 'Total Claims', value: metrics.total_claims, icon: BarChart2, color: 'from-blue-500 to-blue-700', text: 'text-blue-200' },
    { label: 'Avg Confidence', value: `${Math.round(metrics.avg_confidence_score * 100)}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-700', text: 'text-purple-200' },
    { label: 'Total Claimed', value: `₹${metrics.financials.total_claimed.toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-yellow-500 to-yellow-700', text: 'text-yellow-200' },
    { label: 'Savings / Deductions', value: `₹${metrics.financials.savings.toLocaleString('en-IN')}`, icon: Shield, color: 'from-green-500 to-green-700', text: 'text-green-200' },
  ];

  const decisionBars = [
    { label: 'Approved', count: metrics.decisions.approved, rate: metrics.rates.approval_rate, color: 'bg-green-500', badge: 'bg-green-900 text-green-200' },
    { label: 'Rejected', count: metrics.decisions.rejected, rate: metrics.rates.rejection_rate, color: 'bg-red-500', badge: 'bg-red-900 text-red-200' },
    { label: 'Partial', count: metrics.decisions.partial, rate: metrics.rates.partial_rate, color: 'bg-yellow-500', badge: 'bg-yellow-900 text-yellow-200' },
    { label: 'Manual Review', count: metrics.decisions.manual_review, rate: metrics.rates.manual_review_rate, color: 'bg-orange-500', badge: 'bg-orange-900 text-orange-200' },
    { label: 'Appealed', count: metrics.decisions.appealed, rate: total > 0 ? Math.round((metrics.decisions.appealed / total) * 100) : 0, color: 'bg-purple-500', badge: 'bg-purple-900 text-purple-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-7 w-7 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">System Analytics</h2>
          {metrics.total_claims === 0 && (
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full">Submit a claim to see live data</span>
          )}
        </div>
        <button onClick={fetchMetrics} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-xl p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-6 w-6 ${text}`} />
              <span className={`text-xs font-medium ${text} opacity-75`}>{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Decision Distribution */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-400" /> Decision Distribution
        </h3>
        <div className="space-y-4">
          {decisionBars.map(({ label, count, rate, color, badge }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/80 text-sm font-medium">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-xs">{count} claims</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>{rate}%</span>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financials + Rejection Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Financials */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-400" /> Financial Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Total Claimed', value: metrics.financials.total_claimed, color: 'text-blue-300' },
              { label: 'Total Approved', value: metrics.financials.total_approved, color: 'text-green-300' },
              { label: 'Deductions/Savings', value: metrics.financials.savings, color: 'text-yellow-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                <span className="text-white/70 text-sm">{label}</span>
                <span className={`font-bold ${color}`}>₹{value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rejection Reasons */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" /> Top Rejection Reasons
          </h3>
          {metrics.top_rejection_reasons.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">No rejections yet 🎉</p>
          ) : (
            <div className="space-y-2">
              {metrics.top_rejection_reasons.map(({ reason, count }, i) => (
                <div key={reason} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-900 text-red-200 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="text-white/80 text-sm font-mono">{reason}</span>
                  </div>
                  <span className="text-red-300 font-semibold text-sm">{count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Accuracy Indicator */}
      <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-md rounded-xl p-5 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-purple-300" />
            <div>
              <p className="text-white font-semibold">AI Confidence Score</p>
              <p className="text-white/60 text-sm">Average across all adjudicated claims</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{Math.round(metrics.avg_confidence_score * 100)}%</p>
            <p className="text-purple-300 text-sm">{metrics.avg_confidence_score >= 0.85 ? '🟢 High accuracy' : metrics.avg_confidence_score >= 0.7 ? '🟡 Good accuracy' : '🔴 Low accuracy'}</p>
          </div>
        </div>
        <div className="mt-3 h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all duration-700" style={{ width: `${Math.round(metrics.avg_confidence_score * 100)}%` }} />
        </div>
      </div>
    </div>
  );
};
