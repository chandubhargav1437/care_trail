import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { env } from './env';

export interface SessionData {
    patientId: string;
    role: 'patient' | 'doctor';
    doctorName?: string;
    iat: number;
    exp: number;
}

/**
 * Get and verify session from cookies
 * Returns null if no valid session
 */
export async function getSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('caretrail_session');

        if (!sessionCookie?.value) {
            return null;
        }

        // Verify JWT token
        const decoded = jwt.verify(sessionCookie.value, env.SESSION_SECRET) as SessionData;

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Session verification error:', error);
        return null;
    }
}

/**
 * Require a valid session or throw error
 * Use in API routes that need authentication
 */
export async function requireSession(): Promise<SessionData> {
    const session = await getSession();

    if (!session) {
        throw new Error('Unauthorized: No valid session');
    }

    return session;
}

/**
 * Require patient role or throw error
 */
export async function requirePatient(): Promise<SessionData> {
    const session = await requireSession();

    if (session.role !== 'patient') {
        throw new Error('Forbidden: Patient access required');
    }

    return session;
}

/**
 * Check if user has access to patient data
 * Both patients (own data) and doctors (any patient data) have access
 */
export async function requirePatientAccess(patientId: string): Promise<SessionData> {
    const session = await requireSession();

    // Patients can only access their own data
    if (session.role === 'patient' && session.patientId !== patientId) {
        throw new Error('Forbidden: Cannot access other patient data');
    }

    // Doctors can access any patient data (already validated they have correct credentials)
    return session;
}
