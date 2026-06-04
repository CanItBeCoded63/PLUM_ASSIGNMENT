# OPD Claim Adjudication System

An AI-powered web application that automates the adjudication (approval/rejection) of Outpatient Department (OPD) insurance claims.

## 🚀 Features

- **Document Processing**: Upload and process medical documents (bills, prescriptions) using OCR
- **AI-Powered Extraction**: Extract structured data from documents using OpenRouter LLMs with few-shot prompting
- **Intelligent Adjudication**: Automated claim approval/rejection based on policy rules (including late submission, date mismatch, and high-value triggers)
- **Real-time Decision**: Instant adjudication results with confidence scores
- **Comprehensive Validation**: 7-step validation pipeline covering eligibility, waiting periods, coverage, limits, medical necessity, and fraud detection
- **Appeals Workflow**: Members can appeal rejected or manual review decisions directly from their dashboard
- **Admin Dashboard**: Live viewer for active policy configurations, coverage limits, waiting periods, and exclusions
- **Analytics & Metrics**: Real-time stats on total claims, approval rates, savings, and top rejection reasons
- **Decision Flowchart**: Interactive decision pipeline flowchart embedded in the UI
- **User-Friendly Interface**: Modern glassmorphic UI built with React and Tailwind CSS

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js + Express + TypeScript
- SQLite database
- OpenAI GPT-4 for document processing
- Tesseract.js for OCR
- pdf-parse for PDF extraction

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Claim Form  │  │ Result Card  │  │  Claims List    │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend API (Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Claim Controller                           │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                  │                  │            │
│           ▼                  ▼                  ▼            │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Document    │  │ AI Service  │  │  Adjudication    │   │
│  │  Processor   │  │  (OpenAI)   │  │     Engine       │   │
│  └──────────────┘  └─────────────┘  └──────────────────┘   │
│           │                  │                  │            │
│           └──────────────────┴──────────────────┘            │
│                              │                               │
│                              ▼                               │
│                      ┌──────────────┐                        │
│                      │   Database   │                        │
│                      │   (SQLite)   │                        │
│                      └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
cd opd-claim-system
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📖 API Documentation

### Endpoints

#### POST /api/claims
Submit a new claim with documents

**Request:**
- Content-Type: multipart/form-data
- Body:
  - member_id: string
  - member_name: string
  - treatment_date: string (YYYY-MM-DD)
  - claim_amount: number
  - documents: File[] (images or PDFs)

**Response:**
```json
{
  "claim_id": "CLM_XXXXX",
  "decision": "APPROVED|REJECTED|PARTIAL|MANUAL_REVIEW",
  "approved_amount": 0,
  "rejection_reasons": [],
  "confidence_score": 0.95,
  "notes": "...",
  "next_steps": "...",
  "extracted_data": {}
}
```

#### GET /api/claims
Get all claims or filter by member

**Query Parameters:**
- member_id (optional): Filter claims by member

#### GET /api/claims/:id
Get specific claim details

#### GET /api/members
Get all members

#### GET /api/members/:member_id
Get specific member details

## 🔍 Adjudication Logic

The system follows a 6-step adjudication process:

### Step 1: Basic Eligibility Check
- Policy status verification
- Waiting period validation
- Member verification

### Step 2: Document Validation
- Legibility check
- Completeness verification
- Doctor registration validation
- Date consistency

### Step 3: Coverage Verification
- Service coverage check
- Exclusions verification
- Pre-authorization requirements

### Step 4: Limit Validation
- Annual limit check
- Per-claim limit
- Sub-limit verification
- Minimum claim amount

### Step 5: Medical Necessity Review
- AI-powered diagnosis validation
- Treatment appropriateness
- Test necessity verification

### Step 6: Fraud Detection
- Multiple claims pattern
- Unusual frequency detection
- High-value claim flagging

## 🧪 Test Cases

The system includes 10 comprehensive test cases covering:

1. ✅ Simple consultation - Approved
2. ⚠️ Dental treatment - Partial approval
3. ❌ Limit exceeded - Rejected
4. ❌ Missing documents - Rejected
5. ❌ Waiting period not met - Rejected
6. ✅ Alternative medicine - Approved
7. ❌ Pre-authorization missing - Rejected
8. 🔍 Fraud detection - Manual review
9. ❌ Excluded treatment - Rejected
10. ✅ Network hospital - Cashless approved

## 📊 Decision Types

| Decision | Description |
|----------|-------------|
| **APPROVED** | Claim fully approved with all conditions met |
| **REJECTED** | Claim rejected due to policy violations |
| **PARTIAL** | Partial approval when some items are covered |
| **MANUAL_REVIEW** | Flagged for human review (fraud concerns, low confidence) |

## 🎯 Key Features Implementation

### AI Integration
- **Document Extraction**: GPT-4 extracts structured data from unstructured text
- **Medical Necessity**: AI analyzes if treatment is medically necessary
- **Confidence Scoring**: Every decision includes a confidence score

### Rule Engine
- Policy-based validation
- Configurable limits and exclusions
- Hierarchical rule application
- Priority-based decision making

### User Experience
- Drag-and-drop file upload
- Real-time processing feedback
- Clear decision explanations
- Detailed claim history

## 🔐 Security Considerations

- File type validation
- File size limits (10MB per file)
- SQL injection prevention using prepared statements
- CORS configuration
- Input validation using TypeScript types

## 📈 Future Enhancements

1. **Authentication & Authorization**
   - User login/registration with Multi-Factor Authentication (MFA)
   - Role-Based Access Control (RBAC) separating members from claims adjusters
   - Multi-tenant support for multiple corporate policyholders

2. **Advanced UI & Integrations**
   - Interactive policy limits editing UI for administrators
   - Batch claims uploading and processing
   - Automated email & WhatsApp status notifications for members

3. **AI & OCR Scaling**
   - Fine-tuned models for specialised clinical term extraction
   - RAG (Retrieval Augmented Generation) for medical protocol validation
   - Multi-language translation & parsing support for regional language bills
   - OCR handwriting extraction for handwritten doctor scripts

## 📝 Assumptions Made

1. All members are pre-registered in the system
2. Documents are in English
3. Doctor registration numbers follow STATE/NUMBER/YEAR format
4. Treatment dates are within the last 30 days
5. OpenAI API is available and has sufficient quota
6. Network discount applies automatically for recognized hospitals
7. Co-payment is applied only on consultation fees

## 🐛 Known Limitations

1. OCR accuracy depends on document quality
2. AI extraction may require good document formatting
3. Fraud detection is basic pattern matching
4. No real-time notification system
5. Limited to text-based documents (no image analysis)
6. No document verification against hospital databases

## 👥 Author

Created for Plum AI Automation Engineer Intern Assignment

## 📄 License

MIT License - Feel free to use this for learning purposes
#   P L U M _ A S S I G N M E N T 
 
 