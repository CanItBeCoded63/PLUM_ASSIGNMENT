export interface Claim {
  id: string;
  member_id: string;
  member_name: string;
  treatment_date: string;
  claim_amount: number;
  submission_date: string;
  decision?: 'APPROVED' | 'REJECTED' | 'PARTIAL' | 'MANUAL_REVIEW';
  approved_amount?: number;
  rejection_reasons?: string[];
  confidence_score?: number;
  notes?: string;
  created_at?: string;
  hospital?: string;
  cashless_request?: boolean;
}

export interface ClaimDocument {
  id?: number;
  claim_id: string;
  document_type: 'prescription' | 'bill' | 'test_report' | 'other';
  file_path: string;
  extracted_text?: string;
  created_at?: string;
}

export interface ExtractedData {
  id?: number;
  claim_id: string;
  field_name: string;
  field_value: string;
  source_document?: string;
  created_at?: string;
}

export interface Member {
  member_id: string;
  member_name: string;
  policy_id: string;
  join_date: string;
  policy_status: 'active' | 'inactive' | 'suspended';
  annual_claims_ytd: number;
  created_at?: string;
}

export interface PrescriptionData {
  doctor_name?: string;
  doctor_reg?: string;
  diagnosis?: string;
  medicines_prescribed?: string[];
  tests_prescribed?: string[];
  treatment?: string;
  date?: string;
}

export interface BillData {
  consultation_fee?: number;
  diagnostic_tests?: number;
  test_names?: string[];
  medicines?: number;
  procedures?: any;
  total_amount?: number;
  hospital_name?: string;
  bill_number?: string;
  date?: string;
}

export interface AdjudicationResult {
  claim_id: string;
  decision: 'APPROVED' | 'REJECTED' | 'PARTIAL' | 'MANUAL_REVIEW';
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
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
