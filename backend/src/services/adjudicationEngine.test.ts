import dotenv from 'dotenv';
dotenv.config();

jest.mock('./aiService', () => ({
  __esModule: true,
  default: {
    analyzeMedicalNecessity: jest.fn().mockResolvedValue({
      isNecessary: true,
      reasoning: 'Treatment is medically appropriate and standard for the diagnosed condition',
      confidence: 0.95
    }),
    extractPrescriptionData: jest.fn(),
    extractBillData: jest.fn()
  }
}));

jest.mock('../config/database', () => {
  const members = [
    { member_id: 'EMP001', member_name: 'Rajesh Kumar', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP002', member_name: 'Priya Singh', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP003', member_name: 'Amit Verma', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP004', member_name: 'Sneha Reddy', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP005', member_name: 'Vikram Joshi', policy_id: 'PLUM_OPD_2024', join_date: '2024-09-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP006', member_name: 'Kavita Nair', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP007', member_name: 'Suresh Patil', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP008', member_name: 'Ravi Menon', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP009', member_name: 'Anita Desai', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
    { member_id: 'EMP010', member_name: 'Deepak Shah', policy_id: 'PLUM_OPD_2024', join_date: '2024-01-01', policy_status: 'active', annual_claims_ytd: 0 },
  ];
  return {
    __esModule: true,
    default: {
      prepare: jest.fn().mockImplementation((query: string) => {
        return {
          get: jest.fn().mockImplementation((...params: any[]) => {
            if (query.includes('FROM members WHERE member_id')) {
              return members.find(m => m.member_id === params[0]) || null;
            }
            if (query.includes('COUNT(*) as count FROM claims')) {
              return { count: 0 };
            }
            if (query.includes('annual_claims_ytd FROM members')) {
              const m = members.find(m => m.member_id === params[0]);
              return m ? { annual_claims_ytd: m.annual_claims_ytd } : { annual_claims_ytd: 0 };
            }
            return null;
          }),
          all: jest.fn().mockReturnValue([])
        };
      })
    }
  };
});

import adjudicationEngine from './adjudicationEngine';
import testCasesData from '../../../../test_cases.json';
import { Claim, PrescriptionData, BillData } from '../models/types';

describe('OPD Claim Adjudication Engine End-to-End Test Cases', () => {
  const { test_cases } = testCasesData;

  test_cases.forEach((tc) => {
    it(`should correctly adjudicate ${tc.case_id}: ${tc.case_name}`, async () => {
      const claim: Claim = {
        id: tc.case_id,
        member_id: tc.input_data.member_id,
        member_name: tc.input_data.member_name,
        treatment_date: tc.input_data.treatment_date,
        claim_amount: tc.input_data.claim_amount,
        submission_date: '2024-11-04',
        hospital: tc.input_data.hospital,
        cashless_request: tc.input_data.cashless_request,
      };

      if ((tc.input_data as any).previous_claims_same_day !== undefined) {
        (claim as any).previous_claims_same_day = (tc.input_data as any).previous_claims_same_day;
      }

      const prescriptionData: PrescriptionData = tc.input_data.documents.prescription || {};
      const billData: BillData = tc.input_data.documents.bill || {};

      const result = await adjudicationEngine.adjudicateClaim(claim, prescriptionData, billData);

      const expectedOutput = tc.expected_output as any;

      // Verify overall decision
      expect(result.decision).toBe(expectedOutput.decision);

      // Verify approved amount if present
      if (expectedOutput.approved_amount !== undefined) {
        expect(result.approved_amount).toBe(expectedOutput.approved_amount);
      }

      // Verify rejection reasons
      if (expectedOutput.rejection_reasons) {
        expect(result.rejection_reasons).toEqual(
          expect.arrayContaining(expectedOutput.rejection_reasons)
        );
      }

      // Verify rejected items for partial approvals
      if (expectedOutput.rejected_items) {
        expect(result.rejected_items).toEqual(
          expect.arrayContaining(expectedOutput.rejected_items)
        );
      }

      // Verify deductions (copay or network discount)
      if (expectedOutput.deductions?.copay !== undefined) {
        expect(result.deductions?.copay).toBe(expectedOutput.deductions.copay);
      }
      if (expectedOutput.copay !== undefined) {
        expect(result.deductions?.copay).toBe(expectedOutput.copay);
      }
      if (expectedOutput.network_discount !== undefined) {
        expect(result.network_discount).toBe(expectedOutput.network_discount);
      }

      // Verify cashless status
      if (expectedOutput.cashless_approved !== undefined) {
        expect(result.cashless_approved).toBe(expectedOutput.cashless_approved);
      }

      // Verify fraud flags
      if (expectedOutput.flags) {
        expect(result.flags).toEqual(expect.arrayContaining(expectedOutput.flags));
      }

      // Verify notes (partial matching)
      if (expectedOutput.notes) {
        expect(result.notes.toLowerCase()).toContain(expectedOutput.notes.toLowerCase());
      }
    });
  });
});
