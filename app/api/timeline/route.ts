import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Get session (validates authentication)
        const session = await requireSession();

        // Fetch all medical records from database in parallel
        const [
            { data: conditions, error: condError },
            { data: medications, error: medError },
            { data: allergies, error: allergyError },
            { data: labResults, error: labError },
            { data: documents, error: docError }
        ] = await Promise.all([
            supabaseAdmin
                .from('conditions')
                .select('*')
                .eq('patient_id', session.patientId)
                .order('recorded_date', { ascending: false }),
            supabaseAdmin
                .from('medications')
                .select('*')
                .eq('patient_id', session.patientId)
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
                .order('recorded_date', { ascending: false }),
            supabaseAdmin
                .from('documents')
                .select('id, document_type, provider_name, document_date, confirmed_at')
                .eq('patient_id', session.patientId)
                .not('confirmed_at', 'is', null)
        ]);

        if (condError || medError || allergyError || labError || docError) {
            console.error('Timeline fetch errors:', { condError, medError, allergyError, labError, docError });
            return NextResponse.json(
                { error: 'Failed to fetch timeline data' },
                { status: 500 }
            );
        }

        // Build timeline items from all record types
        const timeline: any[] = [];

        // Add conditions
        (conditions || []).forEach(record => {
            timeline.push({
                id: `condition-${record.id}`,
                date: record.recorded_date || record.created_at,
                type: 'condition',
                title: record.name,
                details: record.source_text || 'No details available',
                status: record.status,
                document_id: record.document_id,
                provider: (documents || []).find(d => d.id === record.document_id)?.provider_name
            });
        });

        // Add medications
        (medications || []).forEach(record => {
            let details = '';
            if (record.dose || record.frequency) {
                details = `${record.dose || ''} ${record.frequency || ''}`.trim();
            }
            if (record.generic_name) {
                details = `(${record.generic_name}) ${details}`;
            }
            if (!details) {
                details = record.source_text || 'No details available';
            }

            timeline.push({
                id: `medication-${record.id}`,
                date: record.start_date || record.created_at,
                type: 'medication',
                title: record.name,
                details,
                status: record.status,
                prescriber: record.prescriber,
                document_id: record.document_id,
                provider: (documents || []).find(d => d.id === record.document_id)?.provider_name
            });
        });

        // Add allergies
        (allergies || []).forEach(record => {
            timeline.push({
                id: `allergy-${record.id}`,
                date: record.created_at,
                type: 'allergy',
                title: `Allergy: ${record.substance}`,
                details: `Reaction: ${record.reaction || 'Unknown'}, Severity: ${record.severity || 'Unknown'}`,
                severity: record.severity,
                document_id: record.document_id,
                provider: (documents || []).find(d => d.id === record.document_id)?.provider_name
            });
        });

        // Add lab results
        (labResults || []).forEach(record => {
            const details = `${record.value || ''} ${record.unit || ''} (Ref: ${record.reference_range || 'N/A'})`.trim();
            timeline.push({
                id: `lab-${record.id}`,
                date: record.recorded_date || record.created_at,
                type: 'lab_result',
                title: record.test_name,
                details,
                lab_name: record.lab_name,
                document_id: record.document_id,
                provider: (documents || []).find(d => d.id === record.document_id)?.provider_name
            });
        });

        // Sort by date descending
        timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({
            success: true,
            timeline,
            counts: {
                conditions: conditions?.length || 0,
                medications: medications?.length || 0,
                allergies: allergies?.length || 0,
                labResults: labResults?.length || 0,
                total: timeline.length
            }
        });
    } catch (error: any) {
        console.error('Timeline error:', error);

        if (error.message === 'Unauthorized: No valid session') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to load timeline' },
            { status: 500 }
        );
    }
}
