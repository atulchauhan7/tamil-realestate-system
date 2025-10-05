
'use client';

import { useState } from 'react';
import { Upload, Filter, X } from 'lucide-react';
import { uploadPDF, Transaction } from '@/lib/api';

interface UploadFormProps {
  onSuccess: (transactions: Transaction[], file: File) => void;
  setLoading: (loading: boolean) => void;
}

export default function UploadForm({ onSuccess, setLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    buyerName: '',
    sellerName: '',
    houseNumber: '',
    surveyNumber: '',
    documentNumber: '',
  });
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await uploadPDF(file, filters);
      onSuccess(response.transactions, file);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload PDF Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tamil PDF Document
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <Upload className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {file ? file.name : 'Choose PDF file...'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buyer Name
              </label>
              <input
                type="text"
                value={filters.buyerName}
                onChange={(e) => setFilters({ ...filters, buyerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Search by buyer..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seller Name
              </label>
              <input
                type="text"
                value={filters.sellerName}
                onChange={(e) => setFilters({ ...filters, sellerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Search by seller..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                House Number
              </label>
              <input
                type="text"
                value={filters.houseNumber}
                onChange={(e) => setFilters({ ...filters, houseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="House no..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Survey Number
              </label>
              <input
                type="text"
                value={filters.surveyNumber}
                onChange={(e) => setFilters({ ...filters, surveyNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Survey no..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Document Number
              </label>
              <input
                type="text"
                value={filters.documentNumber}
                onChange={(e) => setFilters({ ...filters, documentNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Document no..."
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Process & Extract Transactions
        </button>
      </form>
    </div>
  );
}
