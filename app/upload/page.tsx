'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Upload, X, Check, AlertCircle, ArrowLeft } from 'lucide-react';

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
            ];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please upload a PDF or image file (JPG, PNG, WebP)');
                return;
            }

            // Validate file size (10MB max)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setProgress('Uploading file...');

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            setProgress('Processing with AI...');

            // Call extraction API
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to process document');
            }

            const data = await response.json();

            if (!data.success || !data.document_id) {
                throw new Error('Invalid response from server');
            }

            setProgress('Extraction complete!');

            // Store document ID for review page
            sessionStorage.setItem('pendingDocumentId', data.document_id);

            // Small delay to show success message
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Navigate to review page with document ID
            router.push(`/review?id=${data.document_id}`);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to process document');
            setUploading(false);
            setProgress('');
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        setProgress('');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">CareTrail</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Medical Document</h1>
                        <p className="text-gray-600">
                            Upload a prescription, lab report, or medical document. AI will extract the
                            information for you to review.
                        </p>
                    </div>

                    {/* Upload Area */}
                    {!file ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">
                                Drop your document here, or click to browse
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                PDF, JPG, PNG, or WebP files up to 10MB
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-10 w-10 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                {!uploading && (
                                    <button
                                        onClick={removeFile}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                )}
                            </div>

                            {uploading && progress && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                        <span className="text-sm font-medium">{progress}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {!uploading && (
                                <button
                                    onClick={handleUpload}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="h-5 w-5" />
                                    Process Document with AI
                                </button>
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Upload your medical document (prescription, lab report, etc.)</li>
                            <li>AI extracts information automatically using OpenAI Vision</li>
                            <li>Review and edit the extracted information</li>
                            <li>Confirm to add to your medical timeline</li>
                        </ol>
                        <p className="text-xs text-blue-700 mt-3">
                            <strong>Privacy:</strong> Your documents are securely stored and encrypted. Only
                            you control who can access them.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
