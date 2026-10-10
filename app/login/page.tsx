'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [formData, setFormData] = useState({
        healthId: '',
        password: '',
        doctorName: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Check for registration success message from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('registered') === 'true') {
                setSuccess('Registration successful! Please sign in.');
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.healthId.length !== 12 || !/^\d+$/.test(formData.healthId)) {
            setError('Health ID must be exactly 12 digits');
            return;
        }

        if (role === 'doctor' && !formData.doctorName.trim()) {
            setError('Doctor name is required');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aadhaarNumber: formData.healthId,
                    password: formData.password,
                    role: role,
                    doctorName: role === 'doctor' ? formData.doctorName : undefined
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Login successful, redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to CareTrail</p>
                </div>

                {/* Role Toggle */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${role === 'patient'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${role === 'doctor'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {role === 'doctor' && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                            <p className="font-medium mb-1">Doctor Access</p>
                            <p className="text-xs">
                                Enter the patient's Health ID and password to view their medical records
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="healthId" className="block text-sm font-medium text-gray-700 mb-2">
                            {role === 'patient' ? 'Your Health ID' : 'Patient Health ID'} (12 digits)
                        </label>
                        <input
                            id="healthId"
                            type="text"
                            required
                            maxLength={12}
                            value={formData.healthId}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, healthId: value });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            placeholder="123456789012"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            {role === 'patient' ? 'Your Password' : 'Patient Password'}
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter password"
                        />
                    </div>

                    {role === 'doctor' && (
                        <div>
                            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name (Doctor)
                            </label>
                            <input
                                id="doctorName"
                                type="text"
                                required
                                value={formData.doctorName}
                                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dr. Smith"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {role === 'patient' && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        {role === 'doctor'
                            ? 'Doctor access requires patient authorization. All access is logged and auditable.'
                            : 'Your data is encrypted and secure. We comply with healthcare data protection standards.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
