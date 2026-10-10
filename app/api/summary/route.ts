import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Get session (validates authentication)
        const session = await requireSession();

        // Fetch patient info and all medical records
        const [
            { data: patient, error: patientError },
            { data: conditions, error: condError },
            { data: medications, error: medError },
            { data: allergies, error: allergyError },
            { data: labResults, error: labError },
            { data: documents, error: docError }
        ] = await Promise.all([
            supabaseAdmin
                .from('patients')
                .select('name, aadhaar_last4, created_at')
                .eq('id', session.patientId)
                .single(),
            supabaseAdmin
                .from('conditions')
                .select('*')
                .eq('patient_id', session.patientId)
                .eq('status', 'active')
                .order('recorded_date', { ascending: false }),
            supabaseAdmin
                .from('medications')
                .select('*')
                .eq('patient_id', session.patientId)
                .eq('status', 'active')
                .order('start_date', { ascending: false }),
            supabaseAdmin
                .from('allergies')
                .select('*')
                .eq('patient_id', session.patientId)
                .order('created_at', { ascending: false }),
            supabaseAdmin
                .from('lab_results')
                .select('*')
                .eq('patient_id', session.patientId)
                .order('recorded_date', { ascending: false })
                .limit(6), // Get most recent 6 lab results
            supabaseAdmin
                .from('documents')
                .select('id, provider_name, document_date, confirmed_at')
                .eq('patient_id', session.patientId)
                .not('confirmed_at', 'is', null)
        ]);

        if (patientError || condError || medError || allergyError || labError || docError) {
            console.error('Summary fetch errors:', { patientError, condError, medError, allergyError, labError, docError });
            return NextResponse.json(
                { error: 'Failed to fetch summary data' },
                { status: 500 }
            );
        }

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // Format patient info
        const patientInfo = {
            name: patient.name,
            aadhaarLast4: patient.aadhaar_last4,
            lastUpdated: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Format conditions
        const formattedConditions = (conditions || []).map(c => ({
            name: c.name,
            since: c.recorded_date
                ? new Date(c.recorded_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                : 'Unknown',
            status: c.status,
            sourceText: c.source_text
        }));

        // Format medications with provider info
        const formattedMedications = (medications || []).map(m => {
            const doc = (documents || []).find(d => d.id === m.document_id);
            return {
                name: m.name,
                genericName: m.generic_name,
                dose: `${m.dose || ''} ${m.frequency || ''}`.trim(),
                indication: m.source_text || 'General health',
                prescriber: m.prescriber || doc?.provider_name || 'Unknown',
                startDate: m.start_date
                    ? new Date(m.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                    : 'Unknown',
                status: m.status
            };
        });

        // Format allergies
        const formattedAllergies = (allergies || []).map(a => ({
            substance: a.substance,
            reaction: a.reaction || 'Unknown',
            severity: a.severity || 'Unknown',
            documented: new Date(a.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            })
        }));

        // Format lab results
        const formattedLabResults = (labResults || []).map(l => ({
            name: l.test_name,
            value: `${l.value || 'N/A'} ${l.unit || ''}`.trim(),
            reference: l.reference_range || 'N/A',
            date: new Date(l.recorded_date || l.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            labName: l.lab_name
        }));

        return NextResponse.json({
            success: true,
            patient: patientInfo,
            conditions: formattedConditions,
            medications: formattedMedications,
            allergies: formattedAllergies,
            labResults: formattedLabResults,
            counts: {
                conditions: formattedConditions.length,
                medications: formattedMedications.length,
                allergies: formattedAllergies.length,
                labResults: formattedLabResults.length
            }
        });
    } catch (error: any) {
        console.error('Summary error:', error);

        if (error.message === 'Unauthorized: No valid session') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to load summary' },
            { status: 500 }
        );
    }
}
