
'use client';

import { Transaction } from '@/lib/api';
import { Loader2, CheckCircle } from 'lucide-react';

interface ResultsTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function ResultsTable({ transactions, loading }: ResultsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
        <span className="text-gray-700">Processing PDF...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-green-50 border-b border-green-200 flex items-center">
        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-green-900">
          Extracted Transactions ({transactions.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Seller</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Survey No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Doc No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{txn.buyerNameEnglish}</div>
                  <div className="text-xs text-gray-500">{txn.buyerNameTamil}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{txn.sellerNameEnglish}</div>
                  <div className="text-xs text-gray-500">{txn.sellerNameTamil}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{txn.surveyNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{txn.documentNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(txn.transactionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {txn.transactionValue ? `₹${txn.transactionValue.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// src/components/PDFPreview.tsx
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { FileText, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFPreviewProps {
  file: File | null;
}

export default function PDFPreview({ file }: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file || !pdfUrl) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center h-96">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500">PDF preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-2 hover:bg-gray-200 rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 hover:bg-gray-200 rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-auto h-96">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          title="PDF Preview"
        />
      </div>
    </div>
  );
}