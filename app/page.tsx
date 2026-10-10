import Link from 'next/link'
import { FileText, Clock, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CareTrail</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health History,
            <br />
            <span className="text-blue-600">Finally in One Place</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            CareTrail turns scattered prescriptions and lab reports into a patient-verified health timeline.
            Share only what matters with who matters, on your terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-blue-600"
            >
              Learn More
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            🔐 Secure cloud storage • AI-powered extraction • Free to use
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            <div className="space-y-4">
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Medical records scattered across multiple providers and formats</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Patients forget diagnoses, allergies, and current medications</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Doctors waste time gathering previous medical history</span>
              </p>
            </div>
            <div className="space-y-4">
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Sharing records is difficult, insecure, and uncontrolled</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Repeated tests due to unavailable results</span>
              </p>
              <p className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Emergency situations without accessible medical information</span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How CareTrail Helps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Assisted Extraction</h3>
              <p className="text-gray-600">
                Upload documents and let AI extract information. You review and confirm everything before it's saved.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chronological Timeline</h3>
              <p className="text-gray-600">
                See your entire health history in date order, with links to original source documents.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Sharing</h3>
              <p className="text-gray-600">
                Share selected information through time-limited, revocable links. Full access log included.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Doctor Summary</h3>
              <p className="text-gray-600">
                Concise, professional summary of your health history that doctors can quickly review.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Simple Workflow</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload & Extract</h3>
              <p className="text-blue-100">
                Upload medical documents. AI extracts information for your review.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify & Save</h3>
              <p className="text-purple-100">
                Confirm or edit extracted fields. Only confirmed data is saved.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Securely</h3>
              <p className="text-pink-100">
                Create time-limited links. Share only what's needed. Revoke anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-16">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Built for IIITDM Kancheepuram Hackathon 2026</h3>
          <p className="text-blue-800 mb-4">
            CareTrail uses enterprise-grade security with encrypted storage, Aadhaar-based authentication, and full access logging.
            This application does not diagnose conditions, prescribe treatment, or replace professional medical advice.
          </p>
          <p className="text-blue-800">
            <strong>Privacy:</strong> Your Health ID is hashed and never stored in plain text. All data is encrypted at rest and in transit.
            Only you control who can access your medical records.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Organize Your Health Records?
          </h2>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xl"
          >
            Create Your Account
          </Link>
          <p className="mt-4 text-gray-600">
            Free to use • Secure cloud storage • AI-powered extraction
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">CareTrail</span>
            </div>
            <p className="text-gray-400 mb-4">
              Hackathon Project • HealthTech Track • IIITDM Kancheepuram 2026
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, TypeScript, Tailwind CSS, and Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
