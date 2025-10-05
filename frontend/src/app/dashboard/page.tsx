
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadForm from '@/components/UploadForm';
import ResultsTable from '@/components/ResultsTable';
import PDFPreview from '@/components/PDFPreview';
import { Transaction } from '@/lib/api';
import { LogOut, FileText } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('authenticated')) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    router.push('/');
  };

  const handleUploadSuccess = (results: Transaction[], file: File) => {
    setTransactions(results);
    setPdfFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tamil Real Estate System</h1>
              <p className="text-sm text-gray-600">Transaction Management Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <UploadForm onSuccess={handleUploadSuccess} setLoading={setLoading} />
        </div>

        {/* Results Section */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Results Table */}
            <div className="lg:col-span-1">
              <ResultsTable transactions={transactions} loading={loading} />
            </div>

            {/* PDF Preview */}
            <div className="lg:col-span-1">
              <PDFPreview file={pdfFile} />
            </div>
          </div>
        )}

        {transactions.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
            <p className="text-gray-600">Upload a PDF to extract and view transactions</p>
          </div>
        )}
      </main>
    </div>
  );
}