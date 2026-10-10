'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.newPassword.length < 8) {
            setError('New password must be at least 8 characters');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/settings/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to change password');
                return;
            }

            setSuccess('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Lock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
                            <p className="text-sm text-gray-600">Update your account security</p>
                        </div>
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

                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Current Password
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                required
                                value={formData.currentPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, currentPassword: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, newPassword: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Minimum 8 characters"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Re-enter new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            <strong>Security Tips:</strong> Use a strong password with a mix of
                            letters, numbers, and symbols. Never share your password with anyone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
