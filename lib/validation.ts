import { z } from 'zod'

export const extractionSchema = z.object({
    document_type: z.string().nullable(),
    provider_name: z.string().nullable(),
    document_date: z.string().nullable(),
    conditions: z.array(
        z.object({
            name: z.string(),
            source_text: z.string().nullable(),
            review_status: z.enum(['needs_review', 'confirmed']),
        })
    ),
    medications: z.array(
        z.object({
            name: z.string(),
            generic_name: z.string().nullable(),
            dose: z.string().nullable(),
            frequency: z.string().nullable(),
            source_text: z.string().nullable(),
            review_status: z.enum(['needs_review', 'confirmed']),
        })
    ),
    allergies: z.array(
        z.object({
            substance: z.string(),
            reaction: z.string().nullable(),
            severity: z.string().nullable(),
            source_text: z.string().nullable(),
            review_status: z.enum(['needs_review', 'confirmed']),
        })
    ),
    lab_results: z.array(
        z.object({
            test_name: z.string(),
            value: z.number().nullable(),
            unit: z.string().nullable(),
            reference_range: z.string().nullable(),
            lab_name: z.string().nullable(),
            source_text: z.string().nullable(),
            review_status: z.enum(['needs_review', 'confirmed']),
        })
    ),
})

export const createShareLinkSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    scopes: z.array(z.string()).min(1, 'At least one scope is required'),
    expires_at: z.string(),
})

export type ExtractionInput = z.infer<typeof extractionSchema>
export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>
