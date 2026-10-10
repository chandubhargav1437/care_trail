import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, Patient } from '@/lib/supabase-admin'
import {
    createAadhaarHMAC,
    verifyPassword,
    createPatientSession,
    createDoctorSession,
    SESSION_COOKIE_NAME,
    COOKIE_OPTIONS,
} from '@/lib/auth'
import { z } from 'zod'

// Login schema - updated to match frontend
const loginSchema = z.object({
    aadhaarNumber: z.string().length(12, 'Health ID must be exactly 12 digits'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['patient', 'doctor']),
    doctorName: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Accept both aadhaar and aadhaarNumber for backwards compatibility
        if (body.aadhaar && !body.aadhaarNumber) {
            body.aadhaarNumber = body.aadhaar;
        }

        const validation = loginSchema.safeParse(body)

        if (!validation.success) {
            const firstError = validation.error.errors?.[0]?.message || 'Validation failed';
            return NextResponse.json(
                { error: firstError },
                { status: 400 }
            )
        }

        const { aadhaarNumber, password, role, doctorName } = validation.data
        const aadhaar = aadhaarNumber; // Use internally
        const actorName = doctorName; // Map to internal name

        // Create Aadhaar HMAC
        const aadhaarHmac = createAadhaarHMAC(aadhaar)

        // Find patient by Aadhaar HMAC
        const { data: patient, error: findError } = await supabaseAdmin
            .from('patients')
            .select('*')
            .eq('aadhaar_hmac', aadhaarHmac)
            .single()

        // Generic error message for security
        const genericError = 'Invalid Health ID or password'

        if (findError || !patient) {
            // Log failed attempt (unknown ID)
            await supabaseAdmin.from('access_log').insert({
                patient_id: null,
                role,
                actor_name: actorName || null,
                outcome: 'login_failed_unknown_id',
            })

            return NextResponse.json({ error: genericError }, { status: 401 })
        }

        // Check if account is locked
        if (patient.locked_until) {
            const lockExpiry = new Date(patient.locked_until)
            if (lockExpiry > new Date()) {
                await supabaseAdmin.from('access_log').insert({
                    patient_id: patient.id,
                    role,
                    actor_name: actorName || null,
                    outcome: 'login_failed_locked',
                })

                return NextResponse.json(
                    {
                        error: 'Account temporarily locked due to too many failed attempts. Please try again later.',
                    },
                    { status: 403 }
                )
            } else {
                // Lock has expired, reset failed attempts
                await supabaseAdmin
                    .from('patients')
                    .update({ failed_attempts: 0, locked_until: null })
                    .eq('id', patient.id)
            }
        }

        // Verify password
        const isValid = await verifyPassword(password, patient.password_hash)

        if (!isValid) {
            // Increment failed attempts
            const newFailedAttempts = (patient.failed_attempts || 0) + 1
            const updates: Partial<Patient> = {
                failed_attempts: newFailedAttempts,
            }

            // Lock account after 5 failed attempts
            if (newFailedAttempts >= 5) {
                const lockUntil = new Date()
                lockUntil.setMinutes(lockUntil.getMinutes() + 15)
                updates.locked_until = lockUntil.toISOString()
            }

            await supabaseAdmin
                .from('patients')
                .update(updates)
                .eq('id', patient.id)

            await supabaseAdmin.from('access_log').insert({
                patient_id: patient.id,
                role,
                actor_name: actorName || null,
                outcome: 'login_failed_wrong_password',
            })

            return NextResponse.json({ error: genericError }, { status: 401 })
        }

        // Password is correct - reset failed attempts
        await supabaseAdmin
            .from('patients')
            .update({ failed_attempts: 0, locked_until: null })
            .eq('id', patient.id)

        // Log successful login
        await supabaseAdmin.from('access_log').insert({
            patient_id: patient.id,
            role,
            actor_name: actorName || patient.name,
            outcome: 'login_success',
        })

        // Create appropriate session
        const session =
            role === 'doctor'
                ? await createDoctorSession(patient.id)
                : await createPatientSession(patient.id, patient.password_changed_at)

        // Set cookie
        const response = NextResponse.json({
            success: true,
            role,
            patient: {
                id: patient.id,
                name: patient.name,
                aadhaarLast4: patient.aadhaar_last4,
            },
        })

        response.cookies.set(SESSION_COOKIE_NAME, session, {
            ...COOKIE_OPTIONS,
            maxAge: role === 'doctor' ? 30 * 60 : 8 * 60 * 60, // 30 min for doctor, 8 hours for patient
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        )
    }
}
