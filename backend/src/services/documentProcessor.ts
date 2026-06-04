import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import path from 'path';

export class DocumentProcessor {
  /**
   * Extract text from image using OCR
   */
  async extractTextFromImage(filePath: string): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(
        filePath,
        'eng',
        {
          logger: info => console.log(info.status, info.progress)
        }
      );
      return text;
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text from PDF
   */
  async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      const pdfParse = require('pdf-parse');
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Process document based on file type
   */
  async processDocument(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
      return await this.extractTextFromImage(filePath);
    } else if (ext === '.pdf') {
      return await this.extractTextFromPDF(filePath);
    } else if (ext === '.txt') {
      return await fs.readFile(filePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * Validate document quality
   */
  validateDocumentQuality(text: string): { isValid: boolean; reason?: string } {
    if (!text || text.trim().length < 50) {
      return { isValid: false, reason: 'Document is illegible or contains insufficient text' };
    }
    return { isValid: true };
  }
}

export default new DocumentProcessor();
