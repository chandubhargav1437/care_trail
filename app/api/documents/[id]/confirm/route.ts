import { NextRequest, NextResponse } from 'next/server';
import { requirePatient } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only patients can confirm their own documents
        const session = await requirePatient();
        const { id: documentId } = await params;

        const body = await request.json();
        const { extraction } = body;

        if (!extraction) {
            return NextResponse.json(
                { error: 'Extraction data is required' },
                { status: 400 }
            );
        }

        // Get the document to verify ownership
        const { data: document, error: docError } = await supabaseAdmin
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('patient_id', session.patientId)
            .single();

        if (docError || !document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (document.confirmed_at) {
            return NextResponse.json(
                { error: 'Document already confirmed' },
                { status: 400 }
            );
        }

        // Update document as confirmed
        const { error: updateError } = await supabaseAdmin
            .from('documents')
            .update({
                extraction_json: extraction,
                confirmed_at: new Date().toISOString(),
            })
            .eq('id', documentId);

        if (updateError) {
            console.error('Document update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to confirm document' },
                { status: 500 }
            );
        }

        // Insert conditions (check for duplicates first)
        if (extraction.conditions && extraction.conditions.length > 0) {
            // Fetch existing active conditions
            const { data: existingConditions } = await supabaseAdmin
                .from('conditions')
                .select('name')
                .eq('patient_id', session.patientId)
                .eq('status', 'active');

            const existingConditionNames = new Set(
                (existingConditions || []).map(c => c.name.toLowerCase().trim())
            );

            // Only insert new conditions that don't exist
            const newConditions = extraction.conditions
                .filter((c: any) => !existingConditionNames.has(c.name.toLowerCase().trim()))
                .map((c: any) => ({
                    patient_id: session.patientId,
                    document_id: documentId,
                    name: c.name,
                    recorded_date: c.recorded_date || extraction.document_date,
                    status: c.status || 'active',
                    source_text: c.source_text,
                }));

            if (newConditions.length > 0) {
                const { error: condError } = await supabaseAdmin
                    .from('conditions')
                    .insert(newConditions);

                if (condError) {
                    console.error('Conditions insert error:', condError);
                }
            }
        }

        // Insert medications (intelligent duplicate handling)
        if (extraction.medications && extraction.medications.length > 0) {
            // Fetch existing active medications
            const { data: existingMedications } = await supabaseAdmin
                .from('medications')
                .select('id, name, dose, frequency')
                .eq('patient_id', session.patientId)
                .eq('status', 'active');

            const existingMedMap = new Map(
                (existingMedications || []).map(m => [
                    m.name.toLowerCase().trim(),
                    { id: m.id, dose: m.dose, frequency: m.frequency }
                ])
            );

            const medicationsToInsert: any[] = [];
            const medicationsToDiscontinue: string[] = [];

            for (const m of extraction.medications) {
                const medKey = m.name.toLowerCase().trim();
                const existing = existingMedMap.get(medKey);

                if (existing) {
                    // Medication exists - check if dose/frequency changed
                    const doseSame = (existing.dose || '').toLowerCase().trim() === (m.dose || '').toLowerCase().trim();
                    const freqSame = (existing.frequency || '').toLowerCase().trim() === (m.frequency || '').toLowerCase().trim();

                    if (!doseSame || !freqSame) {
                        // Dose or frequency changed - discontinue old and add new
                        medicationsToDiscontinue.push(existing.id);
                        medicationsToInsert.push({
                            patient_id: session.patientId,
                            document_id: documentId,
                            name: m.name,
                            generic_name: m.generic_name,
                            dose: m.dose,
                            frequency: m.frequency,
                            start_date: m.start_date || extraction.document_date,
                            prescriber: m.prescriber || extraction.provider_name,
                            status: 'active',
                            source_text: m.source_text,
                        });
                    }
                    // If same dose/frequency, skip (already exists)
                } else {
                    // New medication - add it
                    medicationsToInsert.push({
                        patient_id: session.patientId,
                        document_id: documentId,
                        name: m.name,
                        generic_name: m.generic_name,
                        dose: m.dose,
                        frequency: m.frequency,
                        start_date: m.start_date || extraction.document_date,
                        prescriber: m.prescriber || extraction.provider_name,
                        status: 'active',
                        source_text: m.source_text,
                    });
                }
            }

            // Discontinue old medications (dose/frequency changed)
            if (medicationsToDiscontinue.length > 0) {
                await supabaseAdmin
                    .from('medications')
                    .update({
                        status: 'discontinued',
                        end_date: extraction.document_date || new Date().toISOString().split('T')[0]
                    })
                    .in('id', medicationsToDiscontinue);
            }

            // Insert new medications
            if (medicationsToInsert.length > 0) {
                const { error: medError } = await supabaseAdmin
                    .from('medications')
                    .insert(medicationsToInsert);

                if (medError) {
                    console.error('Medications insert error:', medError);
                }
            }
        }

        // Insert allergies (check for duplicates first)
        if (extraction.allergies && extraction.allergies.length > 0) {
            // Fetch existing allergies
            const { data: existingAllergies } = await supabaseAdmin
                .from('allergies')
                .select('substance')
                .eq('patient_id', session.patientId);

            const existingAllergySubstances = new Set(
                (existingAllergies || []).map(a => a.substance.toLowerCase().trim())
            );

            // Only insert new allergies that don't exist
            const newAllergies = extraction.allergies
                .filter((a: any) => !existingAllergySubstances.has(a.substance.toLowerCase().trim()))
                .map((a: any) => ({
                    patient_id: session.patientId,
                    document_id: documentId,
                    substance: a.substance,
                    reaction: a.reaction,
                    severity: a.severity,
                    source_text: a.source_text,
                }));

            if (newAllergies.length > 0) {
                const { error: allergyError } = await supabaseAdmin
                    .from('allergies')
                    .insert(newAllergies);

                if (allergyError) {
                    console.error('Allergies insert error:', allergyError);
                }
            }
        }

        // Insert lab results (always add - they're timestamped historical data)
        if (extraction.lab_results && extraction.lab_results.length > 0) {
            const labResults = extraction.lab_results.map((l: any) => ({
                patient_id: session.patientId,
                document_id: documentId,
                test_name: l.test_name,
                value: l.value,
                unit: l.unit,
                reference_range: l.reference_range,
                recorded_date: l.recorded_date || extraction.document_date,
                lab_name: l.lab_name || extraction.provider_name,
            }));

            const { error: labError } = await supabaseAdmin
                .from('lab_results')
                .insert(labResults);

            if (labError) {
                console.error('Lab results insert error:', labError);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Document confirmed and data saved to timeline',
            details: {
                duplicatesSkipped: true,
                info: 'Duplicate medications, conditions, and allergies were automatically handled'
            }
        });
    } catch (error: any) {
        console.error('Confirm document error:', error);

        if (
            error.message?.includes('Forbidden') ||
            error.message?.includes('Unauthorized')
        ) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to confirm document' },
            { status: 500 }
        );
    }
}
