import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

export interface ParsedTransaction {
  buyerNameTamil: string;
  sellerNameTamil: string;
  houseNumber?: string;
  surveyNumber: string;
  documentNumber: string;
  transactionDate: Date;
  transactionValue?: number;
  district?: string;
  rawTextTamil: string;
}

@Injectable()
export class PdfParserService {
  async parsePDF(buffer: Buffer): Promise<ParsedTransaction[]> {
    const data = await pdfParse(buffer);
    const text = data.text;

    // Split text into transaction blocks
    // This regex pattern should be adjusted based on actual PDF structure
    const transactionBlocks = this.splitIntoTransactions(text);
    
    return transactionBlocks.map(block => this.parseTransaction(block));
  }

  private splitIntoTransactions(text: string): string[] {
    // Common patterns in Tamil real estate documents:
    // - Document numbers often start with வ.எண் or ஆவணம்
    // - Dates in DD/MM/YYYY or Tamil month format
    // Split by document number pattern
    const blocks: string[] = [];
    const lines = text.split('\n');
    let currentBlock = '';

    for (const line of lines) {
      // Look for document number indicators
      if (line.match(/வ\.எண்|ஆவணம்|Document\s*No/i)) {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = line;
      } else {
        currentBlock += '\n' + line;
      }
    }
    
    if (currentBlock) blocks.push(currentBlock);
    return blocks.filter(b => b.trim().length > 0);
  }

  private parseTransaction(block: string): ParsedTransaction {
    // Extract fields using regex patterns
    // These patterns need to be adjusted based on actual PDF format
    
    const documentNumber = this.extractDocumentNumber(block);
    const surveyNumber = this.extractSurveyNumber(block);
    const buyerName = this.extractBuyerName(block);
    const sellerName = this.extractSellerName(block);
    const date = this.extractDate(block);
    const value = this.extractValue(block);
    const houseNumber = this.extractHouseNumber(block);
    const district = this.extractDistrict(block);

    return {
      buyerNameTamil: buyerName,
      sellerNameTamil: sellerName,
      houseNumber,
      surveyNumber,
      documentNumber,
      transactionDate: date,
      transactionValue: value,
      district,
      rawTextTamil: block,
    };
  }

  private extractDocumentNumber(text: string): string {
    // Pattern: வ.எண். 1234/2020 or Document No: 1234/2020
    const match = text.match(/(?:வ\.எண்\.|Document\s*No:?)\s*([0-9\/\-]+)/i);
    return match ? match[1].trim() : 'UNKNOWN';
  }

  private extractSurveyNumber(text: string): string {
    // Pattern: சர்வே எண். 123/4 or Survey No: 123/4
    const match = text.match(/(?:சர்வே\s*எண்\.|Survey\s*No:?)\s*([0-9\/\-]+)/i);
    return match ? match[1].trim() : 'UNKNOWN';
  }

  private extractBuyerName(text: string): string {
    // Pattern: வாங்குபவர்: NAME or Buyer: NAME
    const match = text.match(/(?:வாங்குபவர்|Buyer):?\s*([^\n]+)/i);
    return match ? match[1].trim() : 'UNKNOWN';
  }

  private extractSellerName(text: string): string {
    // Pattern: விற்பவர்: NAME or Seller: NAME
    const match = text.match(/(?:விற்பவர்|Seller):?\s*([^\n]+)/i);
    return match ? match[1].trim() : 'UNKNOWN';
  }

  private extractDate(text: string): Date {
    // Try DD/MM/YYYY format
    const match = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (match) {
      return new Date(`${match[3]}-${match[2]}-${match[1]}`);
    }
    return new Date(); // Default to current date if not found
  }

  private extractValue(text: string): number | undefined {
    // Pattern: ரூ. 1,00,000 or Rs. 100000
    const match = text.match(/(?:ரூ\.|Rs\.)\s*([\d,]+)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return undefined;
  }

  private extractHouseNumber(text: string): string | undefined {
    // Pattern: வீடு எண். 12 or House No: 12
    const match = text.match(/(?:வீடு\s*எண்\.|House\s*No:?)\s*([0-9\/\-A-Z]+)/i);
    return match ? match[1].trim() : undefined;
  }

  private extractDistrict(text: string): string | undefined {
    // Pattern: மாவட்டம்: NAME or District: NAME
    const match = text.match(/(?:மாவட்டம்|District):?\s*([^\n]+)/i);
    return match ? match[1].trim() : undefined;
  }
}