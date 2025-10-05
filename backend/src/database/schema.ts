import { pgTable, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  buyerNameTamil: text('buyer_name_tamil').notNull(),
  buyerNameEnglish: text('buyer_name_english').notNull(),
  sellerNameTamil: text('seller_name_tamil').notNull(),
  sellerNameEnglish: text('seller_name_english').notNull(),
  houseNumber: varchar('house_number', { length: 50 }),
  surveyNumber: varchar('survey_number', { length: 50 }).notNull(),
  documentNumber: varchar('document_number', { length: 100 }).notNull(),
  transactionDate: timestamp('transaction_date').notNull(),
  transactionValue: integer('transaction_value'),
  district: varchar('district', { length: 100 }),
  rawTextTamil: text('raw_text_tamil'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;