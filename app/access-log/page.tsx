'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AccessLogEntry {
    id: string;
    role: string;
    actor_name: string | null;
    outcome: string;
    accessed_at: string;
}

export default function AccessLogPage() {
    const [logs, setLogs] = useState<AccessLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAccessLog();
    }, []);

    const loadAccessLog = async () => {
        try {
            const response = await fetch('/api/access-log');

            if (!response.ok) {
                throw new Error('Failed to load access log');
            }

            const data = await response.json();
            setLogs(data.logs);
        } catch (err) {
            setError('Failed to load access log');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading access log...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Access Log</h1>
                                <p className="text-sm text-gray-600">
                                    Track all access attempts to your medical records
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {logs.length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No access logs yet</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    All login attempts will be recorded here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            {log.outcome === 'success' ? (
                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                            ) : (
                                                <XCircle className="h-6 w-6 text-red-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-gray-900">
                                                    {log.role === 'doctor'
                                                        ? `Doctor Access${log.actor_name ? `: Dr. ${log.actor_name}` : ''}`
                                                        : 'Patient Login'}
                                                </p>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded ${log.outcome === 'success'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {log.outcome}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(log.accessed_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                        <p className="text-xs text-gray-500">
                            <strong>Note:</strong> All access to your medical records is logged for
                            security and audit purposes. If you notice any suspicious activity,
                            please contact support immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
