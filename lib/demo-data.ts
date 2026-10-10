import { ExtractionResult } from './types'

export const DEMO_EXTRACTIONS: Record<string, ExtractionResult> = {
    prescription_1: {
        document_type: 'prescription',
        provider_name: 'Dr. Sarah Johnson - Cardiology Clinic',
        document_date: '2025-08-15',
        conditions: [
            {
                name: 'Hypertension',
                source_text: 'HTN - Stage 1',
                review_status: 'confirmed',
            },
        ],
        medications: [
            {
                name: 'Lisinopril',
                generic_name: 'lisinopril',
                dose: '10mg',
                frequency: 'Once daily',
                source_text: 'Lisinopril 10mg PO QD',
                review_status: 'confirmed',
            },
            {
                name: 'Aspirin',
                generic_name: 'aspirin',
                dose: '81mg',
                frequency: 'Once daily',
                source_text: 'Aspirin 81mg PO QD',
                review_status: 'confirmed',
            },
        ],
        allergies: [],
        lab_results: [],
    },
    lab_report_1: {
        document_type: 'lab_report',
        provider_name: 'City Medical Laboratory',
        document_date: '2025-08-20',
        conditions: [],
        medications: [],
        allergies: [],
        lab_results: [
            {
                test_name: 'Blood Pressure',
                value: 138,
                unit: 'mmHg systolic',
                reference_range: '<120',
                lab_name: 'City Medical Laboratory',
                source_text: 'BP: 138/88 mmHg',
                review_status: 'confirmed',
            },
            {
                test_name: 'Total Cholesterol',
                value: 195,
                unit: 'mg/dL',
                reference_range: '<200',
                lab_name: 'City Medical Laboratory',
                source_text: 'Total Cholesterol: 195 mg/dL',
                review_status: 'confirmed',
            },
            {
                test_name: 'LDL Cholesterol',
                value: 118,
                unit: 'mg/dL',
                reference_range: '<100',
                lab_name: 'City Medical Laboratory',
                source_text: 'LDL: 118 mg/dL',
                review_status: 'confirmed',
            },
        ],
    },
    prescription_2: {
        document_type: 'prescription',
        provider_name: 'Dr. Michael Chen - General Practice',
        document_date: '2025-11-10',
        conditions: [
            {
                name: 'Type 2 Diabetes Mellitus',
                source_text: 'T2DM - controlled',
                review_status: 'confirmed',
            },
        ],
        medications: [
            {
                name: 'Metformin',
                generic_name: 'metformin',
                dose: '500mg',
                frequency: 'Twice daily',
                source_text: 'Metformin 500mg PO BID',
                review_status: 'confirmed',
            },
            {
                name: 'Lisinopril',
                generic_name: 'lisinopril',
                dose: '10mg',
                frequency: 'Once daily',
                source_text: 'Lisinopril 10mg PO QD (continue)',
                review_status: 'confirmed',
            },
        ],
        allergies: [
            {
                substance: 'Penicillin',
                reaction: 'Rash',
                severity: 'Moderate',
                source_text: 'Allergy: Penicillin (rash)',
                review_status: 'confirmed',
            },
        ],
        lab_results: [],
    },
    lab_report_2: {
        document_type: 'lab_report',
        provider_name: 'City Medical Laboratory',
        document_date: '2025-12-01',
        conditions: [],
        medications: [],
        allergies: [],
        lab_results: [
            {
                test_name: 'HbA1c',
                value: 6.8,
                unit: '%',
                reference_range: '<7.0',
                lab_name: 'City Medical Laboratory',
                source_text: 'HbA1c: 6.8%',
                review_status: 'confirmed',
            },
            {
                test_name: 'Fasting Blood Glucose',
                value: 118,
                unit: 'mg/dL',
                reference_range: '70-100',
                lab_name: 'City Medical Laboratory',
                source_text: 'FBG: 118 mg/dL',
                review_status: 'confirmed',
            },
            {
                test_name: 'Blood Pressure',
                value: 128,
                unit: 'mmHg systolic',
                reference_range: '<120',
                lab_name: 'City Medical Laboratory',
                source_text: 'BP: 128/82 mmHg',
                review_status: 'confirmed',
            },
        ],
    },
    discharge_summary: {
        document_type: 'discharge_summary',
        provider_name: 'General Hospital - Emergency Department',
        document_date: '2026-02-14',
        conditions: [
            {
                name: 'Acute Bronchitis',
                source_text: 'Acute bronchitis - resolved',
                review_status: 'confirmed',
            },
        ],
        medications: [
            {
                name: 'Amoxicillin',
                generic_name: 'amoxicillin',
                dose: '500mg',
                frequency: 'Three times daily',
                source_text: 'Amoxicillin 500mg PO TID x 7 days',
                review_status: 'confirmed',
            },
        ],
        allergies: [],
        lab_results: [],
    },
    prescription_3: {
        document_type: 'prescription',
        provider_name: 'Dr. Emily Rodriguez - Endocrinology',
        document_date: '2026-04-22',
        conditions: [
            {
                name: 'Type 2 Diabetes Mellitus',
                source_text: 'T2DM - adjusting treatment',
                review_status: 'confirmed',
            },
            {
                name: 'Hypertension',
                source_text: 'HTN - well controlled',
                review_status: 'confirmed',
            },
        ],
        medications: [
            {
                name: 'Metformin',
                generic_name: 'metformin',
                dose: '1000mg',
                frequency: 'Twice daily',
                source_text: 'Metformin 1000mg PO BID (increased dose)',
                review_status: 'confirmed',
            },
            {
                name: 'Lisinopril',
                generic_name: 'lisinopril',
                dose: '10mg',
                frequency: 'Once daily',
                source_text: 'Lisinopril 10mg PO QD (continue)',
                review_status: 'confirmed',
            },
            {
                name: 'Atorvastatin',
                generic_name: 'atorvastatin',
                dose: '20mg',
                frequency: 'Once daily at bedtime',
                source_text: 'Atorvastatin 20mg PO QHS (new)',
                review_status: 'confirmed',
            },
        ],
        allergies: [],
        lab_results: [],
    },
    lab_report_3: {
        document_type: 'lab_report',
        provider_name: 'City Medical Laboratory',
        document_date: '2026-09-28',
        conditions: [],
        medications: [],
        allergies: [],
        lab_results: [
            {
                test_name: 'HbA1c',
                value: 6.2,
                unit: '%',
                reference_range: '<7.0',
                lab_name: 'City Medical Laboratory',
                source_text: 'HbA1c: 6.2% (improved)',
                review_status: 'confirmed',
            },
            {
                test_name: 'Total Cholesterol',
                value: 172,
                unit: 'mg/dL',
                reference_range: '<200',
                lab_name: 'City Medical Laboratory',
                source_text: 'Total Cholesterol: 172 mg/dL',
                review_status: 'confirmed',
            },
            {
                test_name: 'LDL Cholesterol',
                value: 88,
                unit: 'mg/dL',
                reference_range: '<100',
                lab_name: 'City Medical Laboratory',
                source_text: 'LDL: 88 mg/dL (improved)',
                review_status: 'confirmed',
            },
            {
                test_name: 'Blood Pressure',
                value: 122,
                unit: 'mmHg systolic',
                reference_range: '<120',
                lab_name: 'City Medical Laboratory',
                source_text: 'BP: 122/78 mmHg',
                review_status: 'confirmed',
            },
        ],
    },
}

export function getSimulatedExtraction(filename: string): ExtractionResult | null {
    // Try to match filename patterns to demo data
    if (filename.toLowerCase().includes('prescription') || filename.toLowerCase().includes('rx')) {
        const prescriptions = ['prescription_1', 'prescription_2', 'prescription_3']
        const randomPrescription = prescriptions[Math.floor(Math.random() * prescriptions.length)]
        return DEMO_EXTRACTIONS[randomPrescription]
    }

    if (filename.toLowerCase().includes('lab') || filename.toLowerCase().includes('test')) {
        const labs = ['lab_report_1', 'lab_report_2', 'lab_report_3']
        const randomLab = labs[Math.floor(Math.random() * labs.length)]
        return DEMO_EXTRACTIONS[randomLab]
    }

    if (filename.toLowerCase().includes('discharge') || filename.toLowerCase().includes('summary')) {
        return DEMO_EXTRACTIONS.discharge_summary
    }

    // Default to a random extraction
    const keys = Object.keys(DEMO_EXTRACTIONS)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    return DEMO_EXTRACTIONS[randomKey]
}
