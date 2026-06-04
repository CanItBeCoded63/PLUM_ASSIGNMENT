import React, { useState, useEffect } from 'react';
import { Upload, FileText, Send, Loader } from 'lucide-react';
import { claimAPI } from '../services/api';
import { Member, AdjudicationResult } from '../types';

interface ClaimFormProps {
  onSubmitSuccess: (result: AdjudicationResult) => void;
}

export const ClaimForm: React.FC<ClaimFormProps> = ({ onSubmitSuccess }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await claimAPI.getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedMember || !treatmentDate || !claimAmount || documents.length === 0) {
      setError('Please fill all fields and upload at least one document');
      return;
    }

    const member = members.find(m => m.member_id === selectedMember);
    if (!member) return;

    setLoading(true);
    try {
      const result = await claimAPI.submitClaim({
        member_id: member.member_id,
        member_name: member.member_name,
        treatment_date: treatmentDate,
        claim_amount: parseFloat(claimAmount),
        documents
      });
      
      onSubmitSuccess(result);
      
      // Reset form
      setSelectedMember('');
      setTreatmentDate('');
      setClaimAmount('');
      setDocuments([]);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit New Claim</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member
          </label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a member...</option>
            {members.map(member => (
              <option key={member.member_id} value={member.member_id}>
                {member.member_name} ({member.member_id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Date
          </label>
          <input
            type="date"
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claim Amount (₹)
          </label>
          <input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            min="500"
            step="0.01"
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Documents
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF, TXT up to 10MB each
              </p>
            </div>
          </div>
          
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              {documents.map((file, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{file.name}</span>
                  <span className="ml-2 text-gray-400">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Claim
            </>
          )}
        </button>
      </form>
    </div>
  );
};
