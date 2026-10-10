import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Get session (validates authentication)
        const session = await requireSession();

        // Get patient info
        const { data: patient, error: patientError } = await supabaseAdmin
            .from('patients')
            .select('name, aadhaar_last4, created_at')
            .eq('id', session.patientId)
            .single();

        if (patientError || !patient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        // Get stats - count records for this patient
        const [
            { count: documentsCount },
            { count: conditionsCount },
            { count: medicationsCount },
            { count: allergiesCount },
            { count: labResultsCount },
        ] = await Promise.all([
            supabaseAdmin
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', session.patientId)
                .not('confirmed_at', 'is', null),
            supabaseAdmin
                .from('conditions')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', session.patientId),
            supabaseAdmin
                .from('medications')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', session.patientId),
            supabaseAdmin
                .from('allergies')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', session.patientId),
            supabaseAdmin
                .from('lab_results')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', session.patientId),
        ]);

        return NextResponse.json({
            patient,
            session: {
                role: session.role,
                doctorName: session.doctorName,
            },
            stats: {
                totalDocuments: documentsCount || 0,
                conditions: conditionsCount || 0,
                medications: medicationsCount || 0,
                allergies: allergiesCount || 0,
                labResults: labResultsCount || 0,
            },
        });
    } catch (error: any) {
        console.error('Dashboard error:', error);

        if (error.message === 'Unauthorized: No valid session') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to load dashboard' },
            { status: 500 }
        );
    }
}
