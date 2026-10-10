import { createHmac } from 'crypto'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { env } from './env'

// Aadhaar ID utilities
export function validateAadhaarFormat(aadhaar: string): boolean {
    // Must be exactly 12 digits
    return /^\d{12}$/.test(aadhaar)
}

export function createAadhaarHMAC(aadhaar: string): string {
    // Create HMAC-SHA256 of the Aadhaar number
    const hmac = createHmac('sha256', env.AADHAAR_PEPPER)
    hmac.update(aadhaar)
    return hmac.digest('hex')
}

export function getAadhaarLast4(aadhaar: string): string {
    return aadhaar.slice(-4)
}

export function maskAadhaar(last4: string): string {
    return `XXXX XXXX ${last4}`
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long' }
    }
    return { valid: true }
}

// Session JWT utilities
export interface SessionPayload extends JWTPayload {
    role: 'patient' | 'doctor'
    patientId: string
    passwordChangedAt?: string
}

const SECRET_KEY = new TextEncoder().encode(env.SESSION_SECRET)

export async function createSession(payload: SessionPayload, expiresIn: string = '8h'): Promise<string> {
    const jwt = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(SECRET_KEY)

    return jwt
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY)
        return {
            role: payload.role as 'patient' | 'doctor',
            patientId: payload.patientId as string,
            passwordChangedAt: payload.passwordChangedAt as string | undefined,
        }
    } catch (error) {
        return null
    }
}

export function createDoctorSession(patientId: string): Promise<string> {
    return createSession({ role: 'doctor', patientId }, '30m')
}

export function createPatientSession(patientId: string, passwordChangedAt: string): Promise<string> {
    return createSession({ role: 'patient', patientId, passwordChangedAt }, '8h')
}

// Cookie utilities
export const SESSION_COOKIE_NAME = 'caretrail_session'

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
}
