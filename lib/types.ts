export interface Patient {
    id: string
    auth_user_id: string
    display_name: string
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

export interface Condition {
    id: string
    patient_id: string
    document_id: string | null
    name: string
    recorded_date: string | null
    status: string | null
    source_text: string | null
    created_at: string
}

export interface Medication {
    id: string
    patient_id: string
    document_id: string | null
    name: string
    generic_name: string | null
    dose: string | null
    frequency: string | null
    start_date: string | null
    end_date: string | null
    prescriber: string | null
    status: string | null
    source_text: string | null
    created_at: string
}

export interface Allergy {
    id: string
    patient_id: string
    document_id: string | null
    substance: string
    reaction: string | null
    severity: string | null
    source_text: string | null
    created_at: string
}

export interface LabResult {
    id: string
    patient_id: string
    document_id: string | null
    test_name: string
    value: number | null
    unit: string | null
    reference_range: string | null
    recorded_date: string | null
    lab_name: string | null
    created_at: string
}

export interface ShareLink {
    id: string
    patient_id: string
    token_hash: string
    label: string | null
    scopes: string[]
    expires_at: string
    revoked_at: string | null
    created_at: string
}

export interface AccessLogEntry {
    id: string
    share_link_id: string
    accessed_at: string
    outcome: string
}

export interface ExtractionResult {
    document_type: string | null
    provider_name: string | null
    document_date: string | null
    conditions: Array<{
        name: string
        source_text: string | null
        review_status: 'needs_review' | 'confirmed'
    }>
    medications: Array<{
        name: string
        generic_name: string | null
        dose: string | null
        frequency: string | null
        source_text: string | null
        review_status: 'needs_review' | 'confirmed'
    }>
    allergies: Array<{
        substance: string
        reaction: string | null
        severity: string | null
        source_text: string | null
        review_status: 'needs_review' | 'confirmed'
    }>
    lab_results: Array<{
        test_name: string
        value: number | null
        unit: string | null
        reference_range: string | null
        lab_name: string | null
        source_text: string | null
        review_status: 'needs_review' | 'confirmed'
    }>
}

export interface TimelineEntry {
    id: string
    date: string | null
    type: 'condition' | 'medication' | 'allergy' | 'lab_result' | 'document'
    title: string
    details: string
    document_id?: string | null
    provider?: string | null
}
