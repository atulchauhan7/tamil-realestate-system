import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Transaction {
  id: number;
  buyerNameTamil: string;
  buyerNameEnglish: string;
  sellerNameTamil: string;
  sellerNameEnglish: string;
  houseNumber?: string;
  surveyNumber: string;
  documentNumber: string;
  transactionDate: string;
  transactionValue?: number;
  district?: string;
}

export interface UploadResponse {
  success: boolean;
  count: number;
  transactions: Transaction[];
}

export const uploadPDF = async (
  file: File,
  filters?: {
    buyerName?: string;
    sellerName?: string;
    houseNumber?: string;
    surveyNumber?: string;
    documentNumber?: string;
  }
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const params = new URLSearchParams();
  if (filters?.buyerName) params.append('buyerName', filters.buyerName);
  if (filters?.sellerName) params.append('sellerName', filters.sellerName);
  if (filters?.houseNumber) params.append('houseNumber', filters.houseNumber);
  if (filters?.surveyNumber) params.append('surveyNumber', filters.surveyNumber);
  if (filters?.documentNumber) params.append('documentNumber', filters.documentNumber);

  const response = await api.post(`/transactions/upload?${params}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const searchTransactions = async (filters: any): Promise<Transaction[]> => {
  const response = await api.get('/transactions/search', { params: filters });
  return response.data.transactions;
};