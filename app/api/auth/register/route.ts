import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import {
    validateAadhaarFormat,
    createAadhaarHMAC,
    getAadhaarLast4,
    hashPassword,
    validatePassword,
    createPatientSession,
    SESSION_COOKIE_NAME,
    COOKIE_OPTIONS,
} from '@/lib/auth'
import { z } from 'zod'

// Registration schema - updated to match frontend
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    aadhaarNumber: z.string().length(12, 'Health ID must be exactly 12 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Also accept 'aadhaar' for backwards compatibility
        if (body.aadhaar && !body.aadhaarNumber) {
            body.aadhaarNumber = body.aadhaar;
        }

        const validation = registerSchema.safeParse(body)

        if (!validation.success) {
            const firstError = validation.error.errors?.[0]?.message || 'Validation failed';
            return NextResponse.json(
                { error: firstError },
                { status: 400 }
            )
        }

        const { name, aadhaarNumber, password } = validation.data
        const aadhaar = aadhaarNumber; // Use aadhaar internally

        // Validate Aadhaar format
        if (!validateAadhaarFormat(aadhaar)) {
            return NextResponse.json(
                { error: 'Invalid Health ID format. Must be 12 digits.' },
                { status: 400 }
            )
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.error },
                { status: 400 }
            )
        }

        // Create Aadhaar HMAC
        const aadhaarHmac = createAadhaarHMAC(aadhaar)
        const aadhaarLast4 = getAadhaarLast4(aadhaar)

        // Check if Aadhaar already exists
        const { data: existing } = await supabaseAdmin
            .from('patients')
            .select('id')
            .eq('aadhaar_hmac', aadhaarHmac)
            .single()

        if (existing) {
            return NextResponse.json(
                { error: 'This Health ID is already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const passwordHash = await hashPassword(password)

        // Create patient
        const { data: patient, error } = await supabaseAdmin
            .from('patients')
            .insert({
                name,
                aadhaar_hmac: aadhaarHmac,
                aadhaar_last4: aadhaarLast4,
                password_hash: passwordHash,
            })
            .select()
            .single()

        if (error) {
            console.error('Registration error:', error)
            return NextResponse.json(
                { error: 'Registration failed. Please try again.' },
                { status: 500 }
            )
        }

        // Log the registration
        await supabaseAdmin.from('access_log').insert({
            patient_id: patient.id,
            role: 'patient',
            actor_name: name,
            outcome: 'registration_success',
        })

        // Create session
        const session = await createPatientSession(patient.id, patient.password_changed_at)

        // Set cookie
        const response = NextResponse.json({
            success: true,
            patient: {
                id: patient.id,
                name: patient.name,
                aadhaarLast4: patient.aadhaar_last4,
            },
        })

        response.cookies.set(SESSION_COOKIE_NAME, session, {
            ...COOKIE_OPTIONS,
            maxAge: 8 * 60 * 60, // 8 hours
        })

        return response
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}
