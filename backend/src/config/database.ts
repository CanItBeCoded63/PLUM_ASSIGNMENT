import fs from 'fs';
import path from 'path';

// Simple JSON-based database for MVP (upgrade to PostgreSQL for production)
const dbDir = path.join(__dirname, '../../data');
const dbPath = path.join(dbDir, 'claims.json');

interface Database {
  claims: any[];
  members: any[];
  claim_documents: any[];
  extracted_data: any[];
}

// Initialize database directory
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Load or create database
let database: Database = {
  claims: [],
  members: [],
  claim_documents: [],
  extracted_data: []
};

if (fs.existsSync(dbPath)) {
  const data = fs.readFileSync(dbPath, 'utf-8');
  database = JSON.parse(data);
} else {
  // Initialize with sample members
  database.members = [
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
  saveDatabase();
}

function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
}

// Simple query helpers
const db = {
  prepare: (query: string) => {
    return {
      get: (...params: any[]) => {
        if (query.includes('SELECT * FROM members WHERE member_id')) {
          return database.members.find(m => m.member_id === params[0]);
        }
        if (query.includes('SELECT * FROM claims WHERE id')) {
          return database.claims.find(c => c.id === params[0]);
        }
        if (query.includes('SELECT annual_claims_ytd FROM members')) {
          const member = database.members.find(m => m.member_id === params[0]);
          return member ? { annual_claims_ytd: member.annual_claims_ytd } : null;
        }
        if (query.includes('SELECT COUNT(*) as count FROM claims') && query.includes('treatment_date = ?')) {
          const count = database.claims.filter(c => 
            c.member_id === params[0] && c.treatment_date === params[1] && c.id !== params[2]
          ).length;
          return { count };
        }
        if (query.includes('SELECT COUNT(*) as count FROM claims') && query.includes('date(\'now\', \'-7 days\')')) {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const count = database.claims.filter(c => 
            c.member_id === params[0] && new Date(c.treatment_date) >= sevenDaysAgo
          ).length;
          return { count };
        }
        return null;
      },
      all: (...params: any[]) => {
        if (query.includes('SELECT * FROM claims') && query.includes('WHERE member_id')) {
          return database.claims.filter(c => c.member_id === params[0]);
        }
        if (query.includes('SELECT * FROM claims') && query.includes('ORDER BY created_at')) {
          return database.claims.sort((a, b) => 
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
        }
        if (query.trim() === 'SELECT * FROM claims') {
          return database.claims;
        }
        if (query.includes('SELECT * FROM members')) {
          return database.members;
        }
        if (query.includes('SELECT * FROM claim_documents')) {
          return database.claim_documents.filter(d => d.claim_id === params[0]);
        }
        if (query.includes('SELECT * FROM extracted_data')) {
          return database.extracted_data.filter(e => e.claim_id === params[0]);
        }
        return [];
      },
      run: (...params: any[]) => {
        if (query.includes('INSERT INTO claims')) {
          const claim = {
            id: params[0],
            member_id: params[1],
            member_name: params[2],
            treatment_date: params[3],
            claim_amount: params[4],
            submission_date: params[5],
            created_at: new Date().toISOString()
          };
          database.claims.push(claim);
          saveDatabase();
        } else if (query.includes('UPDATE claims')) {
          const claimId = params[params.length - 1];
          const claimIndex = database.claims.findIndex(c => c.id === claimId);
          if (claimIndex !== -1) {
            const currentClaim = database.claims[claimIndex];
            
            if (query.includes('decision = \'APPEALED\'')) {
              database.claims[claimIndex] = {
                ...currentClaim,
                decision: 'APPEALED',
                notes: params[0]
              };
            } else if (query.includes('rejection_reasons = ?') && params.length === 5) {
              database.claims[claimIndex] = {
                ...currentClaim,
                decision: params[0],
                approved_amount: params[1],
                notes: params[2],
                rejection_reasons: params[3]
              };
            } else {
              database.claims[claimIndex] = {
                ...currentClaim,
                decision: params[0],
                approved_amount: params[1],
                rejection_reasons: params[2],
                confidence_score: params[3],
                notes: params[4]
              };
            }
            saveDatabase();
          }
        } else if (query.includes('UPDATE members')) {
          const memberIndex = database.members.findIndex(m => m.member_id === params[1]);
          if (memberIndex !== -1) {
            database.members[memberIndex].annual_claims_ytd += params[0];
            saveDatabase();
          }
        } else if (query.includes('INSERT INTO claim_documents')) {
          const doc = {
            id: database.claim_documents.length + 1,
            claim_id: params[0],
            document_type: params[1],
            file_path: params[2],
            extracted_text: params[3],
            created_at: new Date().toISOString()
          };
          database.claim_documents.push(doc);
          saveDatabase();
        } else if (query.includes('INSERT INTO extracted_data')) {
          const data = {
            id: database.extracted_data.length + 1,
            claim_id: params[0],
            field_name: params[1],
            field_value: params[2],
            source_document: params[3],
            created_at: new Date().toISOString()
          };
          database.extracted_data.push(data);
          saveDatabase();
        }
        return { changes: 1 };
      }
    };
  }
};

console.log('✓ Database initialized successfully');

export default db;
