import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Admin client with service role key - bypasses RLS
export const supabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

// Database types
export interface Patient {
    id: string
    name: string
    aadhaar_hmac: string
    aadhaar_last4: string
    password_hash: string
    failed_attempts: number
    locked_until: string | null
    password_changed_at: string
    created_at: string
}

export interface Document {
    id: string
    patient_id: string
    storage_path: string
    document_type: string | null
    provider_name: string | null
    document_date: string | null
    extraction_json: any
    confirmed_at: string | null
    created_at: string
}

export interface MedicalRecord {
    id: string
    patient_id: string
    document_id: string | null
    created_at: string
}

export interface Condition extends MedicalRecord {
    name: string
    recorded_date: string | null
    status: string | null
    source_text: string | null
}

export interface Medication extends MedicalRecord {
    name: string
    generic_name: string | null
    dose: string | null
    frequency: string | null
    start_date: string | null
    end_date: string | null
    prescriber: string | null
    status: string | null
    source_text: string | null
}

export interface Allergy extends MedicalRecord {
    substance: string
    reaction: string | null
    severity: string | null
    source_text: string | null
}

export interface LabResult extends MedicalRecord {
    test_name: string
    value: number | null
    unit: string | null
    reference_range: string | null
    recorded_date: string | null
    lab_name: string | null
}

export interface AccessLog {
    id: string
    patient_id: string
    role: 'patient' | 'doctor'
    actor_name: string | null
    outcome: string
    accessed_at: string
}
