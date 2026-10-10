'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Activity, AlertCircle, Check, Pill, TestTube, Clock } from 'lucide-react'

interface TimelineItem {
    id: string
    date: string
    type: 'condition' | 'medication' | 'allergy' | 'lab_result'
    title: string
    details: string
    provider?: string
    document_id?: string
    status?: string
}

export default function TimelinePage() {
    const [timeline, setTimeline] = useState<TimelineItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        // Check for success message
        const params = new URLSearchParams(window.location.search)
        if (params.get('success') === 'true') {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        }

        // Fetch timeline data from API
        fetchTimeline()
    }, [])

    const fetchTimeline = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/timeline')

            if (!response.ok) {
                throw new Error('Failed to load timeline')
            }

            const data = await response.json()
            if (data.success) {
                setTimeline(data.timeline || [])
            } else {
                throw new Error(data.error || 'Failed to load timeline')
            }
        } catch (err: any) {
            console.error('Timeline fetch error:', err)
            setError(err.message || 'Failed to load timeline')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading timeline...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold mb-2">Error loading timeline</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchTimeline}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const getIconForType = (type: string) => {
        switch (type) {
            case 'condition':
                return <Activity className="h-5 w-5" />
            case 'medication':
                return <Pill className="h-5 w-5" />
            case 'allergy':
                return <AlertCircle className="h-5 w-5" />
            case 'lab_result':
                return <TestTube className="h-5 w-5" />
            default:
                return <FileText className="h-5 w-5" />
        }
    }

    const getColorForType = (type: string) => {
        switch (type) {
            case 'condition':
                return 'bg-blue-100 text-blue-600 border-blue-300'
            case 'medication':
                return 'bg-purple-100 text-purple-600 border-purple-300'
            case 'allergy':
                return 'bg-red-100 text-red-600 border-red-300'
            case 'lab_result':
                return 'bg-green-100 text-green-600 border-green-300'
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300'
        }
    }

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
                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
                        <div className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-900">Record Saved Successfully</h3>
                                <p className="text-sm text-green-800">
                                    Your medical information has been added to your timeline.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Timeline</h1>
                        <p className="text-gray-600">
                            {timeline.length > 0
                                ? `Your chronological medical history (${timeline.length} records)`
                                : 'No records yet. Upload your first document to get started.'}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href="/summary"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <FileText className="h-5 w-5" />
                            <span>View Summary</span>
                        </Link>
                        <Link
                            href="/upload"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add Record
                        </Link>
                    </div>
                </div>

                {timeline.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Timeline Entries Yet</h3>
                        <p className="text-gray-600 mb-6">
                            Start building your health timeline by uploading your first medical document.
                        </p>
                        <Link
                            href="/upload"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Upload First Document
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Timeline */}
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                            <div className="space-y-8">
                                {timeline.map((item) => (
                                    <div key={item.id} className="relative flex items-start space-x-6">
                                        {/* Timeline dot */}
                                        <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getColorForType(item.type)}`}>
                                            {getIconForType(item.type)}
                                        </div>

                                        {/* Content card */}
                                        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.type === 'condition' ? 'bg-blue-100 text-blue-700' :
                                                    item.type === 'medication' ? 'bg-purple-100 text-purple-700' :
                                                        item.type === 'allergy' ? 'bg-red-100 text-red-700' :
                                                            item.type === 'lab_result' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {item.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3">{item.details}</p>
                                            {item.provider && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <FileText className="h-4 w-4" />
                                                    <span>{item.provider}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Timeline Legend</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-300">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-gray-700">Condition</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center border border-purple-300">
                                        <Pill className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-gray-700">Medication</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center border border-red-300">
                                        <AlertCircle className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-gray-700">Allergy</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center border border-green-300">
                                        <TestTube className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-gray-700">Lab Result</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
