export interface Claim {
  id: string;
  member_id: string;
  member_name: string;
  treatment_date: string;
  claim_amount: number;
  submission_date: string;
  decision?: 'APPROVED' | 'REJECTED' | 'PARTIAL' | 'MANUAL_REVIEW' | 'APPEALED';
  approved_amount?: number;
  rejection_reasons?: string[];
  confidence_score?: number;
  notes?: string;
  created_at?: string;
}

export interface Member {
  member_id: string;
  member_name: string;
  policy_id: string;
  join_date: string;
  policy_status: string;
  annual_claims_ytd: number;
}

export interface ClaimSubmission {
  member_id: string;
  member_name: string;
  treatment_date: string;
  claim_amount: number;
  documents: File[];
}

export interface AdjudicationResult {
  claim_id: string;
  decision: 'APPROVED' | 'REJECTED' | 'PARTIAL' | 'MANUAL_REVIEW' | 'APPEALED';
  approved_amount: number;
  rejection_reasons?: string[];
  deductions?: {
    copay?: number;
    network_discount?: number;
  };
  flags?: string[];
  confidence_score: number;
  notes: string;
  next_steps?: string;
  rejected_items?: string[];
  cashless_approved?: boolean;
  network_discount?: number;
  extracted_data?: any;
}

export interface Metrics {
  total_claims: number;
  decisions: {
    approved: number;
    rejected: number;
    partial: number;
    manual_review: number;
    appealed: number;
  };
  rates: {
    approval_rate: number;
    rejection_rate: number;
    partial_rate: number;
    manual_review_rate: number;
  };
  avg_confidence_score: number;
  financials: {
    total_claimed: number;
    total_approved: number;
    savings: number;
  };
  top_rejection_reasons: { reason: string; count: number }[];
  recent_claims: Claim[];
}

export interface PolicyConfig {
  policy_id: string;
  policy_name: string;
  coverage: {
    annual_limit: number;
    per_claim_limit: number;
    consultation_fees: { sub_limit: number; copay_percentage: number; network_discount: number };
    dental: { sub_limit: number };
    alternative_medicine: { sub_limit: number };
  };
  waiting_periods: {
    initial_waiting: number;
    specific_ailments: { diabetes: number; hypertension: number; joint_replacement: number };
  };
  exclusions: string[];
  network_hospitals: string[];
  claim_requirements: { minimum_claim_amount: number; submission_timeline_days: number };
}
