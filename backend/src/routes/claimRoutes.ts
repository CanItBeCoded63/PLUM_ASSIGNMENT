import express from 'express';
import multer from 'multer';
import path from 'path';
import claimController from '../controllers/claimController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|txt|plain/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/plain';

    if (extname && (mimetype || path.extname(file.originalname).toLowerCase() === '.txt')) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and TXT files are allowed'));
    }
  }
});

// Routes
router.post('/claims', upload.array('documents', 5), claimController.submitClaim.bind(claimController));
router.get('/claims', claimController.getAllClaims.bind(claimController));
router.get('/claims/:id', claimController.getClaim.bind(claimController));
router.put('/claims/:id/appeal', claimController.appealClaim.bind(claimController));
router.put('/claims/:id/adjudicate', claimController.manualAdjudicateClaim.bind(claimController));
router.get('/members', claimController.getAllMembers.bind(claimController));
router.get('/members/:member_id', claimController.getMember.bind(claimController));
router.get('/metrics', claimController.getMetrics.bind(claimController));
router.get('/admin/policy', claimController.getPolicy.bind(claimController));

export default router;
