'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Upload, Clock, Share2, AlertCircle, Activity, LogOut, Settings, Eye } from 'lucide-react';

interface Stats {
    totalDocuments: number;
    conditions: number;
    medications: number;
    allergies: number;
    labResults: number;
}

interface Patient {
    name: string;
    aadhaar_last4: string;
    created_at: string;
}

interface SessionInfo {
    role: 'patient' | 'doctor';
    doctorName?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [session, setSession] = useState<SessionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard');

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to load dashboard');
            }

            const data = await response.json();
            setStats(data.stats);
            setPatient(data.patient);
            setSession(data.session);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !patient || !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">{error || 'Failed to load dashboard'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">CareTrail</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            {session?.role === 'doctor' && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm">
                                    <Eye className="h-4 w-4" />
                                    <span>Dr. {session.doctorName} (Read-Only)</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                    <p className="text-xs text-gray-500">ID: XXXX XXXX {patient.aadhaar_last4}</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {patient.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {session?.role === 'doctor' ? `Viewing ${patient.name}'s Records` : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600">
                        {session?.role === 'doctor'
                            ? 'You have read-only access to this patient\'s medical records'
                            : 'Manage your health records and timeline'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Documents</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Activity className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stats.conditions}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Conditions</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stats.medications}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Medications</h3>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stats.allergies}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Allergies</h3>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {session?.role === 'patient' && (
                            <Link
                                href="/upload"
                                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                            >
                                <Upload className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="font-medium text-gray-900">Upload Document</p>
                                    <p className="text-xs text-gray-600">Add new records</p>
                                </div>
                            </Link>
                        )}

                        <Link
                            href="/timeline"
                            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                        >
                            <Clock className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-medium text-gray-900">View Timeline</p>
                                <p className="text-xs text-gray-600">Health history</p>
                            </div>
                        </Link>

                        <Link
                            href="/summary"
                            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                        >
                            <Activity className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="font-medium text-gray-900">Medical Summary</p>
                                <p className="text-xs text-gray-600">Professional view</p>
                            </div>
                        </Link>

                        {session?.role === 'patient' && (
                            <Link
                                href="/share"
                                className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
                            >
                                <Share2 className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="font-medium text-gray-900">Share Records</p>
                                    <p className="text-xs text-gray-600">Secure sharing</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                {session?.role === 'patient' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Account Settings</h3>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Change Password</span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Access Log</h3>
                            <Link
                                href="/access-log"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <Eye className="h-4 w-4" />
                                <span>View Access History</span>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
