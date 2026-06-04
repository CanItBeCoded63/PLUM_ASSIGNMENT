/**
 * Sample Document Generator
 * Generates mock prescription and bill text for testing
 */

export const generateSamplePrescription = (params: {
  doctorName: string;
  doctorReg: string;
  patientName: string;
  diagnosis: string;
  medicines: string[];
  date: string;
}): string => {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MEDICAL CLINIC
    123 Health Street, Bangalore
    Phone: +91-9876543210
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dr. ${params.doctorName}, MBBS, MD
Registration No: ${params.doctorReg}

Date: ${params.date}

Patient Name: ${params.patientName}
Age/Sex: 35/M

Chief Complaints:
- Fever since 2 days
- Body ache
- Headache

Diagnosis: ${params.diagnosis}

Rx (Prescription):
${params.medicines.map((med, i) => `${i + 1}. ${med}`).join('\n')}

Investigations Advised:
- Complete Blood Count (CBC)
- Dengue NS1 Antigen Test

Follow-up: After 3 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dr. ${params.doctorName}
[Signature]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
};

export const generateSampleBill = (params: {
  hospitalName: string;
  patientName: string;
  consultationFee: number;
  diagnosticTests: number;
  testNames: string[];
  totalAmount: number;
  date: string;
}): string => {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ${params.hospitalName}
        456 Medical Road, Bangalore
        GST No: 29ABCDE1234F1Z5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bill No: BL-2024-${Math.floor(Math.random() * 10000)}
Date: ${params.date}

Patient Details:
Name: ${params.patientName}
Contact: +91-9876543210

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTICULARS                         AMOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consultation Fee                    ₹ ${params.consultationFee}

Diagnostic Tests:
${params.testNames.map(test => `- ${test}`).join('\n')}
                                   ₹ ${params.diagnosticTests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sub Total:                          ₹ ${params.totalAmount - (params.totalAmount * 0.18)}
GST (18%):                         ₹ ${params.totalAmount * 0.18}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                             ₹ ${params.totalAmount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount in Words: Rupees ${toWords(params.totalAmount)} Only

Payment Mode: Cash
Transaction ID: TXN${Date.now()}

[Authorized Signatory]
[Hospital Stamp]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
};

function toWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';
  
  let words = '';
  
  if (num >= 1000) {
    words += ones[Math.floor(num / 1000)] + ' Thousand ';
    num %= 1000;
  }
  
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    return words.trim();
  }
  
  if (num > 0) {
    words += ones[num] + ' ';
  }
  
  return words.trim();
}

export const testCases = {
  TC001: {
    prescription: generateSamplePrescription({
      doctorName: 'Sharma',
      doctorReg: 'KA/45678/2015',
      patientName: 'Rajesh Kumar',
      diagnosis: 'Viral fever',
      medicines: [
        'Tab. Paracetamol 650mg - 1-0-1 x 3 days',
        'Tab. Vitamin C 500mg - 1-0-0 x 5 days'
      ],
      date: '01-11-2024'
    }),
    bill: generateSampleBill({
      hospitalName: 'City Health Clinic',
      patientName: 'Rajesh Kumar',
      consultationFee: 1000,
      diagnosticTests: 500,
      testNames: ['Complete Blood Count (CBC)', 'Dengue NS1 Test'],
      totalAmount: 1500,
      date: '01-11-2024'
    })
  }
};
