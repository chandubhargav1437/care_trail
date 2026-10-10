'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Check, X, AlertTriangle, Save, ArrowLeft, Edit2 } from 'lucide-react';

interface Document {
    id: string;
    document_type: string | null;
    provider_name: string | null;
    document_date: string | null;
    extraction_json: any;
}

export default function ReviewPage() {
    const router = useRouter();
    const [document, setDocument] = useState<Document | null>(null);
    const [extraction, setExtraction] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get document ID from URL or sessionStorage
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const documentId = urlParams.get('id') || sessionStorage.getItem('pendingDocumentId');

            if (!documentId) {
                router.push('/upload');
                return;
            }

            loadDocument(documentId);
        }
    }, [router]);

    const loadDocument = async (documentId: string) => {
        try {
            const response = await fetch(`/api/documents/${documentId}`);

            if (!response.ok) {
                throw new Error('Failed to load document');
            }

            const data = await response.json();
            setDocument(data.document);
            setExtraction(data.document.extraction_json);
        } catch (err) {
            console.error('Load document error:', err);
            setError('Failed to load document');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (section: string, index: number, field: string, value: any) => {
        setExtraction((prev: any) => {
            const newExtraction = { ...prev };
            newExtraction[section][index][field] = value;
            return newExtraction;
        });
    };

    const handleRemoveItem = (section: string, index: number) => {
        setExtraction((prev: any) => {
            const newExtraction = { ...prev };
            newExtraction[section] = newExtraction[section].filter((_: any, i: number) => i !== index);
            return newExtraction;
        });
    };

    const handleSave = async () => {
        if (!document || !extraction) return;

        setSaving(true);
        setError('');

        try {
            const response = await fetch(`/api/documents/${document.id}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ extraction }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to confirm document');
            }

            // Redirect to timeline
            router.push('/timeline');
        } catch (err) {
            console.error('Save error:', err);
            setError(err instanceof Error ? err.message : 'Failed to save document');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading document...</p>
                </div>
            </div>
        );
    }

    if (error && !extraction) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link href="/upload" className="text-blue-600 hover:text-blue-700">
                        Return to Upload
                    </Link>
                </div>
            </div>
        );
    }

    const hasData =
        (extraction?.conditions && extraction.conditions.length > 0) ||
        (extraction?.medications && extraction.medications.length > 0) ||
        (extraction?.allergies && extraction.allergies.length > 0) ||
        (extraction?.lab_results && extraction.lab_results.length > 0);

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

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Extracted Information</h1>
                            <p className="text-gray-600">
                                Review and edit the information extracted from your document before saving it to your timeline.
                            </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>

                    {/* Document Metadata */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Document Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700 font-medium">Type:</span>
                                <span className="text-blue-900 ml-2">{extraction?.document_type || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Date:</span>
                                <span className="text-blue-900 ml-2">{extraction?.document_date || 'Not specified'}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-blue-700 font-medium">Provider:</span>
                                <span className="text-blue-900 ml-2">{extraction?.provider_name || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {!hasData && (
                        <div className="text-center py-8">
                            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">
                                No medical information was extracted from this document.
                            </p>
                            <p className="text-sm text-gray-500">
                                You can still save the document or try uploading a different file.
                            </p>
                        </div>
                    )}

                    {/* Conditions */}
                    {extraction?.conditions && extraction.conditions.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                Conditions ({extraction.conditions.length})
                            </h3>
                            <div className="space-y-3">
                                {extraction.conditions.map((condition: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <input
                                                type="text"
                                                value={condition.name}
                                                onChange={(e) => handleFieldChange('conditions', index, 'name', e.target.value)}
                                                className="flex-1 font-medium text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent px-1 outline-none"
                                            />
                                            <button
                                                onClick={() => handleRemoveItem('conditions', index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        {condition.source_text && (
                                            <p className="text-xs text-gray-500 italic">Source: {condition.source_text}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Medications */}
                    {extraction?.medications && extraction.medications.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-purple-600" />
                                Medications ({extraction.medications.length})
                            </h3>
                            <div className="space-y-3">
                                {extraction.medications.map((medication: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <input
                                                type="text"
                                                value={medication.name}
                                                onChange={(e) => handleFieldChange('medications', index, 'name', e.target.value)}
                                                className="flex-1 font-medium text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent px-1 outline-none"
                                            />
                                            <button
                                                onClick={() => handleRemoveItem('medications', index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                            <div>Dose: {medication.dose || 'N/A'}</div>
                                            <div>Frequency: {medication.frequency || 'N/A'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Allergies */}
                    {extraction?.allergies && extraction.allergies.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                Allergies ({extraction.allergies.length})
                            </h3>
                            <div className="space-y-3">
                                {extraction.allergies.map((allergy: any, index: number) => (
                                    <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <input
                                                type="text"
                                                value={allergy.substance}
                                                onChange={(e) => handleFieldChange('allergies', index, 'substance', e.target.value)}
                                                className="flex-1 font-medium text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent px-1 outline-none"
                                            />
                                            <button
                                                onClick={() => handleRemoveItem('allergies', index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2">
                                            Reaction: {allergy.reaction || 'Not specified'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lab Results */}
                    {extraction?.lab_results && extraction.lab_results.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Lab Results ({extraction.lab_results.length})
                            </h3>
                            <div className="space-y-3">
                                {extraction.lab_results.map((result: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <input
                                                type="text"
                                                value={result.test_name}
                                                onChange={(e) => handleFieldChange('lab_results', index, 'test_name', e.target.value)}
                                                className="flex-1 font-medium text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent px-1 outline-none"
                                            />
                                            <button
                                                onClick={() => handleRemoveItem('lab_results', index)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                                            <div>Value: {result.value || 'N/A'}</div>
                                            <div>Unit: {result.unit || 'N/A'}</div>
                                            <div>Range: {result.reference_range || 'N/A'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t">
                        <button
                            onClick={() => router.push('/upload')}
                            disabled={saving}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <X className="h-5 w-5 inline mr-2" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="h-5 w-5 inline mr-2" />
                                    Confirm & Save to Timeline
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
