-- CareTrail Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Patients table with Aadhaar-based authentication
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    aadhaar_hmac TEXT UNIQUE NOT NULL,
    aadhaar_last4 TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    document_type TEXT,
    provider_name TEXT,
    document_date DATE,
    extraction_json JSONB,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conditions table
CREATE TABLE conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    recorded_date DATE,
    status TEXT,
    source_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    generic_name TEXT,
    dose TEXT,
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    prescriber TEXT,
    status TEXT,
    source_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allergies table
CREATE TABLE allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    substance TEXT NOT NULL,
    reaction TEXT,
    severity TEXT,
    source_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab Results table
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    test_name TEXT NOT NULL,
    value NUMERIC,
    unit TEXT,
    reference_range TEXT,
    recorded_date DATE,
    lab_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Log table for tracking doctor access
CREATE TABLE access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
    actor_name TEXT,
    outcome TEXT NOT NULL,
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_documents_document_date ON documents(document_date);
CREATE INDEX idx_documents_confirmed ON documents(confirmed_at) WHERE confirmed_at IS NOT NULL;

CREATE INDEX idx_conditions_patient_id ON conditions(patient_id);
CREATE INDEX idx_conditions_recorded_date ON conditions(recorded_date);

CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_medications_start_date ON medications(start_date);

CREATE INDEX idx_allergies_patient_id ON allergies(patient_id);

CREATE INDEX idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX idx_lab_results_recorded_date ON lab_results(recorded_date);
CREATE INDEX idx_lab_results_test_name ON lab_results(test_name, recorded_date);

CREATE INDEX idx_access_log_patient_id ON access_log(patient_id);
CREATE INDEX idx_access_log_accessed_at ON access_log(accessed_at);

CREATE INDEX idx_patients_aadhaar_hmac ON patients(aadhaar_hmac);

-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (deny all for anon, service role bypasses RLS)
-- These policies deny all access by default
-- All access happens through service role in server code

-- Storage bucket setup (create manually in Supabase Dashboard)
-- 1. Go to Storage section
-- 2. Create new bucket named "documents"
-- 3. Set to PRIVATE (not public)
-- 4. No RLS policies needed (accessed via service role)

-- Verification queries
-- SELECT COUNT(*) FROM patients;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
