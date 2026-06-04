import axios from 'axios';
import { Claim, Member, ClaimSubmission, AdjudicationResult, Metrics, PolicyConfig } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const claimAPI = {
  async submitClaim(submission: ClaimSubmission): Promise<AdjudicationResult> {
    const formData = new FormData();
    formData.append('member_id', submission.member_id);
    formData.append('member_name', submission.member_name);
    formData.append('treatment_date', submission.treatment_date);
    formData.append('claim_amount', submission.claim_amount.toString());
    
    submission.documents.forEach(file => {
      formData.append('documents', file);
    });

    const response = await api.post<AdjudicationResult>('/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getClaim(claimId: string): Promise<Claim> {
    const response = await api.get<Claim>(`/claims/${claimId}`);
    return response.data;
  },

  async getAllClaims(memberId?: string): Promise<Claim[]> {
    const params = memberId ? { member_id: memberId } : {};
    const response = await api.get<Claim[]>('/claims', { params });
    return response.data;
  },

  async appealClaim(claimId: string, reason: string): Promise<any> {
    const response = await api.put(`/claims/${claimId}/appeal`, { reason });
    return response.data;
  },

  async getMember(memberId: string): Promise<Member> {
    const response = await api.get<Member>(`/members/${memberId}`);
    return response.data;
  },

  async getAllMembers(): Promise<Member[]> {
    const response = await api.get<Member[]>('/members');
    return response.data;
  },

  async getMetrics(): Promise<Metrics> {
    const response = await api.get<Metrics>('/metrics');
    return response.data;
  },

  async getPolicy(): Promise<PolicyConfig> {
    const response = await api.get<PolicyConfig>('/admin/policy');
    return response.data;
  },
  
  async manualAdjudicateClaim(claimId: string, decision: 'APPROVED' | 'REJECTED', approvedAmount: number, notes: string): Promise<any> {
    const response = await api.put(`/claims/${claimId}/adjudicate`, { decision, approved_amount: approvedAmount, notes });
    return response.data;
  },
};

export default api;
