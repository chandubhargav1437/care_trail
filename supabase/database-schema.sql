-- CareTrail Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Share Links table
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  scopes TEXT[] NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Log table
CREATE TABLE access_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_link_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  outcome TEXT NOT NULL
);

-- Create indexes
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_documents_document_date ON documents(document_date);
CREATE INDEX idx_conditions_patient_id ON conditions(patient_id);
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_allergies_patient_id ON allergies(patient_id);
CREATE INDEX idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX idx_share_links_patient_id ON share_links(patient_id);
CREATE INDEX idx_share_links_token_hash ON share_links(token_hash);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_log ENABLE ROW LEVEL SECURITY;

-- Patients policies
CREATE POLICY "Users can view their own patient record"
  ON patients FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own patient record"
  ON patients FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own patient record"
  ON patients FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Documents policies
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Conditions policies
CREATE POLICY "Users can view their own conditions"
  ON conditions FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own conditions"
  ON conditions FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own conditions"
  ON conditions FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own conditions"
  ON conditions FOR DELETE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Medications policies
CREATE POLICY "Users can view their own medications"
  ON medications FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Allergies policies
CREATE POLICY "Users can view their own allergies"
  ON allergies FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own allergies"
  ON allergies FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own allergies"
  ON allergies FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own allergies"
  ON allergies FOR DELETE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Lab Results policies
CREATE POLICY "Users can view their own lab results"
  ON lab_results FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own lab results"
  ON lab_results FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own lab results"
  ON lab_results FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own lab results"
  ON lab_results FOR DELETE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Share Links policies
CREATE POLICY "Users can view their own share links"
  ON share_links FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own share links"
  ON share_links FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own share links"
  ON share_links FOR UPDATE
  USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Access Log policies
CREATE POLICY "Users can view access logs for their share links"
  ON access_log FOR SELECT
  USING (share_link_id IN (
    SELECT id FROM share_links WHERE patient_id IN (
      SELECT id FROM patients WHERE auth_user_id = auth.uid()
    )
  ));
