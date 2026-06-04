import OpenAI from 'openai';
import { PrescriptionData, BillData } from '../models/types';

// OpenRouter is OpenAI-compatible — just change baseURL and apiKey
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',   // Required by OpenRouter
    'X-Title': 'OPD Claim Adjudication System' // Shown in OpenRouter dashboard
  }
});

// Free model router on OpenRouter — automatically routes to a healthy free model
const AI_MODEL = 'openrouter/free';

export class AIService {
  /**
   * Extract structured data from prescription text using AI
   */
  async extractPrescriptionData(text: string): Promise<PrescriptionData> {
    const prompt = `You are a medical document processing AI. Extract structured data from medical prescriptions.

Return ONLY valid JSON matching this schema:
{
  "doctor_name": string,
  "doctor_reg": string (format: STATE/NUMBER/YEAR e.g. "KA/45678/2015" or "AYUR/KL/2345/2019"),
  "diagnosis": string,
  "medicines_prescribed": string[],
  "tests_prescribed": string[],
  "treatment": string or null,
  "date": string (YYYY-MM-DD format)
}

--- FEW-SHOT EXAMPLES ---

Example 1:
Input: "Dr. Sharma, MBBS MD | Reg. No: KA/45678/2015 | Date: 01/11/2024 | Patient: Rajesh Kumar | Diagnosis: Viral fever | Rx: 1. Paracetamol 650mg 2. Vitamin C | Investigations: CBC, Dengue test"
Output: {"doctor_name":"Dr. Sharma","doctor_reg":"KA/45678/2015","diagnosis":"Viral fever","medicines_prescribed":["Paracetamol 650mg","Vitamin C"],"tests_prescribed":["CBC","Dengue test"],"treatment":null,"date":"2024-11-01"}

Example 2:
Input: "Vaidya Krishnan | AYUR/KL/2345/2019 | Date: 28-10-2024 | Patient: Kavita Nair | Diagnosis: Chronic joint pain | Treatment: Panchakarma therapy"
Output: {"doctor_name":"Vaidya Krishnan","doctor_reg":"AYUR/KL/2345/2019","diagnosis":"Chronic joint pain","medicines_prescribed":[],"tests_prescribed":[],"treatment":"Panchakarma therapy","date":"2024-10-28"}

--- ACTUAL INPUT ---
${text}

Return only valid JSON, no markdown, no explanation.`;

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a medical document processing AI. Extract structured data from medical prescriptions accurately. Return only valid JSON with no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
      });

      const content = response.choices[0].message.content || '{}';
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('AI Extraction Error:', error);
      return this.fallbackPrescriptionExtraction(text);
    }
  }

  /**
   * Extract structured data from bill text using GPT
   */
  async extractBillData(text: string): Promise<BillData> {
    const prompt = `You are a medical billing AI. Extract financial data from medical bills.

Return ONLY valid JSON matching this schema:
{
  "consultation_fee": number or null,
  "diagnostic_tests": number or null (total test cost),
  "test_names": string[] (list of test names),
  "medicines": number or null (pharmacy total),
  "procedures": object (procedure name -> cost, e.g. {"root_canal": 8000}),
  "total_amount": number or null,
  "hospital_name": string or null,
  "bill_number": string or null,
  "date": string (YYYY-MM-DD)
}

--- FEW-SHOT EXAMPLES ---

Example 1:
Input: "City Health Care Clinic | Bill No: BILL100234 | Date: 01/11/2024 | Consultation Fee: 1000 | Diagnostic Tests: 500 | TOTAL: 1500"
Output: {"consultation_fee":1000,"diagnostic_tests":500,"test_names":[],"medicines":null,"procedures":{},"total_amount":1500,"hospital_name":"City Health Care Clinic","bill_number":"BILL100234","date":"2024-11-01"}

Example 2:
Input: "Apollo Hospitals | Bill No: APL9021 | Date: 03/11/2024 | Consultation: 1500 | Medicines: 3000 | Total: 4500"
Output: {"consultation_fee":1500,"diagnostic_tests":null,"test_names":[],"medicines":3000,"procedures":{},"total_amount":4500,"hospital_name":"Apollo Hospitals","bill_number":"APL9021","date":"2024-11-03"}

--- ACTUAL INPUT ---
${text}

Return only valid JSON, no markdown, no explanation.`;

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a medical billing document processing AI. Extract structured financial data from medical bills accurately. Return only valid JSON with no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
      });

      const content = response.choices[0].message.content || '{}';
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('AI Extraction Error:', error);
      return this.fallbackBillExtraction(text);
    }
  }

  /**
   * Analyze medical necessity using AI
   */
  async analyzeMedicalNecessity(
    diagnosis: string,
    treatment: string,
    tests: string[]
  ): Promise<{ isNecessary: boolean; reasoning: string; confidence: number }> {
    const prompt = `You are a senior medical reviewer for an insurance company. Assess if the treatment is medically necessary based on standard clinical protocols.

Return ONLY valid JSON:
{
  "isNecessary": boolean,
  "reasoning": string (1-2 sentence clinical explanation),
  "confidence": number (0.0-1.0)
}

--- FEW-SHOT EXAMPLES ---

Example 1:
Diagnosis: Viral fever | Treatment: Paracetamol 650mg, Vitamin C | Tests: CBC, Dengue test
Output: {"isNecessary":true,"reasoning":"Paracetamol is first-line symptomatic treatment for viral fever. CBC and Dengue tests are appropriate to rule out serious infection.","confidence":0.95}

Example 2:
Diagnosis: Obesity - BMI 35 | Treatment: Bariatric consultation and diet plan | Tests: none
Output: {"isNecessary":false,"reasoning":"While obesity management is important, bariatric consultation is excluded under OPD policy as a weight-loss treatment. Routine dietary counseling does not require specialist referral at this level.","confidence":0.92}

Example 3:
Diagnosis: Migraine | Treatment: Sumatriptan, Propranolol | Tests: none
Output: {"isNecessary":true,"reasoning":"Sumatriptan is a first-line migraine abortive treatment and Propranolol is evidence-based for migraine prophylaxis. Both are medically appropriate.","confidence":0.93}

--- ACTUAL CASE ---
Diagnosis: ${diagnosis}
Treatment/Medicines: ${treatment}
Tests Prescribed: ${tests.join(', ') || 'None'}

Return only valid JSON.`;

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a senior medical reviewer AI for an insurance company. Use standard clinical guidelines to assess medical necessity. Return only valid JSON with no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
      });

      const content = response.choices[0].message.content || '{}';
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleaned);
      return {
        isNecessary: result.isNecessary !== undefined ? result.isNecessary : true,
        reasoning: result.reasoning || 'Treatment appears medically appropriate',
        confidence: result.confidence || 0.85
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        isNecessary: true,
        reasoning: 'Unable to fully assess, defaulting to approval pending review',
        confidence: 0.6
      };
    }
  }

  /**
   * Fallback extraction for prescription when AI fails
   */
  private fallbackPrescriptionExtraction(text: string): PrescriptionData {
    const data: PrescriptionData = {};
    
    // Simple regex-based extraction
    const drNameMatch = text.match(/Dr\.?\s+([A-Za-z\s]+)/i);
    if (drNameMatch) data.doctor_name = drNameMatch[1].trim();
    
    const regMatch = text.match(/Reg\.?\s*No\.?:?\s*([A-Z]{2}\/\d+\/\d{4})/i);
    if (regMatch) data.doctor_reg = regMatch[1];
    
    const diagnosisMatch = text.match(/Diagnosis:?\s*([^\n]+)/i);
    if (diagnosisMatch) data.diagnosis = diagnosisMatch[1].trim();
    
    return data;
  }

  /**
   * Fallback extraction for bill when AI fails
   */
  private fallbackBillExtraction(text: string): BillData {
    const data: BillData = {};
    
    // Extract amounts using regex
    const totalMatch = text.match(/Total:?\s*₹?\s*(\d+)/i);
    if (totalMatch) data.total_amount = parseFloat(totalMatch[1]);
    
    const consultMatch = text.match(/Consultation\s*(?:Fee)?:?\s*₹?\s*(\d+)/i);
    if (consultMatch) data.consultation_fee = parseFloat(consultMatch[1]);
    
    return data;
  }
}

export default new AIService();
