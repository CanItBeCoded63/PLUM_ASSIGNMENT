import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { AdjudicationResult } from '../types';

interface ResultCardProps {
  result: AdjudicationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'bg-green-50 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 border-red-200';
      case 'PARTIAL':
        return 'bg-yellow-50 border-yellow-200';
      case 'MANUAL_REVIEW':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'PARTIAL':
        return <AlertCircle className="h-8 w-8 text-yellow-600" />;
      case 'MANUAL_REVIEW':
        return <Clock className="h-8 w-8 text-blue-600" />;
      default:
        return null;
    }
  };

  const getDecisionText = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'Claim Approved';
      case 'REJECTED':
        return 'Claim Rejected';
      case 'PARTIAL':
        return 'Partial Approval';
      case 'MANUAL_REVIEW':
        return 'Manual Review Required';
      default:
        return decision;
    }
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getDecisionColor(result.decision)}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getDecisionIcon(result.decision)}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {getDecisionText(result.decision)}
          </h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Claim ID:</span>
              <span className="ml-2 text-sm font-mono text-gray-800">{result.claim_id}</span>
            </div>

            {(result.decision === 'APPROVED' || result.decision === 'PARTIAL') && (
              <div>
                <span className="text-sm font-medium text-gray-600">Approved Amount:</span>
                <span className="ml-2 text-lg font-bold text-green-700">
                  ₹{result.approved_amount.toFixed(2)}
                </span>
              </div>
            )}

            {result.deductions && Object.keys(result.deductions).length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-600">Deductions:</span>
                <ul className="ml-6 mt-1 text-sm text-gray-700 list-disc">
                  {result.deductions.copay && (
                    <li>Co-payment: ₹{result.deductions.copay.toFixed(2)}</li>
                  )}
                  {result.deductions.network_discount && (
                    <li>Network Discount: ₹{result.deductions.network_discount.toFixed(2)}</li>
                  )}
                </ul>
              </div>
            )}

            {result.rejection_reasons && result.rejection_reasons.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-600">Rejection Reasons:</span>
                <ul className="ml-6 mt-1 text-sm text-red-700 list-disc">
                  {result.rejection_reasons.map((reason, index) => (
                    <li key={index}>{reason.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.flags && result.flags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-600">Flags:</span>
                <ul className="ml-6 mt-1 text-sm text-orange-700 list-disc">
                  {result.flags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.notes && (
              <div>
                <span className="text-sm font-medium text-gray-600">Notes:</span>
                <p className="mt-1 text-sm text-gray-700">{result.notes}</p>
              </div>
            )}

            {result.next_steps && (
              <div>
                <span className="text-sm font-medium text-gray-600">Next Steps:</span>
                <p className="mt-1 text-sm text-gray-700">{result.next_steps}</p>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-600">Confidence Score:</span>
              <div className="mt-1 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${result.confidence_score * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {(result.confidence_score * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {result.extracted_data && (
              <details className="mt-4">
                <summary className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800">
                  View Extracted Data
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result.extracted_data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
