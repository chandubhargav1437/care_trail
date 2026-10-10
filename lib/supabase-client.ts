import { createClient } from '@supabase/supabase-js'

// For demo purposes, we'll use localStorage as a simple database
// In production, this would connect to actual Supabase

export interface Patient {
    id: string
    display_name: string
    created_at: string
}

export interface Document {
    id: string
    patient_id: string
    filename: string
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
    type: 'condition' | 'medication' | 'allergy' | 'lab_result'
    data: any
    created_at: string
}

export interface ShareLink {
    id: string
    patient_id: string
    token: string
    token_hash: string
    label: string
    scopes: string[]
    expires_at: string
    revoked_at: string | null
    created_at: string
    access_count: number
}

class LocalStorageDB {
    private getItem<T>(key: string): T[] {
        if (typeof window === 'undefined') return []
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    }

    private setItem<T>(key: string, data: T[]): void {
        if (typeof window === 'undefined') return
        localStorage.setItem(key, JSON.stringify(data))
    }

    // Documents
    getDocuments(patientId: string): Document[] {
        return this.getItem<Document>('documents').filter(d => d.patient_id === patientId)
    }

    addDocument(doc: Omit<Document, 'id' | 'created_at'>): Document {
        const documents = this.getItem<Document>('documents')
        const newDoc: Document = {
            ...doc,
            id: `doc_${Date.now()}`,
            created_at: new Date().toISOString(),
        }
        documents.push(newDoc)
        this.setItem('documents', documents)
        return newDoc
    }

    confirmDocument(docId: string): void {
        const documents = this.getItem<Document>('documents')
        const doc = documents.find(d => d.id === docId)
        if (doc) {
            doc.confirmed_at = new Date().toISOString()
            this.setItem('documents', documents)
        }
    }

    // Medical Records
    getMedicalRecords(patientId: string): MedicalRecord[] {
        return this.getItem<MedicalRecord>('medical_records').filter(r => r.patient_id === patientId)
    }

    addMedicalRecord(record: Omit<MedicalRecord, 'id' | 'created_at'>): MedicalRecord {
        const records = this.getItem<MedicalRecord>('medical_records')
        const newRecord: MedicalRecord = {
            ...record,
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
        }
        records.push(newRecord)
        this.setItem('medical_records', records)
        return newRecord
    }

    deleteMedicalRecord(id: string): void {
        const records = this.getItem<MedicalRecord>('medical_records')
        this.setItem('medical_records', records.filter(r => r.id !== id))
    }

    // Share Links
    getShareLinks(patientId: string): ShareLink[] {
        return this.getItem<ShareLink>('share_links').filter(l => l.patient_id === patientId)
    }

    addShareLink(link: Omit<ShareLink, 'id' | 'created_at'>): ShareLink {
        const links = this.getItem<ShareLink>('share_links')
        const newLink: ShareLink = {
            ...link,
            id: `link_${Date.now()}`,
            created_at: new Date().toISOString(),
        }
        links.push(newLink)
        this.setItem('share_links', links)
        return newLink
    }

    revokeShareLink(id: string): void {
        const links = this.getItem<ShareLink>('share_links')
        const link = links.find(l => l.id === id)
        if (link) {
            link.revoked_at = new Date().toISOString()
            this.setItem('share_links', links)
        }
    }

    getShareLinkByToken(token: string): ShareLink | null {
        const links = this.getItem<ShareLink>('share_links')
        return links.find(l => l.token === token) || null
    }

    incrementShareLinkAccess(id: string): void {
        const links = this.getItem<ShareLink>('share_links')
        const link = links.find(l => l.id === id)
        if (link) {
            link.access_count = (link.access_count || 0) + 1
            this.setItem('share_links', links)
        }
    }

    // Initialize demo data
    initializeDemoData(): void {
        if (typeof window === 'undefined') return

        // Check if already initialized
        if (localStorage.getItem('demo_initialized')) return

        // Clear existing data
        localStorage.removeItem('documents')
        localStorage.removeItem('medical_records')
        localStorage.removeItem('share_links')

        // Mark as initialized
        localStorage.setItem('demo_initialized', 'true')
    }

    // Clear all data
    clearAllData(): void {
        if (typeof window === 'undefined') return
        localStorage.removeItem('documents')
        localStorage.removeItem('medical_records')
        localStorage.removeItem('share_links')
        localStorage.removeItem('demo_initialized')
    }
}

export const db = new LocalStorageDB()

// Demo patient ID (constant for demo purposes)
export const DEMO_PATIENT_ID = 'demo_patient_001'
