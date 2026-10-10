'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db, DEMO_PATIENT_ID, Document, MedicalRecord, ShareLink } from './supabase-client'

interface AppContextType {
    documents: Document[]
    medicalRecords: MedicalRecord[]
    shareLinks: ShareLink[]
    refreshData: () => void
    addDocument: (doc: Omit<Document, 'id' | 'created_at'>) => Document
    addMedicalRecords: (records: Omit<MedicalRecord, 'id' | 'created_at'>[]) => void
    addShareLink: (link: Omit<ShareLink, 'id' | 'created_at'>) => ShareLink
    revokeShareLink: (id: string) => void
    deleteMedicalRecord: (id: string) => void
    isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [documents, setDocuments] = useState<Document[]>([])
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
    const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const refreshData = () => {
        setDocuments(db.getDocuments(DEMO_PATIENT_ID))
        setMedicalRecords(db.getMedicalRecords(DEMO_PATIENT_ID))
        setShareLinks(db.getShareLinks(DEMO_PATIENT_ID))
    }

    useEffect(() => {
        // Initialize demo data on first load
        db.initializeDemoData()
        refreshData()
        setIsLoading(false)
    }, [])

    const addDocument = (doc: Omit<Document, 'id' | 'created_at'>) => {
        const newDoc = db.addDocument(doc)
        refreshData()
        return newDoc
    }

    const addMedicalRecords = (records: Omit<MedicalRecord, 'id' | 'created_at'>[]) => {
        records.forEach(record => db.addMedicalRecord(record))
        refreshData()
    }

    const addShareLink = (link: Omit<ShareLink, 'id' | 'created_at'>) => {
        const newLink = db.addShareLink(link)
        refreshData()
        return newLink
    }

    const revokeShareLink = (id: string) => {
        db.revokeShareLink(id)
        refreshData()
    }

    const deleteMedicalRecord = (id: string) => {
        db.deleteMedicalRecord(id)
        refreshData()
    }

    return (
        <AppContext.Provider
            value={{
                documents,
                medicalRecords,
                shareLinks,
                refreshData,
                addDocument,
                addMedicalRecords,
                addShareLink,
                revokeShareLink,
                deleteMedicalRecord,
                isLoading,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
