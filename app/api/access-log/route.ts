import { NextResponse } from 'next/server';
import { requirePatient } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Only patients can view their own access log
        const session = await requirePatient();

        // Get access log entries for this patient
        const { data: logs, error } = await supabaseAdmin
            .from('access_log')
            .select('id, role, actor_name, outcome, accessed_at')
            .eq('patient_id', session.patientId)
            .order('accessed_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Access log query error:', error);
            return NextResponse.json(
                { error: 'Failed to load access log' },
                { status: 500 }
            );
        }

        return NextResponse.json({ logs: logs || [] });
    } catch (error: any) {
        console.error('Access log error:', error);

        if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json(
            { error: 'Failed to load access log' },
            { status: 500 }
        );
    }
}
