'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Share2, Clock, Shield, Copy, Check, X, Eye } from 'lucide-react'
import { generateSecureToken, hashToken } from '@/lib/utils'
import { useApp } from '@/lib/AppContext'
import { DEMO_PATIENT_ID } from '@/lib/supabase-client'

export default function SharePage() {
    const { shareLinks, addShareLink, revokeShareLink } = useApp()
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [label, setLabel] = useState('')
    const [scopes, setScopes] = useState<string[]>([])
    const [expiryHours, setExpiryHours] = useState('24')
    const [creating, setCreating] = useState(false)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const availableScopes = [
        { value: 'conditions', label: 'Conditions' },
        { value: 'medications', label: 'Medications' },
        { value: 'allergies', label: 'Allergies' },
        { value: 'lab_results', label: 'Lab Results' },
    ]

    const toggleScope = (scope: string) => {
        setScopes(prev =>
            prev.includes(scope)
                ? prev.filter(s => s !== scope)
                : [...prev, scope]
        )
    }

    const handleCreate = async () => {
        if (!label || scopes.length === 0) return

        setCreating(true)

        try {
            const token = generateSecureToken()
            const tokenHash = await hashToken(token)
            const now = new Date()
            const expiresAt = new Date(now.getTime() + parseInt(expiryHours) * 60 * 60 * 1000)

            addShareLink({
                patient_id: DEMO_PATIENT_ID,
                token,
                token_hash: tokenHash,
                label,
                scopes,
                expires_at: expiresAt.toISOString(),
                revoked_at: null,
                access_count: 0,
            })

            setLabel('')
            setScopes([])
            setExpiryHours('24')
            setShowCreateForm(false)
        } catch (error) {
            console.error('Error creating share link:', error)
        } finally {
            setCreating(false)
        }
    }

    const handleCopyLink = (token: string) => {
        const shareUrl = `${window.location.origin}/s/${token}`
        navigator.clipboard.writeText(shareUrl)
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 2000)
    }

    const handleRevoke = (id: string) => {
        if (confirm('Are you sure you want to revoke this sharing link? It will no longer be accessible.')) {
            revokeShareLink(id)
        }
    }

    const getTimeRemaining = (expiresAt: string) => {
        const now = new Date()
        const expiry = new Date(expiresAt)
        const diff = expiry.getTime() - now.getTime()

        if (diff < 0) return 'Expired'

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) return `${hours}h ${minutes}m remaining`
        return `${minutes}m remaining`
    }

    const activeLinks = shareLinks.filter(link => !link.revoked_at && new Date(link.expires_at) > new Date())
    const revokedLinks = shareLinks.filter(link => link.revoked_at || new Date(link.expires_at) <= new Date())

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
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Records</h1>
                        <p className="text-gray-600">
                            Create secure, time-limited links to share your health information
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Share2 className="h-5 w-5" />
                        <span>Create Link</span>
                    </button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-300 p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Create Sharing Link</h2>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link Label
                                </label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g., Dr. Smith - Follow-up Visit"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    What to Share (Select at least one)
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableScopes.map(scope => (
                                        <button
                                            key={scope.value}
                                            onClick={() => toggleScope(scope.value)}
                                            className={`px-4 py-3 rounded-lg border-2 transition-all ${scopes.includes(scope.value)
                                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${scopes.includes(scope.value)
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {scopes.includes(scope.value) && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="font-medium">{scope.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link Expires In
                                </label>
                                <select
                                    value={expiryHours}
                                    onChange={(e) => setExpiryHours(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="1">1 hour</option>
                                    <option value="6">6 hours</option>
                                    <option value="24">24 hours</option>
                                    <option value="72">3 days</option>
                                    <option value="168">1 week</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleCreate}
                                    disabled={creating || !label || scopes.length === 0}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="h-5 w-5" />
                                            <span>Create Secure Link</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Links */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Active Sharing Links</h2>

                    {activeLinks.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Links</h3>
                            <p className="text-gray-600 mb-4">
                                Create a secure link to share your medical information with healthcare providers
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create First Link
                            </button>
                        </div>
                    ) : (
                        activeLinks.map(link => (
                            <div key={link.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{link.label}</h3>
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {getTimeRemaining(link.expires_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-gray-600 mb-2">Sharing Link:</p>
                                    <div className="flex items-center space-x-2">
                                        <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-300 overflow-x-auto">
                                            {`${window.location.origin}/s/${link.token}`}
                                        </code>
                                        <button
                                            onClick={() => handleCopyLink(link.token)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            {copiedToken === link.token ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Sharing:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {link.scopes.map(scope => (
                                                <span
                                                    key={scope}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                                                >
                                                    {scope.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">
                                            <Eye className="h-4 w-4 inline mr-1" />
                                            {link.access_count} views
                                        </span>
                                        <button
                                            onClick={() => handleRevoke(link.id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Revoked Links */}
                {revokedLinks.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Revoked / Expired Links</h2>
                        <div className="space-y-4">
                            {revokedLinks.map(link => (
                                <div key={link.id} className="bg-gray-100 rounded-lg border border-gray-300 p-4 opacity-75">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-700">{link.label}</h3>
                                            <p className="text-sm text-gray-600">
                                                {link.revoked_at ? 'Revoked' : 'Expired'} - No longer accessible
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm font-medium rounded-full">
                                            {link.revoked_at ? 'Revoked' : 'Expired'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">How Sharing Works</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">•</span>
                            <span>Links are cryptographically secure and cannot be guessed</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">•</span>
                            <span>Recipients can only view the information categories you select</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">•</span>
                            <span>Links automatically expire after the time period you set</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">•</span>
                            <span>You can revoke access at any time, immediately blocking future access</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">•</span>
                            <span>All access attempts are logged for your review</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    )
}
