import { Injectable } from '@nestjs/common';
import { db } from '../database/db';
import { transactions, Transaction, NewTransaction } from '../database/schema';
import { eq, and, like, or } from 'drizzle-orm';
import { PdfParserService } from '../services/pdf-parser.service';
import { TranslationService } from '../services/translation.service';

export interface FilterParams {
  buyerName?: string;
  sellerName?: string;
  houseNumber?: string;
  surveyNumber?: string;
  documentNumber?: string;
}

@Injectable()
export class TransactionsService {
  constructor(
    private pdfParser: PdfParserService,
    private translator: TranslationService,
  ) {}

  async processUpload(
    file: Express.Multer.File,
    filters?: FilterParams,
  ): Promise<Transaction[]> {
    // 1. Parse PDF
    const parsedTransactions = await this.pdfParser.parsePDF(file.buffer);

    // 2. Translate Tamil fields to English
    const translatedTransactions = await this.translateTransactions(parsedTransactions);

    // 3. Apply filters
    const filteredTransactions = this.applyFilters(translatedTransactions, filters);

    // 4. Insert into database
    const insertedRecords = await this.insertTransactions(filteredTransactions);

    return insertedRecords;
  }

  private async translateTransactions(parsed: any[]): Promise<NewTransaction[]> {
    const translated: NewTransaction[] = [];

    for (const txn of parsed) {
      const [buyerEn, sellerEn] = await this.translator.translateBatch([
        txn.buyerNameTamil,
        txn.sellerNameTamil,
      ]);

      translated.push({
        ...txn,
        buyerNameEnglish: buyerEn,
        sellerNameEnglish: sellerEn,
      });
    }

    return translated;
  }

  private applyFilters(
    transactions: NewTransaction[],
    filters?: FilterParams,
  ): NewTransaction[] {
    if (!filters) return transactions;

    return transactions.filter(txn => {
      if (filters.buyerName && !txn.buyerNameEnglish.toLowerCase().includes(filters.buyerName.toLowerCase())) {
        return false;
      }
      if (filters.sellerName && !txn.sellerNameEnglish.toLowerCase().includes(filters.sellerName.toLowerCase())) {
        return false;
      }
      if (filters.houseNumber && txn.houseNumber !== filters.houseNumber) {
        return false;
      }
      if (filters.surveyNumber && txn.surveyNumber !== filters.surveyNumber) {
        return false;
      }
      if (filters.documentNumber && txn.documentNumber !== filters.documentNumber) {
        return false;
      }
      return true;
    });
  }

  private async insertTransactions(txns: NewTransaction[]): Promise<Transaction[]> {
    if (txns.length === 0) return [];
    
    const inserted = await db.insert(transactions).values(txns).returning();
    return inserted;
  }

  async searchTransactions(filters: FilterParams): Promise<Transaction[]> {
    const conditions = [];

    if (filters.buyerName) {
      conditions.push(like(transactions.buyerNameEnglish, `%${filters.buyerName}%`));
    }
    if (filters.sellerName) {
      conditions.push(like(transactions.sellerNameEnglish, `%${filters.sellerName}%`));
    }
    if (filters.houseNumber) {
      conditions.push(eq(transactions.houseNumber, filters.houseNumber));
    }
    if (filters.surveyNumber) {
      conditions.push(eq(transactions.surveyNumber, filters.surveyNumber));
    }
    if (filters.documentNumber) {
      conditions.push(eq(transactions.documentNumber, filters.documentNumber));
    }

    if (conditions.length === 0) {
      return db.select().from(transactions).limit(100);
    }

    return db.select().from(transactions).where(and(...conditions));
  }
}