'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, User, Activity, Pill, AlertCircle, TestTube, Share2, Download, Clock } from 'lucide-react'

interface PatientInfo {
    name: string
    aadhaarLast4: string
    lastUpdated: string
}

interface Condition {
    name: string
    since: string
    status: string
    sourceText?: string
}

interface Medication {
    name: string
    genericName?: string
    dose: string
    indication: string
    prescriber: string
    startDate: string
    status: string
}

interface Allergy {
    substance: string
    reaction: string
    severity: string
    documented: string
}

interface LabResult {
    name: string
    value: string
    reference: string
    date: string
    labName?: string
}

export default function SummaryPage() {
    const [patient, setPatient] = useState<PatientInfo | null>(null)
    const [conditions, setConditions] = useState<Condition[]>([])
    const [medications, setMedications] = useState<Medication[]>([])
    const [allergies, setAllergies] = useState<Allergy[]>([])
    const [labResults, setLabResults] = useState<LabResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSummary()
    }, [])

    const fetchSummary = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/summary')

            if (!response.ok) {
                throw new Error('Failed to load summary')
            }

            const data = await response.json()
            if (data.success) {
                setPatient(data.patient)
                setConditions(data.conditions || [])
                setMedications(data.medications || [])
                setAllergies(data.allergies || [])
                setLabResults(data.labResults || [])
            } else {
                throw new Error(data.error || 'Failed to load summary')
            }
        } catch (err: any) {
            console.error('Summary fetch error:', err)
            setError(err.message || 'Failed to load summary')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading medical summary...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold mb-2">Error loading summary</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchSummary}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
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
                        <div className="flex items-center space-x-4">
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2">
                                <Download className="h-4 w-4" />
                                <span>Export PDF</span>
                            </button>
                            <Link
                                href="/share"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← Back
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Medical Summary</h1>
                            <p className="text-blue-100">Professional overview for healthcare providers</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-100">Last Updated</p>
                            <p className="text-lg font-semibold">{patient?.lastUpdated}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <User className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium text-gray-900">{patient?.name || 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Health ID (Last 4)</p>
                            <p className="font-medium text-gray-900">****{patient?.aadhaarLast4}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Record Status</p>
                            <p className="font-medium text-green-600">Patient-Verified</p>
                        </div>
                    </div>
                </div>

                {/* Active Conditions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Active Conditions</h2>
                    </div>
                    {conditions.length === 0 ? (
                        <p className="text-gray-600">No conditions recorded</p>
                    ) : (
                        <div className="space-y-3">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div>
                                        <p className="font-semibold text-gray-900">{condition.name}</p>
                                        <p className="text-sm text-gray-600">Since {condition.since}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        {condition.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Current Medications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <Pill className="h-6 w-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900">Current Medications</h2>
                    </div>
                    {medications.length === 0 ? (
                        <p className="text-gray-600">No medications recorded</p>
                    ) : (
                        <div className="space-y-4">
                            {medications.map((medication, index) => (
                                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-lg">{medication.name}</p>
                                            {medication.genericName && (
                                                <p className="text-sm text-purple-600">({medication.genericName})</p>
                                            )}
                                            {medication.dose && (
                                                <p className="text-purple-700 font-medium">{medication.dose}</p>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                                            {medication.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-600">Indication:</p>
                                            <p className="text-gray-900 font-medium">{medication.indication}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Prescriber:</p>
                                            <p className="text-gray-900 font-medium">{medication.prescriber}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Started:</p>
                                            <p className="text-gray-900 font-medium">{medication.startDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <h2 className="text-xl font-bold text-gray-900">Known Allergies</h2>
                    </div>
                    {allergies.length === 0 ? (
                        <p className="text-gray-600">No allergies recorded</p>
                    ) : (
                        <div className="space-y-3">
                            {allergies.map((allergy, index) => (
                                <div key={index} className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="font-bold text-red-900 text-lg">{allergy.substance}</p>
                                            <p className="text-red-700 font-medium">Reaction: {allergy.reaction}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full">
                                            {allergy.severity} Severity
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Documented: {allergy.documented}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Lab Results */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <TestTube className="h-6 w-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">Recent Lab Results</h2>
                    </div>
                    {labResults.length === 0 ? (
                        <p className="text-gray-600">No lab results recorded</p>
                    ) : (
                        <div className="space-y-4">
                            {labResults.map((result, index) => (
                                <div key={index} className="p-4 rounded-lg border bg-green-50 border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{result.name}</p>
                                            <p className="text-lg font-bold text-gray-900 my-1">{result.value}</p>
                                            <p className="text-sm text-gray-600">Reference: {result.reference}</p>
                                            <p className="text-xs text-gray-500 mt-1">{result.date}</p>
                                            {result.labName && (
                                                <p className="text-xs text-gray-500">Lab: {result.labName}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
                    <p className="text-sm text-yellow-800">
                        This summary is based on patient-provided and patient-verified information from uploaded documents.
                        Healthcare providers should confirm all information with the patient and original source documents before making clinical decisions.
                        All data is encrypted and stored securely in compliance with healthcare data protection standards.
                    </p>
                </div>
            </main>
        </div>
    )
}
