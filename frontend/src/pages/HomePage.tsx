import React, { useState } from 'react';
import { ClaimForm } from '../components/ClaimForm';
import { ResultCard } from '../components/ResultCard';
import { ClaimsList } from '../components/ClaimsList';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdjudicationFlowchart } from '../components/AdjudicationFlowchart';
import { AdjudicationResult } from '../types';
import { Activity, BarChart2, Settings, GitBranch, FileText } from 'lucide-react';

type Tab = 'claims' | 'metrics' | 'admin' | 'flowchart';

export const HomePage: React.FC = () => {
  const [result, setResult] = useState<AdjudicationResult | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('claims');

  const handleSubmitSuccess = (adjudicationResult: AdjudicationResult) => {
    setResult(adjudicationResult);
    setRefreshKey(prev => prev + 1);
    setActiveTab('claims');
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: 'claims', label: 'Submit Claim', icon: FileText },
    { id: 'metrics', label: 'Analytics', icon: BarChart2 },
    { id: 'admin', label: 'Policy Admin', icon: Settings },
    { id: 'flowchart', label: 'Decision Flow', icon: GitBranch },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-12 w-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">
              OPD Claim Adjudication System
            </h1>
          </div>
          <p className="text-white text-lg opacity-90">
            AI-Powered Insurance Claim Processing • Plum Health
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-purple-800 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Claims Tab */}
        {activeTab === 'claims' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <ClaimForm onSubmitSuccess={handleSubmitSuccess} />
              </div>
              <div>
                {result ? (
                  <div id="result">
                    <ResultCard result={result} />
                  </div>
                ) : (
                  <div className="bg-white bg-opacity-50 rounded-lg shadow-xl p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-medium">Submit a claim to see the adjudication result</p>
                      <p className="text-gray-400 text-sm mt-2">Upload prescription & bill documents to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div key={refreshKey}>
              <ClaimsList />
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'metrics' && <MetricsDashboard />}

        {/* Admin Tab */}
        {activeTab === 'admin' && <AdminDashboard />}

        {/* Flowchart Tab */}
        {activeTab === 'flowchart' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <AdjudicationFlowchart />
          </div>
        )}


      </div>
    </div>
  );
};
