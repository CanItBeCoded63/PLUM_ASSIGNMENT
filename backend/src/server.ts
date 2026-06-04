import dotenv from 'dotenv';
// Load environment variables immediately before other imports
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import claimRoutes from './routes/claimRoutes';
import './config/database'; // Initialize database

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required directories exist (important for Railway / cloud deployments)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'OPD Claim Adjudication System'
  });
});

// API routes
app.use('/api', claimRoutes);

// Serve static files from the React frontend app
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// For any other request, send back index.html (supports SPA routing)
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  OPD Claim Adjudication System - Backend     ║
║  Server running on port ${PORT}                 ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
╚═══════════════════════════════════════════════╝
  `);
  console.log(`API Documentation: http://localhost:${PORT}/health`);
});

export default app;
